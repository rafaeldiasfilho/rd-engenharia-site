import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import PageView, { NotFound } from "./pages/PageView.jsx";
import { PrintPage } from "./pages/PrintPage.jsx";
import { ErrorBoundary } from "./ErrorBoundary.jsx";
import { findPage } from "./content/pages";
import { findArea } from "./content/areas";
import "./styles.css";
import { inject, track } from "@vercel/analytics";

inject();

// Counts each click to WhatsApp (the only contact channel) as a "WhatsApp" event, with the page and
// the part it came from (section, floating button, menu, footer). A single listener on the whole document.
// Vercel Web Analytics custom events may require the Pro plan; without it, nothing breaks.
document.addEventListener(
  "click",
  (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[href*="wa.me/"]') : null;
    if (!a) return;
    const section = a.closest("section[id], header, footer, nav, [data-origin]");
    const origin =
      a.dataset.origin ||
      (a.classList.contains("whatsapp-float") ? "botao-flutuante" : "") ||
      (section && (section.dataset?.origin || section.id || section.tagName.toLowerCase())) ||
      "pagina";
    try {
      track("WhatsApp", { pagina: window.location.pathname, origem: origin, texto: (a.textContent || "").trim().slice(0, 60) });
    } catch {
      /* analytics is optional */
    }
  },
  { capture: true },
);

const root = document.getElementById("root");
const slug = window.location.pathname.replace(/^\/+|\/+$/g, "");
const page = slug ? findPage(slug) : null;

const printArea = slug.startsWith("imprimir/") ? findArea(slug.slice(9)) : null;

const Admin = lazy(() => import("./admin/Admin"));

if (slug === "admin") {
  ReactDOM.createRoot(root).render(
    <Suspense fallback={<p style={{ padding: 24 }}>Carregando...</p>}>
      <Admin />
    </Suspense>
  );
} else if (printArea) {
  ReactDOM.hydrateRoot(root, <PrintPage area={printArea} />);
} else if (root.dataset.error) {
  ReactDOM.hydrateRoot(
    root,
    <ErrorBoundary>
      <NotFound />
    </ErrorBoundary>
  );
} else if (page) {
  ReactDOM.hydrateRoot(
    root,
    <React.StrictMode>
      <ErrorBoundary>
        <PageView page={page} />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else if (root.hasChildNodes()) {
  // Prerendered home page (dist/index.html already contains the content).
  ReactDOM.hydrateRoot(
    root,
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
