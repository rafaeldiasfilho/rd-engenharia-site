// Example drawing: work schedule (Gantt-style stages).

import { SHEET_GRAY, SHEET_BACKGROUND, SHEET_LINE, SHEET_GREEN } from "../SheetBase";
import { DrawingTitle, SheetText } from "./drawingParts.jsx";

// Physical-financial schedule: stages per week and spending per month.
const SCHEDULE_STAGES = [
  ["Serviços preliminares", 0, 1, 4],
  ["Fundação", 1, 2, 12],
  ["Estrutura", 2, 4, 22],
  ["Alvenaria", 4, 3, 14],
  ["Cobertura", 6, 2, 10],
  ["Instalações", 6, 4, 16],
  ["Acabamentos", 8, 4, 18],
  ["Limpeza e entrega", 11, 1, 4],
];

export function Schedule() {
  const x0 = 54;
  const week = 6;
  const y0 = 26;
  const rowHeight = 8.6;
  return (
    <g>
      <rect x="10" y="12" width="130" height="14" fill={SHEET_BACKGROUND} />
      <SheetText x={12} y={21} s={2.4} b c={SHEET_GRAY}>
        ETAPA
      </SheetText>
      {["MÊS 1", "MÊS 2", "MÊS 3"].map((m, i) => (
        <SheetText key={m} x={x0 + i * 24 + 12} y={17.4} s={2.3} b c={SHEET_GRAY} a="middle">
          {m}
        </SheetText>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <SheetText key={i} x={x0 + i * week + 3} y={23.6} s={1.9} c={SHEET_GRAY} a="middle">
          {i + 1}
        </SheetText>
      ))}
      <SheetText x={135} y={21} s={2.4} b c={SHEET_GRAY} a="middle">
        %
      </SheetText>
      <g stroke={SHEET_LINE} strokeWidth="0.3">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={x0 + i * week} y1={19.6} x2={x0 + i * week} y2={y0 + SCHEDULE_STAGES.length * rowHeight} strokeWidth={i % 4 === 0 ? 0.6 : 0.3} />
        ))}
        {SCHEDULE_STAGES.map((_, r) => (
          <line key={r} x1="10" y1={y0 + (r + 1) * rowHeight} x2="140" y2={y0 + (r + 1) * rowHeight} />
        ))}
      </g>
      {SCHEDULE_STAGES.map(([name, start, dur, pct], r) => {
        const y = y0 + r * rowHeight;
        return (
          <g key={name}>
            <SheetText x={12} y={y + 5.6} s={2.4}>
              {name}
            </SheetText>
            <rect x={x0 + start * week + 0.6} y={y + 2.6} width={dur * week - 1.2} height="3.6" rx="1.2" fill={r % 2 ? "#4f9a5b" : SHEET_GREEN} />
            <SheetText x={135} y={y + 5.6} s={2.4} a="middle">
              {pct}
            </SheetText>
          </g>
        );
      })}
      {(() => {
        const y = y0 + SCHEDULE_STAGES.length * rowHeight;
        return (
          <g>
            <rect x="10" y={y} width="130" height="15" fill={SHEET_BACKGROUND} />
            <SheetText x={12} y={y + 5.4} s={2.3} b>
              Desembolso no mês
            </SheetText>
            <SheetText x={12} y={y + 11.6} s={2.3} b>
              Acumulado
            </SheetText>
            {[
              ["27%", "27%"],
              ["43%", "70%"],
              ["30%", "100%"],
            ].map(([m, a], i) => (
              <g key={i}>
                <SheetText x={x0 + i * 24 + 12} y={y + 5.4} s={2.4} b c={SHEET_GREEN} a="middle">
                  {m}
                </SheetText>
                <SheetText x={x0 + i * 24 + 12} y={y + 11.6} s={2.4} a="middle">
                  {a}
                </SheetText>
              </g>
            ))}
          </g>
        );
      })()}
      <DrawingTitle y={115} title="CRONOGRAMA FÍSICO-FINANCEIRO" scale="PRAZO TOTAL: 12 SEMANAS" />
    </g>
  );
}
