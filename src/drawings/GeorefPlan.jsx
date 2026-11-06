// Example drawing: georeferencing plan with vertices.

import { SHEET_GRAY, SHEET_BACKGROUND, SHEET_LINE, SHEET_INK, SHEET_GREEN } from "../SheetBase";
import { DrawingTitle, NorthArrow, SheetText } from "./drawingParts.jsx";

// Georeferencing plan: vertices, azimuths and distances, and the coordinate table.
const GEOREF_VERTICES = [
  ["M-0001", 14, 96, "675.108,90", "7.671.233,84", 16, 101.6, "start"],
  ["M-0002", 24, 22, "675.212,48", "7.671.905,12", 22, 19.6, "end"],
  ["M-0003", 70, 14, "675.672,31", "7.671.987,40", 72, 11.8, "start"],
  ["M-0004", 92, 52, "675.891,05", "7.671.607,22", 89, 57.4, "end"],
  ["M-0005", 78, 104, "675.749,63", "7.671.120,57", 80, 108.2, "start"],
];

export function GeorefPlan() {
  const pts = GEOREF_VERTICES.map(([, x, y]) => `${x},${y}`).join(" ");
  return (
    <g>
      <polygon points={pts} fill="#eef4ec" stroke={SHEET_INK} strokeWidth="0.9" />
      {GEOREF_VERTICES.map(([id, x, y, , , lx, ly, la]) => (
        <g key={id}>
          <circle cx={x} cy={y} r="1.3" fill="#fff" stroke={SHEET_INK} strokeWidth="0.5" />
          <circle cx={x} cy={y} r="0.45" fill={SHEET_INK} />
          <SheetText x={lx} y={ly} s={2.1} b a={la}>
            {id}
          </SheetText>
        </g>
      ))}
      <SheetText x={46} y={16.2} s={1.9} c={SHEET_GRAY} a="middle" r={-9.9}>
        Az 80°08' · 467,12 m
      </SheetText>
      <SheetText x={83} y={31} s={1.9} c={SHEET_GRAY} a="middle" r={59.9}>
        Az 149°55' · 438,90 m
      </SheetText>
      <SheetText x={50} y={60} s={2.4} b c={SHEET_GREEN} a="middle">
        SÍTIO EXEMPLO
      </SheetText>
      <SheetText x={6} y={60} s={1.9} c={SHEET_GRAY} a="middle" r={-90}>
        Confrontante: Sítio Vizinho A
      </SheetText>
      <SheetText x={46} y={110} s={1.9} c={SHEET_GRAY} a="middle" r={7}>
        Estrada municipal
      </SheetText>
      <g transform="translate(97 14)">
        <rect x="0" y="0" width="43" height="6" fill={SHEET_BACKGROUND} />
        <SheetText x={1.2} y={4.2} s={1.9} b c={SHEET_GRAY}>
          VÉRTICE
        </SheetText>
        <SheetText x={13} y={4.2} s={1.9} b c={SHEET_GRAY}>
          E (m)
        </SheetText>
        <SheetText x={27.4} y={4.2} s={1.9} b c={SHEET_GRAY}>
          N (m)
        </SheetText>
        {GEOREF_VERTICES.map(([id, , , e, n], i) => (
          <g key={id}>
            <line x1="0" y1={6 + i * 5.4} x2="43" y2={6 + i * 5.4} stroke={SHEET_LINE} strokeWidth="0.3" />
            <SheetText x={1.2} y={10 + i * 5.4} s={1.9}>
              {id}
            </SheetText>
            <SheetText x={13} y={10 + i * 5.4} s={1.9}>
              {e}
            </SheetText>
            <SheetText x={27.4} y={10 + i * 5.4} s={1.9}>
              {n}
            </SheetText>
          </g>
        ))}
        <SheetText x={0} y={40} s={2.1} c={SHEET_GRAY}>
          SIRGAS 2000 · UTM fuso 22S
        </SheetText>
        <SheetText x={0} y={44.6} s={2.3} b>
          Área: 48,32 ha
        </SheetText>
        <SheetText x={0} y={49} s={2.3} b>
          Perímetro: 2.914,36 m
        </SheetText>
      </g>
      <NorthArrow x={128} y={74} />
      <DrawingTitle y={118} x={56} title="PLANTA DO IMÓVEL GEORREFERENCIADO" scale="ESCALA 1:5.000" />
    </g>
  );
}
