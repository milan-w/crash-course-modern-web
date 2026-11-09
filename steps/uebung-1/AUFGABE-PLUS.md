# Übung Block 1 · Plus – Mehr aus HTML herausholen

**Voraussetzung:** AUFGABE-BASIS.md ist fertig. Hier baut ihr auf eurem Formular auf. Es gibt weniger Code zum Kopieren: Schlagt nach, probiert aus, besprecht in der Gruppe. Gute Quelle: [MDN Web Docs](https://developer.mozilla.org/de/).

## 1. Datum und Uhrzeit

Ergänzt im `<fieldset>` „Zeitpunkt“ ein Pflichtfeld für Datum und Uhrzeit mit dem Label „Datum und Uhrzeit“
(`name="datetime"`).

- Welcher `type` bringt eine Datums- und Zeitauswahl mit, ganz ohne JavaScript?
- ✔ Prüfen: Bedient die Auswahl nur mit der Tastatur. Wie kommt ihr in Stunden und Minuten?

## 2. Weitere Optionen zum Aufklappen

Unter dem Fieldset: ein aufklappbarer Bereich „Weitere Optionen“ mit einer Checkbox „Nur Direktverbindungen“
(`name="direct"`).

- Tipp: `<details>` und `<summary>`. Es gibt also keinen eigenen Button und kein JavaScript.
- ✔ Prüfen: Lässt sich der Bereich mit <kbd>Enter</kbd> oder <kbd>Leertaste</kbd> öffnen?

## 3. Der Accessibility-Baum

DevTools (<kbd>F12</kbd>) → **Elements** → im Untermenü neben **Styles** → **Accessibility**. Klickt nacheinander auf jedes Feld und jeden Button.

- Hat jedes Element eine **Rolle** (z. B. `textbox`, `radio`) und einen **Namen**?
- Woher kommt der Name des Tauschen-Buttons, woher der des Felds „Von“?
- Entfernt testweise `for="from"` am Label. Was ändert sich im Baum, und was beim Klick auf das Wort „Von“?

## 4. Bessere Fehlermeldungen

Schickt das leere Formular ab und lest die Meldung des Browsers.

- Ergänzt an „Von“ und „Nach“ `minlength="2"` und tippt nur einen Buchstaben. Was meldet der Browser jetzt?
- Wie hilft `aria-describedby` am Feld „Von“ Screenreader-Nutzenden?

## 5. Mit Screenreader hören (wer mag)

Windows: Sprachausgabe mit <kbd>Strg</kbd>+<kbd>Win</kbd>+<kbd>Enter</kbd> starten und wieder beenden. macOS: VoiceOver mit <kbd>Cmd</kbd>+<kbd>F5</kbd>. Geht mit <kbd>Tab</kbd> durch das Formular. Wird jedes Feld verständlich
angesagt, auch die Radio-Gruppe mit ihrer Legende?

Noch Zeit? Weitere Zusatzherausforderungen für Block 1 stehen in `challenges.md` im Übungs-Repo.
