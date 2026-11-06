// Document search on the home page ("Qual documento você precisa?"). Pure functions only:
// the index is built from the site's own data, so these tests also catch data keys that went missing.
import { describe, expect, it } from "vitest";
import { serviceAnchorId, normalizeSearchText, searchSiteContent } from "../src/searchIndex.js";
import { AREAS } from "../src/content/areas.js";

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

describe("runSearch", () => {
  it("finds a service by its acronym, ignoring case", () => {
    const results = searchSiteContent("avcb");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toMatch(/AVCB/);
  });

  it("ignores accents typed by the visitor", () => {
    expect(searchSiteContent("licenca").length).toBe(searchSiteContent("licença").length);
  });

  it("requires every typed word to match", () => {
    expect(searchSiteContent("pgr xyzxyz")).toEqual([]);
  });

  it("returns nothing for empty, one-letter or unknown queries (the WhatsApp option covers it)", () => {
    expect(searchSiteContent("")).toEqual([]);
    expect(searchSiteContent("a")).toEqual([]);
    expect(searchSiteContent("xyz")).toEqual([]);
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
