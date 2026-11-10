// "Renovar": the next service of a recurring one, and the current one closed. A wrong record here means a
// renewal with the wrong expiry, a lost field, or a renewal that stays open and is counted twice.
import { describe, expect, it, vi } from "vitest";
import {
  ERROR_RENEWAL_ALREADY_CLOSED,
  ERROR_RENEWAL_NOT_RECURRING,
  RENEWAL_ERROR_MESSAGES,
  SUCCESS_RENEWAL_READY,
  buildServiceRenewal,
  canRenewService,
  renewServiceInDatabase,
} from "../../src/admin/serviceRenewal.js";

const recurringService = {
  id: "s1",
  cliente_id: "c1",
  tipo: "AVCB",
  descricao: "Renovação do AVCB do galpão",
  local_servico: "Galpão 2",
  status: "concluido",
  data_realizacao: "2025-03-10",
  repetir_meses: 36,
  vencimento: "2028-03-10",
  encerrado: false,
  art_numero: "ART-123",
  valor: 1500,
  observacoes: "Cliente prefere contato à tarde",
  criado_em: "2025-03-10T12:00:00Z",
};

describe("buildServiceRenewal", () => {
  it("creates the next service as a quote with the next expiry, copying only the agreed fields", () => {
    const renewal = buildServiceRenewal(recurringService);
    expect(renewal.code).toBe(SUCCESS_RENEWAL_READY);
    expect(renewal.nextService).toEqual({
      cliente_id: "c1",
      tipo: "AVCB",
      descricao: "Renovação do AVCB do galpão",
      local_servico: "Galpão 2",
      repetir_meses: 36,
      status: "orcamento",
      vencimento: "2031-03-10",
      encerrado: false,
    });
  });

  it("closes the current service and keeps every other field of it", () => {
    const renewal = buildServiceRenewal(recurringService);
    expect(renewal.closedService).toEqual({ ...recurringService, encerrado: true });
    expect(recurringService.encerrado).toBe(false);
  });

  it("keeps the end of the month: an expiry on Jan 31 renewed monthly goes to the last day of February", () => {
    const renewal = buildServiceRenewal({ ...recurringService, vencimento: "2027-01-31", repetir_meses: "1" });
    expect(renewal.nextService.vencimento).toBe("2027-02-28");
    expect(renewal.nextService.repetir_meses).toBe(1);
  });

  it("refuses a service without a repeat interval or without an expiry", () => {
    expect(buildServiceRenewal({ ...recurringService, repetir_meses: null }).code).toBe(ERROR_RENEWAL_NOT_RECURRING);
    expect(buildServiceRenewal({ ...recurringService, repetir_meses: "" }).code).toBe(ERROR_RENEWAL_NOT_RECURRING);
    expect(buildServiceRenewal({ ...recurringService, vencimento: null }).code).toBe(ERROR_RENEWAL_NOT_RECURRING);
    expect(buildServiceRenewal(null).code).toBe(ERROR_RENEWAL_NOT_RECURRING);
  });

  it("refuses a service that was already closed, so the same expiry is never renewed twice", () => {
    expect(buildServiceRenewal({ ...recurringService, encerrado: true }).code).toBe(ERROR_RENEWAL_ALREADY_CLOSED);
  });
});

describe("canRenewService", () => {
  it("shows the button only for an open service with an expiry and a repeat interval", () => {
    expect(canRenewService(recurringService)).toBe(true);
    expect(canRenewService({ ...recurringService, repetir_meses: null })).toBe(false);
    expect(canRenewService({ ...recurringService, encerrado: true })).toBe(false);
  });
});

describe("renewServiceInDatabase", () => {
  it("saves the next service first and then closes the current one", async () => {
    const servicesTable = { save: vi.fn().mockResolvedValue({}) };
    await renewServiceInDatabase(servicesTable, recurringService);
    expect(servicesTable.save.mock.calls).toEqual([
      [buildServiceRenewal(recurringService).nextService],
      [{ ...recurringService, encerrado: true }],
    ]);
  });

  it("leaves the current service open when the next one cannot be saved", async () => {
    const servicesTable = { save: vi.fn().mockRejectedValue(new Error("new row violates row-level security policy")) };
    await expect(renewServiceInDatabase(servicesTable, recurringService)).rejects.toThrow("row-level security");
    expect(servicesTable.save).toHaveBeenCalledTimes(1);
  });

  it("saves nothing and explains why when the service cannot be renewed", async () => {
    const servicesTable = { save: vi.fn() };
    await expect(renewServiceInDatabase(servicesTable, { ...recurringService, encerrado: true })).rejects.toThrow(
      RENEWAL_ERROR_MESSAGES[ERROR_RENEWAL_ALREADY_CLOSED]
    );
    expect(servicesTable.save).not.toHaveBeenCalled();
  });
});
