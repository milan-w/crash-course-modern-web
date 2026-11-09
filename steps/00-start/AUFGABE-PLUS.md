# Übung Block 1 · Plus – Ein Formular nur mit HTML

**Ziel:** Baut die Verbindungssuche in `index.html` – nur mit HTML, ohne Klassen, ohne JavaScript.
Gerüst und Feld „Von“ sind vorgegeben.

1. Feld „Nach“ (`name="to"`, Pflichtfeld) mit `<label for="…">`
2. Bahnhofsvorschläge per `<input list="stations">` + `<datalist id="stations">` für beide Felder
3. Button „Start und Ziel tauschen“ (`type="button"`, verständlicher Text)
4. `<fieldset>` + `<legend>` „Zeitpunkt“: Radios „Abfahrt“ / „Ankunft“ (`name="anchor"`, Werte `departure` /
   `arrival`)
5. Im selben `fieldset`: `<input type="datetime-local" name="datetime" required>` mit Label „Datum und Uhrzeit“
6. `<details>`/`<summary>` „Weitere Optionen“ mit Checkbox „Nur Direktverbindungen“ (`name="direct"`)
7. Submit-Button „Verbindungen suchen“

**Testen:**

- Nur mit Tastatur: <kbd>Tab</kbd>, <kbd>Shift</kbd>+<kbd>Tab</kbd>, <kbd>Leertaste</kbd>, <kbd>Enter</kbd>,
  Pfeiltasten
- Leeres Formular abschicken: Kommt eine verständliche Meldung?
- DevTools → Elements → im Untermenü neben **Styles** → **Accessibility**: Hat jedes Feld eine Rolle und einen Namen?

Schneller fertig? Zusatzherausforderungen für Block 1 stehen in `challenges.md` im Übungs-Repo (Übersicht im Anhang der Folien).
