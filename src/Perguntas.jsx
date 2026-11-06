import { useEffect, useState } from "react";
import { normaliza } from "./Busca";
import { zap } from "./contato";

// Lista de perguntas frequentes. Com 6 perguntas ou mais, ganha um campo para filtrar (pergunta e
// resposta, sem acentos). Sem JavaScript, o campo não atrapalha: todas as perguntas aparecem.
// `limite`: mostra só as primeiras N (a página fica mais curta) e um botão para ver todas; ao filtrar,
// a busca vale para todas.
// Telas largas (≥ 900 px, depois de montar): perguntas numa coluna e a resposta ao lado, no lugar do
// "acordeão com setinhas" (skill de redesign). No celular e no HTML pré-gerado: <details>, como antes.
export default function Perguntas({ itens, minimoFiltro = 6, limite = 0 }) {
  const [q, setQ] = useState("");
  const [todas, setTodas] = useState(false);
  const [largo, setLargo] = useState(false);
  const [sel, setSel] = useState(0);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const ver = () => setLargo(mq.matches);
    ver();
    mq.addEventListener("change", ver);
    return () => mq.removeEventListener("change", ver);
  }, []);
  const termos = normaliza(q).split(/\s+/).filter((t) => t.length >= 2);
  const visiveis = termos.length ? itens.filter((f) => termos.every((t) => normaliza(`${f.q} ${f.a}`).includes(t))) : itens;
  const comFiltro = itens.length >= minimoFiltro;

  return (
    <div className="faq-list reveal">
      {comFiltro && (
        <div className="faq-filter">
          <label>
            <span>Filtrar perguntas</span>
            <input type="search" placeholder="Ex.: ART, CAR, orçamento" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <p aria-live="polite">
            {termos.length ? `${visiveis.length} de ${itens.length} perguntas` : ""}
          </p>
        </div>
      )}
      {largo && visiveis.length > 0 && (
        <div className="faq-side">
          <ul className="faq-questions">
            {visiveis.map((f, n) =>
              limite > 0 && !todas && !termos.length && n >= limite ? null : (
                <li key={f.q}>
                  <button type="button" aria-pressed={Math.min(sel, visiveis.length - 1) === n} aria-controls="faq-resposta" onClick={() => setSel(n)}>
                    {f.q}
                  </button>
                </li>
              ),
            )}
          </ul>
          {(() => {
            const f = visiveis[Math.min(sel, visiveis.length - 1)];
            return (
              <div className="faq-answer" id="faq-resposta" aria-live="polite">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
                {f.guia && (
                  <p className="faq-guide">
                    <a href={`/${f.guia}`}>
                      Ler o guia completo <span aria-hidden="true">→</span>
                    </a>
                  </p>
                )}
                <p className="faq-followup">
                  Ficou alguma dúvida?{" "}
                  <a href={zap(`Olá! Tenho uma dúvida: ${f.q}`)} target="_blank" rel="noopener noreferrer">
                    Pergunte no WhatsApp
                  </a>
                </p>
              </div>
            );
          })()}
        </div>
      )}
      {!largo && visiveis.map((f, n) => (
        <details className="faq-item" key={f.q} hidden={limite > 0 && !todas && !termos.length && n >= limite}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
          {f.guia && (
            <p className="faq-guide">
              <a href={`/${f.guia}`}>
                Ler o guia completo <span aria-hidden="true">→</span>
              </a>
            </p>
          )}
        </details>
      ))}
      {limite > 0 && !todas && !termos.length && itens.length > limite && (
        <button type="button" className="btn btn-sec faq-more" onClick={() => setTodas(true)}>
          Ver todas as {itens.length} perguntas
        </button>
      )}
      {comFiltro && termos.length > 0 && visiveis.length === 0 && (
        <p className="faq-empty">
          Nenhuma pergunta com “{q.trim()}”.{" "}
          <a href={zap(`Olá! Tenho uma dúvida sobre: ${q.trim()}`)} target="_blank" rel="noopener noreferrer">
            Pergunte direto no WhatsApp
          </a>
          .
        </p>
      )}
    </div>
  );
}
