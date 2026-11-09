# Übung Block 2 · Basis – Aus HTML wird eine DB-App

**Ziel:** Eure Verbindungssuche bekommt den DB-Look. Dafür tauscht ihr Standard-HTML gegen fertige Bausteine aus dem
DB UX Design System. Ihr arbeitet in **`index.html`** und ein bisschen in **`main.js`**.

Die Bausteine heißen alle `db-…` und funktionieren wie normale HTML-Elemente. Ihr müsst sie nicht selbst programmieren.

## 1. Der Rahmen: DB Shell

Die Shell bringt Kopfzeile, mobiles Menü, Skip-Link und den `<main>`-Bereich mit.

1. Löscht in `index.html` den Skip-Link `<a class="skip-link" …>`, den `<header>`, die Zeilen `<main id="main">` und
   `</main>` sowie den `<footer>`. **Den Inhalt von `<main>`** (Überschrift, Formular, Ergebnisse) **behaltet ihr!**
2. Setzt stattdessen diesen Rahmen ein und schiebt euren Inhalt an die markierte Stelle:

```html
<db-shell>
  <db-control-panel-desktop>
    <db-control-panel-skip-navigation
      slot="skipNavigation"
      text="Zum Inhalt springen"
    ></db-control-panel-skip-navigation>
    <db-control-panel-brand slot="brand">Verbindungssuche</db-control-panel-brand>
  </db-control-panel-desktop>

  <db-control-panel-mobile drawer-header-text="Verbindungssuche" burger-menu-label="Menü öffnen">
    <db-control-panel-skip-navigation
      slot="skipNavigation"
      text="Zum Inhalt springen"
    ></db-control-panel-skip-navigation>
    <db-control-panel-brand slot="brand">Verbindungssuche</db-control-panel-brand>
  </db-control-panel-mobile>

  <db-shell-content>
    <db-section width="large">
      <!-- HIER: <h1>, Formular und Ergebnisse -->
    </db-section>
  </db-shell-content>
</db-shell>
```

✔ Prüfen: Oben erscheint eine Kopfzeile „Verbindungssuche“. Macht das Fenster schmal: Kommt ein Menü-Button?

## 2. Eingabefelder

So sieht das Feld „Von“ vorher und nachher aus:

```html
<!-- vorher -->
<p>
  <label for="from">Von</label>
  <input id="from" name="from" type="text" list="stations" autocomplete="off" required aria-describedby="from-hint" />
  <small id="from-hint">Bahnhof oder Haltestelle, z. B. Frankfurt(Main)Hbf</small>
</p>

<!-- nachher -->
<db-input
  name="from"
  type="text"
  label="Von"
  message="Bahnhof oder Haltestelle, z. B. Frankfurt(Main)Hbf"
  invalid-message="Bitte gib einen Startbahnhof ein."
  autocomplete="off"
  required
></db-input>
```

- Beschriftung und Hinweis werden zu Attributen (`label`, `message`). `invalid-message` erscheint, wenn das Feld leer
  abgeschickt wird.
- ⚠️ **Kein `id`** an `db-…`-Elementen. DB UX gibt die `id` an das innere Feld weiter, dann gibt es sie doppelt und
  die Beschriftung funktioniert nicht mehr. `name` reicht.

Macht dasselbe mit „Nach“. Die `<datalist>` könnt ihr löschen, die Vorschläge kommen gleich per JavaScript.

## 3. Radio-Buttons

```html
<db-radio name="anchor" value="departure" label="Abfahrt" checked></db-radio>
<db-radio name="anchor" value="arrival" label="Ankunft"></db-radio>
```

Das `<fieldset>` mit `<legend>` bleibt drumherum.

## 4. Buttons

```html
<db-button type="button" icon="arrows_vertical" variant="ghost" no-text>
  Start und Ziel tauschen
  <db-tooltip>Start und Ziel tauschen</db-tooltip>
</db-button>

<db-button type="submit" variant="brand" icon="magnifying_glass">Verbindungen suchen</db-button>
```

`no-text` zeigt nur das Symbol. Der Text bleibt für Screenreader erhalten, der Tooltip zeigt ihn beim Draufzeigen.

## 5. Bahnhofsvorschläge

Ergänzt am Ende von **`main.js`**:

```js
const STATIONS = ["Frankfurt(Main)Hbf", "Köln Hbf", "Berlin Hbf", "Hamburg Hbf", "München Hbf"];
for (const field of document.querySelectorAll('db-input[name="from"], db-input[name="to"]')) {
  field.dataList = STATIONS;
}
```

## 6. Testen: Was ihr geschenkt bekommt

- Leeres Formular abschicken: Erscheinen eure `invalid-message`-Texte?
- Wieder nur mit Tastatur durch die Seite: Wo ist der Skip-Link? (Tipp: gleich nach dem Laden einmal <kbd>Tab</kbd>)
- Fenster schmal ziehen: Die Shell schaltet auf das Mobil-Menü um.

## 7. Dark Mode und Density: je ein Attribut

Ändert in **`index.html`** die erste Zeile nach `<!doctype html>`:

```html
<html lang="de" data-mode="dark"></html>
```

Speichern, Vorschau ansehen: Alles ist dunkel, und die Kontraste stimmen weiter. Ihr habt dafür keine einzige Farbe selbst festgelegt. Probiert danach `data-mode="light"`. Ohne das Attribut folgt die Seite der Einstellung eures Betriebssystems.

Jetzt die **Dichte**: Setzt an euer `<form …>` zusätzlich `data-density="functional"` (kompakt) oder `data-density="expressive"` (luftig). Abstände und Schriftgrößen passen sich an.

Danach entfernt ihr beide Attribute wieder oder lasst sie stehen, wie es euch gefällt.

Fertig? Dann weiter mit **AUFGABE-PLUS.md**. Die Aufgaben dort bauen auf eurem Stand auf.
