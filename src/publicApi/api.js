// Public calls to Supabase with no library (fetch only), so the site pages stay light.
// The key is the publishable one: it only allows what the database rules (RLS) grant to the public,
// that is, sending a reminder request.
import { SUPABASE_URL, SUPABASE_KEY } from "../admin/db";

const baseHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

// Reminder request from the public site. The code uses English field names; the database table keeps its
// original Portuguese column names, so they are mapped here, in one place.
export async function sendReminder({ name, whatsapp, document, expiry, consent }) {
  const row = { nome: name, whatsapp, documento: document, vencimento: expiry, consentimento: consent };
  const r = await fetch(`${SUPABASE_URL}/rest/v1/lembretes_site`, {
    method: "POST",
    headers: { ...baseHeaders, Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  if (!r.ok) throw new Error(`Reminder request failed: HTTP ${r.status}`);
}
