// Page shell used by every page: skip link, header, main content, footer and the floating WhatsApp button.

import { ReadingProgress, useAnchor, useReveal } from "./scrollEffects.jsx";
import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";
import { FloatingWhatsapp } from "./FloatingWhatsapp.jsx";

export function Shell({ children, current = "" }) {
  useReveal();
  useAnchor();
  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <ReadingProgress />
      <Header current={current} />
      <main id="conteudo">{children}</main>
      <Footer />
      <FloatingWhatsapp current={current} />
    </>
  );
}
