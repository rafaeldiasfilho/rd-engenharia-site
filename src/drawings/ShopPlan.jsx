// Example drawing: shop floor plan (fire safety layout).

import { SHEET_GRAY, SHEET_INK, SHEET_RED } from "../SheetBase";
import { DimensionH, DimensionV, Door, DrawingTitle, NorthArrow, Room, SheetText, WindowOpening } from "./drawingParts.jsx";

// Commercial hall (fire safety design and escape route). 1 unit = 20 cm.
export function ShopPlan({ route }) {
  const extinguishers = [[26, 88], [62, 26], [88, 50], [126, 90]];
  const lights = [[36, 40], [70, 40], [36, 76], [72, 76], [112, 30], [101, 75]];
  return (
    <g>
      <DimensionH x1={18} x2={132} y={13} v="22,80" />
      <DimensionV x={11} y1={20} y2={96} v="15,20" />
      <g stroke={SHEET_INK} fill="none" strokeLinecap="square">
        <rect x="18" y="20" width="114" height="76" strokeWidth="1.6" />
        <path d="M92 20V96M92 62H132M110 62V96" strokeWidth="0.9" />
      </g>
      <WindowOpening x1={60} y1={20} x2={84} y2={20} />
      <Door gap={{ x: 40, y: 94.6, width: 14, height: 2.8 }} leaf="M40 96V103M54 96V103" arc="M47 96A7 7 0 0 1 40 103M47 96A7 7 0 0 0 54 103" />
      <Door gap={{ x: 91, y: 40, width: 2, height: 7 }} leaf="M92 40H99" arc="M92 47A7 7 0 0 0 99 40" />
      <Door gap={{ x: 95, y: 61, width: 6, height: 2 }} leaf="M95 62V68" arc="M101 62A6 6 0 0 1 95 68" />
      <Door gap={{ x: 114, y: 61, width: 6, height: 2 }} leaf="M114 62V68" arc="M120 62A6 6 0 0 1 114 68" />
      {route && <Door gap={{ x: 16.6, y: 34, width: 2.8, height: 8 }} leaf="M18 34H10" arc="M18 42A8 8 0 0 1 10 34" />}
      <Room x={55} y={58} name="SALÃO DE VENDAS" area="224,96 m²" />
      <Room x={112} y={40} name="ESTOQUE" area="67,20 m²" />
      <Room x={101} y={84} name="WC" />
      <Room x={121} y={80} name="ESCRIT." />
      {/* escape route to the exit(s) */}
      <g fill="none" stroke="#2f8f46" strokeWidth="0.8" strokeDasharray="2 1.4" strokeLinecap="round">
        <path d="M121 86L117 66L104 52L92 44L64 68L47 90" />
        {route && <path d="M40 46L22 38" />}
      </g>
      <path d="M47 92l-2.6 -3.4h5.2z" fill="#2f8f46" />
      {route && <path d="M19.4 37.4l3.8 -2.2 -0.4 4.4z" fill="#2f8f46" />}
      {/* exit signage */}
      <g>
        <rect x="42.5" y="90" width="9" height="3.4" rx="0.6" fill="#2f8f46" />
        <SheetText x={47} y={92.5} s={1.8} b c="#fff" a="middle">
          SAÍDA
        </SheetText>
        {route && (
          <g>
            <rect x="20.5" y="43" width="9" height="3.4" rx="0.6" fill="#2f8f46" />
            <SheetText x={25} y={45.5} s={1.8} b c="#fff" a="middle">
              SAÍDA
            </SheetText>
          </g>
        )}
      </g>
      {!route &&
        extinguishers.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="2.3" fill={SHEET_RED} />
            <SheetText x={x} y={y + 0.9} s={2.2} b c="#fff" a="middle">
              E
            </SheetText>
          </g>
        ))}
      {!route &&
        lights.map(([x, y]) => <rect key={`${x}-${y}`} x={x - 2} y={y - 1} width="4" height="2" rx="0.4" fill="#f2c230" stroke="#7a5b00" strokeWidth="0.3" />)}
      {route && (
        <g>
          {[[24, 62], [96, 26]].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <rect x={x - 2.6} y={y - 2} width="5.2" height="4" fill={SHEET_RED} />
              <SheetText x={x} y={y + 1} s={2.4} b c="#fff" a="middle">
                H
              </SheetText>
            </g>
          ))}
          {[[52, 92], [88, 30]].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="1.9" fill="#fff" stroke={SHEET_RED} strokeWidth="0.8" />
              <circle cx={x} cy={y} r="0.7" fill={SHEET_RED} />
            </g>
          ))}
          <SheetText x={12} y={103} s={2.1} c={SHEET_GRAY}>
            Caminhamento máximo: 26 m
          </SheetText>
        </g>
      )}
      <DrawingTitle title={route ? "ROTA DE FUGA, HIDRANTES E ALARME" : "PLANTA DE MEDIDAS DE SEGURANÇA"} scale="ESCALA 1:100 · ÁREA 346,56 m²" />
      <g transform="translate(12 115)" fontSize="2.2">
        {(route
          ? [
              ["h", "Hidrante"],
              ["a", "Acionador de alarme"],
              ["s", "Saída"],
              ["r", "Rota de fuga"],
            ]
          : [
              ["e", "Extintor PQS"],
              ["l", "Iluminação de emergência"],
              ["s", "Saída"],
              ["r", "Rota de fuga"],
            ]
        ).map(([k, label], i) => (
          <g key={k} transform={`translate(${(i % 2) * 62} ${Math.floor(i / 2) * 4.6})`}>
            {k === "e" && <circle cx="1.6" cy="-0.8" r="1.6" fill={SHEET_RED} />}
            {k === "l" && <rect x="0" y="-1.8" width="3.4" height="1.8" fill="#f2c230" stroke="#7a5b00" strokeWidth="0.3" />}
            {k === "h" && <rect x="0" y="-2" width="3.4" height="2.6" fill={SHEET_RED} />}
            {k === "a" && <circle cx="1.6" cy="-0.8" r="1.4" fill="#fff" stroke={SHEET_RED} strokeWidth="0.7" />}
            {k === "s" && <rect x="0" y="-1.8" width="3.4" height="1.8" fill="#2f8f46" />}
            {k === "r" && <path d="M0 -0.8h3.4" stroke="#2f8f46" strokeWidth="0.8" strokeDasharray="1.2 0.8" />}
            <text x="5" y="0" fill={SHEET_INK}>
              {label}
            </text>
          </g>
        ))}
      </g>
      <NorthArrow x={137} y={110} />
    </g>
  );
}
