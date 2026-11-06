// Interactive illustration: rural property survey (boundaries, markers, water, reserve).

import { SHEET_BLUE, SHEET_GRAY, SHEET_BROWN, SHEET_INK, SHEET_GREEN } from "../SheetBase";
import { InteractiveIllustration } from "./illustrationParts.jsx";

/* ── Surveying and georeferencing ───────────────────────────────────────────────────────────── */

const SURVEY_ITEMS = [
  { id: "marker", color: SHEET_INK, name: "Marcos nos vértices", text: "Peças fixadas em cada canto do terreno, com código próprio (M-0001, M-0002...). São elas que dão base oficial aos limites." },
  { id: "boundary", color: SHEET_GREEN, name: "Limite do imóvel", text: "Linha que separa o imóvel dos vizinhos. Cada lado tem azimute (direção) e distância medidos em campo." },
  { id: "contours", color: SHEET_BROWN, name: "Curvas de nível", text: "Mostram o relevo: cada linha une pontos de mesma altitude. Ajudam a planejar obras, estradas e a drenagem da água." },
  { id: "coordinates", color: SHEET_BLUE, name: "Coordenadas", text: "Cada marco tem coordenadas E e N no sistema SIRGAS 2000, que localizam o ponto no mapa oficial usado pelo INCRA." },
  { id: "neighbors", color: SHEET_GRAY, name: "Confrontantes", text: "Os vizinhos que fazem divisa com o imóvel, identificados no levantamento e no memorial descritivo." },
];

const SURVEY_MARKERS = [
  ["M-0001", 70, 70],
  ["M-0002", 300, 52],
  ["M-0003", 352, 196],
  ["M-0004", 196, 262],
  ["M-0005", 50, 222],
];

export function Survey() {
  const polygonPoints = SURVEY_MARKERS.map(([, x, y]) => `${x},${y}`).join(" ");
  const contours = [0, 1, 2, 3, 4].map((i) => ({
    elevation: 510 + i * 2,
    d: `M40 ${232 - i * 36}C140 ${206 - i * 36} 230 ${262 - i * 36} 380 ${214 - i * 36}`,
  }));
  return (
    <InteractiveIllustration
      items={SURVEY_ITEMS}
      label="Elementos do levantamento"
      title="Desenho ilustrativo de um imóvel rural com marcos, limites, curvas de nível e coordenadas"
      titleId="t-topo"
      stamp={{ title: "Planta do imóvel georreferenciado · SIRGAS 2000 · UTM 22S", client: "Sítio Exemplo" }}
      finalCaption="Desenho ilustrativo de um levantamento. Não representa nenhuma propriedade real."
      drawing={({ opacityFor, choose }) => (
        <>
          <clipPath id="survey-plot-clip">
            <polygon points={polygonPoints} />
          </clipPath>
          <polygon points={polygonPoints} fill="#eef4ec" stroke="none" />
          <g style={opacityFor("contours")} onClick={() => choose("contours")}>
            <g clipPath="url(#survey-plot-clip)" fill="none">
              {contours.map((c) => (
                <path key={c.elevation} d={c.d} stroke={SHEET_BROWN} strokeWidth={c.elevation % 10 === 0 ? 2 : 1} opacity="0.75" />
              ))}
            </g>
            {contours.slice(0, 4).map((c, i) => (
              <text key={c.elevation} x={118} y={222 - i * 36} fontSize="10" fontWeight="700" fill={SHEET_BROWN} fontFamily="inherit">
                {c.elevation}
              </text>
            ))}
          </g>
          <g style={opacityFor("boundary")} onClick={() => choose("boundary")}>
            <polygon points={polygonPoints} fill="none" stroke={SHEET_GREEN} strokeWidth="3" />
            <text x="186" y="52" fontSize="10" fill={SHEET_GREEN} fontWeight="700" textAnchor="middle" transform="rotate(-4.3 186 52)" fontFamily="inherit">
              Az 85°42' · 461,20 m
            </text>
            <text x="338" y="118" fontSize="10" fill={SHEET_GREEN} fontWeight="700" textAnchor="middle" transform="rotate(70 338 118)" fontFamily="inherit">
              Az 160°08' · 306,85 m
            </text>
          </g>
          <g style={opacityFor("marker")} onClick={() => choose("marker")}>
            {SURVEY_MARKERS.map(([id, x, y]) => (
              <g key={id}>
                <rect x={x - 6} y={y - 6} width="12" height="12" fill={SHEET_INK} />
                <text x={x + (x > 200 ? 10 : -10)} y={y + (y < 100 ? -9 : 20)} fontSize="11" fontWeight="700" fill={SHEET_INK} textAnchor={x > 200 ? "start" : "end"} fontFamily="inherit">
                  {id}
                </text>
              </g>
            ))}
          </g>
          <g style={opacityFor("coordinates")} onClick={() => choose("coordinates")}>
            <rect x="262" y="236" width="146" height="54" rx="6" fill="#fff" stroke={SHEET_BLUE} strokeWidth="1.4" />
            <text x="272" y="253" fontSize="10" fontWeight="700" fill={SHEET_BLUE} fontFamily="inherit">
              M-0003 (SIRGAS 2000)
            </text>
            <text x="272" y="268" fontSize="10" fill={SHEET_INK} fontFamily="inherit">
              E 675.891,05 m
            </text>
            <text x="272" y="282" fontSize="10" fill={SHEET_INK} fontFamily="inherit">
              N 7.671.607,22 m
            </text>
            <path d="M352 196L340 236" stroke={SHEET_BLUE} strokeWidth="1.2" strokeDasharray="3 2" />
          </g>
          <g style={opacityFor("neighbors")} onClick={() => choose("neighbors")} fontFamily="inherit">
            <text x="160" y="30" fontSize="11" fill={SHEET_GRAY}>
              Confrontante: Sítio Vizinho A
            </text>
            <text x="12" y="150" fontSize="11" fill={SHEET_GRAY} transform="rotate(-90 12 150)" textAnchor="middle">
              Córrego
            </text>
            <text x="70" y="248" fontSize="11" fill={SHEET_GRAY} transform="rotate(15 70 248)">
              Estrada municipal
            </text>
          </g>
          <text x="250" y="146" fontSize="14" fontWeight="700" fill={SHEET_GREEN} textAnchor="middle" letterSpacing="1" fontFamily="inherit">
            ÁREA 12,46 ha
          </text>
          <g transform="translate(14 286)">
            <path d="M0 -10l5 13-5-3-5 3z" fill={SHEET_INK} />
            <text x="0" y="12" fontSize="10" fontWeight="700" fill={SHEET_INK} textAnchor="middle" fontFamily="inherit">
              N
            </text>
          </g>
        </>
      )}
    />
  );
}
