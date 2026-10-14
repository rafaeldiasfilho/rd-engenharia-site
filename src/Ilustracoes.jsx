// Desenhos e modelo ilustrativos. Nada aqui vem de um cliente real.

function Legenda({ itens }) {
  return (
    <ul className="legenda">
      {itens.map(([cor, texto]) => (
        <li key={texto}>
          <i style={{ background: cor }} aria-hidden="true" /> {texto}
        </li>
      ))}
    </ul>
  );
}

function Bombeiros() {
  const parede = { stroke: "var(--tinta)", strokeWidth: 4, fill: "none", strokeLinecap: "square" };
  return (
    <figure className="ilustra">
      <svg viewBox="0 0 420 300" role="img" aria-labelledby="t-bomb">
        <title id="t-bomb">Planta ilustrativa de segurança contra incêndio de um pequeno comércio</title>
        <rect x="0" y="0" width="420" height="300" fill="var(--branco)" />
        <path d="M20 20 H400 V280 H160 M100 280 H20 V120 M20 80 V20" {...parede} />
        <path d="M250 20 V110 M250 150 V280 M250 190 H300 M340 190 H400" {...parede} strokeWidth="3" />
        <text x="110" y="60" className="svg-rot">LOJA</text>
        <text x="325" y="70" className="svg-rot">ESTOQUE</text>
        <text x="325" y="240" className="svg-rot">BANHEIRO</text>
        <path d="M335 105 L270 130 L140 130 L45 100" fill="none" stroke="#1f8a3a" strokeWidth="3" strokeDasharray="8 6" />
        <path d="M45 100 l10 -8 v16 z" fill="#1f8a3a" />
        <path d="M200 200 L135 268" fill="none" stroke="#1f8a3a" strokeWidth="3" strokeDasharray="8 6" />
        <path d="M130 274 l4 -12 l9 8 z" fill="#1f8a3a" />
        <rect x="2" y="84" width="16" height="32" rx="3" fill="#1f8a3a" />
        <text x="10" y="104" textAnchor="middle" className="svg-saida" transform="rotate(-90 10 100)">SAÍDA</text>
        <text x="130" y="296" textAnchor="middle" className="svg-rot">ENTRADA</text>
        <rect x="228" y="30" width="16" height="16" rx="2" fill="#d6342b" />
        <rect x="150" y="256" width="16" height="16" rx="2" fill="#d6342b" />
        <rect x="258" y="160" width="16" height="16" rx="2" fill="#d6342b" />
        <circle cx="130" cy="95" r="8" fill="#f0b400" stroke="#8a6a00" strokeWidth="1.5" />
        <circle cx="330" cy="40" r="8" fill="#f0b400" stroke="#8a6a00" strokeWidth="1.5" />
        <circle cx="130" cy="225" r="8" fill="#f0b400" stroke="#8a6a00" strokeWidth="1.5" />
        <circle cx="340" cy="165" r="8" fill="#f0b400" stroke="#8a6a00" strokeWidth="1.5" />
      </svg>
      <Legenda
        itens={[
          ["#d6342b", "Extintor"],
          ["#f0b400", "Iluminação de emergência"],
          ["#1f8a3a", "Saída e rota de fuga"],
        ]}
      />
      <figcaption>Desenho ilustrativo de um projeto de incêndio. Não representa nenhum imóvel real.</figcaption>
    </figure>
  );
}

function Topografia() {
  return (
    <figure className="ilustra">
      <svg viewBox="0 0 420 300" role="img" aria-labelledby="t-topo">
        <title id="t-topo">Desenho ilustrativo de um terreno com marcos nos vértices e curvas de nível</title>
        <rect x="0" y="0" width="420" height="300" fill="var(--branco)" />
        <clipPath id="recorte-terreno"><polygon points="80,60 330,42 372,200 200,262 56,220" /></clipPath>
        <polygon points="80,60 330,42 372,200 200,262 56,220" fill="var(--verde-claro)" stroke="var(--realce)" strokeWidth="3" />
        <g fill="none" stroke="var(--cinza)" strokeWidth="1.5" strokeDasharray="5 5" clipPath="url(#recorte-terreno)">
          <path d="M70 120 C150 95 230 150 360 110" />
          <path d="M65 160 C150 135 240 190 366 150" />
          <path d="M62 200 C150 175 240 230 370 192" />
        </g>
        <g fill="var(--tinta)">
          <rect x="74" y="54" width="12" height="12" />
          <rect x="324" y="36" width="12" height="12" />
          <rect x="366" y="194" width="12" height="12" />
          <rect x="194" y="256" width="12" height="12" />
          <rect x="50" y="214" width="12" height="12" />
        </g>
        <g className="svg-rot">
          <text x="92" y="52">M1</text>
          <text x="300" y="34">M2</text>
          <text x="352" y="224">M3</text>
          <text x="178" y="284">M4</text>
          <text x="22" y="244">M5</text>
        </g>
        <g className="svg-rot" fill="var(--cinza)">
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
      </svg>
      <Legenda
        itens={[
          ["var(--tinta)", "Marco nos vértices"],
          ["var(--realce)", "Limite do terreno"],
          ["var(--cinza)", "Curvas de nível"],
        ]}
      />
      <figcaption>Desenho ilustrativo de um levantamento. Não representa nenhuma propriedade real.</figcaption>
    </figure>
  );
}

function MapaRiscos() {
  return (
    <figure className="ilustra">
      <svg viewBox="0 0 420 300" role="img" aria-labelledby="t-risco">
        <title id="t-risco">Mapa de riscos ilustrativo de uma pequena oficina</title>
        <rect x="0" y="0" width="420" height="300" fill="var(--branco)" />
        <rect x="20" y="20" width="380" height="260" fill="none" stroke="var(--tinta)" strokeWidth="4" />
        <g fill="var(--linha)" stroke="var(--cinza)" strokeWidth="1.5">
          <rect x="50" y="50" width="110" height="60" />
          <rect x="250" y="50" width="120" height="40" />
          <rect x="50" y="190" width="150" height="50" />
          <rect x="280" y="170" width="90" height="80" />
        </g>
        <circle cx="105" cy="80" r="34" fill="#2e9e4d" fillOpacity=".55" stroke="#1f6b2a" strokeWidth="2" />
        <circle cx="310" cy="70" r="22" fill="#d6342b" fillOpacity=".6" stroke="#8f1f19" strokeWidth="2" />
        <circle cx="125" cy="215" r="16" fill="#f0b400" fillOpacity=".7" stroke="#8a6a00" strokeWidth="2" />
        <circle cx="330" cy="210" r="26" fill="#2a6fd1" fillOpacity=".55" stroke="#194a95" strokeWidth="2" />
        <circle cx="225" cy="135" r="12" fill="#2a6fd1" fillOpacity=".55" stroke="#194a95" strokeWidth="2" />
        <g className="svg-rot" textAnchor="middle">
          <text x="105" y="128">Máquina de corte</text>
          <text x="310" y="108">Pintura</text>
          <text x="125" y="258">Bancada</text>
          <text x="325" y="268">Depósito</text>
        </g>
      </svg>
      <Legenda
        itens={[
          ["#2e9e4d", "Físico (ruído, calor)"],
          ["#d6342b", "Químico (tintas, poeira)"],
          ["#f0b400", "Ergonômico (postura)"],
          ["#2a6fd1", "Acidente (queda, corte)"],
        ]}
      />
      <figcaption>
        Mapa de riscos ilustrativo. Quanto maior o círculo, maior o risco. Não representa nenhuma empresa real.
      </figcaption>
    </figure>
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
