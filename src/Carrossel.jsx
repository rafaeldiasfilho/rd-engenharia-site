import { useCallback, useEffect, useRef, useState } from "react";
import { slidesDe, caminho, aviso } from "./fotos";

// Faixa de fotos no estilo "Fotos" da Apple, sem biblioteca e sem troca automática.
// - A faixa é CSS scroll-snap: funciona sem JavaScript, com deslizar no toque e roda/arrasto no mouse,
//   e a próxima foto aparece "espiando" na borda.
// - Sem botões laterais e sem play/pause: o indicador é só o contador "n / N" e os pontinhos (clicáveis).
// - Setas, Home e End do teclado funcionam com a faixa focada. Com movimento reduzido, o salto é direto.
// - Nada de window/document na renderização: seguro para o prerender.
// Props: chave (lugar em CARROSSEIS), rotulo (nome para leitores de tela), aspecto, prioridade.
export default function Carrossel({ chave, rotulo, aspecto = "16 / 10", className = "", prioridade = false }) {
  const slides = slidesDe(chave);
  const total = slides.length;
  const faixa = useRef(null);
  const [i, setI] = useState(0);
  const reduz = useRef(false);
  const travaAte = useRef(0); // enquanto a rolagem programada anda, a rolagem não reescreve o contador

  useEffect(() => {
    reduz.current = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const passo = () => {
    const f = faixa.current;
    if (!f || f.children.length < 2) return f ? f.clientWidth : 0;
    return f.children[1].offsetLeft - f.children[0].offsetLeft;
  };

  const ir = useCallback(
    (n) => {
      const f = faixa.current;
      if (!f) return;
      const alvo = Math.max(0, Math.min(total - 1, n));
      f.scrollTo({ left: alvo * passo(), behavior: reduz.current ? "auto" : "smooth" });
      travaAte.current = Date.now() + 700;
      setI(alvo);
    },
    [total]
  );

  // Atualiza o contador conforme a rolagem (toque, arrasto, teclado ou pontos).
  useEffect(() => {
    const f = faixa.current;
    if (!f) return undefined;
    let adiado = 0;
    const aoRolar = () => {
      clearTimeout(adiado);
      const resta = travaAte.current - Date.now();
      if (resta > 0) {
        adiado = setTimeout(aoRolar, resta + 30); // confere de novo quando a trava acabar
        return;
      }
      const p = passo();
      if (p > 0) setI(Math.max(0, Math.min(total - 1, Math.round(f.scrollLeft / p))));
    };
    f.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      f.removeEventListener("scroll", aoRolar);
      clearTimeout(adiado);
    };
  }, [total]);

  if (total === 0) return null;

  const teclas = (e) => {
    if (total < 2) return;
    const mapa = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: total - 1 };
    if (e.key in mapa) {
      e.preventDefault();
      ir(mapa[e.key]);
    }
  };

  return (
    <section
      className={`carrossel ${total < 2 ? "carrossel-um" : ""} ${className}`}
      role="region"
      aria-roledescription="carrossel"
      aria-label={rotulo}
      style={{ "--car-aspecto": aspecto }}
      onKeyDown={teclas}
    >
      <div className="car-faixa" ref={faixa} tabIndex={0} aria-label={`${rotulo}: use as setas do teclado ou deslize`}>
        {slides.map((s, n) => (
          <div
            key={s.foto}
            className={`car-slide ${n === i ? "ativo" : ""}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${n + 1} de ${total}`}
          >
            <figure>
              <div className="car-img">
                <img
                  src={caminho(s.f)}
                  width={s.f.w}
                  height={s.f.h}
                  alt={s.f.alt}
                  loading={prioridade && n === 0 ? "eager" : "lazy"}
                  fetchpriority={prioridade && n === 0 ? "high" : undefined}
                  decoding="async"
                  draggable={false}
                  style={s.pos ? { objectPosition: s.pos } : undefined}
                />
              </div>
              <figcaption>
                <strong className="car-legenda">
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
              </figcaption>
            </figure>
          </div>
        ))}
      </div>

      {total > 1 && (
        <div className="car-controles">
          <p className="car-contador" aria-live="polite" aria-atomic="true">
            <span className="sr-only">Imagem </span>
            {i + 1} / {total}
          </p>
          <div className="car-pontos">
            {slides.map((s, n) => (
              <button
                key={s.foto}
                type="button"
                className={n === i ? "ativo" : ""}
                aria-label={`Ir para a imagem ${n + 1} de ${total}`}
                aria-current={n === i ? "true" : undefined}
                onClick={() => ir(n)}
              >
                <i aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
