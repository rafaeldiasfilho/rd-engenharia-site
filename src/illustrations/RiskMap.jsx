// Interactive illustration: workplace risk map (risk circles by type and size).

import { SHEET_BLUE, SHEET_BORDER, SHEET_GRAY, SHEET_LINE, SHEET_BROWN, SHEET_INK, SHEET_RED } from "../SheetBase";
import { InteractiveIllustration, ILLUSTRATION_LABEL, ILLUSTRATION_LABEL_BOLD } from "./illustrationParts.jsx";

/* ── Risk map ───────────────────────────────────────────────────────────────────────────────── */

// Risk map convention: one colour per group; the circle size shows the intensity
// (small, medium, large) and the number shows how many workers are exposed.
const RISK_ITEMS = [
  { id: "fisico", color: "#2e9e4d", name: "Físico", text: "Ruído, calor, vibração. Aqui: a serra do corte (risco grande). Na prática: protetor auricular, manutenção e pausas." },
  { id: "quimico", color: SHEET_RED, name: "Químico", text: "Tintas, solventes, poeiras e vapores. Aqui: a cabine de pintura. Na prática: exaustão, máscara adequada e produtos identificados." },
  { id: "biologico", color: SHEET_BROWN, name: "Biológico", text: "Fungos, bactérias e vírus. Aqui: a limpeza dos banheiros. Na prática: luvas, produtos de limpeza e higiene das mãos." },
  { id: "ergo", color: "#e3b007", name: "Ergonômico", text: "Postura, esforço e repetição. Aqui: a bancada de montagem e o escritório. Na prática: altura certa, cadeiras ajustáveis e pausas." },
  { id: "acidente", color: SHEET_BLUE, name: "Acidente", text: "Cortes, quedas e choques. Aqui: a serra e o empilhamento no depósito. Na prática: proteção nas máquinas, piso organizado e sinalização." },
];

const RISK_CIRCLE_RADIUS = { P: 13, M: 20, G: 28 };

function RiskCircle({ x, y, size, color, n, ...handlers }) {
  return (
    <g {...handlers}>
      <circle cx={x} cy={y} r={RISK_CIRCLE_RADIUS[size]} fill={color} fillOpacity=".72" stroke="#fff" strokeWidth="2" />
      <text x={x} y={y + 4.5} fontSize="13" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="inherit">
        {n}
      </text>
    </g>
  );
}

export function RiskMap() {
  const color = Object.fromEntries(RISK_ITEMS.map((x) => [x.id, x.color]));
  return (
    <InteractiveIllustration
      items={RISK_ITEMS}
      label="Grupos de risco"
      title="Mapa de riscos ilustrativo de uma pequena oficina, com cinco grupos de risco"
      titleId="t-risco"
      stamp={{ title: "Mapa de riscos · oficina", client: "Empresa Exemplo Ltda." }}
      help="Cada cor é um grupo de risco. O tamanho do círculo mostra a intensidade, e o número, quantas pessoas estão expostas."
      finalCaption="Mapa de riscos ilustrativo. Não representa nenhuma empresa real."
      drawing={({ opacityFor, choose }) => {
        const r = (id) => ({ style: opacityFor(id), onClick: () => choose(id) });
        return (
          <>
            <g stroke={SHEET_INK} fill="none">
              <rect x="20" y="40" width="380" height="216" strokeWidth="4" />
              <path d="M200 40V150M20 150H120M160 150H260M300 150H400M290 150V256M340 150V256" strokeWidth="2" />
            </g>
            <g fontFamily="inherit">
              <text x="110" y="60" style={ILLUSTRATION_LABEL_BOLD} textAnchor="middle">
                CORTE
              </text>
              <text x="300" y="60" style={ILLUSTRATION_LABEL_BOLD} textAnchor="middle">
                PINTURA
              </text>
              <text x="150" y="244" style={ILLUSTRATION_LABEL_BOLD} textAnchor="middle">
                MONTAGEM
              </text>
              <text x="315" y="244" style={ILLUSTRATION_LABEL_BOLD} textAnchor="middle">
                WC
              </text>
              <text x="370" y="244" style={ILLUSTRATION_LABEL_BOLD} textAnchor="middle">
                ESCRIT.
              </text>
            </g>
            <rect x="60" y="88" width="56" height="30" fill={SHEET_LINE} stroke={SHEET_BORDER} />
            <rect x="250" y="80" width="90" height="46" fill={SHEET_LINE} stroke={SHEET_BORDER} />
            <rect x="80" y="180" width="120" height="26" fill={SHEET_LINE} stroke={SHEET_BORDER} />
            <RiskCircle x={96} y={104} size="G" color={color.fisico} n="3" {...r("fisico")} />
            <RiskCircle x={150} y={112} size="M" color={color.acidente} n="3" {...r("acidente")} />
            <RiskCircle x={300} y={104} size="G" color={color.quimico} n="2" {...r("quimico")} />
            <RiskCircle x={140} y={196} size="M" color={color.ergo} n="4" {...r("ergo")} />
            <RiskCircle x={240} y={206} size="P" color={color.acidente} n="1" {...r("acidente")} />
            <RiskCircle x={315} y={196} size="P" color={color.biologico} n="1" {...r("biologico")} />
            <RiskCircle x={370} y={196} size="P" color={color.ergo} n="2" {...r("ergo")} />
            <text x="240" y="236" style={ILLUSTRATION_LABEL} textAnchor="middle">
              depósito
            </text>
            <g transform="translate(22 270)" fontFamily="inherit">
              <text x="0" y="12" fontSize="10" fontWeight="700" fill={SHEET_GRAY}>
                INTENSIDADE
              </text>
              {[
                ["P", "pequena", 96],
                ["M", "média", 168],
                ["G", "grande", 232],
              ].map(([t, label, x]) => (
                <g key={t}>
                  <circle cx={x} cy={8} r={RISK_CIRCLE_RADIUS[t] * 0.42} fill="none" stroke={SHEET_INK} strokeWidth="1.2" />
                  <text x={x + RISK_CIRCLE_RADIUS[t] * 0.42 + 5} y={12} fontSize="10" fill={SHEET_INK}>
                    {label}
                  </text>
                </g>
              ))}
              <text x="290" y="12" fontSize="10" fill={SHEET_GRAY}>
                nº = pessoas expostas
              </text>
            </g>
          </>
        );
      }}
    />
  );
}
