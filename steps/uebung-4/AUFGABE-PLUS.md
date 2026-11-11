# Übung Block 4 · Plus – Weiterbauen und absichern

**Voraussetzung:** AUFGABE-BASIS.md ist fertig: Die Suche zeigt Verbindungen, die XSS-Lücke ist geschlossen. Hier
baut ihr in **`suche.js`** und **`index.html`** weiter, mit weniger Vorgaben.

## 1. Ein „Jetzt“-Button

Neben „Datum und Uhrzeit“ soll ein Button die aktuelle Uhrzeit einsetzen.

- Baut ihn als `<db-button>` mit dem Symbol `clock`, nur als Icon (wie der Tauschen-Button), mit Tooltip.
- In `suche.js` gibt es schon `nowAsInputValue()` und `setValue(name, value)`. Schaut euch an, wie der
  Tauschen-Button (Abschnitt 4) seinen Klick behandelt, und macht es genauso.
- ⚠ Welchen `type` braucht der Button, damit er nicht das Formular abschickt? Und welchen Namen hört ein
  Screenreader?

✔ Prüfen: Accessibility-Baum in den DevTools (Elements → neben Styles → Accessibility): Rolle `button`, Name „Jetzt“?

## 2. Was schickt das Formular eigentlich?

DevTools → **Network**, gefiltert wie in der Basis-Übung (Fetch/XHR, `api/v1`). Sucht einmal mit „Ankunft“ und
einmal mit „Nur Direktverbindungen“.

- Welche Parameter stehen in der Anfrage an `trips`? Vergleicht mit `searchTrips` in `api.js`.
- Das Formular schickt per GET ab: Die Suche steht in der Adresse. Kopiert sie in einen neuen Tab. Warum ist das
  praktisch, und warum musste die Überschrift deshalb gegen XSS geschützt werden?

## 3. Der Fehlerfall

Sucht nach einem Bahnhof, den es nicht gibt, z. B. „Atlantis“.

- Was steht in der Live-Region (`#status`)? Hört man das mit dem Screenreader?
- Schaut in `api.js`: Wo entsteht die Fehlermeldung? Formuliert sie so um, dass Nutzende wissen, was sie tun können.

## 4. Werkzeuge finden die Lücke auch (nur lokal)

In StackBlitz laufen keine Terminal-Befehle. Diese Aufgabe geht nur mit dem lokalen Setup (`pnpm step 4`).

**Linter:** Er hätte euch die XSS-Lücke schon vorher gezeigt.

1. Macht euren Fix aus Schritt 5 der Basis-Übung kurz rückgängig (<kbd>Strg</kbd>+<kbd>Z</kbd>) und startet
   `pnpm lint app`. Welche Regel meldet sich, und in welcher Zeile?
2. Fix wieder einbauen, Linter erneut starten: Ist die Meldung weg?

**Tests:** Playwright steuert für die Tests einen eigenen Browser. Den lädt ihr einmalig herunter (mehrere 100 MB,
dauert einen Moment):

```bash
pnpm test:install                  # einmalig: Test-Browser herunterladen
pnpm test:a11y --project=app       # axe + Playwright, inklusive XSS-Test
```

Kommt `Executable doesn't exist …` mit dem Hinweis `npx playwright install`? Dann fehlt der Test-Browser noch, oder
er passt nicht mehr zur Playwright-Version. Führt `pnpm test:install` aus (nicht `npx`, das würde ggf. eine andere
Version holen) und startet die Tests erneut.

Welche Tests prüfen etwas, das ihr heute gebaut habt?

Noch Zeit? Weitere Zusatzherausforderungen für Block 4 stehen in `challenges.md` im Übungs-Repo.
