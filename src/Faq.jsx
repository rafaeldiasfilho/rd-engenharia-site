import { useEffect, useState } from "react";
import { normaliza } from "./Search";
import { zap } from "./contact";

// FAQ list. With 6 or more questions it gets a filter field (question and answer, accent-insensitive).
// Without JavaScript the field does no harm: all questions show.
// `limite`: shows only the first N (the page gets shorter) and a button to see all; when filtering,
// the search covers all of them.
// Wide screens (≥ 900 px, after mount): questions in one column and the answer beside it, instead of the
// "accordion with little arrows" (redesign skill). On mobile and in the prerendered HTML: <details>, as before.
export default function Perguntas({ itens, minimoFiltro = 6, limite = 0 }) {
  const [q, setQ] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [wide, setWide] = useState(false);
  const [sel, setSel] = useState(0);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const terms = normaliza(q).split(/\s+/).filter((t) => t.length >= 2);
  const visible = terms.length ? itens.filter((f) => terms.every((t) => normaliza(`${f.q} ${f.a}`).includes(t))) : itens;
  const hasFilter = itens.length >= minimoFiltro;

  return (
    <div className="faq-list reveal">
      {hasFilter && (
        <div className="faq-filter">
          <label>
            <span>Filtrar perguntas</span>
            <input type="search" placeholder="Ex.: ART, CAR, orçamento" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <p aria-live="polite">
            {terms.length ? `${visible.length} de ${itens.length} perguntas` : ""}
          </p>
        </div>
      )}
      {wide && visible.length > 0 && (
        <div className="faq-side">
          <ul className="faq-questions">
            {visible.map((f, n) =>
              limite > 0 && !showAll && !terms.length && n >= limite ? null : (
                <li key={f.q}>
                  <button type="button" aria-pressed={Math.min(sel, visible.length - 1) === n} aria-controls="faq-resposta" onClick={() => setSel(n)}>
                    {f.q}
                  </button>
                </li>
              ),
            )}
          </ul>
          {(() => {
            const f = visible[Math.min(sel, visible.length - 1)];
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
      {!wide && visible.map((f, n) => (
        <details className="faq-item" key={f.q} hidden={limite > 0 && !showAll && !terms.length && n >= limite}>
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
      {limite > 0 && !showAll && !terms.length && itens.length > limite && (
        <button type="button" className="btn btn-sec faq-more" onClick={() => setShowAll(true)}>
          Ver todas as {itens.length} perguntas
        </button>
      )}
      {hasFilter && terms.length > 0 && visible.length === 0 && (
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
