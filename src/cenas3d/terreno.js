// Meio Ambiente e Topografia: terreno com cores naturais, curvas de nível (no shader) e pontos levantados.
import { BufferAttribute, BufferGeometry, Mesh, PlaneGeometry, Points, PointsMaterial, ShaderMaterial } from "three";
import { montarCena } from "./base";

function altura(x, y) {
  return (
    0.34 * Math.sin(x * 1.3 + 0.6) * Math.cos(y * 1.1) +
    0.2 * Math.sin(x * 2.7 - y * 1.9 + 1.2) +
    0.12 * Math.cos(x * 4.1 + y * 3.3) +
    0.28 * Math.exp(-((x - 0.6) ** 2 + (y + 0.4) ** 2) * 1.6)
  );
}

const VERT = /* glsl */ `
  varying float vH;
  varying vec2 vXY;
  varying vec3 vN;
  void main() {
    vH = position.z;
    vXY = position.xy;
    vN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Cores naturais por altitude: água no fundo do vale, várzea, pasto, mata e terra exposta no alto.
// Curvas de nível finas em marrom (como nas cartas topográficas) e uma mestra a cada cinco.
const FRAG = /* glsl */ `
  varying float vH;
  varying vec2 vXY;
  varying vec3 vN;
  void main() {
    float h = vH;
    vec3 agua = vec3(0.20, 0.45, 0.60);
    vec3 varzea = vec3(0.55, 0.66, 0.36);
    vec3 pasto = vec3(0.42, 0.58, 0.26);
    vec3 mata = vec3(0.20, 0.40, 0.18);
    vec3 terra = vec3(0.55, 0.43, 0.30);
    vec3 cor = varzea;
    cor = mix(cor, pasto, smoothstep(-0.18, 0.0, h));
    cor = mix(cor, mata, smoothstep(0.08, 0.28, h));
    cor = mix(cor, terra, smoothstep(0.38, 0.55, h));
    float k = h * 8.0;
    float linha = 1.0 - smoothstep(0.0, fwidth(k) * 1.0, abs(fract(k) - 0.5) - 0.0);
    float mestra = 1.0 - smoothstep(0.0, fwidth(k) * 1.8, abs(fract(k / 5.0) - 0.5) * 5.0 - 0.04);
    vec3 marrom = vec3(0.42, 0.27, 0.15);
    cor = mix(cor, marrom, max(linha * 0.35, mestra * 0.6));
    float molhado = 1.0 - smoothstep(-0.36, -0.33, h);
    cor = mix(cor, agua, molhado);
    vec3 L = normalize(vec3(-0.5, -0.6, 0.9));
    float luz = 0.45 + 0.65 * max(dot(normalize(vN), L), 0.0);
    cor *= luz;
    float borda = 1.0 - smoothstep(1.55, 2.15, length(vXY));
    gl_FragColor = vec4(cor, borda);
  }
`;

export function montar(el) {
  return montarCena(el, {
    camera: { pos: [0, -4.4, 3.4], alvo: [0, 0, -0.1] },
    construir: ({ grupo }) => {
      const geo = new PlaneGeometry(4.4, 4.4, 140, 140);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) pos.setZ(i, altura(pos.getX(i), pos.getY(i)));
      geo.computeVertexNormals();
      const mat = new ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        extensions: { derivatives: true },
        transparent: true,
      });
      grupo.add(new Mesh(geo, mat));

      const marcos = [[-1.2, 0.8], [0.6, -0.4], [1.3, 1.1], [-0.4, -1.3], [0.1, 0.5], [-1.6, -0.6], [1.5, -1.2]];
      const pts = new Float32Array(marcos.length * 3);
      marcos.forEach(([x, y], i) => pts.set([x, y, altura(x, y) + 0.05], i * 3));
      const geoP = new BufferGeometry();
      geoP.setAttribute("position", new BufferAttribute(pts, 3));
      grupo.add(new Points(geoP, new PointsMaterial({ color: "#ff5a36", size: 0.08 })));

      return {
        pose: 4,
        animar: (t) => {
          grupo.rotation.z = 0.35 + t * 0.06;
        },
      };
    },
  });
}
