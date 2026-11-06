// Enlarged sheet: cover or drawing sheet, inner page (covers only), "Como ler" with numbered points, and zoom.

import { useState } from "react";
import { PINS, HAS_INNER_PAGE } from "../DocDrawings";
import { SheetSvg } from "./SheetSvg.jsx";

// Enlarged sheet: cover or drawing sheet, inner page (covers only), "Como ler" with numbered points, and zoom.
export function SheetReader({ m, name, area }) {
  const [view, setView] = useState("folha");
  const [zoom, setZoom] = useState(false);
  const hasInnerPage = m.layout === "capa" && HAS_INNER_PAGE.has(m.body);
  const pins = view === "ler" ? PINS[m.layout] || PINS.capa : null;
  const tabs = [
    ["folha", m.layout === "capa" ? "Capa" : m.layout === "certificado" ? "Certificado" : "Prancha"],
    ...(hasInnerPage ? [["miolo", "Página interna"]] : []),
    ["ler", "Como ler"],
  ];
  return (
    <div className="sheet-reading" data-zoom={zoom ? "" : undefined}>
      <div className="sheet-reading-bar">
        <div className="sheet-tabs" role="group" aria-label="O que ver na folha">
          {tabs.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={view === id} onClick={() => setView(id)}>
              {label}
            </button>
          ))}
        </div>
        <button type="button" className="sheet-zoom" aria-pressed={zoom} onClick={() => setZoom((z) => !z)}>
          {zoom ? "Reduzir" : "Ampliar"}
        </button>
      </div>
      <div className="sheet-reading-area" tabIndex={zoom ? 0 : undefined} aria-label={zoom ? "Folha ampliada: role para ver as partes" : undefined}>
        <SheetSvg m={m} name={name} area={area} page={view === "miolo" ? "miolo" : "folha"} pins={pins} />
      </div>
      {pins && (
        <ol className="sheet-pins">
          {pins.map((p, i) => (
            <li key={i}>
              <span aria-hidden="true">{i + 1}</span>
              {p.t}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
