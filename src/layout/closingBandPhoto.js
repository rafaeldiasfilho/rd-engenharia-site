// Photo behind the closing band ("Próximo passo") of the inner pages. An area page uses the second photo
// of its carousel (the first one is already its hero); a guide uses the photo of its area; any other page
// uses a general one from the home carousel. Returns null when no photo exists (the band stays dark green).

import { GUIDES } from "../content/guides.js";
import { slidesFor } from "../content/photoCarousels.js";

const GENERAL_CLOSING_SLIDE_INDEX = 2; // home carousel: concrete structure under construction

function areaSlugForPage(pageSlug) {
  const closingGuide = GUIDES.find((guide) => guide.slug === pageSlug);
  return closingGuide ? closingGuide.area : pageSlug;
}

export function buildClosingBandPhoto(pageSlug) {
  const areaSlides = typeof pageSlug === "string" && pageSlug !== "" ? slidesFor(`area-${areaSlugForPage(pageSlug)}`) : [];
  const closingSlide = areaSlides[1] || areaSlides[0] || slidesFor("home")[GENERAL_CLOSING_SLIDE_INDEX];
  return closingSlide ? closingSlide.f : null;
}
