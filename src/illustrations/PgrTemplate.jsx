// Interactive illustration: PGR risk inventory table.

import { useState } from "react";

/* ── PGR template (a real table, readable on a phone) ───────────────────────────────────────── */

const PGR_COLUMNS = [
  ["Setor", "Onde o trabalho acontece."],
  ["Perigo", "O que pode causar dano: máquina, produto, postura, altura."],
  ["Possível lesão", "O que pode acontecer com a pessoa se nada for feito."],
  ["Nível", "Probabilidade × severidade. Define a urgência: baixo, moderado ou alto."],
  ["Medida de prevenção", "O que a empresa faz para eliminar ou reduzir o risco, com responsável e prazo no plano de ação."],
];

// CSS class of each risk level shown in the table.
const RISK_LEVEL_CLASS = { Baixo: "level-low", Moderado: "level-moderate", Alto: "level-high" };

const PGR_ROWS = [
  ["Produção", "Ruído de máquinas", "Perda auditiva", "Moderado", "Protetor auricular e manutenção"],
  ["Produção", "Partes móveis da serra", "Cortes e esmagamento", "Alto", "Proteção fixa e bloqueio na manutenção"],
  ["Depósito", "Materiais empilhados", "Queda de objetos", "Moderado", "Prateleiras fixas e limite de altura"],
  ["Escritório", "Postura sentada por horas", "Dor nas costas", "Baixo", "Cadeira ajustável e pausas"],
];

export function PgrTemplate() {
  const [col, setCol] = useState(-1);
  return (
    <figure className="template">
      <div className="template-sheet" role="group" aria-label="Modelo ilustrativo do inventário de riscos de um PGR de uma empresa fictícia">
        <span className="badge-example" aria-hidden="true">
          EXEMPLO
        </span>
        <div className="template-head">
          <span className="template-brand" aria-hidden="true">
            RD
          </span>
          <div>
            <p className="template-type">PGR · NR-01 · Página 4 de 18</p>
            <h3>2. Inventário de riscos</h3>
          </div>
        </div>
        <p className="template-small">Empresa Exemplo Ltda. · CNPJ 00.000.000/0001-00 · Empresa fictícia</p>
        <div className="template-scroll">
          <table>
            <thead>
              <tr>
                {PGR_COLUMNS.map(([name], i) => (
                  <th key={name} scope="col">
                    <button type="button" aria-pressed={col === i} onClick={() => setCol((c) => (c === i ? -1 : i))}>
                      {name}
                      <span aria-hidden="true">?</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PGR_ROWS.map((l, r) => (
                <tr key={r}>
                  {l.map((c, i) => (
                    <td key={i} data-active={col === i ? "" : undefined}>
                      {i === 3 ? <span className={`level ${RISK_LEVEL_CLASS[c]}`}>{c}</span> : c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="template-explain" aria-live="polite">
          {col >= 0 ? (
            <>
              <strong>{PGR_COLUMNS[col][0]}:</strong> {PGR_COLUMNS[col][1]}
            </>
          ) : (
            "Toque no título de uma coluna para ver o que ela significa."
          )}
        </p>
        <p className="template-footer">Inventário de riscos (trecho) · Revisão 00 · RD Engenharia</p>
      </div>
      <figcaption>Modelo ilustrativo, com empresa e dados inventados, para mostrar como o programa organiza perigos, riscos e medidas.</figcaption>
    </figure>
  );
}
