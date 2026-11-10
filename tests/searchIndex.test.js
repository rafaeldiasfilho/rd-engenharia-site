// Document search ("Qual documento ou serviço você precisa?"). Pure functions only:
// the index is built from the site's own data, so these tests also catch data keys that went missing.
import { describe, expect, it } from "vitest";
import {
  SEARCH_INDEX,
  SEARCH_SUGGESTIONS,
  WIZARD_SEARCH_OPTION,
  buildSearchOptions,
  buildSearchWhatsappMessage,
  extractSearchWords,
  findSearchSynonyms,
  normalizeSearchText,
  searchSiteContent,
  serviceAnchorId,
} from "../src/searchIndex.js";
import { AREAS } from "../src/content/areas.js";
import { findPage } from "../src/content/pages.js";
import { SEARCH_SYNONYMS } from "../src/content/searchSynonyms.js";

const firstResult = (query) => searchSiteContent(query)[0];

describe("normalize", () => {
  it("removes accents and lowercases", () => {
    expect(normalizeSearchText("Licença AMBIENTAL é Ótima")).toBe("licenca ambiental e otima");
  });
});

describe("anchorId", () => {
  it("builds a stable, URL-safe anchor from a service name", () => {
    expect(serviceAnchorId("AVCB ou CLCB (Corpo de Bombeiros)")).toBe("servico-avcb-ou-clcb-corpo-de-bombeiros");
  });

  it("never exceeds the prefix plus 48 characters", () => {
    expect(serviceAnchorId("a".repeat(200)).length).toBe("servico-".length + 48);
  });
});

describe("extractSearchWords", () => {
  it("drops filler words, accents and repeated words", () => {
    expect(extractSearchWords("Vou vender o sítio")).toEqual(["vender", "sitio"]);
    expect(extractSearchWords("bombeiro pediu")).toEqual(["bombeiro"]);
    expect(extractSearchWords("AVCB avcb")).toEqual(["avcb"]);
  });

  it("keeps hyphenated names such as habite-se", () => {
    expect(extractSearchWords("Obra sem habite-se")).toEqual(["obra", "habite-se"]);
  });

  it("returns nothing for filler words only, loose hyphens or a value that is not text", () => {
    expect(extractSearchWords("o que preciso")).toEqual([]);
    expect(extractSearchWords(" -- ")).toEqual([]);
    expect(extractSearchWords(undefined)).toEqual([]);
  });
});

describe("runSearch", () => {
  it("finds a service by its acronym, ignoring case", () => {
    const results = searchSiteContent("avcb");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toMatch(/AVCB/);
  });

  it("ignores accents typed by the visitor", () => {
    expect(searchSiteContent("licenca").length).toBe(searchSiteContent("licença").length);
  });

  it("matches any remaining word, so a word the site does not have no longer hides the others", () => {
    expect(firstResult("pgr xyzxyz").title).toMatch(/PGR/);
  });

  it("ranks the entries that match more of the typed words first", () => {
    const results = searchSiteContent("meu avcb venceu");
    expect(results[0]).toMatchObject({ href: "/corpo-de-bombeiros", matchedWordCount: 2 });
    results.slice(1).forEach((result, n) => expect(result.matchedWordCount).toBeLessThanOrEqual(results[n].matchedWordCount));
  });

  it("finds the right area or service for everyday phrases", () => {
    expect(firstResult("bombeiro pediu").href.startsWith("/corpo-de-bombeiros")).toBe(true);
    const ruralSale = firstResult("vou vender o sítio");
    expect(ruralSale.href.startsWith("/meio-ambiente-topografia")).toBe(true);
    expect(ruralSale.title).toMatch(/Georreferenciamento/);
    expect(firstResult("fiscalização")).toMatchObject({ type: "Área", href: "/seguranca-do-trabalho" });
  });

  it("returns nothing for empty, one-letter, unknown or filler-only queries (the page offers other ways out)", () => {
    expect(searchSiteContent("")).toEqual([]);
    expect(searchSiteContent("a")).toEqual([]);
    expect(searchSiteContent("xyz")).toEqual([]);
    expect(searchSiteContent("o que preciso")).toEqual([]);
    expect(searchSiteContent("de para com")).toEqual([]);
  });

  it("keeps the first result of document names that already worked", () => {
    const expectedFirstTitles = [
      ["avcb", /AVCB/], ["clcb", /CLCB/], ["pgr", /PGR/], ["ltcat", /LTCAT/], ["car", /CAR/],
      ["georreferenciamento", /Georreferenciamento/], ["habite-se", /Habite-se/], ["laudo de insalubridade", /insalubridade/],
      ["incêndio", /Incêndio/], // a synonym never pushes down a title with the visitor's own word
    ];
    for (const [query, title] of expectedFirstTitles) expect(firstResult(query).title).toMatch(title);
  });

  it("matches at the start of a word, not in the middle of one", () => {
    expect(searchSiteContent("ncendio")).toEqual([]);
    expect(searchSiteContent("incend").length).toBeGreaterThan(0);
  });

  it("respects the result limit", () => {
    expect(searchSiteContent("laudo", 2).length).toBeLessThanOrEqual(2);
  });

  it("only links to existing area pages and anchors", () => {
    const areaSlugs = new Set(AREAS.map((a) => a.slug));
    for (const r of searchSiteContent("laudo", 50)) {
      expect(r.href.startsWith("/")).toBe(true);
      if (r.type === "Serviço") expect(areaSlugs.has(r.href.slice(1).split("#")[0])).toBe(true);
    }
  });
});

