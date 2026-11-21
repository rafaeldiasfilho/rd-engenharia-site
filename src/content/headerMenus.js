// Content of the header's "Guias" and "Onde atendemos" menus (the "Serviços" menu reads AREAS).
// The coverage cards repeat the two service modes of the /onde-atendemos page (src/pages/LocationPage.jsx);
// their photos are decorative, come from the photo list and are credited on /creditos.

import { GUIDES } from "./guides.js";

export const GUIDES_MENU_ITEMS = GUIDES.map((menuGuide) => ({
  slug: menuGuide.slug,
  href: `/${menuGuide.slug}`,
  label: menuGuide.h1,
}));

export const COVERAGE_MENU_CARDS = [
  {
    label: "Presencial",
    text: "No local, quando o serviço exige.",
    photo: "receptor-gnss-sobre-tripe-gramado",
    href: "/onde-atendemos#atendimento-regiao",
  },
  {
    label: "Online",
    text: "O resto, pelo WhatsApp.",
    photo: "medidor-nivel-sonoro-com-celular",
    href: "/onde-atendemos#atendimento-regiao",
  },
];
