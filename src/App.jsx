import Icon from "./Icon";
import { useEffect, useState } from "react";
import { FAQ } from "./faqItems";
import { AREAS, GOOGLE_REVIEWS_URL, DIRECTIONS_URL, MAP_EMBED_URL, GOOGLE_RATING, ADDRESS } from "./pagesData";
import { Shell, SectionNav, whatsappLink } from "./Layout";
import HomeExamples from "./HomeExamples";
import HeroBackground from "./HeroBackground";
import { DocumentsMarquee, ExamplePanel, NumbersLine } from "./Showcase";
import Dialog from "./Dialog";
import { TopoField } from "@/components/ui/contour-field";
import { PHOTOS, photoPath, srcset } from "./photos";
import AreaIcon from "./AreaIcon";
import FaqList from "./Faq";
import Reviews from "./Reviews";
import DocumentSearch from "./Search";
import WhatsappQr from "./WhatsappQr";
import { WHATSAPP_PROJECTS } from "./contact";
import { CREA_NUMBER, PHONE_DISPLAY } from "./company";
import StepStack from "./StepStack";
import Tilt3D from "./Tilt3D";
import RevealPhrase from "./RevealPhrase";

// Each card's title comes from AREAS (rotulo), so the area name is the same across the whole site.
const NEEDS = [
  {
    slug: "seguranca-do-trabalho",
    photo: "capacete-vermelho-epi",
    phrase: "Tenho funcionários e preciso de PGR, laudos ou treinamentos.",
  },
  {
    slug: "corpo-de-bombeiros",
    photo: "extintor-parede-concreto-pictograma",
    phrase: "Preciso de AVCB ou CLCB para o meu imóvel ou comércio.",
  },
  {
    slug: "engenharia-civil",
    photo: "edificio-estrutura-concreto-pavimentos",
    phrase: "Vou construir, reformar ou regularizar um imóvel.",
  },
  {
    slug: "meio-ambiente-topografia",
    photo: "rio-mata-vista-aerea",
    phrase: "Tenho imóvel rural e preciso de CAR, georreferenciamento ou topografia.",
  },
].map((n) => ({ ...n, title: AREAS.find((a) => a.slug === n.slug).label }));

const STEPS = [
  { title: "Você chama no WhatsApp", text: "Conte o que precisa. Respondemos no horário de atendimento." },
  { title: "Entendemos o seu caso", text: "Analisamos a situação e os documentos que você já tem." },
  { title: "Você recebe o orçamento", text: "Valor e condições claros, por escrito e sem compromisso." },
  { title: "Executamos e entregamos", text: "Trabalho feito por responsável técnico habilitado, com ART." },
];

const EDUCATION = [
  "Engenharia Civil e Engenharia Ambiental (bacharelados)",
  "Pós-graduação em Engenharia de Segurança do Trabalho",
  "Pós-graduação em Georreferenciamento de Imóveis Rurais",
  "Pós-graduação em Topografia e Sensoriamento Remoto",
  "Pós-graduação em Gestão Ambiental e em Higiene Ocupacional",
  "Técnico em Segurança do Trabalho",
];

const FORM_SERVICES = AREAS.map((a) => a.name);

const HOME_SECTIONS = [
  { id: "organizamos", label: "O que organizamos" },
  { id: "na-pratica", label: "Na prática" },
  { id: "como-funciona", label: "Como funciona" },
  { id: "duvidas", label: "Dúvidas" },
  { id: "contato", label: "Contato" },
];

const isWithinOfficeHours = () => {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      weekday: "short",
      hour: "numeric",
      hour12: false,
    }).formatToParts(new Date());
    const day = parts.find((p) => p.type === "weekday").value;
    const hour = Number(parts.find((p) => p.type === "hour").value) % 24;
    return !["Sat", "Sun"].includes(day) && hour >= 7 && hour < 17;
  } catch {
    return false;
  }
};

