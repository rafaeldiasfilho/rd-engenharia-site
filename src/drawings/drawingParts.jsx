// Shared pieces of the example drawings (text, north arrow, dimensions, openings, rooms, title block). Coordinates on the 150 × 198 sheet.

import { GRAY, PAPER, INK } from "../SheetBase";

export function Tx({ x, y, s = 2.6, b, c = INK, a, r, children }) {
  return (
    <text x={x} y={y} fontSize={s} fontWeight={b ? 700 : 400} fill={c} textAnchor={a} transform={r ? `rotate(${r} ${x} ${y})` : undefined}>
      {children}
    </text>
  );
}

export function NorthArrow({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 -6l2.8 7.6-2.8-1.8-2.8 1.8z" fill={INK} />
      <Tx x={0} y={5.6} s={2.8} b a="middle">
        N
      </Tx>
    </g>
  );
}

export function DimensionH({ x1, x2, y, v }) {
  return (
    <g stroke={GRAY} strokeWidth="0.3">
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <line x1={x1} y1={y - 1.8} x2={x1} y2={y + 1.8} />
      <line x1={x2} y1={y - 1.8} x2={x2} y2={y + 1.8} />
      <path d={`M${x1 - 1} ${y + 1}l2 -2M${x2 - 1} ${y + 1}l2 -2`} strokeWidth="0.5" />
      <text x={(x1 + x2) / 2} y={y - 1} fontSize="2.4" fill={GRAY} stroke="none" textAnchor="middle">
        {v}
      </text>
    </g>
  );
}

export function DimensionV({ x, y1, y2, v }) {
  const ym = (y1 + y2) / 2;
  return (
    <g stroke={GRAY} strokeWidth="0.3">
      <line x1={x} y1={y1} x2={x} y2={y2} />
      <line x1={x - 1.8} y1={y1} x2={x + 1.8} y2={y1} />
      <line x1={x - 1.8} y1={y2} x2={x + 1.8} y2={y2} />
      <path d={`M${x - 1} ${y1 + 1}l2 -2M${x - 1} ${y2 + 1}l2 -2`} strokeWidth="0.5" />
      <text x={x - 1} y={ym} fontSize="2.4" fill={GRAY} stroke="none" textAnchor="middle" transform={`rotate(-90 ${x - 1} ${ym})`}>
        {v}
      </text>
    </g>
  );
}

// Window: opening in the wall (paper on top) with the two frame lines.
export function WindowOpening({ x1, y1, x2, y2 }) {
  const h = y1 === y2;
  return (
    <g>
      <rect x={h ? x1 : x1 - 1.4} y={h ? y1 - 1.4 : y1} width={h ? x2 - x1 : 2.8} height={h ? 2.8 : y2 - y1} fill={PAPER} />
      <g stroke={INK} strokeWidth="0.35">
        {h ? (
          <path d={`M${x1} ${y1 - 0.6}H${x2}M${x1} ${y1 + 0.6}H${x2}M${x1} ${y1 - 1.4}v2.8M${x2} ${y1 - 1.4}v2.8`} />
        ) : (
          <path d={`M${x1 - 0.6} ${y1}V${y2}M${x1 + 0.6} ${y1}V${y2}M${x1 - 1.4} ${y1}h2.8M${x1 - 1.4} ${y2}h2.8`} />
        )}
      </g>
    </g>
  );
}

// Door: wall opening, door leaf and swing arc. `arc` is the precomputed arc path.
export function Door({ gap, leaf, arc }) {
  return (
    <g>
      <rect {...gap} fill={PAPER} />
      <path d={leaf} stroke={INK} strokeWidth="0.6" fill="none" />
      <path d={arc} stroke={INK} strokeWidth="0.3" fill="none" strokeDasharray="1 0.8" />
    </g>
  );
}

export function Room({ x, y, name, area }) {
  return (
    <g>
      <Tx x={x} y={y} s={2.6} b a="middle">
        {name}
      </Tx>
      {area && (
        <Tx x={x} y={y + 3.4} s={2.2} c={GRAY} a="middle">
          {area}
        </Tx>
      )}
    </g>
  );
}

export function DrawingTitle({ y = 107, title, scale, x = 75 }) {
  return (
    <g>
      <Tx x={x} y={y} s={3} b a="middle">
        {title}
      </Tx>
      {scale && (
        <Tx x={x} y={y + 3.8} s={2.3} c={GRAY} a="middle">
          {scale}
        </Tx>
      )}
    </g>
  );
}

// Revision cloud (outline made of arcs), as on revised drawing sheets.
export function revisionCloud(x, y, w, h, r = 1.6) {
  const nx = Math.max(1, Math.round(w / (2 * r)));
  const ny = Math.max(1, Math.round(h / (2 * r)));
  const dx = w / nx;
  const dy = h / ny;
  let d = `M${x} ${y}`;
  for (let i = 0; i < nx; i++) d += `a${dx / 2} ${dx / 2} 0 0 1 ${dx} 0`;
  for (let i = 0; i < ny; i++) d += `a${dy / 2} ${dy / 2} 0 0 1 0 ${dy}`;
  for (let i = 0; i < nx; i++) d += `a${dx / 2} ${dx / 2} 0 0 1 ${-dx} 0`;
  for (let i = 0; i < ny; i++) d += `a${dy / 2} ${dy / 2} 0 0 1 0 ${-dy}`;
  return d;
}
