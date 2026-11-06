// Example inner pages built from tables, lists and checklists.

import { AMBER, BORDER, GRAY, BACKGROUND, LINE, GREEN, RED } from "../SheetBase";
import { Checklist, Chip, Paragraph, Table } from "./innerPageParts.jsx";
import { Tx } from "./drawingParts.jsx";

const CHECKLISTS = {
  "PGR × PCMSO": [
    ["Funções e setores da empresa", "Enviado"],
    ["Riscos de cada função (inventário do PGR)", "Enviado"],
    ["Exposições acima do nível de ação", "Enviado", "Ruído no setor de produção"],
    ["Medidas de proteção em uso", "Enviado"],
    ["Mudanças previstas no plano de ação", "Em andamento", "Troca de máquina em 2027"],
  ],
  AVCB: [
    ["Extintores", "Conforme", "Dentro da validade e sinalizados"],
    ["Sinalização de emergência", "Conforme"],
    ["Iluminação de emergência", "Pendente", "2 blocos autônomos sem bateria"],
    ["Saídas de emergência desobstruídas", "Conforme"],
    ["Brigada de incêndio", "Pendente", "Treinamento a agendar"],
    ["Hidrantes e mangueiras", "Conforme", "Teste de mangueiras em dia"],
  ],
  CLCB: [
    ["Extintores", "Exigida"],
    ["Sinalização de emergência", "Exigida"],
    ["Iluminação de emergência", "Exigida"],
    ["Saídas de emergência", "Exigida"],
  ],
};

