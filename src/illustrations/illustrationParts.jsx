// Shared pieces of the interactive area illustrations: label styles, example stamp and the clickable legend wrapper.

import { useState } from "react";
import { BORDER, GRAY, BACKGROUND, PAPER, INK, GREEN, ExampleStamp } from "../SheetBase";

// Illustrative drawings and template, on the same paper and stamp as the sample sheets. Nothing here comes
// from a real client. Each drawing is interactive: tapping a legend item (or the drawing) highlights the element
// and explains what it is.

export const LABEL = { fontSize: 11, fill: GRAY, fontFamily: "inherit" };

export const LABEL_BOLD = { ...LABEL, fill: INK, fontWeight: 700 };

// Title-block style footer, the same in every drawing.
function Stamp({ title, client }) {
  return (
    <g fontFamily="inherit">
      <rect x="0" y="300" width="420" height="34" fill={BACKGROUND} />
      <line x1="0" y1="300" x2="420" y2="300" stroke={BORDER} />
      <rect x="14" y="309" width="16" height="16" rx="3.4" fill={GREEN} />
      <text x="22" y="320.4" fontSize="7.4" fontWeight="700" fill="#fff" textAnchor="middle">
        RD
      </text>
      <text x="38" y="315" fontSize="9.6" fontWeight="700" fill={INK}>
        {title}
      </text>
      <text x="38" y="327" fontSize="8.6" fill={GRAY}>
        {client} · RD Engenharia
      </text>
    </g>
  );
}

export function Interactive({ items, label, title, titleId, finalCaption, drawing, help, stamp }) {
  const [active, setActive] = useState("");
  const choose = (id) => setActive((a) => (a === id ? "" : id));
  const opacityFor = (id) => ({
    opacity: !active || active === id ? 1 : 0.18,
    cursor: "pointer",
    transition: "opacity .2s",
  });
  const current = items.find((x) => x.id === active);
  return (
    <figure className="illustration">
      <svg viewBox="0 0 420 334" role="img" aria-labelledby={titleId}>
        <title id={titleId}>{title}</title>
        <rect x="0" y="0" width="420" height="334" fill={PAPER} />
        {drawing({ opacityFor, choose })}
        <Stamp {...stamp} />
        <ExampleStamp x={318} y={10} rot={-6} s={1.7} />
      </svg>
      <ul className="caption" aria-label={label}>
        {items.map((x) => (
          <li key={x.id}>
            <button type="button" aria-pressed={active === x.id} onClick={() => choose(x.id)}>
              <i style={{ background: x.color }} aria-hidden="true" /> {x.name}
            </button>
          </li>
        ))}
      </ul>
      <p className="illustration-explain" aria-live="polite">
        {current ? (
          <>
            <strong>{current.name}.</strong> {current.text}
          </>
        ) : (
          help || "Toque num item acima, ou no desenho, para ver o que ele significa."
        )}
      </p>
      <figcaption>{finalCaption}</figcaption>
    </figure>
  );
}
