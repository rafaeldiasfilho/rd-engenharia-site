// Illustrations of sample documents, drawn like real covers and drawing sheets. None of them is a real
// document: the client is fictitious ("Exemplo"), there is no signature and no ART number; only RD's public
// data and the technical lead's (the same as in the footer) appear. Every sheet carries the "EXEMPLO" stamp.
// The paper is always light, so it works in both light and dark themes. Every sheet has alt text.
//  - FolhaSvg: the sheet (cover, drawing sheet or certificate), or the inner page of a cover.
//  - FolhaLeitura: the enlarged sheet, with "Capa / Página interna / Como ler" tabs and zoom.
//  - DocsIlustracao (default): two stacked sheets in the "Para agilizar, separe" section.
import { useId, useState } from "react";
import { BORDER, GRAY, CREA, ISSUE_DATE, BACKGROUND, SAMPLE_CAPTION, Logo, PAPER, RD_CNPJ, RESPONSIBLE_ENGINEER, ExampleStamp, INK, GREEN, RED, clientFor, wrapText } from "./SheetBase";
import { Drawing, InnerPage, PINS, HAS_INNER_PAGE } from "./DocDrawings";

export { SAMPLE_CAPTION };

// ── Sheets that look like real documents ──────────────────────────────────────────────────────
// Three formats, chosen by `m.layout` (field `exemplo` in src/paginas.js):
//  - "capa": report cover (technical reports, programmes, analyses), with a table of contents and an inner page;
//  - "prancha": technical drawing with title block (plans, maps, schedule);
//  - "certificado": training certificate.

function Cover({ m, area }) {
  const doc = m.doc || m.subtitle;
  const titleLines = wrapText(doc.toUpperCase(), 24).slice(0, 3);
  const [client, clientInfo] = clientFor(m, area);
  const summaryY = 52 + titleLines.length * 8 + 6;
  return (
    <g fontFamily="inherit">
      <Logo x={10} y={10} />
      <text x="140" y="15.6" fontSize="3.1" fill={GRAY} textAnchor="end">
        {RD_CNPJ}
      </text>
      <text x="140" y="21" fontSize="3.1" fill={GRAY} textAnchor="end">
        Ibirá/SP
      </text>
      <line x1="10" y1="29" x2="140" y2="29" stroke={GREEN} strokeWidth="0.6" />
      <text x="10" y="42" fontSize="3.6" fontWeight="700" fill={GREEN} letterSpacing="0.6">
        {(m.ref || m.title).toUpperCase()}
      </text>
      {titleLines.map((l, k) => (
        <text key={l} x="10" y={52 + k * 8} fontSize="6.6" fontWeight="700" fill={INK} letterSpacing="0.1">
          {l}
        </text>
      ))}
      {m.contents && (
        <g>
          <text x="10" y={summaryY} fontSize="3.2" fontWeight="700" fill={GRAY} letterSpacing="0.6">
            SUMÁRIO
          </text>
          {m.contents.slice(0, 3).map((s, k) => (
            <g key={s}>
              <text x="10" y={summaryY + 7 + k * 6.4} fontSize="3.8" fill={INK}>
                {k + 1}. {s}
              </text>
              <text x="140" y={summaryY + 7 + k * 6.4} fontSize="3.8" fill={GRAY} textAnchor="end">
                {[3, 4, 11][k]}
              </text>
            </g>
          ))}
        </g>
      )}
      <rect x="10" y="112" width="130" height="22" rx="2.5" fill={BACKGROUND} />
      <text x="15" y="118.6" fontSize="3.1" fontWeight="700" fill={GRAY} letterSpacing="0.6">
        CONTRATANTE
      </text>
      <text x="15" y="125" fontSize="4.8" fontWeight="700" fill={INK}>
        {client}
      </text>
      <text x="15" y="130.4" fontSize="3.5" fill={GRAY}>
        {clientInfo}
      </text>
      <text x="10" y="144" fontSize="3.1" fontWeight="700" fill={GRAY} letterSpacing="0.6">
        RESPONSÁVEL TÉCNICO
      </text>
      <text x="10" y="150.6" fontSize="4.6" fontWeight="700" fill={INK}>
        {RESPONSIBLE_ENGINEER}
      </text>
      <text x="10" y="156" fontSize="3.6" fill={GRAY}>
        {CREA}
      </text>
      {m.art && (
        <g>
          <rect x="112" y="141" width="28" height="11" rx="5.5" fill="none" stroke={GREEN} strokeWidth="1" />
          <text x="126" y="148.4" fontSize="5" fontWeight="700" fill={GREEN} textAnchor="middle">
            ART
          </text>
        </g>
      )}
      <line x1="10" y1="180" x2="140" y2="180" stroke={BORDER} strokeWidth="0.6" />
      <text x="10" y="187" fontSize="3.4" fill={GRAY}>
        Ibirá/SP · {ISSUE_DATE}
      </text>
      <text x="140" y="187" fontSize="3.4" fill={GRAY} textAnchor="end">
        Revisão 00 · Página 1
      </text>
    </g>
  );
}

