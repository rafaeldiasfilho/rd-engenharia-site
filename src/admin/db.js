// Camada de dados da área interna. Usa o Supabase quando as variáveis de ambiente existem;
// sem elas, funciona em modo demonstração (dados só neste navegador), útil para testar a tela.

const URL = import.meta.env.VITE_SUPABASE_URL;
const CHAVE = import.meta.env.VITE_SUPABASE_ANON_KEY;

const novoId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(16).slice(2);

function criarDemo() {
  const ler = (k) => {
    try {
      return JSON.parse(localStorage.getItem(k) || "[]");
    } catch {
      return [];
    }
  };
  const gravar = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const tabela = (k) => ({
    async listar() {
      return ler(k);
    },
    async salvar(item) {
      const todos = ler(k);
      const i = todos.findIndex((x) => x.id === item.id);
      const registro = { ...item, id: item.id || novoId(), criado_em: item.criado_em || new Date().toISOString() };
      if (i >= 0) todos[i] = registro;
      else todos.push(registro);
      gravar(k, todos);
      return registro;
    },
    async excluir(id) {
      gravar(
        k,
        ler(k).filter((x) => x.id !== id)
      );
      if (k === "rd_demo_clientes") gravar("rd_demo_servicos", ler("rd_demo_servicos").filter((s) => s.cliente_id !== id));
    },
  });
  return {
    modo: "demo",
    auth: {
      async sessao() {
        return localStorage.getItem("rd_demo_sessao") ? { email: "demonstracao@local" } : null;
      },
      async entrar() {
        localStorage.setItem("rd_demo_sessao", "1");
        return { email: "demonstracao@local" };
      },
      async sair() {
        localStorage.removeItem("rd_demo_sessao");
      },
    },
    clientes: tabela("rd_demo_clientes"),
    servicos: tabela("rd_demo_servicos"),
  };
}

async function criarSupabase() {
  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(URL, CHAVE);
  const erro = (r) => {
    if (r.error) throw new Error(r.error.message);
    return r.data;
  };
  const tabela = (nome, ordem) => ({
    async listar() {
      return erro(await sb.from(nome).select("*").order(ordem.coluna, { ascending: ordem.asc }));
    },
    async salvar(item) {
      const limpo = Object.fromEntries(Object.entries(item).map(([k, v]) => [k, v === "" ? null : v]));
      if (!limpo.id) delete limpo.id;
      return erro(await sb.from(nome).upsert(limpo).select().single());
    },
    async excluir(id) {
      erro(await sb.from(nome).delete().eq("id", id));
    },
  });
  return {
    modo: "supabase",
    auth: {
      async sessao() {
        const { data } = await sb.auth.getSession();
        return data.session ? { email: data.session.user.email } : null;
      },
      async entrar(email, senha) {
        const { data, error } = await sb.auth.signInWithPassword({ email, password: senha });
        if (error) throw new Error("E-mail ou senha incorretos.");
        return { email: data.user.email };
      },
      async sair() {
        await sb.auth.signOut();
      },
    },
    clientes: tabela("clientes", { coluna: "nome", asc: true }),
    servicos: tabela("servicos", { coluna: "criado_em", asc: false }),
  };
}

export async function abrirBanco() {
  if (URL && CHAVE) return criarSupabase();
  // O modo demonstração só existe no computador de quem desenvolve; no site publicado fica desligado.
  if (import.meta.env.DEV) return criarDemo();
  return { modo: "indisponivel" };
}
