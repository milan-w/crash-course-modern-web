# Prompt-Muster für Web-Entwicklung

Diese Muster funktionieren mit **jedem DB-intern freigegebenen AI-Tool**: Chat, IDE-Assistent oder Agent. Ersetzt die
`<Platzhalter>` und kopiert den relevanten Code mit hinein, oder lasst ihn im Agent-Modus per Datei referenzieren.

> ⚠️ **Spielregeln**
>
> - Nur **freigegebene Tools** nutzen und die Vorgaben zur Datenklassifizierung beachten.
> - **Keine Secrets** (API-Keys, `.env`), keine personenbezogenen Daten und keine Kundendaten in Prompts.
> - AI-Ergebnisse sind **Vorschläge**: Lest den Code, lasst Tests und Linter laufen und prüft im Browser.
>   AI erfindet gern Props, ARIA-Attribute oder API-Felder, die es nicht gibt.

## Der Aufbau eines guten Prompts

| Baustein    | Beispiel                                                                   |
| ----------- | -------------------------------------------------------------------------- |
| **Rolle**   | „Du bist Expert:in für barrierefreie Web-Entwicklung (WCAG 2.2).“          |
| **Kontext** | „Vanilla JS, DB UX Design System v3 als Web Components, Vite, REST-API.“   |
| **Aufgabe** | „Prüfe den folgenden Code auf …“                                           |
| **Format**  | „Antworte als Tabelle: Problem · WCAG-Kriterium · Fundstelle · Fix.“       |
| **Grenzen** | „Ändere nichts am Verhalten. Nutze nur Komponenten, die es in DB UX gibt.“ |

## Kontext für DB UX mitgeben

Ohne Kontext rät die AI, wie DB-UX-Komponenten funktionieren. Mit Kontext nutzt sie die echte Dokumentation:

```bash
pnpm ai-context            # schreibt die Doku der installierten @db-ux-Pakete nach .github/copilot-instructions.md
```

- Viele Tools lesen `.github/copilot-instructions.md` automatisch. Bei anderen hängt ihr die Datei an oder kopiert
  den relevanten Abschnitt in den Prompt.
- Die Beispiele je Komponente liegen auch direkt unter `node_modules/@db-ux/wc-core-components/agent/*.md`.
- **MCP-fähige Tools** (Kiro, GitHub Copilot im Agent-Modus) holen sich die Doku direkt vom **DB UX MCP Server**
  (`@db-ux/mcp-server`). Die Konfiguration liegt schon bereit: `.vscode/mcp.json` (Copilot) bzw.
  `.kiro/settings/mcp.json` (Kiro). Schreibt dann in den Prompt „Nutze den DB UX MCP Server“.

---

## 1. Barrierefreiheits-Review

```text
Du bist Expert:in für digitale Barrierefreiheit (WCAG 2.2 AA, BITV 2.0).
Prüfe das folgende HTML/JS einer Verbindungssuche. Es nutzt DB UX Web Components
(<db-input>, <db-button> …), die intern native <input>/<button> rendern.

Achte besonders auf:
- zugängliche Namen von Buttons und Feldern
- Tastaturbedienung und Fokus-Management
- Ansage dynamischer Inhalte (Live-Regions, Lade- und Fehlerzustände)
- Fehlermeldungen in Formularen

Antworte als Tabelle: Problem · betroffenes WCAG-Kriterium · Fundstelle · konkreter Fix.
Markiere, was du NICHT sicher beurteilen kannst (z. B. Kontraste ohne gerendertes CSS).

<Code>
```

## 2. Security-Review

```text
Du bist Security-Reviewer:in für Frontend-Code.
Prüfe main.js auf: XSS (Datenfluss von URL, Formular und API ins DOM),
offengelegte Secrets, unsichere Weiterleitungen und fehlende Fehlerbehandlung.

Verfolge für jeden Fund den Weg der Daten von der Quelle (z. B. location.search)
bis zur Senke (z. B. innerHTML). Schlage den kleinsten sicheren Fix vor.

<Code>
```

## 3. Code erklären lassen

```text
Erkläre mir diesen Code für Einsteiger:innen in 5 Stichpunkten.
Was passiert, in welcher Reihenfolge, und warum? Welche Browser-APIs werden genutzt?
Wo könnte es Probleme geben (Race Conditions, Fehlerfälle)?

<Code>
```

## 4. Refactoring mit Leitplanken

```text
Refaktoriere die folgende Funktion für bessere Lesbarkeit.
Bedingungen:
- Verhalten bleibt exakt gleich (Ein- und Ausgaben, DOM-Struktur, ARIA-Attribute)
- keine neuen Abhängigkeiten
- Daten nur per textContent oder DOM-APIs ins DOM, kein innerHTML
Zeige zuerst einen Plan, dann den Code, dann was ich testen sollte.

<Code>
```

## 5. Tests generieren

```text
Schreibe Playwright-Tests für die Verbindungssuche (siehe tests/a11y.spec.js als Stilvorlage).
- Elemente über Rollen und Labels finden (getByRole, getByLabel), nicht über CSS-Klassen
- API-Antworten mit tests/fixtures/api.js (mockApi) simulieren
- Abdecken: Erfolg, leere Ergebnisse, API-Fehler, Tastaturbedienung
```

## 6. Komponente bauen lassen (mit DB-UX-Kontext)

```text
Nutze ausschließlich Komponenten aus @db-ux/wc-core-components (siehe copilot-instructions.md).
Baue einen Detail-Dialog für eine Verbindung (Abfahrt, Ankunft, Umstiege, Gleis).
- <db-dialog> mit Überschrift, Fokus beim Öffnen auf den Dialog, Escape schließt
- Öffnen per <db-button>, Text sichtbar oder per Tooltip
- Keine id an db-*-Komponenten (wird ans innere Element dupliziert)
Prüfe dein Ergebnis anschließend selbst gegen WCAG 2.2 AA.
```

---

## Ergebnis gegenprüfen

1. `pnpm lint app`: Hält sich der Code an die DB-UX-Regeln?
2. `pnpm test:a11y --project=app`: axe, Tastatur, XSS
3. Im Browser mit Tastatur und Screenreader testen
4. Bei Unsicherheit nachfragen: „Belege das mit der Stelle in der WCAG bzw. der DB-UX-Doku.“
