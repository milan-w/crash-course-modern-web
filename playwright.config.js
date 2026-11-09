// Playwright: Barrierefreiheits- & Qualitäts-Checks für alle Übungsstände.
//
//   pnpm test:a11y                        → alle Schritte + app/
//   pnpm test:a11y --project=app          → nur eure Arbeitskopie
//   pnpm test:a11y --project=04-js        → nur Schritt 04 (hat absichtlich Fehler!)
//
// Browser einmalig installieren: pnpm test:install
import { defineConfig, devices } from "@playwright/test";
import { existsSync, readdirSync } from "node:fs";

const steps = readdirSync(new URL("./steps", import.meta.url)).filter((name) => /^\d\d-/.test(name));
const roots = existsSync(new URL("./app", import.meta.url)) ? [...steps, "app"] : steps;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  reporter: [["list"]],
  use: { ...devices["Desktop Chrome"], locale: "de-DE", timezoneId: "Europe/Berlin" },
  projects: roots.map((name) => ({ name, use: { stepName: name } })),
});
