// Ilustrações de documentos de exemplo para a seção "Para agilizar, separe" de cada área.
// São desenhos genéricos feitos para o site (nada é um documento real, não há dados de ninguém):
// folhas de papel com título, linhas de texto, área de selo e etiqueta "ART". O papel é sempre claro,
// então funciona nos temas claro e escuro. Cada ilustração tem texto alternativo e legenda visível.

const PAPEL = "#fdfdfb";
const BORDA = "#c9d0c6";
const LINHA = "#dde2da";
const TINTA = "#26302a";
const VERDE = "#1f6b2a";

const MODELOS = {
  "seguranca-do-trabalho": {
    alt: "Duas folhas de exemplo empilhadas: a da frente é um Programa de Gerenciamento de Riscos (PGR) e a de trás é um laudo LTCAT, ambas com linhas de texto, selo e etiqueta ART",
    frente: { titulo: "PGR", sub: "Programa de Gerenciamento de Riscos", corpo: "tabela", art: true },
    tras: { titulo: "LTCAT", sub: "Laudo das condições do ambiente de trabalho", corpo: "linhas" },
  },
  "corpo-de-bombeiros": {
    alt: "Duas folhas de exemplo empilhadas: a da frente é um projeto de segurança contra incêndio e pânico (PSCIP), com planta simples, e a de trás é um AVCB, com linhas de texto e selo",
    frente: { titulo: "PSCIP", sub: "Projeto de segurança contra incêndio e pânico", corpo: "planta", art: true },
    tras: { titulo: "AVCB", sub: "Auto de vistoria do Corpo de Bombeiros", corpo: "linhas" },
  },
  "engenharia-civil": {
    alt: "Duas folhas de exemplo empilhadas: a da frente é um projeto arquitetônico com planta simples e a de trás é um laudo técnico, com linhas de texto, selo e etiqueta ART",
    frente: { titulo: "PROJETO", sub: "Projeto arquitetônico", corpo: "planta", art: true },
    tras: { titulo: "LAUDO", sub: "Laudo técnico de vistoria", corpo: "linhas" },
  },
  "meio-ambiente-topografia": {
    alt: "Duas folhas de exemplo empilhadas: a da frente é um memorial de georreferenciamento com o desenho de um terreno e a de trás é um cadastro ambiental rural (CAR), com linhas de texto e selo",
    frente: { titulo: "MEMORIAL", sub: "Georreferenciamento do imóvel", corpo: "terreno", art: true },
    tras: { titulo: "CAR", sub: "Cadastro ambiental rural", corpo: "linhas" },
  },
};

function Linhas({ x, y, n, largura, passo = 9 }) {
  const tam = [1, 0.92, 0.97, 0.7, 1, 0.85, 0.95, 0.6];
  return Array.from({ length: n }, (_, k) => (
    <rect key={k} x={x} y={y + k * passo} width={largura * tam[k % tam.length]} height="3" rx="1.5" fill={LINHA} />
  ));
}

function Folha({ x, y, rot, m, completa }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="2" y="3" width="150" height="198" rx="5" fill="#000" opacity="0.1" />
      <rect width="150" height="198" rx="5" fill={PAPEL} stroke={BORDA} />
      <rect x="10" y="12" width="130" height="30" rx="3" fill={VERDE} />
      <text x="18" y="27" fontSize="11" fontWeight="700" fill="#fff" letterSpacing="0.5">
        {m.titulo}
      </text>
      <text x="18" y="37" fontSize="5.6" fill="#e2f0e2">
        {m.sub.length > 44 ? m.sub.slice(0, 43) + "…" : m.sub}
      </text>
      <Linhas x={10} y={54} n={completa ? 3 : 5} largura={130} />
      {completa && m.corpo === "tabela" && (
        <g>
          <rect x="10" y="86" width="130" height="46" rx="2" fill="none" stroke={BORDA} />
          <line x1="10" y1="100" x2="140" y2="100" stroke={BORDA} />
          <line x1="10" y1="114" x2="140" y2="114" stroke={BORDA} />
          <line x1="62" y1="86" x2="62" y2="132" stroke={BORDA} />
          <line x1="102" y1="86" x2="102" y2="132" stroke={BORDA} />
          <rect x="14" y="91" width="30" height="3" rx="1.5" fill={LINHA} />
          <rect x="14" y="105" width="38" height="3" rx="1.5" fill={LINHA} />
          <rect x="14" y="119" width="26" height="3" rx="1.5" fill={LINHA} />
          <rect x="106" y="91" width="20" height="3" rx="1.5" fill="#e8b4a8" />
          <rect x="106" y="105" width="20" height="3" rx="1.5" fill="#efd9a0" />
          <rect x="106" y="119" width="20" height="3" rx="1.5" fill="#b8d8b6" />
        </g>
      )}
      {completa && m.corpo === "planta" && (
        <g fill="none" stroke={TINTA} strokeWidth="1.4" opacity="0.75">
          <rect x="18" y="88" width="114" height="46" />
          <line x1="58" y1="88" x2="58" y2="134" />
          <line x1="58" y1="112" x2="132" y2="112" />
          <line x1="92" y1="112" x2="92" y2="134" />
          <path d="M30 88 v6 M44 88 v6" />
        </g>
      )}
      {completa && m.corpo === "terreno" && (
        <g>
          <polygon points="24,126 40,92 92,86 130,104 118,132" fill="#e4eee2" stroke={TINTA} strokeWidth="1.4" opacity="0.8" />
          {[ [24,126], [40,92], [92,86], [130,104], [118,132] ].map(([cx, cy], k) => (
            <circle key={k} cx={cx} cy={cy} r="2.4" fill={VERDE} />
          ))}
        </g>
      )}
      {!completa && <Linhas x={10} y={86} n={6} largura={130} />}
      <Linhas x={10} y={completa ? 144 : 146} n={2} largura={90} />
      {/* área de selo e assinatura */}
      <circle cx="30" cy="180" r="11" fill="none" stroke={VERDE} strokeWidth="1.2" strokeDasharray="3 2" opacity="0.8" />
      <line x1="62" y1="186" x2="132" y2="186" stroke={BORDA} />
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

export default function DocsIlustracao({ slug }) {
  const m = MODELOS[slug];
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
      <figcaption>Exemplo ilustrativo de documento, não é um documento real.</figcaption>
    </figure>
  );
}
