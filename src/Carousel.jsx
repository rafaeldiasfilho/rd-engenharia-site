import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { slidesDe, caminho, srcset, aviso } from "./photos";
import PhotoViewer from "./PhotoViewer";

// Image strip in the style of Apple "Photos", no library. It is the only carousel on the site.
// - The strip is CSS scroll-snap: it works without JavaScript, with touch swipe and mouse wheel, and the
//   next image "peeks" in at the edge.
// - Dragging with the mouse (pointer type "mouse") moves the strip and, on release, snaps to the nearest image.
//   A drag never triggers a link click. Keyboard: arrows, Home and End while the strip has focus.
// - No side buttons and no play/pause: the indicator is the "n / N" counter plus the (clickable) dots.
// - Autoplay every ~5 s, only after mount (does not affect layout): pauses on mouse hover,
//   focus inside, touch/click/drag, background tab or carousel off screen, and resumes ~8 s after
//   the last interaction. With "reduce motion" it never advances on its own.
// - No window/document during render: safe for prerendering.
// Slide sources: `chave` (photos in CARROSSEIS, src/fotos.js) or `itens` (own list, see below).
// Item: { key, src, w, h, alt, legenda, nota, href (caption link), imgHref (image link), contem, creditos }
//   or { key, node (any element, e.g. an SVG sheet), legenda, nota }.
// Clicking the neighbouring image that peeks in at the edge goes to it (invisible button "Ir para a imagem n").
// Keyboard focus inside the carousel (a mouse click also focuses the strip, but must not pause forever).
function hasKeyboardFocus(el) {
  try {
    return el.matches(":has(:focus-visible)");
  } catch {
    return el.matches(":focus-within");
  }
}

const INTERVAL = 5000;
const MAX_LOOPS = 3; // after 3 full loops autoplay stops
const RESUME_DELAY = 8000;

