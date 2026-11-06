// Data layer for the internal area. Uses Supabase when the environment variables exist;
// without them, it runs in demo mode (data only in this browser), useful for testing the screen.

// URL and publishable key of the "RdEngenharia" Supabase project. Both are public by design (they reach the
// browser anyway); what protects the data are the database access rules (RLS).
const URL = import.meta.env.VITE_SUPABASE_URL || "https://lmeukcvqltafmjzmtmip.supabase.co";
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_zbcFqqHt6tSM-sCBWPml7A_ITsU25KS";

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(16).slice(2);

function createDemo() {
  const read = (k) => {
    try {
      return JSON.parse(localStorage.getItem(k) || "[]");
    } catch {
      return [];
    }
  };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const table = (k) => ({
    async list() {
      return read(k);
    },
    async save(item) {
      const all = read(k);
      const i = all.findIndex((x) => x.id === item.id);
      const record = { ...item, id: item.id || newId(), criado_em: item.criado_em || new Date().toISOString() };
      if (i >= 0) all[i] = record;
      else all.push(record);
      write(k, all);
      return record;
    },
    async remove(id) {
      write(
        k,
        read(k).filter((x) => x.id !== id)
      );
      if (k === "rd_demo_clientes") write("rd_demo_servicos", read("rd_demo_servicos").filter((s) => s.cliente_id !== id));
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
    clients: table("rd_demo_clientes"),
    services: table("rd_demo_servicos"),
    reminders: table("rd_demo_lembretes"),
  };
}

async function createSupabase() {
  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(URL, KEY);
  const unwrap = (r) => {
    if (r.error) throw new Error(r.error.message);
    return r.data;
  };
  const table = (name, order) => ({
    async list() {
      return unwrap(await sb.from(name).select("*").order(order.column, { ascending: order.asc }));
    },
    async save(item) {
      const clean = Object.fromEntries(Object.entries(item).map(([k, v]) => [k, v === "" ? null : v]));
      if (!clean.id) delete clean.id;
      return unwrap(await sb.from(name).upsert(clean).select().single());
    },
    async remove(id) {
      unwrap(await sb.from(name).delete().eq("id", id));
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
    clients: table("clientes", { column: "nome", asc: true }),
    services: table("servicos", { column: "criado_em", asc: false }),
    reminders: table("lembretes_site", { column: "criado_em", asc: false }),
  };
}

export async function openDatabase() {
  // Demo mode: only on the developer's computer (VITE_DEMO=1 in dev mode); off on the published site.
  if (import.meta.env.DEV && import.meta.env.VITE_DEMO === "1") return createDemo();
  if (URL && KEY) return createSupabase();
  return { mode: "unavailable" };
}

export { URL as SUPABASE_URL, KEY as SUPABASE_KEY };
