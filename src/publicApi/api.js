// Public calls to Supabase with no library (fetch only), so the site pages stay light.
// The key is the publishable one: it only allows what the database rules (RLS) grant to the public,
// that is, sending a reminder request and looking up a case by its code.
import { SUPABASE_URL, SUPABASE_CHAVE } from "../admin/db";

const baseHeaders = {
  apikey: SUPABASE_CHAVE,
  Authorization: `Bearer ${SUPABASE_CHAVE}`,
  "Content-Type": "application/json",
};

export async function enviarLembrete(data) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/lembretes_site`, {
    method: "POST",
    headers: { ...baseHeaders, Prefer: "return=minimal" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("falha");
}
