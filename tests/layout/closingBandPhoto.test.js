// Closing band photo: area pages and guides get a photo of their own area, everything else a general one,
// and the band never ends up without a photo because of an unknown or empty slug.
import { describe, expect, it } from "vitest";
import { buildClosingBandPhoto } from "../../src/layout/closingBandPhoto.js";
import { AREAS } from "../../src/content/areas.js";
import { GUIDES } from "../../src/content/guides.js";
import { slidesFor } from "../../src/content/photoCarousels.js";

const generalPhotoFile = slidesFor("home")[2].f.file;

describe("buildClosingBandPhoto", () => {
  it("uses a photo of the area itself on every area page, different from its hero photo", () => {
    for (const area of AREAS) {
      const areaSlides = slidesFor(`area-${area.slug}`);
      const closingPhoto = buildClosingBandPhoto(area.slug);
      expect(areaSlides.map((slide) => slide.f.file)).toContain(closingPhoto.file);
      if (areaSlides.length > 1) expect(closingPhoto.file).not.toBe(areaSlides[0].f.file);
    }
  });

  it("uses the photo of the guide's area on a guide page", () => {
    const guide = GUIDES[0];
    expect(buildClosingBandPhoto(guide.slug).file).toBe(buildClosingBandPhoto(guide.area).file);
  });

  it("uses the general photo on pages that are not an area or a guide", () => {
    expect(buildClosingBandPhoto("privacidade").file).toBe(generalPhotoFile);
  });

  it("uses the general photo for an empty or missing slug", () => {
    expect(buildClosingBandPhoto("").file).toBe(generalPhotoFile);
    expect(buildClosingBandPhoto(undefined).file).toBe(generalPhotoFile);
  });
});
