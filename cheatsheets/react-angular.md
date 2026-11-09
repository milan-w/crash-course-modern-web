# Spickzettel: Web Components ↔ React ↔ Angular

Alle Beispiele im Workshop nutzen `@db-ux/wc-core-components`. Wer lieber in React oder Angular arbeitet, nimmt die
passenden Wrapper – **Props, Varianten und Styles sind identisch**, nur die Schreibweise unterscheidet sich.

## Installation

```bash
# Web Components (Workshop-Standard)
pnpm add @db-ux/wc-core-components @db-ux/core-components @db-ux/core-foundations

# React
pnpm add @db-ux/react-core-components

# Angular
pnpm add @db-ux/ngx-core-components
```

Styles in allen drei Fällen gleich (siehe `steps/*/styles.css`):

```css
@layer whitelabel-theme, db-ux;
@import "@db-ux/core-foundations/build/styles/theme/rollup.css" layer(whitelabel-theme);
@import "@db-ux/core-components/build/styles/bundle.css" layer(db-ux);
```

Vite 8: `build.cssMinify: "esbuild"` setzen (siehe `vite.config.js`). Ein eigenes React/Angular-Projekt legt ihr am
besten neben `exercises/` an. Für Vite-basierte Projekte (React, Vue) könnt ihr die Beispiel-API übernehmen:
`demo-api.js` kopieren und das Plugin `demoApi()` aus `vite.config.js` eintragen.

## Komponenten-Mapping

| Web Component (HTML)                         | React (JSX)                                | Angular (Template)                          |
| -------------------------------------------- | ------------------------------------------ | ------------------------------------------- |
| `<db-button variant="brand">`                | `<DBButton variant="brand">`               | `<db-button variant="brand">`               |
| `<db-button icon="x" no-text>`               | `<DBButton icon="x" noText>`               | `<db-button icon="x" [noText]="true">`      |
| `<db-input label="Von" invalid-message="…">` | `<DBInput label="Von" invalidMessage="…">` | `<db-input label="Von" invalidMessage="…">` |
| `el.dataList = [...]` (JS-Property)          | `<DBInput dataList={stations}>`            | `<db-input [dataList]="stations">`          |
| `<db-radio name="anchor" …>`                 | `<DBRadio name="anchor" …>`                | `<db-radio name="anchor" …>`                |
| `<db-select label="…"><option>…`             | `<DBSelect label="…"><option>…`            | `<db-select label="…"><option>…`            |
| `<db-notification semantic="critical">`      | `<DBNotification semantic="critical">`     | `<db-notification semantic="critical">`     |
| `<db-card>`, `<db-tag>`                      | `<DBCard>`, `<DBTag>`                      | `<db-card>`, `<db-tag>`                     |

Attribute in Kebab-Case (`invalid-message`) ↔ Props in camelCase (`invalidMessage`).

## Shell

```html
<!-- Web Components -->
<db-shell>
  <db-control-panel-desktop>
    <db-control-panel-skip-navigation
      slot="skipNavigation"
      text="Zum Inhalt springen"
    ></db-control-panel-skip-navigation>
    <db-control-panel-brand slot="brand">Verbindungssuche</db-control-panel-brand>
    <db-control-panel-actions-2 slot="actions2">…</db-control-panel-actions-2>
  </db-control-panel-desktop>
  <db-control-panel-mobile drawer-header-text="Verbindungssuche" burger-menu-label="Menü öffnen"
    >…</db-control-panel-mobile
  >
  <db-shell-content>…</db-shell-content>
</db-shell>
```

```tsx
// React: benannte Slots sind Props
<DBShell>
  <DBControlPanelDesktop
    skipNavigation={<DBControlPanelSkipNavigation text="Zum Inhalt springen" />}
    brand={<DBControlPanelBrand>Verbindungssuche</DBControlPanelBrand>}
    actions2={<DBControlPanelActions2>…</DBControlPanelActions2>}
  />
  <DBControlPanelMobile drawerHeaderText="Verbindungssuche" burgerMenuLabel="Menü öffnen" brand={…} />
  <DBShellContent>…</DBShellContent>
</DBShell>
```

```html
<!-- Angular: benannte Slots per Content Projection (Attribut) -->
<db-shell>
  <db-control-panel-desktop>
    <db-control-panel-skip-navigation skip-navigation text="Zum Inhalt springen" />
    <db-control-panel-brand brand>Verbindungssuche</db-control-panel-brand>
    <db-control-panel-actions-2 actions-2>…</db-control-panel-actions-2>
  </db-control-panel-desktop>
  …
</db-shell>
```

## Events & Formulare

| Zweck           | Web Components                                | React                                | Angular                                |
| --------------- | --------------------------------------------- | ------------------------------------ | -------------------------------------- |
| Klick           | `el.addEventListener("click", …)`             | `onClick={…}`                        | `(click)="…"`                          |
| Eingabe         | `input`-Event (bubbelt vom inneren `<input>`) | `onInput={(e) => …}`                 | `(input)="…"`                          |
| Wert lesen      | `new FormData(form).get("from")`              | controlled: `value` + `onChange`     | `[(ngModel)]` oder `[formControl]`     |
| Switch/Checkbox | `change`-Event, `event.target.checked`        | `onChange={(e) => e.target.checked}` | `(change)="x = $event.target.checked"` |

Tipp: Die Web Components rendern **natives `<input>`, `<select>` usw. im Light DOM**. Deshalb funktionieren
`<form>`, `FormData`, `required` und `:user-invalid` ganz normal.

## Stolperfallen

- **Keine `id` an `db-*`-Hosts** in Vanilla: Sie wird ans innere Element weitergereicht und ist dann doppelt.
  Elemente per `name` oder eigener Klasse finden.
- **`type` am Button immer setzen** (`button` / `submit`), sonst schickt jeder Button das Formular ab.
- ESLint-Regeln für alle drei Varianten: `@db-ux/core-eslint-plugin` (siehe `eslint.config.js`).
