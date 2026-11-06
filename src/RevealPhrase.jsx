import { useEffect, useRef } from "react";

// Frase de destaque que "acende" palavra por palavra conforme a rolagem (seção pedida pela skill
// landing-page-design): as palavras começam apagadas (~30%) e acendem em ordem de leitura ao passar
// por uma linha a 65% da altura da tela. Sem JavaScript ou com "reduzir movimento": frase inteira acesa.
// A rolagem só é ouvida enquanto a frase está na tela, e o cálculo vai num requestAnimationFrame.
export default function FraseRevela({ texto, className = "" }) {
  const ref = useRef(null);
  const palavras = texto.split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    el.classList.add("phrase-active");
    const spans = [...el.querySelectorAll("span")];
    let quadro = 0;
    const calcular = () => {
      quadro = 0;
      const linha = window.innerHeight * 0.65;
      spans.forEach((s) => s.classList.toggle("aceso", s.getBoundingClientRect().top < linha));
    };
    const pedir = () => {
      if (!quadro) quadro = requestAnimationFrame(calcular);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        window.addEventListener("scroll", pedir, { passive: true });
        pedir();
      } else window.removeEventListener("scroll", pedir);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", pedir);
    };
  }, []);

  return (
    <section className={`phrase-reveal-sec ${className}`} aria-label="Nosso compromisso">
      <div className="container">
        <p ref={ref} className="phrase-reveal">
          {palavras.map((p, n) => (
            <span key={n}>{p} </span>
          ))}
        </p>
      </div>
    </section>
  );
}
