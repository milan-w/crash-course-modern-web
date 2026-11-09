#!/usr/bin/env node
// Macht jeden Schritt in steps/ eigenständig lauffähig – z. B. als eigenes StackBlitz-Projekt.
//
//   pnpm sync          → erzeugt bzw. aktualisiert die Dateien in allen Schritten
//   pnpm sync:check    → prüft nur, ob alles aktuell ist (Exit-Code 1, falls nicht)
//
// Quelle der Wahrheit sind die Dateien in exercises/ (package.json, vite.config.js, …).
// In den Schritten bitte NICHT von Hand ändern – sie werden überschrieben.
// Zusätzlich wird geprüft, dass keine interne Registry (Artifactory, .npmrc) im Projekt steht.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync } from "node:fs";

const exercisesDir = fileURLToPath(new URL("..", import.meta.url));
const stepsDir = path.join(exercisesDir, "steps");
const check = process.argv.includes("--check");

const rootPackage = JSON.parse(await readFile(path.join(exercisesDir, "package.json"), "utf8"));
const pick = (deps, names) => Object.fromEntries(names.map((name) => [name, deps[name]]));

const ESLINT_DEPS = ["@angular-eslint/template-parser", "@db-ux/core-eslint-plugin", "@eslint/js", "eslint", "globals"];

/** Was braucht ein Stand? Ab Übung 4 die Beispiel-API und den Linter (XSS-Teil von Block 4), ebenso demo-fehler. */
const needs = (step) => {
  const number = step === "demo-fehler" ? 4 : Number(step.replace("uebung-", ""));
  return { api: number >= 4, lint: number >= 4 };
};

function packageJson(step) {
  const { api, lint } = needs(step);
  return {
    name: `verbindungssuche-${step}`,
    private: true,
    type: "module",
    description: `Crash Course Modern (DB) Web – Übungsstand ${step}. Erzeugt von scripts/sync-steps.js.`,
    scripts: {
      dev: "vite",
      build: "vite build",
      ...(lint && { lint: "eslint ." }),
    },
    dependencies: rootPackage.dependencies,
    devDependencies: {
      vite: rootPackage.devDependencies.vite,
      ...(api && { esbuild: rootPackage.devDependencies.esbuild }),
      ...(lint && pick(rootPackage.devDependencies, ESLINT_DEPS)),
    },
  };
}

/** Dateien, die 1:1 aus exercises/ kopiert werden */
const copies = (step) => {
  const { api, lint } = needs(step);
  return [
    // pnpm-Einstellungen (allowBuilds, minimumReleaseAge) – damit `pnpm install` auch im einzelnen Schritt klappt
    "pnpm-workspace.yaml",
    ...(api ? ["vite.config.js", "demo-api.js"] : []),
    ...(lint ? ["eslint.config.js"] : []),
  ];
};

const steps = readdirSync(stepsDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name);
const outdated = [];

for (const step of steps) {
  const files = new Map([["package.json", `${JSON.stringify(packageJson(step), null, 2)}\n`]]);
  for (const name of copies(step)) files.set(name, await readFile(path.join(exercisesDir, name), "utf8"));

  for (const [name, content] of files) {
    const target = path.join(stepsDir, step, name);
    const current = await readFile(target, "utf8").catch(() => null);
    if (current === content) continue;
    outdated.push(path.relative(exercisesDir, target));
    if (!check) await writeFile(target, content);
  }
}

if (check && outdated.length) {
  console.error(`❌ Nicht aktuell (bitte \`pnpm sync\` ausführen):\n  ${outdated.join("\n  ")}`);
  process.exit(1);
}

// exercises/ wird öffentlich gespiegelt (StackBlitz) – interne Registries und interne APIs dürfen dort nirgends
// auftauchen. Die Einrichtung von Artifactory und das API Portal stehen deshalb nur in den (internen) Folien.
const INTERNAL = /artifactory|\.rz\.db\.de|\.hub\.db\.de|\bRIS\b|RIS_/i;
const self = fileURLToPath(import.meta.url);
const leaks = [];
async function scan(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", "app", ".backup", "dist", "test-results", "playwright-report"].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await scan(file);
    else if (file !== self && (entry.name === ".npmrc" || INTERNAL.test(await readFile(file, "utf8")))) {
      leaks.push(path.relative(exercisesDir, file));
    }
  }
}
await scan(exercisesDir);
if (leaks.length) {
  console.error(
    `❌ Interne Registry- bzw. API-Angaben gefunden (dürfen nicht in den öffentlichen Spiegel):\n  ${leaks.join("\n  ")}`,
  );
  process.exit(1);
}
console.log(outdated.length ? `✅ Aktualisiert:\n  ${outdated.join("\n  ")}` : "✅ Alle Schritte sind aktuell.");
