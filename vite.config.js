import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { FAQ } from "./src/faq.js";

const raiz = path.dirname(fileURLToPath(import.meta.url));

// Injeta o JSON-LD FAQPage no index.html a partir de src/faq.js (fonte única do FAQ).
const faqJsonLd = () => ({
  name: "faq-jsonld",
  transformIndexHtml(html) {
    const data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    };
    const json = JSON.stringify(data).replace(/</g, "\\u003c");
    return html.replace("</head>", `    <script type="application/ld+json">${json}</script>\n  </head>`);
  },
});

// Tailwind só para os componentes de components/ui (padrão shadcn/21st.dev); o resto do site segue
// em styles.css. "@/..." aponta para src/, como esses componentes esperam.
export default defineConfig({
  plugins: [react(), tailwindcss(), faqJsonLd()],
  resolve: {
    alias: { "@": path.resolve(raiz, "src") },
  },
});
