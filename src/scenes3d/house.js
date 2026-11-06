// Engenharia Civil: casa térrea que se constrói por etapas (contrapiso, paredes, janelas e porta, telhado),
// com cores reais dos materiais e sombra do sol na grama. O ciclo se repete.
import {
  BoxGeometry, BufferGeometry, CircleGeometry, DirectionalLight, DoubleSide, Float32BufferAttribute, Group,
  HemisphereLight, Mesh, MeshStandardMaterial,
} from "three";
import { REAL, montarCena } from "./base";

const C = 2.0; // comprimento (x)
const LG = 1.4; // largura (y)
const H = 0.72; // altura das paredes
const E = 0.07; // espessura das paredes
const ALT_TELHADO = 0.46;
const CICLO = 12;

const suave = (x) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};

function caixa(w, d, h, mat, x, y, z) {
  const m = new Mesh(new BoxGeometry(w, d, h), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function montar(el) {
  return montarCena(el, {
    sombras: true,
    camera: { pos: [3.7, -4.2, 2.9], alvo: [0, 0, 0.4] },
    construir: ({ cena, grupo }) => {
      cena.add(new HemisphereLight("#e6f2ff", "#4f6b32", 1.1));
      const sol = new DirectionalLight("#fff4e0", 2.4);
      sol.position.set(-2.5, -3, 5);
      sol.castShadow = true;
      sol.shadow.mapSize.set(1024, 1024);
      Object.assign(sol.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 12 });
      sol.shadow.bias = -0.0005;
      cena.add(sol);

      const mat = (cor, rugosidade = 0.85, extra = {}) => new MeshStandardMaterial({ color: cor, roughness: rugosidade, ...extra });
      const concreto = mat(REAL.concreto, 0.95);
      const reboco = mat(REAL.reboco, 0.9);
      const telha = mat(REAL.telha, 0.7);
      const madeira = mat(REAL.madeira, 0.6);
      const vidro = mat(REAL.vidro, 0.15, { metalness: 0.2 });
      const esquadria = mat(REAL.esquadria, 0.5);

      const grama = new Mesh(new CircleGeometry(1.85, 64), mat(REAL.grama, 1));
      grama.receiveShadow = true;
      grupo.add(grama);
      // calçada até a porta
      grupo.add(caixa(0.34, 0.9, 0.02, concreto, 0.35, -1.2, 0.01));

      // 1. contrapiso
      const piso = caixa(C + 0.16, LG + 0.16, 0.08, concreto, 0, 0, 0.04);
      grupo.add(piso);

      // 2. paredes (crescem de baixo para cima)
      const paredes = new Group();
      paredes.add(
        caixa(C, E, H, reboco, 0, -LG / 2 + E / 2, H / 2),
        caixa(C, E, H, reboco, 0, LG / 2 - E / 2, H / 2),
        caixa(E, LG - 2 * E, H, reboco, -C / 2 + E / 2, 0, H / 2),
        caixa(E, LG - 2 * E, H, reboco, C / 2 - E / 2, 0, H / 2),
      );
      paredes.position.z = 0.08;
      grupo.add(paredes);

      // 3. janelas e porta (saltam um pouco da parede)
      const aberturas = new Group();
      const janela = (x, y, rot) => {
        const g = new Group();
        g.add(caixa(0.4, 0.02, 0.32, esquadria, 0, 0, 0));
        g.add(caixa(0.34, 0.025, 0.26, vidro, 0, 0, 0));
        g.add(caixa(0.02, 0.03, 0.26, esquadria, 0, 0, 0));
        g.position.set(x, y, 0.08 + 0.46);
        g.rotation.z = rot;
        return g;
      };
      const frente = -LG / 2 - 0.005;
      aberturas.add(janela(-0.5, frente, 0), janela(0.75, frente, 0), janela(-0.3, -frente, 0), janela(0.4, -frente, 0));
      aberturas.add(janela(-C / 2 - 0.005, 0, Math.PI / 2), janela(C / 2 + 0.005, 0, Math.PI / 2));
      const porta = new Group();
      porta.add(caixa(0.32, 0.02, 0.56, esquadria, 0, 0, 0));
      porta.add(caixa(0.27, 0.03, 0.52, madeira, 0, 0, -0.02));
      porta.position.set(0.35, frente, 0.08 + 0.28);
      aberturas.add(porta);
      grupo.add(aberturas);

      // 4. telhado de duas águas, com beiral, e as empenas (oitões) rebocadas
      const telhado = new Group();
      const meia = LG / 2 + 0.18;
      const queda = Math.atan2(ALT_TELHADO, LG / 2);
      const comp = Math.hypot(meia, ALT_TELHADO * (meia / (LG / 2)));
      [-1, 1].forEach((lado) => {
        const agua = caixa(C + 0.3, comp, 0.05, telha, 0, (lado * comp * Math.cos(queda)) / 2, 0);
        agua.rotation.x = -lado * queda;
        agua.position.z = ALT_TELHADO - (comp * Math.sin(queda)) / 2 + 0.03;
        telhado.add(agua);
      });
      const tri = new BufferGeometry();
      const v = [];
      [-C / 2 + 0.005, C / 2 - 0.005].forEach((x) => v.push(x, -LG / 2, 0, x, LG / 2, 0, x, 0, ALT_TELHADO));
      tri.setAttribute("position", new Float32BufferAttribute(v, 3));
      tri.computeVertexNormals();
      const empenas = new Mesh(tri, new MeshStandardMaterial({ color: REAL.reboco, roughness: 0.9, side: DoubleSide }));
      empenas.castShadow = true;
      telhado.add(empenas);
      const cumeeira = caixa(C + 0.3, 0.08, 0.06, telha, 0, 0, ALT_TELHADO + 0.03);
      cumeeira.rotation.x = Math.PI / 4;
      telhado.add(cumeeira);
      const zTelhado = 0.08 + H;
      grupo.add(telhado);

      return {
        pose: CICLO * 0.75,
        animar: (t) => {
          grupo.rotation.z = -0.35 + Math.sin(t * 0.18) * 0.45;
          const c = (t % CICLO) / CICLO;
          // avanço da obra: sobe até 1 em 65% do ciclo, fica pronta e desmonta rápido no fim
          const s = c < 0.65 ? c / 0.65 : c < 0.92 ? 1 : 1 - (c - 0.92) / 0.08;
          const fPiso = suave(s / 0.1);
          const fParede = suave((s - 0.1) / 0.4);
          const fAbert = suave((s - 0.5) / 0.15);
          const fTelhado = suave((s - 0.65) / 0.35);
          piso.scale.z = Math.max(0.01, fPiso);
          piso.position.z = 0.04 * fPiso;
          paredes.scale.z = Math.max(0.001, fParede);
          paredes.visible = fParede > 0.001;
          aberturas.visible = fAbert > 0.01;
          aberturas.children.forEach((a) => a.scale.setScalar(Math.max(0.01, fAbert)));
          telhado.visible = fTelhado > 0.001;
          telhado.position.z = zTelhado + (1 - fTelhado) * 0.7;
        },
      };
    },
  });
}