// Inner pages with tables, lists and checklists.
export const INNER_PAGES_TABLES = {
  tabela: {
    intro: "Para cada setor: os perigos, as possíveis lesões, o nível de risco (probabilidade × severidade) e as medidas de prevenção.",
    body: () => (
      <g>
        <Table
          y={52}
          rowHeight={10.4}
          cols={[
            { t: "Setor", w: 20 },
            { t: "Perigo", w: 27 },
            { t: "Possível lesão", w: 26 },
            { t: "Nível", w: 19 },
            { t: "Medida de prevenção", w: 38 },
          ]}
          rows={[
            ["Produção", "Ruído de máquinas", "Perda auditiva", { chip: "Moderado" }, "Protetor auricular; manutenção"],
            ["Produção", "Partes móveis da serra", "Cortes e esmagamento", { chip: "Alto" }, "Proteção fixa; bloqueio na manutenção"],
            ["Depósito", "Empilhamento alto", "Queda de objetos", { chip: "Moderado" }, "Prateleiras fixas; limite de altura"],
            ["Escritório", "Postura sentada", "Dor lombar", { chip: "Baixo" }, "Cadeira ajustável; pausas"],
            ["Pátio", "Circulação de veículos", "Atropelamento", { chip: "Alto" }, "Faixa de pedestres; sinalização"],
          ]}
        />
        <Tx x={10} y={122} s={2.6} b>
          Matriz de risco
        </Tx>
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => {
            const n = r + c;
            return <rect key={`${r}${c}`} x={10 + c * 8} y={126 + (2 - r) * 8} width="7.4" height="7.4" rx="1" fill={n < 2 ? GREEN : n < 3 ? AMBER : RED} opacity="0.75" />;
          })
        )}
        <Tx x={22} y={153} s={2} c={GRAY} a="middle">
          Severidade →
        </Tx>
        <Tx x={7.6} y={138} s={2} c={GRAY} a="middle" r={-90}>
          Probabilidade →
        </Tx>
        {[
          ["Baixo", "manter os controles existentes"],
          ["Moderado", "incluir no plano de ação, com prazo"],
          ["Alto", "ação imediata antes de seguir a atividade"],
        ].map(([n, t], k) => (
          <g key={n}>
            <Chip x={42} y={131 + k * 7.4} t={n} />
            <Tx x={66} y={131 + k * 7.4} s={2.5}>
              {t}
            </Tx>
          </g>
        ))}
      </g>
    ),
  },
  residuos: {
    intro: "Resíduos gerados na empresa, classificados conforme a ABNT NBR 10004, com a forma de guardar e o destino de cada um.",
    body: () => (
      <g>
        <Table
          y={52}
          rowHeight={10.4}
          cols={[
            { t: "Resíduo", w: 30 },
            { t: "Classe", w: 14 },
            { t: "Acondicionamento", w: 40 },
            { t: "Destino", w: 46 },
          ]}
          rows={[
            ["Papel e papelão", "II A", "Contêiner azul em área coberta", "Coleta seletiva e reciclagem"],
            ["Lâmpadas fluorescentes", "I", "Caixa original, local seco", "Logística reversa (empresa licenciada)"],
            ["Óleo lubrificante usado", "I", "Tambor sobre bacia de contenção", "Coleta para rerrefino"],
            ["Restos de alimentos", "II A", "Lixeira com tampa e pedal", "Coleta municipal"],
            ["Entulho de reforma", "II B", "Caçamba identificada", "Aterro de inertes licenciado"],
          ]}
        />
        <Paragraph y={124} text="Registros: manifestos de transporte de resíduos (MTR) e certificados de destinação ficam arquivados por resíduo e por saída." />
        <Paragraph y={140} s={2.4} c={GRAY} text="Classe I: perigoso. Classe II A: não perigoso e não inerte. Classe II B: não perigoso e inerte." />
      </g>
    ),
  },
  apr: {
    intro: "Atividade: troca de telhas do galpão (trabalho em altura). Antes de começar, a equipe confere cada etapa e as medidas de controle.",
    body: () => (
      <g>
        <Table
          y={52}
          rowHeight={10.4}
          cols={[
            { t: "Etapa", w: 24 },
            { t: "Perigo", w: 23 },
            { t: "Risco", w: 15 },
            { t: "Medida de controle", w: 46 },
            { t: "Resp.", w: 22 },
          ]}
          rows={[
            ["Acesso ao telhado", "Queda de altura", { chip: "Alto" }, "Linha de vida, cinto paraquedista, equipe treinada na NR-35", "Encarregado"],
            ["Retirada das telhas", "Queda de materiais", { chip: "Médio" }, "Isolar a área abaixo; capacete com jugular", "Encarregado"],
            ["Corte e fixação", "Cortes nas mãos", { chip: "Baixo" }, "Luvas e ferramenta adequada", "Equipe"],
            ["Condições do tempo", "Chuva e vento", { chip: "Médio" }, "Suspender a atividade com chuva ou vento forte", "Encarregado"],
          ]}
        />
        <Tx x={10} y={115} s={2.7} b>
          Liberação da atividade
        </Tx>
        <Tx x={10} y={122} s={2.6}>
          ( ) Liberada ( ) Não liberada
        </Tx>
        <g stroke={BORDER} strokeWidth="0.5">
          <line x1="10" y1="146" x2="68" y2="146" />
          <line x1="82" y1="146" x2="140" y2="146" />
        </g>
        <Tx x={39} y={150.4} s={2.3} c={GRAY} a="middle">
          Elaborado por
        </Tx>
        <Tx x={111} y={150.4} s={2.3} c={GRAY} a="middle">
          Liberado por
        </Tx>
      </g>
    ),
  },
  checklist: {
    intro: (m) =>
      ({
        "PGR × PCMSO": "Informações do PGR que o médico do trabalho usa para elaborar o PCMSO. O PCMSO é de responsabilidade do médico.",
        AVCB: "Situação de cada medida de segurança contra incêndio antes de pedir a vistoria do Corpo de Bombeiros.",
        CLCB: "Dados da edificação usados para verificar se ela pode ser regularizada pelo CLCB, e as medidas exigidas.",
      })[m.title] || null,
    body: (m) =>
      m.title === "CLCB" ? (
        <g>
          {[
            ["Área construída", "480,00 m²"],
            ["Altura da edificação", "6,00 m"],
            ["Ocupação", "Comércio varejista"],
            ["Pavimentos", "1 (térreo)"],
          ].map(([k, v], i) => (
            <g key={k}>
              <Tx x={10} y={56 + i * 7} s={2.6} c={GRAY}>
                {k}
              </Tx>
              <Tx x={140} y={56 + i * 7} s={2.6} b a="end">
                {v}
              </Tx>
              <line x1="10" y1={58.4 + i * 7} x2="140" y2={58.4 + i * 7} stroke={LINE} strokeWidth="0.35" />
            </g>
          ))}
          <rect x="10" y="88" width="130" height="11" rx="2" fill={BACKGROUND} />
          <Tx x={14} y={95.2} s={2.8} b>
            Resultado: a edificação atende às condições do CLCB.
          </Tx>
          <Tx x={10} y={110} s={2.8} b>
            Medidas de segurança exigidas
          </Tx>
          <Checklist y={120} items={CHECKLISTS.CLCB} />
        </g>
      ) : (
        <Checklist y={56} items={CHECKLISTS[m.title] || CHECKLISTS.AVCB} />
      ),
  },
};
