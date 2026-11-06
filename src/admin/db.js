// Data layer for the internal area (/admin). Uses Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY, or the
// public values below). With VITE_DEMO=1 in development only, it runs in demo mode: data lives in this browser's
// localStorage, useful for testing the screens without the database.

// URL and publishable key of the "RdEngenharia" Supabase project. Both are public by design (they reach the
// browser anyway); what protects the data are the database access rules (RLS).
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://lmeukcvqltafmjzmtmip.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_zbcFqqHt6tSM-sCBWPml7A_ITsU25KS";

const createRecordId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(16).slice(2);

function createDemo() {
  const readDemoRows = (k) => {
    try {
      return JSON.parse(localStorage.getItem(k) || "[]");
    } catch {
      return [];
    }
  };
  const writeDemoRows = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const createDemoTable = (k) => ({
    async list() {
      return readDemoRows(k);
    },
    async save(item) {
      const all = readDemoRows(k);
      const i = all.findIndex((x) => x.id === item.id);
      const record = { ...item, id: item.id || createRecordId(), criado_em: item.criado_em || new Date().toISOString() };
      if (i >= 0) all[i] = record;
      else all.push(record);
      writeDemoRows(k, all);
      return record;
    },
    async remove(id) {
      writeDemoRows(
        k,
        readDemoRows(k).filter((x) => x.id !== id)
      );
      if (k === "rd_demo_clientes") writeDemoRows("rd_demo_servicos", readDemoRows("rd_demo_servicos").filter((s) => s.cliente_id !== id));
    },
  });
  return {
    mode: "demo",
    auth: {
      async session() {
        return localStorage.getItem("rd_demo_sessao") ? { email: "demonstracao@local" } : null;
      },
      async signIn() {
        localStorage.setItem("rd_demo_sessao", "1");
        return { email: "demonstracao@local" };
      },
      async signOut() {
        localStorage.removeItem("rd_demo_sessao");
      },
    },
    clients: createDemoTable("rd_demo_clientes"),
    services: createDemoTable("rd_demo_servicos"),
    reminders: createDemoTable("rd_demo_lembretes"),
  };
}

async function createSupabase() {
  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const unwrapSupabaseResult = (r) => {
    if (r.error) throw new Error(r.error.message);
    return r.data;
  };
  const createSupabaseTable = (name, order) => ({
    async list() {
      return unwrapSupabaseResult(await sb.from(name).select("*").order(order.column, { ascending: order.asc }));
    },
    async save(item) {
      const recordWithNulls = Object.fromEntries(Object.entries(item).map(([k, v]) => [k, v === "" ? null : v]));
      if (!recordWithNulls.id) delete recordWithNulls.id;
      return unwrapSupabaseResult(await sb.from(name).upsert(recordWithNulls).select().single());
    },
    async remove(id) {
      unwrapSupabaseResult(await sb.from(name).delete().eq("id", id));
    },
  });
  return {
    mode: "supabase",
    auth: {
      async session() {
        const { data } = await sb.auth.getSession();
        return data.session ? { email: data.session.user.email } : null;
      },
      async signIn(email, password) {
        const { data, error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw new Error("E-mail ou senha incorretos.");
        return { email: data.user.email };
      },
      async signOut() {
        await sb.auth.signOut();
      },
    },
    clients: createSupabaseTable("clientes", { column: "nome", asc: true }),
    services: createSupabaseTable("servicos", { column: "criado_em", asc: false }),
    reminders: createSupabaseTable("lembretes_site", { column: "criado_em", asc: false }),
  };
}

export async function openDatabase() {
  // Demo mode: only on the developer's computer (VITE_DEMO=1 in dev mode); off on the published site.
  if (import.meta.env.DEV && import.meta.env.VITE_DEMO === "1") return createDemo();
  if (SUPABASE_URL && SUPABASE_KEY) return createSupabase();
  return { mode: "unavailable" };
}

export { SUPABASE_URL, SUPABASE_KEY };
