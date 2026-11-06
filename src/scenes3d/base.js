// Base comum das cenas 3D do site (three.js): renderizador, câmera, ajuste de tamanho, giro livre
// arrastando com o mouse ou o dedo (OrbitControls, sem zoom para a roda do mouse continuar rolando a página), pausa fora da tela, "reduzir movimento" (uma imagem parada) e limpeza ao sair da página.
// Cada cena só descreve o que desenha e como anima: construir({ cena, camera, grupo, THREE }) devolve
// { animar(t), pose } — pose é o tempo usado para a imagem parada.
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { WebGLRenderer, Scene, PerspectiveCamera, Clock, Group, ACESFilmicToneMapping, PCFSoftShadowMap } from "three";

// Cores reais dos materiais (concreto, reboco, telha, madeira, vidro, sinalização)
export const REAL = {
  concreto: "#b8b4aa",
  reboco: "#efe7d6",
  telha: "#b4532a",
  madeira: "#7a4a2a",
  vidro: "#8fb9cc",
  esquadria: "#f4f4f2",
  grama: "#6b9a45",
  piso: "#d8d3c6",
  parede: "#f2f0ea",
  saida: "#14a04a",
  extintor: "#c8102e",
  amareloEpi: "#f2c200",
};

export const COR = {
  fundo: "#0c2e1c",
  verde: "#2f8a45",
  verdeClaro: "#3a9a52",
  lima: "#9be15d",
  limaClaro: "#d9ffb0",
  alerta: "#ff6b4a",
};

export function suportaWebGL() {
  const c = document.createElement("canvas");
  return !!(c.getContext("webgl2") || c.getContext("webgl"));
}

export function montarCena(el, { camera: cam = {}, sombras = false, construir }) {
  if (!suportaWebGL()) return null;
  const parado = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = ACESFilmicToneMapping;
  if (sombras) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
  }
  el.appendChild(renderer.domElement);

  const cena = new Scene();
  const camera = new PerspectiveCamera(cam.fov || 38, 1, 0.1, 60);
  camera.position.set(...(cam.pos || [0, -4.4, 3.4]));
  camera.up.set(...(cam.up || [0, 0, 1]));
  camera.lookAt(...(cam.alvo || [0, 0, 0]));
  const base = new Group();
  const grupo = new Group();
  base.add(grupo);
  cena.add(base);

  const { animar, pose = 3 } = construir({ cena, camera, grupo, renderer });

  const ajustar = () => {
    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (parado || !quadro) renderer.render(cena, camera);
  };

  // Giro livre: arrastar gira a câmera em volta da cena, para qualquer lado (de cima até uns 18° acima do chão).
  // Quem arrasta assume o controle: o giro automático da cena para e não volta.
  const controles = new OrbitControls(camera, renderer.domElement);
  controles.target.set(...(cam.alvo || [0, 0, 0]));
  controles.enableZoom = false;
  controles.enablePan = false;
  controles.enableDamping = !parado;
  controles.dampingFactor = 0.08;
  controles.rotateSpeed = 0.8;
  controles.minPolarAngle = 0.05;
  controles.maxPolarAngle = 1.25; // ~72°: nunca fica rente ao chão
  controles.update();
  let giroFixo = null;
  controles.addEventListener("start", () => {
    if (giroFixo === null) giroFixo = grupo.rotation.z;
    el.classList.add("scene-dragging");
  });
  controles.addEventListener("end", () => el.classList.remove("scene-dragging"));
  // Sem o laço rodando (imagem parada ou fora da tela), redesenha a cada movimento
  controles.addEventListener("change", () => {
    if (!quadro) renderer.render(cena, camera);
  });

  let visivel = false;
  let quadro = 0;
  const relogio = new Clock();
  const laco = () => {
    animar(relogio.getElapsedTime());
    if (giroFixo !== null) grupo.rotation.z = giroFixo;
    controles.update();
    renderer.render(cena, camera);
    quadro = visivel ? requestAnimationFrame(laco) : 0;
  };

  if (parado) animar(pose);
  ajustar();
  const ro = new ResizeObserver(ajustar);
  ro.observe(el);
  const io = new IntersectionObserver(([e]) => {
    visivel = e.isIntersecting;
    if (parado) {
      if (visivel) renderer.render(cena, camera);
      return;
    }
    if (visivel && !quadro) {
      quadro = requestAnimationFrame(laco);
    }
  });
  io.observe(el);
  el.classList.add("scene-ready");

  return () => {
    cancelAnimationFrame(quadro);
    io.disconnect();
    ro.disconnect();
    controles.dispose();
    cena.traverse((o) => {
      o.geometry?.dispose();
      const m = o.material;
      if (Array.isArray(m)) m.forEach((x) => x.dispose());
      else m?.dispose();
    });
    renderer.dispose();
    renderer.domElement.remove();
  };
}
