// "Pedir avaliação": WhatsApp message asking a client whose service is finished for a Google review.
// The message asks for an honest opinion (no request for a given number of stars and nothing offered in return).

import { GOOGLE_REVIEWS_URL } from "../content/googleAndMaps.js";
import { buildClientWhatsappLink } from "./clientWhatsapp.js";

// Finished = status "concluido", or closed (encerrado) whatever the status.
export function isFinishedService(service) {
  return service?.status === "concluido" || service?.encerrado === true;
}

export function buildReviewRequestMessage(clientName, serviceType) {
  const name = String(clientName || "").trim();
  const type = String(serviceType || "").trim();
  const greeting = name ? `Olá, ${name}!` : "Olá!";
  const thanks = type ? `Obrigado pela confiança no serviço "${type}".` : "Obrigado pela confiança.";
  return `${greeting} Aqui é da RD Engenharia. ${thanks} Se puder, deixe a sua avaliação no Google contando como foi o atendimento. Isso nos ajuda muito: ${GOOGLE_REVIEWS_URL}`;
}

// "" when the service is not finished or the client has neither WhatsApp nor phone: no button is shown.
export function buildReviewRequestLink(client, service) {
  if (!client || !isFinishedService(service)) return "";
  return buildClientWhatsappLink(client.whatsapp || client.telefone, buildReviewRequestMessage(client.nome, service.tipo));
}
