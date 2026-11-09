# Übung Block 3 · Plus – Layout mit modernem CSS

**Ziel:** Gestaltet die App in **`styles.css`** (unter „Ab hier: eure eigenen Styles“). `layout.css` enthält eine
auskommentierte Musterlösung für den Basis-Weg. Schaut erst hinein, wenn ihr hängt.

1. Nur DB-Tokens verwenden: `var(--db-spacing-fixed-md)` statt `16px`, eigene Custom Properties wie `--app-gap`
   darauf aufbauen
2. Suchformular per CSS Grid: „Von“ | Tauschen | „Nach“ in einer Zeile, unter 40rem untereinander
3. Ergebnisliste: Cards per Grid mit `repeat(auto-fill, minmax(…))`, ganz ohne Media Query
4. `:has()`: Feld mit ungültiger Eingabe hervorheben (`input:user-invalid`)
5. CSS Nesting für zusammengehörige Regeln nutzen
6. `fieldset` ohne Browser-Rahmen, Radios nebeneinander, `summary` mit ausreichend großem Klickziel (WCAG 2.5.8)

Tipp: DB-Komponenten reichen `class` an das innere Element weiter. `<db-card class="trip">` wird im CSS zu
`.db-card.trip`. DevTools → Elements zeigt den echten Aufbau.

**Testen:** DevTools-Gerätemodus 320 px und Zoom 200 %: kein horizontales Scrollen?

Schneller fertig? Zusatzherausforderungen für Block 3 stehen in `challenges.md` im Übungs-Repo (Übersicht im Anhang der Folien).
