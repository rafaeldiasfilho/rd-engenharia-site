import { useEffect, useId, useRef, useState } from "react";
import Icon from "./Icon";
import { AREAS, GUIAS, PAGINAS } from "./pagesData";
import { zap } from "./contact";

// Search by document or service ("Qual documento você precisa?"), with no library.
// - The index comes from the site's own content (areas, each area's services, guides and useful pages):
//   nothing to maintain separately. Ignores accents and case; every typed word must appear.
// - Accessible combobox pattern: arrows move up and down, Enter opens, Esc clears. The last option is always
//   asking on WhatsApp with the typed text, so the search never ends in a dead end.
// - No window/document during render: safe for prerendering.

export const normaliza = (t) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Anchor of each service on the area page (also used in Pages.jsx).
export const ancora = (name) =>
  "servico-" +
  normaliza(name)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);

const USEFUL_PAGES = ["o-que-preciso", "lembrete-de-vencimento", "onde-atendemos"];

const INDEX = [
  ...AREAS.flatMap((a) =>
    a.itens.map((it) => ({
      type: "Serviço",
      title: it.nome,
      text: a.nome,
      href: `/${a.slug}#${ancora(it.nome)}`,
      titleNorm: normaliza(it.nome),
      haystack: normaliza([it.nome, it.texto, it.quem, a.nome].join(" ")),
    }))
  ),
  ...AREAS.map((a) => ({
    type: "Área",
    title: a.nome,
    text: a.curto,
    href: `/${a.slug}`,
    titleNorm: normaliza(a.nome),
    haystack: normaliza([a.nome, a.curto, a.intro, ...(a.situacoes || [])].join(" ")),
  })),
  ...GUIAS.map((g) => ({
    type: "Guia",
    title: g.h1,
    text: "Guia em linguagem simples",
    href: `/${g.slug}`,
    titleNorm: normaliza(g.h1),
    haystack: normaliza([g.h1, g.description, g.servico].join(" ")),
  })),
  ...PAGINAS.filter((p) => USEFUL_PAGES.includes(p.slug)).map((p) => ({
    type: "Página",
    title: p.h1,
    text: p.description,
    href: `/${p.slug}`,
    titleNorm: normaliza(p.h1),
    haystack: normaliza([p.h1, p.description].join(" ")),
  })),
];

const TYPE_WEIGHT = { Serviço: 3, Área: 2, Guia: 1, Página: 0 };

export function buscar(query, limit = 6) {
  const terms = normaliza(query).split(/[^a-z0-9-]+/).filter((t) => t.length >= 2);
  if (!terms.length) return [];
  return INDEX.map((it) => {
    let score = 0;
    for (const t of terms) {
      if (!it.haystack.includes(t)) return null;
      if (it.titleNorm.startsWith(t)) score += 6;
      if (new RegExp(`(^|[^a-z0-9])${t}([^a-z0-9]|$)`).test(it.titleNorm)) score += 4;
      else if (it.titleNorm.includes(t)) score += 2;
      score += 1;
    }
    return { ...it, score: score * 10 + TYPE_WEIGHT[it.type] };
  })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

const SUGGESTIONS = ["AVCB", "PGR", "LTCAT", "CAR", "Habite-se", "Georreferenciamento"];

export default function BuscaDocumento({ autoFoco = false, aoSair, className = "" }) {
  const base = useId().replace(/:/g, "");
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1);
  const field = useRef(null);

  useEffect(() => {
    if (autoFoco && field.current) field.current.focus();
  }, [autoFoco]);

  const results = buscar(q);
  const text = q.trim();
  const options = text
    ? [
        ...results,
        {
          type: "WhatsApp",
          title: `Perguntar no WhatsApp: “${text}”`,
          text: results.length ? "Ou fale direto com o responsável técnico." : "Não achamos no site, mas respondemos por lá.",
          href: zap(`Olá! Procurei no site por "${text}" e gostaria de saber se vocês fazem.`),
          external: true,
        },
      ]
    : [];
  const open = options.length > 0;

  const openOption = (op) => {
    if (!op) return;
    if (op.external) window.open(op.href, "_blank", "noopener,noreferrer");
    else window.location.href = op.href;
    if (aoSair) aoSair();
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

  const listId = `${base}-lista`;
  const optionId = (n) => `${base}-op-${n}`;

  return (
    <form className={`search ${className}`} role="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={`${base}-campo`} className="search-label">
        Qual documento ou serviço você precisa?
      </label>
      <div className="search-box">
        <Icon nome="fa-solid fa-magnifying-glass" />
        <input
          ref={field}
          id={`${base}-campo`}
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
            <span className="search-type">{op.external ? <Icon nome="fa-brands fa-whatsapp" /> : op.type}</span>
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
          <span>Mais procurados:</span>
          {SUGGESTIONS.map((s) => (
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

// Search button in the header: opens the search in a dialog (native dialog, which already traps focus and closes with Esc).
// Shortcuts: Ctrl+K / Cmd+K and "/" (outside text fields).
export function BotaoBusca() {
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
        <Icon nome="fa-solid fa-magnifying-glass" />
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
            <Icon nome="fa-solid fa-xmark" />
          </button>
          {isOpen && <BuscaDocumento autoFoco aoSair={closeDialog} />}
        </div>
      </dialog>
    </>
  );
}
