// Reminder form (/lembrete-de-vencimento): what is saved in lembretes_site, which errors the visitor sees and the
// WhatsApp texts. "Today" is fixed so the past-month checks do not depend on the day the tests run.
import { describe, expect, it } from "vitest";
import {
  DEFAULT_REMINDER_DOCUMENT_KEY,
  REMINDER_DOCUMENTS,
  REMINDER_DOCUMENT_LINK_KEYS,
  buildReminderPageHref,
  findReminderDocument,
} from "../../src/content/reminder.js";
import {
  INITIAL_REMINDER_FORM,
  REMINDER_ALREADY_RECEIVED_MESSAGE,
  REMINDER_FORM_ERROR_MESSAGES,
  buildExpiredDocumentWhatsappMessage,
  buildReminderConfirmWhatsappMessage,
  buildReminderRequest,
  buildReminderSendFailedWhatsappMessage,
  buildReminderSuccessText,
  buildReminderYearOptions,
  classifyReminderSendError,
  isReminderExpiryInPast,
  lastDayOfMonth,
  normalizeBrazilianWhatsappNumber,
  readReminderDocumentKeyFromSearch,
  startAnotherReminderForm,
} from "../../src/pages/reminderForm.js";

const TODAY = new Date(2026, 10, 9); // 9 November 2026, local time

const validForm = {
  name: "  Maria Teste  ",
  whatsapp: "(17) 99999-9999",
  documentKey: "avcb",
  monthNum: "02",
  year: "2028",
  consent: true,
  site: "",
};

const savedReminder = {
  name: "Maria Teste",
  whatsapp: "5517999999999",
  document: "AVCB ou CLCB (Corpo de Bombeiros)",
  expiry: "2028-02-29",
  consent: true,
};

describe("lastDayOfMonth", () => {
  it("returns the last day of the month, leap years included", () => {
    expect(lastDayOfMonth("2027-02")).toBe("2027-02-28");
    expect(lastDayOfMonth("2028-02")).toBe("2028-02-29");
    expect(lastDayOfMonth("2026-12")).toBe("2026-12-31");
    expect(lastDayOfMonth("2026-04")).toBe("2026-04-30");
  });
});

describe("normalizeBrazilianWhatsappNumber", () => {
  it("adds 55 to a number with DDD and keeps only digits", () => {
    expect(normalizeBrazilianWhatsappNumber("(17) 99999-9999")).toBe("5517999999999");
    expect(normalizeBrazilianWhatsappNumber("17 3333-4444")).toBe("551733334444");
  });

  it("accepts a number that already has 55", () => {
    expect(normalizeBrazilianWhatsappNumber("+55 17 99999-9999")).toBe("5517999999999");
  });

  it("rejects numbers that are too short or too long", () => {
    expect(normalizeBrazilianWhatsappNumber("99999-9999")).toBeNull();
    expect(normalizeBrazilianWhatsappNumber("12345678901234")).toBeNull();
    expect(normalizeBrazilianWhatsappNumber("")).toBeNull();
  });

  it("keeps 12 or 13 digits only when they already start with 55", () => {
    expect(normalizeBrazilianWhatsappNumber("551733334444")).toBe("551733334444");
    expect(normalizeBrazilianWhatsappNumber("123456789012")).toBeNull();
    expect(normalizeBrazilianWhatsappNumber("1234567890123")).toBeNull();
  });

  it("always returns ^55 followed by 10 or 11 digits, or null", () => {
    const typedNumbers = ["(17) 99999-9999", "1733334444", "+55 17 3333-4444", "5517999999999", "123456789012", "9", "abc", "55 55 99999-9999"];
    for (const typedNumber of typedNumbers) {
      const normalized = normalizeBrazilianWhatsappNumber(typedNumber);
      expect(normalized === null || /^55\d{10,11}$/.test(normalized)).toBe(true);
    }
  });

  it("shows the WhatsApp error for a 12 or 13 digit number without 55", () => {
    expect(buildReminderRequest({ ...validForm, whatsapp: "123456789012" }, TODAY).code).toBe("ERROR_INVALID_WHATSAPP");
  });
});

