# Übung Block 2 · Plus – Aus HTML wird eine DB-App

**Ziel:** Das Formular aus Block 1 mit dem DB UX Design System umsetzen. Doku je Komponente:
`node_modules/@db-ux/wc-core-components/agent/*.md` (lokal) bzw. design-system.deutschebahn.com.

1. Seitenrahmen auf `<db-shell>` umstellen. Die Kopiervorlage steht in **AUFGABE-BASIS.md**, Schritt 1. Sie ersetzt
   Skip-Link, `<header>`, `<main>` und `<footer>`. `db-shell-content` rendert `<main>` selbst.
2. Felder ersetzen: `<db-input>`, `<db-radio>`, `<db-checkbox>`
   - `label`-Attribut statt `<label>`, `invalid-message` für Pflichtfelder
   - ⚠️ **keine `id`** an `db-…`-Komponenten (wird ans innere Element dupliziert), `name` reicht
3. Tauschen-Button: `<db-button type="button" icon="arrows_vertical" variant="ghost" no-text>` mit Text und
   `<db-tooltip>`
4. Submit: `<db-button type="submit" variant="brand">`
5. Unter dem Formular ein Hinweis: `<db-notification semantic="informational" headline="Hinweis">`
6. Ergebnisse: zwei statische `<db-card class="trip">` in einer `<ol class="trip-list">`, Zugnummern als
   `<db-tag semantic="informational">`. Vorlage für eine Card:

   ```html
   <li>
     <db-card class="trip">
       <h3 class="trip-times"><time>08:13</time> – <time>09:17</time></h3>
       <p class="trip-meta">Dauer 1 h 4 min · Direkt</p>
       <ul class="trip-legs" aria-label="Verkehrsmittel">
         <li><db-tag semantic="informational">ICE 123</db-tag></li>
       </ul>
       <p class="trip-route">Frankfurt(Main)Hbf → Köln Hbf</p>
     </db-card>
   </li>
   ```

7. `main.js`: Bahnhofsvorschläge per `field.dataList = [...]`, ersetzt die `<datalist>`
8. Modus und Dichte: `data-mode="dark"` an `<html>`, `data-density="functional"` bzw. `"expressive"` an einzelnen
   Bereichen. Was passiert mit Abständen und Farben, und warum klappt das nur mit DB-Tokens?

**Testen:** Shell in schmaler Ansicht (DevTools-Gerätemodus, 390 px), leeres Formular abschicken, Tastatur.

Schneller fertig? Zusatzherausforderungen für Block 2 stehen in `challenges.md` im Übungs-Repo (Übersicht im Anhang der Folien).
