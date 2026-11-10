// "Situações comuns" section of an area page, with the way out to the wizard or WhatsApp.
// Each situation is in the visitor's own words, so tapping it opens WhatsApp with that sentence.
import AreaIcon from "../../AreaIcon";
import Icon from "../../Icon";
import { whatsappLink } from "../../contact";
import { situationWhatsappMessage } from "../../whatsappMessages";
import { PageSection } from "../pageParts.jsx";

export function AreaSituations({ page, number, areaWhatsappText }) {
  return (
    <PageSection id="situacoes" n={number} label="Situações comuns" title="Você se reconhece em alguma destas?">
      <ul className="situations-list">
        {page.situations.map((t) => (
          <li key={t} className="reveal">
            <AreaIcon slug={page.slug} size={26} />
            <a className="situation-link" href={whatsappLink(situationWhatsappMessage(page, t))} target="_blank" rel="noopener noreferrer">
              {t}
            </a>
            <span className="situation-action" aria-hidden="true">
              <Icon name="fa-brands fa-whatsapp" /> Falar sobre isso
            </span>
          </li>
        ))}
      </ul>
      <p className="situations-help reveal">
        Não tem certeza de qual é o seu caso? <a href="/o-que-preciso">Responda ao passo a passo</a> ou{" "}
        <a href={whatsappLink(areaWhatsappText)} target="_blank" rel="noopener noreferrer">
          conte pelo WhatsApp
        </a>
        .
      </p>
    </PageSection>
  );
}
