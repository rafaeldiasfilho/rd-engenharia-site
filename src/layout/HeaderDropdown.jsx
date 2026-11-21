// One header menu with a panel. The mouse opens it on hover and it closes when the mouse leaves; a click
// "pins" it open; Enter or Space toggles it without animation; Esc or a click outside closes it.
// Only one panel is open at a time: the header keeps the open menu's id.

import { useEffect, useRef } from "react";

export function HeaderDropdown({ menuId, label, isCurrent, openMenuId, setOpenMenuId, onTriggerPointerEnter, panelClassName = "", children }) {
  const isOpen = openMenuId === menuId;
  const dropdownBox = useRef(null);
  const triggerButton = useRef(null);
  const openedByHover = useRef(false);
  const openedByKeyboard = useRef(false);
  const hoverTimer = useRef(0);

  const openThisMenu = () => setOpenMenuId(menuId);
  const closeThisMenu = () => setOpenMenuId((openId) => (openId === menuId ? null : openId));

  useEffect(() => {
    if (!isOpen) return undefined;
    const onPointerOutside = (e) => {
      if (dropdownBox.current && dropdownBox.current.contains(e.target)) return;
      openedByHover.current = false;
      closeThisMenu();
    };
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      openedByHover.current = false;
      closeThisMenu();
      triggerButton.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const onPointerEnterBox = (e) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(hoverTimer.current);
    if (isOpen) return;
    hoverTimer.current = setTimeout(() => {
      openedByHover.current = true;
      openedByKeyboard.current = false;
      openThisMenu();
    }, 70);
  };

  const onPointerLeaveBox = (e) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(hoverTimer.current);
    if (!openedByHover.current) return;
    hoverTimer.current = setTimeout(() => {
      openedByHover.current = false;
      closeThisMenu();
    }, 200);
  };

  const onTriggerClick = (e) => {
    openedByKeyboard.current = e.detail === 0; // opened by keyboard: no animation
    clearTimeout(hoverTimer.current);
    if (e.detail > 0 && openedByHover.current) {
      openedByHover.current = false;
      openThisMenu();
      return;
    }
    openedByHover.current = false;
    setOpenMenuId((openId) => (openId === menuId ? null : menuId));
  };

  return (
    <div
      className="menu-dropdown"
      ref={dropdownBox}
      data-open={isOpen || undefined}
      onPointerEnter={onPointerEnterBox}
      onPointerLeave={onPointerLeaveBox}
      onBlur={(e) => {
        if (!e.relatedTarget || e.currentTarget.contains(e.relatedTarget)) return;
        openedByHover.current = false;
        closeThisMenu();
      }}
    >
      <button
        type="button"
        ref={triggerButton}
        className={isCurrent ? "current" : ""}
        aria-expanded={isOpen}
        aria-controls={`${menuId}-menu-panel`}
        onPointerEnter={onTriggerPointerEnter}
        onClick={onTriggerClick}
      >
        {label}
        <svg className="arrow-menu" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        id={`${menuId}-menu-panel`}
        className={`menu-panel ${panelClassName} ${isOpen ? "open" : ""} ${openedByKeyboard.current ? "keyboard" : ""}`}
        hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  );
}
