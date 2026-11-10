// Closing block of the inner pages: WhatsApp call and related links.

import AreaIcon from "../AreaIcon";
import { WhatsappButton } from "./WhatsappButton.jsx";
import { useCurrentWhatsappMessage } from "../currentWhatsappMessage.js";

// Closing block of every inner page, always in the same order: next step, related pages, footer.
// When the visitor built a message on the page (marked services, wizard result), the button sends it.
export function PageClosing({ title = "Fale com o responsável técnico.", text, whatsappText, whatsappLabel = "Falar no WhatsApp", related = [] }) {
  const currentMessage = useCurrentWhatsappMessage();
  return (
    <>
      <section className="sec next" id="proximo-passo" aria-labelledby="next-step-title">
        <div className="container">
          <p className="sec-n">
            <span>→</span> Próximo passo
          </p>
          <div className="next-grid reveal">
            <h2 id="next-step-title" className="sec-title">
              {title}
            </h2>
            <div>
              <p className="lead">
                {text || "Conte o seu caso pelo WhatsApp. A mensagem já vai pronta, sem compromisso. Valor e prazo são informados depois de conhecermos o seu caso."}
              </p>
              <WhatsappButton className="btn-large" text={currentMessage?.text || whatsappText} label={currentMessage?.label || whatsappLabel} />
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="sec related" aria-labelledby="related-title">
          <div className="container">
            <p className="sec-n">
              <span>↗</span> Continue por aqui
            </p>
            <h2 id="related-title" className="sr-only">
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
