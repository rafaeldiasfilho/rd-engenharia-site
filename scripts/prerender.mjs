// Generates a static HTML file for each inner page (so Google can read the content)
// and updates the sitemap. Runs after "vite build".
import fs from "node:fs";
import path from "node:path";
import { createServer } from "vite";

const root = process.cwd();
const dist = path.join(root, "dist");
const vite = await createServer({
  root: root,
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true },
});

try {
  const { render, render404, renderPrint, renderHome, PAGES, AREAS, SITE_URL } = await vite.ssrLoadModule("/src/entry-server.jsx");
  const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
  const esc = (t) => t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const jsonScript = (obj) =>
    `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

  // Strips from the template (home) everything specific to the home page.
  // Business entity (ProfessionalService, with hasMap and geo) from index.html: goes on every page.
  const business = (template.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/) || [""])[0];
  // Service.provider and Article.publisher point at the business by its "@id", so the build stops if the
  // business block in index.html loses it (the references would point at nothing).
  const BUSINESS_ID = `${SITE_URL}/#empresa`;
  const businessData = JSON.parse(business.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "") || "{}");
  if (businessData["@id"] !== BUSINESS_ID) throw new Error(`index.html: the business JSON-LD must have "@id": "${BUSINESS_ID}".`);
  const base = template
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, "")
    .replace(/<link rel="canonical"[^>]*\/>/, "")
    .replace(/<meta\s+property="og:(title|description|url|image)"[\s\S]*?\/>/g, "")
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, "")
    .replace(/<noscript>[\s\S]*?<\/noscript>/, "");

  for (const page of PAGES) {
    const url = `${SITE_URL}/${page.slug}`;
    const ogImage = `${SITE_URL}/og/${page.slug.replace(/\//g, "-")}.png`;
    // Breadcrumb with real pages only: Início > page, and guides under the "Guias" index. Areas have no middle
    // level: "Serviços" is a section of the home page (/#servicos), not a page of its own.
    const trail = [
      { name: "Início", url: `${SITE_URL}/` },
      ...(page.type === "guide" ? [{ name: "Guias", url: `${SITE_URL}/guias` }] : []),
      { name: page.type === "area" ? page.name : page.h1, url },
    ];
    const data = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((step, n) => ({ "@type": "ListItem", position: n + 1, name: step.name, item: step.url })),
      },
    ];
    if (page.type === "area") {
      data.push({
        "@context": "https://schema.org",
        "@type": "Service",
        name: page.name,
        description: page.description,
        url,
        provider: { "@id": BUSINESS_ID },
        areaServed: { "@type": "City", name: "Ibirá" },
      });
      data.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      });
    }
    if (page.type === "guide") {
      // Dates come from src/content/guides.js (also the "Atualizado em" line and the sitemap lastmod).
      const isoDate = /^\d{4}-\d{2}-\d{2}$/;
      if (!isoDate.test(page.published) || !isoDate.test(page.updated)) throw new Error(`${page.slug}: published and updated must be YYYY-MM-DD.`);
      data.push({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: page.h1,
        description: page.description,
        image: ogImage,
        datePublished: page.published,
        dateModified: page.updated,
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: "RD Engenharia Segurança e Meio Ambiente", url: `${SITE_URL}/` },
        publisher: { "@id": BUSINESS_ID },
      });
    }

    const head = [
      `<title>${esc(page.title)}</title>`,
      `<meta name="description" content="${esc(page.description)}" />`,
      `<link rel="canonical" href="${url}" />`,
      `<meta property="og:title" content="${esc(page.title)}" />`,
      `<meta property="og:description" content="${esc(page.description)}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:image" content="${ogImage}" />`,
      ...data.map(jsonScript),
      business,
    ].join("\n    ");

    const html = base
      .replace("</head>", `    ${head}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${render(page)}</div>`);

    const destination = path.join(dist, page.slug, "index.html");
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, html);
  }

  // Print pages for the document checklist: noindex, outside the sitemap, no JSON-LD or canonical.
  for (const area of AREAS) {
    const htmlPrint = base
      .replace("</head>", `    <title>Lista de documentos | ${esc(area.name)} | RD Engenharia</title>\n    <meta name="robots" content="noindex, nofollow" />\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${renderPrint(area)}</div>`);
    const dest = path.join(dist, "imprimir", area.slug, "index.html");
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, htmlPrint);
  }

  const html404 = base
    .replace("</head>", `    <title>Página não encontrada | RD Engenharia</title>\n    <meta name="robots" content="noindex" />\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root" data-error="404">${render404()}</div>`);
  fs.writeFileSync(path.join(dist, "404.html"), html404);

  const htmlAdmin = base
    .replace("</head>", `    <title>Área interna | RD Engenharia</title>\n    <meta name="robots" content="noindex, nofollow" />\n  </head>`);
  fs.mkdirSync(path.join(dist, "admin"), { recursive: true });
  fs.writeFileSync(path.join(dist, "admin", "index.html"), htmlAdmin);

  // Home page: the same template (with the home title, description and JSON-LD), now with the rendered content.
  // It comes last because the template for the other pages was read from the original index.html above.
  fs.writeFileSync(path.join(dist, "index.html"), template.replace('<div id="root"></div>', `<div id="root">${renderHome()}</div>`));

  // lastmod only where the date is known and true: each guide's `updated` date. The other pages have no reliable
  // per-page date (the build date changes on every deploy even when the page does not), and Google ignores lastmod
  // on sites where it is not consistently accurate, which would also discard the guide dates. So they get none.
  const sitemapPages = [{ slug: "", type: "home" }, ...PAGES.filter((p) => !["privacy", "terms"].includes(p.type))];
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    sitemapPages
      .map((p) => {
        const lastmod = p.type === "guide" ? `\n    <lastmod>${p.updated}</lastmod>` : "";
        return `  <url>\n    <loc>${SITE_URL}/${p.slug}</loc>${lastmod}\n  </url>`;
      })
      .join("\n") +
    `\n</urlset>\n`;
  fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);

  // llms.txt: site summary for AI assistants (format proposed at llmstxt.org; optional, no guarantee
  // that any product uses it). Generated from the same page data, so it never goes stale.
  const line = (p) => `- [${p.h1}](${SITE_URL}/${p.slug}): ${p.description}`;
  const group = (types) => PAGES.filter((p) => types.includes(p.type)).map(line).join(String.fromCharCode(10));
  const llms = [
    "# RD Engenharia Segurança e Meio Ambiente",
    "",
    "> Empresa de engenharia de Ibirá/SP que atende Ibirá e região, presencialmente e online: engenharia civil, segurança do trabalho, prevenção de incêndio (AVCB e CLCB), meio ambiente, topografia e imóvel rural. Trabalhos que exigem são assinados por profissional habilitado no CREA-SP, com ART.",
    "",
    "- Contato: somente pelo WhatsApp (+55 17 99721-1208), de segunda a sexta, das 7h às 17h.",
    "- Endereço: Rua José Alves de Mello, 770, Centro, Ibirá/SP.",
    "- O site não mostra preços nem prazos fixos: valor e prazo vêm no orçamento, por escrito e sem compromisso.",
    "",
    "## Serviços",
    group(["area"]),
    "",
    "## Guias",
    group(["guide"]),
    "",
    "## Outras páginas",
    group(["location", "quiz", "reminder", "guide-index"]),
    "",
    "## Opcional",
    group(["privacy", "terms", "credits"]),
    "",
  ].join(String.fromCharCode(10));
  fs.writeFileSync(path.join(dist, "llms.txt"), llms);
  console.log(`Prerendered ${PAGES.length} pages (plus ${AREAS.length} print pages, not in the sitemap).`);
} finally {
  await vite.close();
}
