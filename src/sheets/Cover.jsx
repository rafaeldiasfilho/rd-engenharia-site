// Example document cover (report-style documents such as PGR, LTCAT, AVCB).

import { SHEET_BORDER, SHEET_GRAY, CREA, ISSUE_DATE, SHEET_BACKGROUND, Logo, RD_CNPJ, RESPONSIBLE_ENGINEER, SHEET_INK, SHEET_GREEN, clientFor, wrapText } from "../SheetBase";

// ── Sheets that look like real documents ──────────────────────────────────────────────────────
// Three formats, chosen by `m.layout` (field `exemplo` in src/paginas.js):
//  - "cover": report cover (technical reports, programmes, analyses), with a table of contents and an inner page;
//  - "drawingSheet": technical drawing with title block (plans, maps, schedule);
//  - "certificate": training certificate.

export function Cover({ m, area }) {
  const doc = m.doc || m.subtitle;
  const titleLines = wrapText(doc.toUpperCase(), 24).slice(0, 3);
  const [client, clientInfo] = clientFor(m, area);
  const summaryY = 52 + titleLines.length * 8 + 6;
  return (
    <g fontFamily="inherit">
      <Logo x={10} y={10} />
      <text x="140" y="15.6" fontSize="3.1" fill={SHEET_GRAY} textAnchor="end">
        {RD_CNPJ}
      </text>
      <text x="140" y="21" fontSize="3.1" fill={SHEET_GRAY} textAnchor="end">
        Ibirá/SP
      </text>
      <line x1="10" y1="29" x2="140" y2="29" stroke={SHEET_GREEN} strokeWidth="0.6" />
      <text x="10" y="42" fontSize="3.6" fontWeight="700" fill={SHEET_GREEN} letterSpacing="0.6">
        {(m.ref || m.title).toUpperCase()}
      </text>
      {titleLines.map((l, k) => (
        <text key={l} x="10" y={52 + k * 8} fontSize="6.6" fontWeight="700" fill={SHEET_INK} letterSpacing="0.1">
          {l}
        </text>
      ))}
      {m.contents && (
        <g>
          <text x="10" y={summaryY} fontSize="3.2" fontWeight="700" fill={SHEET_GRAY} letterSpacing="0.6">
            SUMÁRIO
          </text>
          {m.contents.slice(0, 3).map((s, k) => (
            <g key={s}>
              <text x="10" y={summaryY + 7 + k * 6.4} fontSize="3.8" fill={SHEET_INK}>
                {k + 1}. {s}
              </text>
              <text x="140" y={summaryY + 7 + k * 6.4} fontSize="3.8" fill={SHEET_GRAY} textAnchor="end">
                {[3, 4, 11][k]}
              </text>
            </g>
          ))}
        </g>
      )}
      <rect x="10" y="112" width="130" height="22" rx="2.5" fill={SHEET_BACKGROUND} />
      <text x="15" y="118.6" fontSize="3.1" fontWeight="700" fill={SHEET_GRAY} letterSpacing="0.6">
        CONTRATANTE
      </text>
      <text x="15" y="125" fontSize="4.8" fontWeight="700" fill={SHEET_INK}>
        {client}
      </text>
      <text x="15" y="130.4" fontSize="3.5" fill={SHEET_GRAY}>
        {clientInfo}
      </text>
      <text x="10" y="144" fontSize="3.1" fontWeight="700" fill={SHEET_GRAY} letterSpacing="0.6">
        RESPONSÁVEL TÉCNICO
      </text>
      <text x="10" y="150.6" fontSize="4.6" fontWeight="700" fill={SHEET_INK}>
        {RESPONSIBLE_ENGINEER}
      </text>
      <text x="10" y="156" fontSize="3.6" fill={SHEET_GRAY}>
        {CREA}
      </text>
      {m.art && (
        <g>
          <rect x="112" y="141" width="28" height="11" rx="5.5" fill="none" stroke={SHEET_GREEN} strokeWidth="1" />
          <text x="126" y="148.4" fontSize="5" fontWeight="700" fill={SHEET_GREEN} textAnchor="middle">
            ART
          </text>
        </g>
      )}
      <line x1="10" y1="180" x2="140" y2="180" stroke={SHEET_BORDER} strokeWidth="0.6" />
      <text x="10" y="187" fontSize="3.4" fill={SHEET_GRAY}>
        Ibirá/SP · {ISSUE_DATE}
      </text>
      <text x="140" y="187" fontSize="3.4" fill={SHEET_GRAY} textAnchor="end">
        Revisão 00 · Página 1
      </text>
    </g>
  );
}
