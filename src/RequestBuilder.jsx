import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { WhatsappButton } from "./Layout";

// During prerender (Node) there is no layout: use useEffect there to avoid a warning.
const useSafeLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const shortName = (name) => name.split(/ — | \(/)[0];

// Select several services of the area and send them all in a single message. The item that enters the message box
// starts from the tapped chip's position and slides to its place (animation on that element only, without blocking the page).
// With "reduce motion", it appears directly.
export default function RequestBuilder({ area, items }) {
  const [selected, setSelected] = useState([]);
  const buttons = useRef({});
  const boxItems = useRef({});
  const flight = useRef(null);

  const toggle = (name, restoreFocus) => {
    const adding = !selected.includes(name);
    if (adding && buttons.current[name]) flight.current = { name, origin: buttons.current[name].getBoundingClientRect() };
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
    if (restoreFocus && buttons.current[name]) buttons.current[name].focus();
  };

  useSafeLayoutEffect(() => {
    const v = flight.current;
    flight.current = null;
    const el = v && boxItems.current[v.name];
    if (!el || !el.animate) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = el.getBoundingClientRect();
    const dx = v.origin.left - target.left;
    const dy = v.origin.top - target.top;
    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(0.92)`, opacity: 0.4 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 460, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
    );
  }, [selected]);

  const message = selected.length
    ? `Olá! Gostaria de um orçamento na área de ${area} para: ${selected.join("; ")}.`
    : `Olá! Gostaria de um orçamento na área de ${area}.`;

  return (
    <div className="request reveal">
      <div className="request-head">
        <h3>Precisa de mais de um serviço?</h3>
        <p>Toque nos serviços que você precisa e envie tudo numa mensagem só.</p>
      </div>
      <div className="request-options" role="group" aria-label="Serviços desta área">
        {items.map((item) => (
          <button
            type="button"
            key={item.name}
            ref={(el) => (buttons.current[item.name] = el)}
            className="request-chip"
            aria-pressed={selected.includes(item.name)}
            onClick={() => toggle(item.name)}
          >
            <span className="request-brand" aria-hidden="true" />
            {shortName(item.name)}
          </button>
        ))}
      </div>
      <div className="request-box">
        <p className="label-mini" aria-live="polite">
          {selected.length === 0 ? "Sua mensagem" : selected.length === 1 ? "Sua mensagem · 1 serviço" : `Sua mensagem · ${selected.length} serviços`}
        </p>
        {selected.length === 0 ? (
          <p className="request-empty">Nenhum serviço marcado. Você também pode enviar sem marcar e contar o caso na conversa.</p>
        ) : (
          <ul className="request-list">
            {selected.map((name) => (
              <li key={name} ref={(el) => (boxItems.current[name] = el)}>
                <span>{shortName(name)}</span>
                <button type="button" aria-label={`Tirar: ${shortName(name)}`} onClick={() => toggle(name, true)}>
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
        <WhatsappButton text={message} label={selected.length ? "Enviar pelo WhatsApp" : "Falar no WhatsApp"} />
      </div>
    </div>
  );
}
