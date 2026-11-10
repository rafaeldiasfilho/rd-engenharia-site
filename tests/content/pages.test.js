// Integrity of the site content. A broken key here blanks whole pages (it happened during the English
// rename on 2026-11-06), so the shape every page and the wizard rely on is checked.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { PAGES, SITE_URL, findPage } from "../../src/content/pages.js";
import { AREAS, findArea } from "../../src/content/areas.js";
import { GUIDES } from "../../src/content/guides.js";
import { PROFILES, RESULTS } from "../../src/content/wizard.js";
import { CNPJ, LEGAL_NAME, OPEN_SINCE, TRADE_NAME } from "../../src/company.js";
import { GOOGLE_REVIEWS_URL } from "../../src/content/googleAndMaps.js";

const PAGE_TYPES = ["area", "guide", "location", "quiz", "guide-index", "reminder", "privacy", "terms", "credits"];

// Business JSON-LD of index.html: the prerender (scripts/prerender.mjs) copies it to every page and points
// Service.provider and Article.publisher at its "@id".
const readProjectFile = (relativePath) => fs.readFileSync(new URL(`../../${relativePath}`, import.meta.url), "utf8");
const INDEX_HTML = readProjectFile("index.html");
const BUSINESS_JSON_LD = JSON.parse(INDEX_HTML.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
const existsInPublicFolder = (siteUrl) => fs.existsSync(new URL(`../../public${new URL(siteUrl).pathname}`, import.meta.url));

describe("PAGES", () => {
  it("has unique slugs", () => {
    const slugs = PAGES.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every page a known type, a title, a description and an h1 (needed by the prerender)", () => {
    for (const page of PAGES) {
      expect(PAGE_TYPES, page.slug).toContain(page.type);
      expect(page.title, page.slug).toBeTruthy();
      expect(page.description, page.slug).toBeTruthy();
      expect(page.h1, page.slug).toBeTruthy();
    }
  });

  it("includes every area and every guide", () => {
    for (const p of [...AREAS, ...GUIDES]) expect(findPage(p.slug)).toBe(p);
  });

  it("returns undefined for an unknown slug (the 404 page handles it)", () => {
    expect(findPage("nao-existe")).toBeUndefined();
    expect(findArea("nao-existe")).toBeUndefined();
  });
});

describe("AREAS", () => {
  it("gives every service a name and a text (used by the search and the area page)", () => {
    for (const area of AREAS) {
      expect(area.items.length, area.slug).toBeGreaterThan(0);
      for (const item of area.items) {
        expect(item.name, area.slug).toBeTruthy();
        expect(item.text, item.name).toBeTruthy();
      }
    }
  });
});

describe("wizard data (PROFILES and RESULTS)", () => {
  it("gives every profile an id, a name and at least one situation", () => {
    for (const profile of PROFILES) {
      expect(profile.id).toBeTruthy();
      expect(profile.name).toBeTruthy();
      expect(profile.situations.length, profile.id).toBeGreaterThan(0);
    }
  });

  it("points every situation only at results that exist", () => {
    for (const profile of PROFILES) {
      for (const situation of profile.situations) {
        expect(situation.text).toBeTruthy();
        for (const id of situation.items) expect(RESULTS[id], `${profile.id}: ${id}`).toBeDefined();
      }
    }
  });

  it("links every result to an existing area page", () => {
    for (const [id, result] of Object.entries(RESULTS)) {
      expect(result.name, id).toBeTruthy();
      expect(findArea(result.area), `${id} -> ${result.area}`).toBeDefined();
    }
  });
});

describe("business JSON-LD in index.html", () => {
  it("has the @id that Service.provider and Article.publisher point at", () => {
    expect(BUSINESS_JSON_LD["@id"]).toBe(`${SITE_URL}/#empresa`);
  });

  it("uses the exact company facts of src/company.js", () => {
    expect(BUSINESS_JSON_LD.name).toBe(TRADE_NAME);
    expect(BUSINESS_JSON_LD.legalName).toBe(LEGAL_NAME);
    expect(BUSINESS_JSON_LD.taxID).toBe(CNPJ);
    expect(BUSINESS_JSON_LD.foundingDate).toBe(OPEN_SINCE.split("/").reverse().join("-"));
  });

  it("points image and logo at files that exist in public/ (the old /og.png did not)", () => {
    for (const imageUrl of [BUSINESS_JSON_LD.image, BUSINESS_JSON_LD.logo]) {
      expect(imageUrl.startsWith(`${SITE_URL}/`), imageUrl).toBe(true);
      expect(existsInPublicFolder(imageUrl), imageUrl).toBe(true);
    }
  });

  it("links the Google Maps listing by the decimal cid of the place id in the reviews link", () => {
    const placeIdHex = GOOGLE_REVIEWS_URL.match(/!1s0x[0-9a-f]+:(0x[0-9a-f]+)/)[1];
    expect(BigInt(placeIdHex).toString()).toBe("11067848269869846630");
    expect(BUSINESS_JSON_LD.sameAs).toContain(`https://maps.google.com/?cid=${BigInt(placeIdHex).toString()}`);
  });

  it("has no AggregateRating or Review markup in the files that write JSON-LD (business rule)", () => {
    for (const file of ["index.html", "scripts/prerender.mjs", "vite.config.js"]) {
      expect(readProjectFile(file), file).not.toMatch(/AggregateRating|aggregateRating|"Review"|"review"\s*:/);
    }
  });
});
