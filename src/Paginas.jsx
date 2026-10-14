import { useState } from "react";
import { AREAS, GUIAS, PERFIS, RESULTADOS, CIDADES, achaArea } from "./paginas";
import { Casca, zap } from "./Layout";

function Topo({ titulo, texto, migalha }) {
  return (
    <section className="pagina-topo">
      <div className="container">
        <p className="migalha">
          <a href="/">Início</a> / {migalha}
        </p>
        <h1>{titulo}</h1>
        {texto && <p>{texto}</p>}
      </div>
    </section>
  );
}

function BotaoZap({ texto, rotulo }) {
  return (
    <a className="btn btn-zap" href={zap(texto)} target="_blank" rel="noopener noreferrer">
      <i className="fa-brands fa-whatsapp" /> {rotulo}
    </a>
  );
}

function PaginaArea({ pagina }) {
  const outras = AREAS.filter((a) => a.slug !== pagina.slug);
  return (
    <>
      <Topo titulo={pagina.h1} texto={pagina.intro} migalha={pagina.nome} />
      <section className="secao">
        <div className="container">
          <div className="head-secao">
            <h2>
              O que <span>fazemos</span>
            </h2>
          </div>
          <div className="itens-grid">
            {pagina.itens.map((item) => (
              <article className="item-card" key={item.nome}>
                <h3>{item.nome}</h3>
                <p>{item.texto}</p>
                <p className="item-quem">
                  <strong>Para quem:</strong> {item.quem}
                </p>
                <a
                  className="btn btn-sec"
                  href={zap(`Olá! Gostaria de um orçamento para: ${item.nome}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-whatsapp" /> Pedir orçamento
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="secao secao-cinza">
        <div className="container container-faq">
          <div className="head-secao">
            <h2>
              Para agilizar, <span>separe</span>
            </h2>
            <p>Ter estas informações em mãos ajuda a fazermos o orçamento com mais precisão.</p>
          </div>
          <ul className="lista-docs">
            {pagina.documentos.map((d) => (
              <li key={d}>
                <i className="fa-solid fa-circle-check" /> {d}
              </li>
            ))}
          </ul>
          <p className="aviso-lembrete">
            <i className="fa-solid fa-bell" /> Pode pedir também o nosso lembrete de vencimento pelo WhatsApp, para
            não perder o prazo de renovação dos documentos.
          </p>
          <div className="centro">
            <BotaoZap texto={`Olá! Gostaria de um orçamento na área de ${pagina.nome}.`} rotulo="Falar no WhatsApp" />
          </div>
        </div>
      </section>

      <section className="secao">
        <div className="container container-faq">
          <div className="head-secao">
            <h2>
              Dúvidas <span>frequentes</span>
            </h2>
          </div>
          <div className="faq-lista">
            {pagina.faq.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p className="centro mais-links">
            Também pode ajudar: {" "}
            {GUIAS.filter((g) => g.area === pagina.slug).map((g) => (
              <a key={g.slug} href={`/${g.slug}`}>
                {g.h1}
              </a>
            ))}
          </p>
        </div>
      </section>

      <section className="secao secao-cinza">
        <div className="container">
          <div className="head-secao">
            <h2>
              Outras <span>áreas</span>
            </h2>
          </div>
          <div className="areas-grid">
            {outras.map((a) => (
              <a className="area-card" key={a.slug} href={`/${a.slug}`}>
                <i className={a.icone} />
                <h3>{a.nome}</h3>
                <p>{a.curto}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PaginaGuia({ pagina }) {
  const area = achaArea(pagina.area);
  return (
    <>
      <Topo titulo={pagina.h1} migalha="Guia" />
      <section className="secao">
        <div className="container container-faq artigo">
          {pagina.paragrafos.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          <p className="aviso-guia">
            Este guia tem caráter informativo e reflete a legislação conhecida em 2026. As regras podem mudar, e por
            isso confirmamos a norma vigente em cada caso.
          </p>
          <div className="centro">
            <BotaoZap
              texto={`Olá! Li o guia do site e gostaria de um orçamento para: ${pagina.servico}.`}
              rotulo="Pedir orçamento deste serviço"
            />
          </div>
          {area && (
            <p className="centro mais-links">
              Veja todos os serviços de <a href={`/${area.slug}`}>{area.nome}</a>.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

function PaginaQuiz({ pagina }) {
  const [perfilId, setPerfilId] = useState("");
  const [marcadas, setMarcadas] = useState({});
  const [cidade, setCidade] = useState("");
  const perfil = PERFIS.find((p) => p.id === perfilId);

  const escolher = (id) => {
    setPerfilId(id);
    setMarcadas({});
  };
  const alternar = (indice) => setMarcadas((m) => ({ ...m, [indice]: !m[indice] }));

  const ids = [];
  if (perfil) {
    perfil.situacoes.forEach((s, i) => {
      if (marcadas[i]) s.itens.forEach((id) => !ids.includes(id) && ids.push(id));
    });
  }
  const resultados = ids.map((id) => ({ id, ...RESULTADOS[id] }));
  const mensagem = [
    "Olá! Fiz o guia do site e acho que preciso de:",
    ...resultados.map((r) => `- ${r.nome}`),
    cidade.trim() ? `Cidade: ${cidade.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <Topo
        titulo={pagina.h1}
        texto="Responda em menos de um minuto. O guia mostra o que o seu caso provavelmente exige, e depois você fala com a gente pelo WhatsApp."
        migalha="O que preciso?"
      />
      <section className="secao">
        <div className="container container-faq">
          <h2 className="quiz-passo">1. Qual é a sua situação?</h2>
          <div className="perfis">
            {PERFIS.map((p) => (
              <button
                type="button"
                key={p.id}
                className={`perfil ${perfilId === p.id ? "ativo" : ""}`}
                aria-pressed={perfilId === p.id}
                onClick={() => escolher(p.id)}
              >
                <i className={p.icone} />
                {p.nome}
              </button>
            ))}
          </div>

          {perfil && (
            <>
              <h2 className="quiz-passo">2. Marque o que se aplica ao seu caso</h2>
              <div className="situacoes">
                {perfil.situacoes.map((s, i) => (
                  <label className="situacao" key={s.texto}>
                    <input type="checkbox" checked={!!marcadas[i]} onChange={() => alternar(i)} />
                    <span>{s.texto}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {resultados.length > 0 && (
            <>
              <h2 className="quiz-passo">3. O que você provavelmente precisa</h2>
              <div className="resultados">
                {resultados.map((r) => (
                  <article className="resultado" key={r.id}>
                    <h3>{r.nome}</h3>
                    <p>{r.texto}</p>
                    <a href={`/${r.area}`}>Ver detalhes</a>
                  </article>
                ))}
              </div>
              <p className="aviso-guia">
                Este resultado é uma orientação inicial e não substitui a análise técnica. Confirmamos o que é
                realmente exigido no seu caso.
              </p>
              <div className="quiz-cidade">
                <label htmlFor="cidade-quiz">Sua cidade (opcional)</label>
                <input
                  id="cidade-quiz"
                  list="cidades-atendidas"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex.: Catanduva"
                />
                <datalist id="cidades-atendidas">
                  {CIDADES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div className="centro">
                <BotaoZap texto={mensagem} rotulo="Enviar para a RD pelo WhatsApp" />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function PaginaPrivacidade() {
  return (
    <>
      <Topo titulo="Política de Privacidade" migalha="Privacidade" />
      <section className="secao">
        <div className="container container-faq artigo">
          <p>
            Esta página explica, de forma simples, como o site da RD Engenharia Segurança e Meio Ambiente trata as
            informações de quem entra em contato.
          </p>
          <h2>Quais dados coletamos</h2>
          <p>
            O site não possui cadastro, login nem banco de dados. Quando você preenche o formulário de orçamento ou usa
            o guia "O que preciso?", as informações digitadas (como nome, cidade e a descrição do serviço) são usadas
            apenas para montar uma mensagem de WhatsApp. Elas são enviadas por você, ao clicar no botão, diretamente
            para o nosso número, e não ficam guardadas no site.
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
            RD Engenharia Segurança e Meio Ambiente · Rua José Alves de Mello, 770, Centro, Ibirá/SP · WhatsApp (17)
            99721-1208.
          </p>
        </div>
      </section>
    </>
  );
}

export default function PaginaView({ pagina }) {
  let corpo = null;
  if (pagina.tipo === "area") corpo = <PaginaArea pagina={pagina} />;
  else if (pagina.tipo === "guia") corpo = <PaginaGuia pagina={pagina} />;
  else if (pagina.tipo === "quiz") corpo = <PaginaQuiz pagina={pagina} />;
  else corpo = <PaginaPrivacidade />;
  return <Casca>{corpo}</Casca>;
}

export function NaoEncontrada() {
  return (
    <Casca>
      <section className="nao-encontrada">
        <div className="container">
          <h1>Página não encontrada</h1>
          <p>O endereço pode ter mudado ou estar digitado errado.</p>
          <a className="btn btn-zap" href="/">
            Ir para o início
          </a>
          <a
            className="btn btn-sec"
            href={zap("Olá! Não encontrei o que procurava no site.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </Casca>
  );
}
