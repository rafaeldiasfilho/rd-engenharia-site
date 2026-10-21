// Ilustrações de documentos de exemplo. São desenhos genéricos feitos para o site: nada é um documento
// real, não há números legais, dados de ninguém nem assinaturas (a linha de assinatura fica em branco).
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

function Folha({ x = 0, y = 0, rot = 0, m, completa = true }) {
  const t = m.sub && m.sub.length > 44 ? m.sub.slice(0, 43) + "…" : m.sub;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="2" y="3" width="150" height="198" rx="5" fill="#000" opacity="0.1" />
      <rect width="150" height="198" rx="5" fill={PAPEL} stroke={BORDA} />
      <rect x="10" y="12" width="130" height="30" rx="3" fill={VERDE} />
      <text x="18" y="27" fontSize="11" fontWeight="700" fill="#fff" letterSpacing="0.5">
        {m.titulo}
      </text>
      <text x="18" y="37" fontSize="5.6" fill="#e2f0e2">
        {t}
      </text>
      {completa ? <Corpo tipo={m.corpo} /> : <Linhas x={10} y={54} n={11} largura={130} />}
      <Linhas x={10} y={completa ? 148 : 156} n={completa ? 2 : 1} largura={90} />
      <circle cx="30" cy="182" r="10" fill="none" stroke={VERDE} strokeWidth="1.2" strokeDasharray="3 2" opacity="0.8" />
      <line x1="62" y1="188" x2="132" y2="188" stroke={BORDA} />
      {m.art && (
        <g>
          <rect x="106" y="160" width="28" height="13" rx="6.5" fill="none" stroke={VERDE} strokeWidth="1.2" />
          <text x="120" y="169.6" fontSize="7.5" fontWeight="700" fill={VERDE} textAnchor="middle">
            ART
          </text>
        </g>
      )}
    </g>
  );
}

// Uma folha para um serviço/documento. `m` vem do campo `exemplo` do item em src/paginas.js.
export function FolhaExemplo({ m, nome }) {
  if (!m) return null;
  return (
    <figure className="folha-ex">
      <svg viewBox="0 -10 158 218" role="img" aria-label={`Exemplo ilustrativo de ${nome}: folha com ${m.sub.toLowerCase()}`} focusable="false">
        <Folha m={m} />
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
    alt: "Duas folhas de exemplo empilhadas: a da frente é um Programa de Gerenciamento de Riscos (PGR) e a de trás é um laudo LTCAT, ambas com linhas de texto, selo e etiqueta ART",
    frente: { titulo: "PGR", sub: "Programa de Gerenciamento de Riscos", corpo: "tabela", art: true },
    tras: { titulo: "LTCAT", sub: "Laudo das condições do ambiente de trabalho" },
  },
  "corpo-de-bombeiros": {
    alt: "Duas folhas de exemplo empilhadas: a da frente é um projeto de segurança contra incêndio e pânico (PSCIP), com planta simples, e a de trás é um AVCB, com linhas de texto e selo",
    frente: { titulo: "PSCIP", sub: "Projeto de segurança contra incêndio e pânico", corpo: "planta", art: true },
    tras: { titulo: "AVCB", sub: "Auto de vistoria do Corpo de Bombeiros" },
  },
  "engenharia-civil": {
    alt: "Duas folhas de exemplo empilhadas: a da frente é um projeto arquitetônico com planta simples e a de trás é um laudo técnico, com linhas de texto, selo e etiqueta ART",
    frente: { titulo: "PROJETO", sub: "Projeto arquitetônico", corpo: "planta", art: true },
    tras: { titulo: "LAUDO", sub: "Laudo técnico de vistoria" },
  },
  "meio-ambiente-topografia": {
    alt: "Duas folhas de exemplo empilhadas: a da frente é um memorial de georreferenciamento com o desenho de um terreno e a de trás é um cadastro ambiental rural (CAR), com linhas de texto e selo",
    frente: { titulo: "MEMORIAL", sub: "Georreferenciamento do imóvel", corpo: "terreno", art: true },
    tras: { titulo: "CAR", sub: "Cadastro ambiental rural" },
  },
};

export default function DocsIlustracao({ slug }) {
  const m = PAR[slug];
  if (!m) return null;
  return (
    <figure className="docs-ilustra">
      <svg viewBox="0 0 335 250" role="img" aria-label={m.alt} focusable="false">
        <Folha x={168} y={10} rot={5} m={m.tras} completa={false} />
        <Folha x={26} y={28} rot={-4} m={m.frente} completa />
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
