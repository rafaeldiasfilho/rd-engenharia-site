// "Pedir avaliação": WhatsApp message asking a client with a finished service for a Google review.
import { describe, expect, it } from "vitest";
import { GOOGLE_REVIEWS_URL } from "../../src/content/googleAndMaps.js";
import { buildReviewRequestLink, buildReviewRequestMessage, isFinishedService } from "../../src/admin/reviewRequest.js";

const textOfLink = (link) => new URL(link).searchParams.get("text");

describe("isFinishedService", () => {
  it("is true for a concluded service or a closed one", () => {
    expect(isFinishedService({ status: "concluido", encerrado: false })).toBe(true);
    expect(isFinishedService({ status: "orcamento", encerrado: true })).toBe(true);
  });

  it("is false for a quote or a service in progress that is still open", () => {
    expect(isFinishedService({ status: "orcamento", encerrado: false })).toBe(false);
    expect(isFinishedService({ status: "em_andamento" })).toBe(false);
    expect(isFinishedService(null)).toBe(false);
  });
});

describe("buildReviewRequestMessage", () => {
  it("greets the client, names the service and ends with the Google reviews link", () => {
    expect(buildReviewRequestMessage("Maria", "AVCB")).toBe(
      `Olá, Maria! Aqui é da RD Engenharia. Obrigado pela confiança no serviço "AVCB". Se puder, deixe a sua avaliação no Google contando como foi o atendimento. Isso nos ajuda muito: ${GOOGLE_REVIEWS_URL}`
    );
  });

  it("still reads well without a name or a service type", () => {
    const message = buildReviewRequestMessage("  ", "");
    expect(message.startsWith("Olá! Aqui é da RD Engenharia. Obrigado pela confiança. Se puder")).toBe(true);
    expect(message.endsWith(GOOGLE_REVIEWS_URL)).toBe(true);
  });

  it("asks for an honest opinion: no number of stars", () => {
    expect(buildReviewRequestMessage("Maria", "AVCB")).not.toMatch(/estrela/i);
  });
});

describe("buildReviewRequestLink", () => {
  const finished = { status: "concluido", tipo: "Laudo de insalubridade", encerrado: false };

  it("opens WhatsApp with the client's number and the message, link included", () => {
    const link = buildReviewRequestLink({ nome: "Maria", whatsapp: "(17) 99999-9999" }, finished);
    expect(link.startsWith("https://wa.me/5517999999999?text=")).toBe(true);
    expect(textOfLink(link)).toBe(buildReviewRequestMessage("Maria", "Laudo de insalubridade"));
    expect(textOfLink(link)).toContain(GOOGLE_REVIEWS_URL);
  });

  it("uses the other phone when there is no WhatsApp number", () => {
    const link = buildReviewRequestLink({ nome: "Maria", whatsapp: "", telefone: "17 3333-4444" }, finished);
    expect(link.startsWith("https://wa.me/551733334444?text=")).toBe(true);
  });

  it("is empty (no button) when the client has neither WhatsApp nor phone", () => {
    expect(buildReviewRequestLink({ nome: "Maria", whatsapp: "", telefone: "" }, finished)).toBe("");
    expect(buildReviewRequestLink({ nome: "Maria" }, finished)).toBe("");
  });

  it("is empty (no button) while the service is not finished", () => {
    expect(buildReviewRequestLink({ nome: "Maria", whatsapp: "17999999999" }, { status: "em_andamento" })).toBe("");
    expect(buildReviewRequestLink(null, finished)).toBe("");
  });
});
