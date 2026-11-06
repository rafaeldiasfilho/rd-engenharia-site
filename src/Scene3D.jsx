import { useEffect, useRef, useState } from "react";

// 3D scenes for the area pages (three.js; idea from the library's "Spline scene" prompt, without Spline).
// Each scene lives in its own file in src/scenes3d/ and only downloads when the block is ~600 px from the screen.
// The shared base (src/scenes3d/base.js) pauses off screen, tilts with the mouse and, with "reduce motion",
// shows a still image. Without WebGL the CSS contour drawing in the background remains.
const SCENES = {
  terrain: () => import("./scenes3d/terrain"),
  house: () => import("./scenes3d/house"),
  escapeRoute: () => import("./scenes3d/escapeRoute"),
  hardHat: () => import("./scenes3d/hardHat"),
};

export default function Scene3D({ scene, className = "", label }) {
  const boxRef = useRef(null);
  const [no3d, setNo3d] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    const load = SCENES[scene];
    if (!el || !load) return undefined;
    let stop = () => {};
    let cancelled = false;

    const start = async () => {
      const { mount } = await load();
      if (cancelled) return;
      const unmount = mount(el);
      if (!unmount) setNo3d(true);
      else stop = unmount;
    };

    const nearObserver = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        nearObserver.disconnect();
        start().catch(() => setNo3d(true));
      },
      { rootMargin: "600px" },
    );
    nearObserver.observe(el);

    return () => {
      cancelled = true;
      nearObserver.disconnect();
      stop();
    };
  }, [scene]);

  return <div ref={boxRef} className={`scene3d ${no3d ? "cena-sem3d" : ""} ${className}`} role="img" aria-label={label} />;
}
