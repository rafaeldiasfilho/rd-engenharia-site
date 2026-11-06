// WhatsApp link to a client's number (adds the Brazil code 55 when missing).

export function whatsappLink(number, text) {
  let n = String(number || "").replace(/\D/g, "");
  if (!n) return "";
  if (n.length <= 11) n = "55" + n;
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}
