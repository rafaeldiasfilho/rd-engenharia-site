// Marca gigante do rodapé impressa em pontos de meio-tom (adaptado do "Halftone Wordmark Footer" do
// 21st.dev, prompt guardado no vault). Só a faixa da marca: o resto do rodapé continua no Layout.
// - Cada ponto tem o tamanho da parte da letra que cobre a sua célula; os pontos diminuem para baixo,
//   fazendo o degradê que antes era um gradiente no texto.
// - Com o mouse (ou o dedo) os pontos se afastam em molas e esquentam para o verde; um clique solta uma onda.
// - O canvas fica transparente (o fundo é o do rodapé), dorme quando tudo para e quando sai da tela.
// - Sem JavaScript ou antes de desenhar, aparece o texto antigo (fica no HTML do prerender).
// - "Reduzir movimento": desenho parado, sem resposta ao ponteiro.
import * as React from "react";

type Cor = [number, number, number, number];

export function hwCor(css: string): Cor | null {
  const s = (css || "").trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].split("").map((c) => c + c).join("") : hex[1];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i.exec(s);
  if (!rgb) return null;
  const a = rgb[4] === undefined ? 1 : rgb[4].endsWith("%") ? parseFloat(rgb[4]) / 100 : parseFloat(rgb[4]);
  return [+rgb[1], +rgb[2], +rgb[3], a];
}

// Raio proporcional à área: o tom fica uniforme.
export function hwRaio(cobertura: number, passo: number) {
  const c = cobertura < 0 ? 0 : cobertura > 1 ? 1 : cobertura;
  return Math.sqrt(c) * passo * 0.56;
}

// Um passo da mola de volta para casa, mais o empurrão do ponteiro em (px, py) dentro do raio r.
export function hwPasso(x: number, y: number, vx: number, vy: number, hx: number, hy: number, px: number, py: number, r: number) {
  const dx = x - px;
  const dy = y - py;
  const d2 = dx * dx + dy * dy;
  if (r > 0 && d2 < r * r) {
    const d = Math.sqrt(d2) + 0.001;
    const f = (1 - d / r) * 2.6;
    vx += (dx / d) * f;
    vy += (dy / d) * f;
  }
  vx = (vx + (hx - x) * 0.05) * 0.84;
  vy = (vy + (hy - y) * 0.05) * 0.84;
  return [x + vx, y + vy, vx, vy];
}

type Props = {
  palavra: string;
  className?: string;
  /** Distância entre os centros dos pontos, em px. */
  passo?: number;
  /** Alcance do ponteiro, em px. */
  raio?: number;
  /** Quanto da altura das maiúsculas fica abaixo da borda, 0 a 0,6. */
  corte?: number;
};

