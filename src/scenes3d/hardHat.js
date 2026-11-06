// Occupational Safety: yellow hard hat (real PPE color) slowly turning over a workbench,
// with front brim, ridge on the shell, suspension harness inside and soft shadow.
import {
  CylinderGeometry, DirectionalLight, DoubleSide, Group, HemisphereLight, LatheGeometry, Mesh, MeshStandardMaterial,
  PlaneGeometry, ShadowMaterial, TorusGeometry, Vector2,
} from "three";
import { REAL_COLORS, mountScene } from "./base";

function profile() {
  const p = [new Vector2(0.95, 0.02), new Vector2(0.96, 0.06), new Vector2(0.84, 0.1)];
  for (let i = 0; i <= 28; i++) {
    const a = (i / 28) * (Math.PI / 2);
    p.push(new Vector2(0.82 * Math.cos(a), 0.1 + 0.86 * Math.pow(Math.sin(a), 0.85)));
  }
  return p;
}

export function mount(el) {
  return mountScene(el, {
    shadows: true,
    camera: { pos: [0, -3.6, 2.0], target: [0, 0, 0.42] },
    build: ({ scene, group }) => {
      scene.add(new HemisphereLight("#f4f8ff", "#3a4a2a", 1.0));
      const sun = new DirectionalLight("#fff6e6", 2.6);
      sun.position.set(-2, -2.5, 5);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      Object.assign(sun.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 1, far: 12 });
      scene.add(sun);
      const backLight = new DirectionalLight("#cfe6ff", 0.8);
      backLight.position.set(2, 3, 2);
      scene.add(backLight);

      const ground = new Mesh(new PlaneGeometry(6, 6), new ShadowMaterial({ opacity: 0.35 }));
      ground.receiveShadow = true;
      group.add(ground);

      const plastic = new MeshStandardMaterial({ color: REAL_COLORS.ppeYellow, roughness: 0.32, metalness: 0, side: DoubleSide });
      const helmet = new Group();
      const shell = new Mesh(new LatheGeometry(profile(), 72), plastic);
      shell.castShadow = true;
      helmet.add(shell);
      const brim = new Mesh(new CylinderGeometry(1.32, 1.32, 0.035, 56, 1, false, -0.85, 1.7), plastic);
      brim.position.y = 0.06;
      brim.rotation.x = 0.08;
      brim.castShadow = true;
      helmet.add(brim);
      const rib = new Mesh(new TorusGeometry(0.86, 0.04, 12, 72, Math.PI), plastic);
      rib.rotation.y = Math.PI / 2;
      rib.position.y = 0.1;
      rib.scale.set(1, 1.02, 0.95);
      helmet.add(rib);
      // suspension harness: dark band inside the shell
      const harness = new Mesh(
        new TorusGeometry(0.74, 0.025, 8, 64),
        new MeshStandardMaterial({ color: "#2b2b2b", roughness: 0.8 }),
      );
      harness.rotation.x = Math.PI / 2;
      harness.position.y = 0.22;
      helmet.add(harness);
      helmet.rotation.x = Math.PI / 2; // the lathe revolves around Y; the scene uses Z up
      helmet.scale.setScalar(0.85);
      helmet.position.z = 0.02;
      group.add(helmet);

      return {
        pose: 1.4,
        animate: (t) => {
          helmet.rotation.y = t * 0.45;
          helmet.position.z = 0.03 + 0.03 * Math.sin(t * 1.3);
        },
      };
    },
  });
}
