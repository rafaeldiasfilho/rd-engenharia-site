import { useEffect, useRef } from "react";

// Passos em cartões que grudam no topo e se empilham ao rolar. O empilhamento é só CSS (position: sticky);
// o script apenas encolhe um pouco cada cartão conforme o próximo o cobre (só transform). Fica parado com
// "reduzir movimento" e escuta a rolagem só enquanto a lista está na tela.
const ENCOLHE = 0.045;

export default function PilhaEtapas({ etapas, acaoPrimeira }) {
  const lista = useRef(null);

  useEffect(() => {
    const ol = lista.current;
    if (!ol || !window.matchMedia || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const itens = Array.from(ol.children);
    const cartoes = itens.map((li) => li.firstElementChild);
    let topos = [];
    let fixo = false;
    let raf = 0;

    // Em telas baixas os cartões não grudam (CSS): aí não há o que encolher.
    const medirTopos = () => {
      fixo = getComputedStyle(itens[0]).position === "sticky";
      topos = itens.map((li) => parseFloat(getComputedStyle(li).top) || 0);
    };
    const pintar = () => {
      raf = 0;
      if (!fixo) {
        cartoes.forEach((c) => (c.style.transform = ""));
        return;
      }
      const vh = window.innerHeight;
      const cobre = itens.map((li, j) => {
        const curso = vh - topos[j];
        if (curso <= 0) return 0;
        return Math.min(1, Math.max(0, (vh - li.getBoundingClientRect().top) / curso));
      });
      cartoes.forEach((c, i) => {
        let s = 0;
        for (let j = i + 1; j < cobre.length; j++) s += cobre[j];
        c.style.transform = s > 0 ? `scale(${1 - ENCOLHE * s})` : "";
      });
    };
    const pedir = () => {
      if (!raf) raf = requestAnimationFrame(pintar);
    };
    const redimensionar = () => {
      medirTopos();
      pedir();
    };

    medirTopos();
    let ouvindo = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ouvindo) {
        window.addEventListener("scroll", pedir, { passive: true });
        window.addEventListener("resize", redimensionar, { passive: true });
        ouvindo = true;
        medirTopos();
        pedir();
      } else if (!e.isIntersecting && ouvindo) {
        window.removeEventListener("scroll", pedir);
        window.removeEventListener("resize", redimensionar);
        ouvindo = false;
      }
    });
    io.observe(ol);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", redimensionar);
      cancelAnimationFrame(raf);
      cartoes.forEach((c) => (c.style.transform = ""));
    };
  }, []);

  return (
    <ol className="pilha" ref={lista}>
      {etapas.map((e, i) => (
        <li key={e.titulo} className="pilha-item" style={{ "--i": i }}>
          <article className="pilha-cartao">
            <span className="pilha-num" aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <p className="pilha-passo">
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
