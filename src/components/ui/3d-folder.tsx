"use client"

/**
 * "3D Folder" (AnimatedFolder + ImageLightbox) from 21st.dev, adapted for the RD Engenharia site.
 * Keeps the original idea: a folder that opens in perspective and fans out up to three cards;
 * the clicked card enlarges from its own position and you can move on to the others.
 * Changes:
 * - no Tailwind, cn or lucide-react: styles in src/styles.css (.folder-* classes), site colors
 *   (green family, light and dark themes) and inline SVG icons;
 * - each item carries `media` (any element, e.g. the sample SVG sheet) instead of `image`,
 *   and may carry an action (link) in the enlarged view's footer, instead of the "View" button that led nowhere;
 * - opens on mouse hover (like the original) AND on touch/click/keyboard (the original only opened on hover,
 *   so it did not work on phones); the closed folder already shows the tips of the sheets;
 * - the enlarged view goes through all items (the fan shows only the first three);
 * - accessible enlarged view: role="dialog", focus moves to the close button and back to the card, Tab stays inside,
 *   Esc closes, ← → navigate, labelled dots; rendered in a portal (ancestors with transform
 *   broke position: fixed);
 * - texts in Portuguese; with "reduced motion" nothing flies or spins, it just appears.
 */

import * as React from "react"
import { createPortal } from "react-dom"

export type FolderItem = {
  id: string
  title: string
  /** short name written on the fan sheet (default: title) */
  short?: string
  media: React.ReactNode
  /** content of the enlarged view, if different from the thumbnail (e.g. sheet with tabs and zoom) */
  expanded?: React.ReactNode
  caption?: string
  action?: { label: string; href: string }
}

