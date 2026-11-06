// Example drawing sheet with title block (plans, maps).

import { GRAY, CREA, Logo, RESPONSIBLE_ENGINEER, INK, clientFor, wrapText } from "../SheetBase";
import { Drawing } from "../DocDrawings";

export function DrawingSheet({ m, area, uid }) {
  const doc = m.doc || m.subtitle;
  const [client, clientInfo] = clientFor(m, area);
  const titleLines = wrapText(doc, 30).slice(0, 2);
  const cell = (x, y, label, value, w) => (
    <g>
      <text x={x + 2.4} y={y + 4.6} fontSize="2.7" fontWeight="700" fill={GRAY} letterSpacing="0.4">
        {label}
      </text>
      <text x={x + 2.4} y={y + 10} fontSize="3.4" fontWeight="600" fill={INK}>
        {value}
      </text>
      {w && <line x1={x + w} y1={y} x2={x + w} y2={y + 13} stroke={INK} strokeWidth="0.4" />}
    </g>
  );
  return (
    <g fontFamily="inherit">
      <rect x="5" y="5" width="140" height="188" fill="none" stroke={INK} strokeWidth="0.6" />
      <Drawing type={m.body} uid={uid} />
      <g stroke={INK} strokeWidth="0.4" fill="none">
        <rect x="5" y="126" width="140" height="67" strokeWidth="0.6" />
        <line x1="5" y1="141" x2="145" y2="141" />
        <line x1="5" y1="154" x2="145" y2="154" />
        <line x1="5" y1="167" x2="145" y2="167" />
        <line x1="5" y1="180" x2="145" y2="180" />
        <line x1="52" y1="126" x2="52" y2="141" />
      </g>
      <Logo x={8} y={129.6} s={0.62} />
      <text x="54.4" y="130.6" fontSize="2.7" fontWeight="700" fill={GRAY} letterSpacing="0.4">
        TÍTULO
      </text>
      {titleLines.map((l, k) => (
        <text key={l} x="54.4" y={135.6 + k * 4} fontSize="3.6" fontWeight="700" fill={INK}>
          {l}
        </text>
      ))}
      {cell(5, 141, "CLIENTE", `${client} · ${clientInfo}`)}
      {cell(5, 154, "CONTEÚDO", m.ref || m.subtitle)}
      {cell(5, 167, "RESPONSÁVEL TÉCNICO", `${RESPONSIBLE_ENGINEER} · ${CREA}`)}
      {cell(5, 180, "ESCALA", m.scale || "Indicada", 35)}
      {cell(40, 180, "DATA", "10/2026", 35)}
      {cell(75, 180, "FOLHA", "01/03", 35)}
      {cell(110, 180, "ART", m.art ? "Sim" : "—")}
    </g>
  );
}
