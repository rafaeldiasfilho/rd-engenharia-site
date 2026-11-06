import { useEffect, useRef } from "react";

// Highlight phrase that "lights up" word by word as the page scrolls (section requested by the
// landing-page-design skill): words start dimmed (~30%) and light up in reading order as they cross
// a line at 65% of the screen height. Without JavaScript or with "reduce motion": the whole phrase is lit.
// Scrolling is only listened to while the phrase is on screen, and the calculation runs in a requestAnimationFrame.
export default function RevealPhrase({ text, className = "" }) {
  const ref = useRef(null);
  const words = text.split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    el.classList.add("phrase-active");
    const spans = [...el.querySelectorAll("span")];
    let frame = 0;
    const compute = () => {
      frame = 0;
      const line = window.innerHeight * 0.65;
      spans.forEach((s) => s.classList.toggle("aceso", s.getBoundingClientRect().top < line));
    };
    const requestFrame = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        window.addEventListener("scroll", requestFrame, { passive: true });
        requestFrame();
      } else window.removeEventListener("scroll", requestFrame);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestFrame);
    };
  }, []);

  return (
    <section className={`phrase-reveal-sec ${className}`} aria-label="Nosso compromisso">
      <div className="container">
        <p ref={ref} className="phrase-reveal">
          {words.map((p, n) => (
            <span key={n}>{p} </span>
          ))}
        </p>
      </div>
    </section>
  );
}
