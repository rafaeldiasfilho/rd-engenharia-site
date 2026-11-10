// Shared "current WhatsApp message" of the page. A part of the page that builds a message
// (the service chips of an area page, the wizard result) publishes it here, and the floating
// WhatsApp button and the closing button of the page send it instead of a generic greeting.
// Shape: { text: "message sent to WhatsApp", label: "short button label" } or null.

import { useSyncExternalStore } from "react";

let currentWhatsappMessage = null;
const listeners = new Set();

export function setCurrentWhatsappMessage(message) {
  currentWhatsappMessage = message && message.text ? message : null;
  listeners.forEach((listener) => listener());
}

export function getCurrentWhatsappMessage() {
  return currentWhatsappMessage;
}

export function subscribeCurrentWhatsappMessage(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// React hook. During the prerender there is no message yet, so the page keeps its default text.
export function useCurrentWhatsappMessage() {
  return useSyncExternalStore(subscribeCurrentWhatsappMessage, getCurrentWhatsappMessage, () => null);
}
