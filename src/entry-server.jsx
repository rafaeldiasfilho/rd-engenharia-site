import { renderToString } from "react-dom/server";
import App from "./App";
import PageView, { NaoEncontrada, PaginaImprimir } from "./Pages.jsx";
import { PAGINAS, SITE_URL, AREAS } from "./pagesData";

export { PAGINAS, SITE_URL, AREAS };

// The home page is also output ready in the HTML (before, it only appeared after JavaScript ran).
export function renderHome() {
  return renderToString(<App />);
}

export function render(page) {
  return renderToString(<PageView pagina={page} />);
}

export function render404() {
  return renderToString(<NaoEncontrada />);
}

export function renderImpressao(area) {
  return renderToString(<PaginaImprimir area={area} />);
}
