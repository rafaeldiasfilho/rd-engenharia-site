// On the home and area pages the header is transparent while it sits over the full-screen hero photo, and gets its
// normal glass background once the hero has scrolled away. Starts "over the hero" so the prerendered HTML
// already has the transparent header (no flash on load).

import { useEffect, useState } from "react";

const HOME_HERO_SELECTOR = ".hero-reveal";
const FALLBACK_HEADER_HEIGHT = 64;

function readHeaderHeight() {
  const headerHeightValue = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10);
  return Number.isFinite(headerHeightValue) && headerHeightValue > 0 ? headerHeightValue : FALLBACK_HEADER_HEIGHT;
}

export function useHeaderOverHero(pageHasPhotoHero) {
  const [headerIsOverHero, setHeaderIsOverHero] = useState(pageHasPhotoHero);

  useEffect(() => {
    if (!pageHasPhotoHero) {
      setHeaderIsOverHero(false);
      return undefined;
    }
    const homeHero = document.querySelector(HOME_HERO_SELECTOR);
    if (!homeHero || !("IntersectionObserver" in window)) {
      setHeaderIsOverHero(false);
      return undefined;
    }
    // The header is over the hero while the hero still reaches below the header's bottom edge.
    const heroObserver = new IntersectionObserver(([heroEntry]) => setHeaderIsOverHero(heroEntry.isIntersecting), {
      rootMargin: `-${readHeaderHeight()}px 0px 0px 0px`,
      threshold: 0,
    });
    heroObserver.observe(homeHero);
    return () => heroObserver.disconnect();
  }, [pageHasPhotoHero]);

  return headerIsOverHero;
}