describe("buildReminderRequest", () => {
  it("builds the request sent to the database, with the label of the chosen document", () => {
    expect(buildReminderRequest(validForm, TODAY)).toEqual({ code: "SUCCESS_REMINDER_READY", reminder: savedReminder });
  });

  it("sends no expiry when the month or the year is missing", () => {
    expect(buildReminderRequest({ ...validForm, monthNum: "" }, TODAY).reminder.expiry).toBeNull();
    expect(buildReminderRequest({ ...validForm, year: "" }, TODAY).reminder.expiry).toBeNull();
  });

  it("ignores bots that fill the hidden field, before checking anything else", () => {
    expect(buildReminderRequest({ ...validForm, name: "", site: "http://spam" }, TODAY)).toEqual({ code: "IGNORED_HONEYPOT_FILLED" });
  });

  it("rejects an invalid WhatsApp number", () => {
    expect(buildReminderRequest({ ...validForm, whatsapp: "9999" }, TODAY)).toEqual({
      code: "ERROR_INVALID_WHATSAPP",
      fieldErrors: [{ field: "whatsapp", code: "ERROR_INVALID_WHATSAPP" }],
    });
  });

  it("rejects a name shorter than 2 letters", () => {
    expect(buildReminderRequest({ ...validForm, name: " a " }, TODAY).code).toBe("ERROR_NAME_TOO_SHORT");
  });

  it("rejects a missing or unknown document", () => {
    expect(buildReminderRequest({ ...validForm, documentKey: "" }, TODAY).code).toBe("ERROR_DOCUMENT_NOT_CHOSEN");
    expect(buildReminderRequest({ ...validForm, documentKey: "pcmso" }, TODAY).code).toBe("ERROR_DOCUMENT_NOT_CHOSEN");
  });

  it("rejects a request without consent (the database would refuse it too)", () => {
    expect(buildReminderRequest({ ...validForm, consent: false }, TODAY).code).toBe("ERROR_CONSENT_MISSING");
  });

  it("returns every field error at once, in screen order, and nothing to send", () => {
    const allWrong = { name: " ", whatsapp: "1", documentKey: "", monthNum: "03", year: "2026", consent: false, site: "" };
    expect(buildReminderRequest(allWrong, TODAY)).toEqual({
      code: "ERROR_NAME_TOO_SHORT",
      fieldErrors: [
        { field: "name", code: "ERROR_NAME_TOO_SHORT" },
        { field: "whatsapp", code: "ERROR_INVALID_WHATSAPP" },
        { field: "document", code: "ERROR_DOCUMENT_NOT_CHOSEN" },
        { field: "expiry", code: "ERROR_DOCUMENT_ALREADY_EXPIRED" },
        { field: "consent", code: "ERROR_CONSENT_MISSING" },
      ],
    });
  });

  it("has a visitor message for every error code", () => {
    const codes = ["ERROR_NAME_TOO_SHORT", "ERROR_INVALID_WHATSAPP", "ERROR_DOCUMENT_NOT_CHOSEN", "ERROR_DOCUMENT_ALREADY_EXPIRED", "ERROR_CONSENT_MISSING"];
    for (const code of codes) expect(REMINDER_FORM_ERROR_MESSAGES[code]).toBeTruthy();
  });
});

describe("expiry month in the past", () => {
  it("does not send a month that already passed this year", () => {
    const request = buildReminderRequest({ ...validForm, monthNum: "10", year: "2026" }, TODAY);
    expect(request.code).toBe("ERROR_DOCUMENT_ALREADY_EXPIRED");
    expect(request.reminder).toBeUndefined();
    expect(REMINDER_FORM_ERROR_MESSAGES.ERROR_DOCUMENT_ALREADY_EXPIRED).toBe(
      "Esse documento já venceu. Fale agora pelo WhatsApp para regularizar."
    );
  });

  it("treats a past year as expired, with or without the month", () => {
    expect(isReminderExpiryInPast({ monthNum: "12", year: "2025" }, TODAY)).toBe(true);
    expect(isReminderExpiryInPast({ monthNum: "", year: "2025" }, TODAY)).toBe(true);
  });

  it("accepts the current month, later months and an incomplete date", () => {
    expect(isReminderExpiryInPast({ monthNum: "11", year: "2026" }, TODAY)).toBe(false);
    expect(isReminderExpiryInPast({ monthNum: "12", year: "2026" }, TODAY)).toBe(false);
    expect(isReminderExpiryInPast({ monthNum: "01", year: "2027" }, TODAY)).toBe(false);
    expect(isReminderExpiryInPast({ monthNum: "01", year: "" }, TODAY)).toBe(false);
    expect(isReminderExpiryInPast({ monthNum: "", year: "2026" }, TODAY)).toBe(false);
  });

  it("offers the 2 past years and the next 5 in the year list", () => {
    expect(buildReminderYearOptions(TODAY)).toEqual(["2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031"]);
  });
});

