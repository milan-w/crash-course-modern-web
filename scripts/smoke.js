#!/usr/bin/env node
// Setup-Check vor dem Workshop:
//
//   pnpm smoke
//
// Startet kurz den Vite-Dev-Server, fragt die Beispiel-API nach Bahnhöfen und Verbindungen und beendet sich
// wieder. Exit-Code 0 = alles bereit.
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const exercisesDir = fileURLToPath(new URL("..", import.meta.url));

const ok = (msg) => console.log(`✅ ${msg}`);
const fail = (msg) => {
  console.error(`❌ ${msg}`);
  process.exitCode = 1;
};

const server = await createServer({
  configFile: `${exercisesDir}/vite.config.js`,
  root: `${exercisesDir}/steps/uebung-1`,
  server: { port: 0 },
  logLevel: "silent",
});
await server.listen();
const base = server.resolvedUrls.local[0].replace(/\/$/, "");

async function getJson(path, params) {
  const res = await fetch(`${base}${path}?${new URLSearchParams(params)}`);
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

try {
  console.log(`Teste die Beispiel-API (${base}) …\n`);

  const stations = await getJson("/api/v1/stop-places", { query: "Frankfurt", limit: "5" });
  const frankfurt = stations.body.stopPlaces?.[0];
  if (stations.status !== 200 || !frankfurt?.evaNumber) {
    fail(`Bahnhofssuche antwortet mit HTTP ${stations.status}.`);
  } else {
    ok(`Bahnhofssuche: „${frankfurt.name}“ (EVA ${frankfurt.evaNumber})`);

    const trips = await getJson("/api/v1/trips", {
      from: frankfurt.evaNumber,
      to: "8000207",
      departureTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });
    const count = trips.body.trips?.length ?? 0;
    if (trips.status !== 200 || count === 0) fail(`Verbindungssuche antwortet mit HTTP ${trips.status}.`);
    else ok(`Verbindungssuche: ${count} Verbindungen Frankfurt → Köln gefunden`);
  }
} catch (error) {
  fail(`Netzwerkfehler: ${error.message}`);
} finally {
  await server.close();
}

console.log(
  process.exitCode ? "\nSetup noch nicht vollständig – siehe Meldungen oben." : "\n🚆 Alles bereit für den Workshop!",
);
