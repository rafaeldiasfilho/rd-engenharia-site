"use client"

/**
 * "3D Folder" (AnimatedFolder + ImageLightbox) de 21st.dev, adaptado para o site da RD Engenharia.
 * Mantém a ideia do original: uma pasta que abre em perspectiva e solta até três cartões em leque;
 * o cartão clicado amplia a partir da própria posição e dá para passar para os outros.
 * Mudanças:
 * - sem Tailwind, cn e lucide-react: estilo em src/styles.css (classes .pasta-*), cores do site
 *   (família verde, temas claro e escuro) e ícones em SVG inline;
 * - cada item traz `media` (qualquer elemento, ex.: a folha de exemplo em SVG) no lugar de `image`,
 *   e pode trazer uma ação (link) no rodapé da ampliação, no lugar do botão "View" que não levava a nada;
 * - abre com o mouse em cima (como o original) E com toque/clique/teclado (o original só abria com hover,
 *   então não funcionava no celular); a pasta fechada já mostra as pontas das folhas;
 * - a ampliação percorre todos os itens (o leque mostra só os três primeiros);
 * - ampliação acessível: role="dialog", foco vai para o botão fechar e volta ao cartão, Tab fica dentro,
 *   Esc fecha, ← → navegam, pontinhos com rótulo; renderizada em portal (ancestrais com transform
 *   quebravam o position: fixed);
 * - textos em português; com "reduzir movimento" nada voa nem gira, só aparece.
 */

import * as React from "react"
import { createPortal } from "react-dom"

export type FolderItem = {
  id: string
  title: string
  /** nome curto escrito na folha do leque (padrão: title) */
  short?: string
  media: React.ReactNode
  /** conteúdo da ampliação, se diferente da miniatura (ex.: folha com abas e zoom) */
  expanded?: React.ReactNode
  caption?: string
  action?: { label: string; href: string }
}

type AnimatedFolderProps = {
  title: string
  items: FolderItem[]
  /** texto da contagem, ex.: (n) => `${n} documentos de exemplo` */
  countLabel?: (n: number) => string
  className?: string
}

const reduzMovimento = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

