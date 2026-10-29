import { useState } from "react";
import { AZUL, BORDA, CINZA, FUNDO, LINHA, MARROM, PAPEL, TINTA, VERDE, VERMELHO, SeloExemplo } from "./FolhaBase";

// Desenhos e modelo ilustrativos, no mesmo papel e carimbo das folhas de exemplo. Nada aqui vem de um
// cliente real. Cada desenho é interativo: tocar num item da legenda (ou no desenho) destaca o elemento e
// explica o que é.

const ROT = { fontSize: 11, fill: CINZA, fontFamily: "inherit" };
const ROT_B = { ...ROT, fill: TINTA, fontWeight: 700 };

// Rodapé no estilo carimbo, igual em todos os desenhos.
function Carimbo({ titulo, cliente }) {
  return (
    <g fontFamily="inherit">
      <rect x="0" y="300" width="420" height="34" fill={FUNDO} />
      <line x1="0" y1="300" x2="420" y2="300" stroke={BORDA} />
      <rect x="14" y="309" width="16" height="16" rx="3.4" fill={VERDE} />
      <text x="22" y="320.4" fontSize="7.4" fontWeight="700" fill="#fff" textAnchor="middle">
        RD
      </text>
      <text x="38" y="315" fontSize="9.6" fontWeight="700" fill={TINTA}>
        {titulo}
      </text>
      <text x="38" y="327" fontSize="8.6" fill={CINZA}>
        {cliente} · RD Engenharia
      </text>
    </g>
  );
}

function Interativa({ itens, rotulo, titulo, idTitulo, legendaFinal, desenho, ajuda, carimbo }) {
  const [ativo, setAtivo] = useState("");
  const escolher = (id) => setAtivo((a) => (a === id ? "" : id));
  const op = (id) => ({
    opacity: !ativo || ativo === id ? 1 : 0.18,
    cursor: "pointer",
    transition: "opacity .2s",
  });
  const atual = itens.find((x) => x.id === ativo);
  return (
    <figure className="ilustra">
      <svg viewBox="0 0 420 334" role="img" aria-labelledby={idTitulo}>
        <title id={idTitulo}>{titulo}</title>
        <rect x="0" y="0" width="420" height="334" fill={PAPEL} />
        {desenho({ op, escolher })}
        <Carimbo {...carimbo} />
        <SeloExemplo x={318} y={10} rot={-6} s={1.7} />
      </svg>
      <ul className="legenda" aria-label={rotulo}>
        {itens.map((x) => (
          <li key={x.id}>
            <button type="button" aria-pressed={ativo === x.id} onClick={() => escolher(x.id)}>
              <i style={{ background: x.cor }} aria-hidden="true" /> {x.nome}
            </button>
          </li>
        ))}
      </ul>
      <p className="ilustra-explica" aria-live="polite">
        {atual ? (
          <>
            <strong>{atual.nome}.</strong> {atual.texto}
          </>
        ) : (
          ajuda || "Toque num item acima, ou no desenho, para ver o que ele significa."
        )}
      </p>
      <figcaption>{legendaFinal}</figcaption>
    </figure>
  );
}

/* ── Segurança contra incêndio ──────────────────────────────────────────────────────────────── */

const SAIDA = "#2f8f46";
const LUZ = "#f2c230";

const ITENS_BOMBEIROS = [
  { id: "extintor", cor: VERMELHO, nome: "Extintor", texto: "Primeiro combate ao fogo. O projeto define o tipo (aqui, pó químico ABC), quantos são e onde ficam, sempre sinalizados e fáceis de alcançar." },
  { id: "luz", cor: LUZ, nome: "Iluminação de emergência", texto: "Acende sozinha quando falta energia, para que as pessoas enxerguem o caminho até a saída." },
  { id: "rota", cor: SAIDA, nome: "Rota de fuga", texto: "Caminho até a saída, que precisa ficar sempre livre de mercadorias e obstáculos." },
  { id: "placa", cor: "#1f6b36", nome: "Placa de saída", texto: "Placa fotoluminescente que indica a saída mesmo no escuro. Fica sobre a porta e nas mudanças de direção." },
];

