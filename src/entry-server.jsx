import { renderToString } from "react-dom/server";
import PaginaView, { NaoEncontrada } from "./Paginas.jsx";
import { PAGINAS, SITE_URL } from "./paginas";

export { PAGINAS, SITE_URL };

export function render(pagina) {
  return renderToString(<PaginaView pagina={pagina} />);
}

export function render404() {
  return renderToString(<NaoEncontrada />);
}
