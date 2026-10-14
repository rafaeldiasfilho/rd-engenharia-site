import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import PaginaView, { NaoEncontrada } from "./Paginas";
import { achaPagina } from "./paginas";
import "./styles.css";
import { inject } from "@vercel/analytics";

inject();

const raiz = document.getElementById("root");
const slug = window.location.pathname.replace(/^\/+|\/+$/g, "");
const pagina = slug ? achaPagina(slug) : null;

const Admin = lazy(() => import("./admin/Admin"));

if (slug === "admin") {
  ReactDOM.createRoot(raiz).render(
    <Suspense fallback={<p style={{ padding: 24 }}>Carregando...</p>}>
      <Admin />
    </Suspense>
  );
} else if (raiz.dataset.erro) {
  ReactDOM.hydrateRoot(raiz, <NaoEncontrada />);
} else if (pagina) {
  ReactDOM.hydrateRoot(
    raiz,
    <React.StrictMode>
      <PaginaView pagina={pagina} />
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(raiz).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
