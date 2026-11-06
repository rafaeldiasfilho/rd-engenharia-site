// Result of the /o-que-preciso wizard and the WhatsApp message built from it.
import { describe, expect, it } from "vitest";
import { buildWizardWhatsappMessage, collectWizardResults } from "../src/wizardResult.js";
import { PROFILES, RESULTS } from "../src/content/wizard.js";

const company = PROFILES.find((p) => p.id === "empresa");

describe("collectWizardResults", () => {
  it("returns nothing before a profile is chosen", () => {
    expect(collectWizardResults(undefined, {})).toEqual([]);
  });

  it("lists the documents of every situation answered yes, in order", () => {
    const results = collectWizardResults(company, { 0: true, 1: true, 2: false });
    const expected = [...company.situations[0].items, ...company.situations[1].items];
    expect(results.map((r) => r.id)).toEqual([...new Set(expected)]);
    expect(results[0]).toEqual({ id: results[0].id, ...RESULTS[results[0].id] });
  });

  it("does not repeat a document suggested by two situations", () => {
    const all = Object.fromEntries(company.situations.map((_, i) => [i, true]));
    const ids = collectWizardResults(company, all).map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("returns nothing when every answer is no", () => {
    expect(collectWizardResults(company, { 0: false, 1: false })).toEqual([]);
  });
});

describe("buildWizardWhatsappMessage", () => {
  const results = [{ id: "pgr", name: "PGR" }, { id: "ltcat", name: "LTCAT e PPP" }];

  it("lists the documents, the case and the city", () => {
    expect(buildWizardWhatsappMessage({ results, profileName: "Tenho uma empresa ou comércio", city: "  Ibirá " })).toBe(
      "Olá! Fiz o guia do site e acho que preciso de:\n- PGR\n- LTCAT e PPP\nMeu caso: tenho uma empresa ou comércio\nCidade: Ibirá"
    );
  });

  it("asks for a conversation when nothing matched", () => {
    expect(buildWizardWhatsappMessage({ results: [], profileName: "", city: "" })).toBe(
      "Olá! Fiz o guia do site e nenhuma opção bateu com o meu caso. Gostaria de conversar."
    );
  });

  it("leaves out an empty city", () => {
    expect(buildWizardWhatsappMessage({ results, profileName: "", city: "   " })).not.toMatch(/Cidade/);
  });
});
