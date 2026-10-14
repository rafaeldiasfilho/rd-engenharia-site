// Chamadas públicas ao Supabase, sem biblioteca (só fetch), para não pesar nas páginas do site.
// A chave é a publicável: ela só permite o que as regras do banco (RLS) autorizam para o público,
// ou seja, enviar um pedido de lembrete e consultar um processo pelo código.
import { SUPABASE_URL, SUPABASE_CHAVE } from "../admin/db";

const cabecalho = {
  apikey: SUPABASE_CHAVE,
  Authorization: `Bearer ${SUPABASE_CHAVE}`,
  "Content-Type": "application/json",
};

export async function enviarLembrete(dados) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/lembretes_site`, {
    method: "POST",
    headers: { ...cabecalho, Prefer: "return=minimal" },
    body: JSON.stringify(dados),
  });
  if (!r.ok) throw new Error("falha");
}
