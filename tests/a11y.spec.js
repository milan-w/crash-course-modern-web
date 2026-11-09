// Barrierefreiheits- und Qualitäts-Checks, die für JEDEN Übungsstand laufen.
// Tests für Funktionen, die es erst ab Block 4 gibt, werden vorher übersprungen.
import { AxeBuilder } from "@axe-core/playwright";
import { test as base, expect } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { mockApi } from "./fixtures/api.js";

const exercisesDir = fileURLToPath(new URL("..", import.meta.url));

/** Startet pro Worker einen Vite-Dev-Server für den Schritt des Projekts. */
const test = base.extend({
  stepName: ["app", { option: true, scope: "worker" }],
  stepUrl: [
    async ({ stepName }, use) => {
      const root = stepName === "app" ? `${exercisesDir}app` : `${exercisesDir}steps/${stepName}`;
      const server = await createServer({
        configFile: `${exercisesDir}vite.config.js`,
        root,
        server: { port: 0 },
        logLevel: "error",
      });
      await server.listen();
      await use(server.resolvedUrls.local[0]);
      await server.close();
    },
    { scope: "worker" },
  ],
  // relative page.goto("/…") gegen den Server dieses Schritts
  baseURL: async ({ stepUrl }, use) => use(stepUrl),
});

/** WCAG 2.2 AA – das ist auch das Ziel von BFSG / EN 301 549 */
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function expectNoAxeViolations(page) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  // Lesbare Fehlermeldung: Regel, Auswirkung und betroffene Elemente
  const summary = violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help}\n  → ${v.nodes.map((n) => n.target.join(" ")).join("\n  → ")}`,
  );
  expect(summary, "axe hat Barrierefreiheits-Probleme gefunden").toEqual([]);
}

/** Wartet, bis die DB-Komponenten gerendert sind */
async function gotoApp(page, path = "/") {
  await page.goto(path);
  await page.waitForFunction(() =>
    [...document.querySelectorAll("*")].every(
      (el) => !el.tagName.startsWith("DB-") || el.classList.contains("hydrated"),
    ),
  );
}

// Hinweis: DB-Komponenten bringen eigene role="status"-Elemente mit – daher gezielt #status prüfen.
const hasLiveSearch = (page) =>
  page
    .locator("#status")
    .count()
    .then((n) => n > 0);

test.describe("Barrierefreiheit", () => {
  test("Startseite hat keine axe-Verstöße", async ({ page }) => {
    await mockApi(page);
    await gotoApp(page);
    await expectNoAxeViolations(page);
  });

  test("Es gibt genau eine h1 und ein main-Landmark", async ({ page }) => {
    await gotoApp(page);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
  });

  test("Formularfelder sind über ihr Label erreichbar", async ({ page }) => {
    await gotoApp(page);
    test.skip((await page.getByLabel("Nach", { exact: true }).count()) === 0, "„Nach“ ist Teil von Übung 1");
    await expect(page.getByLabel("Von", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Nach", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Start und Ziel tauschen" })).toBeVisible();
  });

  test("Ergebnisse haben keine axe-Verstöße", async ({ page }) => {
    await mockApi(page);
    await gotoApp(page, "/?from=Frankfurt(Main)Hbf&to=K%C3%B6ln+Hbf&anchor=departure&datetime=2026-11-05T08:00");
    test.skip(!(await hasLiveSearch(page)), "Live-Suche gibt es erst ab Block 4");
    await expect(page.locator("#status")).toHaveText(/Verbindungen gefunden/);
    await expectNoAxeViolations(page);
  });
});

test.describe("Verbindungssuche", () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page);
    test.skip(!(await hasLiveSearch(page)), "Live-Suche gibt es erst ab Block 4");
  });

  test("Suche per Tastatur: Ergebnisse werden angesagt und fokussiert", async ({ page }) => {
    await mockApi(page);
    await page.getByLabel("Von", { exact: true }).fill("Frankfurt(Main)Hbf");
    await page.getByLabel("Nach", { exact: true }).fill("Köln Hbf");
    await page.getByLabel("Nach", { exact: true }).press("Enter");

    await expect(page.locator("#status")).toHaveText("2 Verbindungen gefunden.");
    await expect(page.getByRole("heading", { level: 2, name: /Verbindungen von/ })).toBeFocused();
    await expect(page.locator(".trip-list > li")).toHaveCount(2);
    await expect(page).toHaveURL(/from=Frankfurt/);
  });

  test("Fehler der Verbindungssuche wird angesagt", async ({ page }) => {
    await mockApi(page, { fail: true });
    await page.getByLabel("Von", { exact: true }).fill("Frankfurt(Main)Hbf");
    await page.getByLabel("Nach", { exact: true }).fill("Köln Hbf");
    await page.getByRole("button", { name: "Verbindungen suchen" }).click();
    await expect(page.locator("#status")).toHaveText(/fehlgeschlagen/);
  });
});

test.describe("Security", () => {
  test("Eingaben aus der URL werden nicht als HTML ausgeführt (XSS)", async ({ page }) => {
    let dialogOpened = false;
    page.on("dialog", (dialog) => {
      dialogOpened = true;
      return dialog.dismiss();
    });
    await mockApi(page);
    const payload = encodeURIComponent("<img src=x onerror=alert(document.domain)>");
    await gotoApp(page, `/?from=${payload}&to=K%C3%B6ln&datetime=2026-11-05T08:00`);
    test.skip(!(await hasLiveSearch(page)), "Live-Suche gibt es erst ab Block 4");

    await expect(page.getByRole("heading", { level: 2, name: /Verbindungen von/ })).toContainText("<img");
    await expect(page.locator("#results-heading img")).toHaveCount(0);
    expect(dialogOpened, "alert() wurde ausgeführt – XSS!").toBe(false);
  });

  test("Keine Zugangsdaten im ausgelieferten Code", async ({ page }) => {
    const bodies = [];
    page.on("response", async (response) => {
      if (/\.(js|html)(\?|$)|\/$/.test(response.url())) bodies.push(await response.text().catch(() => ""));
    });
    await gotoApp(page);
    const leaked = bodies.filter((body) => /api[-_]?key|client[-_]?secret/i.test(body));
    expect(leaked).toEqual([]);
  });
});
