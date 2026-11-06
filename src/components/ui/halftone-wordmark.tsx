// Giant footer wordmark printed in halftone dots (adapted from 21st.dev's "Halftone Wordmark Footer",
// prompt saved in the vault). Only the wordmark strip: the rest of the footer stays in Layout.
// - Each dot is sized by how much of the letter covers its cell; dots shrink toward the bottom,
//   producing the fade that used to be a gradient on the text.
// - With the mouse (or a finger) the dots spring away and warm up to green; a click releases a wave.
// - The canvas is transparent (the background is the footer's) and sleeps when everything stops and when it leaves the screen.
// - Without JavaScript or before drawing, the old text shows (it stays in the prerendered HTML).
// - "Reduced motion": still drawing, no pointer response.
import * as React from "react";

type Color = [number, number, number, number];

export function hwCor(css: string): Color | null {
  const s = (css || "").trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].split("").map((c) => c + c).join("") : hex[1];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i.exec(s);
  if (!rgb) return null;
  const a = rgb[4] === undefined ? 1 : rgb[4].endsWith("%") ? parseFloat(rgb[4]) / 100 : parseFloat(rgb[4]);
  return [+rgb[1], +rgb[2], +rgb[3], a];
}

// Radius proportional to area: the tone stays even.
export function hwRaio(coverage: number, step: number) {
  const c = coverage < 0 ? 0 : coverage > 1 ? 1 : coverage;
  return Math.sqrt(c) * step * 0.56;
}

// One spring step back home, plus the pointer's push at (px, py) within radius r.
export function hwPasso(x: number, y: number, vx: number, vy: number, hx: number, hy: number, px: number, py: number, r: number) {
  const dx = x - px;
  const dy = y - py;
  const d2 = dx * dx + dy * dy;
  if (r > 0 && d2 < r * r) {
    const d = Math.sqrt(d2) + 0.001;
    const f = (1 - d / r) * 2.6;
    vx += (dx / d) * f;
    vy += (dy / d) * f;
  }
  vx = (vx + (hx - x) * 0.05) * 0.84;
  vy = (vy + (hy - y) * 0.05) * 0.84;
  return [x + vx, y + vy, vx, vy];
}

type Props = {
  palavra: string;
  className?: string;
  /** Distance between dot centers, in px. */
  passo?: number;
  /** Pointer reach, in px. */
  raio?: number;
  /** How much of the cap height sits below the edge, 0 to 0.6. */
  corte?: number;
};

