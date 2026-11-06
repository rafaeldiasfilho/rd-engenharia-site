// "Situações comuns" section of an area page, with the way out to the wizard or WhatsApp.
import AreaIcon from "../../AreaIcon";
import { whatsappLink } from "../../contact";
import { PageSection } from "../pageParts.jsx";

export function AreaSituations({ page, number, areaWhatsappText }) {
  return (
    <PageSection id="situacoes" n={number} label="Situações comuns" title="Você se reconhece em alguma destas?">
      <ul className="situations-list">
        {page.situations.map((t) => (
          <li key={t} className="reveal">
            <AreaIcon slug={page.slug} size={26} />
            <span>{t}</span>
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
