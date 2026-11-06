// Example inner pages with charts, measurements, drawings and flows.

import { AMBER, BLUE, BORDER, GRAY, BACKGROUND, LINE, BROWN, INK, GREEN, LIGHT_GREEN, RED } from "../SheetBase";
import { Tx } from "./drawingParts.jsx";
import { Chip, Paragraph, Table } from "./innerPageParts.jsx";

// Inner pages with charts, measurements, drawings and flows.
export const INNER_PAGES_CHARTS = {
  grafico: {
    intro: "Ruído medido por função, comparado ao limite de tolerância de 85 dB(A) para 8 horas de trabalho (NR-15, Anexo 1).",
    body: () => {
      const jobs = [
        ["Operador de máquina", 91.3],
        ["Auxiliar de produção", 86.8],
        ["Almoxarife", 79.5],
        ["Administrativo", 68.2],
      ];
      const xb = (v) => 52 + (v - 60) * 2;
      return (
        <g>
          {jobs.map(([job, v], i) => (
            <g key={job}>
              <Tx x={10} y={60 + i * 9} s={2.5}>
                {job}
              </Tx>
              <rect x="52" y={56 + i * 9} width={xb(v) - 52} height="5" rx="1" fill={v > 85 ? RED : GREEN} opacity="0.85" />
              <Tx x={xb(v) + 1.6} y={60 + i * 9} s={2.4} b>
                {v.toFixed(1).replace(".", ",")}
              </Tx>
            </g>
          ))}
          <line x1={xb(85)} y1="52" x2={xb(85)} y2="92" stroke={RED} strokeWidth="0.5" strokeDasharray="1.6 1" />
          <Tx x={xb(85)} y={50.6} s={2.1} b c={RED} a="middle">
            85 dB(A)
          </Tx>
          {[60, 70, 80, 90, 100].map((v) => (
            <Tx key={v} x={xb(v)} y={96} s={1.9} c={GRAY} a="middle">
              {v}
            </Tx>
          ))}
          <Tx x={xb(100)} y={99.6} s={1.9} c={GRAY} a="end">
            dB(A)
          </Tx>
          <Table
            y={104}
            rowHeight={8}
            cols={[
              { t: "Função", w: 40 },
              { t: "Agente", w: 24 },
              { t: "Conclusão", w: 66 },
            ]}
            rows={[
              ["Operador de máquina", "Ruído", { chip: "Acima do limite" }],
              ["Auxiliar de produção", "Ruído", { chip: "Acima do limite" }],
              ["Almoxarife", "Ruído", { chip: "Abaixo do limite" }],
              ["Administrativo", "—", { chip: "Sem exposição" }],
            ]}
          />
        </g>
      );
    },
  },
  medicao: {
    intro: "Resultados das avaliações no posto de trabalho e a conclusão segundo a NR-15 (insalubridade) e a NR-16 (periculosidade).",
    body: () => (
      <g>
        <path d="M30 84a22 22 0 0 1 44 0" fill="none" stroke={LINE} strokeWidth="5" />
        <path d="M30 84a22 22 0 0 1 33.6 -18.6" fill="none" stroke={LIGHT_GREEN} strokeWidth="5" />
        <path d="M63.6 65.4a22 22 0 0 1 10.4 18.6" fill="none" stroke={RED} strokeWidth="5" opacity="0.75" />
        <line x1="52" y1="84" x2="68" y2="70" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="52" cy="84" r="2" fill={INK} />
        <Tx x={52} y={93} s={4.4} b a="middle">
          88,2 dB(A)
        </Tx>
        <Tx x={52} y={97.6} s={2.2} c={GRAY} a="middle">
          ruído no posto · limite 85 dB(A)
        </Tx>
        {["Posto: operador da serra", "Jornada: 8 horas", "Medição: dosímetro de ruído", "Medidas: 3 dias de trabalho"].map((t, k) => (
          <Tx key={t} x={84} y={66 + k * 5} s={2.4} c={GRAY}>
            {t}
          </Tx>
        ))}
        <Table
          y={104}
          rowHeight={10.4}
          cols={[
            { t: "Agente", w: 26 },
            { t: "Medido", w: 24 },
            { t: "Critério", w: 26 },
            { t: "Conclusão", w: 54 },
          ]}
          rows={[
            ["Ruído contínuo", "88,2 dB(A)", "NR-15, Anexo 1", { chip: "Insalubre, grau médio" }],
            ["Calor", "IBUTG 25,9 °C", "NR-15, Anexo 3", { chip: "Não insalubre" }],
            ["Inflamáveis", "—", "NR-16", { chip: "Não perigoso" }],
          ]}
        />
        <Paragraph y={150} s={2.4} c={GRAY} text="Insalubridade em grau médio dá direito ao adicional de 20% sobre o salário mínimo, enquanto a exposição continuar." />
      </g>
    ),
  },
  fachada: {
    intro: "Anomalias encontradas na vistoria da fachada, numeradas no desenho, com a prioridade de correção de cada uma.",
    body: () => (
      <g>
        <path d="M18 58L75 46L132 58" fill="none" stroke={INK} strokeWidth="0.9" />
        <rect x="22" y="58" width="106" height="44" fill="#f6f4ee" stroke={INK} strokeWidth="0.9" />
        {[34, 58, 92, 116].map((x) => (
          <rect key={x} x={x - 6} y="64" width="12" height="11" fill="#e4ebef" stroke={INK} strokeWidth="0.5" />
        ))}
        {[34, 116].map((x) => (
          <rect key={x} x={x - 6} y="82" width="12" height="11" fill="#e4ebef" stroke={INK} strokeWidth="0.5" />
        ))}
        <rect x="68" y="80" width="14" height="22" fill="#d9cdb8" stroke={INK} strokeWidth="0.5" />
        <path d="M64 75l3 4-2 3 3 4-1 3" fill="none" stroke={RED} strokeWidth="0.7" strokeLinecap="round" />
        <ellipse cx="100" cy="61.6" rx="9" ry="3" fill={BROWN} opacity="0.35" />
        <rect x="40" y="95" width="12" height="7" fill="#c9bfae" />
        <path d="M40 102l4-7M44 102l4-7M48 102l4-7" stroke="#8d8270" strokeWidth="0.4" />
        {[
          [1, 68, 72],
          [2, 100, 56],
          [3, 46, 92],
        ].map(([n, x, y]) => (
          <g key={n}>
            <circle cx={x + 5} cy={y - 3} r="2.6" fill={RED} />
            <Tx x={x + 5} y={y - 2} s={2.6} b c="#fff" a="middle">
              {n}
            </Tx>
          </g>
        ))}
        <Table
          y={108}
          rowHeight={9}
          cols={[
            { t: "Nº", w: 10 },
            { t: "Anomalia", w: 56 },
            { t: "Sistema", w: 30 },
            { t: "Grau de risco", w: 34 },
          ]}
          rows={[
            ["1", "Fissura inclinada no canto da janela", "Vedação", { chip: "Médio" }],
            ["2", "Mancha de umidade sob o beiral", "Cobertura", { chip: "Alto" }],
            ["3", "Desplacamento do reboco junto ao piso", "Revestimento", { chip: "Alto" }],
          ]}
        />
      </g>
    ),
  },
  laudo: {
    intro: "Registro fotográfico da vistoria, com a descrição de cada ponto observado no imóvel.",
    body: () => (
      <g>
        <rect x="10" y="50" width="62" height="40" fill="#dfe8ee" />
        <rect x="10" y="76" width="62" height="14" fill="#cfd8c4" />
        <path d="M24 76V60l17-9 17 9v16z" fill="#f2efe6" stroke={INK} strokeWidth="0.5" />
        <rect x="37" y="66" width="8" height="10" fill="#b9a68a" />
        <rect x="78" y="50" width="62" height="40" fill="#efece4" />
        <path d="M96 52l4 8-3 6 5 9-2 6 4 8" fill="none" stroke="#6a5a48" strokeWidth="0.8" strokeLinecap="round" />
        <rect x="78" y="50" width="62" height="40" fill="none" stroke={BORDER} strokeWidth="0.5" />
        <rect x="10" y="50" width="62" height="40" fill="none" stroke={BORDER} strokeWidth="0.5" />
        <Tx x={10} y={95} s={2.4} c={GRAY}>
          Foto 1 · Fachada frontal
        </Tx>
        <Tx x={78} y={95} s={2.4} c={GRAY}>
          Foto 2 · Fissura na parede da sala
        </Tx>
        <Tx x={10} y={106} s={2.8} b>
          Observações
        </Tx>
        <Paragraph y={112} text="A fissura da foto 2 é superficial, no reboco, sem sinais de movimentação da estrutura nesta vistoria. Recomenda-se abrir a fissura, aplicar selante flexível e refazer a pintura." />
        <Tx x={10} y={134} s={2.8} b>
          Conclusão
        </Tx>
        <Paragraph y={140} text="O imóvel apresenta condições de uso. As correções indicadas são de manutenção e podem ser feitas sem desocupar o imóvel." />
      </g>
    ),
  },
  fluxo: {
    idx: 2,
    intro: "Etapas do licenciamento ambiental da atividade e do pedido de outorga de uso da água, com a situação de cada uma.",
    body: () => {
      const steps = [
        ["1. Enquadramento da atividade", "Concluído"],
        ["2. Licença Prévia (LP)", "Concluído"],
        ["3. Licença de Instalação (LI)", "Em análise"],
        ["4. Licença de Operação (LO)", "Aguardando"],
      ];
      return (
        <g>
          {steps.map(([t, status], i) => (
            <g key={t}>
              <rect x="10" y={52 + i * 18} width="84" height="12" rx="2.4" fill={i < 2 ? BACKGROUND : "#fff"} stroke={i === 2 ? AMBER : BORDER} strokeWidth="0.6" />
              <Tx x={14} y={59.6 + i * 18} s={2.7} b>
                {t}
              </Tx>
              <Chip x={100} y={59.4 + i * 18} t={status} />
              {i < 3 && <path d={`M52 ${64 + i * 18}v5m-2 -2 2 2 2 -2`} fill="none" stroke={GRAY} strokeWidth="0.6" />}
            </g>
          ))}
          <rect x="10" y="126" width="130" height="14" rx="2.4" fill="#fff" stroke={BLUE} strokeWidth="0.6" strokeDasharray="2 1.2" />
          <Tx x={14} y={134.6} s={2.7} b>
            Outorga de uso da água (poço)
          </Tx>
          <Chip x={100} y={134.4} t="Protocolada" />
          <Paragraph y={150} s={2.4} c={GRAY} text="Protocolo nº 000000/2026 (exemplo). A RD acompanha os prazos e responde às exigências do órgão ambiental." />
        </g>
      );
    },
  },
};
