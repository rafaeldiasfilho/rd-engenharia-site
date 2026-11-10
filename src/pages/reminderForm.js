// Expiry reminder form (/lembrete-de-vencimento). Pure functions, no React: the page shows the message of
// each returned code next to its field, sends `reminder` with sendReminder and takes its WhatsApp texts from here.
// Checks run honeypot first, then every field in screen order: name, WhatsApp, document, expiry month, consent.

import { DEFAULT_REMINDER_DOCUMENT_KEY, findReminderDocument } from "../content/reminder.js";

export const REMINDER_FORM_ERROR_MESSAGES = {
  ERROR_NAME_TOO_SHORT: "Informe o seu nome.",
  ERROR_INVALID_WHATSAPP: "Confira o número do WhatsApp. Informe o DDD e o número, por exemplo (17) 99999-9999.",
  ERROR_DOCUMENT_NOT_CHOSEN: "Escolha o documento.",
  ERROR_DOCUMENT_ALREADY_EXPIRED: "Esse documento já venceu. Fale agora pelo WhatsApp para regularizar.",
  ERROR_CONSENT_MISSING: "Marque a autorização para receber os lembretes.",
};

// Shown when Supabase refuses the row or there is no network. The form stays filled.
export const REMINDER_SEND_FAILED_MESSAGE = "Não foi possível enviar agora. Tente de novo ou chame a RD pelo WhatsApp.";

// Shown instead of the failure when the database already has this request (same number and document within 24 hours).
export const REMINDER_ALREADY_RECEIVED_MESSAGE = "Esse pedido já tinha sido recebido. A equipe vai falar com você pelo WhatsApp.";

// sendReminder rejects with Error("Reminder request failed: HTTP 409") for a duplicate request: it is already saved,
// so it counts as received. Any other error (other status, no network) is a failure.
export function classifyReminderSendError(sendError) {
  const message = String(sendError?.message || "");
  return /HTTP 409\b/.test(message) ? "SUCCESS_REMINDER_ALREADY_RECEIVED" : "ERROR_REMINDER_SEND_FAILED";
}

// form: { name, whatsapp, documentKey, monthNum ("01".."12" or ""), year ("2027" or ""), consent, site (honeypot) }
export const INITIAL_REMINDER_FORM = {
  name: "",
  whatsapp: "",
  documentKey: DEFAULT_REMINDER_DOCUMENT_KEY,
  monthNum: "",
  year: "",
  consent: false,
  site: "",
};

// "2027-02" -> "2027-02-28": the reminder is stored as the last day of the expiry month.
export function lastDayOfMonth(yearMonth) {
  const [year, month] = yearMonth.split("-").map(Number);
  const day = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return `${yearMonth}-${String(day).padStart(2, "0")}`;
}

// The only format saved in lembretes_site.whatsapp: country code 55, DDD and number.
const BRAZILIAN_WHATSAPP_PATTERN = /^55\d{10,11}$/;

// Digits only, always matching BRAZILIAN_WHATSAPP_PATTERN. Leading zeros of the long-distance habit
// ("017 99999-9999") are dropped first. 10 or 11 digits (DDD + number) get 55 in front;
// 12 or 13 digits are kept only when they already start with 55. Anything else returns null.
export function normalizeBrazilianWhatsappNumber(typedNumber) {
  const digits = String(typedNumber || "").replace(/\D/g, "").replace(/^0+/, "");
  const withCountryCode = digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
  return BRAZILIAN_WHATSAPP_PATTERN.test(withCountryCode) ? withCountryCode : null;
}

// "Mês do vencimento" (expiry month) comes as two lists (month and year): type="month" does not work in desktop Safari.
// "2027-03" when both were chosen, "" otherwise (the month is optional).
export const readExpiryMonth = (form) => (form.monthNum && form.year ? `${form.year}-${form.monthNum}` : "");

// true when the chosen year, or the chosen month of the current year, has already passed.
// The current month is still valid: the document expires at the end of it.
export function isReminderExpiryInPast(form, today) {
  if (!form.year) return false;
  const currentYear = today.getFullYear();
  if (Number(form.year) !== currentYear) return Number(form.year) < currentYear;
  return Boolean(form.monthNum) && Number(form.monthNum) < today.getMonth() + 1;
}

// One check per field, in screen order. Each returns an error code, or "" when the field is fine.
const REMINDER_FIELD_CHECKS = [
  ["name", (form) => (form.name.trim().length < 2 ? "ERROR_NAME_TOO_SHORT" : "")],
  ["whatsapp", (form) => (normalizeBrazilianWhatsappNumber(form.whatsapp) ? "" : "ERROR_INVALID_WHATSAPP")],
  ["document", (form) => (findReminderDocument(form.documentKey) ? "" : "ERROR_DOCUMENT_NOT_CHOSEN")],
  ["expiry", (form, today) => (isReminderExpiryInPast(form, today) ? "ERROR_DOCUMENT_ALREADY_EXPIRED" : "")],
  ["consent", (form) => (form.consent ? "" : "ERROR_CONSENT_MISSING")],
];

