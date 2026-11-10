// WhatsApp messages of the site, built in one place.
// Every message starts with a line saying where the visitor came from, so the team knows the context
// before answering and can count which pages bring conversations. Lines that end in ":" are blanks the
// visitor fills in WhatsApp before sending (area fields such as "Cidade:").
// Pure functions: they only read the content files.

import { AREAS } from "./content/areas";
import { GUIDES } from "./content/guides";

export const GENERAL_WHATSAPP_FIELDS = ["O que preciso:", "Cidade:"];

// "Cidade:" becomes "Cidade: " so the cursor lands after the label when the visitor taps the line.
const blankLines = (fields) => fields.map((field) => `${field} `);

const joinLines = (lines) => lines.filter((line) => line !== null && line !== undefined && line !== "").join("\n");

export function findAreaBySlug(slug) {
  return AREAS.find((area) => area.slug === slug) || null;
}

export function findGuideBySlug(slug) {
  return GUIDES.find((guide) => guide.slug === slug) || null;
}

// Pages without a subject of their own (home, legal pages, coverage, quiz).
export function generalWhatsappMessage() {
  return joinLines(["Olá! Vim pelo site e gostaria de um orçamento.", ...blankLines(GENERAL_WHATSAPP_FIELDS)]);
}

// Message addressed to a person of the team by first name ("Olá, Rafael!").
export function personWhatsappMessage(firstName) {
  return joinLines([`Olá, ${firstName}! Vim pelo site e gostaria de um orçamento.`, ...blankLines(GENERAL_WHATSAPP_FIELDS)]);
}

export function areaWhatsappMessage(area) {
  return joinLines([
    `Olá! Vim pela página de ${area.label} do site e gostaria de um orçamento.`,
    ...blankLines(area.whatsappFields || GENERAL_WHATSAPP_FIELDS),
  ]);
}

// "Situações comuns" of an area page: the visitor taps the sentence that describes the case.
export function situationWhatsappMessage(area, situation) {
  return joinLines([`Olá! Vim pela página de ${area.label} do site.`, situation, "Podem me ajudar?", ...blankLines(["Cidade:"])]);
}

// Service chips of an area page: one message with every service the visitor marked.
export function servicesWhatsappMessage(area, serviceNames) {
  if (!serviceNames.length) return areaWhatsappMessage(area);
  return joinLines([
    `Olá! Vim pela página de ${area.label} do site e gostaria de um orçamento para:`,
    ...serviceNames.map((name) => `- ${name}`),
    ...blankLines(area.whatsappFields || GENERAL_WHATSAPP_FIELDS),
  ]);
}

export function servicesButtonLabel(count) {
  if (count === 0) return "Falar no WhatsApp";
  if (count === 1) return "Enviar o serviço marcado";
  return `Enviar os ${count} serviços marcados`;
}

// Guide pages: the guide's own question when it has one, otherwise the fields of the guide's area.
export function guideWhatsappMessage(guide) {
  const area = findAreaBySlug(guide.area);
  const own = guide.whatsappPrompt;
  if (own) return own;
  return joinLines([`Olá! Li o guia "${guide.title}" no site.`, ...blankLines(area?.whatsappFields || GENERAL_WHATSAPP_FIELDS)]);
}

// Default message of the page with this slug (header button, floating button).
export function pageWhatsappMessage(currentSlug) {
  const area = findAreaBySlug(currentSlug);
  if (area) return areaWhatsappMessage(area);
  const guide = findGuideBySlug(currentSlug);
  if (guide) return guideWhatsappMessage(guide);
  return generalWhatsappMessage();
}

// "Alguém pediu um documento?" block of the home page: who asked, in the visitor's words.
export const DOCUMENT_REQUESTERS = [
  { key: "banco", label: "Banco", sentence: "O banco me pediu um documento" },
  { key: "cartorio", label: "Cartório", sentence: "O cartório me pediu um documento" },
  { key: "prefeitura", label: "Prefeitura", sentence: "A prefeitura me pediu um documento" },
  { key: "contador", label: "Contador", sentence: "O contador me pediu um documento" },
  { key: "bombeiros", label: "Corpo de Bombeiros", sentence: "O Corpo de Bombeiros me pediu um documento" },
  { key: "fiscalizacao", label: "Fiscalização do trabalho", sentence: "A fiscalização do trabalho me pediu um documento" },
];

export function documentRequestWhatsappMessage(requester) {
  return joinLines(["Olá! Vim pelo site.", `${requester.sentence} e não sei qual é.`, "Posso mandar a foto do pedido?"]);
}

// 404 page: says which address did not open, so the team can fix a broken link.
export function notFoundWhatsappMessage(path) {
  return joinLines(["Olá! Vim pelo site e não encontrei o que procurava.", path ? `Endereço: ${path}` : null]);
}
