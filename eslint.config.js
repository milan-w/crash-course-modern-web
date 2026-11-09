// ESLint (Flat Config)
//   pnpm lint app               → eure Arbeitskopie prüfen
//   pnpm lint steps/demo-fehler → findet die eingebauten Fehler
import js from "@eslint/js";
import angularTemplateParser from "@angular-eslint/template-parser";
import dbUx from "@db-ux/core-eslint-plugin";
import globals from "globals";

export default [
  { ignores: ["dist/**", ".backup/**", "test-results/**", "playwright-report/**", "*.tmp.js"] },

  // JavaScript: empfohlene Regeln + Browser- bzw. Node-Globals
  {
    files: ["**/*.js"],
    ...js.configs.recommended,
    languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: globals.browser },
    rules: {
      ...js.configs.recommended.rules,
      // innerHTML & Co. sind die häufigste XSS-Quelle → Warnung, damit man genau hinsieht
      "no-restricted-properties": [
        "error",
        { property: "innerHTML", message: "XSS-Gefahr: textContent oder DOM-APIs verwenden." },
        { property: "outerHTML", message: "XSS-Gefahr: DOM-APIs verwenden." },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
          message: "XSS-Gefahr: DOM-APIs verwenden.",
        },
      ],
    },
  },
  {
    files: ["scripts/**/*.js", "tests/**/*.js", "**/*.config.js"],
    languageOptions: { globals: globals.node },
  },

  // HTML: DB-UX-Regeln für Web Components (Parser versteht HTML-Templates)
  {
    files: ["**/*.html"],
    languageOptions: { parser: angularTemplateParser },
    plugins: { "db-ux": dbUx },
    rules: dbUx.configs.recommended.rules,
  },
];