export function HalftoneWordmark({ palavra, className = "", passo = 6, raio = 80, corte = 0.18 }: Props) {
  const caixa = React.useRef<HTMLDivElement | null>(null);
  const tela = React.useRef<HTMLCanvasElement | null>(null);
  const [pronto, setPronto] = React.useState(false);

  React.useEffect(() => {
    const root = caixa.current;
    const canvas = tela.current;
    if (!root || !canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const estilo = getComputedStyle(root);
    const tinta = hwCor(estilo.getPropertyValue("--hw-tinta")) || [255, 255, 255, 0.2];
    const quente = hwCor(estilo.getPropertyValue("--hw-quente")) || [111, 211, 124, 1];
    const fonte = estilo.fontFamily || "sans-serif";
    const peso = estilo.fontWeight || "700";
    const corTinta = `rgba(${tinta[0]},${tinta[1]},${tinta[2]},${tinta[3]})`;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let px = -1e5;
    let py = -1e5;
    let raf = 0;
    let visivel = true;
    let acordado = true;
    let onda = { x: 0, y: 0, t: -1 };
    let pontos = new Float32Array(0); // x, y, vx, vy, hx, hy, r
    let total = 0;
    let vivo = true;

    const montar = () => {
      const ret = root.getBoundingClientRect();
      w = Math.max(1, Math.round(ret.width));
      h = Math.max(1, Math.round(ret.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      const mascara = document.createElement("canvas");
      mascara.width = w;
      mascara.height = h;
      const m = mascara.getContext("2d", { willReadFrequently: true });
      if (!m) return;
      // Mesmo espaçamento apertado do texto antigo (-0,04 em), onde o navegador suporta.
      const espaco = (tam: number) => {
        if ("letterSpacing" in m) m.letterSpacing = `${-0.04 * tam}px`;
      };
      m.font = `${peso} 100px ${fonte}`;
      espaco(100);
      const em100 = m.measureText(palavra);
      const c = Math.max(0, Math.min(0.6, corte));
      const pelaLargura = (Math.max(1, w - 32) / Math.max(1, em100.width)) * 100;
      const pelaAltura = (h * 0.94) / Math.max(0.01, ((em100.actualBoundingBoxAscent || 72) / 100) * (1 - c));
      const tamanho = Math.min(pelaLargura, pelaAltura);
      m.font = `${peso} ${tamanho}px ${fonte}`;
      espaco(tamanho);
      const medida = m.measureText(palavra);
      const cap = medida.actualBoundingBoxAscent || tamanho * 0.72;
      m.fillStyle = "#000";
      m.textBaseline = "alphabetic";
      m.fillText(palavra, (w - medida.width) / 2, h + cap * c);
      const img = m.getImageData(0, 0, w, h).data;

      const g = Math.max(3, passo);
      const cols = Math.ceil(w / g);
      const linhas = Math.ceil(h / g);
      const lista: number[] = [];
      for (let gy = 0; gy < linhas; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          let soma = 0;
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(w - 1, Math.floor(gx * g + ((sx + 0.5) * g) / 3));
              const y = Math.min(h - 1, Math.floor(gy * g + ((sy + 0.5) * g) / 3));
              soma += img[(y * w + x) * 4 + 3];
            }
          }
          const cob = soma / (9 * 255);
          if (cob < 0.06) continue;
          const hx = gx * g + g / 2;
          const hy = gy * g + g / 2;
          const desce = 1 - 0.6 * (hy / h); // pontos menores para baixo: o degradê do meio-tom
          lista.push(hx, hy, 0, 0, hx, hy, hwRaio(cob * desce, g));
        }
      }
      pontos = new Float32Array(lista);
      total = lista.length / 7;
      acordado = true;
    };

    const desenhar = (agora: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const r = reduz ? 0 : raio;
      const idade = onda.t < 0 ? 1e9 : agora - onda.t;
      const raioOnda = idade * 0.9;
      let mexendo = false;

      // Pontos em casa vão todos num só caminho; os deslocados são pintados um a um, já aquecidos.
      ctx.fillStyle = corTinta;
      ctx.beginPath();
      const quentes: number[] = [];
      for (let i = 0; i < total; i++) {
        const j = i * 7;
        let x = pontos[j];
        let y = pontos[j + 1];
        let vx = pontos[j + 2];
        let vy = pontos[j + 3];
        const hx = pontos[j + 4];
        const hy = pontos[j + 5];
        if (!reduz) {
          if (idade < 900) {
            const dx = hx - onda.x;
            const dy = hy - onda.y;
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
            const faixa = 1 - Math.min(1, Math.abs(d - raioOnda) / 26);
            if (faixa > 0) {
              const f = faixa * 3.2 * (1 - idade / 900);
              vx += (dx / d) * f;
              vy += (dy / d) * f;
            }
          }
          const s = hwPasso(x, y, vx, vy, hx, hy, px, py, r);
          [x, y, vx, vy] = s;
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) mexendo = true;
          else {
            x = hx;
            y = hy;
            vx = 0;
            vy = 0;
          }
          pontos[j] = x;
          pontos[j + 1] = y;
          pontos[j + 2] = vx;
          pontos[j + 3] = vy;
        }
        const k = Math.min(1, Math.hypot(x - hx, y - hy) / 28);
        if (k > 0.02) quentes.push(x, y, pontos[j + 6], k);
        else {
          ctx.moveTo(x + pontos[j + 6], y);
          ctx.arc(x, y, pontos[j + 6], 0, 6.2832);
        }
      }
      ctx.fill();
      for (let q = 0; q < quentes.length; q += 4) {
        const k = quentes[q + 3];
        const mix = (a: number, b: number) => Math.round(a + (b - a) * k);
        ctx.fillStyle = `rgba(${mix(tinta[0], quente[0])},${mix(tinta[1], quente[1])},${mix(tinta[2], quente[2])},${tinta[3] + (quente[3] - tinta[3]) * k})`;
        ctx.beginPath();
        ctx.arc(quentes[q], quentes[q + 1], quentes[q + 2], 0, 6.2832);
        ctx.fill();
      }
      acordado = mexendo || idade < 900 || px > -1e4;
    };

    const laco = (agora: number) => {
      raf = 0;
      if (!visivel) return;
      desenhar(agora);
      if (acordado) raf = requestAnimationFrame(laco);
    };
    const acordar = () => {
      acordado = true;
      if (!raf && visivel) raf = requestAnimationFrame(laco);
    };

    const local = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    };
    const mover = (e: PointerEvent) => {
      if (reduz) return;
      [px, py] = local(e);
      acordar();
    };
    const sair = () => {
      px = -1e5;
      py = -1e5;
      acordar();
    };
    const apertar = (e: PointerEvent) => {
      if (reduz) return;
      const [x, y] = local(e);
      onda = { x, y, t: performance.now() };
      acordar();
    };

    let ultimaLargura = 0;
    const comecar = () => {
      if (!vivo) return;
      montar();
      ultimaLargura = w;
      desenhar(performance.now());
      setPronto(true);
    };
    // Só monta perto da tela (a máscara lê pixels e percorre a grade inteira), fora do carregamento.
    // Espera também a IBM Plex Sans 700: medir com a fonte reserva desalinharia a palavra.
    const perto = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        perto.disconnect();
        const fontes = document.fonts;
        if (fontes && fontes.load) fontes.load(`${peso} 100px ${fonte}`).then(comecar, comecar);
        else comecar();
      },
      { rootMargin: "400px" },
    );
    perto.observe(root);

    root.addEventListener("pointermove", mover);
    root.addEventListener("pointerleave", sair);
    root.addEventListener("pointercancel", sair);
    root.addEventListener("pointerdown", apertar);
    const ro = new ResizeObserver(() => {
      if (!total || Math.round(root.getBoundingClientRect().width) === ultimaLargura) return;
      montar();
      ultimaLargura = w;
      acordar();
    });
    ro.observe(root);
    const io = new IntersectionObserver(([e]) => {
      visivel = e ? e.isIntersecting : true;
      if (visivel) acordar();
    });
    io.observe(root);

    return () => {
      vivo = false;
      perto.disconnect();
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      root.removeEventListener("pointermove", mover);
      root.removeEventListener("pointerleave", sair);
      root.removeEventListener("pointercancel", sair);
      root.removeEventListener("pointerdown", apertar);
    };
  }, [palavra, passo, raio, corte]);

  return (
    <div ref={caixa} className={`hw-marca ${pronto ? "pronto" : ""} ${className}`} aria-hidden="true">
      <canvas ref={tela} />
      <p className="hw-marca-texto">{palavra}</p>
    </div>
  );
}

export default HalftoneWordmark;
