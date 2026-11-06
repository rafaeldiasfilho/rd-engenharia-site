// Reminder request sent from the public site to Supabase. This is the only place where visitor data
// leaves the browser, so the column mapping and the failure behaviour are tested here.
// fetch is mocked: no network and no real database.
import { afterEach, describe, expect, it, vi } from "vitest";
import { sendReminder } from "../../src/publicApi/api.js";
import { SUPABASE_URL } from "../../src/admin/db.js";

const validReminder = {
  name: "Maria Teste",
  whatsapp: "5517999999999",
  document: "AVCB ou CLCB (Corpo de Bombeiros)",
  expiry: "2027-03-31",
  consent: true,
};

const mockFetch = (response) => {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("sendReminder", () => {
  it("posts one row to lembretes_site with the Portuguese column names", async () => {
    const fetchMock = mockFetch({ ok: true, status: 201 });

    await sendReminder(validReminder);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(`${SUPABASE_URL}/rest/v1/lembretes_site`);
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual({
      nome: "Maria Teste",
      whatsapp: "5517999999999",
      documento: "AVCB ou CLCB (Corpo de Bombeiros)",
      vencimento: "2027-03-31",
      consentimento: true,
    });
  });

  it("sends only the five columns the anonymous role may insert", async () => {
    const fetchMock = mockFetch({ ok: true, status: 201 });

    await sendReminder({ ...validReminder, extraField: "should not be sent" });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(Object.keys(body).sort()).toEqual(["consentimento", "documento", "nome", "vencimento", "whatsapp"]);
  });

  it("sends the publishable key and asks for a minimal response", async () => {
    const fetchMock = mockFetch({ ok: true, status: 201 });

    await sendReminder(validReminder);

    const { headers } = fetchMock.mock.calls[0][1];
    expect(headers.apikey).toBeTruthy();
    expect(headers.Authorization).toBe(`Bearer ${headers.apikey}`);
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers.Prefer).toBe("return=minimal");
  });

  it("keeps an unknown expiry as null (the month is optional on the form)", async () => {
    const fetchMock = mockFetch({ ok: true, status: 201 });

    await sendReminder({ ...validReminder, expiry: null });

    expect(JSON.parse(fetchMock.mock.calls[0][1].body).vencimento).toBeNull();
  });

  it("throws when the database refuses the row (e.g. RLS or a constraint, HTTP 401/403/400)", async () => {
    for (const status of [400, 401, 403]) {
      mockFetch({ ok: false, status });
      await expect(sendReminder(validReminder)).rejects.toThrow();
    }
  });

  it("throws when Supabase is down (HTTP 500/503)", async () => {
    mockFetch({ ok: false, status: 503 });
    await expect(sendReminder(validReminder)).rejects.toThrow();
  });

  it("rejects when there is no network", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(sendReminder(validReminder)).rejects.toThrow("Failed to fetch");
  });
});
