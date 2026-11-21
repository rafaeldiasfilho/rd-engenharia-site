// WhatsApp call-to-action button (the only contact channel). Every button ends with an arrow that moves a
// little on hover. variant="glass": translucent pill for use over photos (heroes, closing band), without the
// WhatsApp icon; screenReaderSuffix completes a short visible label (e.g. " pelo WhatsApp").

import Icon from "../Icon";
import { whatsappLink } from "../contact";

export function WhatsappButton({ text, label, className = "", variant = "solid", screenReaderSuffix = "" }) {
  const isGlass = variant === "glass";
  const buttonClasses = isGlass ? `btn-glass btn-arrow ${className}` : `btn btn-whatsapp btn-arrow ${className}`;
  return (
    <a className={buttonClasses} href={whatsappLink(text)} target="_blank" rel="noopener noreferrer">
      {!isGlass && <Icon name="fa-brands fa-whatsapp" />}
      <span>
        {label}
        {screenReaderSuffix && <span className="sr-only">{screenReaderSuffix}</span>}
      </span>
      <span className="btn-arrow-icon" aria-hidden="true">
        →
      </span>
    </a>
  );
}
