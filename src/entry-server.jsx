import { renderToString } from "react-dom/server";
import App from "./App";
import PageView, { NotFound, PrintPage } from "./Pages.jsx";
import { PAGES, SITE_URL, AREAS } from "./pagesData";

export { PAGES, SITE_URL, AREAS };

// The home page is also output ready in the HTML (before, it only appeared after JavaScript ran).
export function renderHome() {
  return renderToString(<App />);
}

export function render(page) {
  return renderToString(<PageView page={page} />);
}

export function render404() {
  return renderToString(<NotFound />);
}

export function renderPrint(area) {
  return renderToString(<PrintPage area={area} />);
}
