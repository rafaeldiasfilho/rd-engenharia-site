// Validation of the expiry reminder form (/lembrete-de-vencimento). Pure functions, no React:
// the page shows the message for the returned code and sends `reminder` with sendReminder.
// Checks run in this order: honeypot, WhatsApp number, name, consent.

export const REMINDER_FORM_ERROR_MESSAGES = {
  ERROR_INVALID_WHATSAPP: "Confira o número do WhatsApp. Informe o DDD e o número, por exemplo (17) 99999-9999.",
  ERROR_NAME_TOO_SHORT: "Informe o seu nome.",
  ERROR_CONSENT_MISSING: "Marque a autorização para receber os lembretes.",
};

// "2027-02" -> "2027-02-28": the reminder is stored as the last day of the expiry month.
export function lastDayOfMonth(yearMonth) {
  const [year, month] = yearMonth.split("-").map(Number);
  const day = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return `${yearMonth}-${String(day).padStart(2, "0")}`;
}

// Digits only, with Brazil's country code 55. Accepts 10 or 11 digits (DDD + number) or 12–13 with 55.
// Returns null when the number cannot be a Brazilian WhatsApp number.
export function normalizeBrazilianWhatsappNumber(typedNumber) {
  let digits = String(typedNumber || "").replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) digits = "55" + digits;
  if (digits.length < 12 || digits.length > 13) return null;
  return digits;
}

// form: { name, whatsapp, document, monthNum ("01".."12" or ""), year ("2027" or ""), consent, site (honeypot) }
// Returns { code } on failure, or { code: "SUCCESS_REMINDER_READY", reminder } ready for sendReminder.
export function buildReminderRequest(form) {
  if (form.site) return { code: "IGNORED_HONEYPOT_FILLED" };
  const whatsapp = normalizeBrazilianWhatsappNumber(form.whatsapp);
  if (!whatsapp) return { code: "ERROR_INVALID_WHATSAPP" };
  if (form.name.trim().length < 2) return { code: "ERROR_NAME_TOO_SHORT" };
  if (!form.consent) return { code: "ERROR_CONSENT_MISSING" };
  // "Mês do vencimento" (expiry month) comes as two lists (month and year): type="month" does not work in desktop Safari.
  const expiryMonth = form.monthNum && form.year ? `${form.year}-${form.monthNum}` : "";
  return {
    code: "SUCCESS_REMINDER_READY",
    reminder: {
      name: form.name.trim(),
      whatsapp,
      document: form.document,
      expiry: expiryMonth ? lastDayOfMonth(expiryMonth) : null,
      consent: true,
    },
  };
}
