// Gera as imagens de compartilhamento (og:image, 1200 x 630) de cada página em public/og/<slug>.png.
// É o que aparece quando alguém manda o link no WhatsApp, Instagram, LinkedIn ou e-mail.
// Rodar à mão quando um título mudar:  node scripts/og.mjs
// Usa @resvg/resvg-js (SVG -> PNG, sem navegador) e a fonte Manrope (OFL, arquivos estáticos 500 a 800 do Google Fonts) em scripts/og-fonts/.
// O resultado fica versionado em public/og/, então a publicação na Vercel não precisa gerar nada.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import { PAGINAS } from "../src/pagesData.js";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FONTES = ["500", "600", "700", "800"].map((w) => path.join(raiz, `scripts/og-fonts/Manrope-${w}.ttf`));
const SAIDA = path.join(raiz, "public/og");

const ROTULO = {
  area: "Serviço",
  guia: "Guia",
  onde: "Atendimento",
  quiz: "Passo a passo",
  "guias-indice": "Guias",
  lembrete: "Lembrete grátis",
  privacidade: "Transparência",
  termos: "Transparência",
  creditos: "Créditos",
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Quebra o título em linhas por número aproximado de caracteres (Manrope 600 em 64 px ≈ 0,55 em por letra)
function quebrar(texto, max) {
  const linhas = [];
  let atual = "";
  for (const p of texto.split(/\s+/)) {
    if ((atual + " " + p).trim().length > max && atual) {
      linhas.push(atual);
      atual = p;
    } else atual = (atual + " " + p).trim();
  }
  if (atual) linhas.push(atual);
  return linhas;
}

function svg({ rotulo, titulo }) {
  let tamanho = 68;
  let linhas = quebrar(titulo, 28);
  if (linhas.length > 3) {
    tamanho = 56;
    linhas = quebrar(titulo, 34);
  }
  if (linhas.length > 4) linhas = [...linhas.slice(0, 3), linhas.slice(3).join(" ")];
  const alturaLinha = tamanho * 1.08;
  const y0 = Math.max(300 - ((linhas.length - 1) * alturaLinha) / 2, 184 + tamanho);
  const textos = linhas
    .map((l, i) => `<text x="80" y="${(y0 + i * alturaLinha).toFixed(0)}" font-size="${tamanho}" font-weight="700" fill="#151515" letter-spacing="-1.5">${esc(l)}</text>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f6f6f4"/>
  <rect x="0" y="0" width="16" height="630" fill="#18692f"/>
  <g font-family="Manrope">
    <rect x="80" y="72" width="64" height="40" rx="8" fill="#18692f"/>
    <text x="112" y="101" font-size="24" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">RD</text>
    <text x="160" y="101" font-size="26" font-weight="700" fill="#151515">RD Engenharia</text>
    <text x="80" y="160" font-size="26" font-weight="600" fill="#18692f">${esc(rotulo)}</text>
    ${textos}
    <line x1="80" y1="528" x2="1120" y2="528" stroke="#e2e2de" stroke-width="2"/>
    <text x="80" y="572" font-size="24" font-weight="500" fill="#55585b">Ibirá e região · presencial e online · orçamento pelo WhatsApp</text>
    <text x="1120" y="572" font-size="24" font-weight="600" fill="#18692f" text-anchor="end">rdibiraengenharia.com.br</text>
  </g>
</svg>`;
}

function gerar(nome, dados) {
  const r = new Resvg(svg(dados), {
    font: { fontFiles: FONTES, loadSystemFonts: false, defaultFontFamily: "Manrope" },
    fitTo: { mode: "width", value: 1200 },
  });
  const arquivo = path.join(SAIDA, `${nome}.png`);
  fs.mkdirSync(path.dirname(arquivo), { recursive: true });
  fs.writeFileSync(arquivo, r.render().asPng());
  return arquivo;
}

const lista = [{ nome: "inicio", rotulo: "Ibirá/SP e região", titulo: "Laudos, projetos e licenças em dia para empresas, obras e imóveis rurais." }];
for (const p of PAGINAS) lista.push({ nome: p.slug.replace(/\//g, "-"), rotulo: ROTULO[p.tipo] || "RD Engenharia", titulo: p.h1 });
for (const item of lista) gerar(item.nome, item);
console.log(`Geradas ${lista.length} imagens em public/og/`);
