import Icon from "./Icon";
import { useEffect, useRef, useState } from "react";
import { AREAS, GUIDES, projectSlides, EQUIPMENT, EQUIPMENT_NOTE, AREA_OVERVIEW, TECHNICAL_LEAD_PHOTO, REMINDER_DOCUMENTS, REMINDER_TIPS, GOOGLE_REVIEWS_URL, DIRECTIONS_URL, MAP_EMBED_URL, ADDRESS, FIRE_LICENSE_COMPARISON, GUIDE_SUMMARIES, findArea } from "./pagesData";
import { Shell, Breadcrumb, SectionNav, PageClosing, WhatsappButton, whatsappLink } from "./Layout";
import { HowToReadSheet, Illustration } from "./Illustrations";
import { sendReminder } from "./publicApi/api";
import Carousel from "./Carousel";
import Wizard from "./Wizard";
import DocIllustration, { SheetReader, SheetSvg, SAMPLE_CAPTION } from "./DocIllustration";
import HeroBackground from "./HeroBackground";
import AreaIcon from "./AreaIcon";
import { slidesFor, PHOTOS_IN_USE, photoPath, srcset } from "./photos";
import { anchorId } from "./Search";
import Faq from "./Faq";
import Dialog from "./Dialog";
import RequestBuilder from "./RequestBuilder";
import { AnimatedFolder } from "@/components/ui/3d-folder";
import { LEGAL_NAME, TRADE_NAME, CNPJ, CREA_NUMBER, PHONE_DISPLAY } from "./company";
import Scene3D from "./Scene3D";

// 3D block on each area page: label, title and text describe the illustration (not a real job or client).
const AREA_SCENES = {
  "meio-ambiente-topografia": {
    scene: "terreno",
    label: "Do campo à planta",
    title: "O terreno medido vira curvas de nível.",
    text: "No levantamento, cada ponto medido em campo ganha coordenadas e altitude. Com eles desenhamos as curvas de nível, a planta e o memorial que o seu processo pede.",
    alt: "Ilustração em 3D de um terreno com curvas de nível e pontos levantados",
  },
  "engenharia-civil": {
    scene: "casa",
    label: "Do projeto à obra",
    title: "Cada etapa resolvida antes de começar.",
    text: "No projeto, a casa é pensada etapa por etapa: fundação, paredes, aberturas e telhado. Assim a obra começa com as dúvidas respondidas no papel.",
    alt: "Ilustração em 3D de uma casa térrea sendo construída por etapas: contrapiso, paredes, janelas e porta, telhado",
  },
  "corpo-de-bombeiros": {
    scene: "rota",
    label: "Rota de fuga",
    title: "De qualquer sala até a saída.",
    text: "No projeto de prevenção, cada ambiente tem rota de fuga, sinalização, iluminação de emergência e extintores no lugar certo. É isso que o Corpo de Bombeiros confere na vistoria.",
    alt: "Ilustração em 3D da planta de um pavimento com as rotas de fuga se acendendo até a saída e os extintores marcados",
  },
  "seguranca-do-trabalho": {
    scene: "capacete",
    label: "Proteção no trabalho",
    title: "A proteção certa para cada risco.",
    text: "No PGR levantamos os riscos de cada função e indicamos as medidas: primeiro as proteções coletivas, depois os EPIs que ainda forem necessários.",
    alt: "Ilustração em 3D de um capacete de segurança girando, cercado por anéis de proteção",
  },
};

