import Icone from "./Icone";
import { useState } from "react";
import { AREAS, GUIAS, PERFIS, RESULTADOS, CIDADES, PROJETOS, VISUAL, FOTO_RESPONSAVEL, STATUS_PROCESSO, DOCUMENTOS_LEMBRETE, achaArea } from "./paginas";
import { Casca, zap } from "./Layout";
import { Ilustracao } from "./Ilustracoes";
import { enviarLembrete, consultarProcesso } from "./publico/api";

function Topo({ titulo, texto, migalha, children }) {
  return (
    <section className="pagina-topo">
      <div className="container">
        <p className="migalha">
          <a href="/">Início</a> / {migalha}
        </p>
        <h1>{titulo}</h1>
        {texto && <p>{texto}</p>}
        {children}
      </div>
    </section>
  );
}

function BotaoZap({ texto, rotulo }) {
  return (
    <a className="btn btn-zap" href={zap(texto)} target="_blank" rel="noopener noreferrer">
      <Icone nome="fa-brands fa-whatsapp" /> {rotulo}
    </a>
  );
}

function Exemplos() {
  const [i, setI] = useState(0);
  const total = PROJETOS.length;
  const projeto = PROJETOS[i];
  const vai = (d) => setI((n) => (n + d + total) % total);
  return (
    <section className="secao" id="exemplos" aria-roledescription="carrossel" aria-label="Exemplos de projeto">
      <div className="container">
        <div className="head-secao">
          <h2>
            Exemplos de <span>projeto</span>
          </h2>
          <p>Projetos arquitetônicos reais, com os dados dos clientes retirados. Toque numa imagem para ampliar.</p>
        </div>
        <div className="exemplos-barra">
          {total > 1 && (
            <button type="button" className="seta" onClick={() => vai(-1)} aria-label="Projeto anterior">
              <Icone nome="fa-solid fa-chevron-left" />
            </button>
          )}
          <div className="exemplos-titulo" aria-live="polite">
            <strong>{projeto.nome}</strong>
            <span>{projeto.resumo}</span>
            {total > 1 && (
              <small>
                Projeto {i + 1} de {total}
              </small>
            )}
          </div>
          {total > 1 && (
            <button type="button" className="seta" onClick={() => vai(1)} aria-label="Próximo projeto">
              <Icone nome="fa-solid fa-chevron-right" />
            </button>
          )}
        </div>
        <div className="exemplos">
          {projeto.itens.map((e) => (
            <figure className={`exemplo ${e.forma ? "exemplo-" + e.forma : ""}`} key={e.arq}>
              <a href={`/exemplos/${projeto.pasta}/${e.arq}.webp`} target="_blank" rel="noopener noreferrer">
                <img
                  src={`/exemplos/${projeto.pasta}/${e.arq}.webp`}
                  width={e.w}
                  height={e.h}
                  loading="lazy"
                  alt={e.alt}
                />
              </a>
              <figcaption>
                <strong>{e.titulo}</strong>
                <span>{e.texto}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="centro">
          <BotaoZap
            texto="Olá! Vi os exemplos de projeto no site e gostaria de um projeto para a minha obra."
            rotulo="Quero um projeto assim"
          />
        </div>
      </div>
    </section>
  );
}

function PaginaArea({ pagina }) {
  const visual = VISUAL[pagina.slug];
  const outras = AREAS.filter((a) => a.slug !== pagina.slug);
  return (
    <>
      <Topo titulo={pagina.h1} texto={pagina.intro} migalha={pagina.nome}>
        {visual && (
          <div className="topo-resumo">
            <dl>
              <div>
                <dt>Para quem</dt>
                <dd>{visual.quem}</dd>
              </div>
              <div>
                <dt>Você recebe</dt>
                <dd>{visual.recebe}</dd>
              </div>
            </dl>
            <div className="topo-acao">
              <BotaoZap texto={`Olá! Gostaria de um orçamento na área de ${pagina.nome}.`} rotulo="Pedir orçamento" />
              <small>Prazo e valor são informados no orçamento, depois de conhecermos o seu caso.</small>
            </div>
            <div className="assina">
              {FOTO_RESPONSAVEL ? (
                <img src={FOTO_RESPONSAVEL} width="56" height="56" alt="Rafael Antonio Dias" />
              ) : (
                <span className="assina-sigla" aria-hidden="true">
                  RD
                </span>
              )}
              <p>
                <strong>Quem assina: Rafael Antonio Dias</strong>
                <span>Engenheiro civil e ambiental · CREA-SP 5071022821</span>
              </p>
            </div>
          </div>
        )}
      </Topo>
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
                  <Icone nome="fa-brands fa-whatsapp" /> Pedir orçamento
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {pagina.slug !== "engenharia-civil" && (
        <section className="secao">
          <div className="container">
            <div className="head-secao">
              <h2>
                Veja na <span>prática</span>
              </h2>
              <p>Exemplos ilustrativos para você entender o que entregamos.</p>
            </div>
            <Ilustracao slug={pagina.slug} />
          </div>
        </section>
      )}

      {pagina.slug === "engenharia-civil" && <Exemplos />}

      <section className="secao secao-cinza" id="atendimento">
        <div className="container">
          <div className="head-secao">
            <h2>
              Do primeiro contato à <span>entrega</span>
            </h2>
            <p>Veja o caminho e o que ter em mãos para agilizar o orçamento.</p>
          </div>
          <div className="atendimento">
            {visual && (
              <ol className="linha-etapas">
                {visual.etapas.map((e, n) => (
                  <li key={e.t}>
                    <span className="etapa-num" aria-hidden="true">
                      {n + 1}
                    </span>
                    <div>
                      <strong>{e.t}</strong>
                      <span>{e.d}</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            <div className="separe">
              <p className="so-impressao">
                RD Engenharia Segurança e Meio Ambiente · WhatsApp (17) 99721-1208 · {pagina.nome}
              </p>
              <h3>Para agilizar, separe</h3>
              <ul className="lista-docs">
                {pagina.documentos.map((d) => (
                  <li key={d}>
                    <Icone nome="fa-solid fa-circle-check" /> {d}
                  </li>
                ))}
              </ul>
              <p className="aviso-lembrete">
                <Icone nome="fa-solid fa-bell" /> Pode pedir também o nosso lembrete de vencimento, para não perder o
                prazo de renovação dos documentos. <a href="/lembrete-de-vencimento">Pedir o lembrete</a>.
              </p>
              <button type="button" className="btn btn-sec nao-imprime" onClick={() => window.print()}>
                Imprimir ou salvar esta lista em PDF
              </button>
            </div>
          </div>
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
                <Icone nome={a.icone} />
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
      <Topo titulo={pagina.h1} migalha={<a href="/guias">Guias</a>} />
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

function PaginaGuias({ pagina }) {
  return (
    <>
      <Topo
        titulo={pagina.h1}
        texto="Explicações curtas e em linguagem simples sobre os documentos mais pedidos."
        migalha="Guias"
      />
      <section className="secao">
        <div className="container">
          <div className="areas-grid">
            {GUIAS.map((g) => (
              <a className="area-card" key={g.slug} href={`/${g.slug}`}>
                <h3>{g.h1}</h3>
                <p>{achaArea(g.area)?.nome}</p>
              </a>
            ))}
          </div>
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
                <Icone nome={p.icone} />
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

function ultimoDiaDoMes(anoMes) {
  const [a, m] = anoMes.split("-").map(Number);
  const d = new Date(Date.UTC(a, m, 0)).getUTCDate();
  return `${anoMes}-${String(d).padStart(2, "0")}`;
}

function PaginaLembrete({ pagina }) {
  const [f, setF] = useState({ nome: "", whatsapp: "", documento: DOCUMENTOS_LEMBRETE[0], mes: "", aceite: false, site: "" });
  const [estado, setEstado] = useState("parado");
  const [erro, setErro] = useState("");
  const mudar = (campo) => (e) => setF((x) => ({ ...x, [campo]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    setErro("");
    if (f.site) return; // campo-armadilha para robôs
    let numero = f.whatsapp.replace(/\D/g, "");
    if (numero.length === 10 || numero.length === 11) numero = "55" + numero;
    if (numero.length < 12 || numero.length > 13) {
      setErro("Confira o número do WhatsApp. Informe o DDD e o número, por exemplo (17) 99999-9999.");
      return;
    }
    if (f.nome.trim().length < 2) {
      setErro("Informe o seu nome.");
      return;
    }
    if (!f.aceite) {
      setErro("Marque a autorização para receber os lembretes.");
      return;
    }
    setEstado("enviando");
    try {
      await enviarLembrete({
        nome: f.nome.trim(),
        whatsapp: numero,
        documento: f.documento,
        vencimento: f.mes ? ultimoDiaDoMes(f.mes) : null,
        consentimento: true,
      });
      setEstado("ok");
    } catch {
      setEstado("parado");
      setErro("Não foi possível enviar agora. Tente de novo ou chame a RD pelo WhatsApp.");
    }
  };

  return (
    <>
      <Topo
        titulo={pagina.h1}
        texto="Deixe o seu contato e o vencimento do documento. Avisamos pelo WhatsApp com antecedência, para você renovar sem correria."
        migalha="Lembrete de vencimento"
      />
      <section className="secao">
        <div className="container container-faq">
          {estado === "ok" ? (
            <div className="aviso-ok" role="status">
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
            <form className="form-publico" onSubmit={enviar} noValidate>
              <label>
                <span>Seu nome</span>
                <input value={f.nome} onChange={mudar("nome")} autoComplete="name" maxLength={120} required />
              </label>
              <label>
                <span>WhatsApp com DDD</span>
                <input
                  value={f.whatsapp}
                  onChange={mudar("whatsapp")}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(17) 99999-9999"
                  required
                />
              </label>
              <label>
                <span>Qual documento?</span>
                <select value={f.documento} onChange={mudar("documento")}>
                  {DOCUMENTOS_LEMBRETE.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Mês do vencimento (se souber)</span>
                <input type="month" value={f.mes} onChange={mudar("mes")} />
              </label>
              <label className="oculto" aria-hidden="true">
                <span>Não preencha este campo</span>
                <input tabIndex={-1} autoComplete="off" value={f.site} onChange={mudar("site")} />
              </label>
              <label className="aceite">
                <input type="checkbox" checked={f.aceite} onChange={mudar("aceite")} />
                <span>
                  Autorizo a RD Engenharia a me enviar lembretes por WhatsApp sobre o vencimento deste documento. Posso
                  pedir a exclusão dos meus dados quando quiser. Veja a <a href="/privacidade">política de privacidade</a>.
                </span>
              </label>
              {erro && (
                <p className="erro-form" role="alert">
                  {erro}
                </p>
              )}
              <button className="btn btn-zap" type="submit" disabled={estado === "enviando"}>
                {estado === "enviando" ? "Enviando..." : "Quero ser avisado"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

const dataHoraBR = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  } catch {
    return "";
  }
};

function PaginaAcompanhe({ pagina }) {
  const [codigo, setCodigo] = useState("");
  const [estado, setEstado] = useState("parado");
  const [proc, setProc] = useState(null);

  const consultar = async (e) => {
    e.preventDefault();
    const c = codigo.trim().toUpperCase();
    if (c.length < 8) {
      setEstado("curto");
      return;
    }
    setEstado("buscando");
    try {
      const r = await consultarProcesso(c);
      setProc(r);
      setEstado(r ? "achou" : "naoachou");
    } catch {
      setEstado("erro");
    }
  };

  const indice = proc ? STATUS_PROCESSO.findIndex(([id]) => id === proc.status) : -1;
  return (
    <>
      <Topo
        titulo={pagina.h1}
        texto="Digite o código que enviamos pelo WhatsApp para ver em que etapa está o seu serviço."
        migalha="Acompanhe"
      />
      <section className="secao">
        <div className="container container-faq">
          <form className="form-publico form-codigo" onSubmit={consultar}>
            <label>
              <span>Código do processo</span>
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                maxLength={8}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="Ex.: K7M2Q9XA"
              />
            </label>
            <button className="btn btn-zap" type="submit" disabled={estado === "buscando"}>
              {estado === "buscando" ? "Consultando..." : "Consultar"}
            </button>
          </form>
          {estado === "curto" && <p className="erro-form">O código tem 8 letras e números.</p>}
          {estado === "erro" && (
            <p className="erro-form">Não foi possível consultar agora. Tente novamente em instantes.</p>
          )}
          {estado === "naoachou" && (
            <p className="erro-form">
              Não encontramos esse código. Confira se digitou igual ao da mensagem ou{" "}
              <a href={zap("Olá! Não consegui consultar o meu processo pelo site.")} target="_blank" rel="noopener noreferrer">
                chame a RD no WhatsApp
              </a>
              .
            </p>
          )}
          {estado === "achou" && proc && (
            <div className="processo" aria-live="polite">
              <h2>{proc.servico_tipo}</h2>
              <ol className="processo-etapas">
                {STATUS_PROCESSO.map(([id, nome], n) => (
                  <li key={id} className={n < indice ? "feito" : n === indice ? "atual" : ""}>
                    <span aria-hidden="true">{n < indice ? "✓" : n + 1}</span>
                    {nome}
                  </li>
                ))}
              </ol>
              {proc.mensagem && <p className="processo-msg">{proc.mensagem}</p>}
              <p className="processo-data">Atualizado em {dataHoraBR(proc.atualizado_em)}</p>
              <BotaoZap
                texto={`Olá! Estou acompanhando o processo ${codigo.trim().toUpperCase()} (${proc.servico_tipo}) e tenho uma dúvida.`}
                rotulo="Tirar dúvida pelo WhatsApp"
              />
            </div>
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
          <h2>Acompanhamento de processo</h2>
          <p>
            Ao consultar um processo pelo código, o site mostra apenas o tipo de serviço, a etapa e uma mensagem
            curta, sem nome, endereço ou documentos. O código é enviado por nós ao cliente.
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
  else if (pagina.tipo === "guias-indice") corpo = <PaginaGuias pagina={pagina} />;
  else if (pagina.tipo === "lembrete") corpo = <PaginaLembrete pagina={pagina} />;
  else if (pagina.tipo === "acompanhe") corpo = <PaginaAcompanhe pagina={pagina} />;
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
