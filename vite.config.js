import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { FAQ } from "./src/faq.js";

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

export default defineConfig({
  plugins: [react(), faqJsonLd()],
});
