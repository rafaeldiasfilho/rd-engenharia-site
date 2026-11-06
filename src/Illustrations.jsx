import { useState } from "react";
import { AZUL, BORDA, CINZA, FUNDO, LINHA, MARROM, PAPEL, TINTA, VERDE, VERMELHO, SeloExemplo } from "./SheetBase";

// Illustrative drawings and template, on the same paper and stamp as the sample sheets. Nothing here comes
// from a real client. Each drawing is interactive: tapping a legend item (or the drawing) highlights the element
// and explains what it is.

const LABEL = { fontSize: 11, fill: CINZA, fontFamily: "inherit" };
const LABEL_BOLD = { ...LABEL, fill: TINTA, fontWeight: 700 };

// Title-block style footer, the same in every drawing.
function Stamp({ title, client }) {
  return (
    <g fontFamily="inherit">
      <rect x="0" y="300" width="420" height="34" fill={FUNDO} />
      <line x1="0" y1="300" x2="420" y2="300" stroke={BORDA} />
      <rect x="14" y="309" width="16" height="16" rx="3.4" fill={VERDE} />
      <text x="22" y="320.4" fontSize="7.4" fontWeight="700" fill="#fff" textAnchor="middle">
        RD
      </text>
      <text x="38" y="315" fontSize="9.6" fontWeight="700" fill={TINTA}>
        {title}
      </text>
      <text x="38" y="327" fontSize="8.6" fill={CINZA}>
        {client} · RD Engenharia
      </text>
    </g>
  );
}

function Interactive({ items, label, title, titleId, finalCaption, drawing, help, stamp }) {
  const [active, setActive] = useState("");
  const choose = (id) => setActive((a) => (a === id ? "" : id));
  const opacityFor = (id) => ({
    opacity: !active || active === id ? 1 : 0.18,
    cursor: "pointer",
    transition: "opacity .2s",
  });
  const current = items.find((x) => x.id === active);
  return (
    <figure className="illustration">
      <svg viewBox="0 0 420 334" role="img" aria-labelledby={titleId}>
        <title id={titleId}>{title}</title>
        <rect x="0" y="0" width="420" height="334" fill={PAPEL} />
        {drawing({ opacityFor, choose })}
        <Stamp {...stamp} />
        <SeloExemplo x={318} y={10} rot={-6} s={1.7} />
      </svg>
      <ul className="caption" aria-label={label}>
        {items.map((x) => (
          <li key={x.id}>
            <button type="button" aria-pressed={active === x.id} onClick={() => choose(x.id)}>
              <i style={{ background: x.color }} aria-hidden="true" /> {x.name}
            </button>
          </li>
        ))}
      </ul>
      <p className="illustration-explain" aria-live="polite">
        {current ? (
          <>
            <strong>{current.name}.</strong> {current.text}
          </>
        ) : (
          help || "Toque num item acima, ou no desenho, para ver o que ele significa."
        )}
      </p>
      <figcaption>{finalCaption}</figcaption>
    </figure>
  );
}

/* ── Fire safety ────────────────────────────────────────────────────────────────────────────── */

const EXIT_GREEN = "#2f8f46";
const LIGHT_YELLOW = "#f2c230";

const FIRE_ITEMS = [
  { id: "extintor", color: VERMELHO, name: "Extintor", text: "Primeiro combate ao fogo. O projeto define o tipo (aqui, pó químico ABC), quantos são e onde ficam, sempre sinalizados e fáceis de alcançar." },
  { id: "luz", color: LIGHT_YELLOW, name: "Iluminação de emergência", text: "Acende sozinha quando falta energia, para que as pessoas enxerguem o caminho até a saída." },
  { id: "rota", color: EXIT_GREEN, name: "Rota de fuga", text: "Caminho até a saída, que precisa ficar sempre livre de mercadorias e obstáculos." },
  { id: "placa", color: "#1f6b36", name: "Placa de saída", text: "Placa fotoluminescente que indica a saída mesmo no escuro. Fica sobre a porta e nas mudanças de direção." },
];

