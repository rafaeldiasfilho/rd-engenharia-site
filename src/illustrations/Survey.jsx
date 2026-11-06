// Interactive illustration: rural property survey (boundaries, markers, water, reserve).

import { BLUE, GRAY, BROWN, INK, GREEN } from "../SheetBase";
import { Interactive } from "./illustrationParts.jsx";

/* ── Surveying and georeferencing ───────────────────────────────────────────────────────────── */

const SURVEY_ITEMS = [
  { id: "marco", color: INK, name: "Marcos nos vértices", text: "Peças fixadas em cada canto do terreno, com código próprio (M-0001, M-0002...). São elas que dão base oficial aos limites." },
  { id: "limite", color: GREEN, name: "Limite do imóvel", text: "Linha que separa o imóvel dos vizinhos. Cada lado tem azimute (direção) e distância medidos em campo." },
  { id: "curvas", color: BROWN, name: "Curvas de nível", text: "Mostram o relevo: cada linha une pontos de mesma altitude. Ajudam a planejar obras, estradas e a drenagem da água." },
  { id: "coord", color: BLUE, name: "Coordenadas", text: "Cada marco tem coordenadas E e N no sistema SIRGAS 2000, que localizam o ponto no mapa oficial usado pelo INCRA." },
  { id: "conf", color: GRAY, name: "Confrontantes", text: "Os vizinhos que fazem divisa com o imóvel, identificados no levantamento e no memorial descritivo." },
];

const MARKERS = [
  ["M-0001", 70, 70],
  ["M-0002", 300, 52],
  ["M-0003", 352, 196],
  ["M-0004", 196, 262],
  ["M-0005", 50, 222],
];

export function Survey() {
  const polygonPoints = MARKERS.map(([, x, y]) => `${x},${y}`).join(" ");
  const contours = [0, 1, 2, 3, 4].map((i) => ({
    elevation: 510 + i * 2,
    d: `M40 ${232 - i * 36}C140 ${206 - i * 36} 230 ${262 - i * 36} 380 ${214 - i * 36}`,
  }));
  return (
    <Interactive
      items={SURVEY_ITEMS}
      label="Elementos do levantamento"
      title="Desenho ilustrativo de um imóvel rural com marcos, limites, curvas de nível e coordenadas"
      titleId="t-topo"
      stamp={{ title: "Planta do imóvel georreferenciado · SIRGAS 2000 · UTM 22S", client: "Sítio Exemplo" }}
      finalCaption="Desenho ilustrativo de um levantamento. Não representa nenhuma propriedade real."
      drawing={({ opacityFor, choose }) => (
        <>
          <clipPath id="recorte-terreno">
            <polygon points={polygonPoints} />
          </clipPath>
          <polygon points={polygonPoints} fill="#eef4ec" stroke="none" />
          <g style={opacityFor("curvas")} onClick={() => choose("curvas")}>
            <g clipPath="url(#recorte-terreno)" fill="none">
              {contours.map((c) => (
                <path key={c.elevation} d={c.d} stroke={BROWN} strokeWidth={c.elevation % 10 === 0 ? 2 : 1} opacity="0.75" />
              ))}
            </g>
            {contours.slice(0, 4).map((c, i) => (
              <text key={c.elevation} x={118} y={222 - i * 36} fontSize="10" fontWeight="700" fill={BROWN} fontFamily="inherit">
                {c.elevation}
              </text>
            ))}
          </g>
          <g style={opacityFor("limite")} onClick={() => choose("limite")}>
            <polygon points={polygonPoints} fill="none" stroke={GREEN} strokeWidth="3" />
            <text x="186" y="52" fontSize="10" fill={GREEN} fontWeight="700" textAnchor="middle" transform="rotate(-4.3 186 52)" fontFamily="inherit">
              Az 85°42' · 461,20 m
            </text>
            <text x="338" y="118" fontSize="10" fill={GREEN} fontWeight="700" textAnchor="middle" transform="rotate(70 338 118)" fontFamily="inherit">
              Az 160°08' · 306,85 m
            </text>
          </g>
          <g style={opacityFor("marco")} onClick={() => choose("marco")}>
            {MARKERS.map(([id, x, y]) => (
              <g key={id}>
                <rect x={x - 6} y={y - 6} width="12" height="12" fill={INK} />
                <text x={x + (x > 200 ? 10 : -10)} y={y + (y < 100 ? -9 : 20)} fontSize="11" fontWeight="700" fill={INK} textAnchor={x > 200 ? "start" : "end"} fontFamily="inherit">
                  {id}
                </text>
              </g>
            ))}
          </g>
          <g style={opacityFor("coord")} onClick={() => choose("coord")}>
            <rect x="262" y="236" width="146" height="54" rx="6" fill="#fff" stroke={BLUE} strokeWidth="1.4" />
            <text x="272" y="253" fontSize="10" fontWeight="700" fill={BLUE} fontFamily="inherit">
              M-0003 (SIRGAS 2000)
            </text>
            <text x="272" y="268" fontSize="10" fill={INK} fontFamily="inherit">
              E 675.891,05 m
            </text>
            <text x="272" y="282" fontSize="10" fill={INK} fontFamily="inherit">
              N 7.671.607,22 m
            </text>
            <path d="M352 196L340 236" stroke={BLUE} strokeWidth="1.2" strokeDasharray="3 2" />
          </g>
          <g style={opacityFor("conf")} onClick={() => choose("conf")} fontFamily="inherit">
            <text x="160" y="30" fontSize="11" fill={GRAY}>
              Confrontante: Sítio Vizinho A
            </text>
            <text x="12" y="150" fontSize="11" fill={GRAY} transform="rotate(-90 12 150)" textAnchor="middle">
              Córrego
            </text>
            <text x="70" y="248" fontSize="11" fill={GRAY} transform="rotate(15 70 248)">
              Estrada municipal
            </text>
          </g>
          <text x="250" y="146" fontSize="14" fontWeight="700" fill={GREEN} textAnchor="middle" letterSpacing="1" fontFamily="inherit">
            ÁREA 12,46 ha
          </text>
          <g transform="translate(14 286)">
            <path d="M0 -10l5 13-5-3-5 3z" fill={INK} />
            <text x="0" y="12" fontSize="10" fontWeight="700" fill={INK} textAnchor="middle" fontFamily="inherit">
              N
            </text>
          </g>
        </>
      )}
    />
  );
}
