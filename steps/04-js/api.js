// Anbindung der Beispiel-API als eigenes ES-Modul – für Block 4 fertig vorgegeben.
// Lest es euch in Ruhe durch: fetch, async/await, URLSearchParams, Fehlerbehandlung.
//
// Alle Requests gehen an /api/v1/… – beantwortet vom Dev-Server mit Beispieldaten (demo-api.js).
// In einem echten Projekt stünde dort ein Backend. Zugangsdaten gehören NIE in den Browser-Code.

/** fetch + JSON + Fehlerprüfung. Achtung: fetch wirft NUR bei Netzwerkfehlern, nicht bei HTTP 4xx/5xx! */
async function request(path, params, signal) {
  const response = await fetch(`${path}?${new URLSearchParams(params)}`, { signal });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message ?? `Die API antwortet mit HTTP ${response.status}`);
  return data;
}

/**
 * Bahnhöfe nach Namen suchen.
 * @param {string} query  z. B. "Frankf"
 * @param {AbortSignal} [signal]  optional, zum Abbrechen veralteter Anfragen (Zusatzherausforderung)
 * @returns {Promise<Array<{ evaNumber: string, name: string }>>}
 */
export async function searchStations(query, signal) {
  const { stopPlaces = [] } = await request("/api/v1/stop-places", { query, limit: "10" }, signal);
  return stopPlaces;
}

/**
 * Besten Treffer zu einem Bahnhofsnamen finden. Die Verbindungssuche braucht die EVA-Nummer, nicht den Namen.
 * @param {string} name  z. B. "Köln Hbf"
 * @returns {Promise<{ evaNumber: string, name: string }>}
 */
export async function findStation(name) {
  const [best] = await searchStations(name);
  if (!best) throw new Error(`Kein Bahnhof „${name}“ gefunden.`);
  return best;
}

/**
 * Verbindungen suchen.
 * @param {object} search
 * @param {string} search.fromEva  EVA-Nummer Start
 * @param {string} search.toEva    EVA-Nummer Ziel
 * @param {"departure"|"arrival"} search.anchor  Abfahrts- oder Ankunftszeit?
 * @param {Date} search.dateTime
 * @param {boolean} [search.direct]  nur Direktverbindungen
 * @returns {Promise<Trip[]>}
 */
export async function searchTrips({ fromEva, toEva, anchor, dateTime, direct }) {
  const params = {
    from: fromEva,
    to: toEva,
    // entweder departureTime ODER arrivalTime – nie beides
    [anchor === "arrival" ? "arrivalTime" : "departureTime"]: dateTime.toISOString(),
  };
  if (direct) params.direct = "true";

  const { trips = [] } = await request("/api/v1/trips", params);
  return trips.map(toTrip);
}

/**
 * Eine Verbindung – nur das, was die Oberfläche braucht.
 * @typedef {object} Trip
 * @property {Date} departure    Abfahrt
 * @property {Date} arrival      Ankunft
 * @property {string} duration   fertig formatiert, z. B. "1 h 4 min"
 * @property {number} changes    Anzahl Umstiege
 * @property {string} from       Name des Startbahnhofs
 * @property {string} to         Name des Zielbahnhofs
 * @property {string[]} transports  z. B. ["RE 2", "IC 2025"]
 */

/** API-Antwort → Trip. Eine Verbindung besteht aus Abschnitten (legs), jeder Abschnitt ist eine Fahrt. */
function toTrip(trip) {
  const first = trip.legs[0];
  const last = trip.legs.at(-1);
  return {
    departure: new Date(first.departure.time),
    arrival: new Date(last.arrival.time),
    duration: formatDuration(trip.duration),
    changes: trip.legs.length - 1,
    from: first.departure.stopPlace.name,
    to: last.arrival.stopPlace.name,
    transports: trip.legs.map((leg) => leg.transport),
  };
}

/** ISO-8601-Dauer "PT1H4M" → "1 h 4 min" */
function formatDuration(iso) {
  const [, days = 0, hours = 0, minutes = 0] = iso.match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/) ?? [];
  const totalHours = Number(days) * 24 + Number(hours);
  return totalHours ? `${totalHours} h ${Number(minutes)} min` : `${Number(minutes)} min`;
}