export default function Carrossel({ chave, itens, rotulo, aspecto = "16 / 10", className = "", prioridade = false, auto = true, sizes = "(min-width: 900px) 50vw, 90vw" }) {
  const slides = itens
    ? itens
    : slidesDe(chave || "").map((s) => ({
        key: s.foto,
        src: caminho(s.f),
        srcSet: srcset(s.f),
        w: s.f.w,
        h: s.f.h,
        alt: s.f.alt,
        legenda: s.legenda,
        href: s.href,
        imgHref: caminho(s.f), // every carousel photo zooms in on the page itself
        nota: aviso(s.f),
        creditos: true,
        pos: s.pos,
      }));
  const total = slides.length;
  // carousel-full: full-width slide. carousel-shelf: several cards in view, all already clickable.
  // In both cases there is no "peeking" neighbour to turn into a button.
  const fullWidth = className.includes("carousel-full") || className.includes("carousel-shelf");
  const sectionRef = useRef(null);
  const bandRef = useRef(null);
  const [i, setI] = useState(0);
  const [dragging, setDragging] = useState(false);
  // Photo zoomed in on the page itself (it used to open in another tab): { i, el } or null
  const [zoomed, setZoomed] = useState(null);
  const reducedMotion = useRef(false);
  const lockUntil = useRef(0); // while a programmatic scroll runs, scrolling does not rewrite the counter
  const lastAction = useRef(0); // visitor's last interaction (pauses autoplay)
  const drag = useRef({ active: false, moved: false, x0: 0, sl0: 0, id: null, blockClick: false });
  const pointers = useRef(new Set()); // pointers (mouse, touch, pen) with the button/finger pressed
  const stopped = useRef(false); // the visitor interacted or 3 loops are done: no more autoplay this visit
  const loops = useRef(0);
  const timers = useRef([]); // drag timeouts, cleared on unmount
  const schedule = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };
  useEffect(() => {
    const list = timers;
    return () => list.current.forEach(clearTimeout);
  }, []);

  const step = () => {
    const f = bandRef.current;
    if (!f || f.children.length < 2) return f ? f.clientWidth : 0;
    return f.children[1].offsetLeft - f.children[0].offsetLeft;
  };

  const goTo = useCallback(
    (n) => {
      const f = bandRef.current;
      if (!f) return;
      const target = Math.max(0, Math.min(total - 1, n));
      f.scrollTo({ left: target * step(), behavior: reducedMotion.current ? "auto" : "smooth" });
      lockUntil.current = Date.now() + 700;
      setI(target);
    },
    [total]
  );

  // The counter follows scrolling (touch, drag, keyboard or dots).
  useEffect(() => {
    const f = bandRef.current;
    if (!f) return undefined;
    let deferred = 0;
    const onScroll = () => {
      clearTimeout(deferred);
      const remaining = lockUntil.current - Date.now();
      if (remaining > 0) {
        deferred = setTimeout(onScroll, remaining + 30); // check again when the lock ends
        return;
      }
      const p = step();
      // With several cards in view, the strip ends before the last one reaches the left: at the end, count the last one.
      if (f.scrollLeft + f.clientWidth >= f.scrollWidth - 2) setI(total - 1);
      else if (p > 0) setI(Math.max(0, Math.min(total - 1, Math.round(f.scrollLeft / p))));
    };
    f.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      f.removeEventListener("scroll", onScroll);
      clearTimeout(deferred);
    };
  }, [total]);

  // 3D carousel (className "carousel-3d"): each image rotates and shrinks with its distance from the strip centre,
  // like a coverflow. The strip is still scroll-snap (touch, drag and keyboard unchanged); the rotation only
  // follows scrolling, one frame at a time. With "reduce motion" it stays flat.
  const is3d = className.includes("carousel-3d");
  useEffect(() => {
    const f = bandRef.current;
    if (!is3d || !f) return undefined;
    let frame = 0;
    const paint = () => {
      frame = 0;
      const box = f.getBoundingClientRect();
      const center = box.left + box.width / 2;
      const p = step() || box.width;
      Array.from(f.children).forEach((sl) => {
        const img = sl.querySelector(".carousel-img");
        if (!img) return;
        if (reducedMotion.current) {
          img.style.transform = "";
          img.style.opacity = "";
          return;
        }
        const r = sl.getBoundingClientRect();
        const d = Math.max(-2, Math.min(2, (r.left + r.width / 2 - center) / p));
        const ad = Math.min(Math.abs(d), 1.5);
        img.style.transform = `rotateY(${(-d * 34).toFixed(2)}deg) scale(${(1 - ad * 0.16).toFixed(3)})`;
        img.style.opacity = (1 - ad * 0.38).toFixed(3);
        sl.style.zIndex = String(10 - Math.round(ad * 4));
      });
    };
    const schedule3d = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();
    f.addEventListener("scroll", schedule3d, { passive: true });
    window.addEventListener("resize", schedule3d);
    return () => {
      cancelAnimationFrame(frame);
      f.removeEventListener("scroll", schedule3d);
      window.removeEventListener("resize", schedule3d);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is3d, total]);

  // Reduced motion + autoplay (all after mount, so nothing changes in the server render).
  useEffect(() => {
    const mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    reducedMotion.current = !!(mq && mq.matches);
    const onMqChange = () => {
      reducedMotion.current = !!(mq && mq.matches);
    };
    if (mq && mq.addEventListener) mq.addEventListener("change", onMqChange);

    const el = sectionRef.current;
    let visible = true;
    const io = "IntersectionObserver" in window && el ? new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0.4 }) : null;
    if (io && el) io.observe(el);
    const mark = () => {
      lastAction.current = Date.now();
    };
    const events = ["pointerdown", "pointerup", "pointerleave", "touchstart", "wheel", "keydown", "focusin", "focusout"];
    if (el) events.forEach((ev) => el.addEventListener(ev, mark, { passive: true }));
    // While any pointer is pressed (mouse, finger, pen), autoplay does not advance.
    const onDown = (e) => {
      pointers.current.add(e.pointerId);
      if (e.pointerType !== "mouse") stopped.current = true; // touch gesture: the visitor took control
    };
    const onUp = (e) => {
      pointers.current.delete(e.pointerId);
    };
    if (el) el.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });

    const tick = () => {
      if (!auto || total < 2 || stopped.current || reducedMotion.current || !visible || document.hidden) return;
      if (pointers.current.size > 0 || drag.current.active || drag.current.moved) return;
      if (el && (el.matches(":hover") || hasKeyboardFocus(el))) return;
      if (Date.now() - lastAction.current < RESUME_DELAY) return;
      const f = bandRef.current;
      const p = step();
      if (!f || p <= 0) return;
      const currentIndex = Math.round(f.scrollLeft / p);
      if (currentIndex >= total - 1) {
        loops.current += 1;
        if (loops.current >= MAX_LOOPS) {
          stopped.current = true;
          return;
        }
        goTo(0);
      } else {
        goTo(currentIndex + 1);
      }
    };
    const t = auto && total > 1 ? setInterval(tick, INTERVAL) : 0;

    return () => {
      clearInterval(t);
      if (io) io.disconnect();
      if (el) {
        events.forEach((ev) => el.removeEventListener(ev, mark));
        el.removeEventListener("pointerdown", onDown);
      }
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (mq && mq.removeEventListener) mq.removeEventListener("change", onMqChange);
    };
  }, [auto, total, goTo]);

  if (total === 0) return null;

  const onKeys = (e) => {
    if (total < 2) return;
    const keyMap = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: total - 1 };
    if (e.key in keyMap) {
      e.preventDefault();
      stopped.current = true;
      goTo(keyMap[e.key]);
    }
  };

  // Mouse drag. Touch and pen use the strip's native scrolling.
  const handlePointerDown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || total < 2) return;
    drag.current = { active: true, moved: false, x0: e.clientX, sl0: bandRef.current.scrollLeft, id: e.pointerId, blockClick: false };
  };
  const handlePointerMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.x0;
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true;
      stopped.current = true;
      try {
        bandRef.current.setPointerCapture(d.id);
      } catch {
        /* pointer already released */
      }
      setDragging(true);
    }
    if (d.moved) bandRef.current.scrollLeft = d.sl0 - dx;
  };
  const handlePointerUp = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (!d.moved) return;
    const p = step();
    const target = p > 0 ? Math.round(bandRef.current.scrollLeft / p) : 0;
    d.blockClick = true; // the click right after a drag must not open a link
    schedule(() => {
      d.blockClick = false;
    }, 50);
    goTo(target);
    schedule(() => {
      d.moved = false;
      setDragging(false);
    }, 500);
  };
  const handleClickCapture = (e) => {
    if (drag.current.blockClick) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`carousel ${total < 2 ? "carousel-one" : ""} ${className}`}
      role="region"
      aria-roledescription="carrossel"
      aria-label={rotulo}
      style={{ "--carousel-aspect": aspecto }}
      onKeyDown={onKeys}
    >
      <div
        className={`carousel-band ${dragging ? "dragging" : ""}`}
        ref={bandRef}
        tabIndex={0}
        aria-label={`${rotulo}: use as setas do teclado, deslize ou arraste`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClickCapture={handleClickCapture}
      >
        {slides.map((s, n) => {
          const img = s.node ? null : (
            <img
              src={s.src}
              srcSet={s.srcSet}
              sizes={s.srcSet ? sizes : undefined}
              width={s.w}
              height={s.h}
              alt={s.alt}
              loading={prioridade && n === 0 ? "eager" : "lazy"}
              fetchpriority={prioridade && n === 0 ? "high" : undefined}
              decoding="async"
              draggable={false}
              style={s.pos ? { objectPosition: s.pos } : undefined}
            />
          );
          return (
            <div
              key={s.key}
              className={`carousel-slide ${n === i ? "active" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${n + 1} de ${total}`}
            >
              {!fullWidth && n !== i && total > 1 && (
                <button
                  type="button"
                  className="carousel-neighbor"
                  aria-label={`Ir para a imagem ${n + 1} de ${total}`}
                  onClick={() => {
                    stopped.current = true;
                    goTo(n);
                  }}
                />
              )}
              <figure>
                <div className={`carousel-img ${s.contem ? "contain" : ""} ${s.node ? "node" : ""}`}>
                  {s.node ? (
                    s.node
                  ) : s.imgHref ? (
                    <a
                      href={s.imgHref}
                      draggable={false}
                      aria-label={`Ampliar: ${s.legenda || s.alt}`}
                      aria-haspopup="dialog"
                      onClick={(e) => {
                        // Without JavaScript the link opens the image; with JavaScript it zooms in right here.
                        e.preventDefault();
                        stopped.current = true;
                        const list = slides.filter((x) => x.imgHref && !x.node);
                        setZoomed({ i: list.indexOf(s), el: e.currentTarget.querySelector("img") });
                      }}
                    >
                      {img}
                    </a>
                  ) : (
                    img
                  )}
                </div>
                <figcaption>
                  <strong className="carousel-caption">
                    {s.href ? (
                      <a href={s.href}>
                        {s.legenda} <span aria-hidden="true">→</span>
                      </a>
                    ) : (
                      s.legenda
                    )}
                  </strong>
                  {s.nota && (
                    <small>
                      {s.nota} {s.creditos && <a href="/creditos">Créditos</a>}
                    </small>
                  )}
                </figcaption>
              </figure>
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <div className="carousel-controls">
          <p className="carousel-counter" aria-live="off" aria-atomic="true">
            <span className="sr-only">Imagem </span>
            {i + 1} / {total}
          </p>
          <div className="carousel-dots">
            {slides.map((s, n) => (
              <button
                key={s.key}
                type="button"
                className={n === i ? "active" : ""}
                aria-label={`Ir para a imagem ${n + 1} de ${total}`}
                aria-current={n === i ? "true" : undefined}
                onClick={() => {
                  stopped.current = true;
                  goTo(n);
                }}
              >
                <i aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}
      {zoomed &&
        createPortal(
          <PhotoViewer
            itens={slides.filter((x) => x.imgHref && !x.node).map((x) => ({ src: x.imgHref, alt: x.alt, legenda: x.legenda }))}
            indice={zoomed.i}
            origem={zoomed.el}
            aoFechar={() => setZoomed(null)}
          />,
          document.body,
        )}
    </section>
  );
}