function Bombeiros() {
  const parede = { stroke: TINTA, fill: "none", strokeLinecap: "square" };
  return (
    <Interativa
      itens={ITENS_BOMBEIROS}
      rotulo="Elementos da planta"
      titulo="Planta ilustrativa de segurança contra incêndio de um pequeno comércio"
      idTitulo="t-bomb"
      carimbo={{ titulo: "Planta de medidas de segurança contra incêndio", cliente: "Comércio Exemplo Ltda." }}
      legendaFinal="Desenho ilustrativo de um projeto de incêndio. Não representa nenhum imóvel real."
      desenho={({ op, escolher }) => (
        <>
          <g {...parede}>
            <rect x="24" y="40" width="372" height="232" strokeWidth="5" />
            <path d="M262 40V272M262 160H396M330 160V272" strokeWidth="3" />
          </g>
          {/* vãos e portas */}
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
          <text x="140" y="120" style={ROT_B} textAnchor="middle">
            LOJA
          </text>
          <text x="140" y="134" style={ROT} textAnchor="middle">
            186,40 m²
          </text>
          <text x="330" y="96" style={ROT_B} textAnchor="middle">
            ESTOQUE
          </text>
          <text x="296" y="226" style={ROT_B} textAnchor="middle">
            WC
          </text>
          <text x="364" y="226" style={ROT_B} textAnchor="middle">
            ESCRIT.
          </text>
          <g style={op("rota")} onClick={() => escolher("rota")}>
            <path d="M360 236L352 172L320 140L262 102L180 170L136 252" fill="none" stroke={SAIDA} strokeWidth="3" strokeDasharray="9 6" strokeLinecap="round" />
            <path d="M136 262l-8 -12h16z" fill={SAIDA} />
          </g>
          <g style={op("placa")} onClick={() => escolher("placa")}>
            <rect x="112" y="244" width="44" height="16" rx="2" fill="#1f6b36" />
            <text x="134" y="256" fontSize="10" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="inherit">
              SAÍDA
            </text>
            <rect x="230" y="96" width="26" height="12" rx="2" fill="#1f6b36" />
            <path d="M236 102h12m-4 -4 4 4-4 4" stroke="#fff" strokeWidth="1.6" fill="none" />
          </g>
          <g style={op("extintor")} onClick={() => escolher("extintor")}>
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
          <g style={op("luz")} onClick={() => escolher("luz")} fill={LUZ} stroke="#7a5b00" strokeWidth="1.2">
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
          <text x="24" y="28" style={ROT}>
            Escala 1:100 · área 288,00 m²
          </text>
        </>
      )}
    />
  );
}

/* ── Topografia e georreferenciamento ───────────────────────────────────────────────────────── */

const ITENS_TOPO = [
  { id: "marco", cor: TINTA, nome: "Marcos nos vértices", texto: "Peças fixadas em cada canto do terreno, com código próprio (M-0001, M-0002...). São elas que dão base oficial aos limites." },
  { id: "limite", cor: VERDE, nome: "Limite do imóvel", texto: "Linha que separa o imóvel dos vizinhos. Cada lado tem azimute (direção) e distância medidos em campo." },
  { id: "curvas", cor: MARROM, nome: "Curvas de nível", texto: "Mostram o relevo: cada linha une pontos de mesma altitude. Ajudam a planejar obras, estradas e a drenagem da água." },
  { id: "coord", cor: AZUL, nome: "Coordenadas", texto: "Cada marco tem coordenadas E e N no sistema SIRGAS 2000, que localizam o ponto no mapa oficial usado pelo INCRA." },
  { id: "conf", cor: CINZA, nome: "Confrontantes", texto: "Os vizinhos que fazem divisa com o imóvel, identificados no levantamento e no memorial descritivo." },
];

const MARCOS = [
  ["M-0001", 70, 70],
  ["M-0002", 300, 52],
  ["M-0003", 352, 196],
  ["M-0004", 196, 262],
  ["M-0005", 50, 222],
];

