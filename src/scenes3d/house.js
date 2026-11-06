// Civil Engineering: single-storey house that builds itself in stages (subfloor, walls, windows and door, roof),
// with real material colors and the sun's shadow on the grass. The cycle repeats.
import {
  BoxGeometry, BufferGeometry, CircleGeometry, DirectionalLight, DoubleSide, Float32BufferAttribute, Group,
  HemisphereLight, Mesh, MeshStandardMaterial,
} from "three";
import { REAL, montarCena } from "./base";

const L = 2.0; // length (x)
const W = 1.4; // width (y)
const H = 0.72; // wall height
const T = 0.07; // wall thickness
const ROOF_HEIGHT = 0.46;
const CYCLE = 12;

const smooth = (x) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};

function box(w, d, h, mat, x, y, z) {
  const m = new Mesh(new BoxGeometry(w, d, h), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function montar(el) {
  return montarCena(el, {
    shadows: true,
    camera: { pos: [3.7, -4.2, 2.9], target: [0, 0, 0.4] },
    build: ({ scene, group }) => {
      scene.add(new HemisphereLight("#e6f2ff", "#4f6b32", 1.1));
      const sun = new DirectionalLight("#fff4e0", 2.4);
      sun.position.set(-2.5, -3, 5);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 12 });
      sun.shadow.bias = -0.0005;
      scene.add(sun);

      const mat = (color, roughness = 0.85, extra = {}) => new MeshStandardMaterial({ color, roughness, ...extra });
      const concrete = mat(REAL.concreto, 0.95);
      const plaster = mat(REAL.reboco, 0.9);
      const tile = mat(REAL.telha, 0.7);
      const wood = mat(REAL.madeira, 0.6);
      const glass = mat(REAL.vidro, 0.15, { metalness: 0.2 });
      const frame = mat(REAL.esquadria, 0.5);

      const grass = new Mesh(new CircleGeometry(1.85, 64), mat(REAL.grama, 1));
      grass.receiveShadow = true;
      group.add(grass);
      // walkway to the door
      group.add(box(0.34, 0.9, 0.02, concrete, 0.35, -1.2, 0.01));

      // 1. subfloor
      const floor = box(L + 0.16, W + 0.16, 0.08, concrete, 0, 0, 0.04);
      group.add(floor);

      // 2. walls (grow from the bottom up)
      const walls = new Group();
      walls.add(
        box(L, T, H, plaster, 0, -W / 2 + T / 2, H / 2),
        box(L, T, H, plaster, 0, W / 2 - T / 2, H / 2),
        box(T, W - 2 * T, H, plaster, -L / 2 + T / 2, 0, H / 2),
        box(T, W - 2 * T, H, plaster, L / 2 - T / 2, 0, H / 2),
      );
      walls.position.z = 0.08;
      group.add(walls);

      // 3. windows and door (stand slightly proud of the wall)
      const openings = new Group();
      const makeWindow = (x, y, rot) => {
        const g = new Group();
        g.add(box(0.4, 0.02, 0.32, frame, 0, 0, 0));
        g.add(box(0.34, 0.025, 0.26, glass, 0, 0, 0));
        g.add(box(0.02, 0.03, 0.26, frame, 0, 0, 0));
        g.position.set(x, y, 0.08 + 0.46);
        g.rotation.z = rot;
        return g;
      };
      const front = -W / 2 - 0.005;
      openings.add(makeWindow(-0.5, front, 0), makeWindow(0.75, front, 0), makeWindow(-0.3, -front, 0), makeWindow(0.4, -front, 0));
      openings.add(makeWindow(-L / 2 - 0.005, 0, Math.PI / 2), makeWindow(L / 2 + 0.005, 0, Math.PI / 2));
      const door = new Group();
      door.add(box(0.32, 0.02, 0.56, frame, 0, 0, 0));
      door.add(box(0.27, 0.03, 0.52, wood, 0, 0, -0.02));
      door.position.set(0.35, front, 0.08 + 0.28);
      openings.add(door);
      group.add(openings);

      // 4. gable roof with eaves, and the plastered gable ends
      const roof = new Group();
      const half = W / 2 + 0.18;
      const pitch = Math.atan2(ROOF_HEIGHT, W / 2);
      const len = Math.hypot(half, ROOF_HEIGHT * (half / (W / 2)));
      [-1, 1].forEach((side) => {
        const slope = box(L + 0.3, len, 0.05, tile, 0, (side * len * Math.cos(pitch)) / 2, 0);
        slope.rotation.x = -side * pitch;
        slope.position.z = ROOF_HEIGHT - (len * Math.sin(pitch)) / 2 + 0.03;
        roof.add(slope);
      });
      const tri = new BufferGeometry();
      const v = [];
      [-L / 2 + 0.005, L / 2 - 0.005].forEach((x) => v.push(x, -W / 2, 0, x, W / 2, 0, x, 0, ROOF_HEIGHT));
      tri.setAttribute("position", new Float32BufferAttribute(v, 3));
      tri.computeVertexNormals();
      const gables = new Mesh(tri, new MeshStandardMaterial({ color: REAL.reboco, roughness: 0.9, side: DoubleSide }));
      gables.castShadow = true;
      roof.add(gables);
      const ridge = box(L + 0.3, 0.08, 0.06, tile, 0, 0, ROOF_HEIGHT + 0.03);
      ridge.rotation.x = Math.PI / 4;
      roof.add(ridge);
      const roofZ = 0.08 + H;
      group.add(roof);

      return {
        pose: CYCLE * 0.75,
        animate: (t) => {
          group.rotation.z = -0.35 + Math.sin(t * 0.18) * 0.45;
          const c = (t % CYCLE) / CYCLE;
          // construction progress: rises to 1 over 65% of the cycle, stays finished, then dismantles quickly at the end
          const s = c < 0.65 ? c / 0.65 : c < 0.92 ? 1 : 1 - (c - 0.92) / 0.08;
          const fFloor = smooth(s / 0.1);
          const fWall = smooth((s - 0.1) / 0.4);
          const fOpen = smooth((s - 0.5) / 0.15);
          const fRoof = smooth((s - 0.65) / 0.35);
          floor.scale.z = Math.max(0.01, fFloor);
          floor.position.z = 0.04 * fFloor;
          walls.scale.z = Math.max(0.001, fWall);
          walls.visible = fWall > 0.001;
          openings.visible = fOpen > 0.01;
          openings.children.forEach((a) => a.scale.setScalar(Math.max(0.01, fOpen)));
          roof.visible = fRoof > 0.001;
          roof.position.z = roofZ + (1 - fRoof) * 0.7;
        },
      };
    },
  });
}