function FireSafety() {
  const wall = { stroke: TINTA, fill: "none", strokeLinecap: "square" };
  return (
    <Interactive
      items={FIRE_ITEMS}
      label="Elementos da planta"
      title="Planta ilustrativa de segurança contra incêndio de um pequeno comércio"
      titleId="t-bomb"
      stamp={{ title: "Planta de medidas de segurança contra incêndio", client: "Comércio Exemplo Ltda." }}
      finalCaption="Desenho ilustrativo de um projeto de incêndio. Não representa nenhum imóvel real."
      drawing={({ opacityFor, choose }) => (
        <>
          <g {...wall}>
            <rect x="24" y="40" width="372" height="232" strokeWidth="5" />
            <path d="M262 40V272M262 160H396M330 160V272" strokeWidth="3" />
          </g>
          {/* openings and doors */}
          <g fill={PAPEL}>
            <rect x="112" y="268" width="44" height="8" />
            <rect x="259" y="88" width="6" height="22" />
            <rect x="272" y="157" width="22" height="6" />
            <rect x="340" y="157" width="22" height="6" />
          </g>
          <g stroke={TINTA} fill="none" strokeWidth="1.4">
            <path d="M112 272v22M156 272v22" />
            <path d="M134 272a22 22 0 0 1 -22 22M134 272a22 22 0 0 0 22 22" strokeWidth="0.8" strokeDasharray="3 2" />
            <path d="M262 88h22" />
            <path d="M262 110A22 22 0 0 0 284 88" strokeWidth="0.8" strokeDasharray="3 2" />
            <path d="M272 160v22M340 160v22" />
            <path d="M294 160A22 22 0 0 1 272 182M362 160A22 22 0 0 1 340 182" strokeWidth="0.8" strokeDasharray="3 2" />
          </g>
          <text x="140" y="120" style={LABEL_BOLD} textAnchor="middle">
            LOJA
          </text>
          <text x="140" y="134" style={LABEL} textAnchor="middle">
            186,40 m²
          </text>
          <text x="330" y="96" style={LABEL_BOLD} textAnchor="middle">
            ESTOQUE
          </text>
          <text x="296" y="226" style={LABEL_BOLD} textAnchor="middle">
            WC
          </text>
          <text x="364" y="226" style={LABEL_BOLD} textAnchor="middle">
            ESCRIT.
          </text>
          <g style={opacityFor("rota")} onClick={() => choose("rota")}>
            <path d="M360 236L352 172L320 140L262 102L180 170L136 252" fill="none" stroke={EXIT_GREEN} strokeWidth="3" strokeDasharray="9 6" strokeLinecap="round" />
            <path d="M136 262l-8 -12h16z" fill={EXIT_GREEN} />
          </g>
          <g style={opacityFor("placa")} onClick={() => choose("placa")}>
            <rect x="112" y="244" width="44" height="16" rx="2" fill="#1f6b36" />
            <text x="134" y="256" fontSize="10" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="inherit">
              SAÍDA
            </text>
            <rect x="230" y="96" width="26" height="12" rx="2" fill="#1f6b36" />
            <path d="M236 102h12m-4 -4 4 4-4 4" stroke="#fff" strokeWidth="1.6" fill="none" />
          </g>
          <g style={opacityFor("extintor")} onClick={() => choose("extintor")}>
            {[
              [50, 250],
              [210, 62],
              [280, 132],
              [374, 252],
            ].map(([x, y]) => (
              <g key={`${x}-${y}`}>
                <circle cx={x} cy={y} r="10" fill={VERMELHO} />
                <text x={x} y={y + 4} fontSize="11" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="inherit">
                  E
                </text>
              </g>
            ))}
          </g>
          <g style={opacityFor("luz")} onClick={() => choose("luz")} fill={LIGHT_YELLOW} stroke="#7a5b00" strokeWidth="1.2">
            {[
              [80, 90],
              [200, 90],
              [80, 200],
              [200, 200],
              [330, 70],
              [296, 196],
            ].map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x - 10} y={y - 5} width="20" height="10" rx="2" />
            ))}
          </g>
          <g transform="translate(14 286)">
            <path d="M0 -10l5 13-5-3-5 3z" fill={TINTA} />
            <text x="0" y="12" fontSize="10" fontWeight="700" fill={TINTA} textAnchor="middle" fontFamily="inherit">
              N
            </text>
          </g>
          <text x="24" y="28" style={LABEL}>
            Escala 1:100 · área 288,00 m²
          </text>
        </>
      )}
    />
  );
}

