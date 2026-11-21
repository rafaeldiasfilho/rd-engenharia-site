// Home page hero: one full-screen photo with the header over it, the title in the vertical middle, and
// one short line plus the quote button anchored at the bottom left. "(role para baixo)" sits at the
// bottom right, on the header's right margin.
// Entrance (src/styles/22-hero-redesign.css), CSS only so it already runs on the prerendered HTML:
// a thin green line on the light page, which turns into a narrow strip of the photo, widens into a
// centred frame and opens to the full screen; then the header and the texts rise in, 100 ms apart.
// "Reduce motion" shows everything at once.
import { whatsappLink } from "../contact";
import { slidesFor } from "../content/photoCarousels";
import { photoPath, srcset } from "../photos";
import { generalWhatsappMessage } from "../whatsappMessages";

// The first photo of the home carousel (also the old hero's photo, so the file stays cached).
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
      <div className="container hero-reveal-inner">
        <div className="hero-reveal-middle">
          <h1 id="home-hero-title" className="hero-reveal-title">
            <span>Laudos, projetos</span> <span>e licenças</span> <span>em dia.</span>
          </h1>
        </div>
        <div className="hero-reveal-bottom">
          <div className="hero-reveal-intro">
            <p className="hero-reveal-lead">Fale direto com o responsável técnico, presencial ou online, em Ibirá e região.</p>
            <a className="btn-glass btn-arrow" href={whatsappLink(generalWhatsappMessage())} target="_blank" rel="noopener noreferrer">
              <span>
                Pedir orçamento<span className="sr-only"> pelo WhatsApp</span>
              </span>
              <span className="btn-arrow-icon" aria-hidden="true">
                →
              </span>
            </a>
          </div>
          <p className="hero-reveal-scroll" aria-hidden="true">
            (role para baixo)
          </p>
        </div>
      </div>
    </section>
  );
}