// Block that starts collapsed on mobile (with a button to open it) and is always open on desktop.
// It ships open in the HTML (good for Google and for visitors without JavaScript); it closes after mount if the screen is narrow.
function Collapsible({ label, children }) {
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
function Comparison() {
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

const pad = (n) => String(n + 1).padStart(2, "0");

// Section header: number, label, large title and supporting sentence.
function Section({ id, n, label, title, lead, className = "", children }) {
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
function PageTop({ breadcrumb, eyebrow, title, text, children }) {
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

const GENERAL_LINKS = {
  quiz: { href: "/o-que-preciso", tag: "Passo a passo", title: "Descubra o que o seu caso precisa", text: "Responda uma pergunta por vez e veja o que costuma ser exigido no seu caso." },
  guias: { href: "/guias", tag: "Guias", title: "Guias em linguagem simples", text: "Explicações curtas sobre PGR, AVCB, CAR, habite-se e outros documentos." },
  lembrete: { href: "/lembrete-de-vencimento", tag: "Lembrete", title: "Lembrete de vencimento", text: "Receba um aviso no WhatsApp antes de o documento vencer." },
};
const areaLink = (a) => ({ href: `/${a.slug}`, tag: "Serviço", title: a.name, text: a.shortText, area: a.slug });
const guideLink = (g) => ({ href: `/${g.slug}`, tag: "Guia", title: g.h1 });

function Examples() {
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

function AreaPage({ page }) {
  const visual = AREA_OVERVIEW[page.slug];
  const guides = GUIDES.filter((g) => g.area === page.slug);
  const otherAreas = AREAS.filter((a) => a.slug !== page.slug);
  const related = [...guides.slice(0, 2).map(guideLink), ...otherAreas.map(areaLink)].slice(0, 3);
  const areaZapText = `Olá! Gostaria de um orçamento na área de ${page.name}.`;
  const isCivil = page.slug === "engenharia-civil";
  const equipment = EQUIPMENT[page.slug];
  const hasEquipmentPhotos = slidesFor(`equip-${page.slug}`).length > 0;
  // Section numbering in the order they appear (01, 02, ...), with no fixed numbers.
  let sectionCount = 0;
  const nextNumber = () => pad(sectionCount++);

  return (
    <>
      <div className="container breadcrumb-over-hero">
        <Breadcrumb items={[{ label: "Serviços", href: "/#servicos" }, { label: page.name }]} />
      </div>
      <HeroBackground setKey={`area-${page.slug}`} label={`Fotos ilustrativas da área de ${page.name}`} className="hero-area-bg">
        <p className="eyebrow eyebrow-icon">
          <AreaIcon slug={page.slug} size={22} /> Serviço
        </p>
        <h1 className="display">{page.h1}</h1>
        <p className="lead">{page.intro}</p>
        <div className="actions">
          <WhatsappButton className="btn-large" text={areaZapText} label="Pedir orçamento pelo WhatsApp" />
          <small>Orçamento por escrito e sem compromisso. Prazo e valor são informados depois de conhecermos o seu caso.</small>
        </div>
      </HeroBackground>

      <SectionNav
        items={[
          { id: "situacoes", label: "Situações comuns" },
          { id: "o-que-fazemos", label: "Serviços" },
          { id: "equipamentos", label: "Equipamentos" },
          { id: "na-pratica", label: "Na prática" },
          { id: "atendimento", label: "Atendimento" },
          { id: "duvidas", label: "Dúvidas" },
          { id: "proximo-passo", label: "Próximo passo" },
        ]}
      />

      {visual && (
        <section className="summary-editorial" aria-label="Resumo">
          <div className="container summary-editorial-grid">
            <div className="reveal">
              <p className="label-mini">Para quem</p>
              <p>{visual.who}</p>
            </div>
            <div className="reveal">
              <p className="label-mini">Você recebe</p>
              <p>{visual.deliverable}</p>
            </div>
            <div className="signer reveal">
              <p className="label-mini">Quem assina</p>
              <div className="signer-line">
                {TECHNICAL_LEAD_PHOTO ? (
                  <img src={TECHNICAL_LEAD_PHOTO} width="56" height="56" alt="Rafael Antonio Dias" />
                ) : (
                  <span className="signer-initials" aria-hidden="true">
                    RD
                  </span>
                )}
                <p>
                  <strong>Rafael Antonio Dias</strong>
                  <span>Engenheiro civil e ambiental · {CREA_NUMBER}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {AREA_SCENES[page.slug] && (
        <section className="band-scene" aria-labelledby="cena-t">
          <div className="container band-scene-grid">
            <div className="band-scene-text reveal">
              <p className="label-mini">{AREA_SCENES[page.slug].label}</p>
              <h2 id="cena-t" className="sec-title">
                {AREA_SCENES[page.slug].title}
              </h2>
              <p>{AREA_SCENES[page.slug].text}</p>
              <p className="fine-print">
                Ilustração em 3D. Arraste com o mouse ou o dedo para girar.
              </p>
            </div>
            <Scene3D scene={AREA_SCENES[page.slug].scene} className="band-scene-3d" label={AREA_SCENES[page.slug].alt} />
          </div>
        </section>
      )}

      {page.situations && (
        <Section id="situacoes" n={nextNumber()} label="Situações comuns" title="Você se reconhece em alguma destas?">
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
            <a href={whatsappLink(areaZapText)} target="_blank" rel="noopener noreferrer">
              conte pelo WhatsApp
            </a>
            .
          </p>
        </Section>
      )}

      {/* Services and documents together: each card shows the sample sheet of what the client receives.
          These used to be two sections that repeated the same list of services. */}
      <Section
        id="o-que-fazemos"
        n={nextNumber()}
        label="Serviços"
        title={<>O que fazemos nesta área.</>}
        lead="Cada cartão mostra uma folha de exemplo do documento que você recebe."
      >
        {/* Folder with the sample sheets at reading size (on the card they are small). */}
        <div className="folder-band reveal">
          <AnimatedFolder
            title="Documentos de exemplo"
            countLabel={(n) => `${n} folhas desta área`}
            items={page.items
              .filter((item) => item.example)
              .map((item) => ({
                id: anchorId(item.name),
                title: item.name,
                short: item.name.split(/ — | \(/)[0],
                media: <SheetSvg m={item.example} name={item.name} area={page.slug} />,
                expanded: <SheetReader m={item.example} name={item.name} area={page.slug} />,
                caption: SAMPLE_CAPTION,
                action: { label: "Pedir orçamento pelo WhatsApp", href: whatsappLink(`Olá! Gostaria de um orçamento para: ${item.name}.`) },
              }))}
          />
          <div className="folder-band-text">
            <h3>Veja cada documento em tamanho de leitura.</h3>
            <p>
              Abra a pasta e escolha uma folha. Dá para ampliar, ver uma página interna e, em “Como ler”, entender cada
              parte do documento. Depois, peça o orçamento daquele documento direto pelo WhatsApp.
            </p>
            <p className="fine-print">{SAMPLE_CAPTION} Não há dados de clientes.</p>
          </div>
        </div>
        <ol className="services-grid">
          {page.items.map((item, n) => (
            <li className="service-card reveal" key={item.name} id={anchorId(item.name)}>
              {item.example && (
                <div className="service-sheet" aria-hidden="true">
                  <SheetSvg m={item.example} name={item.name} area={page.slug} />
                </div>
              )}
              <div className="service-body">
                <span className="service-n">{pad(n)}</span>
                <h3>{item.name}</h3>
                <p>{item.text}</p>
                <p className="item-who">
                  <strong>Para quem:</strong> {item.who}
                </p>
                <a
                  className="btn btn-sec btn-small"
                  href={whatsappLink(`Olá! Gostaria de um orçamento para: ${item.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="fa-brands fa-whatsapp" /> Pedir orçamento pelo WhatsApp
                </a>
              </div>
            </li>
          ))}
        </ol>
        <p className="fine-print">As folhas são exemplos ilustrativos, não são documentos reais.</p>
        {page.items.length > 1 && <RequestBuilder area={page.name} items={page.items} />}
        {page.slug === "corpo-de-bombeiros" && <Comparison />}
      </Section>

      {equipment && (
        <Section id="equipamentos" n={nextNumber()} label="Equipamentos" title="Equipamentos que podem ser usados." className="sec-alt">
          <Collapsible label="Ver os equipamentos">
          <div className="equipment">
            <p className="lead equipment-lead reveal">{equipment.text}</p>
            {hasEquipmentPhotos && (
              <div className="reveal">
                <Carousel
                  setKey={`equip-${page.slug}`}
                  label={`Equipamentos de referência usados em serviços de ${page.name}`}
                  aspect="4 / 3"
                  className="carousel-shelf"
                  auto={false}
                  sizes="(min-width: 900px) 340px, 78vw"
                />
              </div>
            )}
            <ul className="equipment-list reveal">
              {equipment.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <p className="fine-print equipment-note">{EQUIPMENT_NOTE}</p>
          </Collapsible>
        </Section>
      )}

      <Section
        id="na-pratica"
        n={nextNumber()}
        label="Na prática"
        title={isCivil ? "Projetos reais, com os dados dos clientes retirados." : "Veja como isso aparece no papel."}
        lead={isCivil ? undefined : "Exemplos ilustrativos para você entender o que entregamos."}
      >
        <Collapsible label={isCivil ? "Ver os projetos" : "Ver os exemplos"}>{isCivil ? <Examples /> : <Illustration slug={page.slug} />}</Collapsible>
      </Section>

      <Section id="atendimento" n={nextNumber()} label="Atendimento" title="Do primeiro contato à entrega." lead="Veja o caminho e o que ter em mãos para agilizar o orçamento." className="sec-alt">
        {visual && (
          <ol className="steps-editorial timeline reveal">
            {visual.steps.map((e, n) => (
              <li key={e.t} className="reveal">
                <span className="step-big" aria-hidden="true">
                  {n + 1}
                </span>
                <h3>{e.t}</h3>
                <p>{e.d}</p>
                {n === 0 && (
                  <a className="btn btn-whatsapp btn-small" href={whatsappLink(areaZapText)} target="_blank" rel="noopener noreferrer">
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
                de renovação dos documentos. <a href="/lembrete-de-vencimento">Pedir o lembrete</a>.
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
      </Section>

      <Section id="duvidas" n={nextNumber()} label="Dúvidas" title="Perguntas frequentes.">
        <Faq items={page.faq} />
      </Section>

      <PageClosing whatsappText={areaZapText} related={related} />
    </>
  );
}

function GuidePage({ page }) {
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
          {page.slug === "guias/avcb-ou-clcb-qual-a-diferenca" && <Comparison />}
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

// Guides that apply to all areas (the ART is required for services in all four). In the index they get their own
// group; the guide's `area` field still applies to the guide page (breadcrumb and WhatsApp button).
const GENERAL_GUIDES = new Set(["guias/o-que-e-art-anotacao-de-responsabilidade-tecnica"]);

function GuidesPage({ page }) {
  const [preview, setPreview] = useState(null);
  const previewGuide = GUIDES.find((g) => g.slug === preview);
  const groups = [
    { id: "guias-todas", title: "Todas as áreas", shortText: "Todas as áreas", lista: GUIDES.filter((g) => GENERAL_GUIDES.has(g.slug)) },
    ...AREAS.map((a) => ({
      id: `guias-${a.slug}`,
      title: a.name,
      shortText: a.label,
      lista: GUIDES.filter((g) => g.area === a.slug && !GENERAL_GUIDES.has(g.slug)),
    })),
  ].filter((g) => g.lista.length);
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
        <Section key={group.id} id={group.id} n={pad(n)} label="Área" title={group.title} className={n % 2 ? "sec-alt" : ""}>
          <ul className="guide-cards">
            {group.lista.map((g, i) => (
              <li className="reveal guide-card" key={g.slug}>
                <a href={`/${g.slug}`}>
                  <small>{pad(i)}</small>
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
        </Section>
      ))}
      <Dialog open={!!previewGuide} onClose={() => setPreview(null)} title={previewGuide ? previewGuide.h1 : ""}>
        {previewGuide && (
          <>
            <p className="label-mini">Em resumo</p>
            <ul className="janela-lista">
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
        related={[GENERAL_LINKS.quiz, GENERAL_LINKS.lembrete, areaLink(AREAS[0])]}
      />
    </>
  );
}

function QuizPage({ page }) {
  return (
    <>
      <PageTop
        breadcrumb={[{ label: "O que preciso?" }]}
        eyebrow="Passo a passo"
        title={page.h1}
        text="Responda uma pergunta por vez. No fim, você vê o que o seu caso provavelmente exige e fala com a gente pelo WhatsApp."
      />
      <section className="sec quiz" aria-label="Perguntas">
        <div className="container container-reading">
          <Wizard />
        </div>
      </section>
      <PageClosing
        title="Prefere conversar direto?"
        whatsappText="Olá! Tenho uma dúvida sobre o que o meu caso precisa."
        related={[GENERAL_LINKS.guias, GENERAL_LINKS.lembrete, areaLink(AREAS[1])]}
      />
    </>
  );
}

function lastDayOfMonth(yearMonth) {
  const [year, month] = yearMonth.split("-").map(Number);
  const day = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return `${yearMonth}-${String(day).padStart(2, "0")}`;
}

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function ReminderPage({ page }) {
  const [form, setForm] = useState({ name: "", whatsapp: "", document: REMINDER_DOCUMENTS[0], monthNum: "", year: "", consent: false, site: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  // Years computed in the browser (the prerendered HTML does not freeze the site's build year).
  const [years, setYears] = useState([]);
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYears(Array.from({ length: 6 }, (_, i) => String(currentYear + i)));
  }, []);
  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  // "Mês do vencimento" (expiry month) as two lists (month and year): the type="month" field does not work in desktop Safari.
  const expiryMonth = form.monthNum && form.year ? `${form.year}-${form.monthNum}` : "";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.site) return; // honeypot field for bots
    let phoneNumber = form.whatsapp.replace(/\D/g, "");
    if (phoneNumber.length === 10 || phoneNumber.length === 11) phoneNumber = "55" + phoneNumber;
    if (phoneNumber.length < 12 || phoneNumber.length > 13) {
      setError("Confira o número do WhatsApp. Informe o DDD e o número, por exemplo (17) 99999-9999.");
      return;
    }
    if (form.name.trim().length < 2) {
      setError("Informe o seu nome.");
      return;
    }
    if (!form.consent) {
      setError("Marque a autorização para receber os lembretes.");
      return;
    }
    setStatus("sending");
    try {
      await sendReminder({
        name: form.name.trim(),
        whatsapp: phoneNumber,
        document: form.document,
        expiry: expiryMonth ? lastDayOfMonth(expiryMonth) : null,
        consent: true,
      });
      setStatus("ok");
    } catch {
      setStatus("idle");
      setError("Não foi possível enviar agora. Tente de novo ou chame a RD pelo WhatsApp.");
    }
  };

  return (
    <>
      <PageTop
        breadcrumb={[{ label: "Lembrete de vencimento" }]}
        eyebrow="Serviço gratuito"
        title={page.h1}
        text="Deixe o seu contato e o vencimento do documento. Avisamos pelo WhatsApp com antecedência, para você renovar sem correria."
      />
      <section className="sec" aria-label="Formulário do lembrete">
        <div className="container reminder-grid">
          <div>
          {status === "ok" ? (
            <div className="notice-ok" role="status">
              <h2>Pedido recebido</h2>
              <p>
                Obrigado! Guardamos o seu pedido e vamos avisar você pelo WhatsApp antes do vencimento. Se quiser
                desistir a qualquer momento, é só nos dizer.
              </p>
              <a className="btn btn-sec" href="/">
                Voltar ao início
              </a>
            </div>
          ) : (
            <form className="form-public" onSubmit={submit} noValidate>
              <label>
                <span>Seu nome</span>
                <input value={form.name} onChange={handleChange("name")} autoComplete="name" maxLength={120} required />
              </label>
              <label>
                <span>WhatsApp com DDD</span>
                <input
                  value={form.whatsapp}
                  onChange={handleChange("whatsapp")}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(17) 99999-9999"
                  required
                />
              </label>
              <fieldset className="doc-options">
                <legend>Qual documento?</legend>
                {REMINDER_DOCUMENTS.map((d) => (
                  <label key={d} className="doc-option">
                    <input type="radio" name="document" value={d} checked={form.document === d} onChange={handleChange("document")} />
                    <span className="doc-option-name">{d}</span>
                    {form.document === d && REMINDER_TIPS[d] && <small className="hint-doc">{REMINDER_TIPS[d]}</small>}
                  </label>
                ))}
              </fieldset>
              <fieldset className="field-month">
                <legend>Mês do vencimento (se souber)</legend>
                <div>
                  <select aria-label="Mês" value={form.monthNum} onChange={handleChange("monthNum")}>
                    <option value="">Mês</option>
                    {MONTHS.map((m, i) => (
                      <option key={m} value={String(i + 1).padStart(2, "0")}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select aria-label="Ano" value={form.year} onChange={handleChange("year")}>
                    <option value="">Ano</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>
              <label className="is-hidden" aria-hidden="true">
                <span>Não preencha este campo</span>
                <input tabIndex={-1} autoComplete="off" value={form.site} onChange={handleChange("site")} />
              </label>
              <label className="consent">
                <input type="checkbox" checked={form.consent} onChange={handleChange("consent")} />
                <span>
                  Autorizo a RD Engenharia a me enviar lembretes por WhatsApp sobre o vencimento deste documento. Posso
                  pedir a exclusão dos meus dados quando quiser. Veja a <a href="/privacidade">política de privacidade</a>.
                </span>
              </label>
              {error && (
                <p className="error-form" role="alert">
                  {error}
                </p>
              )}
              <button className="btn btn-whatsapp btn-large" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Enviando..." : "Quero ser avisado"}
              </button>
            </form>
          )}
          </div>
          <aside className="reminder-how reveal" aria-label="Como funciona o lembrete">
            <p className="label-mini">Como funciona</p>
            <ol>
              <li>
                <strong>Você informa</strong> o documento e, se souber, o mês do vencimento.
              </li>
              <li>
                <strong>Guardamos com segurança</strong>, em um banco de dados que só a equipe da RD acessa.
              </li>
              <li>
                <strong>Avisamos pelo WhatsApp</strong> antes do vencimento, para dar tempo de renovar.
              </li>
            </ol>
            <p className="reminder-how-note">
              É gratuito e você pode pedir a exclusão dos seus dados quando quiser. <a href="/privacidade">Política de privacidade</a>.
            </p>
          </aside>
        </div>
      </section>
      <PageClosing
        title="Prefere falar com a gente?"
        text="Conte pelo WhatsApp qual documento você quer acompanhar. O lembrete é gratuito e respondemos no horário de atendimento."
        whatsappText="Olá! Tenho uma dúvida sobre o lembrete de vencimento."
        related={[GENERAL_LINKS.guias, GENERAL_LINKS.quiz, areaLink(AREAS[1])]}
      />
    </>
  );
}

function PrivacyPage() {
  return (
    <>
      <PageTop breadcrumb={[{ label: "Privacidade" }]} eyebrow="Transparência" title="Política de Privacidade" />
      <section className="sec article-sec">
        <div className="container container-reading article">
          <p className="article-lead">
            Esta página explica, de forma simples, como o site da RD Engenharia Segurança e Meio Ambiente trata as
            informações de quem entra em contato.
          </p>
          <h2>Quais dados coletamos</h2>
          <p>
            Quando você preenche o formulário de orçamento ou usa o guia "O que preciso?", as informações digitadas
            (como nome, cidade e a descrição do serviço) são usadas apenas para montar uma mensagem de WhatsApp. Elas
            são enviadas por você, ao clicar no botão, diretamente para o nosso número, e não ficam guardadas no site.
          </p>
          <h2>Lembrete de vencimento</h2>
          <p>
            Se você pedir o lembrete de vencimento, guardamos o seu nome, o número de WhatsApp, o tipo de documento, o
            mês do vencimento (se informado) e a data da sua autorização. Usamos esses dados somente para avisar você
            sobre o prazo e oferecer a renovação. Eles ficam em banco de dados protegido, com acesso restrito à nossa
            equipe, e você pode pedir a exclusão a qualquer momento pelo WhatsApp.
          </p>
          <h2>Estatísticas de visita</h2>
          <p>
            Usamos o Vercel Web Analytics para medir quantas pessoas visitam o site e quais páginas acessam. A
            ferramenta gera estatísticas agregadas e não utiliza cookies para identificar visitantes individualmente.
          </p>
          <h2>Uso das informações</h2>
          <p>
            As mensagens recebidas pelo WhatsApp são usadas somente para responder ao seu pedido, elaborar orçamento e
            prestar o serviço contratado. Não vendemos nem compartilhamos seus dados com terceiros para fins de
            publicidade.
          </p>
          <h2>Seus direitos</h2>
          <p>
            De acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode pedir informações sobre os
            seus dados, a correção ou a exclusão deles. Basta nos chamar no WhatsApp.
          </p>
          <h2>Contato</h2>
          <p>
            {TRADE_NAME} · {ADDRESS} · WhatsApp {PHONE_DISPLAY}.
          </p>
        </div>
      </section>
      <PageClosing
        title="Dúvida sobre os seus dados?"
        text="Pergunte pelo WhatsApp. Respondemos no horário de atendimento, de segunda a sexta, das 7h às 17h."
        whatsappText="Olá! Tenho uma dúvida sobre a política de privacidade do site."
        related={[GENERAL_LINKS.lembrete, GENERAL_LINKS.guias, GENERAL_LINKS.quiz]}
      />
    </>
  );
}

// Terms of use: DRAFT written from what the site already states (quotes via WhatsApp, no prices on the
// site, ART when required, illustrative images, real projects with data removed). The owner reviews before publishing.
function TermsPage() {
  return (
    <>
      <PageTop breadcrumb={[{ label: "Termos de uso" }]} eyebrow="Transparência" title="Termos de Uso" />
      <section className="sec article-sec">
        <div className="container container-reading article">
          <p className="article-lead">
            Estes termos explicam, de forma simples, como funciona o site da RD Engenharia Segurança e Meio Ambiente.
            Ao usar o site, você concorda com eles.
          </p>
          <h2>Para que serve o site</h2>
          <p>
            O site apresenta os serviços da RD Engenharia e ajuda você a descobrir o que o seu caso precisa. Ele não
            vende serviços diretamente: todo atendimento começa por uma conversa no WhatsApp.
          </p>
          <h2>Orçamento e contratação</h2>
          <p>
            O site não mostra preços nem prazos fixos, porque cada caso é diferente. Valor, prazo e condições são
            informados no orçamento, por escrito e sem compromisso, depois de conhecermos o seu caso. O serviço só
            começa depois que você aprova o orçamento. Os trabalhos que exigem são acompanhados de ART (Anotação de
            Responsabilidade Técnica) de profissional habilitado no CREA-SP.
          </p>
          <h2>Conteúdo informativo</h2>
          <p>
            Os guias, as perguntas frequentes e o passo a passo "O que preciso?" trazem orientações gerais. Eles não
            substituem a análise técnica do seu caso, e normas e prazos dos órgãos públicos podem mudar. Antes de
            decidir, fale com a gente.
          </p>
          <h2>Imagens e exemplos</h2>
          <p>
            As fotos marcadas como ilustrativas são de terceiros, usadas conforme a licença de cada uma (veja os{" "}
            <a href="/creditos">créditos das imagens</a>), e não mostram trabalhos da RD. Os desenhos de projeto da
            página de engenharia civil são trabalhos reais, com os dados dos clientes retirados. Os documentos de
            exemplo e as ilustrações interativas são inventados, feitos só para o site.
          </p>
          <h2>Direitos sobre o conteúdo</h2>
          <p>
            Os textos, a marca e os desenhos próprios do site pertencem à RD Engenharia. Para usar qualquer parte
            deles, peça autorização pelo WhatsApp.
          </p>
          <h2>Links para outros serviços</h2>
          <p>
            O site tem links para o WhatsApp, o Google Maps e o Instagram. Ao usá-los, valem os termos e a política de
            privacidade de cada serviço.
          </p>
          <h2>Seus dados</h2>
          <p>
            O tratamento dos dados de quem entra em contato está na <a href="/privacidade">política de privacidade</a>.
          </p>
          <h2>Mudanças nestes termos</h2>
          <p>Estes termos podem ser atualizados. A versão válida é sempre a publicada nesta página.</p>
          <h2>Contato</h2>
          <p>
            {TRADE_NAME} · {ADDRESS} · WhatsApp {PHONE_DISPLAY}.
          </p>
        </div>
      </section>
      <PageClosing
        title="Ficou alguma dúvida?"
        text="Pergunte pelo WhatsApp. Respondemos no horário de atendimento, de segunda a sexta, das 7h às 17h."
        whatsappText="Olá! Tenho uma dúvida sobre os termos de uso do site."
        related={[GENERAL_LINKS.guias, GENERAL_LINKS.quiz, GENERAL_LINKS.lembrete]}
      />
    </>
  );
}

function CreditsPage() {
  const groups = [
    { title: "CC0 (Wikimedia Commons)", license: "CC0", text: "Domínio público: uso livre, sem exigência de crédito. Mantemos o autor e a origem por transparência." },
    { title: "Domínio público (Wikimedia Commons)", license: "Domínio público", text: "Fotos de um instituto público dos EUA (NIOSH), sem restrição de uso. Mantemos o autor e a origem por transparência." },
    { title: "Unsplash License", license: "Unsplash License", text: "Licença própria do Unsplash, que permite uso comercial sem pedir autorização. Não é CC0. Texto completo em", link: { href: "https://unsplash.com/license", label: "unsplash.com/license" } },
  ];
  return (
    <>
      <PageTop
        breadcrumb={[{ label: "Créditos das imagens" }]}
        eyebrow="Transparência"
        title="Créditos das imagens"
        text="A RD Engenharia ainda não tem fotos próprias no site. As fotos abaixo são ilustrativas, de terceiros, e não mostram trabalhos da empresa."
      />
      <section className="sec" aria-label="Lista de créditos">
        <div className="container">
          {groups.map((g) => {
            const photos = PHOTOS_IN_USE.filter((f) => f.license === g.license);
            if (!photos.length) return null;
            return (
              <div key={g.license} className="credits-group">
                <h2>{g.title}</h2>
                <p className="credits-note">
                  {g.text}
                  {g.link && (
                    <>
                      {" "}
                      <a href={g.link.href} target="_blank" rel="noopener noreferrer">
                        {g.link.label}
                      </a>
                      .
                    </>
                  )}
                </p>
                <ul className="credits">
                  {photos.map((f) => (
                    <li key={f.file} className="reveal">
                      <img src={photoPath(f)} srcSet={srcset(f)} sizes="160px" width={f.w} height={f.h} loading="lazy" alt={f.alt} />
                      <dl>
                        {f.fileName && (
                          <div>
                            <dt>Arquivo</dt>
                            <dd>{f.fileName}</dd>
                          </div>
                        )}
                        <div>
                          <dt>Autor</dt>
                          <dd>{f.author || "Consta na página da foto (não anotado aqui)"}</dd>
                        </div>
                        <div>
                          <dt>Licença</dt>
                          <dd>
                            {f.licenseUrl ? (
                              <a href={f.licenseUrl} target="_blank" rel="noopener noreferrer">
                                {f.license}
                              </a>
                            ) : (
                              f.license
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt>Página de origem</dt>
                          <dd>
                            <a href={f.source} target="_blank" rel="noopener noreferrer">
                              {f.sourceName}
                            </a>
                          </dd>
                        </div>
                      </dl>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div className="container-reading credits-others">
            <h2>Outros materiais</h2>
            <p>
              A marca (logotipo) é da RD Engenharia. Os desenhos de projeto da página de engenharia civil são trabalhos reais da RD, com os dados dos
              clientes retirados. As ilustrações interativas e o modelo de PGR são exemplos inventados, feitos para o
              site. Os ícones são da Phosphor Icons (licença MIT) e a fonte é a Manrope (licença SIL
              Open Font).
            </p>
          </div>
        </div>
      </section>
      <PageClosing
        title="Quer ver o trabalho real?"
        text="Os desenhos de projeto da página de engenharia civil são da RD. Para outros serviços, conte o seu caso pelo WhatsApp."
        whatsappText="Olá! Gostaria de conhecer melhor o trabalho da RD Engenharia."
        related={[areaLink(AREAS[2]), GENERAL_LINKS.guias, GENERAL_LINKS.quiz]}
      />
    </>
  );
}

function LocationPage({ page }) {
  const locationZapText = "Olá! Gostaria de saber se vocês atendem o meu endereço.";
  return (
    <>
      <header className="hero-inner hero-area">
        <div className="container">
          <Breadcrumb items={[{ label: "Onde atendemos" }]} />
          <p className="eyebrow">Onde atendemos</p>
          <h1 className="display-m">{page.h1}</h1>
          <p className="lead">
            Isso vale para todos os serviços. Conte a sua situação pelo WhatsApp e combinamos a melhor forma de atender você.
          </p>
          <div className="actions">
            <WhatsappButton className="btn-large" text={locationZapText} label="Perguntar pelo WhatsApp" />
          </div>
        </div>
      </header>

      {/* This section used to just repeat the page title; now it explains the two service modes. */}
      <Section id="atendimento-regiao" n="01" label="Formas de atendimento" title="Como funciona o atendimento.">
        <ul className="modes-grid">
          <li className="modes-card reveal">
            <p className="label-mini">Presencial</p>
            <h3>No local, quando o serviço exige.</h3>
            <p>Visitas, medições, levantamentos e vistorias no imóvel, na empresa ou na propriedade rural.</p>
          </li>
          <li className="modes-card reveal">
            <p className="label-mini">Online</p>
            <h3>O resto, pelo WhatsApp.</h3>
            <p>Conversa, orçamento, envio de fotos e documentos e acompanhamento, sem precisar sair de casa.</p>
          </li>
          <li className="modes-card modes-card-featured reveal">
            <p className="label-mini">Seu endereço</p>
            <h3>Não sabe se está na região?</h3>
            <p>Conte onde fica o imóvel ou a empresa e confirmamos o atendimento.</p>
            <WhatsappButton text={locationZapText} label="Perguntar" />
          </li>
        </ul>
      </Section>

      <section className="sec sec-alt" id="mapa" aria-labelledby="mapa-t">
        <div className="container map-grid">
          <div className="reveal">
            <p className="sec-n">
              <span>02</span> Onde fica
            </p>
            <h2 id="mapa-t" className="sec-title">
              Nosso endereço.
            </h2>
            <p className="lead">{ADDRESS}</p>
            <p className="map-hours">Segunda a sexta, das 7h às 17h.</p>
            <div className="actions">
              <a className="btn btn-whatsapp btn-large" href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
                Como chegar
              </a>
              <a className="btn btn-sec btn-large" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
                Ver no Google Maps
              </a>
            </div>
          </div>
          <figure className="map reveal">
            <div className="map-box">
              <iframe
                title="Mapa com a localização da RD Engenharia em Ibirá/SP"
                src={MAP_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer"
                allowFullScreen
              />
            </div>
            <figcaption>O mapa é fornecido pelo Google.</figcaption>
          </figure>
        </div>
      </section>

      <PageClosing
        whatsappText={locationZapText}
        related={[areaLink(AREAS[0]), areaLink(AREAS[2]), GENERAL_LINKS.quiz]}
      />
    </>
  );
}

// Dedicated page to print or save as PDF an area's document list (/imprimir/<area>).
// No site header or footer, no state: the button calls window.print() directly. noindex.
export function PrintPage({ area }) {
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }));
  }, []);
  return (
    <div className="print">
      <div className="print-bar no-print">
        <a className="btn btn-sec" href={`/${area.slug}#atendimento`}>
          <span aria-hidden="true">←</span> Voltar
        </a>
        <button type="button" className="btn btn-whatsapp" onClick={() => window.print()}>
          Imprimir / Salvar PDF
        </button>
        <p>Para salvar em PDF, escolha "Salvar como PDF" como impressora.</p>
      </div>
      <main className="sheet-doc" id="conteudo">
        <header className="sheet-top">
          <img src="/marca/marca-lockup.webp" width="120" height="66" alt="RD Engenharia" />
          <div>
            <p className="sheet-company">RD Engenharia Segurança e Meio Ambiente</p>
            <p className="sheet-date">{date || "\u00a0"}</p>
          </div>
        </header>
        <h1>Lista de documentos necessários</h1>
        <p className="sheet-area">Área: {area.name}</p>
        <ul className="sheet-list">
          {area.documents.map((d) => (
            <li key={d}>
              <span className="sheet-box" aria-hidden="true" />
              {d}
            </li>
          ))}
        </ul>
        <p className="sheet-note">Lista de orientação geral. Confirmamos com você o que cada caso realmente exige.</p>
        <footer className="sheet-footer">
          <p>{LEGAL_NAME} · CNPJ {CNPJ}</p>
          <p>
            {ADDRESS} · WhatsApp {PHONE_DISPLAY}
          </p>
        </footer>
      </main>
    </div>
  );
}

export default function PageView({ page }) {
  let body = null;
  if (page.type === "area") body = <AreaPage page={page} />;
  else if (page.type === "location") body = <LocationPage page={page} />;
  else if (page.type === "guide") body = <GuidePage page={page} />;
  else if (page.type === "quiz") body = <QuizPage page={page} />;
  else if (page.type === "guide-index") body = <GuidesPage page={page} />;
  else if (page.type === "reminder") body = <ReminderPage page={page} />;
  else if (page.type === "credits") body = <CreditsPage />;
  else if (page.type === "terms") body = <TermsPage />;
  else body = <PrivacyPage />;
  return <Shell current={page.slug}>{body}</Shell>;
}

export function NotFound() {
  return (
    <Shell current="404">
      <section className="not-found">
        <div className="container">
          <p className="eyebrow">Erro 404</p>
          <h1 className="display-m">Página não encontrada.</h1>
          <p className="lead">O endereço pode ter mudado ou estar digitado errado. Veja por onde seguir:</p>
          <div className="actions">
            <a className="btn btn-whatsapp btn-large" href="/">
              Ir para o início
            </a>
            <a className="btn btn-sec btn-large" href="/guias">
              Ver os guias
            </a>
            <a
              className="btn btn-sec btn-large"
              href={whatsappLink("Olá! Não encontrei o que procurava no site.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Shell>
  );
}
