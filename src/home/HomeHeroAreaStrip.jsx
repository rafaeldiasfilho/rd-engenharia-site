// Frosted strip at the bottom of the home hero with the four service areas, so a visitor can jump
// straight to the right area from the first screen. Layout idea from the Watermelon UI "hero 26" block
// (frosted feature strip), rewritten in plain CSS with the site colours (src/styles/22-hero-area-strip.css).
import Icon from "../Icon";
import { AREAS } from "../content/areas";

export function HomeHeroAreaStrip() {
  return (
    <nav className="hero-area-strip" aria-label="Áreas de atuação">
      <ul>
        {AREAS.map((heroStripArea) => (
          <li key={heroStripArea.slug}>
            <a href={`/${heroStripArea.slug}`}>
              <Icon name={heroStripArea.icon} />
              <span>{heroStripArea.label}</span>
              <span className="hero-area-strip-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
