// Example drawing: house floor plan with a revision cloud.

import { SHEET_PAPER, SHEET_INK, SHEET_RED } from "../SheetBase";
import { DimensionH, DimensionV, Door, DrawingTitle, NorthArrow, Room, SheetText, WindowOpening, revisionCloud } from "./drawingParts.jsx";

// Single-storey house (architectural design and as-built). 1 unit = 10 cm.
export function HousePlan({ asbuilt }) {
  return (
    <g>
      <DimensionH x1={18} x2={132} y={13} v="11,40" />
      <DimensionV x={11} y1={20} y2={96} v="7,60" />
      <g stroke={SHEET_INK} fill="none" strokeLinecap="square">
        <rect x="18" y="20" width="114" height="76" strokeWidth="1.6" />
        <path d="M70 20V58M104 20V58M18 58H132M56 58V96M76 58V96" strokeWidth="0.9" />
      </g>
      <WindowOpening x1={18} y1={30} x2={18} y2={44} />
      <WindowOpening x1={78} y1={20} x2={96} y2={20} />
      <WindowOpening x1={132} y1={28} x2={132} y2={40} />
      <WindowOpening x1={26} y1={96} x2={44} y2={96} />
      <WindowOpening x1={62} y1={96} x2={70} y2={96} />
      <WindowOpening x1={92} y1={96} x2={116} y2={96} />
      <Door gap={{ x: 30, y: 18.6, width: 9, height: 2.8 }} leaf="M30 20V29" arc="M39 20A9 9 0 0 1 30 29" />
      <Door gap={{ x: 40, y: 57, width: 7, height: 2 }} leaf="M40 58V65" arc="M47 58A7 7 0 0 1 40 65" />
      <Door gap={{ x: 59, y: 57, width: 6, height: 2 }} leaf="M59 58V64" arc="M65 58A6 6 0 0 1 59 64" />
      <Door gap={{ x: 82, y: 57, width: 7, height: 2 }} leaf="M82 58V65" arc="M89 58A7 7 0 0 1 82 65" />
      <Door gap={{ x: 103, y: 38, width: 2, height: 7 }} leaf="M104 38H111" arc="M104 45A7 7 0 0 0 111 38" />
      <rect x="69" y="36" width="2" height="10" fill={SHEET_PAPER} />
      <Room x={44} y={41} name="SALA" area="19,76 m²" />
      <Room x={87} y={41} name="COZINHA" area="12,92 m²" />
      <Room x={118} y={51} name="Á. SERV." area="10,64 m²" />
      <Room x={37} y={80} name="QUARTO" area="14,44 m²" />
      <Room x={66} y={80} name="BWC" area="7,60 m²" />
      <Room x={104} y={80} name="SUÍTE" area="21,28 m²" />
      {asbuilt && (
        <g>
          <path d={revisionCloud(72, 60, 8, 34)} fill="none" stroke={SHEET_RED} strokeWidth="0.5" />
          <path d="M80 60l3.4 -5.6h-6.8z" fill={SHEET_RED} />
          <SheetText x={80} y={58.6} s={2.2} b c="#fff" a="middle">
            1
          </SheetText>
        </g>
      )}
      <DrawingTitle title={asbuilt ? "PLANTA BAIXA · COMO CONSTRUÍDO" : "PLANTA BAIXA"} scale="ESCALA 1:50 · ÁREA CONSTRUÍDA 86,64 m²" />
      {asbuilt && (
        <SheetText x={12} y={118} s={2.2} c={SHEET_RED}>
          1 · Parede do banheiro executada 0,20 m à direita do projeto aprovado.
        </SheetText>
      )}
      <NorthArrow x={136} y={108} />
    </g>
  );
}
