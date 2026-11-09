# Übung Block 1 · Basis – Ein Formular nur mit HTML

**Ziel:** Ein Suchformular, das jede:r bedienen kann: mit Maus, Tastatur und Screenreader.
Ihr arbeitet in **`index.html`**. Die Vorschau aktualisiert sich nach dem Speichern von selbst.

Schaut euch zuerst das Gerüst an: Es gibt schon einen Skip-Link, `<header>`, `<main>`, `<footer>`, eine `<h1>` und das
Feld **„Von“** als Muster. Alle weiteren Felder kommen in das `<form>`, unter den Kommentar „Ab hier …“.

## 1. Feld „Nach“

Kopiert den Absatz `<p>…</p>` mit dem Feld „Von“ und passt ihn an:

- `for`, `id` und `name` werden zu `to`, der Text im `<label>` zu „Nach“
- Den Hinweis (`<small>` und `aria-describedby`) könnt ihr weglassen

✔ Prüfen: Klickt auf das Wort „Nach“. Springt der Cursor ins Feld? Dann sind Label und Feld richtig verbunden.

## 2. Vorschläge für Bahnhöfe

Fügt unter den Feldern eine Vorschlagsliste ein:

```html
<datalist id="stations">
  <option value="Frankfurt(Main)Hbf"></option>
  <option value="Köln Hbf"></option>
  <option value="Berlin Hbf"></option>
</datalist>
```

Ergänzt dann an **beiden** `<input>` das Attribut `list="stations"`.

✔ Prüfen: Tippt „K“ in ein Feld. Erscheint „Köln Hbf“?

## 3. Button „Start und Ziel tauschen“

Zwischen „Von“ und „Nach“:

```html
<button type="button">Start und Ziel tauschen</button>
```

`type="button"` ist wichtig: Ohne schickt jeder Button in einem Formular das Formular ab.
(Tauschen funktioniert erst in Block 4, dann mit JavaScript.)

## 4. Abfahrt oder Ankunft?

Zwei Radio-Buttons, die zusammengehören, kommen in ein `<fieldset>`. Die `<legend>` ist die Überschrift der Gruppe:

```html
<fieldset>
  <legend>Zeitpunkt</legend>
  <input id="anchor-departure" type="radio" name="anchor" value="departure" checked />
  <label for="anchor-departure">Abfahrt</label>
  <input id="anchor-arrival" type="radio" name="anchor" value="arrival" />
  <label for="anchor-arrival">Ankunft</label>
</fieldset>
```

## 5. Absenden

Am Ende des Formulars: `<button type="submit">Verbindungen suchen</button>`

## 6. Testen – ohne Maus!

- Klickt einmal in die Vorschau und bewegt euch nur mit <kbd>Tab</kbd> und <kbd>Shift</kbd>+<kbd>Tab</kbd>.
  Seht ihr immer, wo ihr seid?
- Radio-Buttons wechselt ihr mit den **Pfeiltasten**, Buttons drückt ihr mit <kbd>Leertaste</kbd> oder <kbd>Enter</kbd>
- Schickt das **leere** Formular ab. Was passiert? (Das kommt von `required`, ganz ohne eigenen Code.)

Fertig? Dann weiter mit den Aufgaben ab Nummer 5 in **AUFGABE-PLUS.md**.
