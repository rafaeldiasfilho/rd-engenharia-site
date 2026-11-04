import { useEffect, useRef } from "react";

// Fundo "aurora" das faixas escuras: três manchas de luz (verde, lima e verde-água) que derivam devagar.
// Só CSS (gradientes radiais movidos com transform, sem filter: blur), então custa pouco mesmo no celular.
// A animação pausa fora da tela e não roda com "reduzir movimento" (fica a imagem parada).
// Uso: dentro de um bloco com position: relative e isolation: isolate; a aurora fica atrás do conteúdo.
export default function Aurora({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("aurora-pausa", !e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`aurora aurora-pausa ${className}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}
