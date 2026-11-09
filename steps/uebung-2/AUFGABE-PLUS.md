# Übung Block 2 · Plus – Selbst in der Doku nachschlagen

**Voraussetzung:** AUFGABE-BASIS.md ist fertig. Hier baut ihr weitere Teile selbst mit DB UX, ohne Vorlage zum
Kopieren. Die Doku jeder Komponente findet ihr auf **design-system.deutschebahn.com** (Komponente auswählen →
Beispiele und Eigenschaften) bzw. lokal unter `node_modules/@db-ux/wc-core-components/agent/*.md`.

## 1. Die restlichen Felder umbauen

Im Formular stehen noch ein natives Datumsfeld und eine native Checkbox aus Block 1.

- „Datum und Uhrzeit“ wird ein `<db-input>`. Welcher `type` passt, und wie bekommt das Pflichtfeld eine
  verständliche Fehlermeldung?
- „Nur Direktverbindungen“ wird eine `<db-checkbox>`.
- Denkt an die Stolperfalle: **keine `id`** an `db-…`-Elementen, `name` reicht.

✔ Prüfen: Leeres Formular abschicken. Erscheint auch am Datumsfeld eure Meldung?

## 2. Ein Hinweis unter dem Formular

Sagt den Nutzenden, dass die Verbindungen Beispieldaten sind. Sucht dafür in der Doku die passende Komponente für
Hinweise und wählt eine Variante, die informiert, aber nicht warnt.

## 3. Ergebnisse als Cards

Unter dem Formular: eine Überschrift „Verbindungen“ und darunter eine Liste mit zwei Beispiel-Verbindungen. Jede
Verbindung ist eine `<db-card class="trip">` mit:

- Abfahrt und Ankunft (z. B. „08:13 – 09:17“) als Überschrift
- Dauer und Umstiege
- den Zügen als `<db-tag>` (z. B. „ICE 123“)
- der Strecke „Frankfurt(Main)Hbf → Köln Hbf“

Überlegt: Warum ist eine geordnete Liste (`<ol>`) hier sinnvoller als lauter `<div>`? Welches HTML-Element passt für Uhrzeiten?

## 4. Dichte gezielt einsetzen

Setzt `data-density` nicht an die ganze Seite, sondern nur an einzelne Bereiche, z. B. `functional` an die Cards und `expressive` an die Überschrift. Was passiert mit Abständen und Schrift? Warum klappt das nur, weil DB UX überall Tokens statt fester Werte nutzt?

## 5. Schmal und mit Tastatur testen

DevTools → Gerätemodus (<kbd>Strg</kbd>+<kbd>Shift</kbd>+<kbd>M</kbd>), Breite 390 px. Öffnet das Mobil-Menü nur mit der Tastatur und schließt es wieder. Wo landet der Fokus danach?

Noch Zeit? Weitere Zusatzherausforderungen für Block 2 stehen in `challenges.md` im Übungs-Repo.
