import { useCallback, useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight, MagnifyingGlassMinus, MagnifyingGlassPlus, X } from "@phosphor-icons/react";

// In-page photo viewer (the photo used to open in another tab). Idea from the "Zoomable Image" and
// "Lightbox Grid" components seen on 21st.dev through the MCP, rebuilt here without the paid code:
// - the photo grows from the clicked thumbnail and shrinks back into it on close;
// - arrows, keyboard (← → Esc + -) and a sideways swipe change the photo;
// - double click / double tap or pinch zooms; while zoomed, dragging pans the photo;
// - dragging down (not zoomed) closes; so do Esc and the X.
// Native <dialog>: traps focus and returns it to the link that opened it. With "reduce motion" it just appears and disappears.
// Usage: <Ampliar itens={[{ src, alt, legenda }]} indice={i} origem={thumbnailElement} aoFechar={fn} />
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const ZOOM_MAX = 4;

export default function Ampliar({ itens, indice, origem, aoFechar }) {
  const dlg = useRef(null);
  const stage = useRef(null);
  const photo = useRef(null);
  const [i, setI] = useState(indice ?? 0);
  const [zoom, setZoom] = useState(1);
  const gesture = useRef({ zoom: 1, x: 0, y: 0, fingers: new Map(), start: null, pinch: null, lastTap: 0, drag: null });
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const total = itens.length;
  const current = itens[i];

  const apply = (extra = "") => {
    const s = gesture.current;
    if (photo.current) photo.current.style.transform = `translate(${s.x}px, ${s.y}px) scale(${s.zoom})${extra}`;
  };

  const reset = () => {
    const s = gesture.current;
    s.zoom = 1;
    s.x = 0;
    s.y = 0;
    setZoom(1);
    apply();
  };

  const goTo = useCallback(
    (d) => {
      if (total < 2) return;
      reset();
      setI((v) => (v + d + total) % total);
    },
    [total],
  );

  // Thumbnail rectangle relative to the open photo: used to grow in / shrink back
  const fromThumbnail = () => {
    const a = origem?.getBoundingClientRect?.();
    const b = photo.current?.getBoundingClientRect();
    if (!a || !b || !b.width || !a.width) return null;
    const ratio = Math.max(a.width / b.width, a.height / b.height);
    return `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px, ${a.top + a.height / 2 - (b.top + b.height / 2)}px) scale(${ratio})`;
  };

  const closeViewer = useCallback(() => {
    const d = dlg.current;
    if (!d || d.dataset.closing) return;
    d.dataset.closing = "1";
    const finish = () => {
      d.close();
      aoFechar();
    };
    if (reducedMotion || !photo.current) return finish();
    const s = gesture.current;
    const from = `translate(${s.x}px, ${s.y}px) scale(${s.zoom})`;
    const to = i === indice ? fromThumbnail() : null;
    d.animate([{ backgroundColor: getComputedStyle(d).backgroundColor }, { backgroundColor: "rgba(0,0,0,0)" }], { duration: 400, easing: EASING, fill: "forwards" });
    const anim = photo.current.animate(
      to ? [{ transform: from }, { transform: to }] : [{ transform: from, opacity: 1 }, { transform: `${from} translateY(40px)`, opacity: 0 }],
      { duration: 400, easing: EASING, fill: "forwards" },
    );
    anim.onfinish = finish;
  }, [aoFechar, i, indice, reducedMotion]);

  // Opens and grows the photo from the thumbnail
  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    d.showModal();
    document.documentElement.classList.add("viewer-open");
    const img = photo.current;
    const animateIn = () => {
      if (reducedMotion) return;
      const from = fromThumbnail();
      img.animate(from ? [{ transform: from }, { transform: "none" }] : [{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }], {
        duration: 500,
        easing: EASING,
      });
    };
    if (img.complete) animateIn();
    else img.addEventListener("load", animateIn, { once: true });
    return () => document.documentElement.classList.remove("viewer-open");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goTo(1);
      else if (e.key === "ArrowLeft") goTo(-1);
      else if (e.key === "+" || e.key === "=") zoomTo(2);
      else if (e.key === "-") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Preloads the neighbouring photos
  useEffect(() => {
    [1, -1].forEach((d) => {
      const v = itens[(i + d + total) % total];
      if (v) new Image().src = v.src;
    });
  }, [i, itens, total]);

  const clamp = () => {
    const s = gesture.current;
    const r = stage.current.getBoundingClientRect();
    const mx = (r.width * (s.zoom - 1)) / 2;
    const my = (r.height * (s.zoom - 1)) / 2;
    s.x = Math.max(-mx, Math.min(mx, s.x));
    s.y = Math.max(-my, Math.min(my, s.y));
  };

  const zoomTo = (z, cx, cy) => {
    const s = gesture.current;
    const r = stage.current.getBoundingClientRect();
    const px = (cx ?? r.left + r.width / 2) - (r.left + r.width / 2);
    const py = (cy ?? r.top + r.height / 2) - (r.top + r.height / 2);
    const next = Math.max(1, Math.min(ZOOM_MAX, z));
    s.x = (s.x - px) * (next / s.zoom) + px;
    s.y = (s.y - py) * (next / s.zoom) + py;
    s.zoom = next;
    if (next === 1) {
      s.x = 0;
      s.y = 0;
    }
    clamp();
    setZoom(next);
    photo.current.style.transition = reducedMotion ? "none" : `transform 300ms ${EASING}`;
    apply();
  };

  // Gestures (pointer: mouse, finger, pen)
  const onDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const s = gesture.current;
    stage.current.setPointerCapture(e.pointerId);
    s.fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    photo.current.style.transition = "none";
    if (s.fingers.size === 2) {
      const [a, b] = [...s.fingers.values()];
      s.pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom: s.zoom };
      s.drag = null;
    } else {
      s.drag = { x0: e.clientX, y0: e.clientY, x: s.x, y: s.y, axis: null };
    }
  };

  const onMove = (e) => {
    const s = gesture.current;
    if (!s.fingers.has(e.pointerId)) return;
    s.fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (s.pinch && s.fingers.size === 2) {
      const [a, b] = [...s.fingers.values()];
      const z = (s.pinch.zoom * Math.hypot(a.x - b.x, a.y - b.y)) / s.pinch.dist;
      s.zoom = Math.max(1, Math.min(ZOOM_MAX, z));
      clamp();
      apply();
      return;
    }
    const g = s.drag;
    if (!g) return;
    const dx = e.clientX - g.x0;
    const dy = e.clientY - g.y0;
    if (s.zoom > 1) {
      s.x = g.x + dx;
      s.y = g.y + dy;
      clamp();
      apply();
      return;
    }
    if (!g.axis && Math.hypot(dx, dy) > 8) g.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    if (g.axis === "x") {
      s.x = dx;
      apply();
    } else if (g.axis === "y" && dy > 0) {
      s.y = dy;
      apply(` scale(${Math.max(0.8, 1 - dy / 1200)})`);
      dlg.current.style.backgroundColor = `rgba(0,0,0,${Math.max(0.2, 0.92 - dy / 600)})`;
    }
  };

  const onUp = (e) => {
    const s = gesture.current;
    s.fingers.delete(e.pointerId);
    if (s.pinch) {
      if (s.fingers.size < 2) {
        s.pinch = null;
        setZoom(s.zoom);
        if (s.zoom < 1.05) reset();
      }
      return;
    }
    const g = s.drag;
    s.drag = null;
    if (!g) return;
    const dx = e.clientX - g.x0;
    const dy = e.clientY - g.y0;
    // short tap: a double tap toggles zoom
    if (Math.hypot(dx, dy) < 8) {
      const now = Date.now();
      if (now - s.lastTap < 320) {
        s.lastTap = 0;
        zoomTo(s.zoom > 1 ? 1 : 2.5, e.clientX, e.clientY);
      } else s.lastTap = now;
      return;
    }
    if (s.zoom > 1) return;
    photo.current.style.transition = reducedMotion ? "none" : `transform 300ms ${EASING}`;
    if (g.axis === "x" && Math.abs(dx) > 60) {
      goTo(dx < 0 ? 1 : -1);
    } else if (g.axis === "y" && dy > 110) {
      closeViewer();
    } else {
      dlg.current.style.backgroundColor = "";
      reset();
    }
  };

  return (
    <dialog
      ref={dlg}
      className="viewer"
      aria-label={current?.legenda || current?.alt || "Foto ampliada"}
      onCancel={(e) => {
        e.preventDefault();
        closeViewer();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeViewer();
      }}
    >
      <div
        ref={stage}
        className="viewer-stage"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClick={(e) => {
          if (e.target === e.currentTarget && gesture.current.zoom === 1) closeViewer();
        }}
      >
        <img ref={photo} key={current?.src} src={current?.src} alt={current?.alt || ""} draggable={false} className={zoom > 1 ? "with-zoom" : ""} />
      </div>

      <div className="viewer-bar">
        <p className="viewer-caption">
          {total > 1 && (
            <span className="viewer-counter">
              {i + 1} / {total}
            </span>
          )}
          {current?.legenda}
        </p>
        <div className="viewer-buttons">
          <button type="button" onClick={() => (zoom > 1 ? reset() : zoomTo(2))} aria-label={zoom > 1 ? "Tirar o zoom" : "Dar zoom"}>
            {zoom > 1 ? <MagnifyingGlassMinus size={22} aria-hidden="true" /> : <MagnifyingGlassPlus size={22} aria-hidden="true" />}
          </button>
          <button type="button" onClick={closeViewer} aria-label="Fechar" autoFocus>
            <X size={22} aria-hidden="true" />
          </button>
        </div>
      </div>

      {total > 1 && (
        <>
          <button type="button" className="viewer-arrow viewer-prev" onClick={() => goTo(-1)} aria-label="Foto anterior">
            <CaretLeft size={26} aria-hidden="true" />
          </button>
          <button type="button" className="viewer-arrow viewer-next" onClick={() => goTo(1)} aria-label="Próxima foto">
            <CaretRight size={26} aria-hidden="true" />
          </button>
        </>
      )}
      <p className="viewer-hint" aria-hidden="true">
        Duplo toque para zoom · arraste para baixo para fechar
      </p>
    </dialog>
  );
}
