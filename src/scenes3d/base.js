// Shared base for the site's 3D scenes (three.js): renderer, camera, resizing, free rotation
// by dragging with the mouse or a finger (OrbitControls, no zoom so the mouse wheel keeps scrolling the page), pausing off screen, "reduced motion" (a still image) and cleanup when leaving the page.
// Each scene only describes what it draws and how it animates: build({ scene, camera, group, THREE }) returns
// { animate(t), pose } — pose is the time used for the still image.
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { WebGLRenderer, Scene, PerspectiveCamera, Clock, Group, ACESFilmicToneMapping, PCFSoftShadowMap } from "three";

// Real material colors (concrete, plaster, roof tile, wood, glass, signage)
export const SCENE_MATERIAL_COLORS = {
  concrete: "#b8b4aa",
  plaster: "#efe7d6",
  roofTile: "#b4532a",
  wood: "#7a4a2a",
  glass: "#8fb9cc",
  frame: "#f4f4f2",
  grass: "#6b9a45",
  floor: "#d8d3c6",
  wall: "#f2f0ea",
  exit: "#14a04a",
  extinguisher: "#c8102e",
  ppeYellow: "#f2c200",
};

export function supportsWebGL() {
  const c = document.createElement("canvas");
  return !!(c.getContext("webgl2") || c.getContext("webgl"));
}

export function mountScene(el, { camera: cam = {}, shadows = false, build }) {
  if (!supportsWebGL()) return null;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = ACESFilmicToneMapping;
  if (shadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
  }
  el.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(cam.fov || 38, 1, 0.1, 60);
  camera.position.set(...(cam.pos || [0, -4.4, 3.4]));
  camera.up.set(...(cam.up || [0, 0, 1]));
  camera.lookAt(...(cam.target || [0, 0, 0]));
  const base = new Group();
  const group = new Group();
  base.add(group);
  scene.add(base);

  const { animate, pose = 3 } = build({ scene, camera, group, renderer });

  const resize = () => {
    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (reducedMotion || !frame) renderer.render(scene, camera);
  };

  // Free rotation: dragging orbits the camera around the scene in any direction (from above down to about 18° above the ground).
  // Whoever drags takes control: the scene's automatic rotation stops and does not come back.
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(...(cam.target || [0, 0, 0]));
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = !reducedMotion;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.8;
  controls.minPolarAngle = 0.05;
  controls.maxPolarAngle = 1.25; // ~72°: never level with the ground
  controls.update();
  let lockedRotation = null;
  controls.addEventListener("start", () => {
    if (lockedRotation === null) lockedRotation = group.rotation.z;
    el.classList.add("scene-dragging");
  });
  controls.addEventListener("end", () => el.classList.remove("scene-dragging"));
  // Without the loop running (still image or off screen), redraw on every movement
  controls.addEventListener("change", () => {
    if (!frame) renderer.render(scene, camera);
  });

  let visible = false;
  let frame = 0;
  const clock = new Clock();
  const loop = () => {
    animate(clock.getElapsedTime());
    if (lockedRotation !== null) group.rotation.z = lockedRotation;
    controls.update();
    renderer.render(scene, camera);
    frame = visible ? requestAnimationFrame(loop) : 0;
  };

  if (reducedMotion) animate(pose);
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (reducedMotion) {
      if (visible) renderer.render(scene, camera);
      return;
    }
    if (visible && !frame) {
      frame = requestAnimationFrame(loop);
    }
  });
  io.observe(el);
  el.classList.add("scene-ready");

  return () => {
    cancelAnimationFrame(frame);
    io.disconnect();
    ro.disconnect();
    controls.dispose();
    scene.traverse((o) => {
      o.geometry?.dispose();
      const m = o.material;
      if (Array.isArray(m)) m.forEach((x) => x.dispose());
      else m?.dispose();
    });
    renderer.dispose();
    renderer.domElement.remove();
  };
}
