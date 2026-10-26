// Número e link do WhatsApp (único canal de atendimento). Fica fora do Layout para que outros
// componentes (como a busca) usem sem importar o Layout inteiro.
export const WHATSAPP = "5517997211208";
export const zap = (texto) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
