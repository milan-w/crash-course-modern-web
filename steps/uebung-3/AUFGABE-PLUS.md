# Übung Block 3 · Plus – Eigene Regeln schreiben

**Voraussetzung:** AUFGABE-BASIS.md ist fertig, alle Abschnitte in `layout.css` sind aktiv. Jetzt schreibt ihr eigene Regeln in **`styles.css`** (unter „Ab hier: eure eigenen Styles“). Nutzt dabei nur DB-Tokens, keine festen Pixelwerte. Eine Übersicht von verwendbaren DB-Tokens findet ihr unter https://design-system.deutschebahn.com/documentation/foundation/.

Tipp: DB-Komponenten reichen `class` an das innere Element weiter. `<db-card class="trip">` wird im CSS zu `.db-card.trip`. DevTools → Elements zeigt den echten Aufbau.

## 1. Fieldset aufräumen

Die beiden Radio-Buttons im `<fieldset>` „Zeitpunkt“ sollten nebeneinander platziert sein. Die `<legend>` soll aussehen wie eine kleinere Überschrift.

## 2. Komfortables Klickziel für „Weitere Optionen“

WCAG 2.5.8 verlangt Klickziele von mindestens 24 × 24 px. Messt zuerst nach: Wie hoch ist das `<summary>`? Prüft es in den DevTools (Element anklicken, Maße im Box-Modell).

Das Minimum ist erfüllt, aber gerade so. Mit dem Finger auf dem Handy ist das knapp. Macht das `<summary>` so hoch wie einen DB-Button, ohne die Schriftgröße zu ändern. Tipp: Die Höhe der Buttons steckt im Token `--db-sizing-md`. Damit „Weitere Optionen“ als Bedienelement auffällt, setzt ihr die Beschriftung außerdem fett.

Hinweis: Für Schrift gibt es keine einzelnen Tokens für Größe oder Gewicht, nur kombinierte für die Kurzschreibweise `font` (z. B. `font: var(--db-type-body-md)`). Die setzen Größe, Zeilenhöhe und Gewicht auf einmal. Wer nur fett will, nimmt deshalb hier ausnahmsweise `font-weight: 700`.

## 3. Direktverbindungen hervorheben mit `:has()`

Eine Verbindung ohne Umstieg hat genau einen Zug in ihrer Liste `.trip-legs`. Hebt solche Cards sichtbar hervor, z. B. mit einem Rahmen in einer DB-Farbe. Tipp: `:has()` und `:only-child`.

Achtung: Farbe allein reicht nicht (WCAG 1.4.1). Wie kann man den Unterschied auch ohne Farbe kenntlich machen?

## 4. Container Query statt Media Query

Abschnitt 2 in `layout.css` schaltet das Grid über `@media (width >= 40rem)` um, also abhängig von der Fensterbreite.
Baut es so um, dass das Formular auf **seine eigene Breite** reagiert. Stichworte: `container-type: inline-size` und `@container`.

✔ Prüfen: Begrenzt testweise die Breite des Formulars (z. B. `max-inline-size: 30rem`). Springt das Layout jetzt um, obwohl das Fenster breit ist?

## 5. Härtetest

- DevTools-Gerätemodus mit **320 px** und Zoom **200 %**: Muss man irgendwo seitlich scrollen?
- Dark mode (`data-mode="dark"` an `<html>`): Passen eure Farben aus Aufgabe 3 auch dort?

Noch Zeit? Weitere Zusatzherausforderungen für Block 3 stehen in `challenges.md` im Übungs-Repo.
