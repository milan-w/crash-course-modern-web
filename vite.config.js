// Vite-Konfiguration für die Übungen – mit eingebauter Beispiel-API.
//
// Diese Datei ist die Vorlage. `pnpm sync` kopiert sie in die Schritte ab 03,
// damit jeder Schritt auch allein (z. B. in StackBlitz) läuft.
//
// Der Dev-Server beantwortet /api/v1/… selbst mit Beispieldaten aus demo-api.js. Für die App sieht das aus wie
// eine echte API: Sie holt die Daten per fetch, im Network-Tab sieht man Anfrage und JSON-Antwort.
import { defineConfig, searchForWorkspaceRoot } from "vite";
import { findStopPlaces, findTrips } from "./demo-api.js";

function demoApi() {
  const sendJson = (res, status, data) => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(data));
  };

  const middleware = (req, res, next) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (!url.pathname.startsWith("/api/")) return next();
    const params = url.searchParams;

    if (url.pathname === "/api/v1/stop-places") {
      return sendJson(res, 200, findStopPlaces(params.get("query") ?? "", Number(params.get("limit") ?? 10)));
    }
    if (url.pathname === "/api/v1/trips") {
      if (!params.get("from") || !params.get("to")) {
        return sendJson(res, 400, { message: "Bitte Start und Ziel angeben (from, to)." });
      }
      return sendJson(
        res,
        200,
        findTrips({
          from: params.get("from"),
          to: params.get("to"),
          departureTime: params.get("departureTime") ?? undefined,
          arrivalTime: params.get("arrivalTime") ?? undefined,
          direct: params.get("direct") === "true",
        }),
      );
    }
    return sendJson(res, 404, { message: "Diesen Endpunkt gibt es nicht." });
  };

  return {
    name: "demo-api",
    configureServer: (server) => void server.middlewares.use(middleware),
    configurePreviewServer: (server) => void server.middlewares.use(middleware),
  };
}

export default defineConfig({
  plugins: [demoApi()],
  server: {
    port: 5173,
    // Jeder Schritt enthält eine pnpm-workspace.yaml (für StackBlitz). Ohne diese Zeile hielte Vite den
    // Schritt-Ordner für die Projektwurzel und sperrte z. B. die DB-Fonts aus exercises/node_modules.
    // Maßgeblich ist daher der Ordner, in dem `pnpm dev` läuft: lokal exercises/, in StackBlitz der Schritt.
    fs: { allow: [searchForWorkspaceRoot(process.cwd())] },
  },
  preview: { port: 4173 },
  build: {
    // Vite 8 minifiziert CSS standardmäßig mit LightningCSS, das moderne
    // Features wie light-dark() aus DB UX falsch umschreibt (siehe DB-UX-README).
    cssMinify: "esbuild",
  },
});
