// WhatsApp messages of the site: first line says where the visitor came from; area blanks; services list.
import { describe, expect, it } from "vitest";
import {
  DOCUMENT_REQUESTERS,
  areaWhatsappMessage,
  documentRequestWhatsappMessage,
  findAreaBySlug,
  generalWhatsappMessage,
  notFoundWhatsappMessage,
  pageWhatsappMessage,
  personWhatsappMessage,
  servicesButtonLabel,
  servicesWhatsappMessage,
  situationWhatsappMessage,
} from "../src/whatsappMessages.js";
import { AREAS } from "../src/content/areas";

const fireArea = findAreaBySlug("corpo-de-bombeiros");

describe("generalWhatsappMessage", () => {
  it("says the visitor came from the site and leaves two blanks", () => {
    expect(generalWhatsappMessage()).toBe("Olá! Vim pelo site e gostaria de um orçamento.\nO que preciso: \nCidade: ");
  });

  it("greets a person of the team by first name", () => {
    expect(personWhatsappMessage("Rafael").startsWith("Olá, Rafael! Vim pelo site")).toBe(true);
  });
});

describe("areaWhatsappMessage", () => {
  it("names the area page and uses the area blanks", () => {
    expect(areaWhatsappMessage(fireArea)).toBe(
      "Olá! Vim pela página de Corpo de Bombeiros do site e gostaria de um orçamento.\n" +
        "Uso do imóvel (comércio, galpão, escola...): \nÁrea construída (m²): \nCidade: "
    );
  });

  it("every area has blanks that end with a colon and a cost drivers text", () => {
    for (const area of AREAS) {
      expect(area.whatsappFields.length).toBeGreaterThan(0);
      for (const field of area.whatsappFields) expect(field.endsWith(":")).toBe(true);
      expect(area.costDrivers).toMatch(/^O valor e o tempo dependem /);
    }
  });

  it("no area text mentions a price or a number of days", () => {
    for (const area of AREAS) {
      const text = `${area.costDrivers} ${area.whatsappFields.join(" ")}`;
      expect(text).not.toMatch(/R\$|\d+\s*dias/);
    }
  });
});

describe("situationWhatsappMessage", () => {
  it("sends the situation sentence the visitor tapped", () => {
    expect(situationWhatsappMessage(fireArea, "Meu AVCB venceu ou está perto de vencer.")).toBe(
      "Olá! Vim pela página de Corpo de Bombeiros do site.\nMeu AVCB venceu ou está perto de vencer.\nPodem me ajudar?\nCidade: "
    );
  });
});

describe("servicesWhatsappMessage", () => {
  it("lists every marked service, one per line", () => {
    const message = servicesWhatsappMessage(fireArea, ["AVCB", "CLCB"]);
    expect(message.split("\n").slice(0, 3)).toEqual([
      "Olá! Vim pela página de Corpo de Bombeiros do site e gostaria de um orçamento para:",
      "- AVCB",
      "- CLCB",
    ]);
  });

  it("falls back to the area message when nothing is marked", () => {
    expect(servicesWhatsappMessage(fireArea, [])).toBe(areaWhatsappMessage(fireArea));
  });

  it("labels the button with the number of marked services", () => {
    expect(servicesButtonLabel(0)).toBe("Falar no WhatsApp");
    expect(servicesButtonLabel(1)).toBe("Enviar o serviço marcado");
    expect(servicesButtonLabel(3)).toBe("Enviar os 3 serviços marcados");
  });
});

describe("pageWhatsappMessage", () => {
  it("uses the area message on area pages and the general one elsewhere", () => {
    expect(pageWhatsappMessage("corpo-de-bombeiros")).toBe(areaWhatsappMessage(fireArea));
    expect(pageWhatsappMessage("")).toBe(generalWhatsappMessage());
    expect(pageWhatsappMessage("termos-de-uso")).toBe(generalWhatsappMessage());
  });
});

describe("documentRequestWhatsappMessage", () => {
  it("says who asked and offers a photo of the request", () => {
    const bank = DOCUMENT_REQUESTERS.find((r) => r.key === "banco");
    expect(documentRequestWhatsappMessage(bank)).toBe(
      "Olá! Vim pelo site.\nO banco me pediu um documento e não sei qual é.\nPosso mandar a foto do pedido?"
    );
  });

  it("has unique keys", () => {
    const keys = DOCUMENT_REQUESTERS.map((r) => r.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("notFoundWhatsappMessage", () => {
  it("includes the broken address when known", () => {
    expect(notFoundWhatsappMessage("/cidade-x")).toBe("Olá! Vim pelo site e não encontrei o que procurava.\nEndereço: /cidade-x");
    expect(notFoundWhatsappMessage("")).toBe("Olá! Vim pelo site e não encontrei o que procurava.");
  });
});
