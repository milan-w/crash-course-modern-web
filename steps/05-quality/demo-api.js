// Beispiel-API für die Verbindungssuche: Bahnhöfe und Verbindungen mit ausgedachtem Fahrplan.
//
// Der Vite-Dev-Server beantwortet damit /api/v1/… (siehe vite.config.js). Es gibt keinen echten Server
// und keine Zugangsdaten – die App ruft aber ganz normal per fetch eine API auf, wie in einem echten Projekt.
// Die EVA-Nummern (Bahnhofsnummern) sind echt, Fahrplan und Zugnummern sind ausgedacht.

export const STATIONS = [
  { evaNumber: "8000105", name: "Frankfurt(Main)Hbf" },
  { evaNumber: "8000207", name: "Köln Hbf" },
  { evaNumber: "8011160", name: "Berlin Hbf" },
  { evaNumber: "8002549", name: "Hamburg Hbf" },
  { evaNumber: "8000261", name: "München Hbf" },
  { evaNumber: "8000096", name: "Stuttgart Hbf" },
  { evaNumber: "8000085", name: "Düsseldorf Hbf" },
  { evaNumber: "8010205", name: "Leipzig Hbf" },
  { evaNumber: "8000152", name: "Hannover Hbf" },
  { evaNumber: "8000284", name: "Nürnberg Hbf" },
  { evaNumber: "8010085", name: "Dresden Hbf" },
  { evaNumber: "8000244", name: "Mannheim Hbf" },
  { evaNumber: "8000080", name: "Dortmund Hbf" },
  { evaNumber: "8000098", name: "Essen Hbf" },
  { evaNumber: "8000050", name: "Bremen Hbf" },
  { evaNumber: "8000240", name: "Mainz Hbf" },
  { evaNumber: "8000206", name: "Koblenz Hbf" },
  { evaNumber: "8000191", name: "Karlsruhe Hbf" },
  { evaNumber: "8010101", name: "Erfurt Hbf" },
  { evaNumber: "8000105", name: "Frankfurt am Main Hauptbahnhof" },
];

/** GET /api/v1/stop-places?query=Frankf&limit=10 */
export function findStopPlaces(query, limit = 10) {
  const q = query.trim().toLowerCase();
  const seen = new Set();
  const stopPlaces = STATIONS.filter((station) => {
    if (!q || !station.name.toLowerCase().includes(q) || seen.has(station.evaNumber)) return false;
    seen.add(station.evaNumber);
    return true;
  }).slice(0, limit);
  return { stopPlaces };
}

const MINUTE = 60_000;
const stopPlace = (evaNumber) => ({
  evaNumber,
  name: STATIONS.find((s) => s.evaNumber === evaNumber)?.name ?? `Bahnhof ${evaNumber}`,
});

/** Immer gleiche „Zufallszahl“ für dieselbe Strecke – so wirken die Daten stabil. */
function seed(text) {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash;
}

/** ISO-8601-Dauer, z. B. 64 → "PT1H4M" */
const isoDuration = (minutes) => `PT${Math.floor(minutes / 60) ? `${Math.floor(minutes / 60)}H` : ""}${minutes % 60}M`;

/** Ein Abschnitt einer Verbindung: eine Fahrt mit einem Zug */
function leg(from, to, departure, minutes, transport, platform, canceled = false) {
  const arrival = new Date(departure.getTime() + minutes * MINUTE);
  return {
    transport,
    duration: isoDuration(minutes),
    departure: { stopPlace: stopPlace(from), time: departure.toISOString(), platform, canceled },
    arrival: { stopPlace: stopPlace(to), time: arrival.toISOString(), canceled },
  };
}

/**
 * GET /api/v1/trips?from=8000105&to=8000207&departureTime=2026-11-05T08:00:00.000Z[&direct=true][&transport=regional]
 * Statt departureTime geht auch arrivalTime (dann: Verbindungen, die bis dahin ankommen).
 * transport: "regional" (nur Nahverkehr) oder "longdistance" (nur Fernverkehr), sonst alle.
 */
export function findTrips({ from, to, departureTime, arrivalTime, direct, transport }) {
  if (!from || !to || from === to) return { trips: [] };

  const routeSeed = seed(`${from}-${to}`);
  const minutes = 45 + (routeSeed % 240); // Fahrzeit 45 min bis knapp 5 h
  const candidates = STATIONS.filter((s) => s.evaNumber !== from && s.evaNumber !== to);
  const via = candidates[routeSeed % candidates.length].evaNumber;
  const byArrival = Boolean(arrivalTime) && !departureTime;
  const anchor = new Date(departureTime ?? arrivalTime ?? Date.now());

  const trips = [];
  for (let i = 0; i < 4; i++) {
    const isDirect = i % 2 === 0 || direct || transport === "longdistance";
    const regional = transport === "regional";
    const total = (isDirect ? minutes : minutes + 25) + (regional ? Math.round(minutes / 3) : 0);
    const offset = byArrival ? -total - 10 - i * 30 : 7 + i * 30;
    const start = new Date(anchor.getTime() + offset * MINUTE);
    const number = 100 + ((routeSeed + i * 7) % 900);
    const platform = String(1 + ((routeSeed + i) % 12));
    const firstPart = Math.round(minutes / 2);

    const legs = isDirect
      ? [leg(from, to, start, total, regional ? `RE ${1 + (number % 60)}` : `ICE ${number}`, platform, i === 2)]
      : [
          leg(from, via, start, firstPart, regional ? `RB ${10 + (number % 80)}` : `IC ${number}`, platform),
          leg(
            via,
            to,
            new Date(start.getTime() + (firstPart + 15) * MINUTE),
            total - firstPart - 15,
            `RE ${1 + (number % 60)}`,
            "3",
          ),
        ];
    trips.push({ id: `demo-${from}-${to}-${i}`, duration: isoDuration(total), legs });
  }
  return { trips: byArrival ? trips.reverse() : trips };
}
