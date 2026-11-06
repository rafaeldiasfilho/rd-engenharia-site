import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import PaginaView, { NaoEncontrada, PaginaImprimir } from "./Paginas.jsx";
import { achaPagina, achaArea } from "./paginas";
import "./styles.css";
import { inject, track } from "@vercel/analytics";

inject();

// Conta cada clique para o WhatsApp (o único canal de contato) como evento "WhatsApp", com a página e
// o trecho de onde veio (seção, botão flutuante, menu, rodapé). Um ouvinte só, no documento inteiro.
// Eventos personalizados da Vercel Web Analytics podem exigir o plano Pro; sem ele, nada quebra.
document.addEventListener(
  "click",
  (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[href*="wa.me/"]') : null;
    if (!a) return;
    const secao = a.closest("section[id], header, footer, nav, [data-origem]");
    const origem =
      a.dataset.origem ||
      (a.classList.contains("whatsapp-float") ? "botao-flutuante" : "") ||
      (secao && (secao.dataset?.origem || secao.id || secao.tagName.toLowerCase())) ||
      "pagina";
    try {
      track("WhatsApp", { pagina: window.location.pathname, origem, texto: (a.textContent || "").trim().slice(0, 60) });
    } catch {
      /* estatística é opcional */
    }
  },
  { capture: true },
);

const raiz = document.getElementById("root");
const slug = window.location.pathname.replace(/^\/+|\/+$/g, "");
const pagina = slug ? achaPagina(slug) : null;

const areaImpressao = slug.startsWith("imprimir/") ? achaArea(slug.slice(9)) : null;

const Admin = lazy(() => import("./admin/Admin"));

if (slug === "admin") {
  ReactDOM.createRoot(raiz).render(
    <Suspense fallback={<p style={{ padding: 24 }}>Carregando...</p>}>
      <Admin />
    </Suspense>
  );
} else if (areaImpressao) {
  ReactDOM.hydrateRoot(raiz, <PaginaImprimir area={areaImpressao} />);
} else if (raiz.dataset.erro) {
  ReactDOM.hydrateRoot(raiz, <NaoEncontrada />);
} else if (pagina) {
  ReactDOM.hydrateRoot(
    raiz,
    <React.StrictMode>
      <PaginaView pagina={pagina} />
    </React.StrictMode>
  );
} else if (raiz.hasChildNodes()) {
  // Página inicial pré-renderizada (dist/index.html já traz o conteúdo).
  ReactDOM.hydrateRoot(
    raiz,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(raiz).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