type AnimatedFolderProps = {
  title: string
  items: FolderItem[]
  /** count text, e.g. (n) => `${n} documentos de exemplo` */
  countLabel?: (n: number) => string
  className?: string
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

const Arrow = ({ side }: { side: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
    <path d={side === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function AnimatedFolder({ title, items, countLabel = (n) => `${n} itens`, className }: AnimatedFolderProps) {
  const [hover, setHover] = React.useState(false)
  const [pinned, setPinned] = React.useState(false)
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)
  const [origin, setOrigin] = React.useState<DOMRect | null>(null)
  const cardRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const folderRef = React.useRef<HTMLButtonElement>(null)
  const id = React.useId()
  const isOpen = hover || pinned
  const fan = items.slice(0, 3)

  const openItem = (i: number) => {
    const el = cardRefs.current[i]
    setOrigin(el ? el.getBoundingClientRect() : null)
    setOpenIndex(i)
  }

  const close = () => {
    const i = openIndex
    setOpenIndex(null)
    // focus returns to the card it came from (or to the folder, if the item is not in the fan)
    requestAnimationFrame(() => {
      const target = i !== null && i < fan.length ? cardRefs.current[i] : folderRef.current
      target?.focus()
    })
  }

  return (
    <div
      className={["folder", className].filter(Boolean).join(" ")}
      data-aberta={isOpen ? "true" : "false"}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}
    >
      <button
        ref={folderRef}
        type="button"
        className="folder-button"
        aria-expanded={isOpen}
        aria-controls={`${id}-cartoes`}
        aria-label={`${isOpen ? "Fechar" : "Abrir"} a pasta ${title}: ${countLabel(items.length)}`}
        onClick={() => setPinned((v) => !v)}
      />
      <div className="folder-graphic" aria-hidden="true">
        <span className="folder-bg" />
        <span className="folder-tab" />
        <span className="folder-front" />
      </div>
      <ul className="folder-cards" id={`${id}-cartoes`}>
        {fan.map((it, i) => (
          <li key={it.id} className="folder-card" data-i={i} data-oculto={openIndex === i ? "true" : undefined}>
            <button
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              type="button"
              tabIndex={isOpen ? 0 : -1}
              aria-hidden={isOpen ? undefined : true}
              aria-label={`Ampliar: ${it.title}`}
              onClick={(e) => {
                e.stopPropagation()
                openItem(i)
              }}
            >
              <span className="folder-card-media">{it.media}</span>
              <span className="folder-card-title">{it.short ?? it.title}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="folder-text" aria-hidden="true">
        <h3 className="folder-title">{title}</h3>
        <p className="folder-count">{countLabel(items.length)}</p>
        <p className="folder-hint">
          <span className="folder-hint-mouse">{isOpen ? "Clique numa folha para ampliar" : "Passe o mouse para abrir"}</span>
          <span className="folder-hint-touch">{isOpen ? "Toque numa folha para ampliar" : "Toque para abrir"}</span>
        </p>
      </div>
      {openIndex !== null && (
        <Viewer
          items={items}
          index={openIndex}
          origin={origin}
          folderTitle={title}
          onNavigate={(i) => {
            setOrigin(null)
            setOpenIndex(i)
          }}
          onClose={close}
        />
      )}
    </div>
  )
}

type ViewerProps = {
  items: FolderItem[]
  index: number
  origin: DOMRect | null
  folderTitle: string
  onNavigate: (i: number) => void
  onClose: () => void
}

function Viewer({ items, index, origin, folderTitle, onNavigate, onClose }: ViewerProps) {
  const [phase, setPhase] = React.useState<"inicio" | "aberta" | "saindo">("inicio")
  const [direction, setDirection] = React.useState<"esq" | "dir">("dir")
  const panel = React.useRef<HTMLDivElement>(null)
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const item = items[index]
  const hasPrev = index > 0
  const hasNext = index < items.length - 1
  const titleId = React.useId()

  // entry: the panel starts at the card's size and place and grows to the center (FLIP)
  const [initialStyle, setInitialStyle] = React.useState<React.CSSProperties | undefined>(undefined)
  React.useLayoutEffect(() => {
    const p = panel.current
    let fallback = 0
    if (p && origin && !prefersReducedMotion()) {
      const r = p.getBoundingClientRect()
      const s = Math.max(origin.width / r.width, origin.height / r.height)
      const dx = origin.left + origin.width / 2 - (r.left + r.width / 2)
      const dy = origin.top + origin.height / 2 - (r.top + r.height / 2)
      setInitialStyle({ transform: `translate(${dx}px, ${dy}px) scale(${s})`, transition: "none" })
      const grow = () => {
        clearTimeout(fallback)
        setInitialStyle(undefined)
        setPhase("aberta")
      }
      requestAnimationFrame(() => requestAnimationFrame(grow))
      // if the browser delays frames (background tab, slow device), open anyway
      fallback = window.setTimeout(grow, 150)
    } else {
      setPhase("aberta")
    }
    closeRef.current?.focus()
    const bodyOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      clearTimeout(fallback)
      document.body.style.overflow = bodyOverflow
    }
    // only on open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const exit = React.useCallback(() => {
    if (prefersReducedMotion()) return onClose()
    setPhase("saindo")
    setTimeout(onClose, 260)
  }, [onClose])

  const go = React.useCallback(
    (i: number) => {
      if (i < 0 || i >= items.length || i === index) return
      setDirection(i > index ? "dir" : "esq")
      onNavigate(i)
    },
    [items.length, index, onNavigate]
  )

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        exit()
      } else if (e.key === "ArrowRight") go(index + 1)
      else if (e.key === "ArrowLeft") go(index - 1)
      else if (e.key === "Tab") {
        // focus stays inside the enlarged view
        const root = panel.current?.closest(".folder-viewer")
        const focusables = root ? Array.from(root.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]")) : []
        if (!focusables.length) return
        const first = focusables[0], last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [go, index, exit])

  if (!item) return null

  return createPortal(
    <div className="folder-viewer" data-fase={phase} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="folder-viewer-bg" onClick={exit} />
      <button ref={closeRef} type="button" className="folder-viewer-close" onClick={exit} aria-label="Fechar">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
          <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>
      <button type="button" className="folder-viewer-nav folder-viewer-prev" onClick={() => go(index - 1)} disabled={!hasPrev} aria-label="Anterior">
        <Arrow side="left" />
      </button>
      <button type="button" className="folder-viewer-nav folder-viewer-next" onClick={() => go(index + 1)} disabled={!hasNext} aria-label="Próximo">
        <Arrow side="right" />
      </button>
      <div className="folder-viewer-panel" ref={panel} style={initialStyle}>
        <div className="folder-viewer-media" key={item.id} data-dir={direction}>
          {item.expanded ?? item.media}
        </div>
        <div className="folder-viewer-footer">
          <p className="folder-viewer-folder">{folderTitle}</p>
          <h3 id={titleId} className="folder-viewer-title">
            {item.title}
          </h3>
          {item.caption && <p className="folder-viewer-caption">{item.caption}</p>}
          <div className="folder-viewer-line">
            <div className="folder-viewer-dots">
              {items.map((it, i) => (
                <button
                  key={it.id}
                  type="button"
                  aria-label={`Ver ${i + 1} de ${items.length}: ${it.title}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => go(i)}
                />
              ))}
            </div>
            <span className="folder-viewer-n" aria-live="polite">
              {index + 1} de {items.length}
            </span>
          </div>
          {item.action && (
            <a className="btn btn-whatsapp btn-small folder-viewer-action" href={item.action.href} target="_blank" rel="noopener noreferrer">
              {item.action.label}
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default AnimatedFolder
