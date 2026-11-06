// Small example sheet with the "example" caption.

import { SAMPLE_CAPTION } from "../SheetBase";
import { SheetSvg } from "./SheetSvg.jsx";

// One sheet for a service/document. `m` comes from the item's `exemplo` field in src/paginas.js.
export function SampleSheet({ m, name, area }) {
  if (!m) return null;
  return (
    <figure className="sheet-sample">
      <SheetSvg m={m} name={name} area={area} />
      <figcaption>{SAMPLE_CAPTION}</figcaption>
    </figure>
  );
}
