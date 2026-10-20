import Icone from "./Icone";
import { useEffect, useState } from "react";
import { FAQ } from "./faq";
import { AREAS, URL_AVALIACOES_GOOGLE, NOTA_GOOGLE } from "./paginas";
import { Casca, SecoesNav, zap } from "./Layout";
import ExemplosHome from "./ExemplosHome";
import Foto from "./Foto";

const NECESSIDADES = [
  {
    slug: "seguranca-do-trabalho",
    titulo: "Segurança do trabalho",
    frase: "Tenho funcionários e preciso de PGR, laudos ou treinamentos.",
  },
  {
    slug: "corpo-de-bombeiros",
    titulo: "Corpo de Bombeiros",
    frase: "Preciso de AVCB ou CLCB para o meu imóvel ou comércio.",
  },
  {
    slug: "engenharia-civil",
    titulo: "Engenharia civil",
    frase: "Vou construir, reformar ou regularizar um imóvel.",
  },
  {
    slug: "meio-ambiente-topografia",
    titulo: "Meio ambiente e topografia",
    frase: "Tenho imóvel rural e preciso de CAR, georreferenciamento ou topografia.",
  },
];

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
  { id: "na-pratica", rotulo: "Na prática" },
  { id: "como-funciona", rotulo: "Como funciona" },
  { id: "onde-atendemos", rotulo: "Onde atendemos" },
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
  const [atendendo, setAtendendo] = useState(false);
  const [pedido, setPedido] = useState({ nome: "", cidade: "", servico: "", mensagem: "" });

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
      <header className="heroi">
        <div className="container">
          <p className="eyebrow">RD Engenharia · Ibirá/SP</p>
          <h1 className="display">
            Engenharia, segurança do trabalho e meio ambiente para a nossa região.
          </h1>
          <div className="heroi-baixo">
            <p className="lead">
              Laudos, projetos e licenças para empresas, produtores rurais e proprietários de Ibirá e região, presencial e online. Fale direto com o responsável técnico pelo WhatsApp.
            </p>
            <div>
              <div className="acoes">
                <a
                  className="btn btn-zap btn-grande"
                  href={zap("Olá! Gostaria de solicitar um orçamento.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icone nome="fa-brands fa-whatsapp" /> Pedir orçamento
                </a>
                <a className="btn btn-sec btn-grande" href="/o-que-preciso">
                  Não sei o que preciso
                </a>
              </div>
              <p className={`status ${atendendo ? "on" : ""}`}>
                <Icone nome="fa-solid fa-circle" />{" "}
                {atendendo
                  ? "Atendendo agora. Seg. a sex., das 7h às 17h"
                  : "Fora do horário. Respondemos no próximo dia útil (seg. a sex., das 7h às 17h)"}
              </p>
            </div>
          </div>
          <div className="escolhas-bloco" id="servicos">
            <h2 className="escolhas-t">Do que você precisa?</h2>
            <ol className="escolhas">
              {NECESSIDADES.map((n, i) => (
                <li key={n.slug}>
                  <a href={`/${n.slug}`}>
                    <span className="escolha-n" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <span className="escolha-texto">
                      <strong>{n.titulo}</strong>
                      <small>{n.frase}</small>
                    </span>
                    <span className="escolha-seta" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
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
              <strong>Desde 2017</strong>
              <span>CNPJ ativo desde 29/05/2017, em Ibirá/SP</span>
            </li>
          </ul>
        </div>
      </header>

      <div className="faixa-foto">
        <div className="container">
          <Foto slot="home-hero" sizes="(min-width: 1200px) 1120px, 100vw" className="hero-largo hero-home" aspecto="16 / 8" />
        </div>
      </div>

      <SecoesNav itens={SECOES_HOME} rotulo="Nesta página" />

      <ExemplosHome />

      <section className="sec" id="como-funciona" aria-labelledby="como-t">
        <div className="container">
          <header className="sec-cab rev">
            <p className="sec-n">
              <span>02</span> Como funciona
            </p>
            <h2 id="como-t" className="sec-titulo">
              Quatro passos, sem surpresa.
            </h2>
          </header>
          <ol className="etapas-ed">
            {ETAPAS.map((e, i) => (
              <li key={e.titulo} className="rev">
                <span className="etapa-big" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{e.titulo}</h3>
                <p>{e.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec sec-alt" id="onde-atendemos" aria-labelledby="onde-t">
        <div className="container">
          <header className="sec-cab rev">
            <p className="sec-n">
              <span>03</span> Onde atendemos
            </p>
            <h2 id="onde-t" className="sec-titulo">
              Atendemos presencialmente e online em Ibirá e região.
            </h2>
            <p className="lead">Conte onde fica o seu imóvel ou a sua empresa pelo WhatsApp e confirmamos o atendimento.</p>
          </header>
          <div className="acoes rev">
            <a className="btn btn-sec btn-grande" href="/onde-atendemos">
              Ver onde atendemos
            </a>
          </div>
        </div>
      </section>

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
          <p className="numeros rev">
            <span>
              <strong>10+</strong> anos de experiência
            </span>
            <span>
              <strong>200+</strong> documentos técnicos
            </span>
            <span>
              <strong>30+</strong> projetos
            </span>
          </p>
          <div className="pessoas">
            <article className="rev">
              <h3>Rafael Antonio Dias</h3>
              <p className="pessoa-cargo">
                Engenheiro civil e ambiental · Especialista em segurança do trabalho · CREA-SP 5071022821
              </p>
              <ul>
                {FORMACAO.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="pessoa-extra">Também corretor de imóveis e perito grafotécnico.</p>
              <a
                className="btn btn-sec"
                href={zap("Olá Rafael! Gostaria de solicitar um orçamento.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icone nome="fa-brands fa-whatsapp" /> (17) 99721-1208
              </a>
            </article>
            <article className="rev">
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
          <div className="faq-lista rev">
            {FAQ.map((item) => (
              <details className="faq-item" key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bloco-escuro" id="contato" aria-labelledby="contato-t">
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
                <dt>Endereço</dt>
                <dd>
                  Rua José Alves de Mello, 770, Centro, Ibirá/SP{" "}
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Rua+Jos%C3%A9+Alves+de+Mello+770+Ibir%C3%A1+SP"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver no mapa
                  </a>
                </dd>
              </div>
              <div>
                <dt>Atendimento</dt>
                <dd>Segunda a sexta, das 7h às 17h</dd>
              </div>
              <div>
                <dt>Onde atendemos</dt>
                <dd>
                  Presencialmente e online em Ibirá e região.
                  <a href="/onde-atendemos">Ver onde atendemos</a>
                </dd>
              </div>
              <div>
                <dt>Avaliações</dt>
                <dd>
                  <a href={URL_AVALIACOES_GOOGLE} target="_blank" rel="noopener noreferrer">
                    {NOTA_GOOGLE}
                  </a>
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
