// WhatsApp numbers and link (the only contact channel). Kept outside Layout so that other
// components (such as the search) can use them without importing the whole Layout.
// WHATSAPP is the main number (technical lead); WHATSAPP_PROJETOS is Rafael Antonio Dias
// Filho's (projects and customer service), official channel confirmed by the owner on 2026-10-28.
export const WHATSAPP = "5517997211208";
export const WHATSAPP_PROJECTS = "5517996590330";
export const whatsappLink = (text, number = WHATSAPP) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
