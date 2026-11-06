import Icone from "./Icon";
import { useEffect, useState } from "react";
import { FAQ } from "./faqItems";
import { AREAS, URL_AVALIACOES_GOOGLE, URL_COMO_CHEGAR, MAPA_EMBED, NOTA_GOOGLE, ENDERECO } from "./pagesData";
import { Casca, SecoesNav, zap } from "./Layout";
import ExemplosHome from "./HomeExamples";
import HeroFundo from "./HeroBackground";
import { FaixaDocumentos, PainelExemplo, NumerosLinha } from "./Showcase";
import Janela from "./Dialog";
import { TopoField } from "@/components/ui/contour-field";
import { FOTOS, caminho, srcset } from "./photos";
import IconeArea from "./AreaIcon";
import Perguntas from "./Faq";
import Avaliacoes from "./Reviews";
import BuscaDocumento from "./Search";
import QrWhatsapp from "./WhatsappQr";
import { WHATSAPP_PROJETOS } from "./contact";
import { CREA_NUMBER, PHONE_DISPLAY } from "./company";
import PilhaEtapas from "./StepStack";
import Inclinado3D from "./Tilt3D";
import FraseRevela from "./RevealPhrase";

// O título de cada cartão vem de AREAS (rotulo), para o nome da área ser o mesmo no site todo.
const NECESSIDADES = [
  {
    slug: "seguranca-do-trabalho",
    foto: "capacete-vermelho-epi",
    frase: "Tenho funcionários e preciso de PGR, laudos ou treinamentos.",
  },
  {
    slug: "corpo-de-bombeiros",
    foto: "extintor-parede-concreto-pictograma",
    frase: "Preciso de AVCB ou CLCB para o meu imóvel ou comércio.",
  },
  {
    slug: "engenharia-civil",
    foto: "edificio-estrutura-concreto-pavimentos",
    frase: "Vou construir, reformar ou regularizar um imóvel.",
  },
  {
    slug: "meio-ambiente-topografia",
    foto: "rio-mata-vista-aerea",
    frase: "Tenho imóvel rural e preciso de CAR, georreferenciamento ou topografia.",
  },
].map((n) => ({ ...n, titulo: AREAS.find((a) => a.slug === n.slug).rotulo }));

const ETAPAS = [
  { titulo: "Você chama no WhatsApp", texto: "Conte o que precisa. Respondemos no horário de atendimento." },
  { titulo: "Entendemos o seu caso", texto: "Analisamos a situação e os documentos que você já tem." },
  { titulo: "Você recebe o orçamento", texto: "Valor e condições claros, por escrito e sem compromisso." },
  { titulo: "Executamos e entregamos", texto: "Trabalho feito por responsável técnico habilitado, com ART." },
];

const FORMACAO = [
  "Engenharia Civil e Engenharia Ambiental (bacharelados)",
  "Pós-graduação em Engenharia de Segurança do Trabalho",
  "Pós-graduação em Georreferenciamento de Imóveis Rurais",
  "Pós-graduação em Topografia e Sensoriamento Remoto",
  "Pós-graduação em Gestão Ambiental e em Higiene Ocupacional",
  "Técnico em Segurança do Trabalho",
];

const SERVICOS_FORM = AREAS.map((a) => a.nome);

const SECOES_HOME = [
  { id: "organizamos", rotulo: "O que organizamos" },
  { id: "na-pratica", rotulo: "Na prática" },
  { id: "como-funciona", rotulo: "Como funciona" },
  { id: "duvidas", rotulo: "Dúvidas" },
  { id: "contato", rotulo: "Contato" },
];

const dentroDoHorario = () => {
  try {
    const partes = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      weekday: "short",
      hour: "numeric",
      hour12: false,
    }).formatToParts(new Date());
    const dia = partes.find((p) => p.type === "weekday").value;
    const hora = Number(partes.find((p) => p.type === "hour").value) % 24;
    return !["Sat", "Sun"].includes(dia) && hora >= 7 && hora < 17;
  } catch {
    return false;
  }
};

