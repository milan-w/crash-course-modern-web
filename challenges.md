# Zusatzherausforderungen für Fortgeschrittene

Für alle, die in einer Übung schneller fertig sind – oder den Workshop später in Ruhe allein noch einmal durchgehen.
Jede Herausforderung baut auf eurem Stand auf (lokal in `app/`, sonst in eurem StackBlitz) und ist **unabhängig**
von den anderen. Der nächste Block startet immer mit dem fertigen Stand (`pnpm step N` bzw. dem StackBlitz-Link des
nächsten Blocks), ihr verpasst also nichts, wenn ihr etwas nicht fertig bekommt.

Die JavaScript-Herausforderungen beziehen sich auf `suche.js` aus Block 4.

Aufbau: **Ziel** · **Hinweise** · aufklappbarer **Lösungsvorschlag**. Versucht es erst selbst 😉

Barrierefreiheit spielerisch weiter üben: [practica11y.dev](https://practica11y.dev) mit interaktiven Challenges im
Browser, z. B. zu Buttons und Links, Überschriften, Labels, Fehlermeldungen, Live-Regions und Kontrast.

---

## Block 1 – Semantisches HTML

### 1.1 Hinweis als Popover

**Ziel:** Ein Button „Hinweise zur Suche“ öffnet einen Hinweistext als Overlay – ohne JavaScript.

- Attribute `popover` (am Overlay) und `popovertarget` (am Button)
- Probiert mit der Tastatur: Schließt <kbd>Esc</kbd> das Overlay? Wo landet der Fokus?
- MDN: „Popover API“

<details>
<summary>Lösungsvorschlag</summary>

```html
<button type="button" popovertarget="search-info">Hinweise zur Suche</button>
<div id="search-info" popover>
  <h3>Hinweise zur Suche</h3>
  <p>Die Verbindungen sind Beispieldaten. Fahrplan und Zugnummern sind ausgedacht.</p>
  <button type="button" popovertarget="search-info" popovertargetaction="hide">Schließen</button>
</div>
```

</details>

### 1.2 Verkehrsmittel-Auswahl

**Ziel:** In „Weitere Optionen“ ein `<select>` „Verkehrsmittel“ mit _Alle_, _Nur Nahverkehr_, _Nur Fernverkehr_.

- Auch ein `<select>` braucht ein `<label for>`
- Die Auswahl landet beim Absenden als `?transport=…` in der URL. In Block 4 könnt ihr sie an die API übergeben
  (siehe 4.5).

<details>
<summary>Lösungsvorschlag</summary>

```html
<p>
  <label for="transport">Verkehrsmittel</label>
  <select id="transport" name="transport">
    <option value="all">Alle Verkehrsmittel</option>
    <option value="regional">Nur Nahverkehr</option>
    <option value="longdistance">Nur Fernverkehr</option>
  </select>
</p>
```

</details>

### 1.3 Mit dem Screenreader testen

**Ziel:** Das Formular einmal komplett mit Screenreader ausfüllen und abschicken.

- Windows: NVDA (kostenlos) oder Sprachausgabe (<kbd>Strg</kbd>+<kbd>Win</kbd>+<kbd>Enter</kbd>)
- macOS: VoiceOver (<kbd>Cmd</kbd>+<kbd>F5</kbd>), mit <kbd>Ctrl</kbd>+<kbd>Option</kbd>+<kbd>U</kbd> den Rotor öffnen
- Wird „Zeitpunkt“ als Gruppenname vorgelesen? Was hört man beim leeren Abschicken?

---

## Block 2 – DB UX

### 2.1 Dark Mode per Schalter

**Ziel:** Ein `<db-switch>` „Dark Mode“ in der Shell schaltet zwischen hell und dunkel. Die Wahl bleibt nach einem Reload erhalten.

- DB UX steuert den Modus über `data-mode="light|dark"` am `<html>`. Ohne `data-mode` folgt die Seite der
  Systemeinstellung.
- Platz in der Shell: `<db-control-panel-actions-2 slot="actions2">`, und zwar in Desktop **und** Mobil
- Merken: `localStorage`. Startwert ohne gespeicherte Wahl: `matchMedia("(prefers-color-scheme: dark)")`

<details>
<summary>Lösungsvorschlag</summary>

```html
<db-control-panel-actions-2 slot="actions2">
  <db-switch name="dark-mode" label="Dark Mode"></db-switch>
</db-control-panel-actions-2>
```

```js
const modeSwitches = document.querySelectorAll('db-switch[name="dark-mode"]');
const savedMode = localStorage.getItem("mode");

function applyMode(mode) {
  document.documentElement.dataset.mode = mode;
  for (const toggle of modeSwitches) toggle.checked = mode === "dark";
}

if (savedMode) applyMode(savedMode);
else for (const toggle of modeSwitches) toggle.checked = matchMedia("(prefers-color-scheme: dark)").matches;

document.addEventListener("change", (event) => {
  if (event.target.name !== "dark-mode") return;
  const mode = event.target.checked ? "dark" : "light";
  localStorage.setItem("mode", mode);
  applyMode(mode);
});
```

</details>

### 2.2 Density gezielt einsetzen

**Ziel:** Ihr kennt `data-density` aus der Übung. Jetzt bewusst gemischt: Formular kompakt, Ergebnisse luftig.

- `data-density="functional"` an `<form>`, `data-density="expressive"` an `<section class="results">`
- Was passiert mit Abständen und Schriftgrößen? Warum funktioniert das nur mit DB-Tokens statt `px`?
- Wo würdet ihr in einer echten Anwendung welche Dichte wählen (z. B. Tabellen für Disponent:innen vs. Startseite)?

### 2.3 Verkehrsmittel als `<db-select>`

**Ziel:** Habt ihr 1.2 gemacht? Dann das `<select>` auf `<db-select label="Verkehrsmittel">` umstellen.

### 2.4 Echtes DB-Theme

**Ziel:** Statt des Whitelabel-Themes das DB-Theme nutzen (Paket `@db-ux/db-theme`, Inner-Source-Variante).

- Nur die erste `@import`-Zeile in `styles.css` tauschen (Stelle ist mit `TODO(Theme)` markiert)
- Geht nur **lokal**: Das DB-Theme liegt geschützt in der internen Registry, StackBlitz kommt da nicht heran.
- Danach `pnpm test:a11y --project=app`: Ändern sich Kontraste?

---

## Block 3 – Modernes CSS

### 3.1 Container Query für breite Cards

**Ziel:** Ist eine Card mindestens 30rem breit, stehen die Zeiten links und die Details rechts.

- **Media Query** fragt: Wie breit ist das Fenster? **Container Query** fragt: Wie breit ist mein Platz?
- Das `<li>` wird zum Container (`container: trip / inline-size`), die Card fragt `@container trip (…)`
- `grid-template-areas` macht die Umsortierung lesbar
- Testen: Fenster zwischen 600 und 1280 px ziehen. Bei 600 px ist die Card **breiter** als bei 1280 px!

<details>
<summary>Lösungsvorschlag</summary>

```css
.trip-list > li {
  container: trip / inline-size;
}

.db-card.trip {
  grid-template-areas:
    "times"
    "meta"
    "legs"
    "route";

  .trip-times {
    grid-area: times;
  }
  .trip-meta {
    grid-area: meta;
  }
  .trip-legs {
    grid-area: legs;
  }
  .trip-route {
    grid-area: route;
  }

  @container trip (inline-size >= 30rem) {
    grid-template-columns: 12rem 1fr;
    grid-template-areas:
      "times legs"
      "meta  route";
    align-items: center;
  }
}
```

</details>

### 3.2 Hervorhebung mit `light-dark()` und `:has()`

**Ziel:** Eine Card wird farbig hinterlegt, sobald etwas darin Tastaturfokus hat. Die Farbe passt zu hell und dunkel.

- `light-dark(hell, dunkel)` wählt automatisch, passend zu `color-scheme` bzw. `data-mode` (siehe 2.1)
- `:has(:focus-visible)`: Das Eltern-Element reagiert auf den Fokus eines Kindes
- Die Cards enthalten noch nichts Fokussierbares. Zum Ausprobieren einen Link „Details“ in eine Card einbauen

<details>
<summary>Lösungsvorschlag</summary>

```css
:root {
  --app-highlight: light-dark(#fff4d6, #3d3214);
}

.db-card.trip:has(:focus-visible) {
  background: var(--app-highlight);
}
```

</details>

### 3.3 Pfeil im breiten Layout drehen

**Ziel:** Stehen „Von“ und „Nach“ nebeneinander, zeigen die Pfeile des Tauschen-Buttons nach links/rechts (⇄) statt
nach oben/unten.

- Das Icon ist ein `::before` des inneren `.db-button`
- Die Eigenschaft `rotate` gibt es auch ohne `transform`

<details>
<summary>Lösungsvorschlag</summary>

```css
.stations {
  @media (width >= 40rem) {
    .db-button::before {
      rotate: 90deg;
    }
  }
}
```

</details>

### 3.4 Gleich hohe Cards

**Ziel:** Alle Cards einer Zeile sind gleich hoch, auch wenn eine mehr Tags hat.

<details>
<summary>Lösungsvorschlag</summary>

```css
/* Der Host <db-card> ist inline – erst als Block kann er die Höhe des <li> übernehmen */
.trip-list db-card {
  display: block;
  block-size: 100%;
}

.db-card.trip {
  block-size: 100%;
}
```

</details>

---

## Block 4 – Daten anbinden & absichern

### 4.1 Live-Bahnhofsvorschläge beim Tippen

**Ziel:** Beim Tippen in „Von“/„Nach“ kommen die Vorschläge live aus der API statt aus der statischen Liste.

- `input`-Event am Formular abfangen (es bubbelt vom inneren `<input>` hoch), dann `searchStations(query, signal)`
  aus `api.js`
- **Debounce:** Erst nach 250 ms Tipp-Pause anfragen (`setTimeout` / `clearTimeout`). „F“, „Fr“, „Fra“ … ergibt so
  **eine** Anfrage statt fünf und schont das Rate Limit.
- **Abbrechen:** Eine veraltete Anfrage per `AbortController` abbrechen, damit eine langsame alte Antwort nie eine
  neue überschreibt
- Ergebnis: `field.dataList = stations.map((s) => s.name)`
- **Fehler nicht verschlucken:** Schlägt die Suche fehl, sichtbar am Feld (`invalidMessage`, `validation`) und im
  Status ansagen. Ein `AbortError` ist dagegen kein Fehler.

<details>
<summary>Lösungsvorschlag</summary>

```js
import { findStation, searchStations, searchTrips } from "./api.js";

const pending = new Map(); // Feldname → { timer, controller }

function suggestStations(fieldName, query) {
  const previous = pending.get(fieldName);
  clearTimeout(previous?.timer);
  previous?.controller.abort(); // „Fra“ ist egal, wenn „Frank“ kommt

  if (query.trim().length < 2) return;

  const field = form.querySelector(`db-input[name="${fieldName}"]`);
  const controller = new AbortController();
  const timer = setTimeout(async () => {
    try {
      const stations = await searchStations(query, controller.signal);
      field.dataList = stations.map(({ name }) => name);
      field.validation = "no-validation";
    } catch (error) {
      if (error.name === "AbortError") return;
      const message = "Bahnhofsvorschläge konnten nicht geladen werden. Bitte Namen vollständig eingeben.";
      field.invalidMessage = message;
      field.validation = "invalid";
      status.textContent = message;
    }
  }, 250);
  pending.set(fieldName, { timer, controller });
}

form.addEventListener("input", (event) => {
  const { name, value } = event.target;
  if (name === "from" || name === "to") suggestStations(name, value);
});
```

Bonus: Die EVA-Nummern der Vorschläge in einer `Map` merken, dann spart `runSearch` sich die erneute Suche.

</details>

### 4.2 Suchen ohne Neuladen (History API)

**Ziel:** Die Suche läuft ohne Seiten-Reload, URL, Zurück-Button und teilbare Links funktionieren aber weiter.

- Im `submit`-Event `event.preventDefault()`. Das Event kommt erst **nach** der nativen Validierung.
- `history.pushState(null, "", "?" + new URLSearchParams(new FormData(form)))`
- Zurück/Vor: `popstate`-Event → Formular aus `location.search` neu befüllen und suchen
- Bei Zurück/Vor den Fokus **nicht** verschieben, nur nach einer aktiven Suche
- Was ist der Vorteil gegenüber dem nativen GET? Was wird dadurch komplizierter?

<details>
<summary>Lösungsvorschlag</summary>

```js
// Befüllen aus der URL in eine Funktion auslagern (vorher Abschnitt 3 in suche.js)
function fillForm(params) {
  setValue("from", params.get("from") ?? "");
  setValue("to", params.get("to") ?? "");
  setValue("datetime", params.get("datetime") || nowAsInputValue());
  form.elements.anchor.value = params.get("anchor") ?? "departure";
  form.elements.direct.checked = params.has("direct");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const search = new FormData(form);
  history.pushState(null, "", `?${new URLSearchParams(search)}`);
  runSearch(search, { moveFocus: true });
});

window.addEventListener("popstate", () => {
  const params = new URLSearchParams(location.search);
  fillForm(params);
  if (params.has("from") && params.has("to")) runSearch(new FormData(form), { moveFocus: false });
});
```

Ruft ihr schnell hintereinander zweimal `runSearch` auf, kann die langsamere erste Antwort die zweite überschreiben.
Lösung wie in 4.1: einen `AbortController` pro Suche, die vorherige Suche abbrechen und `signal` an `fetch`
durchreichen. Dafür braucht `searchTrips` einen zusätzlichen `signal`-Parameter.

</details>

### 4.3 Weiche Übergänge mit View Transitions

**Ziel:** Neue Ergebnisse blenden weich ein, aber nur, wenn die Nutzer:in keine reduzierte Bewegung eingestellt hat.

<details>
<summary>Lösungsvorschlag</summary>

```js
function update(callback) {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduceMotion) return callback();
  return document.startViewTransition(callback).finished;
}

// in runSearch:
await update(() => tripList.replaceChildren(...trips.map(renderTrip)));
```

</details>

### 4.4 Ladezustand und mehr Details auf der Card

**Ziel:** Während der Suche `aria-busy="true"` am Ergebnisbereich setzen. Auf der Card zusätzlich Gleis und
„Fällt aus“ anzeigen.

- Die API liefert pro Abschnitt `departure.platform` sowie `departure.canceled` / `arrival.canceled`
  (in den Beispieldaten fällt jeweils eine Verbindung aus)
- Dafür `toTrip()` in `api.js` erweitern, im Template ein `<span data-field="platform">` ergänzen
- „Fällt aus“ als `<db-tag semantic="critical">`. Nie nur Farbe, der Text zählt!

### 4.5 Verkehrsmittel filtern

**Ziel:** Habt ihr 1.2 bzw. 2.3 gemacht? Dann die Auswahl an die API übergeben. Sie versteht `transport=regional` bzw. `transport=longdistance`.

<details>
<summary>Lösungsvorschlag</summary>

```js
// api.js, in searchTrips({ …, transport }):
if (transport === "regional" || transport === "longdistance") params.transport = transport;

// suche.js, im Aufruf von searchTrips:
transport: search.get("transport"),
```

</details>

### 4.6 Echte Combobox statt `<datalist>`

**Ziel (groß!):** `<datalist>` lässt sich kaum gestalten, und die Screenreader-Unterstützung schwankt. Baut die
Bahnhofsauswahl als ARIA-Combobox nach dem Muster der ARIA Authoring Practices (w3.org/WAI/ARIA/apg → Combobox).

- `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, Liste mit `role="listbox"`
- Pfeiltasten, <kbd>Enter</kbd>, <kbd>Esc</kbd>, und Vorschläge per Live-Region ansagen („5 Vorschläge“)
- Spätestens hier lohnt sich eine erprobte Bibliothek. In React z. B. `downshift`.

---

**Qualität & Sicherheit:** Die Herausforderungen 4.7 bis 4.11 vertiefen den XSS-Teil von Block 4.

### 4.7 Content-Security-Policy

**Ziel:** Eine CSP als zweite Verteidigungslinie: Selbst wenn doch HTML eingeschleust wird, läuft kein fremdes Skript.

- `<meta http-equiv="Content-Security-Policy" content="…">` in den `<head>`
- Startet streng (`default-src 'self'`) und lockert nur, was die Konsole meldet
- Testet mit dem XSS-Link aus der Übung, **bevor** ihr `innerHTML` repariert: Was meldet die Konsole?
- In Produktion besser als HTTP-Header, dann geht auch `frame-ancestors`

<details>
<summary>Lösungsvorschlag</summary>

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'"
/>
```

`style-src 'unsafe-inline'` braucht DB UX (Tooltip-Positionierung, Hydration der Web Components).

</details>

### 4.8 Automatisiert testen mit Playwright und axe

**Ziel:** Die Tests selbst laufen lassen und einen eigenen Test ergänzen.

```bash
pnpm test:install   # Browser für die Tests, einmalig
pnpm test:a11y --project=app
```

- Lest `tests/a11y.spec.js`: Elemente werden über **Rollen und Labels** gefunden, genau wie mit Screenreader
- Eigener Test, z. B.: „Tauschen-Button tauscht Von und Nach“ oder „Leere Ergebnisse werden angesagt“
- API-Antworten simuliert `tests/fixtures/api.js` (`mockApi`)
- Prompt-Muster 5 in `cheatsheets/prompts.md` hilft beim Schreiben

### 4.9 Lighthouse

**Ziel:** DevTools → Lighthouse → _Accessibility_ und _Best Practices_ prüfen. Was findet Lighthouse, was axe nicht,
und umgekehrt?

### 4.10 Supply Chain

**Ziel:** Verstehen, wie pnpm vor kompromittierten Paketen schützt.

- `pnpm-workspace.yaml`: Was bewirken `allowBuilds` und `minimumReleaseAge`?
- `pnpm audit`: Gibt es bekannte Schwachstellen?
- Warum `saveExact: true`, und warum gehört `pnpm-lock.yaml` ins Repo? Tipp: Schaut euch die `integrity`-Einträge
  im Lockfile an. Steht dort, aus welcher Registry ein Paket kommt?

### 4.11 Qualitäts-Detektiv

**Ziel:** Im Stand `demo-fehler` stecken neben der XSS-Lücke noch weitere Fehler. Findet sie mit Werkzeugen, erst dann in
die Lösung `uebung-5` schauen.

1. **Linter (nur lokal):** `pnpm lint steps/demo-fehler`. Was meldet ESLint mit den
   DB-UX-Regeln, und warum ist das ein Problem?
2. **Accessibility-Baum:** DevTools → Elements → im Untermenü neben _Styles_ den Bereich _Accessibility_ öffnen. Gibt es einen Button, den ein Screenreader nur
   als „Schalter“ vorliest? Was passiert außerdem, wenn ihr ihn anklickt? (Achtet auf die Adresszeile.)
3. **Tests:** `pnpm test:a11y --project=demo-fehler` vs. `--project=uebung-5`. Welche Tests schlagen fehl?
4. Fixen, bis Linter und Tests grün sind.

<details>
<summary>Lösungsvorschlag</summary>

Der „Jetzt“-Button neben „Datum und Uhrzeit“ hat keinen Text und kein `type`. Ohne Text hat er keinen Namen, ohne
`type="button"` schickt er das Formular ab.

```html
<db-button name="now" type="button" icon="clock" variant="ghost" no-text>
  Jetzt
  <db-tooltip>Aktuelle Uhrzeit einsetzen</db-tooltip>
</db-button>
```

</details>

---

## Block 5 – Werkzeugkasten der Bahn

Die Links zu API Portal, Referenzimplementierungen und MCP-Verzeichnissen stehen auf den Folien von Block 5 (DB-intern).

### 5.1 Echte Daten für ein eigenes Projekt

**Ziel:** Verstehen, was es braucht, damit eine App wie unsere echte Daten bekommt.

- Im **API Portal** (Block 5) eine API finden, die zu eurer Idee passt, und lesen, wie man einen Zugang bekommt
- Zugangsdaten gehören in ein **Backend/BFF**, nie in den Browser-Code und nie ins Repo (siehe 5.2)
- Vergleicht die Antwort der echten API mit unserer `demo-api.js`: Welche Felder braucht die Oberfläche wirklich?
  Genau das macht `toTrip()` in `api.js`.

### 5.2 Mit einer Referenzimplementierung starten (benötigt Gitlab-Zugang)

**Ziel:** Die Verbindungssuche in Angular, React, Vue oder Next.js nachbauen, auf Basis der passenden
**Referenzimplementierung** (über das Template im Developer Portal anlegen, nicht forken).

- Spickzettel: `cheatsheets/react-angular.md` (Komponenten-Mapping, Shell, Events, Stolperfallen)
- API-Aufrufe mit Zugangsdaten gehören dort in das BFF der Referenzimplementierung, nicht ins Frontend. Unsere
  `demo-api.js` zeigt, welche Daten das Frontend vom BFF bekommen sollte.
- Danach dieselben Tests und Lint-Regeln laufen lassen. Was übernimmt das Framework für euch (z. B. Escaping), wo
  müsst ihr weiter selbst aufpassen (`dangerouslySetInnerHTML`, `[innerHTML]`)?

### 5.3 Einen MCP-Server prüfen und einrichten

**Ziel:** Einen weiteren MCP-Server aus dem Verzeichnis bewusst auswählen, nicht blind installieren.

- Was tut der Server? Liest er nur oder kann er auch schreiben?
- Wer pflegt ihn, wie aktiv ist das Repo, ist die Version gepinnt?
- Erst danach in `.vscode/mcp.json` bzw. `.kiro/settings/mcp.json` eintragen

### 5.4 AI-Review gegen den fehlerhaften Stand

**Ziel:** Prüfen, wie gut ein AI-Review wirklich ist.

- Nehmt den Stand `demo-fehler` und ein Prompt-Muster aus `cheatsheets/prompts.md` (Barrierefreiheit oder Security)
- Vergleicht mit 4.11: Findet die AI dieselben Fehler? Mehr? Falsches?
- Nur mit freigegebenen Tools, die für Code zugelassen sind. Keine Secrets in Prompts!
