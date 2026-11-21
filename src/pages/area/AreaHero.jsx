// Top of an area page, in the home hero's editorial style (src/styles/22-hero-redesign.css, "plain"
// variant without the line-to-full-screen entrance): full-screen photo under the transparent header,
// breadcrumb at the top, title in the vertical middle, the area's one-line summary and the glass quote
// button at the bottom left, the photo notice at the bottom right.
// The long intro, the cost note and the office hours open the page right below (AreaIntro).
import { Breadcrumb } from "../../layout/Breadcrumb";
import { WhatsappButton } from "../../layout/WhatsappButton";
import { OfficeHoursStatus } from "../../OfficeHoursStatus.jsx";
import { slidesFor } from "../../content/photoCarousels";
import { photoNotice, photoPath, srcset } from "../../photos";

export function AreaHero({ page, areaWhatsappText }) {
  const [areaHeroSlide] = slidesFor(`area-${page.slug}`);
  const areaHeroPhoto = areaHeroSlide ? areaHeroSlide.f : null;
  return (
    <section className="hero-reveal hero-reveal-plain" aria-labelledby="area-hero-title">
      {areaHeroPhoto && (
        <div className="hero-reveal-media">
          <img
            src={photoPath(areaHeroPhoto)}
            srcSet={srcset(areaHeroPhoto)}
            sizes="100vw"
            width={areaHeroPhoto.w}
            height={areaHeroPhoto.h}
            alt={areaHeroPhoto.alt}
            fetchpriority="high"
            decoding="async"
            draggable={false}
          />
        </div>
      )}
      <div className="container hero-reveal-inner">
        <div className="hero-reveal-crumbs">
          <Breadcrumb items={[{ label: "Serviços", href: "/#servicos" }, { label: page.name }]} />
        </div>
        <div className="hero-reveal-middle">
          <h1 id="area-hero-title" className="hero-reveal-title">
            {page.h1}
          </h1>
        </div>
        <div className="hero-reveal-bottom">
          <div className="hero-reveal-intro">
            <p className="hero-reveal-lead">{page.shortText}</p>
            <WhatsappButton variant="glass" text={areaWhatsappText} label="Pedir orçamento" screenReaderSuffix=" pelo WhatsApp" />
          </div>
          {areaHeroPhoto && (
            <p className="hero-reveal-scroll hero-reveal-credit">
              {photoNotice(areaHeroPhoto)} <a href="/creditos">Créditos</a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// First block under the area hero: the full intro, what changes the price and the office hours.
export function AreaIntro({ page }) {
  return (
    <section className="area-intro" aria-label={`Sobre ${page.name}`}>
      <div className="container area-intro-inner">
        <p className="lead">{page.intro}</p>
        <div className="area-intro-side">
          <p className="area-intro-note">
            {page.costDrivers ? `${page.costDrivers} ` : ""}Orçamento por escrito e sem compromisso.
          </p>
          <OfficeHoursStatus className="area-intro-status" />
        </div>
      </div>
    </section>
  );
}