/* ── Surveying and georeferencing ───────────────────────────────────────────────────────────── */

const SURVEY_ITEMS = [
  { id: "marco", color: TINTA, name: "Marcos nos vértices", text: "Peças fixadas em cada canto do terreno, com código próprio (M-0001, M-0002...). São elas que dão base oficial aos limites." },
  { id: "limite", color: VERDE, name: "Limite do imóvel", text: "Linha que separa o imóvel dos vizinhos. Cada lado tem azimute (direção) e distância medidos em campo." },
  { id: "curvas", color: MARROM, name: "Curvas de nível", text: "Mostram o relevo: cada linha une pontos de mesma altitude. Ajudam a planejar obras, estradas e a drenagem da água." },
  { id: "coord", color: AZUL, name: "Coordenadas", text: "Cada marco tem coordenadas E e N no sistema SIRGAS 2000, que localizam o ponto no mapa oficial usado pelo INCRA." },
  { id: "conf", color: CINZA, name: "Confrontantes", text: "Os vizinhos que fazem divisa com o imóvel, identificados no levantamento e no memorial descritivo." },
];

const MARKERS = [
  ["M-0001", 70, 70],
  ["M-0002", 300, 52],
  ["M-0003", 352, 196],
  ["M-0004", 196, 262],
  ["M-0005", 50, 222],
];

function Survey() {
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
                <path key={c.elevation} d={c.d} stroke={MARROM} strokeWidth={c.elevation % 10 === 0 ? 2 : 1} opacity="0.75" />
              ))}
            </g>
            {contours.slice(0, 4).map((c, i) => (
              <text key={c.elevation} x={118} y={222 - i * 36} fontSize="10" fontWeight="700" fill={MARROM} fontFamily="inherit">
                {c.elevation}
              </text>
            ))}
          </g>
          <g style={opacityFor("limite")} onClick={() => choose("limite")}>
            <polygon points={polygonPoints} fill="none" stroke={VERDE} strokeWidth="3" />
            <text x="186" y="52" fontSize="10" fill={VERDE} fontWeight="700" textAnchor="middle" transform="rotate(-4.3 186 52)" fontFamily="inherit">
              Az 85°42' · 461,20 m
            </text>
            <text x="338" y="118" fontSize="10" fill={VERDE} fontWeight="700" textAnchor="middle" transform="rotate(70 338 118)" fontFamily="inherit">
              Az 160°08' · 306,85 m
            </text>
          </g>
          <g style={opacityFor("marco")} onClick={() => choose("marco")}>
            {MARKERS.map(([id, x, y]) => (
              <g key={id}>
                <rect x={x - 6} y={y - 6} width="12" height="12" fill={TINTA} />
                <text x={x + (x > 200 ? 10 : -10)} y={y + (y < 100 ? -9 : 20)} fontSize="11" fontWeight="700" fill={TINTA} textAnchor={x > 200 ? "start" : "end"} fontFamily="inherit">
                  {id}
                </text>
              </g>
            ))}
          </g>
          <g style={opacityFor("coord")} onClick={() => choose("coord")}>
            <rect x="262" y="236" width="146" height="54" rx="6" fill="#fff" stroke={AZUL} strokeWidth="1.4" />
            <text x="272" y="253" fontSize="10" fontWeight="700" fill={AZUL} fontFamily="inherit">
              M-0003 (SIRGAS 2000)
            </text>
            <text x="272" y="268" fontSize="10" fill={TINTA} fontFamily="inherit">
              E 675.891,05 m
            </text>
            <text x="272" y="282" fontSize="10" fill={TINTA} fontFamily="inherit">
              N 7.671.607,22 m
            </text>
            <path d="M352 196L340 236" stroke={AZUL} strokeWidth="1.2" strokeDasharray="3 2" />
          </g>
          <g style={opacityFor("conf")} onClick={() => choose("conf")} fontFamily="inherit">
            <text x="160" y="30" fontSize="11" fill={CINZA}>
              Confrontante: Sítio Vizinho A
            </text>
            <text x="12" y="150" fontSize="11" fill={CINZA} transform="rotate(-90 12 150)" textAnchor="middle">
              Córrego
            </text>
            <text x="70" y="248" fontSize="11" fill={CINZA} transform="rotate(15 70 248)">
              Estrada municipal
            </text>
          </g>
          <text x="250" y="146" fontSize="14" fontWeight="700" fill={VERDE} textAnchor="middle" letterSpacing="1" fontFamily="inherit">
            ÁREA 12,46 ha
          </text>
          <g transform="translate(14 286)">
            <path d="M0 -10l5 13-5-3-5 3z" fill={TINTA} />
            <text x="0" y="12" fontSize="10" fontWeight="700" fill={TINTA} textAnchor="middle" fontFamily="inherit">
              N
            </text>
          </g>
        </>
      )}
    />
  );
}

