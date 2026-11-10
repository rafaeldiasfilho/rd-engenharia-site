// "Renovar" for a recurring service: creates the next service (a new quote with the next expiry) and closes
// the current one (encerrado = true). Field names follow the database columns (Portuguese).

import { computeRenewalExpiry } from "./dates.js";

export const SUCCESS_RENEWAL_READY = "SUCCESS_RENEWAL_READY";
export const ERROR_RENEWAL_NOT_RECURRING = "ERROR_RENEWAL_NOT_RECURRING";
export const ERROR_RENEWAL_ALREADY_CLOSED = "ERROR_RENEWAL_ALREADY_CLOSED";

export const RENEWAL_ERROR_MESSAGES = {
  [ERROR_RENEWAL_NOT_RECURRING]: "Para renovar, o serviço precisa ter vencimento e o intervalo de repetição em meses.",
  [ERROR_RENEWAL_ALREADY_CLOSED]: "Este serviço já foi tratado. Renove o serviço que veio depois dele.",
};

// Returns { code } on failure, or { code: SUCCESS_RENEWAL_READY, nextService, closedService }.
// nextService has no id (the database creates it); closedService is the whole current record with encerrado = true,
// because saving a partial record would erase the other fields in demo mode.
export function buildServiceRenewal(service) {
  if (!service) return { code: ERROR_RENEWAL_NOT_RECURRING };
  if (service.encerrado === true) return { code: ERROR_RENEWAL_ALREADY_CLOSED };
  const nextExpiry = computeRenewalExpiry(service.vencimento, service.repetir_meses);
  if (!nextExpiry) return { code: ERROR_RENEWAL_NOT_RECURRING };
  return {
    code: SUCCESS_RENEWAL_READY,
    nextService: {
      cliente_id: service.cliente_id,
      tipo: service.tipo,
      descricao: service.descricao,
      local_servico: service.local_servico,
      repetir_meses: Number(service.repetir_meses),
      status: "orcamento",
      vencimento: nextExpiry,
      encerrado: false,
    },
    closedService: { ...service, encerrado: true },
  };
}

// The "Renovar" button is shown only when the renewal can be built (open service with expiry and repeat interval).
export const canRenewService = (service) => buildServiceRenewal(service).code === SUCCESS_RENEWAL_READY;

// Saves the next service first and only then closes the current one: if the second save fails, nothing is lost
// (the current service just stays open). servicesTable is db.services from db.js.
export async function renewServiceInDatabase(servicesTable, service) {
  const renewal = buildServiceRenewal(service);
  if (renewal.code !== SUCCESS_RENEWAL_READY) throw new Error(RENEWAL_ERROR_MESSAGES[renewal.code]);
  await servicesTable.save(renewal.nextService);
  await servicesTable.save(renewal.closedService);
}
