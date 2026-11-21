// Header menus: every guide is listed with a readable name, and the coverage cards only use photos that
// exist and are credited on /creditos (a missing photo would show an empty card).
import { describe, expect, it } from "vitest";
import { COVERAGE_MENU_CARDS, GUIDES_MENU_ITEMS } from "../../src/content/headerMenus.js";
import { GUIDES } from "../../src/content/guides.js";
import { PHOTOS } from "../../src/content/photoList.js";
import { PHOTOS_IN_USE } from "../../src/content/photoCarousels.js";

describe("GUIDES_MENU_ITEMS", () => {
  it("lists every guide once, with its page title and address", () => {
    expect(GUIDES_MENU_ITEMS).toHaveLength(GUIDES.length);
    expect(new Set(GUIDES_MENU_ITEMS.map((menuItem) => menuItem.href)).size).toBe(GUIDES.length);
    for (const menuItem of GUIDES_MENU_ITEMS) {
      expect(menuItem.href).toMatch(/^\/guias\/[a-z0-9-]+$/);
      expect(menuItem.label.trim().length).toBeGreaterThan(0);
    }
  });

  it("never shows the long SEO title in the menu", () => {
    for (const menuItem of GUIDES_MENU_ITEMS) {
      expect(menuItem.label).not.toContain("|");
    }
  });
});

describe("COVERAGE_MENU_CARDS", () => {
  it("has the two service modes of the coverage page", () => {
    expect(COVERAGE_MENU_CARDS.map((coverageCard) => coverageCard.label)).toEqual(["Presencial", "Online"]);
  });

  it("only uses photos that exist in the photo list", () => {
    for (const coverageCard of COVERAGE_MENU_CARDS) {
      expect(PHOTOS[coverageCard.photo], coverageCard.photo).toBeDefined();
    }
  });

  it("only uses photos that are credited on /creditos", () => {
    const creditedFiles = new Set(PHOTOS_IN_USE.map((creditedPhoto) => creditedPhoto.file));
    for (const coverageCard of COVERAGE_MENU_CARDS) {
      expect(creditedFiles.has(PHOTOS[coverageCard.photo].file), coverageCard.photo).toBe(true);
    }
  });

  it("links every card to the coverage page", () => {
    for (const coverageCard of COVERAGE_MENU_CARDS) {
      expect(coverageCard.href.startsWith("/onde-atendemos")).toBe(true);
    }
  });
});
