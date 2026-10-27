import Icone from "./Icone";
import IconeArea from "./Icones";
import { useEffect, useMemo, useRef, useState } from "react";
import { LiquidNavbar } from "@/components/ui/liquid-glass-navbar";
import { AREAS, GUIAS, URL_AVALIACOES_GOOGLE, ENDERECO, NOTA_GOOGLE } from "./paginas";
import { zap } from "./contato";
import { BotaoBusca } from "./Busca";

export { WHATSAPP, zap } from "./contato";

export function BotaoZap({ texto, rotulo, className = "" }) {
  return (
    <a className={`btn btn-zap ${className}`} href={zap(texto)} target="_blank" rel="noopener noreferrer">
      <Icone nome="fa-brands fa-whatsapp" /> {rotulo}
    </a>
  );
}

const TEMAS = [
  { id: "auto", rotulo: "Automático" },
  { id: "light", rotulo: "Claro" },
  { id: "dark", rotulo: "Escuro" },
];

function SeletorTema() {
  const [tema, setTema] = useState("auto");

  useEffect(() => {
    try {
      const salvo = localStorage.getItem("tema");
      if (salvo === "light" || salvo === "dark") setTema(salvo);
    } catch {
      // sem armazenamento: segue o sistema
    }
  }, []);

  const escolher = (id) => {
    setTema(id);
    if (id === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", id);
    try {
      if (id === "auto") localStorage.removeItem("tema");
      else localStorage.setItem("tema", id);
    } catch {
      // o tema vale só nesta visita
    }
  };

  return (
    <div className="tema" role="group" aria-label="Aparência do site">
      <span>Aparência</span>
      {TEMAS.map((t) => (
        <button key={t.id} type="button" aria-pressed={tema === t.id} onClick={() => escolher(t.id)}>
          {t.rotulo}
        </button>
      ))}
    </div>
  );
}

// "atual" é o slug da página ("" na página inicial). Marca o item do menu com aria-current.
export function Cabecalho({ atual = "" }) {
  const [aberto, setAberto] = useState(false);
  const [servicos, setServicos] = useState(false);
  const caixa = useRef(null);
  const botaoServicos = useRef(null);
  const botaoMenu = useRef(null);
  const teclado = useRef(false);

  const emServicos = AREAS.some((a) => a.slug === atual);
  const emGuias = atual === "guias" || atual.startsWith("guias/");
  const emOnde = atual === "onde-atendemos";
  const cur = (v) => (v ? "page" : undefined);

  useEffect(() => {
    if (!servicos) return undefined;
    const fora = (e) => {
      if (caixa.current && !caixa.current.contains(e.target)) setServicos(false);
    };
    const tecla = (e) => {
      if (e.key === "Escape") {
        setServicos(false);
        botaoServicos.current?.focus();
      }
    };
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("pointerdown", fora);
      document.removeEventListener("keydown", tecla);
    };
  }, [servicos]);

  // Esc fecha o menu do celular e devolve o foco ao botão que o abriu.
  useEffect(() => {
    if (!aberto) return undefined;
    const tecla = (e) => {
      if (e.key === "Escape") {
        setAberto(false);
        botaoMenu.current?.focus();
      }
    };
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  }, [aberto]);

  return (
    <header className="topo">
      <div className="topo-in">
        <a className="marca" href="/" aria-label="RD Engenharia, página inicial">
          <span className="marca-sigla">
            <img src="/marca/marca-rd.webp" width="320" height="128" alt="" />
          </span>
          <span className="marca-nome">
            <strong>RD Engenharia</strong>
            <small>Segurança e meio ambiente</small>
          </span>
        </a>

        <nav className="menu" aria-label="Principal">
          <div className="menu-servicos" ref={caixa}>
            <button
              type="button"
              ref={botaoServicos}
              className={emServicos ? "atual" : ""}
              aria-expanded={servicos}
              aria-controls="menu-servicos-lista"
              onClick={(e) => {
                teclado.current = e.detail === 0; // aberto pelo teclado: sem animação
                setServicos((v) => !v);
              }}
            >
              Serviços
              <svg className="seta-menu" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <ul id="menu-servicos-lista" className={`${servicos ? "aberto" : ""} ${teclado.current ? "teclado" : ""}`} hidden={!servicos}>
              {AREAS.map((a) => (
                <li key={a.slug}>
                  <a href={`/${a.slug}`} aria-current={cur(atual === a.slug)} className="menu-item-area">
                    <span className="icone-tile">
                      <IconeArea slug={a.slug} tamanho={22} />
                    </span>
                    <span>
                      <strong>{a.nome}</strong>
                      <small>{a.curto}</small>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <a href="/guias" className={emGuias ? "atual" : ""} aria-current={cur(atual === "guias")}>
            Guias
          </a>
          <a href="/onde-atendemos" className={emOnde ? "atual" : ""} aria-current={cur(emOnde)}>
            Onde atendemos
          </a>
        </nav>

        <BotaoBusca />

        <a
          className="btn btn-zap topo-zap"
          href={zap("Olá! Gostaria de solicitar um orçamento.")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icone nome="fa-brands fa-whatsapp" /> WhatsApp
        </a>

        <button
          ref={botaoMenu}
          className="menu-botao"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          onClick={() => setAberto((v) => !v)}
        >
          <Icone nome={aberto ? "fa-solid fa-xmark" : "fa-solid fa-bars"} />
        </button>
      </div>

      <nav id="menu-mobile" className={`menu-mobile ${aberto ? "aberto" : ""}`} aria-label="Menu" hidden={!aberto}>
        <p className="menu-mobile-titulo">Serviços</p>
        {AREAS.map((a) => (
          <a key={a.slug} className="menu-mobile-area" href={`/${a.slug}`} aria-current={cur(atual === a.slug)} onClick={() => setAberto(false)}>
            <IconeArea slug={a.slug} tamanho={22} /> {a.nome}
          </a>
        ))}
        <p className="menu-mobile-titulo">Mais</p>
        <a href="/guias" aria-current={cur(atual === "guias")} onClick={() => setAberto(false)}>
          Guias
        </a>
        <a href="/onde-atendemos" aria-current={cur(emOnde)} onClick={() => setAberto(false)}>
          Onde atendemos
        </a>
        <a href="/o-que-preciso" aria-current={cur(atual === "o-que-preciso")} onClick={() => setAberto(false)}>
          Não sei o que preciso
        </a>
        <a className="btn btn-zap" href={zap("Olá! Gostaria de solicitar um orçamento.")} target="_blank" rel="noopener noreferrer">
          <Icone nome="fa-brands fa-whatsapp" /> Chamar no WhatsApp
        </a>
      </nav>
    </header>
  );
}

// Trilha "Início › Serviços › Segurança do trabalho". O último item é a página atual.
export function Migalha({ itens }) {
  return (
    <nav className="migalha" aria-label="Você está aqui">
      <ol>
        <li>
          <a href="/">Início</a>
        </li>
        {itens.map((it, n) => (
          <li key={it.rotulo}>
            {it.href && n < itens.length - 1 ? (
              <a href={it.href}>{it.rotulo}</a>
            ) : (
              <span aria-current="page">{it.rotulo}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Índice da página: fica visível ao rolar e marca a seção em que o leitor está.
// Desenho: pílula de vidro líquido (components/ui/liquid-glass-navbar). A gota segue a seção à vista;
// depois de um clique, o observador espera a rolagem terminar para a gota não passear pelas seções do meio.
export function SecoesNav({ itens, rotulo = "Nesta página" }) {
  const [ativo, setAtivo] = useState(0);
  const lista = useRef(null);
  const trava = useRef(0);
  const chave = itens.map((i) => i.id).join("|");

  useEffect(() => {
    const els = itens.map((i) => document.getElementById(i.id)).filter(Boolean);
    if (!els.length || !("IntersectionObserver" in window)) return undefined;
    const visiveis = new Map();
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => visiveis.set(e.target.id, e.isIntersecting));
        if (Date.now() < trava.current) return;
        const primeiro = els.find((el) => visiveis.get(el.id));
        if (primeiro) setAtivo(itens.findIndex((i) => i.id === primeiro.id));
      },
      { rootMargin: "-25% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  // mantém o item ativo à vista quando a barra rola de lado (celular)
  useEffect(() => {
    const l = lista.current;
    const el = l?.querySelector('[aria-current="location"]');
    if (el && l.scrollWidth > l.clientWidth) {
      const dx = el.getBoundingClientRect().left - l.getBoundingClientRect().left;
      l.scrollTo({ left: l.scrollLeft + dx - 24, behavior: "auto" });
    }
  }, [ativo]);

  const itensBarra = useMemo(
    () => itens.map((i) => ({ label: i.rotulo, href: `#${i.id}`, fx: "none" })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chave]
  );

  return (
    <div className="secoes">
      <div className="secoes-in" ref={lista}>
        <LiquidNavbar
          items={itensBarra}
          active={ativo}
          onChange={(n) => {
            trava.current = Date.now() + 1000;
            setAtivo(n);
          }}
          tone="auto"
          compact={false}
          label={rotulo}
          current="location"
        />
      </div>
    </div>
  );
}

// Fecho de toda página interna, sempre na mesma ordem: próximo passo, páginas relacionadas, rodapé.
export function Final({ titulo = "Fale com o responsável técnico.", texto, zapTexto, zapRotulo = "Falar no WhatsApp", relacionadas = [] }) {
  return (
    <>
      <section className="sec proximo" id="proximo-passo" aria-labelledby="proximo-titulo">
        <div className="container">
          <p className="sec-n">
            <span>→</span> Próximo passo
          </p>
          <div className="proximo-grade rev">
            <h2 id="proximo-titulo" className="sec-titulo">
              {titulo}
            </h2>
            <div>
              <p className="lead">
                {texto || "Conte o seu caso pelo WhatsApp. A mensagem já vai pronta, sem compromisso. Valor e prazo são informados depois de conhecermos o seu caso."}
              </p>
              <BotaoZap className="btn-grande" texto={zapTexto} rotulo={zapRotulo} />
            </div>
          </div>
        </div>
      </section>
      {relacionadas.length > 0 && (
        <section className="sec relacionadas" aria-labelledby="rel-titulo">
          <div className="container">
            <p className="sec-n">
              <span>↗</span> Continue por aqui
            </p>
            <h2 id="rel-titulo" className="sr-only">
              Páginas relacionadas
            </h2>
            <ul className="rel-lista">
              {relacionadas.slice(0, 3).map((r) => (
                <li key={r.href} className="rev">
                  <a href={r.href}>
                    {r.area && (
                      <span className="icone-tile rel-icone">
                        <IconeArea slug={r.area} tamanho={24} />
                      </span>
                    )}
                    <small>{r.tag}</small>
                    <strong>{r.titulo}</strong>
                    {r.texto && <span>{r.texto}</span>}
                    <i aria-hidden="true">→</i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

export function Rodape() {
  return (
    <footer className="rodape">
      <div className="wrap rodape-cta">
        <p className="rodape-cta-t">Vamos conversar sobre o seu caso?</p>
        <a className="btn btn-zap btn-grande" href={zap("Olá! Gostaria de um orçamento.")} target="_blank" rel="noopener noreferrer">
          <Icone nome="fa-brands fa-whatsapp" /> Falar no WhatsApp
        </a>
      </div>
      <div className="wrap rodape-grade">
        <div>
          <a className="rodape-logo" href="/" aria-label="RD Engenharia, página inicial">
            <img src="/marca/marca-lockup.webp" width="720" height="396" alt="RD Engenharia, Segurança e Meio Ambiente" loading="lazy" />
          </a>
          <p className="rodape-marca">RD IBIRA ENGENHARIA, SEGURANCA E MEIO AMBIENTE LTDA.</p>
          <p>CNPJ 27.839.324/0001-74 · ativo desde 29/05/2017</p>
          <p>
            <a href={URL_AVALIACOES_GOOGLE} target="_blank" rel="noopener noreferrer">
              {ENDERECO}
            </a>
          </p>
          <p>Segunda a sexta, das 7h às 17h</p>
          <p>
            <a href={URL_AVALIACOES_GOOGLE} target="_blank" rel="noopener noreferrer">
              {NOTA_GOOGLE}
            </a>
          </p>
          <p>Responsável técnico: Rafael Antonio Dias · CREA-SP 5071022821</p>
        </div>
        <div>
          <h3 className="rodape-titulo">Serviços</h3>
          <ul>
            {AREAS.map((a) => (
              <li key={a.slug}>
                <a href={`/${a.slug}`} className="rodape-area">
                  <IconeArea slug={a.slug} tamanho={18} /> {a.nome}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="rodape-titulo">Onde atendemos</h3>
          <p>Atendemos presencialmente e online em Ibirá e região.</p>
          <p>
            <a href="/onde-atendemos">Ver onde atendemos</a>
          </p>
        </div>
        <div>
          <h3 className="rodape-titulo">Mais</h3>
          <ul>
            <li>
              <a href="/o-que-preciso">Descubra o que o seu caso precisa</a>
            </li>
            <li>
              <a href="/guias">Guias</a>
            </li>
            <li>
              <a href="/lembrete-de-vencimento">Lembrete de vencimento</a>
            </li>
            <li>
              <a href="/#duvidas">Dúvidas frequentes</a>
            </li>
            <li>
              <a href="https://www.instagram.com/rd_engenhariaibira/" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="/privacidade">Política de privacidade</a>
            </li>
            <li>
              <a href="/creditos">Créditos das imagens</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="rodape-fim">
        <p>© RD Engenharia Segurança e Meio Ambiente</p>
        <SeletorTema />
      </div>
      {/* Marca gigante no fim da página, decorativa (padrão de rodapé comum no 21st.dev) */}
      <p className="rodape-marca-gigante" aria-hidden="true">
        RD Engenharia
      </p>
    </footer>
  );
}

// Entrada suave das seções: só opacidade e deslocamento curto, e só quando o movimento é permitido.
function useRevelar() {
  useEffect(() => {
    const reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(document.querySelectorAll(".rev"));
    if (reduz || !("IntersectionObserver" in window)) return undefined;
    const vh = window.innerHeight;
    document.documentElement.classList.add("rev-on");
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92) el.classList.add("vis");
      else io.observe(el);
    });
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("rev-on");
    };
  }, []);
}

// Área da página atual: a própria área ou a área do guia. Muda o botão flutuante do WhatsApp.
function areaDaPagina(atual) {
  const guia = GUIAS.find((g) => g.slug === atual);
  return AREAS.find((a) => a.slug === (guia ? guia.area : atual)) || null;
}

// Botão flutuante do WhatsApp. Nas páginas de área e de guia vira uma pílula com o assunto
// ("Falar sobre AVCB e CLCB") e a mensagem já sai com a área. A pílula só aparece depois que o
// topo (que já tem o botão de orçamento) sai da tela; sem JavaScript ela fica sempre visível.
function ZapFlutuante({ atual }) {
  const area = areaDaPagina(atual);
  const [longe, setLonge] = useState(true);

  useEffect(() => {
    if (!area) return undefined;
    const ver = () => setLonge(window.scrollY > window.innerHeight * 0.7);
    ver();
    window.addEventListener("scroll", ver, { passive: true });
    return () => window.removeEventListener("scroll", ver);
  }, [area]);

  if (!area) {
    return (
      <a
        className="zap-flutuante"
        href={zap("Olá! Gostaria de um orçamento.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar pelo WhatsApp"
      >
        <Icone nome="fa-brands fa-whatsapp" />
      </a>
    );
  }
  return (
    <a
      className={`zap-flutuante zap-pilula ${longe ? "" : "escondido"}`}
      href={zap(`Olá! Gostaria de um orçamento na área de ${area.nome}.`)}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={longe ? undefined : -1}
      aria-hidden={longe ? undefined : "true"}
      aria-label={`Falar sobre ${area.assunto} pelo WhatsApp`}
    >
      <Icone nome="fa-brands fa-whatsapp" />
      <span>Falar sobre {area.assunto}</span>
    </a>
  );
}

// Links com âncora (ex.: um serviço aberto pela busca): garante a rolagem até o item depois que a
// página monta, porque o navegador pode tentar rolar antes de o conteúdo estar pronto.
function useAncora() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
  }, []);
}

// Brilho que segue o mouse nos cartões com a classe "spot" (só em telas com mouse). Um único ouvinte
// na página: grava a posição do ponteiro em --mx/--my do cartão, e o CSS desenha o brilho.
function useHolofote() {
  useEffect(() => {
    if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;
    const mover = (e) => {
      const el = e.target.closest && e.target.closest(".spot");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", mover, { passive: true });
    return () => document.removeEventListener("pointermove", mover);
  }, []);
}

export function Casca({ children, atual = "" }) {
  useRevelar();
  useAncora();
  useHolofote();
  return (
    <>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho atual={atual} />
      <main id="conteudo">{children}</main>
      <Rodape />
      <ZapFlutuante atual={atual} />
    </>
  );
}
