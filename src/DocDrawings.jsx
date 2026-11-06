// Technical content of the example sheets: the drawings on the drawing sheets and the "inner page" of each cover.
// Everything is fictional ("Exemplo" client, made-up numbers), but follows the real conventions of each document,
// so the visitor recognizes what they will receive. Coordinates on the 150 × 198 sheet.

import { SHEET_BORDER, SHEET_GRAY, SHEET_GREEN, Logo, clientFor, wrapText } from "./SheetBase";
import { ShopPlan } from "./drawings/ShopPlan.jsx";
import { HousePlan } from "./drawings/HousePlan.jsx";
import { Schedule } from "./drawings/Schedule.jsx";
import { CarMap } from "./drawings/CarMap.jsx";
import { GeorefPlan } from "./drawings/GeorefPlan.jsx";
import { ContourPlan } from "./drawings/ContourPlan.jsx";
import { INNER_PAGES_TABLES } from "./drawings/innerPagesTables.jsx";
import { INNER_PAGES_CHARTS } from "./drawings/innerPagesCharts.jsx";
import { SheetText } from "./drawings/drawingParts.jsx";
import { InnerPageParagraph } from "./drawings/innerPageParts.jsx";

// The drawing on the sheet (area from x 9 to 141 and y 9 to 122; the title block starts at y 126).
export function Drawing({ type, uid }) {
  switch (type) {
    case "fireSafetyPlan":
      return <ShopPlan />;
    case "escapeRoutePlan":
      return <ShopPlan route />;
    case "floorPlan":
      return <HousePlan />;
    case "asbuilt":
      return <HousePlan asbuilt />;
    case "gantt":
      return <Schedule />;
    case "car":
      return <CarMap uid={uid} />;
    case "georeferencingPlan":
      return <GeorefPlan />;
    case "contourPlan":
      return <ContourPlan uid={uid} />;
    default:
      return null;
  }
}

// Each cover gets an inner page: { idx, intro, body(m) }, looked up by the sheet's "body" key.
const INNER_PAGES = { ...INNER_PAGES_TABLES, ...INNER_PAGES_CHARTS };

export const HAS_INNER_PAGE = new Set(Object.keys(INNER_PAGES));

export function InnerPage({ m, area }) {
  const page = INNER_PAGES[m.body];
  if (!page) return null;
  const [client] = clientFor(m, area);
  const intro = typeof page.intro === "function" ? page.intro(m) : page.intro;
  const i = page.idx ?? 1;
  const section = m.contents?.[i] ? `${i + 1}. ${m.contents[i]}` : m.doc || m.subtitle;
  return (
    <g fontFamily="inherit">
      <Logo x={10} y={7} s={0.62} />
      <SheetText x={140} y={11} s={2.6} c={SHEET_GRAY} a="end">
        {m.ref || m.title}
      </SheetText>
      <SheetText x={140} y={15.2} s={2.6} c={SHEET_GRAY} a="end">
        Página 4 de 18
      </SheetText>
      <line x1="10" y1="19.5" x2="140" y2="19.5" stroke={SHEET_GREEN} strokeWidth="0.5" />
      {wrapText(section, 34)
        .slice(0, 2)
        .map((l, k) => (
          <SheetText key={l} x={10} y={30 + k * 5.6} s={4.4} b>
            {l}
          </SheetText>
        ))}
      {intro && <InnerPageParagraph y={wrapText(section, 34).length > 1 ? 43 : 38} s={2.6} c={SHEET_GRAY} max={88} text={intro} />}
      {page.body(m)}
      <line x1="10" y1="182" x2="140" y2="182" stroke={SHEET_BORDER} strokeWidth="0.5" />
      <SheetText x={10} y={187.4} s={2.4} c={SHEET_GRAY}>
        {client} · {m.title}
      </SheetText>
      <SheetText x={140} y={187.4} s={2.4} c={SHEET_GRAY} a="end">
        Revisão 00 · RD Engenharia
      </SheetText>
    </g>
  );
}

/* ── "Como ler" (how to read): numbered pins on the sheet ───────────────────────────────────────────────── */

export const PINS = {
  cover: [
    { x: 4.6, y: 47, t: "Nome do documento e a norma que ele atende." },
    { x: 4.6, y: 118, t: "Contratante: a sua empresa ou você." },
    { x: 4.6, y: 150, t: "Responsável técnico, com o registro no CREA." },
    { x: 145.4, y: 147, t: "ART: registro, no CREA, de quem responde tecnicamente pelo serviço." },
    { x: 4.6, y: 186, t: "Data e revisão: mostram se o documento está atualizado." },
  ],
  drawingSheet: [
    { x: 75, y: 62, t: "O desenho: planta, mapa ou cronograma, com escala e orientação." },
    { x: 54, y: 133, t: "Carimbo: o título da prancha." },
    { x: 145.4, y: 148, t: "Cliente e local do imóvel ou da empresa." },
    { x: 145.4, y: 174, t: "Responsável técnico, com o registro no CREA." },
    { x: 4.6, y: 187, t: "Escala, data, número da folha e se há ART." },
  ],
  certificate: [
    { x: 75, y: 57, t: "Tipo de certificado e treinamento." },
    { x: 75, y: 104, t: "Treinamento concluído e a norma a que ele se refere." },
    { x: 107, y: 167, t: "Assinaturas do instrutor e do responsável técnico (em branco no exemplo)." },
  ],
};
