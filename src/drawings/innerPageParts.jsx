// Shared pieces of the example inner pages: status chips, tables, checklists and paragraphs.

import { AMBER, BLUE, BORDER, GRAY, BACKGROUND, LINE, INK, GREEN, RED, wrapText } from "../SheetBase";
import { Tx } from "./drawingParts.jsx";

const STATUS_COLOR = {
  Baixo: GREEN,
  Moderado: AMBER,
  Médio: AMBER,
  Alto: RED,
  Conforme: GREEN,
  Pendente: AMBER,
  Enviado: GREEN,
  "Em andamento": AMBER,
  Exigida: BLUE,
  "Acima do limite": RED,
  "Abaixo do limite": GREEN,
  "Sem exposição": GREEN,
  "Insalubre, grau médio": RED,
  "Não insalubre": GREEN,
  "Não perigoso": GREEN,
  Concluído: GREEN,
  "Em análise": AMBER,
  Aguardando: GRAY,
  Protocolada: BLUE,
};

export function Chip({ x, y, t, s = 2.1 }) {
  const color = STATUS_COLOR[t] || GRAY;
  const w = t.length * s * 0.6 + 3;
  return (
    <g>
      <rect x={x} y={y - s - 0.4} width={w} height={s + 2.2} rx="1.4" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.35" />
      <text x={x + 1.5} y={y + 0.2} fontSize={s} fontWeight="700" fill={color}>
        {t}
      </text>
    </g>
  );
}

// Table with a header; cells with up to two lines. A cell { chip: "Alto" } becomes a colored tag.
export function Table({ x = 10, y, cols, rows, rowHeight = 9.6, s = 2.3 }) {
  const xs = [x];
  cols.forEach((c) => xs.push(xs[xs.length - 1] + c.w));
  const W = xs[xs.length - 1] - x;
  return (
    <g>
      <rect x={x} y={y} width={W} height="7" fill={BACKGROUND} />
      {cols.map((c, i) => (
        <text key={c.t} x={xs[i] + 1.4} y={y + 4.7} fontSize={s} fontWeight="700" fill={GRAY}>
          {c.t}
        </text>
      ))}
      {rows.map((row, r) => {
        const yy = y + 7 + r * rowHeight;
        return (
          <g key={r}>
            <line x1={x} y1={yy} x2={x + W} y2={yy} stroke={LINE} strokeWidth="0.4" />
            {row.map((cell, i) =>
              cell && typeof cell === "object" ? (
                <Chip key={i} x={xs[i] + 1.2} y={yy + 4.4} t={cell.chip} s={s * 0.9} />
              ) : (
                wrapText(cell, Math.max(5, Math.floor((cols[i].w - 2.4) / (s * 0.5))))
                  .slice(0, 2)
                  .map((t, k) => (
                    <text key={`${i}-${k}`} x={xs[i] + 1.4} y={yy + 3.8 + k * (s + 0.9)} fontSize={s} fill={INK}>
                      {t}
                    </text>
                  ))
              )
            )}
          </g>
        );
      })}
      <line x1={x} y1={y + 7 + rows.length * rowHeight} x2={x + W} y2={y + 7 + rows.length * rowHeight} stroke={BORDER} strokeWidth="0.5" />
    </g>
  );
}

export function Checklist({ y, items }) {
  return (
    <g>
      {items.map(([t, status, note], k) => {
        const yy = y + k * 10.4;
        const done = ["Conforme", "Enviado", "Concluído", "Exigida"].includes(status);
        return (
          <g key={t}>
            <rect x="10" y={yy - 3.4} width="4.4" height="4.4" rx="1" fill="none" stroke={GREEN} strokeWidth="0.6" />
            {done && <path d={`M11 ${yy - 1.2}l1.2 1.2 2-2.6`} fill="none" stroke={GREEN} strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />}
            <Tx x={18} y={yy} s={2.7}>
              {t}
            </Tx>
            {note && (
              <Tx x={18} y={yy + 3.6} s={2.2} c={GRAY}>
                {note}
              </Tx>
            )}
            <Chip x={140 - (status.length * 2.1 * 0.6 + 3)} y={yy} t={status} />
            <line x1="10" y1={yy + 6} x2="140" y2={yy + 6} stroke={LINE} strokeWidth="0.35" />
          </g>
        );
      })}
    </g>
  );
}

export function Paragraph({ y, text, s = 2.7, max = 84, c = INK }) {
  return wrapText(text, max).map((line, k) => (
    <Tx key={k} x={10} y={y + k * (s + 1.5)} s={s} c={c}>
      {line}
    </Tx>
  ));
}
