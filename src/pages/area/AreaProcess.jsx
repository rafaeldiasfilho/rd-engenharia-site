// "Como funciona" section of an area page (anchor #atendimento): steps from first contact to delivery, documents to have at hand,
// the print link and the stacked sample sheets.
import Icon from "../../Icon";
import { whatsappLink } from "../../contact";
import DocIllustration from "../../DocIllustration";
import { buildReminderPageHref } from "../../content/reminder";
import { PageSection } from "../pageParts.jsx";

export function AreaProcess({ page, overview, number, areaWhatsappText }) {
  return (
    <PageSection id="atendimento" n={number} label="Como funciona" title="Do primeiro contato à entrega." lead="Veja o caminho e o que ter em mãos para agilizar o orçamento." className="sec-alt">
      {overview && (
        <ol className="steps-editorial timeline reveal">
          {overview.steps.map((e, n) => (
            <li key={e.t} className="reveal">
              <span className="step-big" aria-hidden="true">
                {n + 1}
              </span>
              <h3>{e.t}</h3>
              <p>{e.d}</p>
              {n === 0 && (
                <a className="btn btn-whatsapp btn-small" href={whatsappLink(areaWhatsappText)} target="_blank" rel="noopener noreferrer">
                  <Icon name="fa-brands fa-whatsapp" /> Começar agora
                </a>
              )}
            </li>
          ))}
        </ol>
      )}
      <div className="split reveal">
        <div className="split-grid">
          <div className="split-text">
            <h3>Para agilizar, separe</h3>
            <ul className="list-docs">
              {page.documents.map((d) => (
                <li key={d}>
                  <Icon name="fa-solid fa-circle-check" /> {d}
                </li>
              ))}
            </ul>
            <p className="notice-reminder">
              <Icon name="fa-solid fa-bell" /> Pode pedir também o nosso lembrete de vencimento, para não perder o prazo
              de renovação dos documentos. <a href={page.reminderDocumentKey ? buildReminderPageHref(page.reminderDocumentKey) : "/lembrete-de-vencimento"}>Pedir o lembrete</a>.
            </p>
            <a
              className="btn btn-sec no-print"
              href={`/imprimir/${page.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir a lista para imprimir ou salvar em PDF
            </a>
          </div>
          <DocIllustration slug={page.slug} />
        </div>
      </div>
    </PageSection>
  );
}
