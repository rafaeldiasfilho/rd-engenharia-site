// Números e link do WhatsApp (único canal de atendimento). Fica fora do Layout para que outros
// componentes (como a busca) usem sem importar o Layout inteiro.
// WHATSAPP é o número principal (responsável técnico); WHATSAPP_PROJETOS é o do Rafael Antonio Dias
// Filho (projetos e atendimento), canal oficial confirmado pelo dono em 28/10/2026.
export const WHATSAPP = "5517997211208";
export const WHATSAPP_PROJETOS = "5517996590330";
export const zap = (texto, numero = WHATSAPP) => `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
