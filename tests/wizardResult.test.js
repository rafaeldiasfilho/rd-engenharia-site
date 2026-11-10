// Result of the /o-que-preciso wizard, the WhatsApp message built from it, the link to each service card
// and the progress kept in the browser tab (sessionStorage) and in the browser history.
import { describe, expect, it } from "vitest";
import {
  WIZARD_NOTE_MAX_LENGTH,
  WIZARD_PROGRESS_STORAGE_KEY,
  buildWizardHistoryState,
  buildWizardResultHref,
  buildWizardResultSummary,
  buildWizardWhatsappMessage,
  clampWizardStep,
  cleanWizardFreeText,
  clearWizardProgress,
  collectWizardDocumentsToSend,
  collectWizardMarkedFacts,
  collectWizardResults,
  countWizardUnanswered,
  describeWizardUnanswered,
  findWizardMainAreaSlug,
  loadWizardProgress,
  parseWizardProgress,
  readWizardHistoryTag,
  restoreWizardProgress,
  saveWizardProgress,
  shouldOfferWizardEarlyResult,
} from "../src/wizardResult.js";
import { PROFILES, RESULTS, WIZARD_UNKNOWN_DOCUMENT_MESSAGE } from "../src/content/wizard.js";
import { findArea } from "../src/content/areas.js";
import { serviceAnchorId } from "../src/searchIndex.js";

const company = PROFILES.find((p) => p.id === "business");
const rural = PROFILES.find((p) => p.id === "rural");
const asListLines = (lines) => lines.map((line) => `- ${line}`);

