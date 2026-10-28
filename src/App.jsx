import Icone from "./Icone";
import { useEffect, useState } from "react";
import { FAQ } from "./faq";
import { AREAS, URL_AVALIACOES_GOOGLE, URL_COMO_CHEGAR, MAPA_EMBED, NOTA_GOOGLE, ENDERECO } from "./paginas";
import { Casca, SecoesNav, zap } from "./Layout";
import ExemplosHome from "./ExemplosHome";
import HeroFundo from "./HeroFundo";
import { FaixaDocumentos, PainelExemplo, FaixaNumeros } from "./Vitrine";
import Janela from "./Janela";
import { TopoField } from "@/components/ui/topo-field";
import { FOTOS, caminho, srcset } from "./fotos";
import IconeArea from "./Icones";
import Perguntas from "./Perguntas";
import Avaliacoes from "./Avaliacoes";
import BuscaDocumento from "./Busca";
import QrWhatsapp from "./QrWhatsapp";
import PilhaEtapas from "./PilhaEtapas";

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
  { id: "quem-somos", rotulo: "Quem somos" },
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
        <a className="selo-topo" href={URL_AVALIACOES_GOOGLE} target="_blank" rel="noopener noreferrer">
          <span className="selo-topo-estrelas" aria-hidden="true">
            ★★★★★
          </span>
          <span>{NOTA_GOOGLE}</span>
          <span className="selo-topo-seta" aria-hidden="true">
            →
          </span>
        </a>
        <p className="eyebrow">RD Engenharia · Ibirá/SP</p>
        <h1 className="display">Engenharia, segurança do trabalho e meio ambiente para a nossa região.</h1>
        <p className="hero-triade">
          Documentos em dia. Obra regular. <span className="acento">Equipe protegida.</span>
        </p>
        <p className="lead">
          Laudos, projetos e licenças para empresas, produtores rurais e proprietários de Ibirá e região, presencial e online. Fale direto com o responsável técnico pelo WhatsApp.
        </p>
        <div className="acoes">
          <a className="btn btn-zap btn-grande" href={zap("Olá! Gostaria de solicitar um orçamento.")} target="_blank" rel="noopener noreferrer">
            <Icone nome="fa-brands fa-whatsapp" /> Pedir orçamento
          </a>
          <a className="btn btn-claro btn-grande" href="/o-que-preciso">
            Não sei o que preciso
          </a>
        </div>
        <p className={`status status-fundo ${atendendo ? "on" : ""}`}>
          <Icone nome="fa-solid fa-circle" />{" "}
          {atendendo === null
            ? "Atendimento de segunda a sexta, das 7h às 17h"
            : atendendo
              ? "Atendendo agora. Seg. a sex., das 7h às 17h"
              : "Fora do horário. Respondemos no próximo dia útil (seg. a sex., das 7h às 17h)"}
        </p>
      </HeroFundo>

      <div className="escolhas-cards-wrap" id="servicos">
        <div className="container">
          <h2 className="sr-only">Do que você precisa?</h2>
          <BuscaDocumento className="busca-home" />
          <ol className="escolhas-cards">
            {NECESSIDADES.map((n, i) => {
              const f = FOTOS[n.foto];
              return (
                <li key={n.slug}>
                  <a href={`/${n.slug}`} className="card-area spot">
                    <span className="card-area-foto">
                      <img src={caminho(f)} srcSet={srcset(f)} sizes="(min-width: 1100px) 300px, (min-width: 700px) 50vw, 100vw" width={f.w} height={f.h} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span className="icone-tile card-area-icone">
                      <IconeArea slug={n.slug} tamanho={30} />
                    </span>
                    <span className="card-area-n" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <strong>{n.titulo}</strong>
                    <small>{n.frase}</small>
                    <span className="card-area-seta" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
          <p className="nota-fina escolhas-nota">
            Fotos ilustrativas de terceiros, não são trabalhos da RD. <a href="/creditos">Créditos</a>
          </p>
          <ul className="prova">
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

      <FaixaDocumentos />

      <SecoesNav itens={SECOES_HOME} rotulo="Nesta página" />

      <section className="sec organizamos" id="organizamos" aria-labelledby="org-t">
        <div className="container organizamos-grade">
          <div>
            <header className="sec-cab rev">
              <p className="sec-n">
                <span>01</span> O que organizamos
              </p>
              <h2 id="org-t" className="sec-titulo">
                Seus documentos e vencimentos, em um só lugar.
              </h2>
            </header>
            <p className="lead rev">
              Montamos a lista do que o seu caso exige, elaboramos os documentos e avisamos pelo WhatsApp antes de cada vencimento.
            </p>
            <div className="acoes rev">
              <a className="btn btn-sec btn-grande" href="/o-que-preciso">
                Descubra o que o seu caso precisa
              </a>
              <a className="link-seta" href="/lembrete-de-vencimento">
                Pedir o lembrete de vencimento <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="rev">
            <PainelExemplo />
          </div>
        </div>
      </section>

      <FaixaNumeros />

      <ExemplosHome />

      <section className="sec" id="como-funciona" aria-labelledby="como-t">
        <div className="container">
          <header className="sec-cab rev">
            <p className="sec-n">
              <span>03</span> Como funciona
            </p>
            <h2 id="como-t" className="sec-titulo">
              Quatro passos, sem surpresa.
            </h2>
          </header>
          <PilhaEtapas
            etapas={ETAPAS}
            acaoPrimeira={
              <a className="btn btn-zap btn-peq" href={zap("Olá! Gostaria de solicitar um orçamento.")} target="_blank" rel="noopener noreferrer">
                <Icone nome="fa-brands fa-whatsapp" /> Começar agora
              </a>
            }
          />
        </div>
      </section>

      <Avaliacoes />

      <section className="sec" id="quem-somos" aria-labelledby="quem-t">
        <div className="container">
          <header className="sec-cab rev">
            <p className="sec-n">
              <span>04</span> Quem somos
            </p>
            <h2 id="quem-t" className="sec-titulo">
              Quem responde pelo seu serviço.
            </h2>
            <p className="lead">
              A RD Engenharia é uma empresa familiar de Ibirá. Todo serviço é assinado por profissional habilitado no
              CREA-SP, e você conversa direto com quem vai executar.
            </p>
          </header>
          <div className="pessoas">
            <article className="rev spot">
              <span className="pessoa-sigla" aria-hidden="true">
                RA
              </span>
              <h3>Rafael Antonio Dias</h3>
              <p className="pessoa-cargo">
                Engenheiro civil e ambiental · Especialista em segurança do trabalho · CREA-SP 5071022821
              </p>
              <p className="pessoa-resumo">
                {FORMACAO.length} formações, entre bacharelados, pós-graduações e curso técnico.
              </p>
              <div className="pessoa-acoes">
                <button type="button" className="btn btn-sec" onClick={() => setFormacao(true)} aria-haspopup="dialog">
                  Ver formação completa
                </button>
                <a
                  className="btn btn-sec"
                  href={zap("Olá Rafael! Gostaria de solicitar um orçamento.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icone nome="fa-brands fa-whatsapp" /> (17) 99721-1208
                </a>
              </div>
              <Janela aberta={formacao} aoFechar={() => setFormacao(false)} titulo="Rafael Antonio Dias">
                <p className="pessoa-cargo">
                  Engenheiro civil e ambiental · Especialista em segurança do trabalho · CREA-SP 5071022821
                </p>
                <ul className="pessoa-formacao">
                  {FORMACAO.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="pessoa-extra">Também corretor de imóveis e perito grafotécnico.</p>
              </Janela>
            </article>
            <article className="rev spot">
              <span className="pessoa-sigla" aria-hidden="true">
                RF
              </span>
              <h3>Rafael Antonio Dias Filho</h3>
              <p className="pessoa-cargo">Técnico em edificações · Projetos e atendimento</p>
              <a
                className="btn btn-sec"
                href="https://wa.me/5517996590330?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icone nome="fa-brands fa-whatsapp" /> (17) 99659-0330
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="sec sec-alt" id="duvidas" aria-labelledby="duvidas-t">
        <div className="container">
          <header className="sec-cab rev">
            <p className="sec-n">
              <span>05</span> Dúvidas
            </p>
            <h2 id="duvidas-t" className="sec-titulo">
              Dúvidas frequentes.
            </h2>
          </header>
          <Perguntas itens={FAQ} />
        </div>
      </section>

      {/* Contato e "onde atendemos" num bloco só: endereço, horário e região aparecem aqui uma vez
          (o selo do topo e o rodapé são os outros lugares fixos). O fundo de curvas de nível veio junto. */}
      <section className="bloco-escuro sec-topo" id="contato" aria-labelledby="contato-t">
        <TopoField className="sec-topo-campo contato-topo" grid={0} lines={0.4} />
        <div className="container contato-grade">
          <div>
            <p className="sec-n">
              <span>06</span> Contato
            </p>
            <h2 id="contato-t" className="sec-titulo">
              Peça seu orçamento.
            </h2>
            <p className="contato-texto">
              Preencha e continue no WhatsApp. A mensagem já vai pronta, sem compromisso.
            </p>
            <dl className="contato-dados">
              <div>
                <dt>Escritório</dt>
                <dd>
                  {ENDERECO}
                  <span className="contato-links">
                    <a href={URL_COMO_CHEGAR} target="_blank" rel="noopener noreferrer">
                      Como chegar
                    </a>
                    <button
                      type="button"
                      className="contato-mapa-botao"
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
                    <figure id="contato-mapa" className="onde-mapa">
                      <div className="mapa-caixa">
                        {!mapaPronto && <p className="onde-mapa-carregando">Carregando o mapa…</p>}
                        <iframe
                          title="Mapa com a localização da RD Engenharia em Ibirá/SP"
                          src={MAPA_EMBED}
                          referrerPolicy="no-referrer"
                          allowFullScreen
                          onLoad={() => setMapaPronto(true)}
                          className={mapaPronto ? "pronto" : ""}
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

          <form className="formulario" onSubmit={enviar}>
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
            <button className="btn btn-zap btn-grande" type="submit">
              <Icone nome="fa-brands fa-whatsapp" /> Continuar no WhatsApp
            </button>
          </form>
        </div>
      </section>
    </Casca>
  );
}
