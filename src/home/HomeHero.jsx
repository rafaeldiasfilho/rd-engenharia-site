// Home page hero: one full-bleed photo, the title, one line of support, the quote button, a quiet
// link for visitors who do not know what they need, and the Google rating as plain text.
// Entrance (src/styles/22-hero-redesign.css): the photo opens from a small centred frame on the light
// page colour, then the header and the texts fade in, one after the other. CSS only, so it already
// runs on the prerendered HTML; "reduce motion" shows everything at once.
import Icon from "../Icon";
import { whatsappLink } from "../contact";
import { GOOGLE_RATING, GOOGLE_REVIEWS_URL } from "../content/googleAndMaps";
import { slidesFor } from "../content/photoCarousels";
import { photoNotice, photoPath, srcset } from "../photos";
import { generalWhatsappMessage } from "../whatsappMessages";

// The first photo of the home carousel (also the old hero's first photo, so the file stays cached).
const [HOME_HERO_SLIDE] = slidesFor("home");

export function HomeHero() {
  const homeHeroPhoto = HOME_HERO_SLIDE ? HOME_HERO_SLIDE.f : null;
  return (
    <section className="hero-reveal" aria-labelledby="home-hero-title">
      {homeHeroPhoto && (
        <div className="hero-reveal-media">
          <img
            src={photoPath(homeHeroPhoto)}
            srcSet={srcset(homeHeroPhoto)}
            sizes="100vw"
            width={homeHeroPhoto.w}
            height={homeHeroPhoto.h}
            alt={homeHeroPhoto.alt}
            fetchpriority="high"
            decoding="async"
            draggable={false}
          />
        </div>
      )}
      <div className="container hero-reveal-content">
        <h1 id="home-hero-title" className="hero-reveal-title">
          Laudos, projetos e licenças em dia.
        </h1>
        <p className="hero-reveal-lead">Fale direto com o responsável técnico, presencial ou online, em Ibirá e região.</p>
        <div className="hero-reveal-actions">
          <a className="btn btn-whatsapp btn-large btn-arrow" href={whatsappLink(generalWhatsappMessage())} target="_blank" rel="noopener noreferrer">
            <Icon name="fa-brands fa-whatsapp" />
            <span>
              Pedir orçamento<span className="sr-only"> pelo WhatsApp</span>
            </span>
            <span className="btn-arrow-icon" aria-hidden="true">
              →
            </span>
          </a>
          <a className="hero-reveal-link" href="/o-que-preciso">
            Não sabe o que precisa?
          </a>
        </div>
        <a className="hero-reveal-proof" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
          <span aria-hidden="true">★</span> {GOOGLE_RATING}
        </a>
      </div>
      {homeHeroPhoto && (
        <p className="container hero-reveal-credit">
          {photoNotice(homeHeroPhoto)} <a href="/creditos">Créditos</a>
        </p>
      )}
    </section>
  );
}
