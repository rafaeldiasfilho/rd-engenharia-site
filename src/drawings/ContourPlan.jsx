// Example drawing: topographic contour plan.

import { BLUE, BROWN, PAPER, INK } from "../SheetBase";
import { DrawingTitle, NorthArrow, Tx } from "./drawingParts.jsx";

// Topographic survey: contours every 1 m, index contours every 5 m, spot elevations.
export function ContourPlan({ uid }) {
  const contours = Array.from({ length: 12 }, (_, i) => {
    const elevation = 505 + i;
    const base = 96 - i * 7.2;
    let d = "";
    for (let x = 12; x <= 138; x += 6) {
      const y = base + 4.2 * Math.sin(x * 0.045 + i * 0.35) - (x > 70 && x < 96 ? 3 : 0);
      d += `${d ? "L" : "M"}${x} ${y.toFixed(2)}`;
    }
    return { elevation, d, major: elevation % 5 === 0, yl: base + 4.2 * Math.sin(40 * 0.045 + i * 0.35) };
  });
  return (
    <g>
      <defs>
        <clipPath id={`${uid}-lev`}>
          <polygon points="12,100 14,14 136,12 138,98" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-lev)`} fill="none">
        {contours.map((c) => (
          <path key={c.elevation} d={c.d} stroke={c.major ? BROWN : "#b79a7a"} strokeWidth={c.major ? 0.7 : 0.3} />
        ))}
        <path d="M82 12C80 40 86 60 84 100" stroke={BLUE} strokeWidth="0.6" strokeDasharray="2 1.2" />
      </g>
      {contours
        .filter((c) => c.major)
        .map((c) => (
          <g key={c.elevation}>
            <rect x="36" y={c.yl - 2.4} width="9" height="3.4" fill={PAPER} />
            <Tx x={40.5} y={c.yl + 0.4} s={2.2} b c={BROWN} a="middle">
              {c.elevation}
            </Tx>
          </g>
        ))}
      {[
        [110, 30, "+514,20"],
        [28, 80, "+506,85"],
        [62, 54, "+509,40"],
      ].map(([x, y, v]) => (
        <g key={v}>
          <path d={`M${x - 1.2} ${y}h2.4M${x} ${y - 1.2}v2.4`} stroke={INK} strokeWidth="0.4" />
          <Tx x={x + 1.8} y={y - 1} s={2.1}>
            {v}
          </Tx>
        </g>
      ))}
      <polygon points="12,100 14,14 136,12 138,98" fill="none" stroke={INK} strokeWidth="0.9" />
      <Tx x={86} y={104} s={2} c={BLUE}>
        drenagem natural
      </Tx>
      <g transform="translate(14 110)">
        <rect x="0" y="0" width="12" height="1.6" fill={INK} />
        <rect x="12" y="0" width="12" height="1.6" fill="#fff" stroke={INK} strokeWidth="0.3" />
        <Tx x={0} y={5} s={2} a="middle">
          0
        </Tx>
        <Tx x={12} y={5} s={2} a="middle">
          25
        </Tx>
        <Tx x={24} y={5} s={2} a="middle">
          50 m
        </Tx>
      </g>
      <DrawingTitle y={111} x={82} title="PLANTA PLANIALTIMÉTRICA" scale="CURVAS A CADA 1 m · ESCALA 1:1.000" />
      <NorthArrow x={136} y={110} />
    </g>
  );
}
