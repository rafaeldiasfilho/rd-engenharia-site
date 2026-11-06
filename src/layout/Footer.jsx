// Site footer: company data, areas, Google rating and theme selector.

import AreaIcon from "../AreaIcon";
import { HalftoneWordmark } from "../components/ui/halftone-wordmark";
import { AREAS } from "../content/areas";
import { GOOGLE_REVIEWS_URL, GOOGLE_RATING } from "../content/googleAndMaps";
import { LEGAL_NAME, CNPJ, OPEN_SINCE, TECHNICAL_LEAD, CREA_NUMBER, ADDRESS } from "../company";
import { ThemeSelector } from "./ThemeSelector.jsx";

export function Footer() {
  return (
    <footer className="footer">
      {/* No WhatsApp invitation here: the "Próximo passo" section (or Contact, on the home page) and the floating button already do that */}
      <div className="wrap footer-grid">
        <div>
          <a className="footer-logo" href="/" aria-label="RD Engenharia, página inicial">
            <img src="/marca/marca-lockup.webp" width="720" height="396" alt="RD Engenharia, Segurança e Meio Ambiente" loading="lazy" />
          </a>
          <p className="footer-brand">{LEGAL_NAME}</p>
          <p>CNPJ {CNPJ} · ativo desde {OPEN_SINCE}</p>
          <p>
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
              {ADDRESS}
            </a>
          </p>
          <p>Segunda a sexta, das 7h às 17h</p>
          <p>
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
              {GOOGLE_RATING}
            </a>
          </p>
          <p>Responsável técnico: {TECHNICAL_LEAD} · {CREA_NUMBER}</p>
        </div>
        <div>
          <h3 className="footer-title">Serviços</h3>
          <ul>
            {AREAS.map((a) => (
              <li key={a.slug}>
                <a href={`/${a.slug}`} className="footer-area">
                  <AreaIcon slug={a.slug} size={18} /> {a.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="footer-title">Onde atendemos</h3>
          <p>Atendemos presencialmente e online em Ibirá e região.</p>
          <p>
            <a href="/onde-atendemos">Ver onde atendemos</a>
          </p>
        </div>
        <div>
          <h3 className="footer-title">Mais</h3>
          <ul>
            <li>
              <a href="/o-que-preciso">Descubra o que o seu caso precisa</a>
            </li>
            <li>
              <a href="/guias">Guias</a>
            </li>
            <li>
              <a href="/lembrete-de-vencimento">Lembrete de vencimento</a>
            </li>
            <li>
              <a href="/#duvidas">Dúvidas frequentes</a>
            </li>
            <li>
              <a href="https://www.instagram.com/rd_engenhariaibira/" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="/privacidade">Política de privacidade</a>
            </li>
            <li>
              <a href="/termos-de-uso">Termos de uso</a>
            </li>
            <li>
              <a href="/creditos">Créditos das imagens</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-end">
        <p>© RD Engenharia Segurança e Meio Ambiente</p>
        <ThemeSelector />
      </div>
      {/* Giant wordmark at the end of the page, decorative, in halftone dots that react to the pointer */}
      <HalftoneWordmark word="RD Engenharia" className="footer-halftone" />
    </footer>
  );
}
