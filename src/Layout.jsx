import Icon from "./Icon";
import AreaIcon from "./AreaIcon";
import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { LiquidNavbar } from "@/components/ui/liquid-glass-navbar";
import { HalftoneWordmark } from "@/components/ui/halftone-wordmark";
import { AREAS, GUIDES, GOOGLE_REVIEWS_URL, ADDRESS, GOOGLE_RATING } from "./pagesData";
import { whatsappLink } from "./contact";
import { LEGAL_NAME, CNPJ, OPEN_SINCE, TECHNICAL_LEAD, CREA_NUMBER } from "./company";
import { SearchButton } from "./Search";

export { WHATSAPP, whatsappLink } from "./contact";

export function WhatsappButton({ text, label, className = "" }) {
  return (
    <a className={`btn btn-whatsapp ${className}`} href={whatsappLink(text)} target="_blank" rel="noopener noreferrer">
      <Icon name="fa-brands fa-whatsapp" /> {label}
    </a>
  );
}

const THEMES = [
  { id: "auto", label: "Automático" },
  { id: "light", label: "Claro" },
  { id: "dark", label: "Escuro" },
];

function ThemeSelector() {
  const [theme, setTheme] = useState("auto");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tema");
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {
      // no storage: follow the system
    }
  }, []);

  const applyTheme = (id) => {
    flushSync(() => setTheme(id));
    if (id === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", id);
    try {
      if (id === "auto") localStorage.removeItem("tema");
      else localStorage.setItem("tema", id);
    } catch {
      // the theme applies to this visit only
    }
  };

  // The new appearance opens as a circle from the button (View Transitions). Without support or with
  // "reduce motion", it switches directly.
  const chooseTheme = (id, e) => {
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion) {
      applyTheme(id);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.detail > 0 ? e.clientX : r.left + r.width / 2;
    const y = e.detail > 0 ? e.clientY : r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(() => applyTheme(id));
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 520, easing: "cubic-bezier(0.23, 1, 0.32, 1)", pseudoElement: "::view-transition-new(root)" }
        );
      })
      .catch(() => {});
  };

  return (
    <div className="theme" role="group" aria-label="Aparência do site">
      <span>Aparência</span>
      {THEMES.map((t) => (
        <button key={t.id} type="button" aria-pressed={theme === t.id} onClick={(e) => chooseTheme(t.id, e)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// "atual" is the page slug ("" on the home page). Marks the menu item with aria-current.
export function Header({ current = "" }) {
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
            data-salto={pill.jump || undefined}
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
              aria-controls="menu-servicos-painel"
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
              id="menu-servicos-painel"
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
          href={whatsappLink("Olá! Gostaria de solicitar um orçamento.")}
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
          aria-controls="menu-mobile"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="menu-icon" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      </div>

      <nav id="menu-mobile" className={`menu-mobile ${mobileOpen ? "open" : ""}`} aria-label="Menu" hidden={!mobileOpen}>
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
        <a href="/o-que-preciso" aria-current={cur(current === "o-que-preciso")} onClick={() => setMobileOpen(false)}>
          Descobrir o que o meu caso precisa
        </a>
        <a className="btn btn-whatsapp" href={whatsappLink("Olá! Gostaria de solicitar um orçamento.")} target="_blank" rel="noopener noreferrer">
          <Icon name="fa-brands fa-whatsapp" /> Pedir orçamento pelo WhatsApp
        </a>
      </nav>
    </header>
  );
}

// Trail "Início › Serviços › Segurança do trabalho". The last item is the current page.
export function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Você está aqui">
      <ol>
        <li>
          <a href="/">Início</a>
        </li>
        {items.map((it, n) => (
          <li key={it.label}>
            {it.href && n < items.length - 1 ? (
              <a href={it.href}>{it.label}</a>
            ) : (
              <span aria-current="page">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

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

// Closing block of every inner page, always in the same order: next step, related pages, footer.
export function PageClosing({ title = "Fale com o responsável técnico.", text, whatsappText, whatsappLabel = "Falar no WhatsApp", related = [] }) {
  return (
    <>
      <section className="sec next" id="proximo-passo" aria-labelledby="proximo-titulo">
        <div className="container">
          <p className="sec-n">
            <span>→</span> Próximo passo
          </p>
          <div className="next-grid reveal">
            <h2 id="proximo-titulo" className="sec-title">
              {title}
            </h2>
            <div>
              <p className="lead">
                {text || "Conte o seu caso pelo WhatsApp. A mensagem já vai pronta, sem compromisso. Valor e prazo são informados depois de conhecermos o seu caso."}
              </p>
              <WhatsappButton className="btn-large" text={whatsappText} label={whatsappLabel} />
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="sec related" aria-labelledby="rel-titulo">
          <div className="container">
            <p className="sec-n">
              <span>↗</span> Continue por aqui
            </p>
            <h2 id="rel-titulo" className="sr-only">
              Páginas relacionadas
            </h2>
            <ul className="related-list">
              {related.slice(0, 3).map((r) => (
                <li key={r.href} className="reveal">
                  <a href={r.href}>
                    {r.area && (
                      <span className="icon-tile related-icon">
                        <AreaIcon slug={r.area} size={24} />
                      </span>
                    )}
                    <small>{r.tag}</small>
                    <strong>{r.title}</strong>
                    {r.text && <span>{r.text}</span>}
                    <i aria-hidden="true">→</i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      {/* No WhatsApp invitation here: the "Próximo passo" section (or Contact, on the home page) and the floating button already do that */}
      <div className="wrap footer-grid">
        <div>
          <a className="footer-logo" href="/" aria-label="RD Engenharia, página inicial">
            <img src="/marca/marca-lockup.webp" width="720" height="396" alt="RD Engenharia, Segurança e Meio Ambiente" loading="lazy" />
          </a>
          <p className="footer-brand">{LEGAL_NAME}</p>
          <p>CNPJ {CNPJ} · ativo desde {OPEN_SINCE}</p>
          <p>
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
              {ADDRESS}
            </a>
          </p>
          <p>Segunda a sexta, das 7h às 17h</p>
          <p>
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
              {GOOGLE_RATING}
            </a>
          </p>
          <p>Responsável técnico: {TECHNICAL_LEAD} · {CREA_NUMBER}</p>
        </div>
        <div>
          <h3 className="footer-title">Serviços</h3>
          <ul>
            {AREAS.map((a) => (
              <li key={a.slug}>
                <a href={`/${a.slug}`} className="footer-area">
                  <AreaIcon slug={a.slug} size={18} /> {a.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="footer-title">Onde atendemos</h3>
          <p>Atendemos presencialmente e online em Ibirá e região.</p>
          <p>
            <a href="/onde-atendemos">Ver onde atendemos</a>
          </p>
        </div>
        <div>
          <h3 className="footer-title">Mais</h3>
          <ul>
            <li>
              <a href="/o-que-preciso">Descubra o que o seu caso precisa</a>
            </li>
            <li>
              <a href="/guias">Guias</a>
            </li>
            <li>
              <a href="/lembrete-de-vencimento">Lembrete de vencimento</a>
            </li>
            <li>
              <a href="/#duvidas">Dúvidas frequentes</a>
            </li>
            <li>
              <a href="https://www.instagram.com/rd_engenhariaibira/" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="/privacidade">Política de privacidade</a>
            </li>
            <li>
              <a href="/termos-de-uso">Termos de uso</a>
            </li>
            <li>
              <a href="/creditos">Créditos das imagens</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-end">
        <p>© RD Engenharia Segurança e Meio Ambiente</p>
        <ThemeSelector />
      </div>
      {/* Giant wordmark at the end of the page, decorative, in halftone dots that react to the pointer */}
      <HalftoneWordmark word="RD Engenharia" className="footer-halftone" />
    </footer>
  );
}

// Smooth entrance of sections: only opacity and a short offset, and only when motion is allowed.
function useReveal() {
  useEffect(() => {
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(document.querySelectorAll(".reveal"));
    if (reduceMotion || !("IntersectionObserver" in window)) return undefined;
    const vh = window.innerHeight;
    document.documentElement.classList.add("reveal-on");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92) el.classList.add("vis");
      else io.observe(el);
    });
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("reveal-on");
    };
  }, []);
}

// Thin bar at the top showing how much of the page has been read (green to lime). Transform only, one
// frame per scroll; decorative (aria-hidden). With "reduce motion" the CSS hides it.
function ReadingProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let frame = 0;
    const paint = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty("--p", max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : "0");
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return <div ref={ref} className="progress-reading" aria-hidden="true" />;
}

// Area of the current page: the area itself or the guide's area. Changes the floating WhatsApp button.
function areaForPage(currentSlug) {
  const guide = GUIDES.find((g) => g.slug === currentSlug);
  return AREAS.find((a) => a.slug === (guide ? guide.area : currentSlug)) || null;
}

// Floating WhatsApp button. On area and guide pages it becomes a pill with the subject
// ("Falar sobre AVCB e CLCB") and the message already includes the area. The pill appears only after the
// header (which already has the quote button) leaves the screen; without JavaScript it is always visible.
function FloatingWhatsapp({ current }) {
  const area = areaForPage(current);
  const [scrolledAway, setScrolledAway] = useState(true);

  useEffect(() => {
    if (!area) return undefined;
    const check = () => setScrolledAway(window.scrollY > window.innerHeight * 0.7);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [area]);

  if (!area) {
    return (
      <a
        className="whatsapp-float"
        href={whatsappLink("Olá! Gostaria de um orçamento.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar pelo WhatsApp"
      >
        <Icon name="fa-brands fa-whatsapp" />
      </a>
    );
  }
  return (
    <a
      className={`whatsapp-float whatsapp-pill ${scrolledAway ? "" : "hidden"}`}
      href={whatsappLink(`Olá! Gostaria de um orçamento na área de ${area.name}.`)}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={scrolledAway ? undefined : -1}
      aria-hidden={scrolledAway ? undefined : "true"}
      aria-label={`Falar sobre ${area.subject} pelo WhatsApp`}
    >
      <Icon name="fa-brands fa-whatsapp" />
      <span>Falar sobre {area.subject}</span>
    </a>
  );
}

// Links with an anchor (e.g. a service opened from search): ensures scrolling to the item after the
// page mounts, because the browser may try to scroll before the content is ready.
function useAnchor() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
  }, []);
}

export function Shell({ children, current = "" }) {
  useReveal();
  useAnchor();
  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <ReadingProgress />
      <Header current={current} />
      <main id="conteudo">{children}</main>
      <Footer />
      <FloatingWhatsapp current={current} />
    </>
  );
}
