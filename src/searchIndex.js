// Search by document or service ("Qual documento ou serviço você precisa?"), with no library. The index comes
// from the site's own content (areas with their summary and FAQ, each area's services, guides and useful pages):
// nothing to maintain separately.
// - Matching ignores accents and case, drops filler words and matches ANY remaining word at the start of a word
//   in the text. Synonyms add results for everyday words. Both word lists are in src/content/searchSynonyms.js.
// - Ranking: entries that match more words first; then points (title above text, the visitor's own word above
//   a synonym); then the type (Serviço, Área, Guia, Página).
// - Search.jsx shows the options as an accessible combobox. The last option is always asking on WhatsApp with
//   the typed text, so the search never ends in a dead end.
// - No window/document access: safe for prerendering.

import { PAGES } from "./content/pages";
import { AREAS, AREA_OVERVIEW } from "./content/areas";
import { GUIDES } from "./content/guides";
import { SEARCH_STOP_WORDS, SEARCH_SYNONYMS } from "./content/searchSynonyms";
import { whatsappLink } from "./contact";

export const normalizeSearchText = (t) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Anchor of each service on the area page (also used in pages/area/AreaServices.jsx).
export const serviceAnchorId = (name) =>
  "servico-" +
  normalizeSearchText(name)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);

const NORMALIZED_STOP_WORDS = new Set(SEARCH_STOP_WORDS.map(normalizeSearchText));

// Chips under the empty search box: plain words, each one tested to return results.
export const SEARCH_SUGGESTIONS = ["Bombeiros", "Funcionários", "Imóvel rural", "Obra sem habite-se"];

const USEFUL_PAGE_SLUGS = ["o-que-preciso", "lembrete-de-vencimento", "onde-atendemos"];
const WIZARD_PAGE_SLUG = "o-que-preciso";

// Summary ("Para quem", "Você recebe") and FAQ of an area page: words such as "fiscalização" appear only there.
const areaSummaryTexts = (area) => {
  const overview = AREA_OVERVIEW[area.slug];
  return overview ? [overview.who, overview.deliverable] : [];
};
const areaFaqTexts = (area) => (area.faq || []).flatMap((faqEntry) => [faqEntry.q, faqEntry.a]);

const buildSearchIndexEntry = ({ type, title, text, href, searchableTexts }) => ({
  type,
  title,
  text,
  href,
  titleNorm: normalizeSearchText(title),
  haystack: normalizeSearchText(searchableTexts.filter(Boolean).join(" ")),
});

export const SEARCH_INDEX = [
  ...AREAS.flatMap((area) =>
    area.items.map((service) =>
      buildSearchIndexEntry({
        type: "Serviço",
        title: service.name,
        text: area.name,
        href: `/${area.slug}#${serviceAnchorId(service.name)}`,
        searchableTexts: [service.name, service.text, service.who, area.name],
      })
    )
  ),
  ...AREAS.map((area) =>
    buildSearchIndexEntry({
      type: "Área",
      title: area.name,
      text: area.shortText,
      href: `/${area.slug}`,
      searchableTexts: [area.name, area.shortText, area.intro, ...(area.situations || []), ...areaSummaryTexts(area), ...areaFaqTexts(area)],
    })
  ),
  ...GUIDES.map((guide) =>
    buildSearchIndexEntry({
      type: "Guia",
      title: guide.h1,
      text: "Guia em linguagem simples",
      href: `/${guide.slug}`,
      searchableTexts: [guide.h1, guide.description, guide.service],
    })
  ),
  ...PAGES.filter((page) => USEFUL_PAGE_SLUGS.includes(page.slug)).map((page) =>
    buildSearchIndexEntry({ type: "Página", title: page.h1, text: page.description, href: `/${page.slug}`, searchableTexts: [page.h1, page.description] })
  ),
];

const SEARCH_TYPE_WEIGHT = { Serviço: 3, Área: 2, Guia: 1, Página: 0 };

// Points of one query word in one entry. The visitor's own word in the title weighs most, as before (x10);
// a synonym in the title beats the visitor's word found only in the text, but never the word in a title.
const TYPED_WORD_POINTS = { found: 10, titlePart: 20, titleWord: 40, titleStart: 60 };
const SYNONYM_POINTS = { inTitle: 15, inText: 3 };

const escapeForRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Start of a word: "bombeiro" finds "bombeiros", but "car" does not find "começar".
const wordStartPattern = (text) => new RegExp(`(^|[^a-z0-9])${escapeForRegExp(text)}`);
const wholeWordPattern = (text) => new RegExp(`(^|[^a-z0-9])${escapeForRegExp(text)}([^a-z0-9]|$)`);

