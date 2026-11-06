// WhatsApp call-to-action button (the only contact channel).

import Icon from "../Icon";
import { whatsappLink } from "../contact";

export function WhatsappButton({ text, label, className = "" }) {
  return (
    <a className={`btn btn-whatsapp ${className}`} href={whatsappLink(text)} target="_blank" rel="noopener noreferrer">
      <Icon name="fa-brands fa-whatsapp" /> {label}
    </a>
  );
}
