import { useEffect, useRef, useState } from "react";
import { photoPath, srcset, photoNotice } from "./photos";
import { slidesFor } from "./content/photoCarousels";

// Opening (hero) with full-screen background photos, switched by an opacity transition.
// Same motion rules as the Carousel: auto-advance only starts after mount, pauses on mouse hover,
// keyboard focus, pressed pointer, hidden tab or hero off screen; stops for good after the first
// interaction (dot, keyboard arrow, swipe) and after 3 loops; never runs with "reduce motion".
// Swiping sideways (touch or mouse) changes the photo.
// The current photo is active; the others get aria-hidden. The caption shows the area and the
// illustrative-photo notice with a link to /creditos.
const INTERVAL = 6000;
const MAX_LOOPS = 3;

function hasKeyboardFocus(el) {
  try {
    return el.matches(":has(:focus-visible)");
  } catch {
    return el.matches(":focus-within");
  }
}

export default function HeroBackground({ setKey, label, className = "", children }) {
  const slides = slidesFor(setKey);
  const total = slides.length;
  const [i, setI] = useState(0);
  const [previous, setPrevious] = useState(-1); // photo that is leaving (stays mounted during the transition)
  const sectionRef = useRef(null);
  const currentIndex = useRef(0);
  const stopped = useRef(false);
  const loops = useRef(0);
  const reduceMotion = useRef(false);
  const pointers = useRef(new Set());
  const dragStart = useRef(null);

  const goTo = (n) => {
    setPrevious(currentIndex.current);
    currentIndex.current = n;
    setI(n);
  };
  const goManual = (n) => {
    stopped.current = true;
    goTo(((n % total) + total) % total);
  };

  useEffect(() => {
    const mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    reduceMotion.current = !!(mq && mq.matches);
    const onMotionChange = () => {
      reduceMotion.current = !!(mq && mq.matches);
    };
    if (mq && mq.addEventListener) mq.addEventListener("change", onMotionChange);
    const el = sectionRef.current;
    let visible = true;
    const io = "IntersectionObserver" in window && el ? new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 }) : null;
    if (io && el) io.observe(el);
    const onDown = (e) => pointers.current.add(e.pointerId);
    const onUp = (e) => pointers.current.delete(e.pointerId);
    if (el) el.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });

    const tick = () => {
      if (total < 2 || stopped.current || reduceMotion.current || !visible || document.hidden) return;
      if (pointers.current.size > 0) return;
      if (el && (el.matches(":hover") || hasKeyboardFocus(el))) return;
      const next = (currentIndex.current + 1) % total;
      if (next === 0) {
        loops.current += 1;
        if (loops.current >= MAX_LOOPS) {
          stopped.current = true;
          return;
        }
      }
      goTo(next);
    };
    const t = total > 1 ? setInterval(tick, INTERVAL) : 0;
    return () => {
      clearInterval(t);
      if (io) io.disconnect();
      if (el) el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (mq && mq.removeEventListener) mq.removeEventListener("change", onMotionChange);
    };
  }, [total]);

  // Swipe sideways anywhere on the hero that is not a control.
  const onPress = (e) => {
    if (total < 2 || e.target.closest("a, button, input, select, textarea, label")) return;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  const onRelease = (e) => {
    const p = dragStart.current;
    dragStart.current = null;
    if (!p) return;
    const dx = e.clientX - p.x;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(e.clientY - p.y) * 1.5) goManual(currentIndex.current + (dx < 0 ? 1 : -1));
  };
  const onKeys = (e) => {
    if (total < 2 || e.target.closest("input, select, textarea")) return;
    if (e.key === "ArrowRight") goManual(currentIndex.current + 1);
    else if (e.key === "ArrowLeft") goManual(currentIndex.current - 1);
  };

  const s = slides[i];
  return (
    <section
      ref={sectionRef}
      className={`hero-bg ${className}`}
      role="region"
      aria-roledescription="carrossel"
      aria-label={label}
      onPointerDown={onPress}
      onPointerUp={onRelease}
      onPointerCancel={() => (dragStart.current = null)}
      onKeyDown={onKeys}
    >
      <div className="hero-slides">
        {slides.map((x, n) =>
          // Only the first photo, the current one, the next one and the leaving one stay in the DOM (and download).
          n === 0 || n === i || n === (i + 1) % total || n === previous ? (
          <img
            key={x.photo}
            src={photoPath(x.f)}
            srcSet={srcset(x.f)}
            sizes="100vw"
            width={x.f.w}
            height={x.f.h}
            alt={x.f.alt}
            aria-hidden={n === i ? undefined : "true"}
            className={n === i ? "active" : ""}
            loading="eager"
            fetchpriority={n === 0 && i === 0 ? "high" : undefined}
            decoding="async"
            draggable={false}
          />
          ) : null
        )}
      </div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="container hero-content">{children}</div>
      {s && (
        <div className="container hero-footer">
          <p className="hero-caption">
            <strong>
              {s.href ? (
                <a href={s.href}>
                  {s.caption} <span aria-hidden="true">→</span>
                </a>
              ) : (
                s.caption
              )}
            </strong>
            <small>
              {photoNotice(s.f)} <a href="/creditos">Créditos</a>
            </small>
          </p>
          {total > 1 && (
            <div className="hero-dots">
              {slides.map((x, n) => (
                <button
                  key={x.photo}
                  type="button"
                  className={n === i ? "active" : ""}
                  aria-label={`Ir para a imagem ${n + 1} de ${total}`}
                  aria-current={n === i ? "true" : undefined}
                  onClick={() => goManual(n)}
                >
                  <i aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
