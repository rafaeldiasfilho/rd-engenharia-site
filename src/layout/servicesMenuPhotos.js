// Photo shown beside the list in the header's services panel: the first photo of that area's carousel
// (src/content/photoCarousels.js, key "area-<slug>"). Returns null when the area has no photo.

import { slidesFor } from "../content/photoCarousels.js";
import { photoPath, srcset } from "../photos.js";

export function buildServicesMenuPreviewPhoto(areaSlug) {
  if (typeof areaSlug !== "string" || areaSlug === "") return null;
  const [firstAreaSlide] = slidesFor(`area-${areaSlug}`);
  if (!firstAreaSlide) return null;
  const areaPhoto = firstAreaSlide.f;
  return {
    src: photoPath(areaPhoto),
    srcSet: srcset(areaPhoto),
    width: areaPhoto.w,
    height: areaPhoto.h,
  };
}