function DrawingSheet({ m, area, uid }) {
  const doc = m.doc || m.subtitle;
  const [client, clientInfo] = clientFor(m, area);
  const titleLines = wrapText(doc, 30).slice(0, 2);
  const cell = (x, y, label, value, w) => (
    <g>
      <text x={x + 2.4} y={y + 4.6} fontSize="2.7" fontWeight="700" fill={GRAY} letterSpacing="0.4">
        {label}
      </text>
      <text x={x + 2.4} y={y + 10} fontSize="3.4" fontWeight="600" fill={INK}>
        {value}
      </text>
      {w && <line x1={x + w} y1={y} x2={x + w} y2={y + 13} stroke={INK} strokeWidth="0.4" />}
    </g>
  );
  return (
    <g fontFamily="inherit">
      <rect x="5" y="5" width="140" height="188" fill="none" stroke={INK} strokeWidth="0.6" />
      <Drawing type={m.body} uid={uid} />
      <g stroke={INK} strokeWidth="0.4" fill="none">
        <rect x="5" y="126" width="140" height="67" strokeWidth="0.6" />
        <line x1="5" y1="141" x2="145" y2="141" />
        <line x1="5" y1="154" x2="145" y2="154" />
        <line x1="5" y1="167" x2="145" y2="167" />
        <line x1="5" y1="180" x2="145" y2="180" />
        <line x1="52" y1="126" x2="52" y2="141" />
      </g>
      <Logo x={8} y={129.6} s={0.62} />
      <text x="54.4" y="130.6" fontSize="2.7" fontWeight="700" fill={GRAY} letterSpacing="0.4">
        TÍTULO
      </text>
      {titleLines.map((l, k) => (
        <text key={l} x="54.4" y={135.6 + k * 4} fontSize="3.6" fontWeight="700" fill={INK}>
          {l}
        </text>
      ))}
      {cell(5, 141, "CLIENTE", `${client} · ${clientInfo}`)}
      {cell(5, 154, "CONTEÚDO", m.ref || m.subtitle)}
      {cell(5, 167, "RESPONSÁVEL TÉCNICO", `${RESPONSIBLE_ENGINEER} · ${CREA}`)}
      {cell(5, 180, "ESCALA", m.scale || "Indicada", 35)}
      {cell(40, 180, "DATA", "10/2026", 35)}
      {cell(75, 180, "FOLHA", "01/03", 35)}
      {cell(110, 180, "ART", m.art ? "Sim" : "—")}
    </g>
  );
}

