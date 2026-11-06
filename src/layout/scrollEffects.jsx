// Scroll effects shared by all pages: reveal on scroll, reading progress bar and anchor scrolling.

import { useEffect, useRef } from "react";

// Smooth entrance of sections: only opacity and a short offset, and only when motion is allowed.
export function useReveal() {
  useEffect(() => {
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(document.querySelectorAll(".reveal"));
    if (reduceMotion || !("IntersectionObserver" in window)) return undefined;
    const vh = window.innerHeight;
    document.documentElement.classList.add("reveal-on");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92) el.classList.add("vis");
      else io.observe(el);
    });
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("reveal-on");
    };
  }, []);
}

// Thin bar at the top showing how much of the page has been read (green to lime). Transform only, one
// frame per scroll; decorative (aria-hidden). With "reduce motion" the CSS hides it.
export function ReadingProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let frame = 0;
    const paint = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty("--p", max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : "0");
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return <div ref={ref} className="progress-reading" aria-hidden="true" />;
}

// Links with an anchor (e.g. a service opened from search): ensures scrolling to the item after the
// page mounts, because the browser may try to scroll before the content is ready.
export function useAnchor() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
  }, []);
}