function Topografia() {
  const poli = MARCOS.map(([, x, y]) => `${x},${y}`).join(" ");
  const curvas = [0, 1, 2, 3, 4].map((i) => ({
    cota: 510 + i * 2,
    d: `M40 ${232 - i * 36}C140 ${206 - i * 36} 230 ${262 - i * 36} 380 ${214 - i * 36}`,
  }));
  return (
    <Interativa
      itens={ITENS_TOPO}
      rotulo="Elementos do levantamento"
      titulo="Desenho ilustrativo de um imóvel rural com marcos, limites, curvas de nível e coordenadas"
      idTitulo="t-topo"
      carimbo={{ titulo: "Planta do imóvel georreferenciado · SIRGAS 2000 · UTM 22S", cliente: "Sítio Exemplo" }}
      legendaFinal="Desenho ilustrativo de um levantamento. Não representa nenhuma propriedade real."
      desenho={({ op, escolher }) => (
        <>
          <clipPath id="recorte-terreno">
            <polygon points={poli} />
          </clipPath>
          <polygon points={poli} fill="#eef4ec" stroke="none" />
          <g style={op("curvas")} onClick={() => escolher("curvas")}>
            <g clipPath="url(#recorte-terreno)" fill="none">
              {curvas.map((c) => (
                <path key={c.cota} d={c.d} stroke={MARROM} strokeWidth={c.cota % 10 === 0 ? 2 : 1} opacity="0.75" />
              ))}
            </g>
            {curvas.slice(0, 4).map((c, i) => (
              <text key={c.cota} x={118} y={222 - i * 36} fontSize="10" fontWeight="700" fill={MARROM} fontFamily="inherit">
                {c.cota}
              </text>
            ))}
          </g>
          <g style={op("limite")} onClick={() => escolher("limite")}>
            <polygon points={poli} fill="none" stroke={VERDE} strokeWidth="3" />
            <text x="186" y="52" fontSize="10" fill={VERDE} fontWeight="700" textAnchor="middle" transform="rotate(-4.3 186 52)" fontFamily="inherit">
              Az 85°42' · 461,20 m
            </text>
            <text x="338" y="118" fontSize="10" fill={VERDE} fontWeight="700" textAnchor="middle" transform="rotate(70 338 118)" fontFamily="inherit">
              Az 160°08' · 306,85 m
            </text>
          </g>
          <g style={op("marco")} onClick={() => escolher("marco")}>
            {MARCOS.map(([id, x, y]) => (
              <g key={id}>
                <rect x={x - 6} y={y - 6} width="12" height="12" fill={TINTA} />
                <text x={x + (x > 200 ? 10 : -10)} y={y + (y < 100 ? -9 : 20)} fontSize="11" fontWeight="700" fill={TINTA} textAnchor={x > 200 ? "start" : "end"} fontFamily="inherit">
                  {id}
                </text>
              </g>
            ))}
          </g>
          <g style={op("coord")} onClick={() => escolher("coord")}>
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
          <g style={op("conf")} onClick={() => escolher("conf")} fontFamily="inherit">
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

/* ── Mapa de riscos ─────────────────────────────────────────────────────────────────────────── */

// Convenção dos mapas de riscos: uma cor por grupo; o tamanho do círculo indica a intensidade
// (pequeno, médio, grande) e o número, quantos trabalhadores estão expostos.
const ITENS_RISCOS = [
  { id: "fisico", cor: "#2e9e4d", nome: "Físico", texto: "Ruído, calor, vibração. Aqui: a serra do corte (risco grande). Na prática: protetor auricular, manutenção e pausas." },
  { id: "quimico", cor: VERMELHO, nome: "Químico", texto: "Tintas, solventes, poeiras e vapores. Aqui: a cabine de pintura. Na prática: exaustão, máscara adequada e produtos identificados." },
  { id: "biologico", cor: MARROM, nome: "Biológico", texto: "Fungos, bactérias e vírus. Aqui: a limpeza dos banheiros. Na prática: luvas, produtos de limpeza e higiene das mãos." },
  { id: "ergo", cor: "#e3b007", nome: "Ergonômico", texto: "Postura, esforço e repetição. Aqui: a bancada de montagem e o escritório. Na prática: altura certa, cadeiras ajustáveis e pausas." },
  { id: "acidente", cor: AZUL, nome: "Acidente", texto: "Cortes, quedas e choques. Aqui: a serra e o empilhamento no depósito. Na prática: proteção nas máquinas, piso organizado e sinalização." },
];

const RAIO = { P: 13, M: 20, G: 28 };

function Risco({ x, y, tam, cor, n, ...eventos }) {
  return (
    <g {...eventos}>
      <circle cx={x} cy={y} r={RAIO[tam]} fill={cor} fillOpacity=".72" stroke="#fff" strokeWidth="2" />
      <text x={x} y={y + 4.5} fontSize="13" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="inherit">
        {n}
      </text>
    </g>
  );
}

function MapaRiscos() {
  const cor = Object.fromEntries(ITENS_RISCOS.map((x) => [x.id, x.cor]));
  return (
    <Interativa
      itens={ITENS_RISCOS}
      rotulo="Grupos de risco"
      titulo="Mapa de riscos ilustrativo de uma pequena oficina, com cinco grupos de risco"
      idTitulo="t-risco"
      carimbo={{ titulo: "Mapa de riscos · oficina", cliente: "Empresa Exemplo Ltda." }}
      ajuda="Cada cor é um grupo de risco. O tamanho do círculo mostra a intensidade, e o número, quantas pessoas estão expostas."
      legendaFinal="Mapa de riscos ilustrativo. Não representa nenhuma empresa real."
      desenho={({ op, escolher }) => {
        const r = (id) => ({ style: op(id), onClick: () => escolher(id) });
        return (
          <>
            <g stroke={TINTA} fill="none">
              <rect x="20" y="40" width="380" height="216" strokeWidth="4" />
              <path d="M200 40V150M20 150H120M160 150H260M300 150H400M290 150V256M340 150V256" strokeWidth="2" />
            </g>
            <g fontFamily="inherit">
              <text x="110" y="60" style={ROT_B} textAnchor="middle">
                CORTE
              </text>
              <text x="300" y="60" style={ROT_B} textAnchor="middle">
                PINTURA
              </text>
              <text x="150" y="244" style={ROT_B} textAnchor="middle">
                MONTAGEM
              </text>
              <text x="315" y="244" style={ROT_B} textAnchor="middle">
                WC
              </text>
              <text x="370" y="244" style={ROT_B} textAnchor="middle">
                ESCRIT.
              </text>
            </g>
            <rect x="60" y="88" width="56" height="30" fill={LINHA} stroke={BORDA} />
            <rect x="250" y="80" width="90" height="46" fill={LINHA} stroke={BORDA} />
            <rect x="80" y="180" width="120" height="26" fill={LINHA} stroke={BORDA} />
            <Risco x={96} y={104} tam="G" cor={cor.fisico} n="3" {...r("fisico")} />
            <Risco x={150} y={112} tam="M" cor={cor.acidente} n="3" {...r("acidente")} />
            <Risco x={300} y={104} tam="G" cor={cor.quimico} n="2" {...r("quimico")} />
            <Risco x={140} y={196} tam="M" cor={cor.ergo} n="4" {...r("ergo")} />
            <Risco x={240} y={206} tam="P" cor={cor.acidente} n="1" {...r("acidente")} />
            <Risco x={315} y={196} tam="P" cor={cor.biologico} n="1" {...r("biologico")} />
            <Risco x={370} y={196} tam="P" cor={cor.ergo} n="2" {...r("ergo")} />
            <text x="240" y="236" style={ROT} textAnchor="middle">
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
              ].map(([t, rotulo, x]) => (
                <g key={t}>
                  <circle cx={x} cy={8} r={RAIO[t] * 0.42} fill="none" stroke={TINTA} strokeWidth="1.2" />
                  <text x={x + RAIO[t] * 0.42 + 5} y={12} fontSize="10" fill={TINTA}>
                    {rotulo}
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

/* ── Modelo de PGR (tabela de verdade, legível no celular) ──────────────────────────────────── */

const COLUNAS_PGR = [
  ["Setor", "Onde o trabalho acontece."],
  ["Perigo", "O que pode causar dano: máquina, produto, postura, altura."],
  ["Possível lesão", "O que pode acontecer com a pessoa se nada for feito."],
  ["Nível", "Probabilidade × severidade. Define a urgência: baixo, moderado ou alto."],
  ["Medida de prevenção", "O que a empresa faz para eliminar ou reduzir o risco, com responsável e prazo no plano de ação."],
];

const LINHAS_PGR = [
  ["Produção", "Ruído de máquinas", "Perda auditiva", "Moderado", "Protetor auricular e manutenção"],
  ["Produção", "Partes móveis da serra", "Cortes e esmagamento", "Alto", "Proteção fixa e bloqueio na manutenção"],
  ["Depósito", "Materiais empilhados", "Queda de objetos", "Moderado", "Prateleiras fixas e limite de altura"],
  ["Escritório", "Postura sentada por horas", "Dor nas costas", "Baixo", "Cadeira ajustável e pausas"],
];

function ModeloPGR() {
  const [col, setCol] = useState(-1);
  return (
    <figure className="modelo">
      <div className="modelo-folha" role="group" aria-label="Modelo ilustrativo do inventário de riscos de um PGR de uma empresa fictícia">
        <span className="selo-exemplo" aria-hidden="true">
          EXEMPLO
        </span>
        <div className="modelo-cab">
          <span className="modelo-marca" aria-hidden="true">
            RD
          </span>
          <div>
            <p className="modelo-tipo">PGR · NR-01 · Página 4 de 18</p>
            <h3>2. Inventário de riscos</h3>
          </div>
        </div>
        <p className="modelo-peq">Empresa Exemplo Ltda. · CNPJ 00.000.000/0001-00 · Empresa fictícia</p>
        <div className="modelo-rolagem">
          <table>
            <thead>
              <tr>
                {COLUNAS_PGR.map(([nome], i) => (
                  <th key={nome} scope="col">
                    <button type="button" aria-pressed={col === i} onClick={() => setCol((c) => (c === i ? -1 : i))}>
                      {nome}
                      <span aria-hidden="true">?</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LINHAS_PGR.map((l, r) => (
                <tr key={r}>
                  {l.map((c, i) => (
                    <td key={i} data-ativa={col === i ? "" : undefined}>
                      {i === 3 ? <span className={`nivel nivel-${c.toLowerCase()}`}>{c}</span> : c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="modelo-explica" aria-live="polite">
          {col >= 0 ? (
            <>
              <strong>{COLUNAS_PGR[col][0]}:</strong> {COLUNAS_PGR[col][1]}
            </>
          ) : (
            "Toque no título de uma coluna para ver o que ela significa."
          )}
        </p>
        <p className="modelo-rodape">Inventário de riscos (trecho) · Revisão 00 · RD Engenharia</p>
      </div>
      <figcaption>Modelo ilustrativo, com empresa e dados inventados, para mostrar como o programa organiza perigos, riscos e medidas.</figcaption>
    </figure>
  );
}

/* ── Como ler uma prancha (ao lado dos projetos reais, que não são redesenhados) ────────────── */

const PARTES_PRANCHA = [
  ["Carimbo", "O quadro no canto inferior da folha: título do desenho, escala, data, número da folha e o responsável técnico."],
  ["Escala", "1:50 quer dizer que 1 cm no papel são 50 cm na obra. Por isso o desenho cabe na folha e continua na proporção certa."],
  ["Cotas", "Os números nas linhas de medida. Dão o tamanho de paredes, vãos e cômodos, em metros."],
  ["Planta, corte e fachada", "A planta é a casa vista de cima; o corte, como se ela fosse fatiada de lado; a fachada, vista de frente, de fora."],
];

export function ComoLerPrancha() {
  const [ativo, setAtivo] = useState(-1);
  return (
    <div className="como-ler">
      <p className="como-ler-titulo">Como ler uma prancha</p>
      <ul className="legenda" aria-label="Partes de uma prancha">
        {PARTES_PRANCHA.map(([nome], i) => (
          <li key={nome}>
            <button type="button" aria-pressed={ativo === i} onClick={() => setAtivo((a) => (a === i ? -1 : i))}>
              {nome}
            </button>
          </li>
        ))}
      </ul>
      <p className="ilustra-explica" aria-live="polite">
        {ativo >= 0 ? (
          <>
            <strong>{PARTES_PRANCHA[ativo][0]}.</strong> {PARTES_PRANCHA[ativo][1]}
          </>
        ) : (
          "Toque numa parte para ver o que ela mostra no desenho."
        )}
      </p>
    </div>
  );
}

export function Ilustracao({ slug }) {
  if (slug === "corpo-de-bombeiros") return <Bombeiros />;
  if (slug === "meio-ambiente-topografia") return <Topografia />;
  if (slug === "seguranca-do-trabalho")
    return (
      <div className="ilustra-duas">
        <MapaRiscos />
        <ModeloPGR />
      </div>
    );
  return null;
}

