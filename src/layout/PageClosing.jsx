// Closing block of the inner pages: WhatsApp call and related links.

import AreaIcon from "../AreaIcon";
import { WhatsappButton } from "./WhatsappButton.jsx";

// Closing block of every inner page, always in the same order: next step, related pages, footer.
export function PageClosing({ title = "Fale com o responsável técnico.", text, whatsappText, whatsappLabel = "Falar no WhatsApp", related = [] }) {
  return (
    <>
      <section className="sec next" id="proximo-passo" aria-labelledby="proximo-titulo">
        <div className="container">
          <p className="sec-n">
            <span>→</span> Próximo passo
          </p>
          <div className="next-grid reveal">
            <h2 id="proximo-titulo" className="sec-title">
              {title}
            </h2>
            <div>
              <p className="lead">
                {text || "Conte o seu caso pelo WhatsApp. A mensagem já vai pronta, sem compromisso. Valor e prazo são informados depois de conhecermos o seu caso."}
              </p>
              <WhatsappButton className="btn-large" text={whatsappText} label={whatsappLabel} />
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="sec related" aria-labelledby="rel-titulo">
          <div className="container">
            <p className="sec-n">
              <span>↗</span> Continue por aqui
            </p>
            <h2 id="rel-titulo" className="sr-only">
              Páginas relacionadas
            </h2>
            <ul className="related-list">
              {related.slice(0, 3).map((r) => (
                <li key={r.href} className="reveal">
                  <a href={r.href}>
                    {r.area && (
                      <span className="icon-tile related-icon">
                        <AreaIcon slug={r.area} size={24} />
                      </span>
                    )}
                    <small>{r.tag}</small>
                    <strong>{r.title}</strong>
                    {r.text && <span>{r.text}</span>}
                    <i aria-hidden="true">→</i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
