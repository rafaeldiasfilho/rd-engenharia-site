import Icone from "./Icone";
import { useEffect, useState } from "react";
import { AREAS } from "./paginas";

export const WHATSAPP = "5517997211208";
export const zap = (texto) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

const NAV = [
  { href: "/seguranca-do-trabalho", label: "Segurança do trabalho" },
  { href: "/corpo-de-bombeiros", label: "Bombeiros" },
  { href: "/engenharia-civil", label: "Engenharia civil" },
  { href: "/meio-ambiente-topografia", label: "Meio ambiente e topografia" },
  { href: "/#duvidas", label: "Dúvidas" },
];

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

export function Cabecalho() {
  const [aberto, setAberto] = useState(false);
  return (
    <header className="topo">
      <div className="topo-in">
        <a className="marca" href="/" aria-label="RD Engenharia, página inicial">
          <span className="marca-sigla">RD</span>
          <span className="marca-nome">
            <strong>RD Engenharia</strong>
            <small>Segurança e meio ambiente</small>
          </span>
        </a>

        <nav className="menu" aria-label="Principal">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a
          className="btn btn-zap topo-zap"
          href={zap("Olá! Gostaria de solicitar um orçamento.")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icone nome="fa-brands fa-whatsapp" /> WhatsApp
        </a>

        <button
          className="menu-botao"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          onClick={() => setAberto((v) => !v)}
        >
          <Icone nome={aberto ? "fa-solid fa-xmark" : "fa-solid fa-bars"} />
        </button>
      </div>

      <nav id="menu-mobile" className={`menu-mobile ${aberto ? "aberto" : ""}`} aria-label="Menu">
        {NAV.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setAberto(false)}>
            {item.label}
          </a>
        ))}
        <a className="btn btn-zap" href={zap("Olá! Gostaria de solicitar um orçamento.")} target="_blank" rel="noopener noreferrer">
          <Icone nome="fa-brands fa-whatsapp" /> Chamar no WhatsApp
        </a>
      </nav>
    </header>
  );
}

export function Rodape() {
  return (
    <footer className="rodape">
      <div className="wrap rodape-grade">
        <div>
          <p className="rodape-marca">RD Engenharia Segurança e Meio Ambiente</p>
          <p>Rua José Alves de Mello, 770, Centro, Ibirá/SP</p>
          <p>Segunda a sexta, das 7h às 17h</p>
          <p>
            Responsável técnico: Rafael Antonio Dias · CREA-SP 5071022821
          </p>
        </div>
        <div>
          <h4>Áreas</h4>
          <ul>
            {AREAS.map((a) => (
              <li key={a.slug}>
                <a href={`/${a.slug}`}>{a.nome}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Mais</h4>
          <ul>
            <li>
              <a href="/o-que-preciso">Descubra o que o seu caso precisa</a>
            </li>
            <li>
              <a href="/guias">Guias</a>
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
          </ul>
        </div>
      </div>
      <div className="rodape-fim">
        <p>© RD Engenharia Segurança e Meio Ambiente</p>
        <SeletorTema />
      </div>
    </footer>
  );
}

export function Casca({ children }) {
  return (
    <>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo">{children}</main>
      <Rodape />
      <a
        className="zap-flutuante"
        href={zap("Olá! Gostaria de um orçamento.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar pelo WhatsApp"
      >
        <Icone nome="fa-brands fa-whatsapp" />
      </a>
    </>
  );
}
