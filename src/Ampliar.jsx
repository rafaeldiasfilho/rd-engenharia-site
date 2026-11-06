import { useCallback, useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight, MagnifyingGlassMinus, MagnifyingGlassPlus, X } from "@phosphor-icons/react";

// Visualizador de fotos na própria página (antes a foto abria em outra aba). Ideia dos componentes
// "Zoomable Image" e "Lightbox Grid" vistos no 21st.dev pelo MCP, refeita aqui sem o código pago:
// - a foto cresce a partir da miniatura clicada e volta para ela ao fechar;
// - setas, teclado (← → Esc + -) e deslizar para o lado trocam de foto;
// - duplo clique / duplo toque ou pinça dão zoom; com zoom, arrastar move a foto;
// - arrastar para baixo (sem zoom) fecha; Esc e o X também.
// <dialog> nativo: prende o foco e devolve ao link que abriu. Com "reduzir movimento", só aparece e some.
// Uso: <Ampliar itens={[{ src, alt, legenda }]} indice={i} origem={elementoMiniatura} aoFechar={fn} />
const CURVA = "cubic-bezier(0.22, 1, 0.36, 1)";
const ZOOM_MAX = 4;

export default function Ampliar({ itens, indice, origem, aoFechar }) {
  const dlg = useRef(null);
  const palco = useRef(null);
  const foto = useRef(null);
  const [i, setI] = useState(indice ?? 0);
  const [zoom, setZoom] = useState(1);
  const estado = useRef({ zoom: 1, x: 0, y: 0, dedos: new Map(), inicio: null, pinca: null, toque: 0, arrasto: null });
  const parado = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const total = itens.length;
  const atual = itens[i];

  const aplicar = (extra = "") => {
    const s = estado.current;
    if (foto.current) foto.current.style.transform = `translate(${s.x}px, ${s.y}px) scale(${s.zoom})${extra}`;
  };

  const zerar = () => {
    const s = estado.current;
    s.zoom = 1;
    s.x = 0;
    s.y = 0;
    setZoom(1);
    aplicar();
  };

  const ir = useCallback(
    (d) => {
      if (total < 2) return;
      zerar();
      setI((v) => (v + d + total) % total);
    },
    [total],
  );

  // Retângulo da miniatura relativo à foto aberta: usado para crescer/voltar
  const deMiniatura = () => {
    const a = origem?.getBoundingClientRect?.();
    const b = foto.current?.getBoundingClientRect();
    if (!a || !b || !b.width || !a.width) return null;
    const esc = Math.max(a.width / b.width, a.height / b.height);
    return `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px, ${a.top + a.height / 2 - (b.top + b.height / 2)}px) scale(${esc})`;
  };

  const fechar = useCallback(() => {
    const d = dlg.current;
    if (!d || d.dataset.fechando) return;
    d.dataset.fechando = "1";
    const fim = () => {
      d.close();
      aoFechar();
    };
    if (parado || !foto.current) return fim();
    const s = estado.current;
    const de = `translate(${s.x}px, ${s.y}px) scale(${s.zoom})`;
    const para = i === indice ? deMiniatura() : null;
    d.animate([{ backgroundColor: getComputedStyle(d).backgroundColor }, { backgroundColor: "rgba(0,0,0,0)" }], { duration: 400, easing: CURVA, fill: "forwards" });
    const anim = foto.current.animate(
      para ? [{ transform: de }, { transform: para }] : [{ transform: de, opacity: 1 }, { transform: `${de} translateY(40px)`, opacity: 0 }],
      { duration: 400, easing: CURVA, fill: "forwards" },
    );
    anim.onfinish = fim;
  }, [aoFechar, i, indice, parado]);

  // Abre e faz a foto crescer da miniatura
  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    d.showModal();
    document.documentElement.classList.add("ampliar-aberto");
    const img = foto.current;
    const animar = () => {
      if (parado) return;
      const de = deMiniatura();
      img.animate(de ? [{ transform: de }, { transform: "none" }] : [{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }], {
        duration: 500,
        easing: CURVA,
      });
    };
    if (img.complete) animar();
    else img.addEventListener("load", animar, { once: true });
    return () => document.documentElement.classList.remove("ampliar-aberto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Teclado
  useEffect(() => {
    const tecla = (e) => {
      if (e.key === "ArrowRight") ir(1);
      else if (e.key === "ArrowLeft") ir(-1);
      else if (e.key === "+" || e.key === "=") ampliarEm(2);
      else if (e.key === "-") zerar();
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  });

  // Pré-carrega as vizinhas
  useEffect(() => {
    [1, -1].forEach((d) => {
      const v = itens[(i + d + total) % total];
      if (v) new Image().src = v.src;
    });
  }, [i, itens, total]);

  const limitar = () => {
    const s = estado.current;
    const r = palco.current.getBoundingClientRect();
    const mx = (r.width * (s.zoom - 1)) / 2;
    const my = (r.height * (s.zoom - 1)) / 2;
    s.x = Math.max(-mx, Math.min(mx, s.x));
    s.y = Math.max(-my, Math.min(my, s.y));
  };

  const ampliarEm = (z, cx, cy) => {
    const s = estado.current;
    const r = palco.current.getBoundingClientRect();
    const px = (cx ?? r.left + r.width / 2) - (r.left + r.width / 2);
    const py = (cy ?? r.top + r.height / 2) - (r.top + r.height / 2);
    const novo = Math.max(1, Math.min(ZOOM_MAX, z));
    s.x = (s.x - px) * (novo / s.zoom) + px;
    s.y = (s.y - py) * (novo / s.zoom) + py;
    s.zoom = novo;
    if (novo === 1) {
      s.x = 0;
      s.y = 0;
    }
    limitar();
    setZoom(novo);
    foto.current.style.transition = parado ? "none" : `transform 300ms ${CURVA}`;
    aplicar();
  };

  // Gestos (ponteiro: mouse, dedo, caneta)
  const baixo = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const s = estado.current;
    palco.current.setPointerCapture(e.pointerId);
    s.dedos.set(e.pointerId, { x: e.clientX, y: e.clientY });
    foto.current.style.transition = "none";
    if (s.dedos.size === 2) {
      const [a, b] = [...s.dedos.values()];
      s.pinca = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom: s.zoom };
      s.arrasto = null;
    } else {
      s.arrasto = { x0: e.clientX, y0: e.clientY, x: s.x, y: s.y, eixo: null };
    }
  };

  const mover = (e) => {
    const s = estado.current;
    if (!s.dedos.has(e.pointerId)) return;
    s.dedos.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (s.pinca && s.dedos.size === 2) {
      const [a, b] = [...s.dedos.values()];
      const z = (s.pinca.zoom * Math.hypot(a.x - b.x, a.y - b.y)) / s.pinca.dist;
      s.zoom = Math.max(1, Math.min(ZOOM_MAX, z));
      limitar();
      aplicar();
      return;
    }
    const g = s.arrasto;
    if (!g) return;
    const dx = e.clientX - g.x0;
    const dy = e.clientY - g.y0;
    if (s.zoom > 1) {
      s.x = g.x + dx;
      s.y = g.y + dy;
      limitar();
      aplicar();
      return;
    }
    if (!g.eixo && Math.hypot(dx, dy) > 8) g.eixo = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    if (g.eixo === "x") {
      s.x = dx;
      aplicar();
    } else if (g.eixo === "y" && dy > 0) {
      s.y = dy;
      aplicar(` scale(${Math.max(0.8, 1 - dy / 1200)})`);
      dlg.current.style.backgroundColor = `rgba(0,0,0,${Math.max(0.2, 0.92 - dy / 600)})`;
    }
  };

  const cima = (e) => {
    const s = estado.current;
    s.dedos.delete(e.pointerId);
    if (s.pinca) {
      if (s.dedos.size < 2) {
        s.pinca = null;
        setZoom(s.zoom);
        if (s.zoom < 1.05) zerar();
      }
      return;
    }
    const g = s.arrasto;
    s.arrasto = null;
    if (!g) return;
    const dx = e.clientX - g.x0;
    const dy = e.clientY - g.y0;
    // toque curto: duplo toque alterna o zoom
    if (Math.hypot(dx, dy) < 8) {
      const agora = Date.now();
      if (agora - s.toque < 320) {
        s.toque = 0;
        ampliarEm(s.zoom > 1 ? 1 : 2.5, e.clientX, e.clientY);
      } else s.toque = agora;
      return;
    }
    if (s.zoom > 1) return;
    foto.current.style.transition = parado ? "none" : `transform 300ms ${CURVA}`;
    if (g.eixo === "x" && Math.abs(dx) > 60) {
      ir(dx < 0 ? 1 : -1);
    } else if (g.eixo === "y" && dy > 110) {
      fechar();
    } else {
      dlg.current.style.backgroundColor = "";
      zerar();
    }
  };

  return (
    <dialog
      ref={dlg}
      className="ampliar"
      aria-label={atual?.legenda || atual?.alt || "Foto ampliada"}
      onCancel={(e) => {
        e.preventDefault();
        fechar();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) fechar();
      }}
    >
      <div
        ref={palco}
        className="ampliar-palco"
        onPointerDown={baixo}
        onPointerMove={mover}
        onPointerUp={cima}
        onPointerCancel={cima}
        onClick={(e) => {
          if (e.target === e.currentTarget && estado.current.zoom === 1) fechar();
        }}
      >
        <img ref={foto} key={atual?.src} src={atual?.src} alt={atual?.alt || ""} draggable={false} className={zoom > 1 ? "com-zoom" : ""} />
      </div>

      <div className="ampliar-barra">
        <p className="ampliar-legenda">
          {total > 1 && (
            <span className="ampliar-contador">
              {i + 1} / {total}
            </span>
          )}
          {atual?.legenda}
        </p>
        <div className="ampliar-botoes">
          <button type="button" onClick={() => (zoom > 1 ? zerar() : ampliarEm(2))} aria-label={zoom > 1 ? "Tirar o zoom" : "Dar zoom"}>
            {zoom > 1 ? <MagnifyingGlassMinus size={22} aria-hidden="true" /> : <MagnifyingGlassPlus size={22} aria-hidden="true" />}
          </button>
          <button type="button" onClick={fechar} aria-label="Fechar" autoFocus>
            <X size={22} aria-hidden="true" />
          </button>
        </div>
      </div>

      {total > 1 && (
        <>
          <button type="button" className="ampliar-seta ampliar-ant" onClick={() => ir(-1)} aria-label="Foto anterior">
            <CaretLeft size={26} aria-hidden="true" />
          </button>
          <button type="button" className="ampliar-seta ampliar-prox" onClick={() => ir(1)} aria-label="Próxima foto">
            <CaretRight size={26} aria-hidden="true" />
          </button>
        </>
      )}
      <p className="ampliar-dica" aria-hidden="true">
        Duplo toque para zoom · arraste para baixo para fechar
      </p>
    </dialog>
  );
}
