// Home page hero: Google rating badge, title, quote button and the office hours status.
import Icon from "../Icon";
import HeroBackground from "../HeroBackground";
import { whatsappLink } from "../contact";
import { GOOGLE_RATING, GOOGLE_REVIEWS_URL } from "../content/googleAndMaps";
import { OfficeHoursStatus } from "../OfficeHoursStatus.jsx";
import { generalWhatsappMessage } from "../whatsappMessages";

// The quote button must fit the first screen of small phones (375 x 548 visible in Safari):
// one short lead under the title, the reassurance under the button.
export function HomeHero() {
  return (
    <HeroBackground setKey="home" label="As quatro áreas de atuação da RD Engenharia, em fotos ilustrativas" className="hero-home">
      <a className="badge-top" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
        <span className="badge-top-stars" aria-hidden="true">
          ★★★★★
        </span>
        <span>{GOOGLE_RATING}</span>
        <span className="badge-top-arrow" aria-hidden="true">
          →
        </span>
      </a>
      <p className="eyebrow">RD Engenharia · Ibirá/SP</p>
      <h1 className="display">Laudos, projetos e licenças em dia para empresas, obras e imóveis rurais.</h1>
      <p className="lead">Engenharia, segurança do trabalho e meio ambiente em Ibirá e região, presencial e online.</p>
      <div className="actions">
        <a className="btn btn-whatsapp btn-large" href={whatsappLink(generalWhatsappMessage())} target="_blank" rel="noopener noreferrer">
          <Icon name="fa-brands fa-whatsapp" /> Pedir orçamento pelo WhatsApp
        </a>
        <a className="link-arrow hero-link" href="/o-que-preciso">
          Não sabe o que precisa? Descubra aqui <span aria-hidden="true">→</span>
        </a>
      </div>
      <p className="hero-risk">Você fala direto com o responsável técnico. Orçamento por escrito e sem compromisso.</p>
      <OfficeHoursStatus />
    </HeroBackground>
  );
}
