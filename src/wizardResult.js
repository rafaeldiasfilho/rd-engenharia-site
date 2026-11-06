// Result of the /o-que-preciso wizard: which documents the answers point to, and the WhatsApp message.
// Pure functions, no React. Nothing is stored: the message is the only place the answers go.
import { RESULTS } from "./content/wizard.js";

// profile: one entry of PROFILES; answers: { situationIndex: true | false }.
// Returns the suggested documents in situation order, without repeats: [{ id, name, area, text }].
export function collectWizardResults(profile, answers) {
  if (!profile) return [];
  const ids = [];
  profile.situations.forEach((situation, index) => {
    if (answers[index]) situation.items.forEach((id) => !ids.includes(id) && ids.push(id));
  });
  return ids.map((id) => ({ id, ...RESULTS[id] }));
}

const caseLine = (profileName) => (profileName ? `Meu caso: ${profileName.charAt(0).toLowerCase() + profileName.slice(1)}` : "");
const cityLine = (city) => (city.trim() ? `Cidade: ${city.trim()}` : "");

// Message the visitor sends to RD. With no suggested document, it asks for a conversation instead.
export function buildWizardWhatsappMessage({ results, profileName, city }) {
  const opening = results.length
    ? ["Olá! Fiz o guia do site e acho que preciso de:", ...results.map((r) => `- ${r.name}`)]
    : ["Olá! Fiz o guia do site e nenhuma opção bateu com o meu caso. Gostaria de conversar."];
  return [...opening, caseLine(profileName), cityLine(city)].filter(Boolean).join("\n");
}
