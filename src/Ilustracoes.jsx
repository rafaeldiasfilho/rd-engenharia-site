import { useState } from "react";

// Desenhos e modelo ilustrativos. Nada aqui vem de um cliente real.
// Cada desenho é interativo: tocar num item da legenda (ou no desenho) destaca o elemento e explica o que é.

function Interativa({ itens, rotulo, titulo, idTitulo, legendaFinal, desenho }) {
  const [ativo, setAtivo] = useState("");
  const escolher = (id) => setAtivo((a) => (a === id ? "" : id));
  const op = (id) => ({
    opacity: !ativo || ativo === id ? 1 : 0.22,
    cursor: "pointer",
    transition: "opacity .2s",
  });
  const atual = itens.find((x) => x.id === ativo);
  return (
    <figure className="ilustra">
      <svg viewBox="0 0 420 300" role="img" aria-labelledby={idTitulo}>
        <title id={idTitulo}>{titulo}</title>
        {desenho({ op, escolher })}
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
          "Toque num item acima, ou no desenho, para ver o que ele significa."
        )}
      </p>
      <figcaption>{legendaFinal}</figcaption>
    </figure>
  );
}

const ITENS_BOMBEIROS = [
  { id: "extintor", cor: "#d6342b", nome: "Extintor", texto: "Equipamento de primeiro combate ao fogo. O projeto indica quantos são necessários e onde instalar, para que fiquem fáceis de alcançar." },
  { id: "luz", cor: "#f0b400", nome: "Iluminação de emergência", texto: "Acende quando falta energia, para que as pessoas enxerguem o caminho até a saída." },
  { id: "rota", cor: "#1f8a3a", nome: "Saída e rota de fuga", texto: "Caminho sinalizado até a saída, que precisa ficar sempre livre de obstáculos." },
];

function Bombeiros() {
  const parede = { stroke: "var(--tinta)", strokeWidth: 4, fill: "none", strokeLinecap: "square" };
  return (
    <Interativa
      itens={ITENS_BOMBEIROS}
      rotulo="Elementos da planta"
      titulo="Planta ilustrativa de segurança contra incêndio de um pequeno comércio"
      idTitulo="t-bomb"
      legendaFinal="Desenho ilustrativo de um projeto de incêndio. Não representa nenhum imóvel real."
      desenho={({ op, escolher }) => (
        <>
          <rect x="0" y="0" width="420" height="300" fill="var(--branco)" />
          <path d="M20 20 H400 V280 H160 M100 280 H20 V120 M20 80 V20" {...parede} />
          <path d="M250 20 V110 M250 150 V280 M250 190 H300 M340 190 H400" {...parede} strokeWidth="3" />
          <text x="110" y="60" className="svg-rot">LOJA</text>
          <text x="325" y="70" className="svg-rot">ESTOQUE</text>
          <text x="325" y="240" className="svg-rot">BANHEIRO</text>
          <text x="130" y="296" textAnchor="middle" className="svg-rot">ENTRADA</text>
          <g style={op("rota")} onClick={() => escolher("rota")}>
            <path d="M335 105 L270 130 L140 130 L45 100" fill="none" stroke="#1f8a3a" strokeWidth="3" strokeDasharray="8 6" />
            <path d="M45 100 l10 -8 v16 z" fill="#1f8a3a" />
            <path d="M200 200 L135 268" fill="none" stroke="#1f8a3a" strokeWidth="3" strokeDasharray="8 6" />
            <path d="M130 274 l4 -12 l9 8 z" fill="#1f8a3a" />
            <rect x="2" y="84" width="16" height="32" rx="3" fill="#1f8a3a" />
            <text x="10" y="104" textAnchor="middle" className="svg-saida" transform="rotate(-90 10 100)">SAÍDA</text>
          </g>
          <g style={op("extintor")} onClick={() => escolher("extintor")}>
            <rect x="226" y="28" width="20" height="20" rx="2" fill="#d6342b" />
            <rect x="148" y="254" width="20" height="20" rx="2" fill="#d6342b" />
            <rect x="256" y="158" width="20" height="20" rx="2" fill="#d6342b" />
          </g>
          <g style={op("luz")} onClick={() => escolher("luz")} fill="#f0b400" stroke="#8a6a00" strokeWidth="1.5">
            <circle cx="130" cy="95" r="10" />
            <circle cx="330" cy="40" r="10" />
            <circle cx="130" cy="225" r="10" />
            <circle cx="340" cy="165" r="10" />
          </g>
        </>
      )}
    />
  );
}

