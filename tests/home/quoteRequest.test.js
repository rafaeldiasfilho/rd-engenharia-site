// Message of the home page quote form (opens WhatsApp; nothing goes to a server).
import { describe, expect, it } from "vitest";
import { buildQuoteRequestMessage } from "../../src/home/quoteRequest.js";

const empty = { name: "", city: "", service: "", message: "" };

describe("buildQuoteRequestMessage", () => {
  it("sends only the greeting when the form is empty", () => {
    expect(buildQuoteRequestMessage(empty)).toBe("Olá! Gostaria de solicitar um orçamento.");
  });

  it("adds each filled field on its own line, trimmed", () => {
    expect(buildQuoteRequestMessage({ name: " Maria ", city: "Ibirá ", service: "Corpo de Bombeiros (AVCB e CLCB)", message: " Preciso renovar o AVCB. " })).toBe(
      "Olá! Gostaria de solicitar um orçamento.\nNome: Maria\nCidade: Ibirá\nÁrea: Corpo de Bombeiros (AVCB e CLCB)\nMensagem: Preciso renovar o AVCB."
    );
  });

  it("leaves out fields with only spaces", () => {
    expect(buildQuoteRequestMessage({ ...empty, name: "   ", message: "  " })).toBe("Olá! Gostaria de solicitar um orçamento.");
  });
});
