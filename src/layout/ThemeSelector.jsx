// Light / dark / automatic theme selector (saved in localStorage "tema").

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

const THEME_OPTIONS = [
  { id: "auto", label: "Automático" },
  { id: "light", label: "Claro" },
  { id: "dark", label: "Escuro" },
];

export function ThemeSelector() {
  const [theme, setTheme] = useState("auto");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tema");
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {
      // no storage: follow the system
    }
  }, []);

  const applyTheme = (id) => {
    flushSync(() => setTheme(id));
    if (id === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", id);
    try {
      if (id === "auto") localStorage.removeItem("tema");
      else localStorage.setItem("tema", id);
    } catch {
      // the theme applies to this visit only
    }
  };

  // The new appearance opens as a circle from the button (View Transitions). Without support or with
  // "reduce motion", it switches directly.
  const chooseTheme = (id, e) => {
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion) {
      applyTheme(id);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.detail > 0 ? e.clientX : r.left + r.width / 2;
    const y = e.detail > 0 ? e.clientY : r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(() => applyTheme(id));
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 520, easing: "cubic-bezier(0.23, 1, 0.32, 1)", pseudoElement: "::view-transition-new(root)" }
        );
      })
      .catch(() => {});
  };

  return (
    <div className="theme" role="group" aria-label="Aparência do site">
      <span>Aparência</span>
      {THEME_OPTIONS.map((t) => (
        <button key={t.id} type="button" aria-pressed={theme === t.id} onClick={(e) => chooseTheme(t.id, e)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
