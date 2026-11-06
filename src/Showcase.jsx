import { useEffect, useRef, useState } from "react";

// Home page showcase blocks: documents strip, example panel and numbers.
// Nothing here invents a client, testimonial or real data: the panel is an example labelled as illustrative.

// Documents RD prepares that already appear on the site's pages. No PCMSO: it belongs to the occupational
// physician (RD only integrates it with the PGR).
const DOCUMENTS = [
  "PGR", "LTCAT", "PPP", "APR", "AET", "Treinamentos de NR", "Laudo de insalubridade",
  "AVCB", "CLCB", "PSCIP", "Projeto arquitetônico", "Habite-se", "As-built", "ART", "Laudo de vistoria",
  "Inspeção predial", "CAR", "Georreferenciamento", "Topografia", "Outorga", "Licenciamento ambiental", "PGRS",
];

// Slow-moving strip; stops on hover or focus and stays still with "reduce motion" (CSS).
export function FaixaDocumentos() {
  const group = (hidden) => (
    <ul className="marquee-group" aria-hidden={hidden ? "true" : undefined}>
      {DOCUMENTS.map((d) => (
        <li key={d}>{d}</li>
      ))}
    </ul>
  );
  return (
    <section className="marquee" aria-label="Documentos e serviços que a RD elabora">
      <div className="marquee-track">
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}

// Made-up dates and situations; each item's text explains the document and what happens near the date.
const PANEL_ITEMS = [
  { name: "PGR", status: "ok", date: "Próxima revisão: 03/2027", text: "Programa de Gerenciamento de Riscos. Revisado quando o trabalho muda e na data prevista no próprio programa." },
  { name: "LTCAT", status: "ok", date: "Atualizar se o ambiente mudar", text: "Laudo das condições do ambiente de trabalho, base do PPP. Precisa ser refeito quando mudam máquinas, processos ou setores." },
  { name: "AVCB", status: "vence", date: "Vence em 28/11/2026", text: "Auto de Vistoria do Corpo de Bombeiros. Perto do vencimento, a RD avisa pelo WhatsApp e prepara a renovação com antecedência." },
  { name: "Treinamento NR-35", status: "ok", date: "Reciclagem: 08/2027", text: "Trabalho em altura. A reciclagem fica no calendário para nenhum trabalhador ficar com o treinamento vencido." },
  { name: "Laudo de insalubridade", status: "pendente", date: "Aguardando a medição", text: "A avaliação do posto ainda não foi feita. O painel mostra o que falta para a empresa ficar em dia." },
];
const LABEL = { ok: "Em dia", vence: "Vence em 30 dias", pendente: "Pendente" };
const SYMBOL = { ok: "✓", vence: "◔", pendente: "○" };

// Dashboard-style card, only to explain how documents are organized. Made-up data.
export function PainelExemplo() {
  const [openName, setOpenName] = useState("");
  const upToDate = PANEL_ITEMS.filter((x) => x.status === "ok").length;
  const pct = Math.round((upToDate / PANEL_ITEMS.length) * 100);
  const current = PANEL_ITEMS.find((x) => x.name === openName);
  return (
    <figure className="panel">
      <span className="badge-example" aria-hidden="true">
        EXEMPLO
      </span>
      <div className="panel-head">
        <span>Painel de documentos</span>
        <span className="panel-client">Empresa Exemplo Ltda.</span>
      </div>
      <div className="panel-number">
        <strong>{pct}%</strong>
        <span>
          dos documentos em dia ({upToDate} de {PANEL_ITEMS.length})
        </span>
      </div>
      <div className="panel-bar" role="img" aria-label={`${upToDate} de ${PANEL_ITEMS.length} documentos em dia`}>
        <i style={{ width: `${pct}%` }} />
      </div>
      <ul className="panel-list">
        {PANEL_ITEMS.map((x) => (
          <li key={x.name}>
            <button type="button" aria-pressed={openName === x.name} onClick={() => setOpenName((a) => (a === x.name ? "" : x.name))}>
              <span className="panel-doc">
                <span>{x.name}</span>
                <small>{x.date}</small>
              </span>
              <span className={`chip chip-${x.status}`}>
                <span aria-hidden="true">{SYMBOL[x.status]}</span> {LABEL[x.status]}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="panel-explain" aria-live="polite">
        {current ? (
          <>
            <strong>{current.name}.</strong> {current.text}
          </>
        ) : (
          "Toque num documento para ver o que ele é e o que acontece perto da data."
        )}
      </p>
      <figcaption>Exemplo ilustrativo, sem dados de clientes: nomes, datas e situações são inventados para mostrar como os vencimentos ficam organizados.</figcaption>
    </figure>
  );
}

// Number that counts up once when it enters the screen. The final text is already in the HTML (looks the same without script);
// with "reduce motion" it goes straight to the final value.
function CountUp({ target, suffix = "" }) {
  const [v, setV] = useState(target);
  const ref = useRef(null);
  useEffect(() => {
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window) || !ref.current) return undefined;
    let raf = 0;
    let endTimer = 0;
    let done = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || done) return;
        done = true;
        io.disconnect();
        const dur = 1400;
        const t0 = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        setV(0);
        raf = requestAnimationFrame(step);
        endTimer = setTimeout(() => setV(target), dur + 400); // ensures the final value even if the browser pauses the animation
      },
      { threshold: 0.6 }
    );
    io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(endTimer);
    };
  }, [target]);
  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  );
}

// Numbers stated by the owner, inline, inside the "O que organizamos" section (they used to be a separate
// strip; merging the two shortened the home page).
export function NumerosLinha() {
  return (
    <div className="numbers-line cascade" role="group" aria-label="A RD em números">
      <p className="reveal">
        <strong>
          <CountUp target={500} suffix="+" />
        </strong>
        <span>documentos técnicos</span>
      </p>
      <p className="reveal">
        <strong>
          <CountUp target={70} suffix="+" />
        </strong>
        <span>projetos</span>
      </p>
      <p className="reveal">
        <strong>
          <small>Desde</small> 2017
        </strong>
        <span>em Ibirá/SP</span>
      </p>
    </div>
  );
}
