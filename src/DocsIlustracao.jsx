// Ilustrações de documentos de exemplo, desenhadas como capas e pranchas de verdade. Nada é um documento
// real: o cliente é fictício ("Exemplo"), não há assinatura nem número de ART; só os dados públicos da RD
// e do responsável técnico (os mesmos do rodapé) aparecem. Toda folha leva o carimbo "EXEMPLO".
// O papel é sempre claro, então funciona nos temas claro e escuro. Cada folha tem texto alternativo.
//  - FolhaExemplo: uma folha para cada serviço/documento da área (usada na lista "O que fazemos").
//  - DocsIlustracao (padrão): duas folhas empilhadas na seção "Para agilizar, separe".

const PAPEL = "#fdfdfb";
const BORDA = "#c9d0c6";
const LINHA = "#dde2da";
const TINTA = "#26302a";
const VERDE = "#1f6b2a";
const AMBAR = "#d9a441";
const VERMELHO = "#c0564b";

export const LEGENDA_EXEMPLO = "Exemplo ilustrativo de documento, não é um documento real.";

function Linhas({ x, y, n, largura, passo = 9 }) {
  const tam = [1, 0.92, 0.97, 0.7, 1, 0.85, 0.95, 0.6];
  return Array.from({ length: n }, (_, k) => (
    <rect key={k} x={x} y={y + k * passo} width={largura * tam[k % tam.length]} height="3" rx="1.5" fill={LINHA} />
  ));
}

