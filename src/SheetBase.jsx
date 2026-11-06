import { CNPJ, CREA_NUMBER } from "./company";
// Shared base for the illustrative examples (sheets, drawings, panel): paper colors, logo, RD public data
// and fictional clients. Nothing here belongs to a real client; the paper is always light (works in both themes).

export const SHEET_PAPER = "#fdfdfb";
export const SHEET_BORDER = "#c9d0c6";
export const SHEET_LINE = "#dde2da";
export const SHEET_INK = "#26302a";
export const SHEET_GRAY = "#5f6a62";
export const SHEET_BACKGROUND = "#f1f4ef";
export const SHEET_GREEN = "#1f6b2a";
export const SHEET_LIGHT_GREEN = "#8fc08c";
export const SHEET_AMBER = "#c98f1c";
export const SHEET_RED = "#c0392b";
export const SHEET_BLUE = "#2a6fd1";
export const SHEET_BROWN = "#8a5a2b";
export const SHEET_STAMP_RED = "#9b2c2c";

export const RD_CNPJ = `CNPJ ${CNPJ}`;
export const RESPONSIBLE_ENGINEER = "Eng. Rafael Antonio Dias";
export const CREA = CREA_NUMBER;
export const ISSUE_DATE = "outubro de 2026";

export const SAMPLE_CAPTION = "Exemplo ilustrativo de documento, não é um documento real.";

const CLIENTS = {
  company: ["Empresa Exemplo Ltda.", "CNPJ 00.000.000/0001-00 · Ibirá/SP"],
  construction: ["Proprietário Exemplo", "Rua Exemplo, 100 · Ibirá/SP"],
  rural: ["Sítio Exemplo", "Zona rural · Ibirá/SP"],
};
const CLIENT_BY_AREA = {
  "seguranca-do-trabalho": "company",
  "corpo-de-bombeiros": "company",
  "engenharia-civil": "construction",
  "meio-ambiente-topografia": "rural",
};
export const clientFor = (m, area) => CLIENTS[m.client || CLIENT_BY_AREA[area] || "company"];

// Wraps the text into lines of at most `max` characters (SVG does not wrap on its own).
export function wrapText(text, max) {
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

export function Logo({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect width="14" height="14" rx="3" fill={SHEET_GREEN} />
      <text x="7" y="9.6" fontSize="6.4" fontWeight="700" fill="#fff" textAnchor="middle">
        RD
      </text>
      <text x="18" y="5.8" fontSize="5.2" fontWeight="700" fill={SHEET_INK} letterSpacing="0.3">
        RD ENGENHARIA
      </text>
      <text x="18" y="11.6" fontSize="3.5" fill={SHEET_GRAY}>
        Segurança e Meio Ambiente
      </text>
    </g>
  );
}

// Red "EXEMPLO" stamp shown on every sheet.
export function ExampleStamp({ x, y, rot = -9, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect width="48" height="13" rx="3" fill="#fff" stroke={SHEET_STAMP_RED} strokeWidth="1.1" />
      <text x="24" y="9.4" fontSize="6.6" fontWeight="700" fill={SHEET_STAMP_RED} textAnchor="middle" letterSpacing="0.8">
        EXEMPLO
      </text>
    </g>
  );
}
