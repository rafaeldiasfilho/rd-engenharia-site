import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * TopoField — fundo animado com curvas de nível (linhas topográficas) e uma grade fina de 48 px,
 * desenhado por um shader WebGL a partir de ruído simplex 2D que deriva devagar.
 *
 * Origem: TopoField de MengTo/threeui (licença MIT), recebido via 21st.dev. O original carregava uma
 * página inteira (Tailwind por CDN, GSAP, Iconify e uma landing page de exemplo) dentro de um iframe;
 * aqui ficou só o shader, num <canvas> comum, sem dependências e sem baixar nada de fora.
 *
 * Adaptações ao site:
 * - A cor das linhas é a cor de texto (CSS `color`) do próprio canvas, então segue o tema claro e
 *   escuro pelo CSS do site. O fundo é transparente: aparece o fundo da seção.
 * - Só anima com o canvas à vista e a aba visível; com "reduzir movimento" desenha um quadro parado.
 * - Desenha em resolução 1x (as linhas são finas e suaves; 2x custava 4 vezes mais GPU) e a no máximo
 *   30 quadros por segundo, porque a deriva é lenta.
 */

const MAX_DPR = 1;
const FRAME_MS = 1000 / 30;

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_dpr;
uniform float u_scale;
uniform float u_bands;
uniform float u_grid;
uniform float u_line;
uniform vec3 u_color;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox; m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_res.xy;
  st.x *= u_res.x / u_res.y;

  // grade de 1 pixel físico a cada 48 px
  float gridSize = 48.0 * u_dpr;
  vec2 gf = fract(gl_FragCoord.xy / gridSize);
  float th = 1.0 / gridSize;
  float grid = clamp(step(1.0 - th, gf.x) + step(1.0 - th, gf.y), 0.0, 1.0) * u_grid;

  // curvas de nível: faixas do ruído, só a crista de cada faixa vira linha
  vec2 np = st * u_scale + vec2(u_time * 0.015, u_time * 0.025);
  float n = snoise(np) * 0.5 + 0.5;
  float tri = abs(fract(n * u_bands) - 0.5) * 2.0;
  float topo = (1.0 - smoothstep(0.0, 0.025, tri)) * u_line;

  float a = clamp(grid + topo, 0.0, 1.0);
  gl_FragColor = vec4(u_color * a, a);
}`;

export type TopoFieldProps = Omit<React.ComponentProps<"canvas">, "children"> & {
  /** Velocidade da deriva. 0 deixa parado. @default 1 */
  speed?: number;
  /** Estica (maior) ou aperta (menor) o relevo. @default 1 */
  length?: number;
  /** Multiplica o número de curvas de nível. @default 1 */
  density?: number;
  /** Intensidade da grade, de 0 a 1. @default 0.12 */
  grid?: number;
  /** Intensidade das curvas de nível, de 0 a 1. @default 0.45 */
  lines?: number;
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// "rgb(31, 107, 42)", "rgba(...)" ou "color(srgb 0.12 0.42 0.16)" -> [r, g, b] entre 0 e 1.
function rgb(css: string): [number, number, number] {
  const n = (css.match(/[\d.]+/g) || []).map(Number);
  if (n.length < 3) return [0, 0, 0];
  return css.startsWith("color(") ? [n[0], n[1], n[2]] : [n[0] / 255, n[1] / 255, n[2] / 255];
}

export function TopoField({
  speed = 1,
  length = 1,
  density = 1,
  grid = 0.12,
  lines = 0.45,
  className,
  ...props
}: TopoFieldProps) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const knobs = React.useRef({ speed, length, density, grid, lines });
  knobs.current = { speed, length, density, grid, lines };

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
    if (!gl) return undefined;

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = shader(gl.VERTEX_SHADER, VERT);
    const fs = shader(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return undefined;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return undefined;
    gl.useProgram(prog);

    // um triângulo que cobre a tela toda
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const U = {
      res: u("u_res"), time: u("u_time"), dpr: u("u_dpr"), scale: u("u_scale"), bands: u("u_bands"),
      grid: u("u_grid"), line: u("u_line"), color: u("u_color"),
    };

    let color: [number, number, number] = [0, 0, 0];
    let dpr = 1;
    let time = 0;
    let last = 0;
    let lastDraw = 0;
    let raf = 0;
    let visible = false;
    let lost = false;
    const mqReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const mqDark = window.matchMedia?.("(prefers-color-scheme: dark)");
    let reduce = !!mqReduce?.matches;

    const draw = () => {
      if (lost) return;
      const k = knobs.current;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform1f(U.time, time);
      gl.uniform1f(U.dpr, dpr);
      gl.uniform1f(U.scale, 1.4 * clamp(k.length, 0.35, 2.5));
      gl.uniform1f(U.bands, 10 * clamp(k.density, 0.25, 2.5));
      gl.uniform1f(U.grid, clamp(k.grid, 0, 1));
      gl.uniform1f(U.line, clamp(k.lines, 0, 1));
      gl.uniform3f(U.color, color[0], color[1], color[2]);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const tick = (now: number) => {
      time += Math.min((now - last) / 1000, 1 / 20) * clamp(knobs.current.speed, 0, 3);
      last = now;
      if (now - lastDraw >= FRAME_MS - 1) {
        lastDraw = now;
        draw();
      }
      raf = requestAnimationFrame(tick);
    };

    const run = () => {
      const go = visible && !reduce && !lost && !document.hidden;
      if (go && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (!go && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      draw();
    };

    // O tema troca as variáveis CSS; lê a cor no quadro seguinte, já com o estilo novo aplicado.
    const readColor = () =>
      requestAnimationFrame(() => {
        color = rgb(getComputedStyle(canvas).color);
        draw();
      });

    const onReduce = () => {
      reduce = !!mqReduce?.matches;
      run();
      draw();
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      run();
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        run();
      },
      { rootMargin: "100px" },
    );
    const ro = new ResizeObserver(resize);
    const mo = new MutationObserver(readColor);
    io.observe(canvas);
    ro.observe(canvas);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
    mqDark?.addEventListener?.("change", readColor);
    mqReduce?.addEventListener?.("change", onReduce);
    document.addEventListener("visibilitychange", run);
    canvas.addEventListener("webglcontextlost", onLost);

    color = rgb(getComputedStyle(canvas).color);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      mqDark?.removeEventListener?.("change", readColor);
      mqReduce?.removeEventListener?.("change", onReduce);
      document.removeEventListener("visibilitychange", run);
      canvas.removeEventListener("webglcontextlost", onLost);
    };
  }, []);

  // Props novas valem a partir do próximo quadro (ou do próximo redimensionamento, se estiver parado).
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none block h-full w-full", className)}
      {...props}
    />
  );
}

export default TopoField;
