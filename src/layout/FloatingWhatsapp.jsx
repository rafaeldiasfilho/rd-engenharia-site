// Floating WhatsApp button, with a message adapted to the current page.

import Icon from "../Icon";
import { useEffect, useState } from "react";
import { AREAS } from "../content/areas";
import { GUIDES } from "../content/guides";
import { whatsappLink } from "../contact";

// Area of the current page: the area itself or the guide's area. Changes the floating WhatsApp button.
function areaForPage(currentSlug) {
  const guide = GUIDES.find((g) => g.slug === currentSlug);
  return AREAS.find((a) => a.slug === (guide ? guide.area : currentSlug)) || null;
}

// Floating WhatsApp button. On area and guide pages it becomes a pill with the subject
// ("Falar sobre AVCB e CLCB") and the message already includes the area. The pill appears only after the
// header (which already has the quote button) leaves the screen; without JavaScript it is always visible.
export function FloatingWhatsapp({ current }) {
  const area = areaForPage(current);
  const [scrolledAway, setScrolledAway] = useState(true);

  useEffect(() => {
    if (!area) return undefined;
    const check = () => setScrolledAway(window.scrollY > window.innerHeight * 0.7);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [area]);

  if (!area) {
    return (
      <a
        className="whatsapp-float"
        href={whatsappLink("Olá! Gostaria de um orçamento.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar pelo WhatsApp"
      >
        <Icon name="fa-brands fa-whatsapp" />
      </a>
    );
  }
  return (
    <a
      className={`whatsapp-float whatsapp-pill ${scrolledAway ? "" : "hidden"}`}
      href={whatsappLink(`Olá! Gostaria de um orçamento na área de ${area.name}.`)}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={scrolledAway ? undefined : -1}
      aria-hidden={scrolledAway ? undefined : "true"}
      aria-label={`Falar sobre ${area.subject} pelo WhatsApp`}
    >
      <Icon name="fa-brands fa-whatsapp" />
      <span>Falar sobre {area.subject}</span>
    </a>
  );
}