/* ── Risk map ───────────────────────────────────────────────────────────────────────────────── */

// Risk map convention: one colour per group; the circle size shows the intensity
// (small, medium, large) and the number shows how many workers are exposed.
const RISK_ITEMS = [
  { id: "fisico", color: "#2e9e4d", name: "Físico", text: "Ruído, calor, vibração. Aqui: a serra do corte (risco grande). Na prática: protetor auricular, manutenção e pausas." },
  { id: "quimico", color: VERMELHO, name: "Químico", text: "Tintas, solventes, poeiras e vapores. Aqui: a cabine de pintura. Na prática: exaustão, máscara adequada e produtos identificados." },
  { id: "biologico", color: MARROM, name: "Biológico", text: "Fungos, bactérias e vírus. Aqui: a limpeza dos banheiros. Na prática: luvas, produtos de limpeza e higiene das mãos." },
  { id: "ergo", color: "#e3b007", name: "Ergonômico", text: "Postura, esforço e repetição. Aqui: a bancada de montagem e o escritório. Na prática: altura certa, cadeiras ajustáveis e pausas." },
  { id: "acidente", color: AZUL, name: "Acidente", text: "Cortes, quedas e choques. Aqui: a serra e o empilhamento no depósito. Na prática: proteção nas máquinas, piso organizado e sinalização." },
];

const RADIUS = { P: 13, M: 20, G: 28 };

function RiskCircle({ x, y, size, color, n, ...handlers }) {
  return (
    <g {...handlers}>
      <circle cx={x} cy={y} r={RADIUS[size]} fill={color} fillOpacity=".72" stroke="#fff" strokeWidth="2" />
      <text x={x} y={y + 4.5} fontSize="13" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="inherit">
        {n}
      </text>
    </g>
  );
}

