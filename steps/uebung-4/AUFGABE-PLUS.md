# Übung Block 4 · Plus – Weiterbauen und absichern

**Voraussetzung:** AUFGABE-BASIS.md ist fertig: Die Suche zeigt Verbindungen, die XSS-Lücke ist geschlossen. Hier
baut ihr in **`suche.js`** und **`index.html`** weiter, mit weniger Vorgaben.

## 1. Werkzeuge finden die Lücke auch

Der Linter hätte euch die XSS-Lücke schon vorher gezeigt.

1. Macht euren Fix aus Schritt 5 kurz rückgängig (<kbd>Strg</kbd>+<kbd>Z</kbd>) und startet im Terminal
   `npm run lint` (StackBlitz) bzw. `pnpm lint app` (lokal). Welche Regel meldet sich, und in welcher Zeile?
2. Fix wieder einbauen, Linter erneut starten: Ist die Meldung weg?

## 2. Ein „Jetzt“-Button

Neben „Datum und Uhrzeit“ soll ein Button die aktuelle Uhrzeit einsetzen.

- Baut ihn als `<db-button>` mit dem Symbol `clock`, nur als Icon (wie der Tauschen-Button), mit Tooltip.
- In `suche.js` gibt es schon `nowAsInputValue()` und `setValue(name, value)`. Schaut euch an, wie der
  Tauschen-Button (Abschnitt 4) seinen Klick behandelt, und macht es genauso.
- ⚠ Welchen `type` braucht der Button, damit er nicht das Formular abschickt? Und welchen Namen hört ein
  Screenreader?

✔ Prüfen: Accessibility-Baum in den DevTools (Elements → neben Styles → Accessibility): Rolle `button`, Name „Jetzt“?

## 3. Was schickt das Formular eigentlich?

DevTools → **Network**. Sucht einmal mit „Ankunft“ und einmal mit „Nur Direktverbindungen“.

- Welche Parameter stehen in der Anfrage an `trips`? Vergleicht mit `searchTrips` in `api.js`.
- Das Formular schickt per GET ab: Die Suche steht in der Adresse. Kopiert sie in einen neuen Tab. Warum ist das
  praktisch, und warum musste die Überschrift deshalb gegen XSS geschützt werden?

## 4. Der Fehlerfall

Sucht nach einem Bahnhof, den es nicht gibt, z. B. „Atlantis“.

- Was steht in der Live-Region (`#status`)? Hört man das mit dem Screenreader?
- Schaut in `api.js`: Wo entsteht die Fehlermeldung? Formuliert sie so um, dass Nutzende wissen, was sie tun können.

## 5. Tests laufen lassen (nur lokal)

```bash
pnpm test:install                  # einmalig
pnpm test:a11y --project=app       # axe + Playwright, inklusive XSS-Test
```

Welche Tests prüfen etwas, das ihr heute gebaut habt?

Noch Zeit? Weitere Zusatzherausforderungen für Block 4 stehen in `challenges.md` im Übungs-Repo.
