// Template of one guide article (/guias/<slug>).
// Order: update date, "Em resumo", the guide's own WhatsApp question, the text, "Base legal", notice and links.

import { GUIDES, GUIDE_SUMMARIES, formatGuideDate } from "../content/guides";
import { findArea } from "../content/areas";
import { buildReminderPageHref } from "../content/reminder";
import { whatsappLink } from "../contact";
import Icon from "../Icon";
import { PageClosing } from "../layout/PageClosing";
import { FireLicenseComparisonTable, GENERAL_LINKS, PageTop, areaLink, guideLink } from "./pageParts.jsx";

export function GuidePage({ page }) {
  const area = findArea(page.area);
  // The matching service card on the area page (or its services section), not the top of the page.
  const relatedServiceHref = area ? `/${area.slug}#${page.relatedServiceAnchor || "o-que-fazemos"}` : null;
  const otherGuides = GUIDES.filter((g) => g.area === page.area && g.slug !== page.slug);
  const related = [
    area && { ...areaLink(area), href: relatedServiceHref },
    ...otherGuides.slice(0, 1).map(guideLink),
    GENERAL_LINKS.quiz,
  ].filter(Boolean);
  const updatedDate = formatGuideDate(page.updated);
  const legalSources = page.legalSources || [];
  return (
    <>
      <PageTop breadcrumb={[{ label: "Guias", href: "/guias" }, { label: page.h1 }]} eyebrow={area ? `Guia · ${area.name}` : "Guia"} title={page.h1} />
      <section className="sec article-sec" id="guia" aria-label="Texto do guia">
        <div className="container container-reading article">
          {updatedDate && (
            <p className="label-mini guide-updated">
              Atualizado em <time dateTime={page.updated}>{updatedDate}</time>
            </p>
          )}
          {GUIDE_SUMMARIES[page.slug] && (
            <aside className="summary-guide" aria-label="Em resumo">
              <p className="label-mini">Em resumo</p>
              <ul>
                {GUIDE_SUMMARIES[page.slug].map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </aside>
          )}
          {page.whatsappPrompt && page.whatsappQuestion && (
            <p className="guide-question">
              <a className="band-step" href={whatsappLink(page.whatsappPrompt)} target="_blank" rel="noopener noreferrer" data-origin="pergunta-do-guia">
                <span>
                  <small>
                    <Icon name="fa-brands fa-whatsapp" /> Pergunte pelo WhatsApp: a mensagem já vai pronta
                  </small>
                  <strong>{page.whatsappQuestion}</strong>
                </span>
                <i aria-hidden="true">→</i>
              </a>
            </p>
          )}
          {page.paragraphs.map((p, n) => (
            <p key={p.slice(0, 40)} className={n === 0 ? "article-lead" : ""}>
              {p}
            </p>
          ))}
          {page.slug === "guias/avcb-ou-clcb-qual-a-diferenca" && <FireLicenseComparisonTable />}
          {legalSources.length > 0 && (
            <aside className="summary-guide guide-legal-basis" aria-label="Base legal">
              <p className="label-mini">Base legal</p>
              <ul className="more-links">
                {legalSources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url}>{source.label}</a>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </section>
      <section className="sec-fine" id="aviso" aria-label="Aviso">
        <div className="container container-reading">
          <p className="notice-guide">
            Este guia tem caráter informativo e reflete a legislação conhecida em 2026. As regras podem mudar, e por isso
            confirmamos a norma vigente em cada caso.
          </p>
          {area && (
            <p className="more-links">
              Veja todos os serviços de <a href={relatedServiceHref}>{area.name}</a>.
            </p>
          )}
          {page.reminderDocumentKey && (
            <p className="more-links">
              Quer ser avisado antes do vencimento? <a href={buildReminderPageHref(page.reminderDocumentKey)}>Peça um lembrete</a>.
            </p>
          )}
        </div>
      </section>
      <PageClosing
        title="Quer isso resolvido para o seu caso?"
        whatsappText={`Olá! Li o guia do site e gostaria de um orçamento para: ${page.service}.`}
        whatsappLabel="Pedir orçamento deste serviço"
        related={related}
      />
    </>
  );
}
