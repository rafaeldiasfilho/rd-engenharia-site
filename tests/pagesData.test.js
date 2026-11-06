// Integrity of the site content. A broken key here blanks whole pages (it happened during the English
// rename on 2026-11-06), so the shape every page and the wizard rely on is checked.
import { describe, expect, it } from "vitest";
import { AREAS, GUIDES, PAGES, PROFILES, RESULTS, findArea, findPage } from "../src/pagesData.js";

const PAGE_TYPES = ["area", "guide", "location", "quiz", "guide-index", "reminder", "privacy", "terms", "credits"];

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
