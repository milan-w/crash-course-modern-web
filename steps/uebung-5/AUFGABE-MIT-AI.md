# Übung Block 5 · Mit AI-Tool – DB UX MCP im Einsatz

**Ziel:** Ihr erweitert die fertige Verbindungssuche mit einem AI-Assistenten (Kiro oder GitHub Copilot). Damit die
AI keine Komponenten erfindet, bekommt sie über den **DB UX MCP Server** die echte Doku von DB UX.

> ⚠️ **Spielregeln:** Nur freigegebene AI-Tools nutzen. Microsoft 365 Copilot ist nicht für Code freigegeben, nehmt
> dann den Weg „ohne AI-Tool“ (`AUFGABE-OHNE-AI.md`). Keine Zugangsdaten und keine internen Daten in
> Prompts. AI-Ergebnisse sind Vorschläge: lesen, prüfen, testen.

Das geht nur **lokal**, StackBlitz kann keine MCP-Server starten.

## 1. Vorbereiten

```bash
pnpm step 5     # fertigen Stand nach app/ kopieren
pnpm dev         # → http://localhost:5173
```

Öffnet den Ordner **`exercises/`** in eurem Editor. Die MCP-Konfiguration liegt schon bereit:

- **GitHub Copilot (VS Code):** `.vscode/mcp.json`. Im Chat den Modus **Agent** wählen, über das Werkzeug-Symbol
  den Server `db-ux` aktivieren (ggf. „Start“ in der `mcp.json` anklicken).
- **Kiro:** `.kiro/settings/mcp.json`. Der Server `db-ux` erscheint unter `/mcp`.

✔ Prüfen, ob die AI den Server nutzt:

```text
Welche Props hat die DB-UX-Komponente notification? Nutze dafür den DB UX MCP Server
und nenne die Quelle.
```

Die Antwort sollte z. B. `semantic` und `headline` nennen und angeben, dass sie vom MCP-Server stammt.

## 2. Aufgabe: Fehler sichtbar machen

Sucht nach **Xyz → Köln Hbf**. Den Fehler sagt bisher nur die Statuszeile an. Gebt eurer AI diesen Prompt:

```text
Du arbeitest in app/ (Vanilla JS, DB UX Web Components, Vite). Nutze den DB UX MCP Server.
Aufgabe: Wenn die Suche in app/suche.js fehlschlägt, zeige zusätzlich zur Statuszeile eine
<db-notification semantic="critical"> mit Überschrift und der Fehlermeldung über der Ergebnisliste.
Bei der nächsten erfolgreichen Suche verschwindet sie wieder.
Grenzen:
- keine id an db-*-Komponenten, Daten nur per textContent (kein innerHTML)
- die bestehende Live-Region (#status) bleibt die einzige Ansage für Screenreader
- keine neuen Abhängigkeiten
Zeige zuerst einen kurzen Plan, dann die Änderungen.
```

## 3. Ergebnis prüfen

1. Im Browser: Xyz → Köln Hbf, danach Frankfurt(Main)Hbf → Köln Hbf. Erscheint und verschwindet die Meldung?
2. `pnpm lint app`: Hält sich der Code an die DB-UX-Regeln?
3. `pnpm test:a11y --project=app` (einmalig vorher `pnpm test:install`): axe, Tastatur, XSS
4. Hat die AI etwas erfunden? Fragt nach: „Belege jedes Attribut von db-notification mit dem MCP-Server.“

## 4. Noch Zeit?

- **Dunkelmodus-Schalter:** Lasst die AI Zusatzherausforderung 2.1 umsetzen (`db-switch` → `data-mode`).
  Vergleicht mit der Lösung in `challenges.md`.
- **Mit und ohne MCP:** Stellt dieselbe Frage einmal mit deaktiviertem Server. Was ist anders?
- Weitere Prompt-Muster: `cheatsheets/prompts.md`
