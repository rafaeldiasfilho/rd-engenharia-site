// Header search button: opens the document search in a panel.

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import DocumentSearch from "./Search.jsx";

// Search button in the header: opens the search in a dialog (native dialog, which already traps focus and closes with Esc).
// Shortcuts: Ctrl+K / Cmd+K and "/" (outside text fields).
export function SearchButton() {
  const dialogRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    if (typeof d.showModal === "function") d.showModal();
    else d.setAttribute("open", "");
    setIsOpen(true);
  };
  const closeDialog = () => {
    const d = dialogRef.current;
    if (d && d.open) d.close ? d.close() : d.removeAttribute("open");
    setIsOpen(false);
  };

  useEffect(() => {
    const shortcut = (e) => {
      const typing = e.target.closest && e.target.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        openDialog();
      } else if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        openDialog();
      }
    };
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);

  return (
    <>
      <button type="button" className="search-button" aria-label="Buscar documento ou serviço" aria-haspopup="dialog" onClick={openDialog}>
        <Icon name="fa-solid fa-magnifying-glass" />
        <span className="search-button-txt">Buscar</span>
      </button>
      <dialog
        ref={dialogRef}
        className="search-dialog"
        aria-label="Buscar documento ou serviço"
        onClose={() => setIsOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeDialog(); // click outside the box
        }}
      >
        <div className="search-dialog-inner">
          <button type="button" className="search-close" aria-label="Fechar a busca" onClick={closeDialog}>
            <Icon name="fa-solid fa-xmark" />
          </button>
          {isOpen && <DocumentSearch autoFocus onExit={closeDialog} />}
        </div>
      </dialog>
    </>
  );
}
