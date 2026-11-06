import { useEffect, useState } from "react";
import { normalize } from "./searchIndex";
import { whatsappLink } from "./contact";

// FAQ list. With 6 or more questions it gets a filter field (question and answer, accent-insensitive).
// Without JavaScript the field does no harm: all questions show.
// `limite`: shows only the first N (the page gets shorter) and a button to see all; when filtering,
// the search covers all of them.
// Wide screens (≥ 900 px, after mount): questions in one column and the answer beside it, instead of the
// "accordion with little arrows" (redesign skill). On mobile and in the prerendered HTML: <details>, as before.
export default function Faq({ items, minFilter = 6, limit = 0 }) {
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
  const terms = normalize(q).split(/\s+/).filter((t) => t.length >= 2);
  const visible = terms.length ? items.filter((f) => terms.every((t) => normalize(`${f.q} ${f.a}`).includes(t))) : items;
  const hasFilter = items.length >= minFilter;

  return (
    <div className="faq-list reveal">
      {hasFilter && (
        <div className="faq-filter">
          <label>
            <span>Filtrar perguntas</span>
            <input type="search" placeholder="Ex.: ART, CAR, orçamento" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <p aria-live="polite">
            {terms.length ? `${visible.length} de ${items.length} perguntas` : ""}
          </p>
        </div>
      )}
      {wide && visible.length > 0 && (
        <div className="faq-side">
          <ul className="faq-questions">
            {visible.map((f, n) =>
              limit > 0 && !showAll && !terms.length && n >= limit ? null : (
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
                {f.guide && (
                  <p className="faq-guide">
                    <a href={`/${f.guide}`}>
                      Ler o guia completo <span aria-hidden="true">→</span>
                    </a>
                  </p>
                )}
                <p className="faq-followup">
                  Ficou alguma dúvida?{" "}
                  <a href={whatsappLink(`Olá! Tenho uma dúvida: ${f.q}`)} target="_blank" rel="noopener noreferrer">
                    Pergunte no WhatsApp
                  </a>
                </p>
              </div>
            );
          })()}
        </div>
      )}
      {!wide && visible.map((f, n) => (
        <details className="faq-item" key={f.q} hidden={limit > 0 && !showAll && !terms.length && n >= limit}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
          {f.guide && (
            <p className="faq-guide">
              <a href={`/${f.guide}`}>
                Ler o guia completo <span aria-hidden="true">→</span>
              </a>
            </p>
          )}
        </details>
      ))}
      {limit > 0 && !showAll && !terms.length && items.length > limit && (
        <button type="button" className="btn btn-sec faq-more" onClick={() => setShowAll(true)}>
          Ver todas as {items.length} perguntas
        </button>
      )}
      {hasFilter && terms.length > 0 && visible.length === 0 && (
        <p className="faq-empty">
          Nenhuma pergunta com “{q.trim()}”.{" "}
          <a href={whatsappLink(`Olá! Tenho uma dúvida sobre: ${q.trim()}`)} target="_blank" rel="noopener noreferrer">
            Pergunte direto no WhatsApp
          </a>
          .
        </p>
      )}
    </div>
  );
}
