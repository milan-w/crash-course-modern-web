# Übung Block 4 · Basis – Daten anbinden & absichern

**Ziel:** Die Suche liefert Verbindungen. Danach findet und schließt ihr eine Sicherheitslücke.
Der meiste Code ist fertig. Ihr ergänzt die Stellen, die mit ✏️ markiert sind.

> Die Daten kommen aus einer **Beispiel-API**, die im Dev-Server mitläuft. Fahrplan und Zugnummern sind ausgedacht.

## Teil 1 · Daten anzeigen

### 1. Erst schauen: Woher kommen die Daten?

1. Öffnet die DevTools (<kbd>F12</kbd>) → Tab **Network**.
2. Öffnet die Datei `api.js` und überfliegt sie: `findStation(name)` sucht einen Bahnhof, `searchTrips(…)` sucht
   Verbindungen. Beides holt **JSON-Daten** per `fetch` von `/api/v1/…`.

### 2. Suche einschalten

In **`main.js`** ganz unten die Basis-Zeile einkommentieren (die `//` am Anfang entfernen):

```js
import("./suche.js"); // Basis
```

### 3. Platz für Ergebnisse und Ansagen

In **`index.html`** ersetzt ihr den kompletten Bereich `<section class="results" …> … </section>` (mit den drei
Beispiel-Cards) durch:

```html
<section class="results" aria-labelledby="results-heading">
  <!-- tabindex="-1": per JavaScript fokussierbar, aber nicht in der Tab-Reihenfolge -->
  <h2 id="results-heading" tabindex="-1">Verbindungen</h2>

  <!-- Live-Region: Screenreader lesen jede Änderung an diesem Text automatisch vor -->
  <p id="status" role="status">Noch keine Suche gestartet.</p>

  <ol class="trip-list" aria-labelledby="results-heading"></ol>
</section>
```

Sucht jetzt nach **Frankfurt(Main)Hbf → Köln Hbf**. Es erscheinen Cards, aber mit „???“. Im Network-Tab seht ihr
die Anfragen. Klickt auf `trips` → **Response**: Das sind die Rohdaten.

### 4. Die Cards befüllen (`suche.js`, ✏️ 1a–1c)

In `renderTrip` wird für jede Verbindung eine Vorlage (`<template id="trip-template">` in `index.html`) kopiert und
mit Text befüllt. Ersetzt die drei `"???"`:

- 1a: Ankunftszeit, genau wie die Zeile für die Abfahrt darüber, nur mit `trip.arrival`
- 1b: Dauer, sie steht schon fertig in `trip.duration`
- 1c: Strecke aus `trip.from` und `trip.to`, z. B. `` `${trip.from} → ${trip.to}` ``

✔ Prüfen: Sucht per Tastatur (Felder ausfüllen, <kbd>Enter</kbd>). Landet ihr danach bei den Ergebnissen? Das
erledigt `runSearch` schon für euch, genauso wie die Ansagen „wird gesucht“, „gefunden“ und „fehlgeschlagen“.

## Teil 2 · Ein gefährlicher Link (Sicherheit)

### 5. Lücke ausnutzen, verstehen, schließen

Hängt an die Adresse eurer Vorschau Folgendes an und ladet die Seite neu:

```text
?from=<img src=x onerror=alert(document.domain)>&to=Köln Hbf
```

(In StackBlitz zuerst die Vorschau über das Symbol „In neuem Tab öffnen“ öffnen, im eingebetteten Fenster
unterdrückt der Browser Hinweisfenster.) Es erscheint ein Hinweisfenster. Das heißt: **Fremder Code läuft in eurer
Seite.** Ein Angreifer könnte so einen Link verschicken und z. B. im Namen des Opfers handeln. Das nennt man **XSS**
(Cross-Site Scripting).

**Warum?** In `suche.js`, Funktion `runSearch`, landet der Text aus der URL per `innerHTML` in der Seite. `innerHTML`
behandelt Text als HTML, also auch als Code.

**Fix:** Ersetzt die Zeile mit `resultsHeading.innerHTML = …` durch:

```js
const strong = (text) => Object.assign(document.createElement("strong"), { textContent: text });
resultsHeading.replaceChildren("Verbindungen von ", strong(from), " nach ", strong(to));
```

`textContent` setzt **immer nur Text**, nie Code. ✔ Prüfen: Link erneut öffnen. Jetzt steht der Text einfach da.

## 6. Bonus: Die Konsole als Notizbuch

DevTools → Tab **Console**, dann eintippen:

```js
await api.findStation("Köln");
```

Ihr seht die Antwort als Objekt. Probiert auch `await api.searchStations("Berlin")`.

Fertig? In **AUFGABE-PLUS.md** steht, was ihr sonst noch selbst bauen könnt.