// Every field error, in screen order: [{ field: "name", code: "ERROR_NAME_TOO_SHORT" }, ...]; [] when all are fine.
export function collectReminderFieldErrors(form, today) {
  return REMINDER_FIELD_CHECKS.map(([field, check]) => ({ field, code: check(form, today) })).filter((fieldError) => fieldError.code);
}

// Returns { code: "IGNORED_HONEYPOT_FILLED" } for bots; { code: <first error code>, fieldErrors } when a field
// is wrong (nothing is sent); or { code: "SUCCESS_REMINDER_READY", reminder } ready for sendReminder.
export function buildReminderRequest(form, today = new Date()) {
  if (form.site) return { code: "IGNORED_HONEYPOT_FILLED" };
  const fieldErrors = collectReminderFieldErrors(form, today);
  if (fieldErrors.length > 0) return { code: fieldErrors[0].code, fieldErrors };
  const expiryMonth = readExpiryMonth(form);
  return {
    code: "SUCCESS_REMINDER_READY",
    reminder: {
      name: form.name.trim(),
      whatsapp: normalizeBrazilianWhatsappNumber(form.whatsapp),
      document: findReminderDocument(form.documentKey).label,
      expiry: expiryMonth ? lastDayOfMonth(expiryMonth) : null,
      consent: true,
    },
  };
}

// /lembrete-de-vencimento?documento=pgr opens the form with that document chosen. An alias opens its
// document (?documento=clcb -> "avcb"); a missing or unknown key keeps the default document.
export function readReminderDocumentKeyFromSearch(search) {
  const linkKey = (new URLSearchParams(search).get("documento") || "").trim().toLowerCase();
  const reminderDocument = findReminderDocument(linkKey);
  return reminderDocument ? reminderDocument.key : DEFAULT_REMINDER_DOCUMENT_KEY;
}

// "Ano" (year) list: the 2 past years (so the visitor can say the document already expired) and the next 5.
export function buildReminderYearOptions(today) {
  const firstYear = today.getFullYear() - 2;
  return Array.from({ length: 8 }, (_, i) => String(firstYear + i));
}

// "Avisar sobre outro documento" (another document): keeps the name and the WhatsApp; the document is chosen again.
export function startAnotherReminderForm(form) {
  return { ...INITIAL_REMINDER_FORM, documentKey: "", name: form.name, whatsapp: form.whatsapp };
}

// WhatsApp messages: one item per line; an item left blank is left out.
const joinReminderMessageLines = (lines) => lines.filter(Boolean).join("\n");

// Saved expiry "2028-02-29" -> "02/2028" (same format as the /admin list).
const formatSavedExpiry = (expiry) => expiry.slice(0, 7).split("-").reverse().join("/");

// "Pedido recebido" (request received) text. Without a month it does not promise a warning before the expiry.
export function buildReminderSuccessText(reminder) {
  const nextStep = reminder.expiry
    ? "Guardamos o seu pedido e vamos avisar você pelo WhatsApp antes do vencimento."
    : "Guardamos o seu pedido. A equipe vai confirmar a data com você pelo WhatsApp.";
  return `Obrigado! ${nextStep} Se quiser desistir a qualquer momento, é só nos dizer.`;
}

// "Confirmar pelo WhatsApp" message of the success screen, built from what was saved.
export function buildReminderConfirmWhatsappMessage(reminder) {
  return joinReminderMessageLines([
    "Olá! Pedi no site o lembrete de vencimento.",
    `Documento: ${reminder.document}`,
    reminder.expiry ? `Vence em: ${formatSavedExpiry(reminder.expiry)}` : "Vencimento: data não informada",
    reminder.name ? `Nome: ${reminder.name}` : "",
  ]);
}

// Expiry as the visitor typed it: "03/2027", "2027" (year only) or "" (not given).
function formatTypedExpiry(form) {
  if (!form.year) return "";
  return form.monthNum ? `${form.monthNum}/${form.year}` : form.year;
}

// Lines with what the visitor typed; an item left blank is left out of the message.
function typedReminderLines(form, expiryLabel, expiryText) {
  const reminderDocument = findReminderDocument(form.documentKey);
  const name = form.name.trim();
  return [
    reminderDocument ? `Documento: ${reminderDocument.label}` : "",
    expiryText ? `${expiryLabel}: ${expiryText}` : "",
    name ? `Nome: ${name}` : "",
  ];
}

// The chosen month has passed: nothing is saved and the visitor talks to RD to regularize the document.
export function buildExpiredDocumentWhatsappMessage(form) {
  return joinReminderMessageLines([
    "Olá! Vim pela página de lembrete de vencimento do site. Meu documento já venceu e quero regularizar.",
    ...typedReminderLines(form, "Venceu em", formatTypedExpiry(form)),
  ]);
}

// Supabase or the network failed: the message carries what the visitor typed, so nothing is lost.
export function buildReminderSendFailedWhatsappMessage(form) {
  return joinReminderMessageLines([
    "Olá! Tentei pedir o lembrete de vencimento pelo site, mas não consegui enviar.",
    ...typedReminderLines(form, "Vencimento", formatTypedExpiry(form) || "data não informada"),
  ]);
}
