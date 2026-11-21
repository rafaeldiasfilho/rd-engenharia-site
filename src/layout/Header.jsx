// Site header: logo on the left, the three menus centred (services, guides, coverage), search and WhatsApp
// on the right, and the full-screen mobile menu. On the home page it is transparent over the hero photo.

import Icon from "../Icon";
import AreaIcon from "../AreaIcon";
import { useEffect, useRef, useState } from "react";
import { AREAS } from "../content/areas";
import { whatsappLink } from "../contact";
import { SearchButton } from "../SearchButton";
import { HeaderDropdown } from "./HeaderDropdown.jsx";
import { CoverageMenuPanel, GuidesMenuPanel, ServicesMenuPanel } from "./HeaderMenuPanels.jsx";
import { useHeaderOverHero } from "./useHeaderOverHero.js";
import { useCurrentWhatsappMessage } from "../currentWhatsappMessage.js";
import { pageWhatsappMessage } from "../whatsappMessages";

// "current" is the page slug ("" on the home page). Marks the menu item with aria-current.
export function Header({ current = "" }) {
  // Quote buttons send the message the visitor built on the page, or the page's default message.
  const currentMessage = useCurrentWhatsappMessage();
  const headerWhatsappText = currentMessage?.text || pageWhatsappMessage(current);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuButton = useRef(null);
  const menu = useRef(null);
  const [pill, setPill] = useState({ x: 0, w: 0, on: false, jump: true });
  const headerIsOverHero = useHeaderOverHero(current === "");

  const inServices = AREAS.some((a) => a.slug === current);
  const inGuides = current === "guias" || current.startsWith("guias/");
  const inCoverage = current === "onde-atendemos";
  const cur = (v) => (v ? "page" : undefined);

  // Background that slides to the menu item under the mouse.
  const movePill = (e) => {
    if (e.pointerType !== "mouse" || !menu.current) return;
    const m = menu.current.getBoundingClientRect();
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left - m.left - menu.current.clientLeft;
    setPill((p) => ({ x, w: r.width, on: true, jump: !p.on }));
  };

  // Esc closes the mobile menu and returns focus to the button that opened it.
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const dropdownProps = { openMenuId, setOpenMenuId, onTriggerPointerEnter: movePill };

  return (
    <header className="top" data-over-hero={(headerIsOverHero && !mobileOpen) || undefined}>
      <div className="top-inner">
        <a className="brand" href="/">
          <span className="brand-initials">
            <img src="/marca/marca-rd.webp" width="320" height="128" alt="" />
          </span>
          <span className="brand-name">
            <strong>RD Engenharia</strong>{" "}
            <small>Segurança e meio ambiente</small>
            <span className="sr-only">, página inicial</span>
          </span>
        </a>

        <nav
          className="menu"
          aria-label="Principal"
          ref={menu}
          data-menu-open={openMenuId || undefined}
          onPointerLeave={() => setPill((p) => ({ ...p, on: false }))}
        >
          <span
            className="menu-pill"
            aria-hidden="true"
            data-on={pill.on || undefined}
            data-jump={pill.jump || undefined}
            style={{ "--x": `${pill.x}px`, "--w": `${pill.w}px` }}
          />
          <HeaderDropdown menuId="services" label="Serviços" isCurrent={inServices} panelClassName="menu-panel-services" {...dropdownProps}>
            <ServicesMenuPanel current={current} />
          </HeaderDropdown>
          <HeaderDropdown menuId="guides" label="Guias" isCurrent={inGuides} panelClassName="menu-panel-guides" {...dropdownProps}>
            <GuidesMenuPanel current={current} />
          </HeaderDropdown>
          <HeaderDropdown menuId="coverage" label="Onde atendemos" isCurrent={inCoverage} panelClassName="menu-panel-coverage" {...dropdownProps}>
            <CoverageMenuPanel current={current} />
          </HeaderDropdown>
        </nav>

        <SearchButton />

        <a
          className="btn btn-whatsapp top-whatsapp"
          href={whatsappLink(headerWhatsappText)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="fa-brands fa-whatsapp" /> WhatsApp
        </a>

        <button
          ref={menuButton}
          className="menu-button"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="menu-icon" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      </div>

      <nav id="mobile-menu" className={`menu-mobile ${mobileOpen ? "open" : ""}`} aria-label="Menu" hidden={!mobileOpen}>
        <a className="menu-mobile-card" href="/o-que-preciso" aria-current={cur(current === "o-que-preciso")} onClick={() => setMobileOpen(false)}>
          <strong>Não sabe o nome do documento?</strong>
          <span>Descubra em poucas perguntas →</span>
        </a>
        <p className="menu-mobile-title">Serviços</p>
        {AREAS.map((a) => (
          <a key={a.slug} className="menu-mobile-area" href={`/${a.slug}`} aria-current={cur(current === a.slug)} onClick={() => setMobileOpen(false)}>
            <AreaIcon slug={a.slug} size={22} /> {a.name}
          </a>
        ))}
        <p className="menu-mobile-title">Mais</p>
        <a href="/guias" aria-current={cur(current === "guias")} onClick={() => setMobileOpen(false)}>
          Guias
        </a>
        <a href="/onde-atendemos" aria-current={cur(inCoverage)} onClick={() => setMobileOpen(false)}>
          Onde atendemos
        </a>
        <a href="/lembrete-de-vencimento" aria-current={cur(current === "lembrete-de-vencimento")} onClick={() => setMobileOpen(false)}>
          Lembrete de vencimento
        </a>
        <a className="btn btn-whatsapp" href={whatsappLink(headerWhatsappText)} target="_blank" rel="noopener noreferrer">
          <Icon name="fa-brands fa-whatsapp" /> Pedir orçamento pelo WhatsApp
        </a>
      </nav>
    </header>
  );
}
