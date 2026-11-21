// Photo beside the services panel list: every area needs one, anything else gets null (no broken image).
import { describe, expect, it } from "vitest";
import { buildServicesMenuPreviewPhoto } from "../../src/layout/servicesMenuPhotos.js";
import { AREAS } from "../../src/content/areas.js";

describe("buildServicesMenuPreviewPhoto", () => {
  it("returns an optimized photo with its size for every area", () => {
    for (const area of AREAS) {
      const previewPhoto = buildServicesMenuPreviewPhoto(area.slug);
      expect(previewPhoto, area.slug).not.toBeNull();
      expect(previewPhoto.src).toMatch(/^\/fotos\/otim\/[a-z0-9-]+\.webp$/);
      expect(previewPhoto.srcSet).toContain(previewPhoto.src);
      expect(previewPhoto.width).toBeGreaterThan(0);
      expect(previewPhoto.height).toBeGreaterThan(0);
    }
  });

  it("returns null for an area that does not exist", () => {
    expect(buildServicesMenuPreviewPhoto("area-que-nao-existe")).toBeNull();
  });

  it("returns null for an empty slug", () => {
    expect(buildServicesMenuPreviewPhoto("")).toBeNull();
  });

  it("returns null when the slug is not a string", () => {
    expect(buildServicesMenuPreviewPhoto(undefined)).toBeNull();
    expect(buildServicesMenuPreviewPhoto(42)).toBeNull();
  });
});