// Normalized everyday word → its normalized targets and their patterns.
const SYNONYMS_BY_WORD = new Map(
  Object.entries(SEARCH_SYNONYMS).map(([word, targets]) => {
    const normalizedTargets = targets.map(normalizeSearchText);
    return [normalizeSearchText(word), { targets: normalizedTargets, patterns: normalizedTargets.map(wordStartPattern) }];
  })
);
const NO_SYNONYMS = { targets: [], patterns: [] };

// Synonyms of a normalized word: the word itself or, for a plural in "s" or "es", its singular.
function findSynonymsOfWord(word) {
  const key = [word, word.replace(/s$/, ""), word.replace(/es$/, "")].find((candidate) => SYNONYMS_BY_WORD.has(candidate));
  return key ? SYNONYMS_BY_WORD.get(key) : NO_SYNONYMS;
}

export const findSearchSynonyms = (word) => findSynonymsOfWord(normalizeSearchText(String(word || ""))).targets;

// Words of the query that count: normalized, without filler words, repeated words or loose hyphens.
export function extractSearchWords(query) {
  if (typeof query !== "string") return [];
  const words = normalizeSearchText(query)
    .split(/[^a-z0-9-]+/)
    .map((word) => word.replace(/^-+|-+$/g, ""))
    .filter((word) => word.length >= 2 && !NORMALIZED_STOP_WORDS.has(word));
  return [...new Set(words)];
}

function typedWordPoints(word, entry) {
  if (!word.startPattern.test(entry.haystack)) return 0;
  let points = TYPED_WORD_POINTS.found;
  if (entry.titleNorm.startsWith(word.text)) points += TYPED_WORD_POINTS.titleStart;
  if (word.wholePattern.test(entry.titleNorm)) points += TYPED_WORD_POINTS.titleWord;
  else if (word.startPattern.test(entry.titleNorm)) points += TYPED_WORD_POINTS.titlePart;
  return points;
}

function synonymPoints(word, entry) {
  if (word.synonymPatterns.some((pattern) => pattern.test(entry.titleNorm))) return SYNONYM_POINTS.inTitle;
  if (word.synonymPatterns.some((pattern) => pattern.test(entry.haystack))) return SYNONYM_POINTS.inText;
  return 0;
}

function scoreSearchEntry(entry, queryWords) {
  let matchedWordCount = 0;
  let points = 0;
  for (const word of queryWords) {
    const wordPoints = Math.max(typedWordPoints(word, entry), synonymPoints(word, entry));
    if (!wordPoints) continue;
    matchedWordCount += 1;
    points += wordPoints;
  }
  // Point totals differ by at least 1, so x10 keeps the type weight a pure tiebreak.
  return { ...entry, matchedWordCount, score: points * 10 + SEARCH_TYPE_WEIGHT[entry.type] };
}

const compareSearchResults = (a, b) => b.matchedWordCount - a.matchedWordCount || b.score - a.score;

const buildQueryWord = (text) => ({
  text,
  startPattern: wordStartPattern(text),
  wholePattern: wholeWordPattern(text),
  synonymPatterns: findSynonymsOfWord(text).patterns,
});

export function searchSiteContent(query, limit = 6) {
  const queryWords = extractSearchWords(query).map(buildQueryWord);
  if (!queryWords.length) return [];
  return SEARCH_INDEX.map((entry) => scoreSearchEntry(entry, queryWords))
    .filter((result) => result.matchedWordCount > 0)
    .sort(compareSearchResults)
    .slice(0, limit);
}

const WIZARD_PAGE = PAGES.find((page) => page.slug === WIZARD_PAGE_SLUG);

// Offered when nothing matched: the step-by-step wizard finds the document for a visitor who does not know its name.
export const WIZARD_SEARCH_OPTION = {
  type: "Página",
  title: "Não sabe o nome do documento? Responda o passo a passo",
  text: WIZARD_PAGE ? WIZARD_PAGE.h1 : "",
  href: `/${WIZARD_PAGE_SLUG}`,
};

// One line, unchanged: it already starts by saying the visitor came from the site search.
export const buildSearchWhatsappMessage = (typedText) => `Olá! Procurei no site por "${typedText}" e gostaria de saber se vocês fazem.`;

// Options of the result list. With results: the results, then WhatsApp. With none: WhatsApp with the typed
// text first (Enter sends it, the most direct way to a conversation), then the step-by-step wizard.
export function buildSearchOptions(query, results) {
  const typedText = typeof query === "string" ? query.trim() : "";
  if (!typedText) return [];
  const foundResults = Array.isArray(results) ? results : [];
  const whatsappOption = {
    type: "WhatsApp",
    title: `Perguntar no WhatsApp: “${typedText}”`,
    text: foundResults.length ? "Ou fale direto com o responsável técnico." : "Não achamos no site, mas respondemos por lá.",
    href: whatsappLink(buildSearchWhatsappMessage(typedText)),
    external: true,
  };
  if (!foundResults.length) return [whatsappOption, WIZARD_SEARCH_OPTION];
  return [...foundResults, whatsappOption];
}