export function HalftoneWordmark({ palavra, className = "", passo = 6, raio = 80, corte = 0.18 }: Props) {
  const boxRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const root = boxRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const style = getComputedStyle(root);
    const ink = hwCor(style.getPropertyValue("--hw-ink")) || [255, 255, 255, 0.2];
    const warm = hwCor(style.getPropertyValue("--hw-warm")) || [111, 211, 124, 1];
    const font = style.fontFamily || "sans-serif";
    const weight = style.fontWeight || "700";
    const inkColor = `rgba(${ink[0]},${ink[1]},${ink[2]},${ink[3]})`;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let px = -1e5;
    let py = -1e5;
    let raf = 0;
    let visible = true;
    let awake = true;
    let wave = { x: 0, y: 0, t: -1 };
    let dots = new Float32Array(0); // x, y, vx, vy, hx, hy, r
    let total = 0;
    let alive = true;

    const layout = () => {
      const rect = root.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      const mask = document.createElement("canvas");
      mask.width = w;
      mask.height = h;
      const m = mask.getContext("2d", { willReadFrequently: true });
      if (!m) return;
      // Same tight spacing as the old text (-0.04 em), where the browser supports it.
      const setSpacing = (size: number) => {
        if ("letterSpacing" in m) m.letterSpacing = `${-0.04 * size}px`;
      };
      m.font = `${weight} 100px ${font}`;
      setSpacing(100);
      const em100 = m.measureText(palavra);
      const c = Math.max(0, Math.min(0.6, corte));
      const byWidth = (Math.max(1, w - 32) / Math.max(1, em100.width)) * 100;
      const byHeight = (h * 0.94) / Math.max(0.01, ((em100.actualBoundingBoxAscent || 72) / 100) * (1 - c));
      const fontSize = Math.min(byWidth, byHeight);
      m.font = `${weight} ${fontSize}px ${font}`;
      setSpacing(fontSize);
      const metrics = m.measureText(palavra);
      const cap = metrics.actualBoundingBoxAscent || fontSize * 0.72;
      m.fillStyle = "#000";
      m.textBaseline = "alphabetic";
      m.fillText(palavra, (w - metrics.width) / 2, h + cap * c);
      const img = m.getImageData(0, 0, w, h).data;

      const g = Math.max(3, passo);
      const cols = Math.ceil(w / g);
      const rows = Math.ceil(h / g);
      const list: number[] = [];
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          let sum = 0;
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(w - 1, Math.floor(gx * g + ((sx + 0.5) * g) / 3));
              const y = Math.min(h - 1, Math.floor(gy * g + ((sy + 0.5) * g) / 3));
              sum += img[(y * w + x) * 4 + 3];
            }
          }
          const coverage = sum / (9 * 255);
          if (coverage < 0.06) continue;
          const hx = gx * g + g / 2;
          const hy = gy * g + g / 2;
          const falloff = 1 - 0.6 * (hy / h); // smaller dots toward the bottom: the halftone fade
          list.push(hx, hy, 0, 0, hx, hy, hwRaio(coverage * falloff, g));
        }
      }
      dots = new Float32Array(list);
      total = list.length / 7;
      awake = true;
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const r = reduce ? 0 : raio;
      const age = wave.t < 0 ? 1e9 : now - wave.t;
      const waveRadius = age * 0.9;
      let moving = false;

      // Dots at home all go into a single path; displaced ones are painted one by one, already warmed.
      ctx.fillStyle = inkColor;
      ctx.beginPath();
      const warmDots: number[] = [];
      for (let i = 0; i < total; i++) {
        const j = i * 7;
        let x = dots[j];
        let y = dots[j + 1];
        let vx = dots[j + 2];
        let vy = dots[j + 3];
        const hx = dots[j + 4];
        const hy = dots[j + 5];
        if (!reduce) {
          if (age < 900) {
            const dx = hx - wave.x;
            const dy = hy - wave.y;
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
            const band = 1 - Math.min(1, Math.abs(d - waveRadius) / 26);
            if (band > 0) {
              const f = band * 3.2 * (1 - age / 900);
              vx += (dx / d) * f;
              vy += (dy / d) * f;
            }
          }
          const s = hwPasso(x, y, vx, vy, hx, hy, px, py, r);
          [x, y, vx, vy] = s;
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) moving = true;
          else {
            x = hx;
            y = hy;
            vx = 0;
            vy = 0;
          }
          dots[j] = x;
          dots[j + 1] = y;
          dots[j + 2] = vx;
          dots[j + 3] = vy;
        }
        const k = Math.min(1, Math.hypot(x - hx, y - hy) / 28);
        if (k > 0.02) warmDots.push(x, y, dots[j + 6], k);
        else {
          ctx.moveTo(x + dots[j + 6], y);
          ctx.arc(x, y, dots[j + 6], 0, 6.2832);
        }
      }
      ctx.fill();
      for (let q = 0; q < warmDots.length; q += 4) {
        const k = warmDots[q + 3];
        const mix = (a: number, b: number) => Math.round(a + (b - a) * k);
        ctx.fillStyle = `rgba(${mix(ink[0], warm[0])},${mix(ink[1], warm[1])},${mix(ink[2], warm[2])},${ink[3] + (warm[3] - ink[3]) * k})`;
        ctx.beginPath();
        ctx.arc(warmDots[q], warmDots[q + 1], warmDots[q + 2], 0, 6.2832);
        ctx.fill();
      }
      awake = moving || age < 900 || px > -1e4;
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible) return;
      draw(now);
      if (awake) raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      awake = true;
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    const localPoint = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    };
    const onMove = (e: PointerEvent) => {
      if (reduce) return;
      [px, py] = localPoint(e);
      wake();
    };
    const onLeave = () => {
      px = -1e5;
      py = -1e5;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (reduce) return;
      const [x, y] = localPoint(e);
      wave = { x, y, t: performance.now() };
      wake();
    };

    let lastWidth = 0;
    const start = () => {
      if (!alive) return;
      layout();
      lastWidth = w;
      draw(performance.now());
      setReady(true);
    };
    // Only lays out near the screen (the mask reads pixels and walks the whole grid), outside of page load.
    // Also waits for the site font (Manrope) at weight 700: measuring with the fallback font would misalign the word.
    const nearObserver = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        nearObserver.disconnect();
        const fonts = document.fonts;
        if (fonts && fonts.load) fonts.load(`${weight} 100px ${font}`).then(start, start);
        else start();
      },
      { rootMargin: "400px" },
    );
    nearObserver.observe(root);

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointercancel", onLeave);
    root.addEventListener("pointerdown", onDown);
    const ro = new ResizeObserver(() => {
      if (!total || Math.round(root.getBoundingClientRect().width) === lastWidth) return;
      layout();
      lastWidth = w;
      wake();
    });
    ro.observe(root);
    const io = new IntersectionObserver(([e]) => {
      visible = e ? e.isIntersecting : true;
      if (visible) wake();
    });
    io.observe(root);

    return () => {
      alive = false;
      nearObserver.disconnect();
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointercancel", onLeave);
      root.removeEventListener("pointerdown", onDown);
    };
  }, [palavra, passo, raio, corte]);

  return (
    <div ref={boxRef} className={`hw-brand ${ready ? "ready" : ""} ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} />
      <p className="hw-brand-text">{palavra}</p>
    </div>
  );
}

export default HalftoneWordmark;
