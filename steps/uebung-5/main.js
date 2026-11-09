// DB UX Web Components registrieren (Bundle-Variante: keine weiteren Abhängigkeiten).
import { defineCustomElements } from "@db-ux/wc-core-components/bundle/index.js";

defineCustomElements();

// Bahnhofsvorschläge (statisch aus Block 2). db-input rendert daraus ein natives <datalist>.
const STATIONS = ["Frankfurt(Main)Hbf", "Köln Hbf", "Berlin Hbf", "Hamburg Hbf", "München Hbf"];
for (const field of document.querySelectorAll('db-input[name="from"], db-input[name="to"]')) {
  field.dataList = STATIONS;
}

// Block 4: Verbindungssuche laden – erst jetzt, da die DB-Komponenten registriert sind
import("./suche.js");