const ITENS_TOPO = [
  { id: "marco", cor: "var(--tinta)", nome: "Marco nos vértices", texto: "Peça fixada no terreno em cada canto, com coordenadas conhecidas. É ela que dá base oficial aos limites medidos." },
  { id: "limite", cor: "var(--realce)", nome: "Limite do terreno", texto: "Linha que separa o seu terreno dos vizinhos, desenhada a partir das medidas feitas em campo." },
  { id: "curvas", cor: "var(--cinza)", nome: "Curvas de nível", texto: "Mostram o relevo: onde o terreno sobe e desce. Ajudam a planejar obras, estradas e a drenagem da água." },
  { id: "conf", cor: "var(--linha)", nome: "Confrontantes", texto: "São os vizinhos que fazem divisa com o terreno, identificados no levantamento." },
];

function Topografia() {
  const poli = "80,60 330,42 372,200 200,262 56,220";
  return (
    <Interativa
      itens={ITENS_TOPO}
      rotulo="Elementos do levantamento"
      titulo="Desenho ilustrativo de um terreno com marcos nos vértices e curvas de nível"
      idTitulo="t-topo"
      legendaFinal="Desenho ilustrativo de um levantamento. Não representa nenhuma propriedade real."
      desenho={({ op, escolher }) => (
        <>
          <rect x="0" y="0" width="420" height="300" fill="var(--branco)" />
          <clipPath id="recorte-terreno">
            <polygon points={poli} />
          </clipPath>
          <polygon points={poli} fill="var(--verde-claro)" stroke="none" />
          <g style={op("curvas")} onClick={() => escolher("curvas")} clipPath="url(#recorte-terreno)" fill="none" stroke="var(--cinza)" strokeWidth="1.8" strokeDasharray="5 5">
            <path d="M70 120 C150 95 230 150 360 110" />
            <path d="M65 160 C150 135 240 190 366 150" />
            <path d="M62 200 C150 175 240 230 370 192" />
          </g>
          <polygon points={poli} fill="none" stroke="var(--realce)" strokeWidth="3" style={op("limite")} onClick={() => escolher("limite")} />
          <g style={op("marco")} onClick={() => escolher("marco")}>
            <g fill="var(--tinta)">
              <rect x="73" y="53" width="14" height="14" />
              <rect x="323" y="35" width="14" height="14" />
              <rect x="365" y="193" width="14" height="14" />
              <rect x="193" y="255" width="14" height="14" />
              <rect x="49" y="213" width="14" height="14" />
            </g>
            <g className="svg-rot">
              <text x="92" y="52">M1</text>
              <text x="300" y="34">M2</text>
              <text x="352" y="224">M3</text>
              <text x="178" y="284">M4</text>
              <text x="22" y="244">M5</text>
            </g>
          </g>
          <g style={op("conf")} onClick={() => escolher("conf")} className="svg-rot" fill="var(--cinza)">
            <text x="170" y="22">Confrontante A</text>
            <text x="370" y="96">Conf. B</text>
            <text x="4" y="150">Conf. C</text>
          </g>
          <text x="215" y="170" textAnchor="middle" className="svg-area">ÁREA</text>
          <g transform="translate(30 48)" stroke="var(--tinta)" strokeWidth="2" fill="var(--tinta)">
            <path d="M0 22 V-6" fill="none" />
            <path d="M-6 2 L0 -10 L6 2 z" />
          </g>
          <text x="24" y="28" className="svg-rot">N</text>
        </>
      )}
    />
  );
}

