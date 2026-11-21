// Photo beside the list in the header's services panel. It follows the area under the mouse or the
// keyboard focus, with a short cross-fade. Decorative: the list already names each area.
// The panel is hidden while closed, so these lazy images only download when it opens.

import { AREAS } from "../content/areas";
import { buildServicesMenuPreviewPhoto } from "./servicesMenuPhotos.js";

export function ServicesMenuPreview({ highlightedAreaSlug }) {
  return (
    <div className="menu-preview" aria-hidden="true">
      {AREAS.map((previewArea) => {
        const previewPhoto = buildServicesMenuPreviewPhoto(previewArea.slug);
        if (!previewPhoto) return null;
        return (
          <img
            key={previewArea.slug}
            src={previewPhoto.src}
            srcSet={previewPhoto.srcSet}
            sizes="240px"
            width={previewPhoto.width}
            height={previewPhoto.height}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            data-on={highlightedAreaSlug === previewArea.slug || undefined}
          />
        );
      })}
    </div>
  );
}
