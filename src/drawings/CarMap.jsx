// Example drawing: CAR rural property map.

import { BLUE, GRAY, INK, GREEN, LIGHT_GREEN } from "../SheetBase";
import { DrawingTitle, NorthArrow, Tx } from "./drawingParts.jsx";

// Property map for the CAR: APP along the stream, legal reserve and consolidated-use area.
export function CarMap({ uid }) {
  const boundary = "16,98 28,22 98,14 136,40 126,100";
  const stream = "M70 8C78 32 60 50 78 64S106 84 114 110";
  return (
    <g>
      <defs>
        <clipPath id={`${uid}-car`}>
          <polygon points={boundary} />
        </clipPath>
        <clipPath id={`${uid}-rl`}>
          <rect x="26" y="56" width="34" height="34" />
        </clipPath>
      </defs>
      <polygon points={boundary} fill="#f3f6ef" />
      <g clipPath={`url(#${uid}-car)`}>
        <path d={stream} fill="none" stroke={LIGHT_GREEN} strokeWidth="13" opacity="0.7" />
        <path d={stream} fill="none" stroke={BLUE} strokeWidth="1.1" />
        <g clipPath={`url(#${uid}-rl)`} stroke={GREEN} strokeWidth="0.45">
          {Array.from({ length: 18 }, (_, i) => (
            <line key={i} x1={26 + i * 4 - 34} y1="90" x2={26 + i * 4} y2="56" />
          ))}
        </g>
      </g>
      <rect x="26" y="56" width="34" height="34" fill="none" stroke={GREEN} strokeWidth="0.7" />
      <polygon points={boundary} fill="none" stroke={INK} strokeWidth="0.9" />
      <rect x="100" y="56" width="4" height="4" fill={INK} />
      <Tx x={102} y={64.4} s={2.2} a="middle">
        Sede
      </Tx>
      <rect x="31" y="68.6" width="24" height="8.4" rx="1" fill="#fff" opacity="0.92" />
      <Tx x={43} y={72} s={2.2} b c={GREEN} a="middle">
        RESERVA
      </Tx>
      <Tx x={43} y={75.4} s={2.2} b c={GREEN} a="middle">
        LEGAL
      </Tx>
      <Tx x={74} y={40} s={2.1} b c="#2c6a34" r={-62}>
        APP 30 m
      </Tx>
      <Tx x={112} y={78} s={2.1} c={GRAY} a="middle">
        uso consolidado
      </Tx>
      <NorthArrow x={130} y={14} />
      <DrawingTitle y={106} title="MAPA DO IMÓVEL PARA O CAR" scale="ÁREA 48,32 ha · RESERVA LEGAL 9,66 ha (20%)" />
      <g transform="translate(12 117)" fontSize="2.2">
        <rect x="0" y="-2.2" width="4" height="2.6" fill="none" stroke={GREEN} strokeWidth="0.5" />
        <path d="M0 0.4l2.6-2.6M1.6 0.4l2.4-2.4" stroke={GREEN} strokeWidth="0.4" />
        <text x="5.6" y="0" fill={INK}>
          Reserva legal
        </text>
        <rect x="34" y="-2.2" width="4" height="2.6" fill={LIGHT_GREEN} />
        <text x="39.6" y="0" fill={INK}>
          APP
        </text>
        <path d="M54 -0.8h5" stroke={BLUE} strokeWidth="0.9" />
        <text x="61" y="0" fill={INK}>
          Córrego
        </text>
        <path d="M82 -0.8h5" stroke={INK} strokeWidth="0.8" />
        <text x="89" y="0" fill={INK}>
          Limite do imóvel
        </text>
      </g>
    </g>
  );
}
