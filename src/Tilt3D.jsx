import { useEffect, useRef } from "react";

// Frame that "lies back" in 3D and straightens up as the page scrolls (idea from the library's "Container scroll
// animation" prompt, rebuilt without framer-motion): progress goes from 0 (bottom edge of the screen)
// to 1 (middle of the screen) and becomes the CSS variable --p; the CSS applies rotateX and scale from it.
// With "reduce motion" nothing is turned on and the frame stays flat.
export default function Inclinado3D({ children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let frame = 0;
    const compute = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.55)));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const requestFrame = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };
    let listening = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !listening) {
        listening = true;
        window.addEventListener("scroll", requestFrame, { passive: true });
        window.addEventListener("resize", requestFrame);
        requestFrame();
      } else if (!e.isIntersecting && listening) {
        listening = false;
        window.removeEventListener("scroll", requestFrame);
        window.removeEventListener("resize", requestFrame);
      }
    });
    io.observe(el);
    el.classList.add("tilt-active");
    compute();
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestFrame);
      window.removeEventListener("resize", requestFrame);
    };
  }, []);

  return (
    <div ref={ref} className={`tilt3d ${className}`}>
      <div className="tilt3d-frame">{children}</div>
    </div>
  );
}
