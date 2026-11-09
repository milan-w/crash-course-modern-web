#!/usr/bin/env node
// Kleines CLI rund um die Übungsschritte.
//
//   pnpm dev            → startet eure Arbeitskopie (app/)
//   pnpm dev 03         → startet die Lösung von Schritt 03 (zum Vergleichen)
//   pnpm step 02        → kopiert Schritt 02 nach app/ (Aufholen, wenn man hängt)
//   pnpm build [NN]     → baut app/ bzw. Schritt NN nach dist/
//   pnpm preview [NN]   → baut und startet den Produktions-Build
//   pnpm build:all      → baut alle Schritte (Kontrolle für Moderator:innen)
import { cp, mkdir, readdir, rename, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build, createServer, preview } from "vite";

const exercisesDir = fileURLToPath(new URL("..", import.meta.url));
const stepsDir = path.join(exercisesDir, "steps");
const appDir = path.join(exercisesDir, "app");
const configFile = path.join(exercisesDir, "vite.config.js");

const exists = (p) =>
  stat(p).then(
    () => true,
    () => false,
  );

async function listSteps() {
  const entries = await readdir(stepsDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && /^\d\d-/.test(e.name))
    .map((e) => e.name)
    .sort();
}

/** "3", "03" oder "03-css" → absoluter Pfad des Schritts */
async function resolveStep(arg) {
  const steps = await listSteps();
  const wanted = String(arg).padStart(2, "0");
  const match = steps.find((s) => s === arg || s.startsWith(`${wanted}-`));
  if (!match) {
    console.error(`❌ Schritt „${arg}“ gibt es nicht. Verfügbar: ${steps.join(", ")}`);
    process.exit(1);
  }
  return path.join(stepsDir, match);
}

/** Legt app/ beim ersten Start aus 00-start an. */
async function ensureApp() {
  if (await exists(appDir)) return;
  await cp(await resolveStep("00"), appDir, { recursive: true });
  console.log("📁 app/ wurde aus steps/00-start angelegt – hier arbeitet ihr.");
}

async function rootFor(arg) {
  if (arg === undefined || arg === "app") {
    await ensureApp();
    return appDir;
  }
  return resolveStep(arg);
}

async function checkout(arg) {
  if (arg === undefined) {
    console.error("Bitte Schritt angeben, z. B.: pnpm step 02");
    process.exit(1);
  }
  const source = await resolveStep(arg);
  if (await exists(appDir)) {
    const backup = path.join(exercisesDir, ".backup", `app-${new Date().toISOString().replace(/[:.]/g, "-")}`);
    await mkdir(path.dirname(backup), { recursive: true });
    await rename(appDir, backup);
    console.log(`💾 Bisheriges app/ gesichert unter ${path.relative(exercisesDir, backup)}`);
  }
  await cp(source, appDir, { recursive: true });
  console.log(`✅ app/ enthält jetzt ${path.basename(source)}. Weiter mit: pnpm dev`);
}

// Inline-Optionen ergänzen vite.config.js – so bleibt die Config schlicht.
// Lokal nutzen alle Schritte die gemeinsame vite.config.js; die Kopien in steps/ (siehe `pnpm sync`)
// sind für StackBlitz gedacht und inhaltlich identisch.

const viteOptions = (root, outDir) => ({
  configFile,
  root,
  ...(outDir && { build: { outDir, emptyOutDir: true } }),
});

const [command, arg] = process.argv.slice(2);

switch (command) {
  case "dev": {
    const server = await createServer(viteOptions(await rootFor(arg)));
    await server.listen();
    server.printUrls();
    server.bindCLIShortcuts({ print: true });
    break;
  }
  case "build": {
    const root = await rootFor(arg);
    await build(viteOptions(root, path.join(exercisesDir, "dist", path.basename(root))));
    break;
  }
  case "preview": {
    const root = await rootFor(arg);
    const outDir = path.join(exercisesDir, "dist", path.basename(root));
    await build(viteOptions(root, outDir));
    const server = await preview(viteOptions(root, outDir));
    server.printUrls();
    break;
  }
  case "build-all": {
    for (const step of await listSteps()) {
      const root = path.join(stepsDir, step);
      console.log(`\n▶ ${step}`);
      await build({ ...viteOptions(root, path.join(exercisesDir, "dist", step)), logLevel: "warn" });
    }
    console.log("\n✅ Alle Schritte gebaut.");
    break;
  }
  case "checkout":
    await checkout(arg);
    break;
  default:
    console.error(`Unbekannter Befehl „${command}“. Siehe Kopf von scripts/step.js.`);
    process.exit(1);
}
