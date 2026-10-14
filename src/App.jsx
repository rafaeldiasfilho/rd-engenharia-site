import Icone from "./Icone";
import { useEffect, useState } from "react";
import { FAQ } from "./faq";
import { AREAS, CIDADES } from "./paginas";
import { Casca, zap } from "./Layout";
import ExemplosHome from "./ExemplosHome";

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
    <Casca>
      <section className="heroi">
        <div className="wrap heroi-grade">
          <div>
            <h1>Engenharia, segurança do trabalho e meio ambiente para a nossa região</h1>
            <p className="heroi-texto">
              Laudos, projetos e licenças para empresas, produtores rurais e proprietários de Ibirá,
              Catanduva, São José do Rio Preto e cidades próximas. Fale direto com o responsável
              técnico pelo WhatsApp.
            </p>
            <div className="heroi-botoes">
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

          <div className="escolha" id="areas">
            <h2>Do que você precisa?</h2>
            <ul>
              {NECESSIDADES.map((n) => (
                <li key={n.slug}>
                  <a href={`/${n.slug}`}>
                    <span>
                      <strong>{n.titulo}</strong>
                      <small>{n.frase}</small>
                    </span>
                    <Icone nome="fa-solid fa-chevron-right" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ExemplosHome />

      <section className="bloco bloco-branco" id="como-funciona">
        <div className="wrap">
          <h2 className="titulo-bloco">Como funciona</h2>
          <ol className="etapas">
            {ETAPAS.map((e, i) => (
              <li key={e.titulo}>
                <span className="etapa-n">{i + 1}</span>
                <h3>{e.titulo}</h3>
                <p>{e.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bloco" id="quem-somos">
        <div className="wrap quem-grade">
          <div>
            <h2 className="titulo-bloco">Quem responde pelo seu serviço</h2>
            <p className="quem-texto">
              A RD Engenharia é uma empresa familiar de Ibirá. Todo serviço é assinado por
              profissional habilitado no CREA-SP, e você conversa direto com quem vai executar.
            </p>
            <p className="numeros">
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
          </div>

          <div className="pessoas">
            <article>
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
            <article>
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

      <section className="bloco bloco-branco" id="duvidas">
        <div className="wrap wrap-estreito">
          <h2 className="titulo-bloco">Dúvidas frequentes</h2>
          <div className="faq-lista">
            {FAQ.map((item) => (
              <details className="faq-item" key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bloco bloco-escuro" id="contato">
        <div className="wrap contato-grade">
          <div>
            <h2 className="titulo-bloco">Peça seu orçamento</h2>
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
                <dt>Regiões atendidas</dt>
                <dd>{CIDADES.join(", ")} e cidades próximas</dd>
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
              <input value={pedido.cidade} onChange={mudar("cidade")} list="cidades-form" />
              <datalist id="cidades-form">
                {CIDADES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
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
