// Site header: logo, areas menu, search button, WhatsApp and the full-screen mobile menu.

import Icon from "../Icon";
import AreaIcon from "../AreaIcon";
import { useEffect, useRef, useState } from "react";
import { AREAS } from "../content/areas";
import { whatsappLink } from "../contact";
import { SearchButton } from "../SearchButton";
import { useCurrentWhatsappMessage } from "../currentWhatsappMessage.js";
import { pageWhatsappMessage } from "../whatsappMessages";

// "atual" is the page slug ("" on the home page). Marks the menu item with aria-current.
export function Header({ current = "" }) {
  // Quote buttons send the message the visitor built on the page, or the page's default message.
  const currentMessage = useCurrentWhatsappMessage();
  const headerWhatsappText = currentMessage?.text || pageWhatsappMessage(current);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesBox = useRef(null);
  const servicesButton = useRef(null);
  const menuButton = useRef(null);
  const openedByKeyboard = useRef(false);
  const menu = useRef(null);
  // Opened by mouse hover only: closes when the mouse leaves. A click "pins" the panel open.
  const openedByHover = useRef(false);
  const hoverTimer = useRef(0);
  const [pill, setPill] = useState({ x: 0, w: 0, on: false, jump: true });

  const inServices = AREAS.some((a) => a.slug === current);
  const inGuides = current === "guias" || current.startsWith("guias/");
  const inCoverage = current === "onde-atendemos";
  const cur = (v) => (v ? "page" : undefined);

  useEffect(() => {
    if (!servicesOpen) return undefined;
    const onPointerOutside = (e) => {
      if (servicesBox.current && !servicesBox.current.contains(e.target)) {
        openedByHover.current = false;
        setServicesOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        openedByHover.current = false;
        setServicesOpen(false);
        servicesButton.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [servicesOpen]);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const movePill = (e) => {
    if (e.pointerType !== "mouse" || !menu.current) return;
    const m = menu.current.getBoundingClientRect();
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left - m.left - menu.current.clientLeft;
    setPill((p) => ({ x, w: r.width, on: true, jump: !p.on }));
  };

  const enterServices = (e) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(hoverTimer.current);
    if (servicesOpen) return;
    hoverTimer.current = setTimeout(() => {
      openedByHover.current = true;
      openedByKeyboard.current = false;
      setServicesOpen(true);
    }, 70);
  };

  const leaveServices = (e) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(hoverTimer.current);
    if (!openedByHover.current) return;
    hoverTimer.current = setTimeout(() => {
      openedByHover.current = false;
      setServicesOpen(false);
    }, 200);
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

  return (
    <header className="top">
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
          onPointerLeave={() => setPill((p) => ({ ...p, on: false }))}
        >
          <span
            className="menu-pill"
            aria-hidden="true"
            data-on={pill.on || undefined}
            data-jump={pill.jump || undefined}
            style={{ "--x": `${pill.x}px`, "--w": `${pill.w}px` }}
          />
          <div
            className="menu-services"
            ref={servicesBox}
            onPointerEnter={enterServices}
            onPointerLeave={leaveServices}
            onBlur={(e) => {
              if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) {
                openedByHover.current = false;
                setServicesOpen(false);
              }
            }}
          >
            <button
              type="button"
              ref={servicesButton}
              className={inServices ? "current" : ""}
              aria-expanded={servicesOpen}
              aria-controls="services-menu-panel"
              onPointerEnter={movePill}
              onClick={(e) => {
                openedByKeyboard.current = e.detail === 0; // opened by keyboard: no animation
                clearTimeout(hoverTimer.current);
                if (e.detail > 0 && openedByHover.current) {
                  openedByHover.current = false;
                  setServicesOpen(true);
                  return;
                }
                openedByHover.current = false;
                setServicesOpen((v) => !v);
              }}
            >
              Serviços
              <svg className="arrow-menu" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div
              id="services-menu-panel"
              className={`menu-panel ${servicesOpen ? "open" : ""} ${openedByKeyboard.current ? "keyboard" : ""}`}
              hidden={!servicesOpen}
            >
              <div className="menu-panel-top">
                <p className="menu-panel-title">Serviços</p>
                <p className="menu-panel-sub">{AREAS.length} áreas, presencial e online em Ibirá e região</p>
              </div>
              <ul>
                {AREAS.map((a) => (
                  <li key={a.slug}>
                    <a href={`/${a.slug}`} aria-current={cur(current === a.slug)} className="menu-item-area">
                      <span className="icon-tile">
                        <AreaIcon slug={a.slug} size={22} />
                      </span>
                      <span>
                        <strong>{a.name}</strong>
                        <small>{a.shortText}</small>
                      </span>
                      <svg className="menu-arrow-item" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
              <a className="menu-panel-footer" href="/o-que-preciso" aria-current={cur(current === "o-que-preciso")}>
                <span>Não sabe qual área?</span>
                <strong>Descubra o que o seu caso precisa</strong>
              </a>
            </div>
          </div>
          <a href="/guias" className={inGuides ? "current" : ""} aria-current={cur(current === "guias")} onPointerEnter={movePill}>
            Guias
          </a>
          <a href="/onde-atendemos" className={inCoverage ? "current" : ""} aria-current={cur(inCoverage)} onPointerEnter={movePill}>
            Onde atendemos
          </a>
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