describe("synonyms", () => {
  it("finds the synonyms of a word typed with accents, capitals or in the plural", () => {
    expect(findSearchSynonyms("Sítio")).toContain("imovel rural");
    expect(findSearchSynonyms("bombeiros")).toEqual(["corpo de bombeiros"]);
    expect(findSearchSynonyms("extintores")).toEqual(["corpo de bombeiros"]);
    expect(findSearchSynonyms("xyz")).toEqual([]);
  });

  it("leads everyday words to the right area", () => {
    expect(firstResult("sítio").href.startsWith("/meio-ambiente-topografia")).toBe(true);
    expect(firstResult("chácaras").href.startsWith("/meio-ambiente-topografia")).toBe(true);
    expect(firstResult("extintor").href.startsWith("/corpo-de-bombeiros")).toBe(true);
    expect(firstResult("funcionários").href).toBe("/seguranca-do-trabalho");
    expect(firstResult("averbação").href).toBe("/engenharia-civil");
    const notaryTitles = searchSiteContent("cartório").map((r) => r.title);
    expect(notaryTitles.some((title) => /Georreferenciamento/.test(title))).toBe(true);
    expect(notaryTitles.some((title) => /Regularização de obra/.test(title))).toBe(true);
  });

  it("points only to words that appear in the site's own text", () => {
    const siteText = SEARCH_INDEX.map((entry) => entry.haystack).join(" ");
    for (const targets of Object.values(SEARCH_SYNONYMS)) {
      for (const target of targets) expect(siteText).toContain(normalizeSearchText(target));
    }
  });
});

describe("suggestion chips", () => {
  it("uses plain words, and each one returns results in the right area", () => {
    expect(SEARCH_SUGGESTIONS).toEqual(["Bombeiros", "Funcionários", "Imóvel rural", "Obra sem habite-se"]);
    for (const chip of SEARCH_SUGGESTIONS) expect(searchSiteContent(chip).length).toBeGreaterThan(0);
    expect(firstResult("Bombeiros").href.startsWith("/corpo-de-bombeiros")).toBe(true);
    expect(firstResult("Funcionários").href).toBe("/seguranca-do-trabalho");
    expect(firstResult("Imóvel rural").href.startsWith("/meio-ambiente-topografia")).toBe(true);
    const buildingResults = searchSiteContent("Obra sem habite-se");
    expect(buildingResults[0].title).toMatch(/habite-se/i);
    expect(buildingResults.some((r) => r.href.startsWith("/engenharia-civil#"))).toBe(true);
  });
});

describe("buildSearchOptions", () => {
  it("returns no options while the box is empty", () => {
    expect(buildSearchOptions("", [])).toEqual([]);
    expect(buildSearchOptions("   ", [])).toEqual([]);
  });

  it("lists the results and keeps WhatsApp as the last option", () => {
    const results = searchSiteContent("avcb");
    const options = buildSearchOptions("avcb", results);
    expect(options.slice(0, -1)).toEqual(results);
    expect(options[options.length - 1]).toMatchObject({ type: "WhatsApp", external: true });
    expect(options).not.toContainEqual(WIZARD_SEARCH_OPTION);
  });

  it("offers WhatsApp with the typed text, then the step-by-step wizard, when nothing matched", () => {
    const options = buildSearchOptions("  padaria  ", []);
    expect(options).toHaveLength(2);
    expect(options[0].title).toBe("Perguntar no WhatsApp: “padaria”");
    expect(decodeURIComponent(options[0].href.split("?text=")[1])).toBe(buildSearchWhatsappMessage("padaria"));
    expect(options[1]).toMatchObject({ title: "Não sabe o nome do documento? Responda o passo a passo", href: "/o-que-preciso" });
    expect(findPage("o-que-preciso")).toBeTruthy();
  });

  it("builds a short WhatsApp message that starts by saying it came from the site search", () => {
    const message = buildSearchWhatsappMessage("vou vender o sítio");
    expect(message.split("\n")[0]).toMatch(/^Olá! Procurei no site/);
    expect(message).toContain('"vou vender o sítio"');
    expect(message).not.toMatch(/\p{Extended_Pictographic}/u);
  });
});
