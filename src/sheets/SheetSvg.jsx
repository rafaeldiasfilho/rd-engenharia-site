// One example sheet as SVG: picks cover, drawing sheet or certificate, adds the reading pins and an accessible description.

import { useId } from "react";
import { BORDER, PAPER, ExampleStamp, RED } from "../SheetBase";
import { InnerPage } from "../DocDrawings";
import { DrawingSheet } from "./DrawingSheet.jsx";
import { Certificate } from "./Certificate.jsx";
import { Cover } from "./Cover.jsx";

export function Sheet({ x = 0, y = 0, rot = 0, m, area, page = "folha", uid }) {
  const Layout = m.layout === "prancha" ? DrawingSheet : m.layout === "certificado" ? Certificate : Cover;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="2" y="3" width="150" height="198" rx="3" fill="#000" opacity="0.1" />
      <rect width="150" height="198" rx="3" fill={PAPER} stroke={BORDER} />
      {page === "miolo" ? <InnerPage m={m} area={area} /> : <Layout m={m} area={area} uid={uid} />}
    </g>
  );
}

function Pins({ list }) {
  return (
    <g>
      {list.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4.4" fill={RED} stroke="#fff" strokeWidth="0.9" />
          <text x={p.x} y={p.y + 1.6} fontSize="4.4" fontWeight="700" fill="#fff" textAnchor="middle">
            {i + 1}
          </text>
        </g>
      ))}
    </g>
  );
}

const describe = (m, name, page) =>
  page === "miolo"
    ? `Página interna de exemplo de ${name}: ${(m.doc || m.subtitle).toLowerCase()}`
    : `Exemplo ilustrativo de ${name}: ${(m.doc || m.subtitle).toLowerCase()}`;

// The sheet (or the inner page of a cover), with the EXEMPLO stamp and, if requested, the "Como ler" points.
export function SheetSvg({ m, name, area, page = "folha", pins = null }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg className="sheet-svg" viewBox="0 -10 158 218" role="img" aria-label={describe(m, name, page)} focusable="false">
      <Sheet m={m} area={area} page={page} uid={uid} />
      {pins && <Pins list={pins} />}
      <ExampleStamp x={60} y={-3} />
    </svg>
  );
}
