// Test-Fixtures in der Form der Beispiel-API (siehe demo-api.js).
// Werden NUR in Playwright-Tests per page.route() eingespielt – so sind die Tests unabhängig von der Uhrzeit.

const STATIONS = [
  { evaNumber: "8000105", name: "Frankfurt(Main)Hbf" },
  { evaNumber: "8098105", name: "Frankfurt(Main)Hbf (tief)" },
  { evaNumber: "8000207", name: "Köln Hbf" },
  { evaNumber: "8011160", name: "Berlin Hbf" },
];

export function stopPlacesResponse(query) {
  const q = query.toLowerCase();
  return { stopPlaces: STATIONS.filter((s) => s.name.toLowerCase().includes(q)) };
}

const stop = (evaNumber, name) => ({ evaNumber, name });

function leg(from, to, dep, arr, transport, platform = "7") {
  return {
    transport,
    duration: "PT1H",
    departure: { stopPlace: from, time: dep, platform },
    arrival: { stopPlace: to, time: arr },
  };
}

export function tripsResponse() {
  const ffm = stop("8000105", "Frankfurt(Main)Hbf");
  const koe = stop("8000207", "Köln Hbf");
  const kob = stop("8000206", "Koblenz Hbf");
  return {
    trips: [
      {
        id: "trip-1",
        duration: "PT1H4M",
        legs: [leg(ffm, koe, "2026-11-05T08:13:00+01:00", "2026-11-05T09:17:00+01:00", "ICE 123")],
      },
      {
        id: "trip-2",
        duration: "PT2H15M",
        legs: [
          leg(ffm, kob, "2026-11-05T08:29:00+01:00", "2026-11-05T09:30:00+01:00", "RE 2"),
          leg(kob, koe, "2026-11-05T09:40:00+01:00", "2026-11-05T10:44:00+01:00", "IC 2025", "2"),
        ],
      },
    ],
  };
}

/**
 * API-Requests im Browser abfangen.
 * @param {import("@playwright/test").Page} page
 * @param {{ fail?: boolean }} [options]  fail: Server-Fehler simulieren
 */
export async function mockApi(page, { fail = false } = {}) {
  const requests = [];
  await page.route("**/api/v1/**", async (route) => {
    const url = new URL(route.request().url());
    requests.push({ url: url.pathname, params: Object.fromEntries(url.searchParams) });
    if (fail) return route.fulfill({ status: 503, json: { message: "Die API antwortet mit HTTP 503" } });
    if (url.pathname === "/api/v1/stop-places") {
      return route.fulfill({ json: stopPlacesResponse(url.searchParams.get("query") ?? "") });
    }
    if (url.pathname === "/api/v1/trips") return route.fulfill({ json: tripsResponse() });
    return route.fulfill({ status: 404, json: {} });
  });
  return requests;
}
