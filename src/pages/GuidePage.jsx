// Template of one guide article (/guias/<slug>).

import { GUIDES, GUIDE_SUMMARIES } from "../content/guides";
import { findArea } from "../content/areas";
import { PageClosing } from "../layout/PageClosing";
import { FireLicenseComparisonTable, GENERAL_LINKS, PageTop, areaLink, guideLink } from "./pageParts.jsx";

export function GuidePage({ page }) {
  const area = findArea(page.area);
  const otherGuides = GUIDES.filter((g) => g.area === page.area && g.slug !== page.slug);
  const related = [area && areaLink(area), ...otherGuides.slice(0, 1).map(guideLink), GENERAL_LINKS.quiz].filter(Boolean);
  return (
    <>
      <PageTop breadcrumb={[{ label: "Guias", href: "/guias" }, { label: page.h1 }]} eyebrow={area ? `Guia · ${area.name}` : "Guia"} title={page.h1} />
      <section className="sec article-sec" id="guia" aria-label="Texto do guia">
        <div className="container container-reading article">
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
          {page.paragraphs.map((p, n) => (
            <p key={p.slice(0, 40)} className={n === 0 ? "article-lead" : ""}>
              {p}
            </p>
          ))}
          {page.slug === "guias/avcb-ou-clcb-qual-a-diferenca" && <FireLicenseComparisonTable />}
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
              Veja todos os serviços de <a href={`/${area.slug}`}>{area.name}</a>.
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
