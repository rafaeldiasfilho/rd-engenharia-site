import { useEffect, useRef, useState } from "react";

const reduzMovimento = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Troca de item por arrasto (dedo ou mouse) e, se pedido, alternância automática.
// O bloco acompanha o gesto, sai para um lado e o próximo entra pelo outro.
// A alternância automática pausa com o mouse em cima, com o foco dentro, depois de um gesto,
// quando o bloco sai da tela ou a aba fica em segundo plano, e não roda com "reduzir movimento".
export function useDeslizar(total, { auto = 0 } = {}) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [trocou, setTrocou] = useState(false);
  const [rodando, setRodando] = useState(auto > 0);
  const bloco = useRef(null);
  const toque = useRef({ ativo: false, mov: false, x: 0, y: 0, dx: 0, id: null });
  const ocupado = useRef(false);
  const emCima = useRef(false);
  const ultimaAcao = useRef(0);

  const trocar = (d) => {
    if (total < 2 || ocupado.current) return;
    ocupado.current = true;
    const el = bloco.current;
    const concluir = () => {
      setDir(d);
      setTrocou(true);
      setI((n) => (n + d + total) % total);
      ocupado.current = false;
    };
    if (!el || reduzMovimento()) {
      concluir();
      return;
    }
    el.style.transition = "transform .22s ease-in, opacity .22s ease-in";
    el.style.transform = `translateX(${-d * 40}%)`;
    el.style.opacity = "0";
    setTimeout(concluir, 220);
  };

  // Troca pedida pela pessoa (seta, ponto ou gesto): a alternância automática para.
  const manual = (d) => {
    setRodando(false);
    trocar(d);
  };
  const irPara = (alvo) => {
    if (alvo === i) return;
    setRodando(false);
    trocar(alvo > i ? 1 : -1);
    // com mais de dois itens, avança passo a passo até o alvo
    if (Math.abs(alvo - i) > 1 && total > 2) {
      setTimeout(() => setI(alvo), 220);
    }
  };

  const encaixar = () => {
    const el = bloco.current;
    if (!el) return;
    el.style.transition = "transform .25s cubic-bezier(.2,.7,.2,1), opacity .25s";
    el.style.transform = "";
    el.style.opacity = "";
  };

  const aoApertar = (e) => {
    ultimaAcao.current = Date.now();
    if (total < 2 || ocupado.current || (e.pointerType === "mouse" && e.button !== 0)) return;
    toque.current = { ativo: true, mov: false, x: e.clientX, y: e.clientY, dx: 0, id: e.pointerId };
  };
  const aoMover = (e) => {
    const t = toque.current;
    if (!t.ativo || e.pointerId !== t.id) return;
    const dx = e.clientX - t.x;
    const dy = e.clientY - t.y;
    if (!t.mov) {
      if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      t.mov = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* sem captura, o arrasto segue funcionando dentro do bloco */
      }
    }
    t.dx = dx;
    const el = bloco.current;
    if (el) {
      el.style.transition = "none";
      el.style.transform = `translateX(${dx}px)`;
      el.style.opacity = String(Math.max(0.25, 1 - Math.abs(dx) / (el.offsetWidth * 1.1)));
    }
  };
  const aoSoltar = (e) => {
    const t = toque.current;
    if (!t.ativo || e.pointerId !== t.id) return;
    t.ativo = false;
    ultimaAcao.current = Date.now();
    if (!t.mov) return;
    const largura = bloco.current ? bloco.current.offsetWidth : 600;
    if (Math.abs(t.dx) > Math.min(110, largura * 0.2)) manual(t.dx < 0 ? 1 : -1);
    else encaixar();
    setTimeout(() => {
      toque.current.mov = false;
    }, 0);
  };
  const aoCancelar = () => {
    const t = toque.current;
    if (!t.ativo) return;
    t.ativo = false;
    if (t.mov) encaixar();
    t.mov = false;
  };
  // Depois de arrastar, o clique não deve abrir a imagem ampliada.
  const aoClicarCaptura = (e) => {
    if (toque.current.mov) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  useEffect(() => {
    if (!auto || !rodando || total < 2 || reduzMovimento()) return undefined;
    const id = setInterval(() => {
      if (document.hidden || emCima.current || ocupado.current) return;
      if (Date.now() - ultimaAcao.current < 8000) return;
      const el = bloco.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const visivel = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
        if (visivel < Math.min(r.height, window.innerHeight) * 0.5) return;
      }
      trocar(1);
    }, auto);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, rodando, total]);

  const pausarAoPassar = {
    onMouseEnter: () => {
      emCima.current = true;
    },
    onMouseLeave: () => {
      emCima.current = false;
    },
    onFocus: () => {
      emCima.current = true;
    },
    onBlur: () => {
      emCima.current = false;
    },
  };

  return {
    i,
    dir,
    trocou,
    rodando,
    alternar: () => setRodando((r) => !r),
    bloco,
    manual,
    irPara,
    pausarAoPassar,
    gesto: {
      onPointerDown: aoApertar,
      onPointerMove: aoMover,
      onPointerUp: aoSoltar,
      onPointerCancel: aoCancelar,
      onClickCapture: aoClicarCaptura,
    },
  };
}
