// Building blocks shared by the inner page templates: page top, sections, collapsible, comparison table, examples and common links.

import { useEffect, useRef } from "react";
import { projectSlides, FIRE_LICENSE_COMPARISON } from "../pagesData";
import { Breadcrumb, WhatsappButton } from "../Layout";
import { HowToReadSheet } from "../Illustrations";
import Carousel from "../Carousel";

// Block that starts collapsed on mobile (with a button to open it) and is always open on desktop.
// It ships open in the HTML (good for Google and for visitors without JavaScript); it closes after mount if the screen is narrow.
export function Collapsible({ label, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.matchMedia && window.matchMedia("(max-width: 700px)").matches) ref.current.open = false;
  }, []);
  return (
    <details ref={ref} className="collapse" open>
      <summary>
        <span>{label}</span>
      </summary>
      {children}
    </details>
  );
}

// AVCB vs CLCB side by side. On mobile, each row becomes a block with the two columns side by side.
export function Comparison() {
  const c = FIRE_LICENSE_COMPARISON;
  return (
    <div className="comparison reveal" id="avcb-ou-clcb">
      <h3>AVCB ou CLCB: lado a lado</h3>
      <div className="comparison-scroll">
        <table>
          <caption className="sr-only">Comparação entre AVCB e CLCB</caption>
          <thead>
            <tr>
              <td />
              {c.columns.map((col) => (
                <th key={col.acronym} scope="col">
                  <strong>{col.acronym}</strong>
                  <small>{col.name}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.rows.map((l) => (
              <tr key={l.t}>
                <th scope="row">{l.t}</th>
                {l.v.map((v, n) => (
                  <td key={c.columns[n].acronym} data-col={c.columns[n].acronym}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="fine-print">{c.note}</p>
      <div className="actions">
        <WhatsappButton text={c.whatsappMessage} label="Descobrir qual é o meu caso" />
      </div>
    </div>
  );
}

export const pad = (n) => String(n + 1).padStart(2, "0");

// Section header: number, label, large title and supporting sentence.
export function Section({ id, n, label, title, lead, className = "", children }) {
  return (
    <section className={`sec ${className}`} id={id} aria-labelledby={`${id}-t`}>
      <div className="container">
        <header className="sec-head reveal">
          <p className="sec-n">
            <span>{n}</span> {label}
          </p>
          <h2 id={`${id}-t`} className="sec-title">
            {title}
          </h2>
          {lead && <p className="lead">{lead}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}

// Opening of the simple inner pages (guides, quiz, reminder, privacy, credits).
export function PageTop({ breadcrumb, eyebrow, title, text, children }) {
  return (
    <header className="hero-inner">
      <div className="container">
        <Breadcrumb items={breadcrumb} />
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="display-m">{title}</h1>
        {text && <p className="lead">{text}</p>}
        {children}
      </div>
    </header>
  );
}

export const GENERAL_LINKS = {
  quiz: { href: "/o-que-preciso", tag: "Passo a passo", title: "Descubra o que o seu caso precisa", text: "Responda uma pergunta por vez e veja o que costuma ser exigido no seu caso." },
  guias: { href: "/guias", tag: "Guias", title: "Guias em linguagem simples", text: "Explicações curtas sobre PGR, AVCB, CAR, habite-se e outros documentos." },
  lembrete: { href: "/lembrete-de-vencimento", tag: "Lembrete", title: "Lembrete de vencimento", text: "Receba um aviso no WhatsApp antes de o documento vencer." },
};

export const areaLink = (a) => ({ href: `/${a.slug}`, tag: "Serviço", title: a.name, text: a.shortText, area: a.slug });

export const guideLink = (g) => ({ href: `/${g.slug}`, tag: "Guia", title: g.h1 });

export function Examples() {
  return (
    <div>
      <Carousel
        items={projectSlides()}
        label="Desenhos de projetos reais de residências"
        aspect="4 / 3"
        className="carousel-projects carousel-3d"
      />
      <p className="fine-print">
        Projetos arquitetônicos reais, com os dados dos clientes retirados e marca d'água. Toque ou clique numa imagem
        para ampliar.
      </p>
      <HowToReadSheet />
      <div className="actions">
        <WhatsappButton text="Olá! Vi os exemplos de projeto no site e gostaria de um projeto para a minha obra." label="Quero um projeto assim" />
      </div>
    </div>
  );
}
