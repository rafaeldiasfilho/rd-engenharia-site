// Gera um arquivo HTML estático para cada página interna (para o Google ler o conteúdo)
// e atualiza o sitemap. Roda depois do "vite build".
import fs from "node:fs";
import path from "node:path";
import { createServer } from "vite";

const raiz = process.cwd();
const dist = path.join(raiz, "dist");
const vite = await createServer({
  root: raiz,
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true },
});

try {
  const { render, PAGINAS, SITE_URL } = await vite.ssrLoadModule("/src/entry-server.jsx");
  const modelo = fs.readFileSync(path.join(dist, "index.html"), "utf8");
  const esc = (t) => t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const jsonScript = (obj) =>
    `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

  // Remove do modelo (home) tudo o que é específico da página inicial.
  const base = modelo
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, "")
    .replace(/<link rel="canonical"[^>]*\/>/, "")
    .replace(/<meta\s+property="og:(title|description|url)"[\s\S]*?\/>/g, "")
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, "")
    .replace(/<noscript>[\s\S]*?<\/noscript>/, "");

  for (const pagina of PAGINAS) {
    const url = `${SITE_URL}/${pagina.slug}`;
    const dados = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: pagina.h1, item: url },
        ],
      },
    ];
    if (pagina.tipo === "area") {
      dados.push({
        "@context": "https://schema.org",
        "@type": "Service",
        name: pagina.nome,
        description: pagina.description,
        url,
        provider: { "@type": "ProfessionalService", name: "RD Engenharia Segurança e Meio Ambiente", url: `${SITE_URL}/` },
        areaServed: ["Ibirá", "Urupes", "Potirendaba", "Irapuã", "Catanduva", "São José do Rio Preto"],
      });
      dados.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: pagina.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      });
    }
    if (pagina.tipo === "guia") {
      dados.push({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: pagina.h1,
        description: pagina.description,
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: "RD Engenharia Segurança e Meio Ambiente" },
        publisher: { "@type": "Organization", name: "RD Engenharia Segurança e Meio Ambiente" },
      });
    }

    const cabeca = [
      `<title>${esc(pagina.title)}</title>`,
      `<meta name="description" content="${esc(pagina.description)}" />`,
      `<link rel="canonical" href="${url}" />`,
      `<meta property="og:title" content="${esc(pagina.title)}" />`,
      `<meta property="og:description" content="${esc(pagina.description)}" />`,
      `<meta property="og:url" content="${url}" />`,
      ...dados.map(jsonScript),
    ].join("\n    ");

    const html = base
      .replace("</head>", `    ${cabeca}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${render(pagina)}</div>`);

    const destino = path.join(dist, pagina.slug, "index.html");
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.writeFileSync(destino, html);
  }

  const hoje = new Date().toISOString().slice(0, 10);
  const urls = ["", ...PAGINAS.filter((p) => p.tipo !== "privacidade").map((p) => p.slug)];
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((s) => `  <url>\n    <loc>${SITE_URL}/${s}</loc>\n    <lastmod>${hoje}</lastmod>\n  </url>`)
      .join("\n") +
    `\n</urlset>\n`;
  fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
  console.log(`Pré-renderizadas ${PAGINAS.length} páginas.`);
} finally {
  await vite.close();
}
