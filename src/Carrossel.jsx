import { useCallback, useEffect, useRef, useState } from "react";
import { slidesDe, caminho, srcset, aviso } from "./fotos";

// Faixa de imagens no estilo "Fotos" da Apple, sem biblioteca. É o único carrossel do site.
// - A faixa é CSS scroll-snap: funciona sem JavaScript, com deslizar no toque e roda do mouse, e a
//   próxima imagem aparece "espiando" na borda.
// - Arrastar com o mouse (ponteiro "mouse") move a faixa e, ao soltar, encaixa na imagem mais próxima.
//   Um arrasto não dispara clique em link. Teclado: setas, Home e End com a faixa focada.
// - Sem botões laterais e sem play/pause: o indicador é o contador "n / N" e os pontinhos (clicáveis).
// - Troca automática a cada ~5 s, só depois de montar (não mexe no layout): pausa com o mouse em cima,
//   foco dentro, toque/clique/arrasto, aba em segundo plano ou carrossel fora da tela, e volta ~8 s depois
//   da última interação. Com "reduzir movimento" nunca troca sozinho.
// - Nada de window/document na renderização: seguro para o prerender.
// Fontes de slides: `chave` (fotos em CARROSSEIS, src/fotos.js) ou `itens` (lista própria, ver abaixo).
// Item: { key, src, w, h, alt, legenda, nota, href (link da legenda), imgHref (link da imagem), contem, creditos }
//   ou { key, node (qualquer elemento, ex.: uma folha SVG), legenda, nota }.
// Clicar na imagem vizinha que aparece na borda leva até ela (botão invisível "Ir para a imagem n").
// Foco por teclado dentro do carrossel (um clique do mouse também foca a faixa, mas não deve pausar para sempre).
function focoDoTeclado(el) {
  try {
    return el.matches(":has(:focus-visible)");
  } catch {
    return el.matches(":focus-within");
  }
}

const INTERVALO = 5000;
const VOLTAS_MAX = 3; // depois de 3 voltas completas a troca automática para
const RETOMADA = 8000;

