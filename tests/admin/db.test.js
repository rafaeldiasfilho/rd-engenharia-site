// Data layer of the internal area. Both modes are tested without a real database:
// demo mode with an in-memory localStorage, Supabase mode with a mocked client.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const supabase = vi.hoisted(() => ({ calls: [], nextResult: { data: [], error: null }, auth: {} }));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => {
    const query = (table) => {
      const q = {
        select: () => q,
        order: (column, opts) => { supabase.calls.push(["order", table, column, opts]); return Promise.resolve(supabase.nextResult); },
        upsert: (row) => { supabase.calls.push(["upsert", table, row]); return q; },
        single: () => Promise.resolve(supabase.nextResult),
        delete: () => q,
        eq: (column, value) => { supabase.calls.push(["delete", table, column, value]); return Promise.resolve(supabase.nextResult); },
      };
      return q;
    };
    return { from: query, auth: supabase.auth };
  },
}));

const memoryStorage = () => {
  const store = new Map();
  return { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
};

const loadDatabase = async () => {
  vi.resetModules();
  const { openDatabase } = await import("../../src/admin/db.js");
  return openDatabase();
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("demo mode (VITE_DEMO=1, development only)", () => {
  beforeEach(() => {
    vi.stubEnv("DEV", true);
    vi.stubEnv("VITE_DEMO", "1");
    vi.stubGlobal("localStorage", memoryStorage());
  });

  it("opens in demo mode", async () => {
    expect((await loadDatabase()).mode).toBe("demo");
  });

  it("creates a record with an id and a creation date, then updates it in place", async () => {
    const db = await loadDatabase();
    const created = await db.clients.save({ nome: "Cliente Teste" });
    expect(created.id).toBeTruthy();
    expect(created.criado_em).toMatch(/^\d{4}-\d{2}-\d{2}T/);

    await db.clients.save({ ...created, nome: "Cliente Renomeado" });
    const all = await db.clients.list();
    expect(all).toHaveLength(1);
    expect(all[0].nome).toBe("Cliente Renomeado");
    expect(all[0].criado_em).toBe(created.criado_em);
  });

  it("deleting a client also deletes its services (same as on delete cascade)", async () => {
    const db = await loadDatabase();
    const a = await db.clients.save({ nome: "A" });
    const b = await db.clients.save({ nome: "B" });
    await db.services.save({ cliente_id: a.id, tipo: "AVCB" });
    await db.services.save({ cliente_id: b.id, tipo: "PGR" });

    await db.clients.remove(a.id);

    expect((await db.clients.list()).map((c) => c.nome)).toEqual(["B"]);
    expect((await db.services.list()).map((s) => s.tipo)).toEqual(["PGR"]);
  });

  it("survives corrupted stored data by starting empty", async () => {
    localStorage.setItem("rd_demo_clientes", "{not json");
    const db = await loadDatabase();
    expect(await db.clients.list()).toEqual([]);
  });

  it("signs in and out without a password", async () => {
    const db = await loadDatabase();
    expect(await db.auth.session()).toBeNull();
    await db.auth.signIn();
    expect(await db.auth.session()).toEqual({ email: "demonstracao@local" });
    await db.auth.signOut();
    expect(await db.auth.session()).toBeNull();
  });
});

describe("Supabase mode", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_DEMO", "");
    supabase.calls = [];
    supabase.nextResult = { data: [], error: null };
  });

  it("is the default (the demo never runs on the published site)", async () => {
    expect((await loadDatabase()).mode).toBe("supabase");
  });

  it("reads each table with its own order", async () => {
    const db = await loadDatabase();
    await db.clients.list();
    await db.services.list();
    await db.reminders.list();
    expect(supabase.calls).toEqual([
      ["order", "clientes", "nome", { ascending: true }],
      ["order", "servicos", "criado_em", { ascending: false }],
      ["order", "lembretes_site", "criado_em", { ascending: false }],
    ]);
  });

  it("saves empty fields as null and lets the database create the id of a new record", async () => {
    const db = await loadDatabase();
    supabase.nextResult = { data: { id: "new-id" }, error: null };
    const saved = await db.clients.save({ id: "", nome: "Cliente", email: "" });
    expect(saved).toEqual({ id: "new-id" });
    expect(supabase.calls[0]).toEqual(["upsert", "clientes", { nome: "Cliente", email: null }]);
  });

  it("throws the database error message (shown at the top of the screen)", async () => {
    const db = await loadDatabase();
    supabase.nextResult = { data: null, error: { message: "new row violates row-level security policy" } };
    await expect(db.services.list()).rejects.toThrow("new row violates row-level security policy");
    await expect(db.clients.remove("x")).rejects.toThrow("row-level security");
  });

  it("shows a fixed message for a wrong e-mail or password", async () => {
    supabase.auth.signInWithPassword = async () => ({ data: null, error: { message: "Invalid login credentials" } });
    const db = await loadDatabase();
    await expect(db.auth.signIn("a@b.com", "errada")).rejects.toThrow("E-mail ou senha incorretos.");
    supabase.auth.signInWithPassword = async () => ({
      data: { user: null, session: null },
      error: { name: "AuthApiError", status: 400, code: "invalid_credentials", message: "Invalid login credentials" },
    });
    await expect(db.auth.signIn("a@b.com", "errada")).rejects.toThrow("E-mail ou senha incorretos.");
  });

  it("says the database cannot be reached when the network fails or the project is paused", async () => {
    const unreachable = "Não foi possível conectar ao banco de dados agora. Tente de novo em alguns minutos.";
    const db = await loadDatabase();
    supabase.auth.signInWithPassword = async () => ({
      data: { user: null, session: null },
      error: { name: "AuthRetryableFetchError", status: 0, message: "Failed to fetch" },
    });
    await expect(db.auth.signIn("a@b.com", "certa")).rejects.toThrow(unreachable);
    supabase.auth.signInWithPassword = async () => ({
      data: { user: null, session: null },
      error: { name: "AuthApiError", status: 540, message: "Project paused" },
    });
    await expect(db.auth.signIn("a@b.com", "certa")).rejects.toThrow(unreachable);
    supabase.auth.signInWithPassword = async () => {
      throw new TypeError("Failed to fetch");
    };
    await expect(db.auth.signIn("a@b.com", "certa")).rejects.toThrow(unreachable);
  });

  it("does not blame the password for other refusals", async () => {
    supabase.auth.signInWithPassword = async () => ({
      data: { user: null, session: null },
      error: { name: "AuthApiError", status: 400, code: "email_not_confirmed", message: "Email not confirmed" },
    });
    const db = await loadDatabase();
    await expect(db.auth.signIn("a@b.com", "certa")).rejects.toThrow("Não foi possível entrar agora. Tente de novo em alguns minutos.");
  });

  it("returns the e-mail of the user who signed in", async () => {
    supabase.auth.signInWithPassword = async () => ({ data: { user: { email: "equipe@rd.com" }, session: {} }, error: null });
    const db = await loadDatabase();
    expect(await db.auth.signIn("equipe@rd.com", "certa")).toEqual({ email: "equipe@rd.com" });
  });

  it("returns the signed-in e-mail, or null without a session", async () => {
    supabase.auth.getSession = async () => ({ data: { session: { user: { email: "equipe@rd.com" } } } });
    const db = await loadDatabase();
    expect(await db.auth.session()).toEqual({ email: "equipe@rd.com" });
    supabase.auth.getSession = async () => ({ data: { session: null } });
    expect(await db.auth.session()).toBeNull();
  });
});
