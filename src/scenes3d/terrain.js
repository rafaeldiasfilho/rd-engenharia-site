// Environment and Surveying: terrain with natural colors, contour lines (in the shader) and surveyed points.
import { BufferAttribute, BufferGeometry, Mesh, PlaneGeometry, Points, PointsMaterial, ShaderMaterial } from "three";
import { mountScene } from "./base";

function height(x, y) {
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

// Natural colors by altitude: water at the valley floor, floodplain, pasture, forest and bare soil up high.
// Thin brown contour lines (as on topographic maps) and an index contour every fifth line.
const FRAG = /* glsl */ `
  varying float vH;
  varying vec2 vXY;
  varying vec3 vN;
  void main() {
    float h = vH;
    vec3 water = vec3(0.20, 0.45, 0.60);
    vec3 floodplain = vec3(0.55, 0.66, 0.36);
    vec3 pasture = vec3(0.42, 0.58, 0.26);
    vec3 forest = vec3(0.20, 0.40, 0.18);
    vec3 soil = vec3(0.55, 0.43, 0.30);
    vec3 color = floodplain;
    color = mix(color, pasture, smoothstep(-0.18, 0.0, h));
    color = mix(color, forest, smoothstep(0.08, 0.28, h));
    color = mix(color, soil, smoothstep(0.38, 0.55, h));
    float k = h * 8.0;
    float line = 1.0 - smoothstep(0.0, fwidth(k) * 1.0, abs(fract(k) - 0.5) - 0.0);
    float indexLine = 1.0 - smoothstep(0.0, fwidth(k) * 1.8, abs(fract(k / 5.0) - 0.5) * 5.0 - 0.04);
    vec3 brown = vec3(0.42, 0.27, 0.15);
    color = mix(color, brown, max(line * 0.35, indexLine * 0.6));
    float wet = 1.0 - smoothstep(-0.36, -0.33, h);
    color = mix(color, water, wet);
    vec3 L = normalize(vec3(-0.5, -0.6, 0.9));
    float light = 0.45 + 0.65 * max(dot(normalize(vN), L), 0.0);
    color *= light;
    float edge = 1.0 - smoothstep(1.55, 2.15, length(vXY));
    gl_FragColor = vec4(color, edge);
  }
`;

export function mount(el) {
  return mountScene(el, {
    camera: { pos: [0, -4.4, 3.4], target: [0, 0, -0.1] },
    build: ({ group }) => {
      const geo = new PlaneGeometry(4.4, 4.4, 140, 140);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) pos.setZ(i, height(pos.getX(i), pos.getY(i)));
      geo.computeVertexNormals();
      const mat = new ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        extensions: { derivatives: true },
        transparent: true,
      });
      group.add(new Mesh(geo, mat));

      const markers = [[-1.2, 0.8], [0.6, -0.4], [1.3, 1.1], [-0.4, -1.3], [0.1, 0.5], [-1.6, -0.6], [1.5, -1.2]];
      const pts = new Float32Array(markers.length * 3);
      markers.forEach(([x, y], i) => pts.set([x, y, height(x, y) + 0.05], i * 3));
      const geoP = new BufferGeometry();
      geoP.setAttribute("position", new BufferAttribute(pts, 3));
      group.add(new Points(geoP, new PointsMaterial({ color: "#ff5a36", size: 0.08 })));

      return {
        pose: 4,
        animate: (t) => {
          group.rotation.z = 0.35 + t * 0.06;
        },
      };
    },
  });
}
