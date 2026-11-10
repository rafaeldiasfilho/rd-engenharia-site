// Floating WhatsApp button, with a message adapted to the current page.

import Icon from "../Icon";
import { useEffect, useState } from "react";
import { AREAS } from "../content/areas";
import { GUIDES } from "../content/guides";
import { whatsappLink } from "../contact";
import { useCurrentWhatsappMessage } from "../currentWhatsappMessage.js";
import { pageWhatsappMessage } from "../whatsappMessages";

// Area of the current page: the area itself or the guide's area. Changes the floating WhatsApp button.
function areaForPage(currentSlug) {
  const guide = GUIDES.find((g) => g.slug === currentSlug);
  return AREAS.find((a) => a.slug === (guide ? guide.area : currentSlug)) || null;
}

// Floating WhatsApp button. On area and guide pages it becomes a pill with the subject
// ("Falar sobre AVCB e CLCB") and the message already includes the area. The pill appears only after the
// header (which already has the quote button) leaves the screen; without JavaScript it is always visible.
// When the visitor built a message on the page (marked services, wizard result), the button sends that one.
export function FloatingWhatsapp({ current }) {
  const area = areaForPage(current);
  const currentMessage = useCurrentWhatsappMessage();
  const text = currentMessage?.text || pageWhatsappMessage(current);
  const [scrolledAway, setScrolledAway] = useState(true);
  // On the home and area pages the hero already has the quote button: the floating one waits until the
  // hero leaves the screen, so it never covers that button on small phones.
  const waitsForScroll = Boolean(area) || current === "";

  useEffect(() => {
    if (!waitsForScroll) return undefined;
    const check = () => setScrolledAway(window.scrollY > window.innerHeight * 0.7);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [waitsForScroll]);

  if (!area) {
    return (
      <a
        className={`whatsapp-float ${scrolledAway ? "" : "hidden"}`}
        href={whatsappLink(text)}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={scrolledAway ? undefined : -1}
        aria-hidden={scrolledAway ? undefined : "true"}
        aria-label={currentMessage?.label ? `${currentMessage.label} pelo WhatsApp` : "Falar pelo WhatsApp"}
      >
        <Icon name="fa-brands fa-whatsapp" />
      </a>
    );
  }
  return (
    <a
      className={`whatsapp-float whatsapp-pill ${scrolledAway ? "" : "hidden"}`}
      href={whatsappLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={scrolledAway ? undefined : -1}
      aria-hidden={scrolledAway ? undefined : "true"}
      aria-label={currentMessage?.label ? `${currentMessage.label} pelo WhatsApp` : `Falar sobre ${area.subject} pelo WhatsApp`}
    >
      <Icon name="fa-brands fa-whatsapp" />
      <span>{currentMessage?.label || `Falar sobre ${area.subject}`}</span>
    </a>
  );
}