const Seta = ({ lado }: { lado: "esq" | "dir" }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
    <path d={lado === "esq" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function AnimatedFolder({ title, items, countLabel = (n) => `${n} itens`, className }: AnimatedFolderProps) {
  const [hover, setHover] = React.useState(false)
  const [fixa, setFixa] = React.useState(false)
  const [aberto, setAberto] = React.useState<number | null>(null)
  const [origem, setOrigem] = React.useState<DOMRect | null>(null)
  const cardRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const pastaRef = React.useRef<HTMLButtonElement>(null)
  const id = React.useId()
  const aberta = hover || fixa
  const leque = items.slice(0, 3)

  const abrirItem = (i: number) => {
    const el = cardRefs.current[i]
    setOrigem(el ? el.getBoundingClientRect() : null)
    setAberto(i)
  }

  const fechar = () => {
    const i = aberto
    setAberto(null)
    // o foco volta para o cartão de onde saiu (ou para a pasta, se o item não está no leque)
    requestAnimationFrame(() => {
      const alvo = i !== null && i < leque.length ? cardRefs.current[i] : pastaRef.current
      alvo?.focus()
    })
  }

  return (
    <div
      className={["folder", className].filter(Boolean).join(" ")}
      data-aberta={aberta ? "true" : "false"}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}
    >
      <button
        ref={pastaRef}
        type="button"
        className="folder-button"
        aria-expanded={aberta}
        aria-controls={`${id}-cartoes`}
        aria-label={`${aberta ? "Fechar" : "Abrir"} a pasta ${title}: ${countLabel(items.length)}`}
        onClick={() => setFixa((v) => !v)}
      />
      <div className="folder-graphic" aria-hidden="true">
        <span className="folder-bg" />
        <span className="folder-tab" />
        <span className="folder-front" />
      </div>
      <ul className="folder-cards" id={`${id}-cartoes`}>
        {leque.map((it, i) => (
          <li key={it.id} className="folder-card" data-i={i} data-oculto={aberto === i ? "true" : undefined}>
            <button
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              type="button"
              tabIndex={aberta ? 0 : -1}
              aria-hidden={aberta ? undefined : true}
              aria-label={`Ampliar: ${it.title}`}
              onClick={(e) => {
                e.stopPropagation()
                abrirItem(i)
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
          <span className="folder-hint-mouse">{aberta ? "Clique numa folha para ampliar" : "Passe o mouse para abrir"}</span>
          <span className="folder-hint-touch">{aberta ? "Toque numa folha para ampliar" : "Toque para abrir"}</span>
        </p>
      </div>
      {aberto !== null && (
        <Ampliacao
          items={items}
          indice={aberto}
          origem={origem}
          titulo={title}
          onNavegar={(i) => {
            setOrigem(null)
            setAberto(i)
          }}
          onFechar={fechar}
        />
      )}
    </div>
  )
}

type AmpliacaoProps = {
  items: FolderItem[]
  indice: number
  origem: DOMRect | null
  titulo: string
  onNavegar: (i: number) => void
  onFechar: () => void
}

function Ampliacao({ items, indice, origem, titulo, onNavegar, onFechar }: AmpliacaoProps) {
  const [fase, setFase] = React.useState<"inicio" | "aberta" | "saindo">("inicio")
  const [direcao, setDirecao] = React.useState<"esq" | "dir">("dir")
  const painel = React.useRef<HTMLDivElement>(null)
  const fecharRef = React.useRef<HTMLButtonElement>(null)
  const item = items[indice]
  const temAnt = indice > 0
  const temProx = indice < items.length - 1
  const tituloId = React.useId()

  // entrada: o painel começa do tamanho e lugar do cartão e cresce até o centro (FLIP)
  const [inicial, setInicial] = React.useState<React.CSSProperties | undefined>(undefined)
  React.useLayoutEffect(() => {
    const p = painel.current
    let reserva = 0
    if (p && origem && !reduzMovimento()) {
      const r = p.getBoundingClientRect()
      const s = Math.max(origem.width / r.width, origem.height / r.height)
      const dx = origem.left + origem.width / 2 - (r.left + r.width / 2)
      const dy = origem.top + origem.height / 2 - (r.top + r.height / 2)
      setInicial({ transform: `translate(${dx}px, ${dy}px) scale(${s})`, transition: "none" })
      const crescer = () => {
        clearTimeout(reserva)
        setInicial(undefined)
        setFase("aberta")
      }
      requestAnimationFrame(() => requestAnimationFrame(crescer))
      // se o navegador atrasar os quadros (aba em segundo plano, aparelho lento), abre mesmo assim
      reserva = window.setTimeout(crescer, 150)
    } else {
      setFase("aberta")
    }
    fecharRef.current?.focus()
    const corpo = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      clearTimeout(reserva)
      document.body.style.overflow = corpo
    }
    // só na abertura
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sair = React.useCallback(() => {
    if (reduzMovimento()) return onFechar()
    setFase("saindo")
    setTimeout(onFechar, 260)
  }, [onFechar])

  const ir = React.useCallback(
    (i: number) => {
      if (i < 0 || i >= items.length || i === indice) return
      setDirecao(i > indice ? "dir" : "esq")
      onNavegar(i)
    },
    [items.length, indice, onNavegar]
  )

  React.useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        sair()
      } else if (e.key === "ArrowRight") ir(indice + 1)
      else if (e.key === "ArrowLeft") ir(indice - 1)
      else if (e.key === "Tab") {
        // o foco fica dentro da ampliação
        const raiz = painel.current?.closest(".folder-viewer")
        const focaveis = raiz ? Array.from(raiz.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]")) : []
        if (!focaveis.length) return
        const primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1]
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault()
          ultimo.focus()
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault()
          primeiro.focus()
        }
      }
    }
    document.addEventListener("keydown", tecla)
    return () => document.removeEventListener("keydown", tecla)
  }, [ir, indice, sair])

  if (!item) return null

  return createPortal(
    <div className="folder-viewer" data-fase={fase} role="dialog" aria-modal="true" aria-labelledby={tituloId}>
      <div className="folder-viewer-bg" onClick={sair} />
      <button ref={fecharRef} type="button" className="folder-viewer-close" onClick={sair} aria-label="Fechar">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
          <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>
      <button type="button" className="folder-viewer-nav folder-viewer-prev" onClick={() => ir(indice - 1)} disabled={!temAnt} aria-label="Anterior">
        <Seta lado="esq" />
      </button>
      <button type="button" className="folder-viewer-nav folder-viewer-next" onClick={() => ir(indice + 1)} disabled={!temProx} aria-label="Próximo">
        <Seta lado="dir" />
      </button>
      <div className="folder-viewer-panel" ref={painel} style={inicial}>
        <div className="folder-viewer-media" key={item.id} data-dir={direcao}>
          {item.expanded ?? item.media}
        </div>
        <div className="folder-viewer-footer">
          <p className="folder-viewer-folder">{titulo}</p>
          <h3 id={tituloId} className="folder-viewer-title">
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
                  aria-current={i === indice ? "true" : undefined}
                  onClick={() => ir(i)}
                />
              ))}
            </div>
            <span className="folder-viewer-n" aria-live="polite">
              {indice + 1} de {items.length}
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
