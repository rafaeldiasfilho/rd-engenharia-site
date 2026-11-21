// Contents of the three header panels: services (list beside a photo of the highlighted area), guides
// (short list) and coverage (two photo cards). "current" is the page slug, used for aria-current.

import { useState } from "react";
import { AREAS } from "../content/areas";
import { COVERAGE_MENU_CARDS, GUIDES_MENU_ITEMS } from "../content/headerMenus.js";
import { PHOTOS } from "../content/photoList.js";
import { photoPath, srcset } from "../photos";
import { ServicesMenuPreview } from "./ServicesMenuPreview.jsx";

const ariaCurrentPage = (isCurrentPage) => (isCurrentPage ? "page" : undefined);

const MENU_ITEM_ARROW = (
  <svg className="menu-arrow-item" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function ServicesMenuPanel({ current }) {
  const currentIsArea = AREAS.some((menuArea) => menuArea.slug === current);
  // Area whose photo shows beside the list: the current area page, else the first area.
  const [highlightedAreaSlug, setHighlightedAreaSlug] = useState(currentIsArea ? current : AREAS[0].slug);
  return (
    <>
      <div className="menu-panel-top">
        <p className="menu-panel-title">Serviços</p>
        <p className="menu-panel-sub">{AREAS.length} áreas, presencial e online em Ibirá e região</p>
      </div>
      <div className="menu-panel-body">
        <ul>
          {AREAS.map((menuArea) => (
            <li key={menuArea.slug}>
              <a
                href={`/${menuArea.slug}`}
                aria-current={ariaCurrentPage(current === menuArea.slug)}
                className="menu-item-area"
                data-highlighted={highlightedAreaSlug === menuArea.slug || undefined}
                onPointerEnter={() => setHighlightedAreaSlug(menuArea.slug)}
                onFocus={() => setHighlightedAreaSlug(menuArea.slug)}
              >
                <span>
                  <strong>{menuArea.name}</strong>
                  <small>{menuArea.shortText}</small>
                </span>
                {MENU_ITEM_ARROW}
              </a>
            </li>
          ))}
        </ul>
        <ServicesMenuPreview highlightedAreaSlug={highlightedAreaSlug} />
      </div>
      <a className="menu-panel-footer" href="/o-que-preciso" aria-current={ariaCurrentPage(current === "o-que-preciso")}>
        <span>Não sabe qual área?</span>
        <strong>Descubra o que o seu caso precisa</strong>
      </a>
    </>
  );
}

export function GuidesMenuPanel({ current }) {
  return (
    <>
      <ul className="menu-compact">
        {GUIDES_MENU_ITEMS.map((guideMenuItem) => (
          <li key={guideMenuItem.slug}>
            <a href={guideMenuItem.href} aria-current={ariaCurrentPage(current === guideMenuItem.slug)}>
              {guideMenuItem.label}
            </a>
          </li>
        ))}
      </ul>
      <a className="menu-panel-footer" href="/guias" aria-current={ariaCurrentPage(current === "guias")}>
        <span>{GUIDES_MENU_ITEMS.length} guias</span>
        <strong>Ver todos os guias</strong>
      </a>
    </>
  );
}

export function CoverageMenuPanel({ current }) {
  return (
    <ul className="menu-cards">
      {COVERAGE_MENU_CARDS.map((coverageCard) => {
        const coveragePhoto = PHOTOS[coverageCard.photo];
        return (
          <li key={coverageCard.label}>
            <a href={coverageCard.href} className="menu-card" aria-current={ariaCurrentPage(current === "onde-atendemos")}>
              {coveragePhoto && (
                <img
                  src={photoPath(coveragePhoto)}
                  srcSet={srcset(coveragePhoto)}
                  sizes="240px"
                  width={coveragePhoto.w}
                  height={coveragePhoto.h}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              )}
              <span className="menu-card-caption">
                <strong>{coverageCard.label}</strong>
                <small>{coverageCard.text}</small>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
