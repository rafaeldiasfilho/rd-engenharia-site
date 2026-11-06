// WhatsApp links to clients from the internal area (reminder and contact buttons).
import { describe, expect, it } from "vitest";
import { buildClientWhatsappLink } from "../../src/admin/clientWhatsapp.js";

describe("buildClientWhatsappLink", () => {
  it("adds the country code 55 to a number typed with DDD", () => {
    expect(buildClientWhatsappLink("(17) 99999-9999", "Oi")).toBe("https://wa.me/5517999999999?text=Oi");
    expect(buildClientWhatsappLink("17 3333-4444", "Oi")).toBe("https://wa.me/551733334444?text=Oi");
  });

  it("keeps a number that already has the country code", () => {
    expect(buildClientWhatsappLink("+55 17 99999-9999", "Oi")).toBe("https://wa.me/5517999999999?text=Oi");
  });

  it("returns an empty string when the client has no number (no button is shown)", () => {
    expect(buildClientWhatsappLink("", "Oi")).toBe("");
    expect(buildClientWhatsappLink(null, "Oi")).toBe("");
    expect(buildClientWhatsappLink("sem telefone", "Oi")).toBe("");
  });

  it("encodes the message", () => {
    const url = new URL(buildClientWhatsappLink("17999999999", 'Olá, Maria! Seu "AVCB" vence em 06/11/2026.'));
    expect(url.searchParams.get("text")).toBe('Olá, Maria! Seu "AVCB" vence em 06/11/2026.');
  });
});
