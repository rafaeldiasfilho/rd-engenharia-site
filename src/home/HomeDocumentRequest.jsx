// "Alguém pediu um documento?" block of the home page. Many visitors know who asked for a document
// (bank, registry office, city hall, accountant) but not its name. Each option opens WhatsApp with that
// sentence, and the visitor sends a photo of the request.
import Icon from "../Icon";
import { whatsappLink } from "../contact";
import { DOCUMENT_REQUESTERS, documentRequestWhatsappMessage } from "../whatsappMessages";

export function HomeDocumentRequest() {
  return (
    <section className="sec document-request" aria-labelledby="document-request-title">
      <div className="container">
        <div className="document-request-box reveal">
          <h2 id="document-request-title" className="document-request-title">
            Alguém pediu um documento e você não sabe qual é?
          </h2>
          <p className="document-request-lead">Toque em quem pediu e mande a foto do pedido pelo WhatsApp. Dizemos qual é o documento e o que fazer.</p>
          <ul className="document-request-options">
            {DOCUMENT_REQUESTERS.map((requester) => (
              <li key={requester.key}>
                <a className="document-request-option" href={whatsappLink(documentRequestWhatsappMessage(requester))} target="_blank" rel="noopener noreferrer">
                  <Icon name="fa-brands fa-whatsapp" /> {requester.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
