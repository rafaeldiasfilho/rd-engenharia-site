import { CNPJ, CREA_NUMBER } from "./company";
// Shared base for the illustrative examples (sheets, drawings, panel): paper colors, logo, RD public data
// and fictional clients. Nothing here belongs to a real client; the paper is always light (works in both themes).

export const PAPER = "#fdfdfb";
export const BORDER = "#c9d0c6";
export const LINE = "#dde2da";
export const INK = "#26302a";
export const GRAY = "#5f6a62";
export const BACKGROUND = "#f1f4ef";
export const GREEN = "#1f6b2a";
export const LIGHT_GREEN = "#8fc08c";
export const AMBER = "#c98f1c";
export const RED = "#c0392b";
export const BLUE = "#2a6fd1";
export const BROWN = "#8a5a2b";
export const STAMP_RED = "#9b2c2c";

export const RD_CNPJ = `CNPJ ${CNPJ}`;
export const RESPONSIBLE_ENGINEER = "Eng. Rafael Antonio Dias";
export const CREA = CREA_NUMBER;
export const ISSUE_DATE = "outubro de 2026";

export const SAMPLE_CAPTION = "Exemplo ilustrativo de documento, não é um documento real.";

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
export const clientFor = (m, area) => CLIENTS[m.client || CLIENT_BY_AREA[area] || "empresa"];

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
      <rect width="14" height="14" rx="3" fill={GREEN} />
      <text x="7" y="9.6" fontSize="6.4" fontWeight="700" fill="#fff" textAnchor="middle">
        RD
      </text>
      <text x="18" y="5.8" fontSize="5.2" fontWeight="700" fill={INK} letterSpacing="0.3">
        RD ENGENHARIA
      </text>
      <text x="18" y="11.6" fontSize="3.5" fill={GRAY}>
        Segurança e Meio Ambiente
      </text>
    </g>
  );
}

// Red "EXEMPLO" stamp shown on every sheet.
export function ExampleStamp({ x, y, rot = -9, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect width="48" height="13" rx="3" fill="#fff" stroke={STAMP_RED} strokeWidth="1.1" />
      <text x="24" y="9.4" fontSize="6.6" fontWeight="700" fill={STAMP_RED} textAnchor="middle" letterSpacing="0.8">
        EXEMPLO
      </text>
    </g>
  );
}