describe("success screen", () => {
  it("promises the warning before the expiry only when a month was saved", () => {
    expect(buildReminderSuccessText(savedReminder)).toBe(
      "Obrigado! Guardamos o seu pedido e vamos avisar você pelo WhatsApp antes do vencimento. Se quiser desistir a qualquer momento, é só nos dizer."
    );
    const withoutMonth = buildReminderSuccessText({ ...savedReminder, expiry: null });
    expect(withoutMonth).toBe(
      "Obrigado! Guardamos o seu pedido. A equipe vai confirmar a data com você pelo WhatsApp. Se quiser desistir a qualquer momento, é só nos dizer."
    );
    expect(withoutMonth).not.toContain("antes do vencimento");
  });

  it("builds the Confirmar pelo WhatsApp message from what was saved, one item per line", () => {
    expect(buildReminderConfirmWhatsappMessage(savedReminder)).toBe(
      "Olá! Pedi no site o lembrete de vencimento.\nDocumento: AVCB ou CLCB (Corpo de Bombeiros)\nVence em: 02/2028\nNome: Maria Teste"
    );
  });

  it("confirm message: 'Vencimento: data não informada' without a month, and no name line when the name is empty", () => {
    expect(buildReminderConfirmWhatsappMessage({ ...savedReminder, expiry: null, name: "" })).toBe(
      "Olá! Pedi no site o lembrete de vencimento.\nDocumento: AVCB ou CLCB (Corpo de Bombeiros)\nVencimento: data não informada"
    );
  });

  it("treats a duplicate request (HTTP 409) as already received and any other error as a failure", () => {
    expect(classifyReminderSendError(new Error("Reminder request failed: HTTP 409"))).toBe("SUCCESS_REMINDER_ALREADY_RECEIVED");
    expect(classifyReminderSendError(new Error("Reminder request failed: HTTP 400"))).toBe("ERROR_REMINDER_SEND_FAILED");
    expect(classifyReminderSendError(new Error("Reminder request failed: HTTP 500"))).toBe("ERROR_REMINDER_SEND_FAILED");
    expect(classifyReminderSendError(new TypeError("Failed to fetch"))).toBe("ERROR_REMINDER_SEND_FAILED");
    expect(classifyReminderSendError(undefined)).toBe("ERROR_REMINDER_SEND_FAILED");
    expect(REMINDER_ALREADY_RECEIVED_MESSAGE).toBe("Esse pedido já tinha sido recebido. A equipe vai falar com você pelo WhatsApp.");
  });

  it("starts another reminder keeping only the name and the WhatsApp", () => {
    expect(startAnotherReminderForm({ ...validForm, site: "x" })).toEqual({
      name: "  Maria Teste  ",
      whatsapp: "(17) 99999-9999",
      documentKey: "",
      monthNum: "",
      year: "",
      consent: false,
      site: "",
    });
  });
});