export default function Carrossel({ chave, itens, rotulo, aspecto = "16 / 10", className = "", prioridade = false, auto = true, sizes = "(min-width: 900px) 50vw, 90vw" }) {
  const slides = itens
    ? itens
    : slidesDe(chave || "").map((s) => ({
        key: s.foto,
        src: caminho(s.f),
        srcSet: srcset(s.f),
        w: s.f.w,
        h: s.f.h,
        alt: s.f.alt,
        legenda: s.legenda,
        href: s.href,
        nota: aviso(s.f),
        creditos: true,
        pos: s.pos,
      }));
  const total = slides.length;
  const cheio = className.includes("car-cheio"); // slide ocupa a largura toda: não há vizinhas para clicar
  const secao = useRef(null);
  const faixa = useRef(null);
  const [i, setI] = useState(0);
  const [arrastando, setArrastando] = useState(false);
  const reduz = useRef(false);
  const travaAte = useRef(0); // enquanto a rolagem programada anda, a rolagem não reescreve o contador
  const ultimaAcao = useRef(0); // última interação da pessoa (pausa a troca automática)
  const drag = useRef({ ativo: false, moveu: false, x0: 0, sl0: 0, id: null, bloqueia: false });
  const ponteiros = useRef(new Set()); // ponteiros (mouse, toque, caneta) com o botão/dedo pressionado
  const parou = useRef(false); // a pessoa mexeu ou já deu 3 voltas: não troca mais sozinho nesta visita
  const voltas = useRef(0);
  const temporizadores = useRef([]); // timeouts do arrasto, limpos ao desmontar
  const agendar = (fn, ms) => {
    temporizadores.current.push(setTimeout(fn, ms));
  };
  useEffect(() => {
    const lista = temporizadores;
    return () => lista.current.forEach(clearTimeout);
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

  // Contador acompanha a rolagem (toque, arrasto, teclado ou pontos).
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

  // Movimento reduzido + troca automática (tudo depois de montar, então nada muda na renderização do servidor).
  useEffect(() => {
    const mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    reduz.current = !!(mq && mq.matches);
    const aoMudarMq = () => {
      reduz.current = !!(mq && mq.matches);
    };
    if (mq && mq.addEventListener) mq.addEventListener("change", aoMudarMq);

    const el = secao.current;
    let visivel = true;
    const io = "IntersectionObserver" in window && el ? new IntersectionObserver(([en]) => (visivel = en.isIntersecting), { threshold: 0.4 }) : null;
    if (io && el) io.observe(el);
    const marca = () => {
      ultimaAcao.current = Date.now();
    };
    const eventos = ["pointerdown", "pointerup", "pointerleave", "touchstart", "wheel", "keydown", "focusin", "focusout"];
    if (el) eventos.forEach((ev) => el.addEventListener(ev, marca, { passive: true }));
    // Enquanto qualquer ponteiro estiver pressionado (mouse, dedo, caneta), a troca automática não anda.
    const desce = (e) => {
      ponteiros.current.add(e.pointerId);
      if (e.pointerType !== "mouse") parou.current = true; // gesto de toque: a pessoa assumiu o controle
    };
    const sobe = (e) => {
      ponteiros.current.delete(e.pointerId);
    };
    if (el) el.addEventListener("pointerdown", desce, { passive: true });
    window.addEventListener("pointerup", sobe, { passive: true });
    window.addEventListener("pointercancel", sobe, { passive: true });

    const tick = () => {
      if (!auto || total < 2 || parou.current || reduz.current || !visivel || document.hidden) return;
      if (ponteiros.current.size > 0 || drag.current.ativo || drag.current.moveu) return;
      if (el && (el.matches(":hover") || focoDoTeclado(el))) return;
      if (Date.now() - ultimaAcao.current < RETOMADA) return;
      const f = faixa.current;
      const p = passo();
      if (!f || p <= 0) return;
      const atual = Math.round(f.scrollLeft / p);
      if (atual >= total - 1) {
        voltas.current += 1;
        if (voltas.current >= VOLTAS_MAX) {
          parou.current = true;
          return;
        }
        ir(0);
      } else {
        ir(atual + 1);
      }
    };
    const t = auto && total > 1 ? setInterval(tick, INTERVALO) : 0;

    return () => {
      clearInterval(t);
      if (io) io.disconnect();
      if (el) {
        eventos.forEach((ev) => el.removeEventListener(ev, marca));
        el.removeEventListener("pointerdown", desce);
      }
      window.removeEventListener("pointerup", sobe);
      window.removeEventListener("pointercancel", sobe);
      if (mq && mq.removeEventListener) mq.removeEventListener("change", aoMudarMq);
    };
  }, [auto, total, ir]);

  if (total === 0) return null;

  const teclas = (e) => {
    if (total < 2) return;
    const mapa = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: total - 1 };
    if (e.key in mapa) {
      e.preventDefault();
      parou.current = true;
      ir(mapa[e.key]);
    }
  };

  // Arrasto com o mouse. Toque e caneta usam a rolagem nativa da faixa.
  const aoApertar = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || total < 2) return;
    drag.current = { ativo: true, moveu: false, x0: e.clientX, sl0: faixa.current.scrollLeft, id: e.pointerId, bloqueia: false };
  };
  const aoMover = (e) => {
    const d = drag.current;
    if (!d.ativo) return;
    const dx = e.clientX - d.x0;
    if (!d.moveu && Math.abs(dx) > 4) {
      d.moveu = true;
      parou.current = true;
      try {
        faixa.current.setPointerCapture(d.id);
      } catch {
        /* ponteiro já liberado */
      }
      setArrastando(true);
    }
    if (d.moveu) faixa.current.scrollLeft = d.sl0 - dx;
  };
  const aoSoltar = () => {
    const d = drag.current;
    if (!d.ativo) return;
    d.ativo = false;
    if (!d.moveu) return;
    const p = passo();
    const alvo = p > 0 ? Math.round(faixa.current.scrollLeft / p) : 0;
    d.bloqueia = true; // o clique que vem logo depois do arrasto não deve abrir link
    agendar(() => {
      d.bloqueia = false;
    }, 50);
    ir(alvo);
    agendar(() => {
      d.moveu = false;
      setArrastando(false);
    }, 500);
  };
  const aoClicarCaptura = (e) => {
    if (drag.current.bloqueia) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section
      ref={secao}
      className={`carrossel ${total < 2 ? "carrossel-um" : ""} ${className}`}
      role="region"
      aria-roledescription="carrossel"
      aria-label={rotulo}
      style={{ "--car-aspecto": aspecto }}
      onKeyDown={teclas}
    >
      <div
        className={`car-faixa ${arrastando ? "arrastando" : ""}`}
        ref={faixa}
        tabIndex={0}
        aria-label={`${rotulo}: use as setas do teclado, deslize ou arraste`}
        onPointerDown={aoApertar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        onClickCapture={aoClicarCaptura}
      >
        {slides.map((s, n) => {
          const img = s.node ? null : (
            <img
              src={s.src}
              srcSet={s.srcSet}
              sizes={s.srcSet ? sizes : undefined}
              width={s.w}
              height={s.h}
              alt={s.alt}
              loading={prioridade && n === 0 ? "eager" : "lazy"}
              fetchpriority={prioridade && n === 0 ? "high" : undefined}
              decoding="async"
              draggable={false}
              style={s.pos ? { objectPosition: s.pos } : undefined}
            />
          );
          return (
            <div
              key={s.key}
              className={`car-slide ${n === i ? "ativo" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${n + 1} de ${total}`}
            >
              {!cheio && n !== i && total > 1 && (
                <button
                  type="button"
                  className="car-vizinha"
                  aria-label={`Ir para a imagem ${n + 1} de ${total}`}
                  onClick={() => {
                    parou.current = true;
                    ir(n);
                  }}
                />
              )}
              <figure>
                <div className={`car-img ${s.contem ? "contem" : ""} ${s.node ? "no" : ""}`}>
                  {s.node ? (
                    s.node
                  ) : s.imgHref ? (
                    <a href={s.imgHref} target="_blank" rel="noopener noreferrer" draggable={false} aria-label={`Ampliar: ${s.legenda || s.alt}`}>
                      {img}
                    </a>
                  ) : (
                    img
                  )}
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
                  {s.nota && (
                    <small>
                      {s.nota} {s.creditos && <a href="/creditos">Créditos</a>}
                    </small>
                  )}
                </figcaption>
              </figure>
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <div className="car-controles">
          <p className="car-contador" aria-live="off" aria-atomic="true">
            <span className="sr-only">Imagem </span>
            {i + 1} / {total}
          </p>
          <div className="car-pontos">
            {slides.map((s, n) => (
              <button
                key={s.key}
                type="button"
                className={n === i ? "ativo" : ""}
                aria-label={`Ir para a imagem ${n + 1} de ${total}`}
                aria-current={n === i ? "true" : undefined}
                onClick={() => {
                  parou.current = true;
                  ir(n);
                }}
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