// In-memory stand-in for window.sessionStorage, and one that the browser blocks (private mode, full quota).
function createFakeStorage() {
  const values = new Map();
  return {
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}
const blockedStorage = {
  getItem: () => {
    throw new Error("SecurityError");
  },
  setItem: () => {
    throw new Error("QuotaExceededError");
  },
  removeItem: () => {
    throw new Error("SecurityError");
  },
};

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

describe("collectWizardMarkedFacts", () => {
  it("lists the situations answered yes, in question order and in the visitor's words", () => {
    expect(collectWizardMarkedFacts(company, { 6: true, 0: true, 1: false })).toEqual([
      company.situations[0].text,
      company.situations[6].text,
    ]);
  });

  it("returns nothing before a profile is chosen or when every answer is no", () => {
    expect(collectWizardMarkedFacts(undefined, { 0: true })).toEqual([]);
    expect(collectWizardMarkedFacts(company, { 0: false, 1: false })).toEqual([]);
  });
});

describe("early exit (Ver o resultado agora)", () => {
  it("is offered only after the first yes", () => {
    expect(shouldOfferWizardEarlyResult(company, {}, 1)).toBe(false);
    expect(shouldOfferWizardEarlyResult(company, { 0: false }, 2)).toBe(false);
    expect(shouldOfferWizardEarlyResult(company, { 0: true }, 2)).toBe(true);
  });

  it("is not offered before a profile, on the last question or on the result", () => {
    const n = company.situations.length;
    expect(shouldOfferWizardEarlyResult(undefined, { 0: true }, 2)).toBe(false);
    expect(shouldOfferWizardEarlyResult(company, { 0: true }, n)).toBe(false);
    expect(shouldOfferWizardEarlyResult(company, { 0: true }, n + 1)).toBe(false);
  });

  it("counts the unanswered questions as no in the result and in the message", () => {
    const { results, whatsappText, unansweredCount } = buildWizardResultSummary(company, { 0: true, 1: false });
    expect(results.map((r) => r.id)).toEqual(company.situations[0].items);
    expect(unansweredCount).toBe(company.situations.length - 2);
    expect(whatsappText).toContain(`Marquei:\n- ${company.situations[0].text}\nO resultado indicou:`);
    for (const skipped of company.situations.slice(1)) expect(whatsappText).not.toContain(skipped.text);
  });

  it("tells the visitor how many questions were skipped", () => {
    expect(countWizardUnanswered(undefined, {})).toBe(0);
    expect(describeWizardUnanswered(0)).toBe("");
    expect(describeWizardUnanswered(1)).toBe("Uma pergunta ficou sem resposta e conta como “não”.");
    expect(describeWizardUnanswered(5)).toBe("5 perguntas ficaram sem resposta e contam como “não”.");
  });
});

describe("collectWizardDocumentsToSend (Posso enviar)", () => {
  it("uses the 'Para agilizar, separe' list of the area with the most results", () => {
    const results = collectWizardResults(company, { 0: true, 1: true, 3: true }); // 3 work safety, 1 fire safety
    expect(findWizardMainAreaSlug(results)).toBe("seguranca-do-trabalho");
    expect(collectWizardDocumentsToSend(results)).toEqual(findArea("seguranca-do-trabalho").documents);
  });

  it("picks the area that comes first in the result on a tie", () => {
    const results = collectWizardResults(company, { 3: true, 6: true }); // fire safety, then environment
    expect(findWizardMainAreaSlug(results)).toBe("corpo-de-bombeiros");
  });

  it("is empty when nothing was found or the area is unknown", () => {
    expect(collectWizardDocumentsToSend([])).toEqual([]);
    expect(collectWizardDocumentsToSend([{ id: "x", name: "X", area: "area-que-nao-existe" }])).toEqual([]);
  });

  it("closes the message, after the documents found", () => {
    const lines = buildWizardResultSummary(rural, { 1: true }).whatsappText.split("\n");
    const start = lines.indexOf("Posso enviar:");
    expect(start).toBeGreaterThan(lines.indexOf("O resultado indicou:"));
    expect(lines.slice(start + 1)).toEqual(asListLines(findArea("meio-ambiente-topografia").documents));
  });
});

describe("buildWizardWhatsappMessage", () => {
  it("says where the visitor came from, then the case, the city, the marked facts and the documents", () => {
    const { whatsappText } = buildWizardResultSummary(company, { 0: true, 3: true }, { city: "  Ibirá " });
    expect(whatsappText).toBe(
      [
        "Olá! Respondi o passo a passo do site.",
        "Meu caso: tenho uma empresa ou comércio",
        "Cidade: Ibirá",
        "Marquei:",
        "- Tenho funcionários registrados",
        "- Meu estabelecimento não tem AVCB/CLCB ou a licença está vencida",
        "O resultado indicou:",
        "- PGR (Programa de Gerenciamento de Riscos)",
        "- AVCB ou CLCB (Corpo de Bombeiros)",
        "Posso enviar:",
        ...asListLines(findArea("seguranca-do-trabalho").documents),
      ].join("\n")
    );
  });

  it("all no: asks for a conversation and carries what the visitor wrote", () => {
    const { whatsappText } = buildWizardResultSummary(company, { 0: false, 1: false }, { city: "Ibirá", note: "  A prefeitura\n  pediu um laudo " });
    expect(whatsappText).toBe(
      "Olá! Respondi o passo a passo do site.\nMeu caso: tenho uma empresa ou comércio\nCidade: Ibirá\n" +
        "Nenhuma das situações bateu com o meu caso. Gostaria de conversar.\nO que aconteceu: A prefeitura pediu um laudo"
    );
  });

  it("all no without free text or city still asks for a conversation", () => {
    expect(buildWizardWhatsappMessage({ results: [] })).toBe(
      "Olá! Respondi o passo a passo do site.\nNenhuma das situações bateu com o meu caso. Gostaria de conversar."
    );
  });

  it("sends the free text only with the all-no result, the only screen that shows the field", () => {
    expect(buildWizardResultSummary(company, { 0: true }, { note: "texto escondido" }).whatsappText).not.toMatch(/O que aconteceu/);
  });

  it("leaves out an empty city and cuts long free text to the size of the field", () => {
    expect(buildWizardWhatsappMessage({ results: [{ name: "PGR" }], city: "   " })).not.toMatch(/Cidade/);
    const lastLine = buildWizardWhatsappMessage({ results: [], note: "a".repeat(WIZARD_NOTE_MAX_LENGTH + 50) }).split("\n").pop();
    expect(lastLine).toBe(`O que aconteceu: ${"a".repeat(WIZARD_NOTE_MAX_LENGTH)}`);
    expect(cleanWizardFreeText("  um   dois \n tres ", 50)).toBe("um dois tres");
  });

  it("the unknown-document option of the first screen says where the visitor came from", () => {
    expect(WIZARD_UNKNOWN_DOCUMENT_MESSAGE).toBe(
      "Olá! Vim pelo passo a passo do site.\nMe pediram um documento e não sei qual é.\nPosso mandar a foto do pedido?"
    );
  });
});

describe("buildWizardResultHref", () => {
  it("opens the area page on the service card", () => {
    expect(buildWizardResultHref({ id: "pgr", ...RESULTS.pgr })).toBe(
      "/seguranca-do-trabalho#servico-pgr-programa-de-gerenciamento-de-riscos"
    );
  });

  it("falls back to the top of the area page without a service", () => {
    expect(buildWizardResultHref({ area: "engenharia-civil" })).toBe("/engenharia-civil");
  });

  it("every result points to a service card that exists on its area page", () => {
    for (const [id, result] of Object.entries(RESULTS)) {
      const area = findArea(result.area);
      expect(area, id).toBeTruthy();
      expect(area.items.map((item) => serviceAnchorId(item.name)), id).toContain(result.service);
    }
  });
});

describe("saved progress (sessionStorage)", () => {
  it("keeps the profile, the answers and the step under rd_wizard_answers", () => {
    const storage = createFakeStorage();
    expect(saveWizardProgress(storage, { profileId: "business", answers: { 0: true, 1: false }, step: 3 })).toBe(true);
    expect(WIZARD_PROGRESS_STORAGE_KEY).toBe("rd_wizard_answers");
    expect(storage.getItem("rd_wizard_answers")).not.toBeNull();
    expect(loadWizardProgress(storage)).toEqual({ profileId: "business", answers: { 0: true, 1: false }, step: 3 });
  });

  it("Recomeçar clears it", () => {
    const storage = createFakeStorage();
    saveWizardProgress(storage, { profileId: "rural", answers: { 0: true }, step: 2 });
    expect(clearWizardProgress(storage)).toBe(true);
    expect(storage.getItem(WIZARD_PROGRESS_STORAGE_KEY)).toBeNull();
    expect(loadWizardProgress(storage)).toBeNull();
  });

  it("ignores broken or unknown data and keeps only valid answers", () => {
    expect(parseWizardProgress(null)).toBeNull();
    expect(parseWizardProgress("{not json")).toBeNull();
    expect(parseWizardProgress("5")).toBeNull();
    expect(parseWizardProgress(JSON.stringify({ profileId: "unknown", answers: {}, step: 1 }))).toBeNull();
    const raw = JSON.stringify({ profileId: "rural", answers: { 0: true, 1: "sim", 99: true, x: false }, step: 42 });
    expect(parseWizardProgress(raw)).toEqual({ profileId: "rural", answers: { 0: true }, step: rural.situations.length + 1 });
  });

  it("works without storage or with a blocked one (prerender, private mode, full quota)", () => {
    const progress = { profileId: "rural", answers: {}, step: 1 };
    expect(loadWizardProgress(null)).toBeNull();
    expect(saveWizardProgress(null, progress)).toBe(false);
    expect(loadWizardProgress(blockedStorage)).toBeNull();
    expect(saveWizardProgress(blockedStorage, progress)).toBe(false);
  });
});

describe("browser history (Back goes to the previous question)", () => {
  it("tags an entry with its step and depth and keeps the other keys of the state", () => {
    const state = buildWizardHistoryState({ other: 1 }, 2, 2);
    expect(state).toEqual({ other: 1, rdWizardStep: 2, rdWizardDepth: 2 });
    expect(readWizardHistoryTag(state)).toEqual({ step: 2, depth: 2 });
    expect(buildWizardHistoryState(null, 0, 0)).toEqual({ rdWizardStep: 0, rdWizardDepth: 0 });
  });

  it("ignores entries the wizard did not create (anchor links, other scripts)", () => {
    expect(readWizardHistoryTag(null)).toBeNull();
    expect(readWizardHistoryTag({})).toBeNull();
    expect(readWizardHistoryTag({ rdWizardStep: "2", rdWizardDepth: 1 })).toBeNull();
  });

  it("on load, the step of the history entry wins over the saved step", () => {
    const saved = { profileId: "business", answers: { 0: true }, step: 2 };
    expect(restoreWizardProgress(saved, { step: 5, depth: 5 }).step).toBe(5);
    expect(restoreWizardProgress(saved, null)).toEqual(saved);
    expect(restoreWizardProgress(null, { step: 5, depth: 5 })).toEqual({ profileId: "", answers: {}, step: 0 });
  });

  it("keeps the step inside the screens of the profile", () => {
    expect(clampWizardStep(4, undefined)).toBe(0);
    expect(clampWizardStep(-1, rural)).toBe(0);
    expect(clampWizardStep(1.5, rural)).toBe(0);
    expect(clampWizardStep(3, rural)).toBe(3);
    expect(clampWizardStep(99, rural)).toBe(rural.situations.length + 1);
  });
});