const ITENS_RISCOS = [
  { id: "fisico", cor: "#2e9e4d", nome: "Físico", texto: "Ruído, calor, vibração. Na prática: protetor auricular, manutenção das máquinas e pausas em locais quentes." },
  { id: "quimico", cor: "#d6342b", nome: "Químico", texto: "Tintas, solventes, poeira e vapores. Na prática: boa ventilação, máscara adequada e produtos bem identificados." },
  { id: "ergo", cor: "#f0b400", nome: "Ergonômico", texto: "Postura, esforço e repetição. Na prática: bancada na altura certa, cadeiras ajustáveis e pausas." },
  { id: "acidente", cor: "#2a6fd1", nome: "Acidente", texto: "Quedas, cortes e choques. Na prática: proteção nas máquinas, piso organizado e sinalização." },
];

function MapaRiscos() {
  return (
    <Interativa
      itens={ITENS_RISCOS}
      rotulo="Grupos de risco"
      titulo="Mapa de riscos ilustrativo de uma pequena oficina"
      idTitulo="t-risco"
      legendaFinal="Mapa de riscos ilustrativo. Quanto maior o círculo, maior o risco. Não representa nenhuma empresa real."
      desenho={({ op, escolher }) => (
        <>
          <rect x="0" y="0" width="420" height="300" fill="var(--branco)" />
          <rect x="20" y="20" width="380" height="260" fill="none" stroke="var(--tinta)" strokeWidth="4" />
          <g fill="var(--linha)" stroke="var(--cinza)" strokeWidth="1.5">
            <rect x="50" y="50" width="110" height="60" />
            <rect x="250" y="50" width="120" height="40" />
            <rect x="50" y="190" width="150" height="50" />
            <rect x="280" y="170" width="90" height="80" />
          </g>
          <circle style={op("fisico")} onClick={() => escolher("fisico")} cx="105" cy="80" r="34" fill="#2e9e4d" fillOpacity=".55" stroke="#1f6b2a" strokeWidth="2" />
          <circle style={op("quimico")} onClick={() => escolher("quimico")} cx="310" cy="70" r="22" fill="#d6342b" fillOpacity=".6" stroke="#8f1f19" strokeWidth="2" />
          <circle style={op("ergo")} onClick={() => escolher("ergo")} cx="125" cy="215" r="16" fill="#f0b400" fillOpacity=".7" stroke="#8a6a00" strokeWidth="2" />
          <g style={op("acidente")} onClick={() => escolher("acidente")} fill="#2a6fd1" fillOpacity=".55" stroke="#194a95" strokeWidth="2">
            <circle cx="330" cy="210" r="26" />
            <circle cx="225" cy="135" r="12" />
          </g>
          <g className="svg-rot" textAnchor="middle">
            <text x="105" y="128">Máquina de corte</text>
            <text x="310" y="108">Pintura</text>
            <text x="125" y="258">Bancada</text>
            <text x="325" y="268">Depósito</text>
          </g>
        </>
      )}
    />
  );
}

function ModeloPGR() {
  const linhas = [
    ["Produção", "Ruído de máquinas", "Perda auditiva", "Protetor auricular e manutenção"],
    ["Depósito", "Materiais empilhados", "Queda de objetos", "Prateleiras fixas e limite de altura"],
    ["Escritório", "Postura sentada por horas", "Dor nas costas", "Cadeira ajustável e pausas"],
  ];
  return (
    <figure className="modelo">
      <div className="modelo-folha" role="img" aria-label="Modelo ilustrativo de capa e inventário de riscos de um PGR de uma empresa fictícia">
        <span className="modelo-selo">Exemplo ilustrativo</span>
        <p className="modelo-tipo">Programa de Gerenciamento de Riscos</p>
        <h3>Empresa Exemplo Ltda.</h3>
        <p className="modelo-peq">CNPJ 00.000.000/0001-00 · Empresa fictícia</p>
        <table>
          <thead>
            <tr>
              <th>Setor</th>
              <th>Perigo</th>
              <th>Risco</th>
              <th>Medida de prevenção</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l[0]}>
                {l.map((c) => (
                  <td key={c}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="modelo-peq">Inventário de riscos (trecho). Elaborado por RD Engenharia.</p>
      </div>
      <figcaption>
        Modelo ilustrativo, com empresa e dados inventados, para mostrar como o programa organiza perigos, riscos e
        medidas.
      </figcaption>
    </figure>
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
