# Übung Block 3 · Basis – Layout mit modernem CSS

**Ziel:** Ihr bringt Ordnung in die Seite und seht, was modernes CSS kann, ohne es von Grund auf zu schreiben.
Ihr arbeitet in **`layout.css`**. Dort stehen alle Regeln schon, nur auskommentiert.

**So geht's:** Abschnitt markieren → Kommentar entfernen (<kbd>Strg</kbd>+<kbd>#</kbd> bzw. <kbd>Cmd</kbd>+<kbd>/</kbd>)
→ speichern → Vorschau anschauen. Nehmt euch die Abschnitte der Reihe nach vor.

## 1. Abstände mit Design-Tokens

`var(--db-spacing-fixed-md)` ist ein **Design-Token**, ein Wert aus dem DB Design System. Werte, die man zentral
festlegt, statt überall `16px` zu schreiben. `--app-gap` ist unser eigener Name dafür (eine _Custom Property_).

✏️ Ändert `--app-gap` auf `var(--db-spacing-fixed-xl)`. Alle Abstände im Formular wachsen gleichzeitig.

## 2. Grid für das Formular

`display: grid` legt Elemente in Spalten und Zeilen. `1fr auto 1fr` heißt: Spalte 1 und 3 teilen sich den Platz,
die mittlere Spalte (Tauschen-Button) ist so breit wie nötig. `@media (width >= 40rem)` schaltet das erst ab einer
Mindestbreite ein. Auf dem Handy bleiben die Felder untereinander.

✏️ Zieht das Vorschaufenster schmal und wieder breit (oder DevTools → Gerätemodus).

## 3. Ergebnisliste

`repeat(auto-fill, minmax(18rem, 1fr))` heißt: so viele Spalten, wie mit mindestens 18rem Breite nebeneinander
passen. Ganz ohne Media Query!

✏️ Ändert `--app-card-min` auf `30rem`.

## 4. Fehler sichtbar machen mit `:has()`

`db-input:has(input:user-invalid)` bedeutet: „das `db-input`, das ein ungültiges Feld enthält“. Eltern-Elemente
können so auf ihren Inhalt reagieren. `:user-invalid` greift erst, nachdem jemand das Feld benutzt oder das Formular
abgeschickt hat.

✏️ Leeres Formular abschicken.

## 5. Ergebnis-Cards

✏️ Probiert andere Schriftgrößen-Tokens aus: `--db-type-headline-lg`, `--db-type-body-lg`.

## Testen

- **Zoom auf 200 %** (<kbd>Strg</kbd>+<kbd>+</kbd>): Muss man irgendwo seitlich scrollen?
- DevTools → Elements: Klickt auf eine Card und schaut rechts unter „Styles“, welche Regeln wirken. Ihr könnt Werte
  dort auch direkt ändern, zum Ausprobieren ohne Speichern.

Fertig? Dann probiert **AUFGABE-PLUS.md**: dieselben Regeln selbst schreiben.
