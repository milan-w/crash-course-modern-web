// Übung Block 4 · Plus – Verbindungssuche (Lückentext)
// ===========================================================
// Ersetzt jedes "???" bzw. jedes ✏️ TODO durch passenden Code. Reihenfolge 1 → 3, danach die Sicherheitslücke finden.
// Nachschlagen: Folien Block 4 und Anhang, api.js, AUFGABE-PLUS.md. Wird von main.js geladen (Zeile dort einkommentieren).
import { findStation, searchStations, searchTrips } from "./api.js";

const form = document.querySelector("#search-form");
const resultsHeading = document.querySelector("#results-heading");
const status = document.querySelector("#status");
const tripList = document.querySelector(".trip-list");
const tripTemplate = document.querySelector("#trip-template");

// Zum Ausprobieren in der DevTools-Konsole, z. B.: await api.findStation("Köln")
if (import.meta.env.DEV) window.api = { findStation, searchStations, searchTrips };

// ---------------------------------------------------------------------------
// Helfer (vorgegeben)
// ---------------------------------------------------------------------------

// Warten, bis alle DB-Komponenten im Formular ihr inneres <input> gerendert haben
await Promise.all([...form.querySelectorAll("*")].map((element) => element.componentOnReady?.()));

/** Feldwert setzen: am <db-input> (für DB UX) UND am inneren <input> (sofort sichtbar) */
function setValue(name, value) {
  form.querySelector(`db-input[name="${name}"]`).value = value;
  form.elements[name].value = value;
}

/** Aktuelle Uhrzeit im Format von datetime-local, z. B. "2026-11-05T08:13" (lokale Zeit) */
function nowAsInputValue() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

// ---------------------------------------------------------------------------
// 1. Eine Verbindung als Card: <template> klonen, Daten per textContent einsetzen
// ---------------------------------------------------------------------------
const timeFormat = new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit" });

function renderTrip(trip) {
  const item = tripTemplate.content.cloneNode(true);
  const field = (name) => item.querySelector(`[data-field="${name}"]`);

  field("departure").textContent = timeFormat.format(trip.departure);
  field("arrival").textContent = "???";
  field("duration").textContent = "???";
  field("changes").textContent = trip.changes === 0 ? "Direkt" : `${trip.changes} × umsteigen`;
  field("route").textContent = "???"; // z. B. "Frankfurt(Main)Hbf → Köln Hbf"

  // ✏️ TODO 1: Für jedes Verkehrsmittel in trip.transports ein <li><db-tag semantic="informational">…</db-tag></li>
  //            in field("transports") einfügen (document.createElement, textContent, append)

  return item;
}

// ---------------------------------------------------------------------------
// 2. Suchen: Zustand ansagen, Daten laden, Cards rendern, Fokus setzen
//    search ist ein FormData-Objekt: search.get("from"), search.has("direct") …
// ---------------------------------------------------------------------------
async function runSearch(search) {
  const from = search.get("from");
  const to = search.get("to");

  status.textContent = "Verbindungen werden gesucht …";
  resultsHeading.innerHTML = `Verbindungen von <strong>${from}</strong> nach <strong>${to}</strong>`;

  try {
    // ✏️ TODO 2: Beide Bahnhöfe per findStation() nachschlagen (die Suche braucht EVA-Nummern),
    //            dann searchTrips({ fromEva, toEva, anchor, dateTime, direct }) aufrufen (siehe api.js)
    const trips = [];

    tripList.replaceChildren(...trips.map(renderTrip));
    status.textContent =
      trips.length === 0
        ? "Keine Verbindungen gefunden. Probiere einen anderen Zeitpunkt."
        : `${trips.length} Verbindungen gefunden.`;
  } catch (error) {
    tripList.replaceChildren();
    status.textContent = `Die Suche ist fehlgeschlagen: ${error.message}`;
  }

  // ✏️ TODO 3: Fokus auf die Ergebnis-Überschrift setzen
}

// ---------------------------------------------------------------------------
// 3. Start: Das Formular schickt per GET ab → die Suche steht in der URL. (vorgegeben)
// ---------------------------------------------------------------------------
const params = new URLSearchParams(location.search);
setValue("from", params.get("from") ?? "");
setValue("to", params.get("to") ?? "");
setValue("datetime", params.get("datetime") || nowAsInputValue());
form.elements.anchor.value = params.get("anchor") ?? "departure";
form.elements.direct.checked = params.has("direct");

if (params.has("from") && params.has("to")) runSearch(new FormData(form));

// ---------------------------------------------------------------------------
// 4. Tauschen-Button (vorgegeben)
// ---------------------------------------------------------------------------
form.querySelector('button[name="swap"]').addEventListener("click", () => {
  const from = form.elements.from.value;
  setValue("from", form.elements.to.value);
  setValue("to", from);
});
