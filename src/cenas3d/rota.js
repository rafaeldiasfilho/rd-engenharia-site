// Corpo de Bombeiros: planta de um pavimento em 3D com cores reais (piso de concreto claro, paredes brancas),
// rotas de fuga no verde fotoluminescente se acendendo até a saída, placa de SAÍDA verde, luzes de emergência
// e extintores vermelhos.
import {
  BoxGeometry, BufferAttribute, BufferGeometry, Color, CylinderGeometry, DirectionalLight, Group, HemisphereLight,
  Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, Points, PointsMaterial,
} from "three";
import { REAL, montarCena } from "./base";

const ALT = 0.32;
const ESP = 0.045;

const PAREDES = [
  [-1.6, 1.1, 1.6, 1.1], [-1.6, -1.1, 1.6, -1.1], [-1.6, -1.1, -1.6, 1.1],
  [1.6, -1.1, 1.6, -0.2], [1.6, 0.2, 1.6, 1.1],
  [-1.6, 0.25, -1.2, 0.25], [-0.95, 0.25, -0.1, 0.25], [0.15, 0.25, 1.0, 0.25], [1.25, 0.25, 1.6, 0.25],
  [-1.6, -0.25, -0.9, -0.25], [-0.65, -0.25, 0.6, -0.25], [0.85, -0.25, 1.6, -0.25],
  [-0.5, 0.25, -0.5, 1.1], [0.6, 0.25, 0.6, 1.1], [0, -1.1, 0, -0.25],
];

const ROTAS = [
  [[-1.05, 0.72], [-1.07, 0.25], [-1.07, 0], [1.85, 0]],
  [[-0.78, -0.7], [-0.78, -0.25], [-0.78, 0], [1.85, 0]],
  [[0.03, 0.72], [0.03, 0.25], [0.03, 0], [1.85, 0]],
  [[0.72, -0.7], [0.72, -0.25], [0.72, 0], [1.85, 0]],
  [[1.12, 0.72], [1.12, 0.25], [1.12, 0], [1.85, 0]],
];

function amostrar(rota, passo) {
  const pts = [];
  let acum = 0;
  for (let i = 0; i < rota.length - 1; i++) {
    const [x1, y1] = rota[i];
    const [x2, y2] = rota[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const n = Math.max(1, Math.round(len / passo));
    for (let k = 0; k < n; k++) {
      const f = k / n;
      pts.push({ x: x1 + (x2 - x1) * f, y: y1 + (y2 - y1) * f, d: acum + len * f });
    }
    acum += len;
  }
  return { pts, total: acum };
}

export function montar(el) {
  return montarCena(el, {
    sombras: true,
    camera: { pos: [0.3, -3.4, 3.7], alvo: [0, -0.05, 0] },
    construir: ({ cena, grupo }) => {
      cena.add(new HemisphereLight("#ffffff", "#8a8578", 1.2));
      const sol = new DirectionalLight("#ffffff", 1.8);
      sol.position.set(-2, -2.5, 5);
      sol.castShadow = true;
      sol.shadow.mapSize.set(1024, 1024);
      Object.assign(sol.shadow.camera, { left: -2.5, right: 2.5, top: 2.5, bottom: -2.5, near: 1, far: 12 });
      sol.shadow.bias = -0.0005;
      cena.add(sol);

      const piso = new Mesh(new PlaneGeometry(3.3, 2.3), new MeshStandardMaterial({ color: REAL.piso, roughness: 0.95 }));
      piso.receiveShadow = true;
      grupo.add(piso);
      const calcada = new Mesh(new PlaneGeometry(0.6, 1.0), new MeshStandardMaterial({ color: REAL.concreto, roughness: 1 }));
      calcada.position.set(1.95, 0, -0.002);
      grupo.add(calcada);

      const parede = new MeshStandardMaterial({ color: REAL.parede, roughness: 0.9 });
      PAREDES.forEach(([x1, y1, x2, y2]) => {
        const len = Math.hypot(x2 - x1, y2 - y1);
        const m = new Mesh(new BoxGeometry(len + ESP, ESP, ALT), parede);
        m.position.set((x1 + x2) / 2, (y1 + y2) / 2, ALT / 2);
        m.rotation.z = Math.atan2(y2 - y1, x2 - x1);
        m.castShadow = true;
        m.receiveShadow = true;
        grupo.add(m);
      });

      const amostras = ROTAS.map((r) => amostrar(r, 0.07));
      const todos = amostras.flatMap((a) => a.pts);
      const pos = new Float32Array(todos.length * 3);
      todos.forEach((p, i) => pos.set([p.x, p.y, 0.012], i * 3));
      const cores = new Float32Array(todos.length * 3);
      const geoP = new BufferGeometry();
      geoP.setAttribute("position", new BufferAttribute(pos, 3));
      geoP.setAttribute("color", new BufferAttribute(cores, 3));
      grupo.add(new Points(geoP, new PointsMaterial({ size: 0.11, vertexColors: true, toneMapped: false })));

      const placa = new Group();
      placa.add(new Mesh(new BoxGeometry(0.04, 0.34, 0.11), new MeshBasicMaterial({ color: REAL.saida, toneMapped: false })));
      placa.add(new Mesh(new BoxGeometry(0.045, 0.22, 0.025), new MeshBasicMaterial({ color: "#ffffff", toneMapped: false })));
      placa.position.set(1.6, 0, ALT + 0.07);
      grupo.add(placa);

      const luzMat = new MeshBasicMaterial({ color: "#fffbe8", transparent: true, toneMapped: false });
      [-1.3, -0.4, 0.45, 1.3].forEach((x) => {
        const l = new Mesh(new BoxGeometry(0.14, 0.03, 0.035), luzMat);
        l.position.set(x, 0.225, ALT - 0.05);
        grupo.add(l);
      });

      const vermelho = new MeshStandardMaterial({ color: REAL.extintor, roughness: 0.35 });
      const preto = new MeshStandardMaterial({ color: "#1d1d1d", roughness: 0.5 });
      [[-0.45, 0.2], [0.55, -0.2], [1.5, 0.3]].forEach(([x, y]) => {
        const g = new Group();
        const corpo = new Mesh(new CylinderGeometry(0.05, 0.05, 0.2, 16), vermelho);
        corpo.castShadow = true;
        const valvula = new Mesh(new CylinderGeometry(0.018, 0.018, 0.04, 10), preto);
        valvula.position.y = 0.12;
        g.add(corpo, valvula);
        g.rotation.x = Math.PI / 2;
        g.position.set(x, y, 0.11);
        grupo.add(g);
      });

      const apagado = new Color("#7d8a74");
      const aceso = new Color("#c6ff6b");
      const tmp = new Color();
      const VEL = 0.9;

      return {
        pose: 2.2,
        animar: (t) => {
          grupo.rotation.z = Math.sin(t * 0.25) * 0.18;
          let k = 0;
          amostras.forEach((a, r) => {
            const cabeca = ((t * VEL + r * 0.45) % (a.total + 1.2)) - 0.2;
            a.pts.forEach((p) => {
              const atras = cabeca - p.d;
              const brilho = atras < 0 ? 0 : Math.exp(-atras * 1.1);
              tmp.copy(apagado).lerp(aceso, Math.min(1, brilho * 1.2));
              cores.set([tmp.r, tmp.g, tmp.b], k * 3);
              k++;
            });
          });
          geoP.attributes.color.needsUpdate = true;
          luzMat.opacity = 0.7 + 0.3 * Math.sin(t * 2.5);
        },
      };
    },
  });
}
