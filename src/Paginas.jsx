import Icone from "./Icone";
import { useEffect, useRef, useState } from "react";
import { AREAS, GUIAS, slidesProjetos, EQUIPAMENTOS, NOTA_EQUIPAMENTOS, VISUAL, FOTO_RESPONSAVEL, DOCUMENTOS_LEMBRETE, DICAS_LEMBRETE, URL_AVALIACOES_GOOGLE, URL_COMO_CHEGAR, MAPA_EMBED, ENDERECO, COMPARATIVO_BOMBEIROS, RESUMOS_GUIAS, achaArea } from "./paginas";
import { Casca, Migalha, SecoesNav, Final, BotaoZap, zap } from "./Layout";
import { ComoLerPrancha, Ilustracao } from "./Ilustracoes";
import { enviarLembrete } from "./publico/api";
import Carrossel from "./Carrossel";
import Assistente from "./Assistente";
import DocsIlustracao, { FolhaLeitura, FolhaSvg, LEGENDA_EXEMPLO } from "./DocsIlustracao";
import HeroFundo from "./HeroFundo";
import IconeArea from "./Icones";
import { slidesDe, FOTOS_EM_USO, caminho, srcset } from "./fotos";
import { ancora } from "./Busca";
import Perguntas from "./Perguntas";
import Janela from "./Janela";
import MontarPedido from "./MontarPedido";
import { AnimatedFolder } from "@/components/ui/3d-folder";

// Bloco que no celular começa recolhido (com um botão para abrir) e no computador fica sempre aberto.
// Vem aberto no HTML (bom para o Google e para quem não tem JavaScript); fecha depois de montar se a tela é estreita.
function Recolhivel({ rotulo, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.matchMedia && window.matchMedia("(max-width: 700px)").matches) ref.current.open = false;
  }, []);
  return (
    <details ref={ref} className="recolhe" open>
      <summary>
        <span>{rotulo}</span>
      </summary>
      {children}
    </details>
  );
}

