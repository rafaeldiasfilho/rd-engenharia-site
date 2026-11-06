import { useEffect, useRef } from "react";

// Moldura que "deita" em 3D e se endireita conforme a página rola (ideia do prompt "Container scroll
// animation" da biblioteca, refeita sem framer-motion): o progresso vai de 0 (borda de baixo da tela)
// a 1 (meio da tela) e vira a variável CSS --p; o CSS faz rotateX e scale a partir dela.
// Com "reduzir movimento" não liga nada e a moldura fica reta.
export default function Inclinado3D({ children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let quadro = 0;
    const calcular = () => {
      quadro = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.55)));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const pedir = () => {
      if (!quadro) quadro = requestAnimationFrame(calcular);
    };
    let ligado = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ligado) {
        ligado = true;
        window.addEventListener("scroll", pedir, { passive: true });
        window.addEventListener("resize", pedir);
        pedir();
      } else if (!e.isIntersecting && ligado) {
        ligado = false;
        window.removeEventListener("scroll", pedir);
        window.removeEventListener("resize", pedir);
      }
    });
    io.observe(el);
    el.classList.add("incl-ativo");
    calcular();
    return () => {
      io.disconnect();
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
    };
  }, []);

  return (
    <div ref={ref} className={`incl3d ${className}`}>
      <div className="incl3d-moldura">{children}</div>
    </div>
  );
}
