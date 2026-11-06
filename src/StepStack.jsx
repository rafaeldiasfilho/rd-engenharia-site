import { useEffect, useRef } from "react";

// Steps in cards that stick to the top and stack while scrolling. The stacking is CSS only (position: sticky);
// the script only shrinks each card a little as the next one covers it (transform only). Stays still with
// "reduce motion" and listens to scrolling only while the list is on screen.
const SHRINK = 0.045;

export default function PilhaEtapas({ etapas, acaoPrimeira }) {
  const listRef = useRef(null);

  useEffect(() => {
    const ol = listRef.current;
    if (!ol || !window.matchMedia || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const items = Array.from(ol.children);
    const cards = items.map((li) => li.firstElementChild);
    let tops = [];
    let sticky = false;
    let raf = 0;

    // On short screens the cards do not stick (CSS): then there is nothing to shrink.
    const measureTops = () => {
      sticky = getComputedStyle(items[0]).position === "sticky";
      tops = items.map((li) => parseFloat(getComputedStyle(li).top) || 0);
    };
    const paint = () => {
      raf = 0;
      if (!sticky) {
        cards.forEach((c) => (c.style.transform = ""));
        return;
      }
      const vh = window.innerHeight;
      const coverage = items.map((li, j) => {
        const travel = vh - tops[j];
        if (travel <= 0) return 0;
        return Math.min(1, Math.max(0, (vh - li.getBoundingClientRect().top) / travel));
      });
      cards.forEach((c, i) => {
        let s = 0;
        for (let j = i + 1; j < coverage.length; j++) s += coverage[j];
        c.style.transform = s > 0 ? `scale(${1 - SHRINK * s})` : "";
      });
    };
    const requestPaint = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onResize = () => {
      measureTops();
      requestPaint();
    };

    measureTops();
    let listening = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !listening) {
        window.addEventListener("scroll", requestPaint, { passive: true });
        window.addEventListener("resize", onResize, { passive: true });
        listening = true;
        measureTops();
        requestPaint();
      } else if (!e.isIntersecting && listening) {
        window.removeEventListener("scroll", requestPaint);
        window.removeEventListener("resize", onResize);
        listening = false;
      }
    });
    io.observe(ol);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", requestPaint);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      cards.forEach((c) => (c.style.transform = ""));
    };
  }, []);

  return (
    <ol className="stack" ref={listRef}>
      {etapas.map((e, i) => (
        <li key={e.titulo} className="stack-item" style={{ "--i": i }}>
          <article className="stack-card">
            <span className="stack-num" aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <p className="stack-step">
                Passo {i + 1} de {etapas.length}
              </p>
              <h3>{e.titulo}</h3>
              <p>{e.texto}</p>
              {i === 0 && acaoPrimeira}
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
