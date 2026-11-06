// Generates the share images (og:image, 1200 x 630) for each page in public/og/<slug>.png.
// This is what shows up when someone sends the link on WhatsApp, Instagram, LinkedIn or e-mail.
// Run by hand when a title changes:  node scripts/og.mjs
// Uses @resvg/resvg-js (SVG -> PNG, no browser) and the Manrope font (OFL, static files 500 to 800 from Google Fonts) in scripts/og-fonts/.
// The output is versioned in public/og/, so the Vercel deploy does not need to generate anything.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import { PAGES } from "../src/content/pages.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FONTS = ["500", "600", "700", "800"].map((w) => path.join(root, `scripts/og-fonts/Manrope-${w}.ttf`));
const OUTPUT_DIR = path.join(root, "public/og");

const LABEL = {
  area: "Serviço",
  guide: "Guia",
  location: "Atendimento",
  quiz: "Passo a passo",
  "guide-index": "Guias",
  reminder: "Lembrete grátis",
  privacy: "Transparência",
  terms: "Transparência",
  credits: "Créditos",
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Wraps the title into lines by approximate character count (Manrope 600 at 64 px ≈ 0.55 em per letter)
function wrapLines(text, max) {
  const lines = [];
  let current = "";
  for (const p of text.split(/\s+/)) {
    if ((current + " " + p).trim().length > max && current) {
      lines.push(current);
      current = p;
    } else current = (current + " " + p).trim();
  }
  if (current) lines.push(current);
  return lines;
}

function svg({ label, title }) {
  let size = 68;
  let lines = wrapLines(title, 28);
  if (lines.length > 3) {
    size = 56;
    lines = wrapLines(title, 34);
  }
  if (lines.length > 4) lines = [...lines.slice(0, 3), lines.slice(3).join(" ")];
  const lineHeight = size * 1.08;
  const y0 = Math.max(300 - ((lines.length - 1) * lineHeight) / 2, 184 + size);
  const texts = lines
    .map((l, i) => `<text x="80" y="${(y0 + i * lineHeight).toFixed(0)}" font-size="${size}" font-weight="700" fill="#151515" letter-spacing="-1.5">${esc(l)}</text>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f6f6f4"/>
  <rect x="0" y="0" width="16" height="630" fill="#18692f"/>
  <g font-family="Manrope">
    <rect x="80" y="72" width="64" height="40" rx="8" fill="#18692f"/>
    <text x="112" y="101" font-size="24" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">RD</text>
    <text x="160" y="101" font-size="26" font-weight="700" fill="#151515">RD Engenharia</text>
    <text x="80" y="160" font-size="26" font-weight="600" fill="#18692f">${esc(label)}</text>
    ${texts}
    <line x1="80" y1="528" x2="1120" y2="528" stroke="#e2e2de" stroke-width="2"/>
    <text x="80" y="572" font-size="24" font-weight="500" fill="#55585b">Ibirá e região · presencial e online · orçamento pelo WhatsApp</text>
    <text x="1120" y="572" font-size="24" font-weight="600" fill="#18692f" text-anchor="end">rdibiraengenharia.com.br</text>
  </g>
</svg>`;
}

function generate(name, data) {
  const r = new Resvg(svg(data), {
    font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: "Manrope" },
    fitTo: { mode: "width", value: 1200 },
  });
  const file = path.join(OUTPUT_DIR, `${name}.png`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, r.render().asPng());
  return file;
}

const list = [{ name: "inicio", label: "Ibirá/SP e região", title: "Laudos, projetos e licenças em dia para empresas, obras e imóveis rurais." }];
for (const p of PAGES) list.push({ name: p.slug.replace(/\//g, "-"), label: LABEL[p.type] || "RD Engenharia", title: p.h1 });
for (const item of list) generate(item.name, item);
console.log(`Geradas ${list.length} imagens em public/og/`);
