// DB UX Web Components registrieren (Bundle-Variante: keine weiteren Abhängigkeiten).
import { defineCustomElements } from "@db-ux/wc-core-components/bundle/index.js";

defineCustomElements();

// Bahnhofsvorschläge (statisch). db-input rendert daraus ein natives <datalist>.
// Achtung: Keine id an <db-input> & Co. setzen – wir wählen per name aus.
const STATIONS = ["Frankfurt(Main)Hbf", "Köln Hbf", "Berlin Hbf", "Hamburg Hbf", "München Hbf"];
for (const field of document.querySelectorAll('db-input[name="from"], db-input[name="to"]')) {
  field.dataList = STATIONS;
}

// Übung Block 4: Verbindungssuche laden – genau EINE der beiden Zeilen einkommentieren
// import("./suche.js");       // Basis
// import("./suche-plus.js");  // Plus
