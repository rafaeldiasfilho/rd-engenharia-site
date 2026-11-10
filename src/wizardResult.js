// Result of the /o-que-preciso wizard: which documents the answers point to, the link to each service card,
// the WhatsApp message, and the progress kept in this browser tab (sessionStorage) and in the browser
// history, so that Back goes to the previous question and a return to the page keeps the answers.
// Pure functions, no React and no window: the storage and the history state are passed in.
import { PROFILES, RESULTS } from "./content/wizard.js";
import { findArea } from "./content/areas.js";

export const WIZARD_PROGRESS_STORAGE_KEY = "rd_wizard_answers";
export const WIZARD_CITY_MAX_LENGTH = 60;
export const WIZARD_NOTE_MAX_LENGTH = 200;

// Only "Sim" counts: "Não, ou não sei" and the questions left unanswered (early exit) count as "não".
const isWizardYes = (answers, index) => answers[index] === true;

// profile: one entry of PROFILES; answers: { situationIndex: true | false }.
// Returns the suggested documents in situation order, without repeats: [{ id, name, area, service, text }].
export function collectWizardResults(profile, answers) {
  if (!profile) return [];
  const ids = [];
  profile.situations.forEach((situation, index) => {
    if (isWizardYes(answers, index)) situation.items.forEach((id) => !ids.includes(id) && ids.push(id));
  });
  return ids.map((id) => ({ id, ...RESULTS[id] }));
}

// Situations answered "Sim", in question order and in the visitor's own words ("Marquei:" in the message).
export function collectWizardMarkedFacts(profile, answers) {
  if (!profile) return [];
  return profile.situations.filter((_, index) => isWizardYes(answers, index)).map((situation) => situation.text);
}

export function countWizardUnanswered(profile, answers) {
  if (!profile) return 0;
  return profile.situations.filter((_, index) => typeof answers[index] !== "boolean").length;
}

export function describeWizardUnanswered(count) {
  if (count <= 0) return "";
  if (count === 1) return "Uma pergunta ficou sem resposta e conta como “não”.";
  return `${count} perguntas ficaram sem resposta e contam como “não”.`;
}

// "Ver o resultado agora": offered on a question after the first "Sim", while more questions are left.
export function shouldOfferWizardEarlyResult(profile, answers, step) {
  if (!profile || step < 1 || step >= profile.situations.length) return false;
  return Object.values(answers).some((value) => value === true);
}

// Area with the most suggested documents (on a tie, the one that comes first in the result).
export function findWizardMainAreaSlug(results) {
  const countBySlug = new Map();
  results.forEach((result) => countBySlug.set(result.area, (countBySlug.get(result.area) || 0) + 1));
  let mainSlug = "";
  countBySlug.forEach((count, slug) => {
    if (!mainSlug || count > countBySlug.get(mainSlug)) mainSlug = slug;
  });
  return mainSlug;
}

// "Posso enviar:" of the message: the "Para agilizar, separe" list of the main area (documents in
// src/content/areas/*.js, shown on the area page by src/pages/area/AreaProcess.jsx). One area only, so the
// message stays short.
export function collectWizardDocumentsToSend(results) {
  const area = findArea(findWizardMainAreaSlug(results));
  return area && Array.isArray(area.documents) ? area.documents : [];
}

// "Ver na página da área": straight to the service card when the result knows it.
export function buildWizardResultHref(result) {
  return result.service ? `/${result.area}#${result.service}` : `/${result.area}`;
}

