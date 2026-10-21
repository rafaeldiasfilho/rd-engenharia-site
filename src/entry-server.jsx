import { renderToString } from "react-dom/server";
import PaginaView, { NaoEncontrada, PaginaImprimir } from "./Paginas.jsx";
import { PAGINAS, SITE_URL, AREAS } from "./paginas";

export { PAGINAS, SITE_URL, AREAS };

export function render(pagina) {
  return renderToString(<PaginaView pagina={pagina} />);
}

export function render404() {
  return renderToString(<NaoEncontrada />);
}

export function renderImpressao(area) {
  return renderToString(<PaginaImprimir area={area} />);
}