describe("WhatsApp messages with what the visitor typed", () => {
  it("expired document: document, month and name, one per line", () => {
    expect(buildExpiredDocumentWhatsappMessage({ ...validForm, monthNum: "03", year: "2026" })).toBe(
      "Olá! Vim pela página de lembrete de vencimento do site. Meu documento já venceu e quero regularizar.\n" +
        "Documento: AVCB ou CLCB (Corpo de Bombeiros)\nVenceu em: 03/2026\nNome: Maria Teste"
    );
  });

  it("expired document: leaves out a name not typed and shows a year given alone", () => {
    expect(buildExpiredDocumentWhatsappMessage({ ...validForm, name: " ", monthNum: "", year: "2025" })).toBe(
      "Olá! Vim pela página de lembrete de vencimento do site. Meu documento já venceu e quero regularizar.\n" +
        "Documento: AVCB ou CLCB (Corpo de Bombeiros)\nVenceu em: 2025"
    );
  });

  it("failed sending: carries the document, the month or 'data não informada', and the name", () => {
    expect(buildReminderSendFailedWhatsappMessage({ ...validForm, documentKey: "pgr" })).toBe(
      "Olá! Tentei pedir o lembrete de vencimento pelo site, mas não consegui enviar.\n" +
        "Documento: PGR (gerenciamento de riscos)\nVencimento: 02/2028\nNome: Maria Teste"
    );
    expect(buildReminderSendFailedWhatsappMessage({ ...validForm, monthNum: "", year: "" })).toContain("\nVencimento: data não informada\n");
  });
});

describe("readReminderDocumentKeyFromSearch (?documento=<key>)", () => {
  it("chooses the document of the link", () => {
    expect(readReminderDocumentKeyFromSearch("?documento=pgr")).toBe("pgr");
    expect(readReminderDocumentKeyFromSearch("?origem=area&documento=car")).toBe("car");
  });

  it("opens the main option of an alias, ignoring case and spaces", () => {
    expect(readReminderDocumentKeyFromSearch("?documento=clcb")).toBe("avcb");
    expect(readReminderDocumentKeyFromSearch("?documento=PPP")).toBe("ltcat");
    expect(readReminderDocumentKeyFromSearch("?documento=%20Outorga%20")).toBe("car");
  });

  it("keeps the default document for a missing, empty or unknown key", () => {
    for (const search of ["", "?", "?documento=", "?documento=pcmso", "?doc=pgr", "?documento=pgr%3Cscript%3E"]) {
      expect(readReminderDocumentKeyFromSearch(search)).toBe(DEFAULT_REMINDER_DOCUMENT_KEY);
    }
    expect(DEFAULT_REMINDER_DOCUMENT_KEY).toBe("avcb");
    expect(INITIAL_REMINDER_FORM.documentKey).toBe("avcb");
  });
});

describe("reminder document keys (other pages link with them)", () => {
  it("keeps the published list of link keys", () => {
    expect(REMINDER_DOCUMENT_LINK_KEYS).toEqual([
      "avcb", "clcb", "pgr", "ltcat", "ppp", "insalubridade", "periculosidade",
      "treinamento", "alvara", "car", "licenciamento", "outorga", "outro",
    ]);
  });

  it("uses unique lowercase ASCII keys and gives every option a label", () => {
    expect(new Set(REMINDER_DOCUMENT_LINK_KEYS).size).toBe(REMINDER_DOCUMENT_LINK_KEYS.length);
    for (const key of REMINDER_DOCUMENT_LINK_KEYS) expect(key).toMatch(/^[a-z0-9-]+$/);
    for (const reminderDocument of REMINDER_DOCUMENTS) expect(reminderDocument.label).toBeTruthy();
    expect(findReminderDocument(DEFAULT_REMINDER_DOCUMENT_KEY).key).toBe(DEFAULT_REMINDER_DOCUMENT_KEY);
  });

  it("builds the link that preselects a document", () => {
    expect(buildReminderPageHref("pgr")).toBe("/lembrete-de-vencimento?documento=pgr");
    expect(readReminderDocumentKeyFromSearch(buildReminderPageHref("clcb").split("?")[1])).toBe("avcb");
  });
});

describe("normalizeBrazilianWhatsappNumber with a leading zero", () => {
  it("drops the leading zero of the long-distance habit", () => {
    expect(normalizeBrazilianWhatsappNumber("017 99999-9999")).toBe("5517999999999");
    expect(normalizeBrazilianWhatsappNumber("(017) 3333-4444")).toBe("551733334444");
  });
});
