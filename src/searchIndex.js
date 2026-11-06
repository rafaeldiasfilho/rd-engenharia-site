// Search index and ranking for "Qual documento você precisa?", built from the site's own content (areas, services, guides and useful pages).
// Ignores accents and case; every typed word must appear. No window/document access: safe for prerendering.

import { PAGES } from "./content/pages";
import { AREAS } from "./content/areas";
import { GUIDES } from "./content/guides";

// Search by document or service ("Qual documento você precisa?"), with no library.
// - The index comes from the site's own content (areas, each area's services, guides and useful pages):
//   nothing to maintain separately. Ignores accents and case; every typed word must appear.
// - Accessible combobox pattern: arrows move up and down, Enter opens, Esc clears. The last option is always
//   asking on WhatsApp with the typed text, so the search never ends in a dead end.
// - No window/document during render: safe for prerendering.

export const normalizeSearchText = (t) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Anchor of each service on the area page (also used in pages/AreaPage.jsx).
export const serviceAnchorId = (name) =>
  "servico-" +
  normalizeSearchText(name)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);

const USEFUL_PAGES = ["o-que-preciso", "lembrete-de-vencimento", "onde-atendemos"];

const SEARCH_INDEX = [
  ...AREAS.flatMap((a) =>
    a.items.map((it) => ({
      type: "Serviço",
      title: it.name,
      text: a.name,
      href: `/${a.slug}#${serviceAnchorId(it.name)}`,
      titleNorm: normalizeSearchText(it.name),
      haystack: normalizeSearchText([it.name, it.text, it.who, a.name].join(" ")),
    }))
  ),
  ...AREAS.map((a) => ({
    type: "Área",
    title: a.name,
    text: a.shortText,
    href: `/${a.slug}`,
    titleNorm: normalizeSearchText(a.name),
    haystack: normalizeSearchText([a.name, a.shortText, a.intro, ...(a.situations || [])].join(" ")),
  })),
  ...GUIDES.map((g) => ({
    type: "Guia",
    title: g.h1,
    text: "Guia em linguagem simples",
    href: `/${g.slug}`,
    titleNorm: normalizeSearchText(g.h1),
    haystack: normalizeSearchText([g.h1, g.description, g.service].join(" ")),
  })),
  ...PAGES.filter((p) => USEFUL_PAGES.includes(p.slug)).map((p) => ({
    type: "Página",
    title: p.h1,
    text: p.description,
    href: `/${p.slug}`,
    titleNorm: normalizeSearchText(p.h1),
    haystack: normalizeSearchText([p.h1, p.description].join(" ")),
  })),
];

const SEARCH_TYPE_WEIGHT = { Serviço: 3, Área: 2, Guia: 1, Página: 0 };

export function searchSiteContent(query, limit = 6) {
  const terms = normalizeSearchText(query).split(/[^a-z0-9-]+/).filter((t) => t.length >= 2);
  if (!terms.length) return [];
  return SEARCH_INDEX.map((it) => {
    let score = 0;
    for (const t of terms) {
      if (!it.haystack.includes(t)) return null;
      if (it.titleNorm.startsWith(t)) score += 6;
      if (new RegExp(`(^|[^a-z0-9])${t}([^a-z0-9]|$)`).test(it.titleNorm)) score += 4;
      else if (it.titleNorm.includes(t)) score += 2;
      score += 1;
    }
    return { ...it, score: score * 10 + SEARCH_TYPE_WEIGHT[it.type] };
  })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