function Certificate({ m, area }) {
  const [client] = clientFor(m, area);
  return (
    <g fontFamily="inherit" textAnchor="middle">
      <rect x="7" y="7" width="136" height="184" rx="2" fill="none" stroke={GREEN} strokeWidth="1.2" />
      <rect x="10.5" y="10.5" width="129" height="177" rx="1.5" fill="none" stroke={GREEN} strokeWidth="0.4" />
      <g textAnchor="start">
        <Logo x={47} y={20} />
      </g>
      <text x="75" y="54" fontSize="11" fontWeight="700" fill={GREEN} letterSpacing="1">
        CERTIFICADO
      </text>
      <text x="75" y="61" fontSize="3.8" fill={GRAY} letterSpacing="1.4">
        DE TREINAMENTO
      </text>
      <text x="75" y="76" fontSize="4" fill={GRAY}>
        Certificamos que
      </text>
      <text x="75" y="86" fontSize="6.4" fontWeight="700" fill={INK}>
        Nome do Participante
      </text>
      <text x="75" y="95" fontSize="4" fill={GRAY}>
        concluiu o treinamento de
      </text>
      <text x="75" y="104" fontSize="5.4" fontWeight="700" fill={GREEN}>
        {m.doc || m.subtitle}
      </text>
      <text x="75" y="111.6" fontSize="3.5" fill={GRAY}>
        Carga horária e conteúdo conforme a norma
      </text>
      <text x="75" y="126" fontSize="3.6" fill={INK}>
        {client} · Ibirá/SP, {ISSUE_DATE}
      </text>
      <line x1="18" y1="158" x2="68" y2="158" stroke={BORDER} />
      <line x1="82" y1="158" x2="132" y2="158" stroke={BORDER} />
      <text x="43" y="164" fontSize="3.4" fill={INK}>
        Instrutor
      </text>
      <text x="107" y="164" fontSize="3.4" fill={INK}>
        Responsável técnico
      </text>
      <text x="107" y="169" fontSize="2.8" fill={GRAY}>
        {RESPONSIBLE_ENGINEER} · {CREA}
      </text>
    </g>
  );
}

function Sheet({ x = 0, y = 0, rot = 0, m, area, page = "folha", uid }) {
  const Layout = m.layout === "prancha" ? DrawingSheet : m.layout === "certificado" ? Certificate : Cover;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="2" y="3" width="150" height="198" rx="3" fill="#000" opacity="0.1" />
      <rect width="150" height="198" rx="3" fill={PAPER} stroke={BORDER} />
      {page === "miolo" ? <InnerPage m={m} area={area} /> : <Layout m={m} area={area} uid={uid} />}
    </g>
  );
}

function Pins({ list }) {
  return (
    <g>
      {list.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4.4" fill={RED} stroke="#fff" strokeWidth="0.9" />
          <text x={p.x} y={p.y + 1.6} fontSize="4.4" fontWeight="700" fill="#fff" textAnchor="middle">
            {i + 1}
          </text>
        </g>
      ))}
    </g>
  );
}

const describe = (m, name, page) =>
  page === "miolo"
    ? `Página interna de exemplo de ${name}: ${(m.doc || m.subtitle).toLowerCase()}`
    : `Exemplo ilustrativo de ${name}: ${(m.doc || m.subtitle).toLowerCase()}`;

// The sheet (or the inner page of a cover), with the EXEMPLO stamp and, if requested, the "Como ler" points.
export function SheetSvg({ m, name, area, page = "folha", pins = null }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg className="sheet-svg" viewBox="0 -10 158 218" role="img" aria-label={describe(m, name, page)} focusable="false">
      <Sheet m={m} area={area} page={page} uid={uid} />
      {pins && <Pins list={pins} />}
      <ExampleStamp x={60} y={-3} />
    </svg>
  );
}

