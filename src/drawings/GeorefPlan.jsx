// Example drawing: georeferencing plan with vertices.

import { GRAY, BACKGROUND, LINE, INK, GREEN } from "../SheetBase";
import { DrawingTitle, NorthArrow, Tx } from "./drawingParts.jsx";

// Georeferencing plan: vertices, azimuths and distances, and the coordinate table.
const VERTICES = [
  ["M-0001", 14, 96, "675.108,90", "7.671.233,84", 16, 101.6, "start"],
  ["M-0002", 24, 22, "675.212,48", "7.671.905,12", 22, 19.6, "end"],
  ["M-0003", 70, 14, "675.672,31", "7.671.987,40", 72, 11.8, "start"],
  ["M-0004", 92, 52, "675.891,05", "7.671.607,22", 89, 57.4, "end"],
  ["M-0005", 78, 104, "675.749,63", "7.671.120,57", 80, 108.2, "start"],
];

export function GeorefPlan() {
  const pts = VERTICES.map(([, x, y]) => `${x},${y}`).join(" ");
  return (
    <g>
      <polygon points={pts} fill="#eef4ec" stroke={INK} strokeWidth="0.9" />
      {VERTICES.map(([id, x, y, , , lx, ly, la]) => (
        <g key={id}>
          <circle cx={x} cy={y} r="1.3" fill="#fff" stroke={INK} strokeWidth="0.5" />
          <circle cx={x} cy={y} r="0.45" fill={INK} />
          <Tx x={lx} y={ly} s={2.1} b a={la}>
            {id}
          </Tx>
        </g>
      ))}
      <Tx x={46} y={16.2} s={1.9} c={GRAY} a="middle" r={-9.9}>
        Az 80°08' · 467,12 m
      </Tx>
      <Tx x={83} y={31} s={1.9} c={GRAY} a="middle" r={59.9}>
        Az 149°55' · 438,90 m
      </Tx>
      <Tx x={50} y={60} s={2.4} b c={GREEN} a="middle">
        SÍTIO EXEMPLO
      </Tx>
      <Tx x={6} y={60} s={1.9} c={GRAY} a="middle" r={-90}>
        Confrontante: Sítio Vizinho A
      </Tx>
      <Tx x={46} y={110} s={1.9} c={GRAY} a="middle" r={7}>
        Estrada municipal
      </Tx>
      <g transform="translate(97 14)">
        <rect x="0" y="0" width="43" height="6" fill={BACKGROUND} />
        <Tx x={1.2} y={4.2} s={1.9} b c={GRAY}>
          VÉRTICE
        </Tx>
        <Tx x={13} y={4.2} s={1.9} b c={GRAY}>
          E (m)
        </Tx>
        <Tx x={27.4} y={4.2} s={1.9} b c={GRAY}>
          N (m)
        </Tx>
        {VERTICES.map(([id, , , e, n], i) => (
          <g key={id}>
            <line x1="0" y1={6 + i * 5.4} x2="43" y2={6 + i * 5.4} stroke={LINE} strokeWidth="0.3" />
            <Tx x={1.2} y={10 + i * 5.4} s={1.9}>
              {id}
            </Tx>
            <Tx x={13} y={10 + i * 5.4} s={1.9}>
              {e}
            </Tx>
            <Tx x={27.4} y={10 + i * 5.4} s={1.9}>
              {n}
            </Tx>
          </g>
        ))}
        <Tx x={0} y={40} s={2.1} c={GRAY}>
          SIRGAS 2000 · UTM fuso 22S
        </Tx>
        <Tx x={0} y={44.6} s={2.3} b>
          Área: 48,32 ha
        </Tx>
        <Tx x={0} y={49} s={2.3} b>
          Perímetro: 2.914,36 m
        </Tx>
      </g>
      <NorthArrow x={128} y={74} />
      <DrawingTitle y={118} x={56} title="PLANTA DO IMÓVEL GEORREFERENCIADO" scale="ESCALA 1:5.000" />
    </g>
  );
}