// AVCB x CLCB lado a lado. No celular, cada linha vira um bloco com as duas colunas lado a lado.
function Comparativo() {
  const c = COMPARATIVO_BOMBEIROS;
  return (
    <div className="comparativo rev" id="avcb-ou-clcb">
      <h3>AVCB ou CLCB: lado a lado</h3>
      <div className="comparativo-rolar">
        <table>
          <caption className="sr-only">Comparação entre AVCB e CLCB</caption>
          <thead>
            <tr>
              <td />
              {c.colunas.map((col) => (
                <th key={col.sigla} scope="col">
                  <strong>{col.sigla}</strong>
                  <small>{col.nome}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.linhas.map((l) => (
              <tr key={l.t}>
                <th scope="row">{l.t}</th>
                {l.v.map((v, n) => (
                  <td key={c.colunas[n].sigla} data-col={c.colunas[n].sigla}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="nota-fina">{c.nota}</p>
      <div className="acoes">
        <BotaoZap texto={c.zap} rotulo="Descobrir qual é o meu caso" />
      </div>
    </div>
  );
}

const pad = (n) => String(n + 1).padStart(2, "0");

// Cabeçalho de seção: número, rótulo, título grande e frase de apoio.
function Secao({ id, n, rotulo, titulo, lead, className = "", children }) {
  return (
    <section className={`sec ${className}`} id={id} aria-labelledby={`${id}-t`}>
      <div className="container">
        <header className="sec-cab rev">
          <p className="sec-n">
            <span>{n}</span> {rotulo}
          </p>
          <h2 id={`${id}-t`} className="sec-titulo">
            {titulo}
          </h2>
          {lead && <p className="lead">{lead}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}

// Abertura das páginas internas simples (guias, quiz, lembrete, privacidade, créditos).
function Topo({ migalha, eyebrow, titulo, texto, children }) {
  return (
    <header className="hero-int">
      <div className="container">
        <Migalha itens={migalha} />
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="display-m">{titulo}</h1>
        {texto && <p className="lead">{texto}</p>}
        {children}
      </div>
    </header>
  );
}

const REL_GERAL = {
  quiz: { href: "/o-que-preciso", tag: "Passo a passo", titulo: "Descubra o que o seu caso precisa", texto: "Responda uma pergunta por vez e veja o que costuma ser exigido no seu caso." },
  guias: { href: "/guias", tag: "Guias", titulo: "Guias em linguagem simples", texto: "Explicações curtas sobre PGR, AVCB, CAR, habite-se e outros documentos." },
  lembrete: { href: "/lembrete-de-vencimento", tag: "Lembrete", titulo: "Lembrete de vencimento", texto: "Receba um aviso no WhatsApp antes de o documento vencer." },
};
const relArea = (a) => ({ href: `/${a.slug}`, tag: "Serviço", titulo: a.nome, texto: a.curto, area: a.slug });
const relGuia = (g) => ({ href: `/${g.slug}`, tag: "Guia", titulo: g.h1 });

function Exemplos() {
  return (
    <div>
      <Carrossel
        itens={slidesProjetos()}
        rotulo="Desenhos de projetos reais de residências"
        aspecto="4 / 3"
        className="car-projetos"
      />
      <p className="nota-fina">
        Projetos arquitetônicos reais, com os dados dos clientes retirados e marca d'água. Toque ou clique numa imagem
        para ampliar.
      </p>
      <ComoLerPrancha />
      <div className="acoes">
        <BotaoZap texto="Olá! Vi os exemplos de projeto no site e gostaria de um projeto para a minha obra." rotulo="Quero um projeto assim" />
      </div>
    </div>
  );
}

function PaginaArea({ pagina }) {
  const visual = VISUAL[pagina.slug];
  const guias = GUIAS.filter((g) => g.area === pagina.slug);
  const outras = AREAS.filter((a) => a.slug !== pagina.slug);
  const relacionadas = [...guias.slice(0, 2).map(relGuia), ...outras.map(relArea)].slice(0, 3);
  const zapArea = `Olá! Gostaria de um orçamento na área de ${pagina.nome}.`;
  const civil = pagina.slug === "engenharia-civil";
  const equip = EQUIPAMENTOS[pagina.slug];
  const temFotosEquip = slidesDe(`equip-${pagina.slug}`).length > 0;
  // Numeração das seções na ordem em que aparecem (01, 02, ...), sem números fixos.
  let secoes = 0;
  const num = () => pad(secoes++);

  return (
    <>
      <div className="container migalha-sobre-hero">
        <Migalha itens={[{ rotulo: "Serviços", href: "/#servicos" }, { rotulo: pagina.nome }]} />
      </div>
      <HeroFundo chave={`area-${pagina.slug}`} rotulo={`Fotos ilustrativas da área de ${pagina.nome}`} className="hero-area-fundo">
        <p className="eyebrow eyebrow-icone">
          <IconeArea slug={pagina.slug} tamanho={22} /> Serviço
        </p>
        <h1 className="display">{pagina.h1}</h1>
        <p className="lead">{pagina.intro}</p>
        <div className="acoes">
          <BotaoZap className="btn-grande" texto={zapArea} rotulo="Pedir orçamento" />
          <small>Prazo e valor são informados no orçamento, depois de conhecermos o seu caso.</small>
        </div>
      </HeroFundo>

      <SecoesNav
        itens={[
          { id: "situacoes", rotulo: "Situações comuns" },
          { id: "o-que-fazemos", rotulo: "Serviços" },
          { id: "equipamentos", rotulo: "Equipamentos" },
          { id: "na-pratica", rotulo: "Na prática" },
          { id: "atendimento", rotulo: "Atendimento" },
          { id: "duvidas", rotulo: "Dúvidas" },
          { id: "proximo-passo", rotulo: "Próximo passo" },
        ]}
      />

      {visual && (
        <section className="resumo-ed" aria-label="Resumo">
          <div className="container resumo-ed-grade">
            <div className="rev">
              <p className="rotulo-mini">Para quem</p>
              <p>{visual.quem}</p>
            </div>
            <div className="rev">
              <p className="rotulo-mini">Você recebe</p>
              <p>{visual.recebe}</p>
            </div>
            <div className="assina rev">
              <p className="rotulo-mini">Quem assina</p>
              <div className="assina-linha">
                {FOTO_RESPONSAVEL ? (
                  <img src={FOTO_RESPONSAVEL} width="56" height="56" alt="Rafael Antonio Dias" />
                ) : (
                  <span className="assina-sigla" aria-hidden="true">
                    RD
                  </span>
                )}
                <p>
                  <strong>Rafael Antonio Dias</strong>
                  <span>Engenheiro civil e ambiental · CREA-SP 5071022821</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {pagina.situacoes && (
        <Secao id="situacoes" n={num()} rotulo="Situações comuns" titulo="Você se reconhece em alguma destas?">
          <ul className="situacoes-lista">
            {pagina.situacoes.map((t) => (
              <li key={t} className="rev spot">
                <IconeArea slug={pagina.slug} tamanho={26} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="situacoes-ajuda rev">
            Não tem certeza de qual é o seu caso? <a href="/o-que-preciso">Responda ao passo a passo</a> ou{" "}
            <a href={zap(zapArea)} target="_blank" rel="noopener noreferrer">
              conte pelo WhatsApp
            </a>
            .
          </p>
        </Secao>
      )}

      {/* Serviços e documentos juntos: cada cartão traz a folha de exemplo do que o cliente recebe.
          Antes eram duas seções que repetiam a mesma lista de serviços. */}
      <Secao
        id="o-que-fazemos"
        n={num()}
        rotulo="Serviços"
        titulo={<>O que fazemos nesta área.</>}
        lead="Cada cartão mostra uma folha de exemplo do documento que você recebe."
      >
        {/* Pasta com as folhas de exemplo em tamanho de leitura (no cartão elas ficam pequenas). */}
        <div className="pasta-faixa rev">
          <AnimatedFolder
            title="Documentos de exemplo"
            countLabel={(n) => `${n} folhas desta área`}
            items={pagina.itens
              .filter((item) => item.exemplo)
              .map((item) => ({
                id: ancora(item.nome),
                title: item.nome,
                short: item.nome.split(/ — | \(/)[0],
                media: <FolhaSvg m={item.exemplo} nome={item.nome} area={pagina.slug} />,
                expanded: <FolhaLeitura m={item.exemplo} nome={item.nome} area={pagina.slug} />,
                caption: LEGENDA_EXEMPLO,
                action: { label: "Pedir orçamento pelo WhatsApp", href: zap(`Olá! Gostaria de um orçamento para: ${item.nome}.`) },
              }))}
          />
          <div className="pasta-faixa-texto">
            <h3>Veja cada documento em tamanho de leitura.</h3>
            <p>
              Abra a pasta e escolha uma folha. Dá para ampliar, ver uma página interna e, em “Como ler”, entender cada
              parte do documento. Depois, peça o orçamento daquele documento direto pelo WhatsApp.
            </p>
            <p className="nota-fina">{LEGENDA_EXEMPLO} Não há dados de clientes.</p>
          </div>
        </div>
        <ol className="servicos-grade">
          {pagina.itens.map((item, n) => (
            <li className="servico-cartao rev spot" key={item.nome} id={ancora(item.nome)}>
              {item.exemplo && (
                <div className="servico-folha" aria-hidden="true">
                  <FolhaSvg m={item.exemplo} nome={item.nome} area={pagina.slug} />
                </div>
              )}
              <div className="servico-corpo">
                <span className="servico-n">{pad(n)}</span>
                <h3>{item.nome}</h3>
                <p>{item.texto}</p>
                <p className="item-quem">
                  <strong>Para quem:</strong> {item.quem}
                </p>
                <a
                  className="btn btn-sec btn-peq"
                  href={zap(`Olá! Gostaria de um orçamento para: ${item.nome}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icone nome="fa-brands fa-whatsapp" /> Pedir orçamento
                </a>
              </div>
            </li>
          ))}
        </ol>
        <p className="nota-fina">As folhas são exemplos ilustrativos, não são documentos reais.</p>
        {pagina.itens.length > 1 && <MontarPedido area={pagina.nome} itens={pagina.itens} />}
        {pagina.slug === "corpo-de-bombeiros" && <Comparativo />}
      </Secao>

      {equip && (
        <Secao id="equipamentos" n={num()} rotulo="Equipamentos" titulo="Equipamentos que podem ser usados." className="sec-alt">
          <Recolhivel rotulo="Ver os equipamentos">
          <div className="equip">
            <p className="lead equip-lead rev">{equip.texto}</p>
            {temFotosEquip && (
              <div className="rev">
                <Carrossel
                  chave={`equip-${pagina.slug}`}
                  rotulo={`Equipamentos de referência usados em serviços de ${pagina.nome}`}
                  aspecto="4 / 3"
                  className="car-prateleira"
                  auto={false}
                  sizes="(min-width: 900px) 340px, 78vw"
                />
              </div>
            )}
            <ul className="equip-lista rev">
              {equip.itens.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <p className="nota-fina equip-nota">{NOTA_EQUIPAMENTOS}</p>
          </Recolhivel>
        </Secao>
      )}

      <Secao
        id="na-pratica"
        n={num()}
        rotulo="Na prática"
        titulo={civil ? "Projetos reais, com os dados dos clientes retirados." : "Veja como isso aparece no papel."}
        lead={civil ? undefined : "Exemplos ilustrativos para você entender o que entregamos."}
      >
        <Recolhivel rotulo={civil ? "Ver os projetos" : "Ver os exemplos"}>{civil ? <Exemplos /> : <Ilustracao slug={pagina.slug} />}</Recolhivel>
      </Secao>

      <Secao id="atendimento" n={num()} rotulo="Atendimento" titulo="Do primeiro contato à entrega." lead="Veja o caminho e o que ter em mãos para agilizar o orçamento." className="sec-alt">
        {visual && (
          <ol className="etapas-ed linha-tempo rev">
            {visual.etapas.map((e, n) => (
              <li key={e.t} className="rev">
                <span className="etapa-big" aria-hidden="true">
                  {n + 1}
                </span>
                <h3>{e.t}</h3>
                <p>{e.d}</p>
                {n === 0 && (
                  <a className="btn btn-zap btn-peq" href={zap(zapArea)} target="_blank" rel="noopener noreferrer">
                    <Icone nome="fa-brands fa-whatsapp" /> Começar agora
                  </a>
                )}
              </li>
            ))}
          </ol>
        )}
        <div className="separe rev">
          <div className="separe-grade">
            <div className="separe-texto">
              <h3>Para agilizar, separe</h3>
              <ul className="lista-docs">
                {pagina.documentos.map((d) => (
                  <li key={d}>
                    <Icone nome="fa-solid fa-circle-check" /> {d}
                  </li>
                ))}
              </ul>
              <p className="aviso-lembrete">
                <Icone nome="fa-solid fa-bell" /> Pode pedir também o nosso lembrete de vencimento, para não perder o prazo
                de renovação dos documentos. <a href="/lembrete-de-vencimento">Pedir o lembrete</a>.
              </p>
              <a
                className="btn btn-sec nao-imprime"
                href={`/imprimir/${pagina.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir a lista para imprimir ou salvar em PDF
              </a>
            </div>
            <DocsIlustracao slug={pagina.slug} />
          </div>
        </div>
      </Secao>

      <Secao id="duvidas" n={num()} rotulo="Dúvidas" titulo="Perguntas frequentes.">
        <Perguntas itens={pagina.faq} />
      </Secao>

      <Final zapTexto={zapArea} relacionadas={relacionadas} />
    </>
  );
}

function PaginaGuia({ pagina }) {
  const area = achaArea(pagina.area);
  const outrosGuias = GUIAS.filter((g) => g.area === pagina.area && g.slug !== pagina.slug);
  const relacionadas = [area && relArea(area), ...outrosGuias.slice(0, 1).map(relGuia), REL_GERAL.quiz].filter(Boolean);
  return (
    <>
      <Topo migalha={[{ rotulo: "Guias", href: "/guias" }, { rotulo: pagina.h1 }]} eyebrow={area ? `Guia · ${area.nome}` : "Guia"} titulo={pagina.h1} />
      <section className="sec artigo-sec" id="guia" aria-label="Texto do guia">
        <div className="container container-leitura artigo">
          {RESUMOS_GUIAS[pagina.slug] && (
            <aside className="resumo-guia" aria-label="Em resumo">
              <p className="rotulo-mini">Em resumo</p>
              <ul>
                {RESUMOS_GUIAS[pagina.slug].map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </aside>
          )}
          {pagina.paragrafos.map((p, n) => (
            <p key={p.slice(0, 40)} className={n === 0 ? "artigo-abre" : ""}>
              {p}
            </p>
          ))}
          {pagina.slug === "guias/avcb-ou-clcb-qual-a-diferenca" && <Comparativo />}
        </div>
      </section>
      <section className="sec-fina" id="aviso" aria-label="Aviso">
        <div className="container container-leitura">
          <p className="aviso-guia">
            Este guia tem caráter informativo e reflete a legislação conhecida em 2026. As regras podem mudar, e por isso
            confirmamos a norma vigente em cada caso.
          </p>
          {area && (
            <p className="mais-links">
              Veja todos os serviços de <a href={`/${area.slug}`}>{area.nome}</a>.
            </p>
          )}
        </div>
      </section>
      <Final
        titulo="Quer isso resolvido para o seu caso?"
        zapTexto={`Olá! Li o guia do site e gostaria de um orçamento para: ${pagina.servico}.`}
        zapRotulo="Pedir orçamento deste serviço"
        relacionadas={relacionadas}
      />
    </>
  );
}

// Guias que valem para todas as áreas (a ART é exigida em serviços das quatro). No índice ficam num grupo
// próprio; o campo `area` do guia continua valendo para a página do guia (migalha e botão do WhatsApp).
const GUIAS_GERAIS = new Set(["guias/o-que-e-art-anotacao-de-responsabilidade-tecnica"]);

function PaginaGuias({ pagina }) {
  const [previa, setPrevia] = useState(null);
  const guiaPrevia = GUIAS.find((g) => g.slug === previa);
  const grupos = [
    { id: "guias-todas", titulo: "Todas as áreas", curto: "Todas as áreas", lista: GUIAS.filter((g) => GUIAS_GERAIS.has(g.slug)) },
    ...AREAS.map((a) => ({
      id: `guias-${a.slug}`,
      titulo: a.nome,
      curto: a.rotulo,
      lista: GUIAS.filter((g) => g.area === a.slug && !GUIAS_GERAIS.has(g.slug)),
    })),
  ].filter((g) => g.lista.length);
  return (
    <>
      <Topo
        migalha={[{ rotulo: "Guias" }]}
        eyebrow="Guias"
        titulo={pagina.h1}
        texto="Explicações curtas e em linguagem simples sobre os documentos mais pedidos."
      />
      <section className="sec-fina" aria-label="Passo a passo">
        <div className="container">
          <a className="banda-passo" href="/o-que-preciso">
            <span>
              <small>Passo a passo</small>
              <strong>Não sabe qual guia ler? Descubra o que o seu caso precisa.</strong>
            </span>
            <i aria-hidden="true">→</i>
          </a>
        </div>
      </section>
      <SecoesNav
        rotulo="Áreas dos guias"
        itens={[...grupos.map((g) => ({ id: g.id, rotulo: g.curto })), { id: "proximo-passo", rotulo: "Próximo passo" }]}
      />
      {grupos.map((grupo, n) => (
        <Secao key={grupo.id} id={grupo.id} n={pad(n)} rotulo="Área" titulo={grupo.titulo} className={n % 2 ? "sec-alt" : ""}>
          <ul className="guia-cards">
            {grupo.lista.map((g, i) => (
              <li className="rev guia-cartao" key={g.slug}>
                <a href={`/${g.slug}`}>
                  <small>{pad(i)}</small>
                  <strong>{g.h1}</strong>
                  <i aria-hidden="true">→</i>
                </a>
                {RESUMOS_GUIAS[g.slug] && (
                  <button type="button" className="guia-resumo-botao" aria-haspopup="dialog" onClick={() => setPrevia(g.slug)}>
                    Ver o resumo<span className="sr-only">: {g.h1}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </Secao>
      ))}
      <Janela aberta={!!guiaPrevia} aoFechar={() => setPrevia(null)} titulo={guiaPrevia ? guiaPrevia.h1 : ""}>
        {guiaPrevia && (
          <>
            <p className="rotulo-mini">Em resumo</p>
            <ul className="janela-lista">
              {RESUMOS_GUIAS[guiaPrevia.slug].map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <a className="btn btn-sec" href={`/${guiaPrevia.slug}`}>
              Ler o guia completo <span aria-hidden="true">→</span>
            </a>
          </>
        )}
      </Janela>
      <Final
        titulo="Não achou o seu caso?"
        zapTexto="Olá! Li os guias do site e tenho uma dúvida."
        relacionadas={[REL_GERAL.quiz, REL_GERAL.lembrete, relArea(AREAS[0])]}
      />
    </>
  );
}

function PaginaQuiz({ pagina }) {
  return (
    <>
      <Topo
        migalha={[{ rotulo: "O que preciso?" }]}
        eyebrow="Passo a passo"
        titulo={pagina.h1}
        texto="Responda uma pergunta por vez. No fim, você vê o que o seu caso provavelmente exige e fala com a gente pelo WhatsApp."
      />
      <section className="sec quiz" aria-label="Perguntas">
        <div className="container container-leitura">
          <Assistente />
        </div>
      </section>
      <Final
        titulo="Prefere conversar direto?"
        zapTexto="Olá! Tenho uma dúvida sobre o que o meu caso precisa."
        relacionadas={[REL_GERAL.guias, REL_GERAL.lembrete, relArea(AREAS[1])]}
      />
    </>
  );
}

function ultimoDiaDoMes(anoMes) {
  const [a, m] = anoMes.split("-").map(Number);
  const d = new Date(Date.UTC(a, m, 0)).getUTCDate();
  return `${anoMes}-${String(d).padStart(2, "0")}`;
}

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function PaginaLembrete({ pagina }) {
  const [f, setF] = useState({ nome: "", whatsapp: "", documento: DOCUMENTOS_LEMBRETE[0], mesNum: "", ano: "", aceite: false, site: "" });
  const [estado, setEstado] = useState("parado");
  const [erro, setErro] = useState("");
  // Anos calculados no navegador (o HTML pré-gerado não fixa o ano da construção do site).
  const [anos, setAnos] = useState([]);
  useEffect(() => {
    const a = new Date().getFullYear();
    setAnos(Array.from({ length: 6 }, (_, i) => String(a + i)));
  }, []);
  const mudar = (campo) => (e) => setF((x) => ({ ...x, [campo]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  // "Mês do vencimento" em duas listas (mês e ano): o campo type="month" não funciona no Safari do computador.
  const mesAno = f.mesNum && f.ano ? `${f.ano}-${f.mesNum}` : "";

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
        vencimento: mesAno ? ultimoDiaDoMes(mesAno) : null,
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
        migalha={[{ rotulo: "Lembrete de vencimento" }]}
        eyebrow="Serviço gratuito"
        titulo={pagina.h1}
        texto="Deixe o seu contato e o vencimento do documento. Avisamos pelo WhatsApp com antecedência, para você renovar sem correria."
      />
      <section className="sec" aria-label="Formulário do lembrete">
        <div className="container lembrete-grade">
          <div>
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
              <fieldset className="doc-opcoes">
                <legend>Qual documento?</legend>
                {DOCUMENTOS_LEMBRETE.map((d) => (
                  <label key={d} className="doc-opcao">
                    <input type="radio" name="documento" value={d} checked={f.documento === d} onChange={mudar("documento")} />
                    <span className="doc-opcao-nome">{d}</span>
                    {f.documento === d && DICAS_LEMBRETE[d] && <small className="dica-doc">{DICAS_LEMBRETE[d]}</small>}
                  </label>
                ))}
              </fieldset>
              <fieldset className="campo-mes">
                <legend>Mês do vencimento (se souber)</legend>
                <div>
                  <select aria-label="Mês" value={f.mesNum} onChange={mudar("mesNum")}>
                    <option value="">Mês</option>
                    {MESES.map((m, i) => (
                      <option key={m} value={String(i + 1).padStart(2, "0")}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select aria-label="Ano" value={f.ano} onChange={mudar("ano")}>
                    <option value="">Ano</option>
                    {anos.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>
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
              <button className="btn btn-zap btn-grande" type="submit" disabled={estado === "enviando"}>
                {estado === "enviando" ? "Enviando..." : "Quero ser avisado"}
              </button>
            </form>
          )}
          </div>
          <aside className="lembrete-como rev" aria-label="Como funciona o lembrete">
            <p className="rotulo-mini">Como funciona</p>
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
            <p className="lembrete-como-nota">
              É gratuito e você pode pedir a exclusão dos seus dados quando quiser. <a href="/privacidade">Política de privacidade</a>.
            </p>
          </aside>
        </div>
      </section>
      <Final
        titulo="Prefere falar com a gente?"
        texto="Conte pelo WhatsApp qual documento você quer acompanhar. O lembrete é gratuito e respondemos no horário de atendimento."
        zapTexto="Olá! Tenho uma dúvida sobre o lembrete de vencimento."
        relacionadas={[REL_GERAL.guias, REL_GERAL.quiz, relArea(AREAS[1])]}
      />
    </>
  );
}

function PaginaPrivacidade() {
  return (
    <>
      <Topo migalha={[{ rotulo: "Privacidade" }]} eyebrow="Transparência" titulo="Política de Privacidade" />
      <section className="sec artigo-sec">
        <div className="container container-leitura artigo">
          <p className="artigo-abre">
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
            RD Engenharia Segurança e Meio Ambiente · Rua José Alves de Mello, 770, Centro, Ibirá/SP · WhatsApp (17)
            99721-1208.
          </p>
        </div>
      </section>
      <Final
        titulo="Dúvida sobre os seus dados?"
        texto="Pergunte pelo WhatsApp. Respondemos no horário de atendimento, de segunda a sexta, das 7h às 17h."
        zapTexto="Olá! Tenho uma dúvida sobre a política de privacidade do site."
        relacionadas={[REL_GERAL.lembrete, REL_GERAL.guias, REL_GERAL.quiz]}
      />
    </>
  );
}

function PaginaCreditos() {
  const grupos = [
    { titulo: "CC0 (Wikimedia Commons)", licenca: "CC0", texto: "Domínio público: uso livre, sem exigência de crédito. Mantemos o autor e a origem por transparência." },
    { titulo: "Domínio público (Wikimedia Commons)", licenca: "Domínio público", texto: "Fotos de um instituto público dos EUA (NIOSH), sem restrição de uso. Mantemos o autor e a origem por transparência." },
    { titulo: "Unsplash License", licenca: "Unsplash License", texto: "Licença própria do Unsplash, que permite uso comercial sem pedir autorização. Não é CC0. Texto completo em", link: { href: "https://unsplash.com/license", rotulo: "unsplash.com/license" } },
  ];
  return (
    <>
      <Topo
        migalha={[{ rotulo: "Créditos das imagens" }]}
        eyebrow="Transparência"
        titulo="Créditos das imagens"
        texto="A RD Engenharia ainda não tem fotos próprias no site. As fotos abaixo são ilustrativas, de terceiros, e não mostram trabalhos da empresa."
      />
      <section className="sec" aria-label="Lista de créditos">
        <div className="container">
          {grupos.map((g) => {
            const lista = FOTOS_EM_USO.filter((f) => f.licenca === g.licenca);
            if (!lista.length) return null;
            return (
              <div key={g.licenca} className="creditos-grupo">
                <h2>{g.titulo}</h2>
                <p className="creditos-nota">
                  {g.texto}
                  {g.link && (
                    <>
                      {" "}
                      <a href={g.link.href} target="_blank" rel="noopener noreferrer">
                        {g.link.rotulo}
                      </a>
                      .
                    </>
                  )}
                </p>
                <ul className="creditos">
                  {lista.map((f) => (
                    <li key={f.arq} className="rev">
                      <img src={caminho(f)} srcSet={srcset(f)} sizes="160px" width={f.w} height={f.h} loading="lazy" alt={f.alt} />
                      <dl>
                        {f.arquivo && (
                          <div>
                            <dt>Arquivo</dt>
                            <dd>{f.arquivo}</dd>
                          </div>
                        )}
                        <div>
                          <dt>Autor</dt>
                          <dd>{f.autor || "Consta na página da foto (não anotado aqui)"}</dd>
                        </div>
                        <div>
                          <dt>Licença</dt>
                          <dd>
                            {f.licencaUrl ? (
                              <a href={f.licencaUrl} target="_blank" rel="noopener noreferrer">
                                {f.licenca}
                              </a>
                            ) : (
                              f.licenca
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt>Página de origem</dt>
                          <dd>
                            <a href={f.fonte} target="_blank" rel="noopener noreferrer">
                              {f.fonteNome}
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
          <div className="container-leitura creditos-outros">
            <h2>Outros materiais</h2>
            <p>
              A marca (logotipo) é da RD Engenharia. Os desenhos de projeto da página de engenharia civil são trabalhos reais da RD, com os dados dos
              clientes retirados. As ilustrações interativas e o modelo de PGR são exemplos inventados, feitos para o
              site. Os ícones são do Font Awesome Free (licença CC BY 4.0) e a fonte é a IBM Plex Sans (licença SIL
              Open Font).
            </p>
          </div>
        </div>
      </section>
      <Final
        titulo="Quer ver o trabalho real?"
        texto="Os desenhos de projeto da página de engenharia civil são da RD. Para outros serviços, conte o seu caso pelo WhatsApp."
        zapTexto="Olá! Gostaria de conhecer melhor o trabalho da RD Engenharia."
        relacionadas={[relArea(AREAS[2]), REL_GERAL.guias, REL_GERAL.quiz]}
      />
    </>
  );
}

function PaginaOnde({ pagina }) {
  const zapOnde = "Olá! Gostaria de saber se vocês atendem o meu endereço.";
  return (
    <>
      <header className="hero-int hero-area">
        <div className="container">
          <Migalha itens={[{ rotulo: "Onde atendemos" }]} />
          <p className="eyebrow">Onde atendemos</p>
          <h1 className="display-m">{pagina.h1}</h1>
          <p className="lead">
            Isso vale para todos os serviços. Conte a sua situação pelo WhatsApp e combinamos a melhor forma de atender você.
          </p>
          <div className="acoes">
            <BotaoZap className="btn-grande" texto={zapOnde} rotulo="Perguntar pelo WhatsApp" />
          </div>
        </div>
      </header>

      {/* Antes esta seção só repetia o título da página; agora explica as duas formas de atendimento. */}
      <Secao id="atendimento-regiao" n="01" rotulo="Formas de atendimento" titulo="Como funciona o atendimento.">
        <ul className="formas-grade">
          <li className="formas-cartao rev spot">
            <p className="rotulo-mini">Presencial</p>
            <h3>No local, quando o serviço exige.</h3>
            <p>Visitas, medições, levantamentos e vistorias no imóvel, na empresa ou na propriedade rural.</p>
          </li>
          <li className="formas-cartao rev spot">
            <p className="rotulo-mini">Online</p>
            <h3>O resto, pelo WhatsApp.</h3>
            <p>Conversa, orçamento, envio de fotos e documentos e acompanhamento, sem precisar sair de casa.</p>
          </li>
          <li className="formas-cartao formas-cartao-destaque rev">
            <p className="rotulo-mini">Seu endereço</p>
            <h3>Não sabe se está na região?</h3>
            <p>Conte onde fica o imóvel ou a empresa e confirmamos o atendimento.</p>
            <BotaoZap texto={zapOnde} rotulo="Perguntar" />
          </li>
        </ul>
      </Secao>

      <section className="sec sec-alt" id="mapa" aria-labelledby="mapa-t">
        <div className="container mapa-grade">
          <div className="rev">
            <p className="sec-n">
              <span>02</span> Onde fica
            </p>
            <h2 id="mapa-t" className="sec-titulo">
              Nosso endereço.
            </h2>
            <p className="lead">{ENDERECO}</p>
            <p className="mapa-horario">Segunda a sexta, das 7h às 17h.</p>
            <div className="acoes">
              <a className="btn btn-zap btn-grande" href={URL_COMO_CHEGAR} target="_blank" rel="noopener noreferrer">
                Como chegar
              </a>
              <a className="btn btn-sec btn-grande" href={URL_AVALIACOES_GOOGLE} target="_blank" rel="noopener noreferrer">
                Ver no Google Maps
              </a>
            </div>
          </div>
          <figure className="mapa rev">
            <div className="mapa-caixa">
              <iframe
                title="Mapa com a localização da RD Engenharia em Ibirá/SP"
                src={MAPA_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer"
                allowFullScreen
              />
            </div>
            <figcaption>O mapa é fornecido pelo Google.</figcaption>
          </figure>
        </div>
      </section>

      <Final
        zapTexto={zapOnde}
        relacionadas={[relArea(AREAS[0]), relArea(AREAS[2]), REL_GERAL.quiz]}
      />
    </>
  );
}

// Página própria para imprimir ou salvar em PDF a lista de documentos de uma área (/imprimir/<área>).
// Sem cabeçalho nem rodapé do site, sem estado: o botão chama window.print() direto. noindex.
export function PaginaImprimir({ area }) {
  const [data, setData] = useState("");
  useEffect(() => {
    setData(new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }));
  }, []);
  return (
    <div className="imprimir">
      <div className="imprimir-barra nao-imprime">
        <a className="btn btn-sec" href={`/${area.slug}#atendimento`}>
          <span aria-hidden="true">←</span> Voltar
        </a>
        <button type="button" className="btn btn-zap" onClick={() => window.print()}>
          Imprimir / Salvar PDF
        </button>
        <p>Para salvar em PDF, escolha "Salvar como PDF" como impressora.</p>
      </div>
      <main className="folha-doc" id="conteudo">
        <header className="fd-topo">
          <img src="/marca/marca-lockup.webp" width="120" height="66" alt="RD Engenharia" />
          <div>
            <p className="fd-empresa">RD Engenharia Segurança e Meio Ambiente</p>
            <p className="fd-data">{data || "\u00a0"}</p>
          </div>
        </header>
        <h1>Lista de documentos necessários</h1>
        <p className="fd-area">Área: {area.nome}</p>
        <ul className="fd-lista">
          {area.documentos.map((d) => (
            <li key={d}>
              <span className="fd-caixa" aria-hidden="true" />
              {d}
            </li>
          ))}
        </ul>
        <p className="fd-nota">Lista de orientação geral. Confirmamos com você o que cada caso realmente exige.</p>
        <footer className="fd-rodape">
          <p>RD IBIRA ENGENHARIA, SEGURANCA E MEIO AMBIENTE LTDA. · CNPJ 27.839.324/0001-74</p>
          <p>
            {ENDERECO} · WhatsApp (17) 99721-1208
          </p>
        </footer>
      </main>
    </div>
  );
}

export default function PaginaView({ pagina }) {
  let corpo = null;
  if (pagina.tipo === "area") corpo = <PaginaArea pagina={pagina} />;
  else if (pagina.tipo === "onde") corpo = <PaginaOnde pagina={pagina} />;
  else if (pagina.tipo === "guia") corpo = <PaginaGuia pagina={pagina} />;
  else if (pagina.tipo === "quiz") corpo = <PaginaQuiz pagina={pagina} />;
  else if (pagina.tipo === "guias-indice") corpo = <PaginaGuias pagina={pagina} />;
  else if (pagina.tipo === "lembrete") corpo = <PaginaLembrete pagina={pagina} />;
  else if (pagina.tipo === "creditos") corpo = <PaginaCreditos />;
  else corpo = <PaginaPrivacidade />;
  return <Casca atual={pagina.slug}>{corpo}</Casca>;
}

export function NaoEncontrada() {
  return (
    <Casca atual="404">
      <section className="nao-encontrada">
        <div className="container">
          <p className="eyebrow">Erro 404</p>
          <h1 className="display-m">Página não encontrada.</h1>
          <p className="lead">O endereço pode ter mudado ou estar digitado errado. Veja por onde seguir:</p>
          <div className="acoes">
            <a className="btn btn-zap btn-grande" href="/">
              Ir para o início
            </a>
            <a className="btn btn-sec btn-grande" href="/guias">
              Ver os guias
            </a>
            <a
              className="btn btn-sec btn-grande"
              href={zap("Olá! Não encontrei o que procurava no site.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Casca>
  );
}
