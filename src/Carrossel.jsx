import { useCallback, useEffect, useRef, useState } from "react";
import Icone from "./Icone";
import { slidesDe, caminho, aviso } from "./fotos";

// Carrossel de fotos acessível (padrão WAI-ARIA "carousel"), sem biblioteca.
// - A faixa é CSS scroll-snap: funciona sem JavaScript, com arrasto no toque e roda do mouse.
// - Botões, pontos, contador e setas do teclado só movem a rolagem (transform/opacity nas transições).
// - A troca automática (opcional) só liga se a pessoa não pediu movimento reduzido, pausa ao passar o
//   mouse, ao focar e ao tocar, e tem botão visível de pausa (WCAG 2.2.2).
// - Nada de window/document na renderização: seguro para o prerender.
// Props: chave (lugar em CARROSSEIS), rotulo (nome para leitores de tela), aspecto, auto (ms) e
// (o atributo sizes foi aposentado: cada foto tem um arquivo só).
export default function Carrossel({ chave, rotulo, aspecto = "16 / 10", auto = 0, className = "", prioridade = false }) {
  const slides = slidesDe(chave);
  const total = slides.length;
  const faixa = useRef(null);
  const [i, setI] = useState(0);
  const [podeAuto, setPodeAuto] = useState(false); // só depois de montar: evita divergência no prerender
  const [rodando, setRodando] = useState(false);
  const [suspenso, setSuspenso] = useState(false); // mouse ou foco em cima
  const reduz = useRef(false);
  const travaAte = useRef(0); // enquanto a rolagem programada anda, a rolagem não reescreve o contador

  useEffect(() => {
    reduz.current = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (auto && total > 1 && !reduz.current) {
      setPodeAuto(true);
      setRodando(true);
    }
  }, [auto, total]);

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

  // Atualiza o contador conforme a rolagem (toque, arrasto, teclado ou botões).
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

  // Troca automática.
  useEffect(() => {
    if (!podeAuto || !rodando || suspenso) return undefined;
    const t = setInterval(() => {
      const f = faixa.current;
      if (!f) return;
      const p = passo();
      const atual = p > 0 ? Math.round(f.scrollLeft / p) : 0;
      ir(atual >= total - 1 ? 0 : atual + 1);
    }, auto);
    return () => clearInterval(t);
  }, [podeAuto, rodando, suspenso, auto, total, ir]);

  if (total === 0) return null;

  const manual = (n) => {
    setRodando(false); // quem assume o controle não é interrompido pela troca automática
    ir(n);
  };

  const teclas = (e) => {
    if (total < 2) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      manual(i + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      manual(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      manual(0);
    } else if (e.key === "End") {
      e.preventDefault();
      manual(total - 1);
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
      onMouseEnter={() => setSuspenso(true)}
      onMouseLeave={() => setSuspenso(false)}
      onFocus={() => setSuspenso(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setSuspenso(false); // só retoma se o foco saiu do carrossel
      }}
      onTouchStart={() => setRodando(false)}
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
          <p className="car-contador" aria-live={rodando && podeAuto ? "off" : "polite"} aria-atomic="true">
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
                onClick={() => manual(n)}
              >
                <i aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="car-botoes">
            {podeAuto && (
              <button
                type="button"
                className="car-btn"
                onClick={() => setRodando((r) => !r)}
                aria-pressed={rodando}
                aria-label={rodando ? "Pausar a troca automática" : "Retomar a troca automática"}
              >
                <Icone nome={rodando ? "fa-solid fa-pause" : "fa-solid fa-play"} />
              </button>
            )}
            <button type="button" className="car-btn car-ant" onClick={() => manual(i - 1)} disabled={i === 0} aria-label="Imagem anterior">
              <Icone nome="fa-solid fa-chevron-left" />
            </button>
            <button type="button" className="car-btn car-prox" onClick={() => manual(i + 1)} disabled={i === total - 1} aria-label="Próxima imagem">
              <Icone nome="fa-solid fa-chevron-right" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