// Desenho do corpo da folha (área de x 10 a 140 e y 50 a 150).
function Corpo({ tipo }) {
  switch (tipo) {
    case "tabela":
      return (
        <g>
          <rect x="10" y="62" width="130" height="62" rx="2" fill="none" stroke={BORDA} />
          {[76, 90, 104].map((y) => (
            <line key={y} x1="10" y1={y} x2="140" y2={y} stroke={BORDA} />
          ))}
          <line x1="62" y1="62" x2="62" y2="124" stroke={BORDA} />
          <line x1="102" y1="62" x2="102" y2="124" stroke={BORDA} />
          {[67, 81, 95, 109].map((y, k) => (
            <g key={y}>
              <rect x="14" y={y} width={26 + (k % 2) * 12} height="3" rx="1.5" fill={LINHA} />
              <rect x="106" y={y} width="20" height="3" rx="1.5" fill={[VERMELHO, AMBAR, "#8fc08c", AMBAR][k]} />
            </g>
          ))}
        </g>
      );
    case "planta":
    case "asbuilt":
      return (
        <g fill="none" stroke={TINTA} strokeWidth="1.4" opacity="0.8">
          <rect x="20" y="66" width="110" height="52" />
          <line x1="58" y1="66" x2="58" y2="118" />
          <line x1="58" y1="94" x2="130" y2="94" />
          <line x1="94" y1="94" x2="94" y2="118" />
          <path d="M30 66v6M44 66v6" />
          {tipo === "asbuilt" && (
            <g strokeWidth="0.9" stroke={VERDE}>
              <path d="M20 128h110M20 124v8M130 124v8" />
              <path d="M138 66v52M134 66h8M134 118h8" />
            </g>
          )}
        </g>
      );
    case "terreno":
    case "car":
      return (
        <g>
          <polygon points="24,126 40,70 92,64 132,88 118,128" fill="#e4eee2" stroke={TINTA} strokeWidth="1.4" opacity="0.85" />
          {tipo === "car" && <path d="M24 126 L40 70 L52 69 L38 126z M92 64 L132 88 L126 96 L88 72z" fill="#b8d8b6" opacity="0.9" />}
          {[[24, 126], [40, 70], [92, 64], [132, 88], [118, 128]].map(([cx, cy], k) => (
            <g key={k}>
              <circle cx={cx} cy={cy} r="2.4" fill={VERDE} />
              {tipo === "terreno" && (
                <text x={cx + 4} y={cy - 3} fontSize="6" fill={TINTA}>
                  V{k + 1}
                </text>
              )}
            </g>
          ))}
        </g>
      );
    case "checklist":
      return (
        <g>
          {[62, 78, 94, 110, 126].map((y, k) => (
            <g key={y}>
              <rect x="12" y={y} width="9" height="9" rx="2" fill="none" stroke={VERDE} strokeWidth="1.2" />
              {k < 4 && <path d={`M14 ${y + 4.5}l2.2 2.2 3.4-4.4`} fill="none" stroke={VERDE} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />}
              <rect x="28" y={y + 3} width={100 - (k % 3) * 18} height="3" rx="1.5" fill={LINHA} />
            </g>
          ))}
        </g>
      );
    case "grafico":
      return (
        <g>
          <line x1="16" y1="130" x2="136" y2="130" stroke={BORDA} />
          <line x1="16" y1="62" x2="16" y2="130" stroke={BORDA} />
          {[[24, 44], [44, 62], [64, 36], [84, 54], [104, 28], [122, 48]].map(([x, h], k) => (
            <rect key={x} x={x} y={130 - h} width="12" height={h} fill={k % 2 ? "#8fc08c" : VERDE} opacity="0.9" />
          ))}
          <line x1="16" y1="96" x2="136" y2="96" stroke={VERMELHO} strokeDasharray="4 3" />
        </g>
      );
    case "medicao":
      return (
        <g>
          <path d="M34 112a36 36 0 0 1 72 0" fill="none" stroke={BORDA} strokeWidth="6" />
          <path d="M34 112a36 36 0 0 1 36-36" fill="none" stroke="#8fc08c" strokeWidth="6" />
          <path d="M70 76a36 36 0 0 1 22 8" fill="none" stroke={AMBAR} strokeWidth="6" />
          <line x1="70" y1="112" x2="90" y2="88" stroke={TINTA} strokeWidth="2" strokeLinecap="round" />
          <circle cx="70" cy="112" r="3.5" fill={TINTA} />
          <Linhas x={14} y={124} n={2} largura={110} passo={9} />
        </g>
      );
    case "mapa":
      return (
        <g>
          <rect x="16" y="62" width="118" height="68" fill="none" stroke={TINTA} strokeWidth="1.2" opacity="0.7" />
          <line x1="62" y1="62" x2="62" y2="130" stroke={TINTA} strokeWidth="1" opacity="0.5" />
          <line x1="62" y1="98" x2="134" y2="98" stroke={TINTA} strokeWidth="1" opacity="0.5" />
          <circle cx="40" cy="84" r="6" fill={VERMELHO} opacity="0.85" />
          <circle cx="96" cy="80" r="6" fill={AMBAR} opacity="0.9" />
          <circle cx="110" cy="116" r="6" fill="#8fc08c" />
          <circle cx="38" cy="116" r="6" fill={AMBAR} opacity="0.9" />
        </g>
      );
    case "certificado":
      return (
        <g>
          <rect x="14" y="60" width="122" height="72" rx="3" fill="none" stroke={VERDE} strokeWidth="1.2" strokeDasharray="5 3" />
          <Linhas x={34} y={70} n={2} largura={82} />
          <circle cx="75" cy="106" r="14" fill="none" stroke={VERDE} strokeWidth="1.6" />
          <path d="M75 98l2.6 5.2 5.8.8-4.2 4 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.2-4 5.8-.8z" fill={VERDE} opacity="0.85" />
        </g>
      );
    case "selo":
      return (
        <g>
          <Linhas x={12} y={60} n={3} largura={126} />
          <circle cx="75" cy="108" r="19" fill="none" stroke={VERDE} strokeWidth="2" strokeDasharray="4 2.5" />
          <path d="M65 108l7 7 14-15" fill="none" stroke={VERDE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "rota":
      return (
        <g>
          <rect x="16" y="62" width="118" height="66" fill="none" stroke={TINTA} strokeWidth="1.2" opacity="0.7" />
          <path d="M16 96h30M70 96h64" stroke={TINTA} strokeWidth="1.2" opacity="0.7" />
          <path d="M30 118 C 50 118, 50 84, 80 84 S 112 84, 124 84" fill="none" stroke="#2f8f46" strokeWidth="2" strokeDasharray="5 3" strokeLinecap="round" />
          <path d="M120 79l7 5-7 5" fill="none" stroke="#2f8f46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="30" cy="118" r="3" fill={VERMELHO} />
        </g>
      );
    case "gantt":
      return (
        <g>
          <line x1="14" y1="130" x2="138" y2="130" stroke={BORDA} />
          {[[16, 52], [34, 44], [58, 52], [86, 40], [104, 30]].map(([x, w], k) => (
            <rect key={k} x={x} y={64 + k * 13} width={w} height="7" rx="3" fill={k % 2 ? "#8fc08c" : VERDE} opacity="0.9" />
          ))}
        </g>
      );
    case "fachada":
      return (
        <g>
          <rect x="30" y="64" width="90" height="62" fill="none" stroke={TINTA} strokeWidth="1.4" opacity="0.8" />
          {[44, 72, 100].map((x) => (
            <rect key={x} x={x - 8} y="76" width="16" height="14" fill="none" stroke={TINTA} strokeWidth="1" opacity="0.7" />
          ))}
          <path d="M44 126l6-10-5-8 7-8-2-10" fill="none" stroke={VERMELHO} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="24" y1="126" x2="126" y2="126" stroke={TINTA} strokeWidth="1.4" />
        </g>
      );
    case "curvas":
      return (
        <g fill="none" stroke={VERDE} strokeWidth="1.2" opacity="0.85">
          <ellipse cx="76" cy="96" rx="58" ry="32" />
          <ellipse cx="80" cy="94" rx="42" ry="22" />
          <ellipse cx="84" cy="92" rx="26" ry="13" />
          <ellipse cx="86" cy="91" rx="10" ry="5" />
        </g>
      );
    case "fluxo":
      return (
        <g fill="none" stroke={TINTA} strokeWidth="1.2">
          {[64, 92, 120].map((y, k) => (
            <g key={y}>
              <rect x="30" y={y - 8} width="90" height="16" rx="3" stroke={k === 2 ? VERDE : TINTA} opacity="0.85" />
              <rect x="40" y={y - 1.5} width={50 + k * 8} height="3" rx="1.5" fill={LINHA} stroke="none" />
              {k < 2 && <path d={`M75 ${y + 8}v12m-3-4 3 4 3-4`} />}
            </g>
          ))}
        </g>
      );
    case "laudo":
    default:
      return (
        <g>
          <Linhas x={10} y={58} n={3} largura={130} />
          <rect x="10" y="90" width="60" height="38" rx="2" fill="#e8eee6" stroke={BORDA} />
          <path d="M14 124l14-14 10 8 12-12 16 18z" fill="#c9d9c6" />
          <Linhas x={78} y={92} n={4} largura={60} passo={9} />
        </g>
      );
  }
}

// ── Folhas com cara de documento de verdade ──────────────────────────────────────────────────
// Três formatos, escolhidos por `m.layout` (campo `exemplo` em src/paginas.js):
//  - "capa": capa de relatório (laudos, programas, análises), com sumário;
//  - "prancha": desenho técnico com carimbo (plantas, mapas, cronograma);
//  - "certificado": certificado de treinamento.
// Dados da RD e do responsável técnico são os mesmos do rodapé do site; o cliente é sempre fictício
// ("Exemplo"), e nenhuma folha tem assinatura nem número de ART.
const CINZA = "#6b766e";
const FUNDO = "#f1f4ef";
const RD_CNPJ = "CNPJ 27.839.324/0001-74";
const RESP = "Eng. Rafael Antonio Dias";
const CREA = "CREA-SP 5071022821";
const DATA = "outubro de 2026";

const CLIENTES = {
  empresa: ["Empresa Exemplo Ltda.", "CNPJ 00.000.000/0001-00 · Ibirá/SP"],
  obra: ["Proprietário Exemplo", "Rua Exemplo, 100 · Ibirá/SP"],
  rural: ["Sítio Exemplo", "Zona rural · Ibirá/SP"],
};
const CLIENTE_DA_AREA = {
  "seguranca-do-trabalho": "empresa",
  "corpo-de-bombeiros": "empresa",
  "engenharia-civil": "obra",
  "meio-ambiente-topografia": "rural",
};
const clienteDe = (m, area) => CLIENTES[m.cliente || CLIENTE_DA_AREA[area] || "empresa"];

// Quebra o texto em linhas de até `max` caracteres (SVG não quebra sozinho).
function quebra(texto, max) {
  const linhas = [];
  let atual = "";
  for (const p of texto.split(" ")) {
    const teste = atual ? `${atual} ${p}` : p;
    if (teste.length > max && atual) {
      linhas.push(atual);
      atual = p;
    } else atual = teste;
  }
  if (atual) linhas.push(atual);
  return linhas;
}

function Marca({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect width="14" height="14" rx="3" fill={VERDE} />
      <text x="7" y="9.6" fontSize="6.4" fontWeight="700" fill="#fff" textAnchor="middle">
        RD
      </text>
      <text x="18" y="5.8" fontSize="5.2" fontWeight="700" fill={TINTA} letterSpacing="0.3">
        RD ENGENHARIA
      </text>
      <text x="18" y="11.6" fontSize="3.5" fill={CINZA}>
        Segurança e Meio Ambiente
      </text>
    </g>
  );
}

function Capa({ m, area }) {
  const doc = m.doc || m.sub;
  const titulo = quebra(doc.toUpperCase(), 24).slice(0, 3);
  const [cli, cliInfo] = clienteDe(m, area);
  const ySum = 52 + titulo.length * 8 + 6;
  return (
    <g fontFamily="inherit">
      <Marca x={10} y={10} />
      <text x="140" y="15.6" fontSize="3.1" fill={CINZA} textAnchor="end">
        {RD_CNPJ}
      </text>
      <text x="140" y="21" fontSize="3.1" fill={CINZA} textAnchor="end">
        Ibirá/SP
      </text>
      <line x1="10" y1="29" x2="140" y2="29" stroke={VERDE} strokeWidth="0.6" />
      <text x="10" y="42" fontSize="3.6" fontWeight="700" fill={VERDE} letterSpacing="0.6">
        {(m.ref || m.titulo).toUpperCase()}
      </text>
      {titulo.map((l, k) => (
        <text key={l} x="10" y={52 + k * 8} fontSize="6.6" fontWeight="700" fill={TINTA} letterSpacing="0.1">
          {l}
        </text>
      ))}
      {m.sumario && (
        <g>
          <text x="10" y={ySum} fontSize="3.2" fontWeight="700" fill={CINZA} letterSpacing="0.6">
            SUMÁRIO
          </text>
          {m.sumario.slice(0, 3).map((s, k) => (
            <g key={s}>
              <text x="10" y={ySum + 7 + k * 6.4} fontSize="3.8" fill={TINTA}>
                {k + 1}. {s}
              </text>
              <text x="140" y={ySum + 7 + k * 6.4} fontSize="3.8" fill={CINZA} textAnchor="end">
                {[3, 6, 11][k]}
              </text>
            </g>
          ))}
        </g>
      )}
      <rect x="10" y="112" width="130" height="22" rx="2.5" fill={FUNDO} />
      <text x="15" y="118.6" fontSize="3.1" fontWeight="700" fill={CINZA} letterSpacing="0.6">
        CONTRATANTE
      </text>
      <text x="15" y="125" fontSize="4.8" fontWeight="700" fill={TINTA}>
        {cli}
      </text>
      <text x="15" y="130.4" fontSize="3.5" fill={CINZA}>
        {cliInfo}
      </text>
      <text x="10" y="144" fontSize="3.1" fontWeight="700" fill={CINZA} letterSpacing="0.6">
        RESPONSÁVEL TÉCNICO
      </text>
      <text x="10" y="150.6" fontSize="4.6" fontWeight="700" fill={TINTA}>
        {RESP}
      </text>
      <text x="10" y="156" fontSize="3.6" fill={CINZA}>
        {CREA}
      </text>
      {m.art && (
        <g>
          <rect x="112" y="141" width="28" height="11" rx="5.5" fill="none" stroke={VERDE} strokeWidth="1" />
          <text x="126" y="148.4" fontSize="5" fontWeight="700" fill={VERDE} textAnchor="middle">
            ART
          </text>
        </g>
      )}
      <line x1="10" y1="180" x2="140" y2="180" stroke={BORDA} strokeWidth="0.6" />
      <text x="10" y="187" fontSize="3.4" fill={CINZA}>
        Ibirá/SP · {DATA}
      </text>
      <text x="140" y="187" fontSize="3.4" fill={CINZA} textAnchor="end">
        Revisão 00 · Página 1
      </text>
    </g>
  );
}

const NORTE = new Set(["terreno", "car", "curvas", "mapa"]);

function Prancha({ m, area }) {
  const doc = m.doc || m.sub;
  const [cli, cliInfo] = clienteDe(m, area);
  const titulo = quebra(doc, 30).slice(0, 2);
  const cel = (x, y, rotulo, valor, w) => (
    <g>
      <text x={x + 2.4} y={y + 4.6} fontSize="2.7" fontWeight="700" fill={CINZA} letterSpacing="0.4">
        {rotulo}
      </text>
      <text x={x + 2.4} y={y + 10} fontSize="3.4" fontWeight="600" fill={TINTA}>
        {valor}
      </text>
      {w && <line x1={x + w} y1={y} x2={x + w} y2={y + 13} stroke={TINTA} strokeWidth="0.4" />}
    </g>
  );
  return (
    <g fontFamily="inherit">
      <rect x="5" y="5" width="140" height="188" fill="none" stroke={TINTA} strokeWidth="0.6" />
      <g transform="translate(0 -32)">
        <Corpo tipo={m.corpo} />
      </g>
      {m.corpo === "mapa" && (
        <g fontSize="3.4" fill={TINTA}>
          {[["#8fc08c", "Físico"], [VERMELHO, "Químico"], [AMBAR, "Ergonômico"]].map(([cor, rotulo], k) => (
            <g key={rotulo} transform={`translate(${16 + k * 40} 110)`}>
              <circle r="3" fill={cor} />
              <text x="5.5" y="1.3">
                {rotulo}
              </text>
            </g>
          ))}
        </g>
      )}
      {NORTE.has(m.corpo) && (
        <g transform="translate(130 18)">
          <path d="M0 -7l3.2 9-3.2-2-3.2 2z" fill={TINTA} />
          <text x="0" y="8" fontSize="3.6" fontWeight="700" fill={TINTA} textAnchor="middle">
            N
          </text>
        </g>
      )}
      <g stroke={TINTA} strokeWidth="0.4" fill="none">
        <rect x="5" y="126" width="140" height="67" strokeWidth="0.6" />
        <line x1="5" y1="141" x2="145" y2="141" />
        <line x1="5" y1="154" x2="145" y2="154" />
        <line x1="5" y1="167" x2="145" y2="167" />
        <line x1="5" y1="180" x2="145" y2="180" />
        <line x1="52" y1="126" x2="52" y2="141" />
      </g>
      <Marca x={8} y={129.6} s={0.62} />
      <text x="54.4" y="130.6" fontSize="2.7" fontWeight="700" fill={CINZA} letterSpacing="0.4">
        TÍTULO
      </text>
      {titulo.map((l, k) => (
        <text key={l} x="54.4" y={135.6 + k * 4} fontSize="3.6" fontWeight="700" fill={TINTA}>
          {l}
        </text>
      ))}
      {cel(5, 141, "CLIENTE", `${cli} · ${cliInfo}`)}
      {cel(5, 154, "CONTEÚDO", m.ref || m.sub)}
      {cel(5, 167, "RESPONSÁVEL TÉCNICO", `${RESP} · ${CREA}`)}
      {cel(5, 180, "ESCALA", m.escala || "Indicada", 35)}
      {cel(40, 180, "DATA", "10/2026", 35)}
      {cel(75, 180, "FOLHA", "01/03", 35)}
      {cel(110, 180, "ART", m.art ? "Sim" : "—")}
    </g>
  );
}

function Certificado({ m, area }) {
  const [cli] = clienteDe(m, area);
  return (
    <g fontFamily="inherit" textAnchor="middle">
      <rect x="7" y="7" width="136" height="184" rx="2" fill="none" stroke={VERDE} strokeWidth="1.2" />
      <rect x="10.5" y="10.5" width="129" height="177" rx="1.5" fill="none" stroke={VERDE} strokeWidth="0.4" />
      <g textAnchor="start">
        <Marca x={47} y={20} />
      </g>
      <text x="75" y="54" fontSize="11" fontWeight="700" fill={VERDE} letterSpacing="1">
        CERTIFICADO
      </text>
      <text x="75" y="61" fontSize="3.8" fill={CINZA} letterSpacing="1.4">
        DE TREINAMENTO
      </text>
      <text x="75" y="76" fontSize="4" fill={CINZA}>
        Certificamos que
      </text>
      <text x="75" y="86" fontSize="6.4" fontWeight="700" fill={TINTA}>
        Nome do Participante
      </text>
      <text x="75" y="95" fontSize="4" fill={CINZA}>
        concluiu o treinamento de
      </text>
      <text x="75" y="104" fontSize="5.4" fontWeight="700" fill={VERDE}>
        {m.doc || m.sub}
      </text>
      <text x="75" y="111.6" fontSize="3.5" fill={CINZA}>
        Carga horária e conteúdo conforme a norma
      </text>
      <text x="75" y="126" fontSize="3.6" fill={TINTA}>
        {cli} · Ibirá/SP, {DATA}
      </text>
      <line x1="18" y1="158" x2="68" y2="158" stroke={BORDA} />
      <line x1="82" y1="158" x2="132" y2="158" stroke={BORDA} />
      <text x="43" y="164" fontSize="3.4" fill={TINTA}>
        Instrutor
      </text>
      <text x="107" y="164" fontSize="3.4" fill={TINTA}>
        Responsável técnico
      </text>
      <text x="107" y="169" fontSize="2.8" fill={CINZA}>
        {RESP} · {CREA}
      </text>
    </g>
  );
}

function Folha({ x = 0, y = 0, rot = 0, m, area }) {
  const Layout = m.layout === "prancha" ? Prancha : m.layout === "certificado" ? Certificado : Capa;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="2" y="3" width="150" height="198" rx="3" fill="#000" opacity="0.1" />
      <rect width="150" height="198" rx="3" fill={PAPEL} stroke={BORDA} />
      <Layout m={m} area={area} />
    </g>
  );
}

// Só o desenho da folha (para usar dentro de um slide).
export function FolhaSvg({ m, nome, area }) {
  return (
    <svg className="folha-svg" viewBox="0 -10 158 218" role="img" aria-label={`Exemplo ilustrativo de ${nome}: ${(m.doc || m.sub).toLowerCase()}`} focusable="false">
      <Folha m={m} area={area} />
      <g transform="translate(60 -3) rotate(-9)">
        <rect width="48" height="13" rx="3" fill="#fff" stroke="#9b2c2c" strokeWidth="1.1" />
        <text x="24" y="9.4" fontSize="6.6" fontWeight="700" fill="#9b2c2c" textAnchor="middle" letterSpacing="0.8">
          EXEMPLO
        </text>
      </g>
    </svg>
  );
}

// Uma folha para um serviço/documento. `m` vem do campo `exemplo` do item em src/paginas.js.
export function FolhaExemplo({ m, nome, area }) {
  if (!m) return null;
  return (
    <figure className="folha-ex">
      <svg viewBox="0 -10 158 218" role="img" aria-label={`Exemplo ilustrativo de ${nome}: ${(m.doc || m.sub).toLowerCase()}`} focusable="false">
        <Folha m={m} area={area} />
        <g transform="translate(60 -3) rotate(-9)">
          <rect width="48" height="13" rx="3" fill="#fff" stroke="#9b2c2c" strokeWidth="1.1" />
          <text x="24" y="9.4" fontSize="6.6" fontWeight="700" fill="#9b2c2c" textAnchor="middle" letterSpacing="0.8">
            EXEMPLO
          </text>
        </g>
      </svg>
      <figcaption>{LEGENDA_EXEMPLO}</figcaption>
    </figure>
  );
}

const PAR = {
  "seguranca-do-trabalho": {
    alt: "Duas folhas de exemplo empilhadas: na frente, a capa de um Programa de Gerenciamento de Riscos (PGR) da RD para uma empresa fictícia; atrás, a capa de um LTCAT",
    frente: { titulo: "PGR", sub: "Programa de Gerenciamento de Riscos", layout: "capa", doc: "Programa de Gerenciamento de Riscos", ref: "PGR · NR-01", sumario: ["Identificação da organização", "Inventário de riscos", "Plano de ação"], art: true },
    tras: { titulo: "LTCAT", sub: "Laudo das condições do ambiente de trabalho", layout: "capa", doc: "Laudo Técnico das Condições do Ambiente de Trabalho", ref: "LTCAT" },
  },
  "corpo-de-bombeiros": {
    alt: "Duas folhas de exemplo empilhadas: na frente, a prancha de um projeto de segurança contra incêndio com planta e carimbo; atrás, a capa da preparação para a vistoria do AVCB",
    frente: { titulo: "PSCIP", sub: "Projeto de segurança contra incêndio", corpo: "planta", layout: "prancha", doc: "Projeto de Segurança Contra Incêndio", ref: "Planta de medidas de segurança", escala: "1:100", art: true },
    tras: { titulo: "AVCB", sub: "Preparação para a vistoria", layout: "capa", doc: "Preparação para Vistoria do AVCB", ref: "Lista de exigências" },
  },
  "engenharia-civil": {
    alt: "Duas folhas de exemplo empilhadas: na frente, a prancha de um projeto arquitetônico com planta e carimbo; atrás, a capa de um laudo técnico de vistoria",
    frente: { titulo: "PROJETO", sub: "Projeto arquitetônico", corpo: "planta", layout: "prancha", doc: "Projeto Arquitetônico", ref: "Planta baixa", escala: "1:50", art: true },
    tras: { titulo: "LAUDO", sub: "Laudo técnico de vistoria", layout: "capa", doc: "Laudo Técnico de Vistoria", ref: "Imóvel residencial" },
  },
  "meio-ambiente-topografia": {
    alt: "Duas folhas de exemplo empilhadas: na frente, a planta de um imóvel rural georreferenciado com vértices e carimbo; atrás, a prancha do mapa do imóvel para o CAR",
    frente: { titulo: "MEMORIAL", sub: "Georreferenciamento do imóvel", corpo: "terreno", layout: "prancha", doc: "Planta do Imóvel Georreferenciado", ref: "Vértices e confrontações", escala: "1:5.000", art: true },
    tras: { titulo: "CAR", sub: "Cadastro ambiental rural", corpo: "car", layout: "prancha", doc: "Mapa do Imóvel para o CAR", ref: "APP e reserva legal", escala: "1:5.000" },
  },
};

export default function DocsIlustracao({ slug }) {
  const m = PAR[slug];
  if (!m) return null;
  return (
    <figure className="docs-ilustra">
      <svg viewBox="0 0 335 250" role="img" aria-label={m.alt} focusable="false">
        <Folha x={168} y={10} rot={5} m={m.tras} area={slug} />
        <Folha x={26} y={28} rot={-4} m={m.frente} area={slug} />
        <g transform="translate(40 10) rotate(-10)">
          <rect width="62" height="16" rx="3" fill="#fff" stroke="#9b2c2c" strokeWidth="1.2" />
          <text x="31" y="11.4" fontSize="8" fontWeight="700" fill="#9b2c2c" textAnchor="middle" letterSpacing="1">
            EXEMPLO
          </text>
        </g>
      </svg>
      <figcaption>{LEGENDA_EXEMPLO}</figcaption>
    </figure>
  );
}