function RiskMap() {
  const color = Object.fromEntries(RISK_ITEMS.map((x) => [x.id, x.color]));
  return (
    <Interactive
      items={RISK_ITEMS}
      label="Grupos de risco"
      title="Mapa de riscos ilustrativo de uma pequena oficina, com cinco grupos de risco"
      titleId="t-risco"
      stamp={{ title: "Mapa de riscos · oficina", client: "Empresa Exemplo Ltda." }}
      help="Cada cor é um grupo de risco. O tamanho do círculo mostra a intensidade, e o número, quantas pessoas estão expostas."
      finalCaption="Mapa de riscos ilustrativo. Não representa nenhuma empresa real."
      drawing={({ opacityFor, choose }) => {
        const r = (id) => ({ style: opacityFor(id), onClick: () => choose(id) });
        return (
          <>
            <g stroke={TINTA} fill="none">
              <rect x="20" y="40" width="380" height="216" strokeWidth="4" />
              <path d="M200 40V150M20 150H120M160 150H260M300 150H400M290 150V256M340 150V256" strokeWidth="2" />
            </g>
            <g fontFamily="inherit">
              <text x="110" y="60" style={LABEL_BOLD} textAnchor="middle">
                CORTE
              </text>
              <text x="300" y="60" style={LABEL_BOLD} textAnchor="middle">
                PINTURA
              </text>
              <text x="150" y="244" style={LABEL_BOLD} textAnchor="middle">
                MONTAGEM
              </text>
              <text x="315" y="244" style={LABEL_BOLD} textAnchor="middle">
                WC
              </text>
              <text x="370" y="244" style={LABEL_BOLD} textAnchor="middle">
                ESCRIT.
              </text>
            </g>
            <rect x="60" y="88" width="56" height="30" fill={LINHA} stroke={BORDA} />
            <rect x="250" y="80" width="90" height="46" fill={LINHA} stroke={BORDA} />
            <rect x="80" y="180" width="120" height="26" fill={LINHA} stroke={BORDA} />
            <RiskCircle x={96} y={104} size="G" color={color.fisico} n="3" {...r("fisico")} />
            <RiskCircle x={150} y={112} size="M" color={color.acidente} n="3" {...r("acidente")} />
            <RiskCircle x={300} y={104} size="G" color={color.quimico} n="2" {...r("quimico")} />
            <RiskCircle x={140} y={196} size="M" color={color.ergo} n="4" {...r("ergo")} />
            <RiskCircle x={240} y={206} size="P" color={color.acidente} n="1" {...r("acidente")} />
            <RiskCircle x={315} y={196} size="P" color={color.biologico} n="1" {...r("biologico")} />
            <RiskCircle x={370} y={196} size="P" color={color.ergo} n="2" {...r("ergo")} />
            <text x="240" y="236" style={LABEL} textAnchor="middle">
              depósito
            </text>
            <g transform="translate(22 270)" fontFamily="inherit">
              <text x="0" y="12" fontSize="10" fontWeight="700" fill={CINZA}>
                INTENSIDADE
              </text>
              {[
                ["P", "pequena", 96],
                ["M", "média", 168],
                ["G", "grande", 232],
              ].map(([t, label, x]) => (
                <g key={t}>
                  <circle cx={x} cy={8} r={RADIUS[t] * 0.42} fill="none" stroke={TINTA} strokeWidth="1.2" />
                  <text x={x + RADIUS[t] * 0.42 + 5} y={12} fontSize="10" fill={TINTA}>
                    {label}
                  </text>
                </g>
              ))}
              <text x="290" y="12" fontSize="10" fill={CINZA}>
                nº = pessoas expostas
              </text>
            </g>
          </>
        );
      }}
    />
  );
}

/* ── PGR template (a real table, readable on a phone) ───────────────────────────────────────── */

const PGR_COLUMNS = [
  ["Setor", "Onde o trabalho acontece."],
  ["Perigo", "O que pode causar dano: máquina, produto, postura, altura."],
  ["Possível lesão", "O que pode acontecer com a pessoa se nada for feito."],
  ["Nível", "Probabilidade × severidade. Define a urgência: baixo, moderado ou alto."],
  ["Medida de prevenção", "O que a empresa faz para eliminar ou reduzir o risco, com responsável e prazo no plano de ação."],
];

const PGR_ROWS = [
  ["Produção", "Ruído de máquinas", "Perda auditiva", "Moderado", "Protetor auricular e manutenção"],
  ["Produção", "Partes móveis da serra", "Cortes e esmagamento", "Alto", "Proteção fixa e bloqueio na manutenção"],
  ["Depósito", "Materiais empilhados", "Queda de objetos", "Moderado", "Prateleiras fixas e limite de altura"],
  ["Escritório", "Postura sentada por horas", "Dor nas costas", "Baixo", "Cadeira ajustável e pausas"],
];

