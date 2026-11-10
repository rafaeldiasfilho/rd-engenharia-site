// WhatsApp message of the home page quote form. Pure function: empty fields are left out.
// request: { name, city, service, message }
export function buildQuoteRequestMessage(request) {
  const lines = ["Olá! Vim pelo site e gostaria de um orçamento."];
  if (request.name.trim()) lines.push(`Nome: ${request.name.trim()}`);
  if (request.city.trim()) lines.push(`Cidade: ${request.city.trim()}`);
  if (request.service) lines.push(`Área: ${request.service}`);
  if (request.message.trim()) lines.push(`Mensagem: ${request.message.trim()}`);
  return lines.join("\n");
}
