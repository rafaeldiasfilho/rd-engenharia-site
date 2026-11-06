import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { FAQ } from "./src/faqItems.js";

const root = path.dirname(fileURLToPath(import.meta.url));

// Injects the FAQPage JSON-LD into index.html from src/faqItems.js (single source of the FAQ).
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

// Tailwind only for the components in components/ui (shadcn/21st.dev pattern); the rest of the site stays
// in styles.css. "@/..." points to src/, as those components expect.
export default defineConfig({
  plugins: [react(), faqJsonLd()],
  resolve: {
    alias: { "@": path.resolve(root, "src") },
  },
});