export default function App() {
  // null até montar: o HTML pré-gerado (Google e primeira pintura) mostra só o horário, sem "fora do horário"
  const [atendendo, setAtendendo] = useState(null);
  const [pedido, setPedido] = useState({ nome: "", cidade: "", servico: "", mensagem: "" });
  const [mapa, setMapa] = useState(false);
  const [mapaPronto, setMapaPronto] = useState(false);
  const [formacao, setFormacao] = useState(false);

  useEffect(() => {
    setAtendendo(dentroDoHorario());
    const id = setInterval(() => setAtendendo(dentroDoHorario()), 60000);
    return () => clearInterval(id);
  }, []);

  const mudar = (campo) => (e) => setPedido((p) => ({ ...p, [campo]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    const linhas = ["Olá! Gostaria de solicitar um orçamento."];
    if (pedido.nome.trim()) linhas.push(`Nome: ${pedido.nome.trim()}`);
    if (pedido.cidade.trim()) linhas.push(`Cidade: ${pedido.cidade.trim()}`);
    if (pedido.servico) linhas.push(`Área: ${pedido.servico}`);
    if (pedido.mensagem.trim()) linhas.push(`Mensagem: ${pedido.mensagem.trim()}`);
    window.open(zap(linhas.join("\n")), "_blank", "noopener,noreferrer");
  };

  return (
    <Casca atual="">
      <HeroFundo chave="home" rotulo="As quatro áreas de atuação da RD Engenharia, em fotos ilustrativas" className="hero-home">
        <a className="badge-top" href={URL_AVALIACOES_GOOGLE} target="_blank" rel="noopener noreferrer">
          <span className="badge-top-stars" aria-hidden="true">
            ★★★★★
          </span>
          <span>{NOTA_GOOGLE}</span>
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
          <a className="btn btn-whatsapp btn-large" href={zap("Olá! Gostaria de solicitar um orçamento.")} target="_blank" rel="noopener noreferrer">
            <Icone nome="fa-brands fa-whatsapp" /> Pedir orçamento pelo WhatsApp
          </a>
          <a className="link-arrow hero-link" href="/o-que-preciso">
            Não sabe o que precisa? Descubra aqui <span aria-hidden="true">→</span>
          </a>
        </div>
        <p className="hero-risk">Orçamento por escrito e sem compromisso.</p>
        <p className={`status status-bg ${atendendo ? "on" : ""}`}>
          <Icone nome="fa-solid fa-circle" />{" "}
          {atendendo === null
            ? "Atendimento de segunda a sexta, das 7h às 17h"
            : atendendo
              ? "Atendendo agora. Seg. a sex., das 7h às 17h"
              : "Fora do horário. Respondemos no próximo dia útil (seg. a sex., das 7h às 17h)"}
        </p>
      </HeroFundo>

      <div className="choices-cards-wrap" id="servicos">
        <div className="container">
          <h2 className="sr-only">Do que você precisa?</h2>
          <BuscaDocumento className="search-home" />
          <ol className="choices-cards">
            {NECESSIDADES.map((n, i) => {
              const f = FOTOS[n.foto];
              return (
                <li key={n.slug}>
                  <a href={`/${n.slug}`} className="card-area">
                    <span className="card-area-photo">
                      <img src={caminho(f)} srcSet={srcset(f)} sizes={i === 0 || i === 3 ? "(min-width: 1100px) 800px, (min-width: 700px) 50vw, 100vw" : "(min-width: 1100px) 400px, (min-width: 700px) 50vw, 100vw"} width={f.w} height={f.h} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span className="icon-tile card-area-icon">
                      <IconeArea slug={n.slug} tamanho={30} />
                    </span>
                    <span className="card-area-n" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <strong>{n.titulo}</strong>
                    <small>{n.frase}</small>
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

      <FraseRevela texto="Todo serviço é assinado por profissional habilitado no CREA-SP, e você conversa direto com quem vai executar." />

      <FaixaDocumentos />

      <SecoesNav itens={SECOES_HOME} rotulo="Nesta página" />

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
            <NumerosLinha />
          </div>
          <div className="reveal">
            <Inclinado3D>
              <PainelExemplo />
            </Inclinado3D>
          </div>
        </div>
      </section>

      <ExemplosHome />

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
          <PilhaEtapas
            etapas={ETAPAS}
            acaoPrimeira={
              <a className="btn btn-whatsapp btn-small" href={zap("Olá! Gostaria de solicitar um orçamento.")} target="_blank" rel="noopener noreferrer">
                <Icone nome="fa-brands fa-whatsapp" /> Começar agora
              </a>
            }
          />
        </div>
      </section>

      <Avaliacoes />

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
          <Perguntas itens={FAQ} limite={5} />
        </div>
      </section>

      {/* Contato e "onde atendemos" num bloco só: endereço, horário e região aparecem aqui uma vez
          (o selo do topo e o rodapé são os outros lugares fixos). O fundo de curvas de nível veio junto. */}
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
                  {ENDERECO}
                  <span className="contact-links">
                    <a href={URL_COMO_CHEGAR} target="_blank" rel="noopener noreferrer">
                      Como chegar
                    </a>
                    <button
                      type="button"
                      className="contact-map-button"
                      aria-expanded={mapa}
                      aria-controls={mapa ? "contato-mapa" : undefined}
                      onClick={() => {
                        setMapa((v) => !v);
                        setMapaPronto(false);
                      }}
                    >
                      {mapa ? "Fechar o mapa" : "Ver o mapa aqui"}
                    </button>
                  </span>
                  {mapa && (
                    <figure id="contato-mapa" className="where-map">
                      <div className="map-box">
                        {!mapaPronto && <p className="where-map-loading">Carregando o mapa…</p>}
                        <iframe
                          title="Mapa com a localização da RD Engenharia em Ibirá/SP"
                          src={MAPA_EMBED}
                          referrerPolicy="no-referrer"
                          allowFullScreen
                          onLoad={() => setMapaPronto(true)}
                          className={mapaPronto ? "ready" : ""}
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
            <QrWhatsapp />
          </div>

          <form className="form" onSubmit={enviar}>
            <label>
              Seu nome
              <input value={pedido.nome} onChange={mudar("nome")} autoComplete="name" />
            </label>
            <label>
              Cidade
              <input value={pedido.cidade} onChange={mudar("cidade")} />
            </label>
            <label>
              Área do serviço
              <select value={pedido.servico} onChange={mudar("servico")}>
                <option value="">Escolha uma área</option>
                {SERVICOS_FORM.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                <option value="Ainda não sei">Ainda não sei</option>
              </select>
            </label>
            <label>
              O que você precisa
              <textarea rows="4" value={pedido.mensagem} onChange={mudar("mensagem")} />
            </label>
            <button className="btn btn-whatsapp btn-large" type="submit">
              <Icone nome="fa-brands fa-whatsapp" /> Continuar no WhatsApp
            </button>
          </form>
        </div>
        {/* Quem somos fica dentro do Contato: as pessoas e os telefones ao lado do formulário. */}
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
                {FORMACAO.length} formações, entre bacharelados, pós-graduações e curso técnico.
              </p>
              <div className="person-actions">
                <button type="button" className="btn btn-sec" onClick={() => setFormacao(true)} aria-haspopup="dialog">
                  Ver formação completa
                </button>
                <a
                  className="btn btn-sec"
                  href={zap("Olá Rafael! Gostaria de solicitar um orçamento.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icone nome="fa-brands fa-whatsapp" /> {PHONE_DISPLAY}
                </a>
              </div>
              <Janela aberta={formacao} aoFechar={() => setFormacao(false)} titulo="Rafael Antonio Dias">
                <p className="person-role">
                  Engenheiro civil e ambiental · Especialista em segurança do trabalho · {CREA_NUMBER}
                </p>
                <ul className="person-education">
                  {FORMACAO.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="person-extra">Também corretor de imóveis e perito grafotécnico.</p>
              </Janela>
            </article>
            <article className="reveal">
              <span className="person-initials" aria-hidden="true">
                RF
              </span>
              <h3>Rafael Antonio Dias Filho</h3>
              <p className="person-role">Técnico em edificações · Projetos e atendimento</p>
              <a
                className="btn btn-sec"
                href={zap("Olá! Gostaria de solicitar um orçamento.", WHATSAPP_PROJETOS)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icone nome="fa-brands fa-whatsapp" /> (17) 99659-0330
              </a>
            </article>
          </div>
        </div>
      </section>
    </Casca>
  );
}