// Enlarged sheet: cover or drawing sheet, inner page (covers only), "Como ler" with numbered points, and zoom.
export function SheetReader({ m, name, area }) {
  const [view, setView] = useState("folha");
  const [zoom, setZoom] = useState(false);
  const hasInnerPage = m.layout === "capa" && HAS_INNER_PAGE.has(m.body);
  const pins = view === "ler" ? PINS[m.layout] || PINS.capa : null;
  const tabs = [
    ["folha", m.layout === "capa" ? "Capa" : m.layout === "certificado" ? "Certificado" : "Prancha"],
    ...(hasInnerPage ? [["miolo", "Página interna"]] : []),
    ["ler", "Como ler"],
  ];
  return (
    <div className="sheet-reading" data-zoom={zoom ? "" : undefined}>
      <div className="sheet-reading-bar">
        <div className="sheet-tabs" role="group" aria-label="O que ver na folha">
          {tabs.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={view === id} onClick={() => setView(id)}>
              {label}
            </button>
          ))}
        </div>
        <button type="button" className="sheet-zoom" aria-pressed={zoom} onClick={() => setZoom((z) => !z)}>
          {zoom ? "Reduzir" : "Ampliar"}
        </button>
      </div>
      <div className="sheet-reading-area" tabIndex={zoom ? 0 : undefined} aria-label={zoom ? "Folha ampliada: role para ver as partes" : undefined}>
        <SheetSvg m={m} name={name} area={area} page={view === "miolo" ? "miolo" : "folha"} pins={pins} />
      </div>
      {pins && (
        <ol className="sheet-pins">
          {pins.map((p, i) => (
            <li key={i}>
              <span aria-hidden="true">{i + 1}</span>
              {p.t}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// One sheet for a service/document. `m` comes from the item's `exemplo` field in src/paginas.js.
export function SampleSheet({ m, name, area }) {
  if (!m) return null;
  return (
    <figure className="sheet-sample">
      <SheetSvg m={m} name={name} area={area} />
      <figcaption>{SAMPLE_CAPTION}</figcaption>
    </figure>
  );
}

const PAIRS = {
  "seguranca-do-trabalho": {
    alt: "Duas folhas de exemplo empilhadas: na frente, a capa de um Programa de Gerenciamento de Riscos (PGR) da RD para uma empresa fictícia; atrás, a capa de um LTCAT",
    front: { title: "PGR", subtitle: "Programa de Gerenciamento de Riscos", layout: "capa", doc: "Programa de Gerenciamento de Riscos", ref: "PGR · NR-01", contents: ["Identificação da organização", "Inventário de riscos", "Plano de ação"], art: true },
    back: { title: "LTCAT", subtitle: "Laudo das condições do ambiente de trabalho", layout: "capa", doc: "Laudo Técnico das Condições do Ambiente de Trabalho", ref: "LTCAT" },
  },
  "corpo-de-bombeiros": {
    alt: "Duas folhas de exemplo empilhadas: na frente, a prancha de um projeto de segurança contra incêndio com planta, extintores, iluminação de emergência, rota de fuga e carimbo; atrás, a capa da preparação para a vistoria do AVCB",
    front: { title: "PSCIP", subtitle: "Projeto de segurança contra incêndio", body: "incendio", layout: "prancha", doc: "Projeto de Segurança Contra Incêndio", ref: "Planta de medidas de segurança", scale: "1:100", art: true },
    back: { title: "AVCB", subtitle: "Preparação para a vistoria", layout: "capa", doc: "Preparação para Vistoria do AVCB", ref: "Lista de exigências" },
  },
  "engenharia-civil": {
    alt: "Duas folhas de exemplo empilhadas: na frente, a prancha de um projeto arquitetônico com planta baixa cotada e carimbo; atrás, a capa de um laudo técnico de vistoria",
    front: { title: "PROJETO", subtitle: "Projeto arquitetônico", body: "planta", layout: "prancha", doc: "Projeto Arquitetônico", ref: "Planta baixa", scale: "1:50", art: true },
    back: { title: "LAUDO", subtitle: "Laudo técnico de vistoria", layout: "capa", doc: "Laudo Técnico de Vistoria", ref: "Imóvel residencial" },
  },
  "meio-ambiente-topografia": {
    alt: "Duas folhas de exemplo empilhadas: na frente, a planta de um imóvel rural georreferenciado com vértices, coordenadas e carimbo; atrás, a prancha do mapa do imóvel para o CAR",
    front: { title: "MEMORIAL", subtitle: "Georreferenciamento do imóvel", body: "terreno", layout: "prancha", doc: "Planta do Imóvel Georreferenciado", ref: "Vértices e confrontações", scale: "1:5.000", art: true },
    back: { title: "CAR", subtitle: "Cadastro ambiental rural", body: "car", layout: "prancha", doc: "Mapa do Imóvel para o CAR", ref: "APP e reserva legal", scale: "1:5.000" },
  },
};

export default function DocIllustration({ slug }) {
  const uid = useId().replace(/:/g, "");
  const m = PAIRS[slug];
  if (!m) return null;
  return (
    <figure className="docs-illustration">
      <svg viewBox="0 0 335 250" role="img" aria-label={m.alt} focusable="false">
        <Sheet x={168} y={10} rot={5} m={m.back} area={slug} uid={`${uid}t`} />
        <Sheet x={26} y={28} rot={-4} m={m.front} area={slug} uid={`${uid}f`} />
        <ExampleStamp x={40} y={10} rot={-10} s={1.3} />
      </svg>
      <figcaption>{SAMPLE_CAPTION}</figcaption>
    </figure>
  );
}
