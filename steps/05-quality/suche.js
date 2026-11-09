// Block 4 – Verbindungssuche
// Wird von main.js geladen, nachdem die DB-Komponenten registriert sind.
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
  field("arrival").textContent = timeFormat.format(trip.arrival);
  field("duration").textContent = trip.duration;
  field("changes").textContent = trip.changes === 0 ? "Direkt" : `${trip.changes} × umsteigen`;
  field("route").textContent = `${trip.from} → ${trip.to}`;

  for (const transport of trip.transports) {
    const tag = document.createElement("db-tag");
    tag.semantic = "informational";
    tag.textContent = transport;
    const li = document.createElement("li");
    li.append(tag);
    field("transports").append(li);
  }
  return item;
}

// ---------------------------------------------------------------------------
// 2. Suchen: Zustand ansagen, Daten laden, Cards rendern, Fokus setzen
// ---------------------------------------------------------------------------
async function runSearch(search) {
  const from = search.get("from");
  const to = search.get("to");

  status.textContent = "Verbindungen werden gesucht …";
  // ✅ Fix (Block 4): Nutzereingaben aus URL/Formular NIE per innerHTML einsetzen (XSS!).
  //    Stattdessen Elemente bauen und Text per textContent bzw. als String-Argument einsetzen.
  const strong = (text) => Object.assign(document.createElement("strong"), { textContent: text });
  resultsHeading.replaceChildren("Verbindungen von ", strong(from), " nach ", strong(to));

  try {
    // Die Verbindungssuche braucht EVA-Nummern (Bahnhofsnummern) statt Namen
    const fromStation = await findStation(from);
    const toStation = await findStation(to);
    const trips = await searchTrips({
      fromEva: fromStation.evaNumber,
      toEva: toStation.evaNumber,
      anchor: search.get("anchor"),
      dateTime: new Date(search.get("datetime")),
      direct: search.has("direct"),
    });

    tripList.replaceChildren(...trips.map(renderTrip));
    status.textContent =
      trips.length === 0
        ? "Keine Verbindungen gefunden. Probiere einen anderen Zeitpunkt."
        : `${trips.length} Verbindungen gefunden.`;
  } catch (error) {
    tripList.replaceChildren();
    status.textContent = `Die Suche ist fehlgeschlagen: ${error.message}`;
  }

  // Fokus auf die Ergebnisse – Tastatur- und Screenreader-Nutzende landen direkt dort
  resultsHeading.focus();
}

// ---------------------------------------------------------------------------
// 3. Start: Das Formular schickt per GET ab → die Suche steht in der URL.
//    Formular aus der URL befüllen und suchen. Teilbare Links & Zurück-Button gibt's gratis.
// ---------------------------------------------------------------------------
const params = new URLSearchParams(location.search);
setValue("from", params.get("from") ?? "");
setValue("to", params.get("to") ?? "");
setValue("datetime", params.get("datetime") || nowAsInputValue());
form.elements.anchor.value = params.get("anchor") ?? "departure";
form.elements.direct.checked = params.has("direct");

if (params.has("from") && params.has("to")) runSearch(new FormData(form));

// ---------------------------------------------------------------------------
// 4. Buttons: Tauschen & Jetzt
// ---------------------------------------------------------------------------
form.querySelector('button[name="swap"]').addEventListener("click", () => {
  const from = form.elements.from.value;
  setValue("from", form.elements.to.value);
  setValue("to", from);
});

form.querySelector('button[name="now"]').addEventListener("click", () => {
  setValue("datetime", nowAsInputValue());
});
