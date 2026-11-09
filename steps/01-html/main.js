// DB UX Web Components registrieren (Bundle-Variante: keine weiteren Abhängigkeiten).
// Danach funktionieren <db-button>, <db-input> & Co. überall im HTML.
import { defineCustomElements } from "@db-ux/wc-core-components/bundle/index.js";

defineCustomElements();