export default function App() {
  // null until mount: the prerendered HTML (Google and first paint) shows only the hours, without "fora do horário"
  const [isOpenNow, setIsOpenNow] = useState(null);
  const [request, setRequest] = useState({ name: "", city: "", service: "", message: "" });
  const [showMap, setShowMap] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [showEducation, setShowEducation] = useState(false);

  useEffect(() => {
    setIsOpenNow(isWithinOfficeHours());
    const id = setInterval(() => setIsOpenNow(isWithinOfficeHours()), 60000);
    return () => clearInterval(id);
  }, []);

  const handleChange = (field) => (e) => setRequest((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const lines = ["Olá! Gostaria de solicitar um orçamento."];
    if (request.name.trim()) lines.push(`Nome: ${request.name.trim()}`);
    if (request.city.trim()) lines.push(`Cidade: ${request.city.trim()}`);
    if (request.service) lines.push(`Área: ${request.service}`);
    if (request.message.trim()) lines.push(`Mensagem: ${request.message.trim()}`);
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  return (
    <Shell current="">
      <HeroBackground setKey="home" label="As quatro áreas de atuação da RD Engenharia, em fotos ilustrativas" className="hero-home">
        <a className="badge-top" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
          <span className="badge-top-stars" aria-hidden="true">
            ★★★★★
          </span>
          <span>{GOOGLE_RATING}</span>
          <span className="badge-top-arrow" aria-hidden="true">
            →
          </span>
        </a>
        <p className="eyebrow">RD Engenharia · Ibirá/SP</p>
        <h1 className="display">Laudos, projetos e licenças em dia para empresas, obras e imóveis rurais.</h1>
        <p className="hero-triad">
          Documentos em dia. Obra regular. <span className="accent">Equipe protegida.</span>
        </p>
        <p className="lead">
          Engenharia, segurança do trabalho e meio ambiente em Ibirá e região, presencial e online. Você fala direto com o responsável técnico pelo WhatsApp.
        </p>
        <div className="actions">
          <a className="btn btn-whatsapp btn-large" href={whatsappLink("Olá! Gostaria de solicitar um orçamento.")} target="_blank" rel="noopener noreferrer">
            <Icon name="fa-brands fa-whatsapp" /> Pedir orçamento pelo WhatsApp
          </a>
          <a className="link-arrow hero-link" href="/o-que-preciso">
            Não sabe o que precisa? Descubra aqui <span aria-hidden="true">→</span>
          </a>
        </div>
        <p className="hero-risk">Orçamento por escrito e sem compromisso.</p>
        <p className={`status status-bg ${isOpenNow ? "on" : ""}`}>
          <Icon name="fa-solid fa-circle" />{" "}
          {isOpenNow === null
            ? "Atendimento de segunda a sexta, das 7h às 17h"
            : isOpenNow
              ? "Atendendo agora. Seg. a sex., das 7h às 17h"
              : "Fora do horário. Respondemos no próximo dia útil (seg. a sex., das 7h às 17h)"}
        </p>
      </HeroBackground>

      <div className="choices-cards-wrap" id="servicos">
        <div className="container">
          <h2 className="sr-only">Do que você precisa?</h2>
          <DocumentSearch className="search-home" />
          <ol className="choices-cards">
            {NEEDS.map((n, i) => {
              const f = PHOTOS[n.photo];
              return (
                <li key={n.slug}>
                  <a href={`/${n.slug}`} className="card-area">
                    <span className="card-area-photo">
                      <img src={photoPath(f)} srcSet={srcset(f)} sizes={i === 0 || i === 3 ? "(min-width: 1100px) 800px, (min-width: 700px) 50vw, 100vw" : "(min-width: 1100px) 400px, (min-width: 700px) 50vw, 100vw"} width={f.w} height={f.h} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span className="icon-tile card-area-icon">
                      <AreaIcon slug={n.slug} size={30} />
                    </span>
                    <span className="card-area-n" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <strong>{n.title}</strong>
                    <small>{n.phrase}</small>
                    <span className="card-area-arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
          <p className="fine-print choices-note">
            Fotos ilustrativas de terceiros, não são trabalhos da RD. <a href="/creditos">Créditos</a>
          </p>
          <ul className="proof">
            <li>
              <strong>CREA-SP</strong>
              <span>Todo serviço é assinado por profissional habilitado</span>
            </li>
            <li>
              <strong>ART</strong>
              <span>Anotação de Responsabilidade Técnica nos trabalhos que a exigem</span>
            </li>
            <li>
              <strong>WhatsApp</strong>
              <span>Você conversa direto com quem vai executar</span>
            </li>
            <li>
              <strong>Presencial e online</strong>
              <span>Em Ibirá e região, com conversa e orçamento pelo WhatsApp</span>
            </li>
          </ul>
        </div>
      </div>

      <RevealPhrase text="Todo serviço é assinado por profissional habilitado no CREA-SP, e você conversa direto com quem vai executar." />

      <DocumentsMarquee />

      <SectionNav items={HOME_SECTIONS} label="Nesta página" />

      <section className="sec band-section organize" id="organizamos" aria-labelledby="org-t">
        <div className="container organize-grid">
          <div>
            <header className="sec-head reveal">
              <p className="sec-n">
                <span>01</span> O que organizamos
              </p>
              <h2 id="org-t" className="sec-title">
                Seus documentos e vencimentos, em um só lugar.
              </h2>
            </header>
            <p className="lead reveal">
              Montamos a lista do que o seu caso exige, elaboramos os documentos e avisamos pelo WhatsApp antes de cada vencimento.
            </p>
            <div className="actions reveal">
              <a className="btn btn-sec btn-large" href="/o-que-preciso">
                Descubra o que o seu caso precisa
              </a>
              <a className="link-arrow" href="/lembrete-de-vencimento">
                Pedir o lembrete de vencimento <span aria-hidden="true">→</span>
              </a>
            </div>
            <NumbersLine />
          </div>
          <div className="reveal">
            <Tilt3D>
              <ExamplePanel />
            </Tilt3D>
          </div>
        </div>
      </section>

      <HomeExamples />

      <section className="sec band-section" id="como-funciona" aria-labelledby="como-t">
        <div className="container">
          <header className="sec-head reveal">
            <p className="sec-n">
              <span>03</span> Como funciona
            </p>
            <h2 id="como-t" className="sec-title">
              Quatro passos, sem surpresa.
            </h2>
          </header>
          <StepStack
            steps={STEPS}
            firstAction={
              <a className="btn btn-whatsapp btn-small" href={whatsappLink("Olá! Gostaria de solicitar um orçamento.")} target="_blank" rel="noopener noreferrer">
                <Icon name="fa-brands fa-whatsapp" /> Começar agora
              </a>
            }
          />
        </div>
      </section>

      <Reviews />

      <section className="sec sec-alt" id="duvidas" aria-labelledby="duvidas-t">
        <div className="container">
          <header className="sec-head reveal">
            <p className="sec-n">
              <span>04</span> Dúvidas
            </p>
            <h2 id="duvidas-t" className="sec-title">
              Dúvidas frequentes.
            </h2>
          </header>
          <FaqList items={FAQ} limit={5} />
        </div>
      </section>

      {/* Contact and "onde atendemos" in a single block: address, hours and region appear here once
          (the top badge and the footer are the other fixed places). The contour-line background came along. */}
      <section className="contact-block sec-top" id="contato" aria-labelledby="contato-t">
        <TopoField className="sec-top-field contact-top" grid={0} lines={0.4} />
        <div className="container contact-grid">
          <div>
            <p className="sec-n">
              <span>05</span> Contato
            </p>
            <h2 id="contato-t" className="sec-title">
              Peça seu orçamento.
            </h2>
            <p className="contact-text">
              Preencha e continue no WhatsApp. A mensagem já vai pronta, sem compromisso.
            </p>
            <dl className="contact-data">
              <div>
                <dt>Escritório</dt>
                <dd>
                  {ADDRESS}
                  <span className="contact-links">
                    <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
                      Como chegar
                    </a>
                    <button
                      type="button"
                      className="contact-map-button"
                      aria-expanded={showMap}
                      aria-controls={showMap ? "contato-mapa" : undefined}
                      onClick={() => {
                        setShowMap((v) => !v);
                        setMapReady(false);
                      }}
                    >
                      {showMap ? "Fechar o mapa" : "Ver o mapa aqui"}
                    </button>
                  </span>
                  {showMap && (
                    <figure id="contato-mapa" className="where-map">
                      <div className="map-box">
                        {!mapReady && <p className="where-map-loading">Carregando o mapa…</p>}
                        <iframe
                          title="Mapa com a localização da RD Engenharia em Ibirá/SP"
                          src={MAP_EMBED_URL}
                          referrerPolicy="no-referrer"
                          allowFullScreen
                          onLoad={() => setMapReady(true)}
                          className={mapReady ? "ready" : ""}
                        />
                      </div>
                      <figcaption>O mapa é fornecido pelo Google.</figcaption>
                    </figure>
                  )}
                </dd>
              </div>
              <div>
                <dt>Atendimento</dt>
                <dd>Segunda a sexta, das 7h às 17h</dd>
              </div>
              <div>
                <dt>Região</dt>
                <dd>
                  Ibirá e região, presencial e online.
                  <a href="/onde-atendemos">Ver onde atendemos</a>
                </dd>
              </div>
              <div>
                <dt>Instagram</dt>
                <dd>
                  <a href="https://www.instagram.com/rd_engenhariaibira/" target="_blank" rel="noopener noreferrer">
                    @rd_engenhariaibira
                  </a>
                </dd>
              </div>
            </dl>
            <WhatsappQr />
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <label>
              Seu nome
              <input value={request.name} onChange={handleChange("name")} autoComplete="name" />
            </label>
            <label>
              Cidade
              <input value={request.city} onChange={handleChange("city")} />
            </label>
            <label>
              Área do serviço
              <select value={request.service} onChange={handleChange("service")}>
                <option value="">Escolha uma área</option>
                {FORM_SERVICES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                <option value="Ainda não sei">Ainda não sei</option>
              </select>
            </label>
            <label>
              O que você precisa
              <textarea rows="4" value={request.message} onChange={handleChange("message")} />
            </label>
            <button className="btn btn-whatsapp btn-large" type="submit">
              <Icon name="fa-brands fa-whatsapp" /> Continuar no WhatsApp
            </button>
          </form>
        </div>
        {/* "Quem somos" sits inside Contact: the people and the phone numbers next to the form. */}
        <div className="container contact-people" id="quem-somos">
          <h3 className="contact-people-title">Quem responde pelo seu serviço</h3>
          <p className="contact-text">
            A RD Engenharia é uma empresa familiar de Ibirá. Todo serviço é assinado por profissional habilitado no CREA-SP,
            e você conversa direto com quem vai executar.
          </p>
          <div className="people cascade">
            <article className="reveal">
              <span className="person-initials" aria-hidden="true">
                RA
              </span>
              <h3>Rafael Antonio Dias</h3>
              <p className="person-role">
                Engenheiro civil e ambiental · Especialista em segurança do trabalho · {CREA_NUMBER}
              </p>
              <p className="person-summary">
                {EDUCATION.length} formações, entre bacharelados, pós-graduações e curso técnico.
              </p>
              <div className="person-actions">
                <button type="button" className="btn btn-sec" onClick={() => setShowEducation(true)} aria-haspopup="dialog">
                  Ver formação completa
                </button>
                <a
                  className="btn btn-sec"
                  href={whatsappLink("Olá Rafael! Gostaria de solicitar um orçamento.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="fa-brands fa-whatsapp" /> {PHONE_DISPLAY}
                </a>
              </div>
              <Dialog open={showEducation} onClose={() => setShowEducation(false)} title="Rafael Antonio Dias">
                <p className="person-role">
                  Engenheiro civil e ambiental · Especialista em segurança do trabalho · {CREA_NUMBER}
                </p>
                <ul className="person-education">
                  {EDUCATION.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="person-extra">Também corretor de imóveis e perito grafotécnico.</p>
              </Dialog>
            </article>
            <article className="reveal">
              <span className="person-initials" aria-hidden="true">
                RF
              </span>
              <h3>Rafael Antonio Dias Filho</h3>
              <p className="person-role">Técnico em edificações · Projetos e atendimento</p>
              <a
                className="btn btn-sec"
                href={whatsappLink("Olá! Gostaria de solicitar um orçamento.", WHATSAPP_PROJECTS)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="fa-brands fa-whatsapp" /> (17) 99659-0330
              </a>
            </article>
          </div>
        </div>
      </section>
    </Shell>
  );
}
