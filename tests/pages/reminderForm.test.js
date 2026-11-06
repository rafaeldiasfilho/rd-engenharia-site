// Validation of the public reminder form: decides what is saved in lembretes_site.
import { describe, expect, it } from "vitest";
import {
  REMINDER_FORM_ERROR_MESSAGES,
  buildReminderRequest,
  lastDayOfMonth,
  normalizeBrazilianWhatsappNumber,
} from "../../src/pages/reminderForm.js";

const validForm = {
  name: "  Maria Teste  ",
  whatsapp: "(17) 99999-9999",
  document: "AVCB ou CLCB (Corpo de Bombeiros)",
  monthNum: "02",
  year: "2028",
  consent: true,
  site: "",
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
});

describe("buildReminderRequest", () => {
  it("builds the request sent to the database", () => {
    expect(buildReminderRequest(validForm)).toEqual({
      code: "SUCCESS_REMINDER_READY",
      reminder: {
        name: "Maria Teste",
        whatsapp: "5517999999999",
        document: "AVCB ou CLCB (Corpo de Bombeiros)",
        expiry: "2028-02-29",
        consent: true,
      },
    });
  });

  it("sends no expiry when the month or the year is missing", () => {
    expect(buildReminderRequest({ ...validForm, monthNum: "" }).reminder.expiry).toBeNull();
    expect(buildReminderRequest({ ...validForm, year: "" }).reminder.expiry).toBeNull();
  });

  it("ignores bots that fill the hidden field", () => {
    expect(buildReminderRequest({ ...validForm, site: "http://spam" })).toEqual({ code: "IGNORED_HONEYPOT_FILLED" });
  });

  it("rejects an invalid WhatsApp number", () => {
    expect(buildReminderRequest({ ...validForm, whatsapp: "9999" }).code).toBe("ERROR_INVALID_WHATSAPP");
  });

  it("rejects a name shorter than 2 letters", () => {
    expect(buildReminderRequest({ ...validForm, name: " a " }).code).toBe("ERROR_NAME_TOO_SHORT");
  });

  it("rejects a request without consent (the database would refuse it too)", () => {
    expect(buildReminderRequest({ ...validForm, consent: false }).code).toBe("ERROR_CONSENT_MISSING");
  });

  it("checks the number before the name and the name before the consent", () => {
    expect(buildReminderRequest({ ...validForm, whatsapp: "1", name: "", consent: false }).code).toBe("ERROR_INVALID_WHATSAPP");
    expect(buildReminderRequest({ ...validForm, name: "", consent: false }).code).toBe("ERROR_NAME_TOO_SHORT");
  });

  it("has a visitor message for every error code", () => {
    for (const code of ["ERROR_INVALID_WHATSAPP", "ERROR_NAME_TOO_SHORT", "ERROR_CONSENT_MISSING"]) {
      expect(REMINDER_FORM_ERROR_MESSAGES[code]).toBeTruthy();
    }
  });
});
