// Segurança do Trabalho: capacete de segurança amarelo (cor real de EPI) girando devagar sobre uma bancada,
// com aba frontal, nervura no casco, carneira (suspensão) por dentro e sombra suave.
import {
  CylinderGeometry, DirectionalLight, DoubleSide, Group, HemisphereLight, LatheGeometry, Mesh, MeshStandardMaterial,
  PlaneGeometry, ShadowMaterial, TorusGeometry, Vector2,
} from "three";
import { REAL, montarCena } from "./base";

function perfil() {
  const p = [new Vector2(0.95, 0.02), new Vector2(0.96, 0.06), new Vector2(0.84, 0.1)];
  for (let i = 0; i <= 28; i++) {
    const a = (i / 28) * (Math.PI / 2);
    p.push(new Vector2(0.82 * Math.cos(a), 0.1 + 0.86 * Math.pow(Math.sin(a), 0.85)));
  }
  return p;
}

export function montar(el) {
  return montarCena(el, {
    sombras: true,
    camera: { pos: [0, -3.6, 2.0], alvo: [0, 0, 0.42] },
    construir: ({ cena, grupo }) => {
      cena.add(new HemisphereLight("#f4f8ff", "#3a4a2a", 1.0));
      const sol = new DirectionalLight("#fff6e6", 2.6);
      sol.position.set(-2, -2.5, 5);
      sol.castShadow = true;
      sol.shadow.mapSize.set(1024, 1024);
      Object.assign(sol.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 1, far: 12 });
      cena.add(sol);
      const contra = new DirectionalLight("#cfe6ff", 0.8);
      contra.position.set(2, 3, 2);
      cena.add(contra);

      const chao = new Mesh(new PlaneGeometry(6, 6), new ShadowMaterial({ opacity: 0.35 }));
      chao.receiveShadow = true;
      grupo.add(chao);

      const plastico = new MeshStandardMaterial({ color: REAL.amareloEpi, roughness: 0.32, metalness: 0, side: DoubleSide });
      const capacete = new Group();
      const casco = new Mesh(new LatheGeometry(perfil(), 72), plastico);
      casco.castShadow = true;
      capacete.add(casco);
      const aba = new Mesh(new CylinderGeometry(1.32, 1.32, 0.035, 56, 1, false, -0.85, 1.7), plastico);
      aba.position.y = 0.06;
      aba.rotation.x = 0.08;
      aba.castShadow = true;
      capacete.add(aba);
      const nerv = new Mesh(new TorusGeometry(0.86, 0.04, 12, 72, Math.PI), plastico);
      nerv.rotation.y = Math.PI / 2;
      nerv.position.y = 0.1;
      nerv.scale.set(1, 1.02, 0.95);
      capacete.add(nerv);
      // carneira: fita escura por dentro do casco
      const carneira = new Mesh(
        new TorusGeometry(0.74, 0.025, 8, 64),
        new MeshStandardMaterial({ color: "#2b2b2b", roughness: 0.8 }),
      );
      carneira.rotation.x = Math.PI / 2;
      carneira.position.y = 0.22;
      capacete.add(carneira);
      capacete.rotation.x = Math.PI / 2; // o torno gira em Y; a cena usa Z para cima
      capacete.scale.setScalar(0.85);
      capacete.position.z = 0.02;
      grupo.add(capacete);

      return {
        pose: 1.4,
        animar: (t) => {
          capacete.rotation.y = t * 0.45;
          capacete.position.z = 0.03 + 0.03 * Math.sin(t * 1.3);
        },
      };
    },
  });
}
