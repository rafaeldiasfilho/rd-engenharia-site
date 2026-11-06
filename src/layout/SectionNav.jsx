// "Nesta página" bar: links to the page sections, highlighting the one in view.

import { useEffect, useMemo, useRef, useState } from "react";
import { LiquidNavbar } from "../components/ui/liquid-glass-navbar";

// Page index: stays visible while scrolling and marks the section the reader is in.
// Design: liquid-glass pill (components/ui/liquid-glass-navbar). The drop follows the visible section;
// after a click, the observer waits for scrolling to finish (scrollend, with a 3 s limit) so the drop
// does not wander through the sections in between. Arrow keys and continuous ripple are turned off: the items
// are links (Tab + Enter) and the bar is always in view, so the water only animates when something changes.
// On mobile the pill takes the screen width and the items scroll sideways inside it (the component
// centers the active item and the drop follows).
export function SectionNav({ items, label = "Nesta página" }) {
  const [active, setActive] = useState(0);
  const locked = useRef(false);
  const refresh = useRef(() => {});
  const itemsKey = items.map((i) => i.id).join("|");

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean);
    if (!els.length || !("IntersectionObserver" in window)) return undefined;
    const visible = new Map();
    refresh.current = () => {
      if (locked.current) return;
      const first = els.find((el) => visible.get(el.id));
      if (first) setActive(items.findIndex((i) => i.id === first.id));
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        refresh.current();
      },
      { rootMargin: "-25% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey]);

  // a new click while the previous one is still scrolling replaces the lock (otherwise the first one would release too early)
  const releasePrevious = useRef(null);
  const lock = () => {
    releasePrevious.current?.(false);
    locked.current = true;
    let timeoutId = 0;
    const release = (updateNow = true) => {
      window.removeEventListener("scrollend", release);
      clearTimeout(timeoutId);
      releasePrevious.current = null;
      if (!updateNow) return;
      locked.current = false;
      refresh.current();
    };
    releasePrevious.current = release;
    window.addEventListener("scrollend", release);
    timeoutId = setTimeout(release, 3000);
  };

  const barItems = useMemo(
    () => items.map((i) => ({ label: i.label, href: `#${i.id}`, fx: "none" })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemsKey]
  );

  return (
    <div className="secoes">
      <div className="secoes-inner">
        <LiquidNavbar
          items={barItems}
          active={active}
          onChange={(n) => {
            lock();
            setActive(n);
          }}
          ambient={false}
          arrowKeys={false}
          refraction={false}
          tone="auto"
          compact={false}
          label={label}
          current="location"
        />
      </div>
    </div>
  );
}
