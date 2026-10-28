import { useEffect, useRef, useState } from "react";
import { slidesDe, caminho, srcset, aviso } from "./fotos";

// Abertura (hero) com fotos de fundo em tela cheia, troca por transição de opacidade.
// Mesmas regras de movimento do Carrossel: a troca automática só começa depois de montar, pausa com o
// mouse em cima, foco de teclado, ponteiro pressionado, aba oculta ou hero fora da tela; para de vez
// depois da primeira interação (ponto, seta do teclado, deslizar) e depois de 3 voltas; nunca roda com
// "reduzir movimento". Deslizar para o lado (toque ou mouse) troca de foto.
// A foto da vez fica ativa; as demais ficam com aria-hidden. A legenda mostra a área e o aviso de foto
// ilustrativa com link para /creditos.
const INTERVALO = 6000;
const VOLTAS_MAX = 3;

function focoDoTeclado(el) {
  try {
    return el.matches(":has(:focus-visible)");
  } catch {
    return el.matches(":focus-within");
  }
}

export default function HeroFundo({ chave, rotulo, className = "", children }) {
  const slides = slidesDe(chave);
  const total = slides.length;
  const [i, setI] = useState(0);
  const [anterior, setAnterior] = useState(-1); // foto que está saindo (fica montada durante a transição)
  const secao = useRef(null);
  const atual = useRef(0);
  const parou = useRef(false);
  const voltas = useRef(0);
  const reduz = useRef(false);
  const ponteiros = useRef(new Set());
  const inicio = useRef(null);

  const ir = (n) => {
    setAnterior(atual.current);
    atual.current = n;
    setI(n);
  };
  const manual = (n) => {
    parou.current = true;
    ir(((n % total) + total) % total);
  };

  useEffect(() => {
    const mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    reduz.current = !!(mq && mq.matches);
    const aoMudar = () => {
      reduz.current = !!(mq && mq.matches);
    };
    if (mq && mq.addEventListener) mq.addEventListener("change", aoMudar);
    const el = secao.current;
    let visivel = true;
    const io = "IntersectionObserver" in window && el ? new IntersectionObserver(([e]) => (visivel = e.isIntersecting), { threshold: 0.3 }) : null;
    if (io && el) io.observe(el);
    const desce = (e) => ponteiros.current.add(e.pointerId);
    const sobe = (e) => ponteiros.current.delete(e.pointerId);
    if (el) el.addEventListener("pointerdown", desce, { passive: true });
    window.addEventListener("pointerup", sobe, { passive: true });
    window.addEventListener("pointercancel", sobe, { passive: true });

    const tick = () => {
      if (total < 2 || parou.current || reduz.current || !visivel || document.hidden) return;
      if (ponteiros.current.size > 0) return;
      if (el && (el.matches(":hover") || focoDoTeclado(el))) return;
      const prox = (atual.current + 1) % total;
      if (prox === 0) {
        voltas.current += 1;
        if (voltas.current >= VOLTAS_MAX) {
          parou.current = true;
          return;
        }
      }
      ir(prox);
    };
    const t = total > 1 ? setInterval(tick, INTERVALO) : 0;
    return () => {
      clearInterval(t);
      if (io) io.disconnect();
      if (el) el.removeEventListener("pointerdown", desce);
      window.removeEventListener("pointerup", sobe);
      window.removeEventListener("pointercancel", sobe);
      if (mq && mq.removeEventListener) mq.removeEventListener("change", aoMudar);
    };
  }, [total]);

  // Deslizar para o lado em qualquer ponto do hero que não seja controle.
  const aoApertar = (e) => {
    if (total < 2 || e.target.closest("a, button, input, select, textarea, label")) return;
    inicio.current = { x: e.clientX, y: e.clientY };
  };
  const aoSoltar = (e) => {
    const p = inicio.current;
    inicio.current = null;
    if (!p) return;
    const dx = e.clientX - p.x;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(e.clientY - p.y) * 1.5) manual(atual.current + (dx < 0 ? 1 : -1));
  };
  const teclas = (e) => {
    if (total < 2 || e.target.closest("input, select, textarea")) return;
    if (e.key === "ArrowRight") manual(atual.current + 1);
    else if (e.key === "ArrowLeft") manual(atual.current - 1);
  };

  const s = slides[i];
  return (
    <section
      ref={secao}
      className={`hero-fundo ${className}`}
      role="region"
      aria-roledescription="carrossel"
      aria-label={rotulo}
      onPointerDown={aoApertar}
      onPointerUp={aoSoltar}
      onPointerCancel={() => (inicio.current = null)}
      onKeyDown={teclas}
    >
      <div className="hf-slides">
        {slides.map((x, n) =>
          // Só ficam no DOM (e só baixam) a primeira foto, a da vez, a próxima e a que está saindo.
          n === 0 || n === i || n === (i + 1) % total || n === anterior ? (
          <img
            key={x.foto}
            src={caminho(x.f)}
            srcSet={srcset(x.f)}
            sizes="100vw"
            width={x.f.w}
            height={x.f.h}
            alt={x.f.alt}
            aria-hidden={n === i ? undefined : "true"}
            className={n === i ? "ativo" : ""}
            loading="eager"
            fetchpriority={n === 0 && i === 0 ? "high" : undefined}
            decoding="async"
            draggable={false}
          />
          ) : null
        )}
      </div>
      <div className="hf-scrim" aria-hidden="true" />
      <div className="hf-brilho" aria-hidden="true" />
      <div className="container hf-conteudo">{children}</div>
      {s && (
        <div className="container hf-rodape">
          <p className="hf-legenda">
            <strong>
              {s.href ? (
                <a href={s.href}>
                  {s.legenda} <span aria-hidden="true">→</span>
                </a>
              ) : (
                s.legenda
              )}
            </strong>
            <small>
              {aviso(s.f)} <a href="/creditos">Créditos</a>
            </small>
          </p>
          {total > 1 && (
            <div className="hf-pontos">
              {slides.map((x, n) => (
                <button
                  key={x.foto}
                  type="button"
                  className={n === i ? "ativo" : ""}
                  aria-label={`Ir para a imagem ${n + 1} de ${total}`}
                  aria-current={n === i ? "true" : undefined}
                  onClick={() => manual(n)}
                >
                  <i aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