// Text typed by the visitor: one line, no repeated spaces, cut to the size of the field.
export function cleanWizardFreeText(text, maxLength) {
  return String(text || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

const caseLine = (profileName) => (profileName ? `Meu caso: ${profileName.charAt(0).toLowerCase() + profileName.slice(1)}` : "");
const listLines = (title, lines) => (lines.length ? [title, ...lines.map((line) => `- ${line}`)] : []);

// Message the visitor sends to RD: where it came from, the case, the city, the "Sim" answers, the documents
// found and what the visitor can already send. With nothing found, it asks for a conversation and carries
// the visitor's own words (note).
export function buildWizardWhatsappMessage({ results, facts = [], documentsToSend = [], profileName = "", city = "", note = "" }) {
  const cleanCity = cleanWizardFreeText(city, WIZARD_CITY_MAX_LENGTH);
  const cleanNote = cleanWizardFreeText(note, WIZARD_NOTE_MAX_LENGTH);
  const body = results.length
    ? [...listLines("O resultado indicou:", results.map((result) => result.name)), ...listLines("Posso enviar:", documentsToSend)]
    : ["Nenhuma das situações bateu com o meu caso. Gostaria de conversar."];
  return [
    "Olá! Respondi o passo a passo do site.",
    caseLine(profileName),
    cleanCity && `Cidade: ${cleanCity}`,
    ...listLines("Marquei:", facts),
    ...body,
    cleanNote && `O que aconteceu: ${cleanNote}`,
  ]
    .filter(Boolean)
    .join("\n");
}

// Everything the result screen needs. The note ("O que aconteceu?") is a field of the all-"no" screen only,
// so it goes into the message only when nothing was found.
export function buildWizardResultSummary(profile, answers, { city = "", note = "" } = {}) {
  const results = collectWizardResults(profile, answers);
  const whatsappText = buildWizardWhatsappMessage({
    results,
    facts: collectWizardMarkedFacts(profile, answers),
    documentsToSend: collectWizardDocumentsToSend(results),
    profileName: profile ? profile.name : "",
    city,
    note: results.length ? "" : note,
  });
  return { results, whatsappText, unansweredCount: countWizardUnanswered(profile, answers) };
}

// Screen number: 0 = profile; 1..n = questions; n + 1 = result. Without a profile only screen 0 exists.
export function clampWizardStep(step, profile) {
  if (!profile || !Number.isInteger(step) || step < 0) return 0;
  return Math.min(step, profile.situations.length + 1);
}

// Progress saved in this tab: { profileId, answers, step }. Anything unknown or broken is dropped.
export function parseWizardProgress(raw) {
  if (typeof raw !== "string" || !raw) return null;
  let saved;
  try {
    saved = JSON.parse(raw);
  } catch {
    return null;
  }
  const profile = saved && PROFILES.find((p) => p.id === saved.profileId);
  if (!profile) return null;
  const answers = {};
  Object.entries(saved.answers && typeof saved.answers === "object" ? saved.answers : {}).forEach(([key, value]) => {
    const index = Number(key);
    const known = Number.isInteger(index) && index >= 0 && index < profile.situations.length;
    if (known && typeof value === "boolean") answers[index] = value;
  });
  return { profileId: profile.id, answers, step: clampWizardStep(saved.step, profile) };
}

export function loadWizardProgress(storage) {
  if (!storage) return null;
  try {
    return parseWizardProgress(storage.getItem(WIZARD_PROGRESS_STORAGE_KEY));
  } catch {
    return null; // storage blocked by the browser
  }
}

// Writes the progress (removes it when no profile is chosen). Returns false when the storage is missing,
// full or blocked: the wizard still works, only without the saved progress.
export function saveWizardProgress(storage, { profileId, answers, step }) {
  if (!storage) return false;
  try {
    if (profileId) storage.setItem(WIZARD_PROGRESS_STORAGE_KEY, JSON.stringify({ profileId, answers, step }));
    else storage.removeItem(WIZARD_PROGRESS_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function clearWizardProgress(storage) {
  return saveWizardProgress(storage, { profileId: "", answers: {}, step: 0 });
}

// Screen shown when the page opens: the step of this history entry when the browser comes back to it
// (Back, Forward, reload), otherwise the step saved in this tab.
export function restoreWizardProgress(saved, historyTag) {
  if (!saved) return { profileId: "", answers: {}, step: 0 };
  const profile = PROFILES.find((p) => p.id === saved.profileId);
  return { ...saved, step: clampWizardStep(historyTag ? historyTag.step : saved.step, profile) };
}

// Each wizard screen is one entry of the browser history (history.pushState), tagged with its step and its
// depth (how many wizard entries lie below it on this page). Other keys of the state are kept.
export function buildWizardHistoryState(previousState, step, depth) {
  const base = previousState && typeof previousState === "object" && !Array.isArray(previousState) ? previousState : {};
  return { ...base, rdWizardStep: step, rdWizardDepth: depth };
}

// { step, depth } of an entry this wizard created, or null for any other entry (such as an anchor link).
export function readWizardHistoryTag(state) {
  if (!state || !Number.isInteger(state.rdWizardStep) || !Number.isInteger(state.rdWizardDepth)) return null;
  return { step: state.rdWizardStep, depth: Math.max(0, state.rdWizardDepth) };
}