function PgrTemplate() {
  const [col, setCol] = useState(-1);
  return (
    <figure className="template">
      <div className="template-sheet" role="group" aria-label="Modelo ilustrativo do inventário de riscos de um PGR de uma empresa fictícia">
        <span className="badge-example" aria-hidden="true">
          EXEMPLO
        </span>
        <div className="template-head">
          <span className="template-brand" aria-hidden="true">
            RD
          </span>
          <div>
            <p className="template-type">PGR · NR-01 · Página 4 de 18</p>
            <h3>2. Inventário de riscos</h3>
          </div>
        </div>
        <p className="template-small">Empresa Exemplo Ltda. · CNPJ 00.000.000/0001-00 · Empresa fictícia</p>
        <div className="template-scroll">
          <table>
            <thead>
              <tr>
                {PGR_COLUMNS.map(([name], i) => (
                  <th key={name} scope="col">
                    <button type="button" aria-pressed={col === i} onClick={() => setCol((c) => (c === i ? -1 : i))}>
                      {name}
                      <span aria-hidden="true">?</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PGR_ROWS.map((l, r) => (
                <tr key={r}>
                  {l.map((c, i) => (
                    <td key={i} data-ativa={col === i ? "" : undefined}>
                      {i === 3 ? <span className={`level nivel-${c.toLowerCase()}`}>{c}</span> : c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="template-explain" aria-live="polite">
          {col >= 0 ? (
            <>
              <strong>{PGR_COLUMNS[col][0]}:</strong> {PGR_COLUMNS[col][1]}
            </>
          ) : (
            "Toque no título de uma coluna para ver o que ela significa."
          )}
        </p>
        <p className="template-footer">Inventário de riscos (trecho) · Revisão 00 · RD Engenharia</p>
      </div>
      <figcaption>Modelo ilustrativo, com empresa e dados inventados, para mostrar como o programa organiza perigos, riscos e medidas.</figcaption>
    </figure>
  );
}

/* ── How to read a drawing sheet (next to the real projects, which are not redrawn) ─────────── */

const SHEET_PARTS = [
  ["Carimbo", "O quadro no canto inferior da folha: título do desenho, escala, data, número da folha e o responsável técnico."],
  ["Escala", "1:50 quer dizer que 1 cm no papel são 50 cm na obra. Por isso o desenho cabe na folha e continua na proporção certa."],
  ["Cotas", "Os números nas linhas de medida. Dão o tamanho de paredes, vãos e cômodos, em metros."],
  ["Planta, corte e fachada", "A planta é a casa vista de cima; o corte, como se ela fosse fatiada de lado; a fachada, vista de frente, de fora."],
];

export function ComoLerPrancha() {
  const [active, setActive] = useState(-1);
  return (
    <div className="how-read">
      <p className="how-read-title">Como ler uma prancha</p>
      <ul className="caption" aria-label="Partes de uma prancha">
        {SHEET_PARTS.map(([name], i) => (
          <li key={name}>
            <button type="button" aria-pressed={active === i} onClick={() => setActive((a) => (a === i ? -1 : i))}>
              {name}
            </button>
          </li>
        ))}
      </ul>
      <p className="illustration-explain" aria-live="polite">
        {active >= 0 ? (
          <>
            <strong>{SHEET_PARTS[active][0]}.</strong> {SHEET_PARTS[active][1]}
          </>
        ) : (
          "Toque numa parte para ver o que ela mostra no desenho."
        )}
      </p>
    </div>
  );
}

export function Ilustracao({ slug }) {
  if (slug === "corpo-de-bombeiros") return <FireSafety />;
  if (slug === "meio-ambiente-topografia") return <Survey />;
  if (slug === "seguranca-do-trabalho")
    return (
      <div className="illustration-two">
        <RiskMap />
        <PgrTemplate />
      </div>
    );
  return null;
}

