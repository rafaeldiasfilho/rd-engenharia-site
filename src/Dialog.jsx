import { useEffect, useId, useRef } from "react";

// Dialog over the page (adapted from the prompt library's "expandable cards", without an animation
// library): native <dialog>, which already traps focus, closes with Esc and returns focus to the button that opened it.
// Clicking outside the panel also closes it. The entrance is only opacity and scale (CSS), disabled with "reduce motion".
// The content stays in the prerendered HTML (Google reads it), only hidden until opened.
export default function Janela({ aberta, aoFechar, titulo, children }) {
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aberta && !d.open) d.showModal();
    if (!aberta && d.open) d.close();
  }, [aberta]);

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby={`${id}-t`}
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === e.currentTarget) aoFechar();
      }}
    >
      <div className="dialog-panel">
        <div className="dialog-head">
          <h3 id={`${id}-t`}>{titulo}</h3>
          <button type="button" className="dialog-close" onClick={aoFechar} aria-label="Fechar">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
