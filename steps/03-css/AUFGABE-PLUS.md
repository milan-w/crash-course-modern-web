# Übung Block 4 · Plus – Daten anbinden & absichern

**Ziel:** Ihr schreibt den Kern der Verbindungssuche in **`suche-plus.js`** selbst (Lückentext) und findet danach
eine Sicherheitslücke. `api.js` ist fertig. Lest es kurz: `findStation(name)` und `searchTrips({ … })`.

> Die Daten kommen aus einer **Beispiel-API**, die im Dev-Server mitläuft (`demo-api.js`).

## Teil 1 · Daten anzeigen

1. `main.js`: die Plus-Zeile einkommentieren: `import("./suche-plus.js");`
2. `index.html`, Ergebnisbereich: statische Cards raus (leere `<ol class="trip-list">`), Überschrift bekommt
   `tabindex="-1"`, darunter `<p id="status" role="status">`. Die Live-Region muss schon beim Laden im DOM sein!
3. `suche-plus.js`, Abschnitt 1, `renderTrip(trip)`: `<template id="trip-template">` klonen, Daten per
   `textContent` einsetzen, Tags für die Verkehrsmittel (TODO 1)
4. Abschnitt 2, `runSearch(search)`: Bahnhöfe + Verbindungen laden (TODO 2), Fokus auf die Überschrift (TODO 3).
   Die Ansagen sind vorgegeben.

Testet Frankfurt(Main)Hbf → Köln Hbf, auch „Ankunft“ und „Nur Direktverbindungen“. DevTools → Network: Welche Parameter stehen in der Anfrage an
`trips`, und wie sieht die Antwort aus? Hängt ihr? `suche.js` ist die Basis-Variante mit fast fertigem Code.

## Teil 2 · Sicherheitslücke finden

In `suche-plus.js` steckt eine **XSS-Lücke**: Daten aus der URL können als Code im Browser laufen.

1. **Finden:** im Terminal `pnpm lint app` (lokal) bzw. `npm run lint` (StackBlitz). Was meldet ESLint?
2. **Ausnutzen:** Baut einen Link mit `?from=…&to=Köln Hbf`, der ein `alert()` auslöst (StackBlitz: Vorschau in neuem
   Tab öffnen).
3. **Schließen:** ohne `innerHTML`, die Überschrift soll trotzdem fett gedruckte Bahnhofsnamen zeigen. Auflösung in
   AUFGABE-BASIS.md, Schritt 5.

Lokal zusätzlich: `pnpm test:install` (einmalig), dann `pnpm test:a11y --project=app` (axe + Playwright, inklusive
XSS-Test).

Schneller fertig? Zusatzherausforderungen für Block 4 stehen in `challenges.md` im Übungs-Repo (Übersicht im Anhang der
Folien).
