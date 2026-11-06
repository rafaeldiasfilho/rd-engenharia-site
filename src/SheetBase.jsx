import { CNPJ, CREA_NUMBER } from "./company";
// Shared base for the illustrative examples (sheets, drawings, panel): paper colors, logo, RD public data
// and fictional clients. Nothing here belongs to a real client; the paper is always light (works in both themes).

export const PAPEL = "#fdfdfb";
export const BORDA = "#c9d0c6";
export const LINHA = "#dde2da";
export const TINTA = "#26302a";
export const CINZA = "#5f6a62";
export const FUNDO = "#f1f4ef";
export const VERDE = "#1f6b2a";
export const VERDE_CL = "#8fc08c";
export const AMBAR = "#c98f1c";
export const VERMELHO = "#c0392b";
export const AZUL = "#2a6fd1";
export const MARROM = "#8a5a2b";
export const CARIMBO = "#9b2c2c";

export const RD_CNPJ = `CNPJ ${CNPJ}`;
export const RESP = "Eng. Rafael Antonio Dias";
export const CREA = CREA_NUMBER;
export const DATA = "outubro de 2026";

export const LEGENDA_EXEMPLO = "Exemplo ilustrativo de documento, não é um documento real.";

const CLIENTS = {
  empresa: ["Empresa Exemplo Ltda.", "CNPJ 00.000.000/0001-00 · Ibirá/SP"],
  obra: ["Proprietário Exemplo", "Rua Exemplo, 100 · Ibirá/SP"],
  rural: ["Sítio Exemplo", "Zona rural · Ibirá/SP"],
};
const CLIENT_BY_AREA = {
  "seguranca-do-trabalho": "empresa",
  "corpo-de-bombeiros": "empresa",
  "engenharia-civil": "obra",
  "meio-ambiente-topografia": "rural",
};
export const clienteDe = (m, area) => CLIENTS[m.cliente || CLIENT_BY_AREA[area] || "empresa"];

// Wraps the text into lines of at most `max` characters (SVG does not wrap on its own).
export function quebra(text, max) {
  const lines = [];
  let current = "";
  for (const word of String(text).split(" ")) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > max && current) {
      lines.push(current);
      current = word;
    } else current = candidate;
  }
  if (current) lines.push(current);
  return lines;
}

export function Marca({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect width="14" height="14" rx="3" fill={VERDE} />
      <text x="7" y="9.6" fontSize="6.4" fontWeight="700" fill="#fff" textAnchor="middle">
        RD
      </text>
      <text x="18" y="5.8" fontSize="5.2" fontWeight="700" fill={TINTA} letterSpacing="0.3">
        RD ENGENHARIA
      </text>
      <text x="18" y="11.6" fontSize="3.5" fill={CINZA}>
        Segurança e Meio Ambiente
      </text>
    </g>
  );
}

// Red "EXEMPLO" stamp shown on every sheet.
export function SeloExemplo({ x, y, rot = -9, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect width="48" height="13" rx="3" fill="#fff" stroke={CARIMBO} strokeWidth="1.1" />
      <text x="24" y="9.4" fontSize="6.6" fontWeight="700" fill={CARIMBO} textAnchor="middle" letterSpacing="0.8">
        EXEMPLO
      </text>
    </g>
  );
}
