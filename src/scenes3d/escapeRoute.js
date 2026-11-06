// Fire Department: 3D floor plan of one storey with real colors (light concrete floor, white walls),
// escape routes in photoluminescent green lighting up toward the exit, a green EXIT sign, emergency lights
// and red fire extinguishers.
import {
  BoxGeometry, BufferAttribute, BufferGeometry, Color, CylinderGeometry, DirectionalLight, Group, HemisphereLight,
  Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, Points, PointsMaterial,
} from "three";
import { REAL, montarCena } from "./base";

const HEIGHT = 0.32;
const THICK = 0.045;

const WALLS = [
  [-1.6, 1.1, 1.6, 1.1], [-1.6, -1.1, 1.6, -1.1], [-1.6, -1.1, -1.6, 1.1],
  [1.6, -1.1, 1.6, -0.2], [1.6, 0.2, 1.6, 1.1],
  [-1.6, 0.25, -1.2, 0.25], [-0.95, 0.25, -0.1, 0.25], [0.15, 0.25, 1.0, 0.25], [1.25, 0.25, 1.6, 0.25],
  [-1.6, -0.25, -0.9, -0.25], [-0.65, -0.25, 0.6, -0.25], [0.85, -0.25, 1.6, -0.25],
  [-0.5, 0.25, -0.5, 1.1], [0.6, 0.25, 0.6, 1.1], [0, -1.1, 0, -0.25],
];

const ROUTES = [
  [[-1.05, 0.72], [-1.07, 0.25], [-1.07, 0], [1.85, 0]],
  [[-0.78, -0.7], [-0.78, -0.25], [-0.78, 0], [1.85, 0]],
  [[0.03, 0.72], [0.03, 0.25], [0.03, 0], [1.85, 0]],
  [[0.72, -0.7], [0.72, -0.25], [0.72, 0], [1.85, 0]],
  [[1.12, 0.72], [1.12, 0.25], [1.12, 0], [1.85, 0]],
];

function sample(route, step) {
  const pts = [];
  let acc = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const [x1, y1] = route[i];
    const [x2, y2] = route[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const n = Math.max(1, Math.round(len / step));
    for (let k = 0; k < n; k++) {
      const f = k / n;
      pts.push({ x: x1 + (x2 - x1) * f, y: y1 + (y2 - y1) * f, d: acc + len * f });
    }
    acc += len;
  }
  return { pts, total: acc };
}

export function montar(el) {
  return montarCena(el, {
    shadows: true,
    camera: { pos: [0.3, -3.4, 3.7], target: [0, -0.05, 0] },
    build: ({ scene, group }) => {
      scene.add(new HemisphereLight("#ffffff", "#8a8578", 1.2));
      const sun = new DirectionalLight("#ffffff", 1.8);
      sun.position.set(-2, -2.5, 5);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      Object.assign(sun.shadow.camera, { left: -2.5, right: 2.5, top: 2.5, bottom: -2.5, near: 1, far: 12 });
      sun.shadow.bias = -0.0005;
      scene.add(sun);

      const floor = new Mesh(new PlaneGeometry(3.3, 2.3), new MeshStandardMaterial({ color: REAL.piso, roughness: 0.95 }));
      floor.receiveShadow = true;
      group.add(floor);
      const sidewalk = new Mesh(new PlaneGeometry(0.6, 1.0), new MeshStandardMaterial({ color: REAL.concreto, roughness: 1 }));
      sidewalk.position.set(1.95, 0, -0.002);
      group.add(sidewalk);

      const wall = new MeshStandardMaterial({ color: REAL.parede, roughness: 0.9 });
      WALLS.forEach(([x1, y1, x2, y2]) => {
        const len = Math.hypot(x2 - x1, y2 - y1);
        const m = new Mesh(new BoxGeometry(len + THICK, THICK, HEIGHT), wall);
        m.position.set((x1 + x2) / 2, (y1 + y2) / 2, HEIGHT / 2);
        m.rotation.z = Math.atan2(y2 - y1, x2 - x1);
        m.castShadow = true;
        m.receiveShadow = true;
        group.add(m);
      });

      const samples = ROUTES.map((r) => sample(r, 0.07));
      const all = samples.flatMap((a) => a.pts);
      const pos = new Float32Array(all.length * 3);
      all.forEach((p, i) => pos.set([p.x, p.y, 0.012], i * 3));
      const colors = new Float32Array(all.length * 3);
      const geoP = new BufferGeometry();
      geoP.setAttribute("position", new BufferAttribute(pos, 3));
      geoP.setAttribute("color", new BufferAttribute(colors, 3));
      group.add(new Points(geoP, new PointsMaterial({ size: 0.11, vertexColors: true, toneMapped: false })));

      const sign = new Group();
      sign.add(new Mesh(new BoxGeometry(0.04, 0.34, 0.11), new MeshBasicMaterial({ color: REAL.saida, toneMapped: false })));
      sign.add(new Mesh(new BoxGeometry(0.045, 0.22, 0.025), new MeshBasicMaterial({ color: "#ffffff", toneMapped: false })));
      sign.position.set(1.6, 0, HEIGHT + 0.07);
      group.add(sign);

      const lightMat = new MeshBasicMaterial({ color: "#fffbe8", transparent: true, toneMapped: false });
      [-1.3, -0.4, 0.45, 1.3].forEach((x) => {
        const l = new Mesh(new BoxGeometry(0.14, 0.03, 0.035), lightMat);
        l.position.set(x, 0.225, HEIGHT - 0.05);
        group.add(l);
      });

      const red = new MeshStandardMaterial({ color: REAL.extintor, roughness: 0.35 });
      const black = new MeshStandardMaterial({ color: "#1d1d1d", roughness: 0.5 });
      [[-0.45, 0.2], [0.55, -0.2], [1.5, 0.3]].forEach(([x, y]) => {
        const g = new Group();
        const body = new Mesh(new CylinderGeometry(0.05, 0.05, 0.2, 16), red);
        body.castShadow = true;
        const valve = new Mesh(new CylinderGeometry(0.018, 0.018, 0.04, 10), black);
        valve.position.y = 0.12;
        g.add(body, valve);
        g.rotation.x = Math.PI / 2;
        g.position.set(x, y, 0.11);
        group.add(g);
      });

      const unlit = new Color("#7d8a74");
      const lit = new Color("#c6ff6b");
      const tmp = new Color();
      const SPEED = 0.9;

      return {
        pose: 2.2,
        animate: (t) => {
          group.rotation.z = Math.sin(t * 0.25) * 0.18;
          let k = 0;
          samples.forEach((a, r) => {
            const head = ((t * SPEED + r * 0.45) % (a.total + 1.2)) - 0.2;
            a.pts.forEach((p) => {
              const behind = head - p.d;
              const glow = behind < 0 ? 0 : Math.exp(-behind * 1.1);
              tmp.copy(unlit).lerp(lit, Math.min(1, glow * 1.2));
              colors.set([tmp.r, tmp.g, tmp.b], k * 3);
              k++;
            });
          });
          geoP.attributes.color.needsUpdate = true;
          lightMat.opacity = 0.7 + 0.3 * Math.sin(t * 2.5);
        },
      };
    },
  });
}
