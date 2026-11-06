// One example sheet as SVG: picks cover, drawing sheet or certificate, adds the reading pins and an accessible description.

import { useId } from "react";
import { SHEET_BORDER, SHEET_PAPER, ExampleStamp, SHEET_RED } from "../SheetBase";
import { InnerPage } from "../DocDrawings";
import { DrawingSheet } from "./DrawingSheet.jsx";
import { Certificate } from "./Certificate.jsx";
import { Cover } from "./Cover.jsx";

export function SheetByLayout({ x = 0, y = 0, rot = 0, m, area, page = "sheet", uid }) {
  const Layout = m.layout === "drawingSheet" ? DrawingSheet : m.layout === "certificate" ? Certificate : Cover;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="2" y="3" width="150" height="198" rx="3" fill="#000" opacity="0.1" />
      <rect width="150" height="198" rx="3" fill={SHEET_PAPER} stroke={SHEET_BORDER} />
      {page === "innerPage" ? <InnerPage m={m} area={area} /> : <Layout m={m} area={area} uid={uid} />}
    </g>
  );
}

function ReadingPins({ list }) {
  return (
    <g>
      {list.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4.4" fill={SHEET_RED} stroke="#fff" strokeWidth="0.9" />
          <text x={p.x} y={p.y + 1.6} fontSize="4.4" fontWeight="700" fill="#fff" textAnchor="middle">
            {i + 1}
          </text>
        </g>
      ))}
    </g>
  );
}

const describeSheet = (m, name, page) =>
  page === "innerPage"
    ? `Página interna de exemplo de ${name}: ${(m.doc || m.subtitle).toLowerCase()}`
    : `Exemplo ilustrativo de ${name}: ${(m.doc || m.subtitle).toLowerCase()}`;

// The sheet (or the inner page of a cover), with the EXEMPLO stamp and, if requested, the "Como ler" points.
export function SheetSvg({ m, name, area, page = "sheet", pins = null }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg className="sheet-svg" viewBox="0 -10 158 218" role="img" aria-label={describeSheet(m, name, page)} focusable="false">
      <SheetByLayout m={m} area={area} page={page} uid={uid} />
      {pins && <ReadingPins list={pins} />}
      <ExampleStamp x={60} y={-3} />
    </svg>
  );
}
