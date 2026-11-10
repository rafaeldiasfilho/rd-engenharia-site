// Document search box: shows the options built in searchIndex.js (results, the step-by-step wizard when
// nothing matched, and WhatsApp last) as an accessible combobox. No search logic here.
import { useEffect, useId, useRef, useState } from "react";
import Icon from "./Icon";
import { SEARCH_SUGGESTIONS, buildSearchOptions, searchSiteContent } from "./searchIndex.js";

export default function DocumentSearch({ autoFocus = false, onExit, className = "" }) {
  const base = useId().replace(/:/g, "");
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1);
  const field = useRef(null);

  useEffect(() => {
    if (autoFocus && field.current) field.current.focus();
  }, [autoFocus]);

  const results = searchSiteContent(q);
  const text = q.trim();
  const options = buildSearchOptions(q, results);
  const open = options.length > 0;

  const openOption = (op) => {
    if (!op) return;
    if (op.external) window.open(op.href, "_blank", "noopener,noreferrer");
    else window.location.href = op.href;
    if (onExit) onExit();
  };

  const handleKeys = (e) => {
    if (e.key === "ArrowDown" && open) {
      e.preventDefault();
      setActive((n) => (n + 1) % options.length);
    } else if (e.key === "ArrowUp" && open) {
      e.preventDefault();
      setActive((n) => (n <= 0 ? options.length - 1 : n - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      openOption(options[active >= 0 ? active : 0]);
    } else if (e.key === "Escape" && q) {
      e.preventDefault();
      e.stopPropagation(); // first Esc clears; the second closes the search dialog
      setQ("");
      setActive(-1);
    }
  };

  const listId = `${base}-list`;
  const optionId = (n) => `${base}-op-${n}`;

  return (
    <form className={`search ${className}`} role="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={`${base}-field`} className="search-label">
        Qual documento ou serviço você precisa?
      </label>
      <div className="search-box">
        <Icon name="fa-solid fa-magnifying-glass" />
        <input
          ref={field}
          id={`${base}-field`}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          enterKeyHint="search"
          placeholder="Ex.: AVCB, PGR, CAR, habite-se"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(-1);
          }}
          onKeyDown={handleKeys}
        />
      </div>
      <ul id={listId} role="listbox" className="search-list" aria-label="Resultados da busca" hidden={!open}>
        {options.map((op, n) => (
          <li
            key={op.href}
            id={optionId(n)}
            role="option"
            aria-selected={n === active}
            className={`search-option ${op.external ? "search-option-whatsapp" : ""}`}
            onMouseMove={() => setActive(n)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => openOption(op)}
          >
            <span className="search-type">{op.external ? <Icon name="fa-brands fa-whatsapp" /> : op.type}</span>
            <span className="search-txt">
              <strong>{op.title}</strong>
              <small>{op.text}</small>
            </span>
          </li>
        ))}
      </ul>
      <p className="search-status" aria-live="polite">
        {text ? (results.length ? `${results.length} resultado${results.length > 1 ? "s" : ""}` : "Nenhum resultado no site") : ""}
      </p>
      {!text && (
        <p className="search-suggestions">
          <span>Exemplos:</span>
          {SEARCH_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setQ(s);
                setActive(0);
                field.current?.focus();
              }}
            >
              {s}
            </button>
          ))}
        </p>
      )}
    </form>
  );
}
