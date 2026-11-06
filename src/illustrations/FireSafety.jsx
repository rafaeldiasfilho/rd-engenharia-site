// Interactive illustration: fire safety items in a building (extinguisher, emergency light, escape route, exit sign).

import { SHEET_PAPER, SHEET_INK, SHEET_RED } from "../SheetBase";
import { InteractiveIllustration, ILLUSTRATION_LABEL, ILLUSTRATION_LABEL_BOLD } from "./illustrationParts.jsx";

/* ── Fire safety ────────────────────────────────────────────────────────────────────────────── */

const EXIT_GREEN = "#2f8f46";

const LIGHT_YELLOW = "#f2c230";

const FIRE_ITEMS = [
  { id: "extinguisher", color: SHEET_RED, name: "Extintor", text: "Primeiro combate ao fogo. O projeto define o tipo (aqui, pó químico ABC), quantos são e onde ficam, sempre sinalizados e fáceis de alcançar." },
  { id: "emergencyLight", color: LIGHT_YELLOW, name: "Iluminação de emergência", text: "Acende sozinha quando falta energia, para que as pessoas enxerguem o caminho até a saída." },
  { id: "escapeRoute", color: EXIT_GREEN, name: "Rota de fuga", text: "Caminho até a saída, que precisa ficar sempre livre de mercadorias e obstáculos." },
  { id: "exitSign", color: "#1f6b36", name: "Placa de saída", text: "Placa fotoluminescente que indica a saída mesmo no escuro. Fica sobre a porta e nas mudanças de direção." },
];

export function FireSafety() {
  const wall = { stroke: SHEET_INK, fill: "none", strokeLinecap: "square" };
  return (
    <InteractiveIllustration
      items={FIRE_ITEMS}
      label="Elementos da planta"
      title="Planta ilustrativa de segurança contra incêndio de um pequeno comércio"
      titleId="t-bomb"
      stamp={{ title: "Planta de medidas de segurança contra incêndio", client: "Comércio Exemplo Ltda." }}
      finalCaption="Desenho ilustrativo de um projeto de incêndio. Não representa nenhum imóvel real."
      drawing={({ opacityFor, choose }) => (
        <>
          <g {...wall}>
            <rect x="24" y="40" width="372" height="232" strokeWidth="5" />
            <path d="M262 40V272M262 160H396M330 160V272" strokeWidth="3" />
          </g>
          {/* openings and doors */}
          <g fill={SHEET_PAPER}>
            <rect x="112" y="268" width="44" height="8" />
            <rect x="259" y="88" width="6" height="22" />
            <rect x="272" y="157" width="22" height="6" />
            <rect x="340" y="157" width="22" height="6" />
          </g>
          <g stroke={SHEET_INK} fill="none" strokeWidth="1.4">
            <path d="M112 272v22M156 272v22" />
            <path d="M134 272a22 22 0 0 1 -22 22M134 272a22 22 0 0 0 22 22" strokeWidth="0.8" strokeDasharray="3 2" />
            <path d="M262 88h22" />
            <path d="M262 110A22 22 0 0 0 284 88" strokeWidth="0.8" strokeDasharray="3 2" />
            <path d="M272 160v22M340 160v22" />
            <path d="M294 160A22 22 0 0 1 272 182M362 160A22 22 0 0 1 340 182" strokeWidth="0.8" strokeDasharray="3 2" />
          </g>
          <text x="140" y="120" style={ILLUSTRATION_LABEL_BOLD} textAnchor="middle">
            LOJA
          </text>
          <text x="140" y="134" style={ILLUSTRATION_LABEL} textAnchor="middle">
            186,40 m²
          </text>
          <text x="330" y="96" style={ILLUSTRATION_LABEL_BOLD} textAnchor="middle">
            ESTOQUE
          </text>
          <text x="296" y="226" style={ILLUSTRATION_LABEL_BOLD} textAnchor="middle">
            WC
          </text>
          <text x="364" y="226" style={ILLUSTRATION_LABEL_BOLD} textAnchor="middle">
            ESCRIT.
          </text>
          <g style={opacityFor("escapeRoute")} onClick={() => choose("escapeRoute")}>
            <path d="M360 236L352 172L320 140L262 102L180 170L136 252" fill="none" stroke={EXIT_GREEN} strokeWidth="3" strokeDasharray="9 6" strokeLinecap="round" />
            <path d="M136 262l-8 -12h16z" fill={EXIT_GREEN} />
          </g>
          <g style={opacityFor("exitSign")} onClick={() => choose("exitSign")}>
            <rect x="112" y="244" width="44" height="16" rx="2" fill="#1f6b36" />
            <text x="134" y="256" fontSize="10" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="inherit">
              SAÍDA
            </text>
            <rect x="230" y="96" width="26" height="12" rx="2" fill="#1f6b36" />
            <path d="M236 102h12m-4 -4 4 4-4 4" stroke="#fff" strokeWidth="1.6" fill="none" />
          </g>
          <g style={opacityFor("extinguisher")} onClick={() => choose("extinguisher")}>
            {[
              [50, 250],
              [210, 62],
              [280, 132],
              [374, 252],
            ].map(([x, y]) => (
              <g key={`${x}-${y}`}>
                <circle cx={x} cy={y} r="10" fill={SHEET_RED} />
                <text x={x} y={y + 4} fontSize="11" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="inherit">
                  E
                </text>
              </g>
            ))}
          </g>
          <g style={opacityFor("emergencyLight")} onClick={() => choose("emergencyLight")} fill={LIGHT_YELLOW} stroke="#7a5b00" strokeWidth="1.2">
            {[
              [80, 90],
              [200, 90],
              [80, 200],
              [200, 200],
              [330, 70],
              [296, 196],
            ].map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x - 10} y={y - 5} width="20" height="10" rx="2" />
            ))}
          </g>
          <g transform="translate(14 286)">
            <path d="M0 -10l5 13-5-3-5 3z" fill={SHEET_INK} />
            <text x="0" y="12" fontSize="10" fontWeight="700" fill={SHEET_INK} textAnchor="middle" fontFamily="inherit">
              N
            </text>
          </g>
          <text x="24" y="28" style={ILLUSTRATION_LABEL}>
            Escala 1:100 · área 288,00 m²
          </text>
        </>
      )}
    />
  );
}
