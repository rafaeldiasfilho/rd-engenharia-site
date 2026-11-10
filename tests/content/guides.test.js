// Guide data used by the guide page, the Article JSON-LD and the sitemap (src/content/guides.js):
// dates, legal sources, the guide's own WhatsApp question, the related service anchor and the reminder link.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { GUIDES, GUIDE_SUMMARIES, formatGuideDate } from "../../src/content/guides.js";
import { findArea } from "../../src/content/areas.js";
import { REMINDER_DOCUMENTS } from "../../src/content/reminder.js";
import { serviceAnchorId } from "../../src/searchIndex.js";

const isRealIsoDate = (iso) =>
  typeof iso === "string" && /^\d{4}-\d{2}-\d{2}$/.test(iso) && new Date(`${iso}T00:00:00Z`).toISOString().slice(0, 10) === iso;

// Hosts allowed for "Base legal" links: official government sites only.
const OFFICIAL_LEGAL_HOSTS = ["gov.br", "planalto.gov.br", "al.sp.gov.br", "corpodebombeiros.sp.gov.br"];
const isOfficialLegalHost = (hostname) => OFFICIAL_LEGAL_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));

describe("guide dates (\"Atualizado em\", Article JSON-LD and sitemap lastmod)", () => {
  it("gives every guide a real published and updated date, with updated on or after published", () => {
    for (const guide of GUIDES) {
      expect(isRealIsoDate(guide.published), `${guide.slug} published`).toBe(true);
      expect(isRealIsoDate(guide.updated), `${guide.slug} updated`).toBe(true);
      expect(guide.updated >= guide.published, guide.slug).toBe(true);
    }
  });

  it("never dates a guide in the future", () => {
    const todayUtc = new Date().toISOString().slice(0, 10);
    for (const guide of GUIDES) expect(guide.updated <= todayUtc, guide.slug).toBe(true);
  });

  it("formats the date as DD/MM/AAAA", () => {
    expect(formatGuideDate("2026-10-13")).toBe("13/10/2026");
  });

  it("returns an empty text for a missing or badly written date, so the page hides the line", () => {
    expect(formatGuideDate(undefined)).toBe("");
    expect(formatGuideDate("")).toBe("");
    expect(formatGuideDate("13/10/2026")).toBe("");
    expect(formatGuideDate("2026-10-13T10:00:00Z")).toBe("");
  });

  it("has the share image used as the Article image for every guide (public/og/guias-<slug>.png)", () => {
    for (const guide of GUIDES) {
      const ogImage = new URL(`../../public/og/${guide.slug.replace(/\//g, "-")}.png`, import.meta.url);
      expect(fs.existsSync(ogImage), guide.slug).toBe(true);
    }
  });
});

describe("guide legal sources (\"Base legal\")", () => {
  it("links every source to an https page of an official government host, with a label", () => {
    for (const guide of GUIDES) {
      expect(Array.isArray(guide.legalSources), guide.slug).toBe(true);
      for (const source of guide.legalSources) {
        const url = new URL(source.url);
        expect(url.protocol, source.url).toBe("https:");
        expect(isOfficialLegalHost(url.hostname), source.url).toBe(true);
        expect(source.label, source.url).toBeTruthy();
      }
    }
  });

  it("lists each source once per guide", () => {
    for (const guide of GUIDES) {
      const urls = guide.legalSources.map((source) => source.url);
      expect(new Set(urls).size, guide.slug).toBe(urls.length);
    }
  });

  it("only cites a norm that the guide's own text names", () => {
    for (const guide of GUIDES) {
      const text = guide.paragraphs.join(" ");
      for (const source of guide.legalSources) {
        expect(source.namedInGuideAs, source.label).toBeTruthy();
        expect(text, `${guide.slug}: ${source.label}`).toContain(source.namedInGuideAs);
      }
    }
  });
});

describe("guide WhatsApp question", () => {
  it("gives every guide its own question and prefilled message", () => {
    for (const guide of GUIDES) {
      expect(guide.whatsappQuestion, guide.slug).toMatch(/\?$/);
      expect(typeof guide.whatsappPrompt, guide.slug).toBe("string");
      expect(guide.whatsappPrompt.length, guide.slug).toBeGreaterThan(0);
    }
  });

  it("keeps the message short: first line says it came from a guide, one item per line, no emoji", () => {
    for (const guide of GUIDES) {
      const lines = guide.whatsappPrompt.split("\n");
      expect(lines[0], guide.slug).toMatch(/^Olá! Li o guia sobre .+ no site\.$/);
      expect(lines.length, guide.slug).toBeLessThanOrEqual(6);
      for (const line of lines.slice(1)) expect(line, guide.slug).toMatch(/: $/);
      expect(guide.whatsappPrompt, guide.slug).not.toMatch(/\p{Extended_Pictographic}/u);
    }
  });

  it("uses a different question on each guide", () => {
    const questions = GUIDES.map((guide) => guide.whatsappQuestion);
    expect(new Set(questions).size).toBe(questions.length);
  });
});

describe("guide links", () => {
  it("points the related service link at a section that exists on the guide's area page", () => {
    for (const guide of GUIDES) {
      const area = findArea(guide.area);
      expect(area, guide.slug).toBeDefined();
      const anchors = ["o-que-fazemos", ...area.items.map((item) => serviceAnchorId(item.name))];
      expect(anchors, guide.slug).toContain(guide.relatedServiceAnchor);
    }
  });

  it("uses only reminder document keys that the reminder form knows", () => {
    const knownKeys = REMINDER_DOCUMENTS.flatMap((reminderDocument) => [reminderDocument.key, ...(reminderDocument.aliases || [])]);
    const guidesWithReminder = GUIDES.filter((guide) => guide.reminderDocumentKey);
    expect(guidesWithReminder.length).toBeGreaterThan(0);
    for (const guide of guidesWithReminder) expect(knownKeys, guide.slug).toContain(guide.reminderDocumentKey);
  });

  it("gives every guide an \"Em resumo\" box", () => {
    for (const guide of GUIDES) expect(GUIDE_SUMMARIES[guide.slug]?.length, guide.slug).toBe(3);
  });
});
