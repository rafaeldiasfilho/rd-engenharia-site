// Guide index page (/guias).

import { useState } from "react";
import { AREAS } from "../content/areas";
import { GUIDES, GUIDE_SUMMARIES } from "../content/guides";
import { SectionNav } from "../layout/SectionNav";
import { PageClosing } from "../layout/PageClosing";
import Dialog from "../Dialog";
import { GENERAL_LINKS, PageTop, PageSection, areaLink, twoDigitNumber } from "./pageParts.jsx";

// Guides that apply to all areas (the ART is required for services in all four). In the index they get their own
// group; the guide's `area` field still applies to the guide page (breadcrumb and WhatsApp button).
const GENERAL_GUIDES = new Set(["guias/o-que-e-art-anotacao-de-responsabilidade-tecnica"]);

export function GuidesPage({ page }) {
  const [preview, setPreview] = useState(null);
  const previewGuide = GUIDES.find((g) => g.slug === preview);
  const groups = [
    { id: "guias-todas", title: "Todas as áreas", shortText: "Todas as áreas", guides: GUIDES.filter((g) => GENERAL_GUIDES.has(g.slug)) },
    ...AREAS.map((a) => ({
      id: `guias-${a.slug}`,
      title: a.name,
      shortText: a.label,
      guides: GUIDES.filter((g) => g.area === a.slug && !GENERAL_GUIDES.has(g.slug)),
    })),
  ].filter((g) => g.guides.length);
  return (
    <>
      <PageTop
        breadcrumb={[{ label: "Guias" }]}
        eyebrow="Guias"
        title={page.h1}
        text="Explicações curtas e em linguagem simples sobre os documentos mais pedidos."
      />
      <section className="sec-fine" aria-label="Passo a passo">
        <div className="container">
          <a className="band-step" href="/o-que-preciso">
            <span>
              <small>Passo a passo</small>
              <strong>Não sabe qual guia ler? Descubra o que o seu caso precisa.</strong>
            </span>
            <i aria-hidden="true">→</i>
          </a>
        </div>
      </section>
      <SectionNav
        label="Áreas dos guias"
        items={[...groups.map((g) => ({ id: g.id, label: g.shortText })), { id: "proximo-passo", label: "Próximo passo" }]}
      />
      {groups.map((group, n) => (
        <PageSection key={group.id} id={group.id} n={twoDigitNumber(n)} label="Área" title={group.title} className={n % 2 ? "sec-alt" : ""}>
          <ul className="guide-cards">
            {group.guides.map((g, i) => (
              <li className="reveal guide-card" key={g.slug}>
                <a href={`/${g.slug}`}>
                  <small>{twoDigitNumber(i)}</small>
                  <strong>{g.h1}</strong>
                  <i aria-hidden="true">→</i>
                </a>
                {GUIDE_SUMMARIES[g.slug] && (
                  <button type="button" className="guide-summary-button" aria-haspopup="dialog" onClick={() => setPreview(g.slug)}>
                    Ver o resumo<span className="sr-only">: {g.h1}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </PageSection>
      ))}
      <Dialog open={!!previewGuide} onClose={() => setPreview(null)} title={previewGuide ? previewGuide.h1 : ""}>
        {previewGuide && (
          <>
            <p className="label-mini">Em resumo</p>
            <ul>
              {GUIDE_SUMMARIES[previewGuide.slug].map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <a className="btn btn-sec" href={`/${previewGuide.slug}`}>
              Ler o guia completo <span aria-hidden="true">→</span>
            </a>
          </>
        )}
      </Dialog>
      <PageClosing
        title="Não achou o seu caso?"
        whatsappText="Olá! Li os guias do site e tenho uma dúvida."
        related={[GENERAL_LINKS.quiz, GENERAL_LINKS.reminder, areaLink(AREAS[0])]}
      />
    </>
  );
}
