// WhatsApp is the only contact channel: every button on the site goes through whatsappLink.
import { describe, expect, it } from "vitest";
import { WHATSAPP, WHATSAPP_PROJECTS, whatsappLink } from "../src/contact.js";

describe("whatsappLink", () => {
  it("uses the main number by default", () => {
    expect(whatsappLink("Olá")).toBe(`https://wa.me/${WHATSAPP}?text=Ol%C3%A1`);
  });

  it("uses another number when given", () => {
    expect(whatsappLink("Oi", WHATSAPP_PROJECTS).startsWith(`https://wa.me/${WHATSAPP_PROJECTS}?`)).toBe(true);
  });

  it("encodes line breaks, quotes and symbols so the message arrives intact", () => {
    const text = 'Linha 1\nCidade: "Ibirá" & região #1';
    const url = new URL(whatsappLink(text));
    expect(url.searchParams.get("text")).toBe(text);
  });

  it("keeps the numbers in international format (country code 55, digits only)", () => {
    for (const n of [WHATSAPP, WHATSAPP_PROJECTS]) expect(n).toMatch(/^55\d{10,11}$/);
  });
});
