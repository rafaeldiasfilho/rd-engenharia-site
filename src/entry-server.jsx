import { renderToString } from "react-dom/server";
import PaginaView from "./Paginas";
import { PAGINAS, SITE_URL } from "./paginas";

export { PAGINAS, SITE_URL };

export function render(pagina) {
  return renderToString(<PaginaView pagina={pagina} />);
}
