// Conteúdo técnico das folhas de exemplo: os desenhos das pranchas e a "página interna" de cada capa.
// Tudo é fictício (cliente "Exemplo", números inventados), mas segue as convenções reais de cada documento,
// para o visitante reconhecer o que vai receber. Coordenadas na folha de 150 × 198.
import { AMBAR, AZUL, BORDA, CINZA, FUNDO, LINHA, MARROM, PAPEL, TINTA, VERDE, VERDE_CL, VERMELHO, Marca, clienteDe, quebra } from "./FolhaBase";

/* ── peças comuns ─────────────────────────────────────────────────────────────────────────────── */

function Tx({ x, y, s = 2.6, b, c = TINTA, a, r, children }) {
  return (
    <text x={x} y={y} fontSize={s} fontWeight={b ? 700 : 400} fill={c} textAnchor={a} transform={r ? `rotate(${r} ${x} ${y})` : undefined}>
      {children}
    </text>
  );
}

function Norte({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 -6l2.8 7.6-2.8-1.8-2.8 1.8z" fill={TINTA} />
      <Tx x={0} y={5.6} s={2.8} b a="middle">
        N
      </Tx>
    </g>
  );
}

function CotaH({ x1, x2, y, v }) {
  return (
    <g stroke={CINZA} strokeWidth="0.3">
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <line x1={x1} y1={y - 1.8} x2={x1} y2={y + 1.8} />
      <line x1={x2} y1={y - 1.8} x2={x2} y2={y + 1.8} />
      <path d={`M${x1 - 1} ${y + 1}l2 -2M${x2 - 1} ${y + 1}l2 -2`} strokeWidth="0.5" />
      <text x={(x1 + x2) / 2} y={y - 1} fontSize="2.4" fill={CINZA} stroke="none" textAnchor="middle">
        {v}
      </text>
    </g>
  );
}

function CotaV({ x, y1, y2, v }) {
  const ym = (y1 + y2) / 2;
  return (
    <g stroke={CINZA} strokeWidth="0.3">
      <line x1={x} y1={y1} x2={x} y2={y2} />
      <line x1={x - 1.8} y1={y1} x2={x + 1.8} y2={y1} />
      <line x1={x - 1.8} y1={y2} x2={x + 1.8} y2={y2} />
      <path d={`M${x - 1} ${y1 + 1}l2 -2M${x - 1} ${y2 + 1}l2 -2`} strokeWidth="0.5" />
      <text x={x - 1} y={ym} fontSize="2.4" fill={CINZA} stroke="none" textAnchor="middle" transform={`rotate(-90 ${x - 1} ${ym})`}>
        {v}
      </text>
    </g>
  );
}

// Janela: abertura na parede (papel por cima) com as duas linhas do caixilho.
function Janela({ x1, y1, x2, y2 }) {
  const h = y1 === y2;
  return (
    <g>
      <rect x={h ? x1 : x1 - 1.4} y={h ? y1 - 1.4 : y1} width={h ? x2 - x1 : 2.8} height={h ? 2.8 : y2 - y1} fill={PAPEL} />
      <g stroke={TINTA} strokeWidth="0.35">
        {h ? (
          <path d={`M${x1} ${y1 - 0.6}H${x2}M${x1} ${y1 + 0.6}H${x2}M${x1} ${y1 - 1.4}v2.8M${x2} ${y1 - 1.4}v2.8`} />
        ) : (
          <path d={`M${x1 - 0.6} ${y1}V${y2}M${x1 + 0.6} ${y1}V${y2}M${x1 - 1.4} ${y1}h2.8M${x1 - 1.4} ${y2}h2.8`} />
        )}
      </g>
    </g>
  );
}

// Porta: vão na parede, folha e arco de abertura. `arco` é o caminho do arco já calculado.
function Porta({ vao, folha, arco }) {
  return (
    <g>
      <rect {...vao} fill={PAPEL} />
      <path d={folha} stroke={TINTA} strokeWidth="0.6" fill="none" />
      <path d={arco} stroke={TINTA} strokeWidth="0.3" fill="none" strokeDasharray="1 0.8" />
    </g>
  );
}

function Comodo({ x, y, nome, area }) {
  return (
    <g>
      <Tx x={x} y={y} s={2.6} b a="middle">
        {nome}
      </Tx>
      {area && (
        <Tx x={x} y={y + 3.4} s={2.2} c={CINZA} a="middle">
          {area}
        </Tx>
      )}
    </g>
  );
}

function TituloDesenho({ y = 107, titulo, escala, x = 75 }) {
  return (
    <g>
      <Tx x={x} y={y} s={3} b a="middle">
        {titulo}
      </Tx>
      {escala && (
        <Tx x={x} y={y + 3.8} s={2.3} c={CINZA} a="middle">
          {escala}
        </Tx>
      )}
    </g>
  );
}

// Nuvem de revisão (contorno em arcos), como nas pranchas revisadas.
function nuvem(x, y, w, h, r = 1.6) {
  const nx = Math.max(1, Math.round(w / (2 * r)));
  const ny = Math.max(1, Math.round(h / (2 * r)));
  const dx = w / nx;
  const dy = h / ny;
  let d = `M${x} ${y}`;
  for (let i = 0; i < nx; i++) d += `a${dx / 2} ${dx / 2} 0 0 1 ${dx} 0`;
  for (let i = 0; i < ny; i++) d += `a${dy / 2} ${dy / 2} 0 0 1 0 ${dy}`;
  for (let i = 0; i < nx; i++) d += `a${dx / 2} ${dx / 2} 0 0 1 ${-dx} 0`;
  for (let i = 0; i < ny; i++) d += `a${dy / 2} ${dy / 2} 0 0 1 0 ${-dy}`;
  return d;
}

/* ── pranchas ─────────────────────────────────────────────────────────────────────────────────── */

// Residência térrea (projeto arquitetônico e as-built). 1 unidade = 10 cm.
function PlantaCasa({ asbuilt }) {
  return (
    <g>
      <CotaH x1={18} x2={132} y={13} v="11,40" />
      <CotaV x={11} y1={20} y2={96} v="7,60" />
      <g stroke={TINTA} fill="none" strokeLinecap="square">
        <rect x="18" y="20" width="114" height="76" strokeWidth="1.6" />
        <path d="M70 20V58M104 20V58M18 58H132M56 58V96M76 58V96" strokeWidth="0.9" />
      </g>
      <Janela x1={18} y1={30} x2={18} y2={44} />
      <Janela x1={78} y1={20} x2={96} y2={20} />
      <Janela x1={132} y1={28} x2={132} y2={40} />
      <Janela x1={26} y1={96} x2={44} y2={96} />
      <Janela x1={62} y1={96} x2={70} y2={96} />
      <Janela x1={92} y1={96} x2={116} y2={96} />
      <Porta vao={{ x: 30, y: 18.6, width: 9, height: 2.8 }} folha="M30 20V29" arco="M39 20A9 9 0 0 1 30 29" />
      <Porta vao={{ x: 40, y: 57, width: 7, height: 2 }} folha="M40 58V65" arco="M47 58A7 7 0 0 1 40 65" />
      <Porta vao={{ x: 59, y: 57, width: 6, height: 2 }} folha="M59 58V64" arco="M65 58A6 6 0 0 1 59 64" />
      <Porta vao={{ x: 82, y: 57, width: 7, height: 2 }} folha="M82 58V65" arco="M89 58A7 7 0 0 1 82 65" />
      <Porta vao={{ x: 103, y: 38, width: 2, height: 7 }} folha="M104 38H111" arco="M104 45A7 7 0 0 0 111 38" />
      <rect x="69" y="36" width="2" height="10" fill={PAPEL} />
      <Comodo x={44} y={41} nome="SALA" area="19,76 m²" />
      <Comodo x={87} y={41} nome="COZINHA" area="12,92 m²" />
      <Comodo x={118} y={51} nome="Á. SERV." area="10,64 m²" />
      <Comodo x={37} y={80} nome="QUARTO" area="14,44 m²" />
      <Comodo x={66} y={80} nome="BWC" area="7,60 m²" />
      <Comodo x={104} y={80} nome="SUÍTE" area="21,28 m²" />
      {asbuilt && (
        <g>
          <path d={nuvem(72, 60, 8, 34)} fill="none" stroke={VERMELHO} strokeWidth="0.5" />
          <path d="M80 60l3.4 -5.6h-6.8z" fill={VERMELHO} />
          <Tx x={80} y={58.6} s={2.2} b c="#fff" a="middle">
            1
          </Tx>
        </g>
      )}
      <TituloDesenho titulo={asbuilt ? "PLANTA BAIXA · COMO CONSTRUÍDO" : "PLANTA BAIXA"} escala="ESCALA 1:50 · ÁREA CONSTRUÍDA 86,64 m²" />
      {asbuilt && (
        <Tx x={12} y={118} s={2.2} c={VERMELHO}>
          1 · Parede do banheiro executada 0,20 m à direita do projeto aprovado.
        </Tx>
      )}
      <Norte x={136} y={108} />
    </g>
  );
}

// Salão comercial (projeto de incêndio e rota de fuga). 1 unidade = 20 cm.
function PlantaComercio({ rota }) {
  const ext = [[26, 88], [62, 26], [88, 50], [126, 90]];
  const luz = [[36, 40], [70, 40], [36, 76], [72, 76], [112, 30], [101, 75]];
  return (
    <g>
      <CotaH x1={18} x2={132} y={13} v="22,80" />
      <CotaV x={11} y1={20} y2={96} v="15,20" />
      <g stroke={TINTA} fill="none" strokeLinecap="square">
        <rect x="18" y="20" width="114" height="76" strokeWidth="1.6" />
        <path d="M92 20V96M92 62H132M110 62V96" strokeWidth="0.9" />
      </g>
      <Janela x1={60} y1={20} x2={84} y2={20} />
      <Porta vao={{ x: 40, y: 94.6, width: 14, height: 2.8 }} folha="M40 96V103M54 96V103" arco="M47 96A7 7 0 0 1 40 103M47 96A7 7 0 0 0 54 103" />
      <Porta vao={{ x: 91, y: 40, width: 2, height: 7 }} folha="M92 40H99" arco="M92 47A7 7 0 0 0 99 40" />
      <Porta vao={{ x: 95, y: 61, width: 6, height: 2 }} folha="M95 62V68" arco="M101 62A6 6 0 0 1 95 68" />
      <Porta vao={{ x: 114, y: 61, width: 6, height: 2 }} folha="M114 62V68" arco="M120 62A6 6 0 0 1 114 68" />
      {rota && <Porta vao={{ x: 16.6, y: 34, width: 2.8, height: 8 }} folha="M18 34H10" arco="M18 42A8 8 0 0 1 10 34" />}
      <Comodo x={55} y={58} nome="SALÃO DE VENDAS" area="224,96 m²" />
      <Comodo x={112} y={40} nome="ESTOQUE" area="67,20 m²" />
      <Comodo x={101} y={84} nome="WC" />
      <Comodo x={121} y={80} nome="ESCRIT." />
      {/* rota de fuga até a(s) saída(s) */}
      <g fill="none" stroke="#2f8f46" strokeWidth="0.8" strokeDasharray="2 1.4" strokeLinecap="round">
        <path d="M121 86L117 66L104 52L92 44L64 68L47 90" />
        {rota && <path d="M40 46L22 38" />}
      </g>
      <path d="M47 92l-2.6 -3.4h5.2z" fill="#2f8f46" />
      {rota && <path d="M19.4 37.4l3.8 -2.2 -0.4 4.4z" fill="#2f8f46" />}
      {/* sinalização de saída */}
      <g>
        <rect x="42.5" y="90" width="9" height="3.4" rx="0.6" fill="#2f8f46" />
        <Tx x={47} y={92.5} s={1.8} b c="#fff" a="middle">
          SAÍDA
        </Tx>
        {rota && (
          <g>
            <rect x="20.5" y="43" width="9" height="3.4" rx="0.6" fill="#2f8f46" />
            <Tx x={25} y={45.5} s={1.8} b c="#fff" a="middle">
              SAÍDA
            </Tx>
          </g>
        )}
      </g>
      {!rota &&
        ext.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="2.3" fill={VERMELHO} />
            <Tx x={x} y={y + 0.9} s={2.2} b c="#fff" a="middle">
              E
            </Tx>
          </g>
        ))}
      {!rota &&
        luz.map(([x, y]) => <rect key={`${x}-${y}`} x={x - 2} y={y - 1} width="4" height="2" rx="0.4" fill="#f2c230" stroke="#7a5b00" strokeWidth="0.3" />)}
      {rota && (
        <g>
          {[[24, 62], [96, 26]].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <rect x={x - 2.6} y={y - 2} width="5.2" height="4" fill={VERMELHO} />
              <Tx x={x} y={y + 1} s={2.4} b c="#fff" a="middle">
                H
              </Tx>
            </g>
          ))}
          {[[52, 92], [88, 30]].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="1.9" fill="#fff" stroke={VERMELHO} strokeWidth="0.8" />
              <circle cx={x} cy={y} r="0.7" fill={VERMELHO} />
            </g>
          ))}
          <Tx x={12} y={103} s={2.1} c={CINZA}>
            Caminhamento máximo: 26 m
          </Tx>
        </g>
      )}
      <TituloDesenho titulo={rota ? "ROTA DE FUGA, HIDRANTES E ALARME" : "PLANTA DE MEDIDAS DE SEGURANÇA"} escala="ESCALA 1:100 · ÁREA 346,56 m²" />
      <g transform="translate(12 115)" fontSize="2.2">
        {(rota
          ? [
              ["h", "Hidrante"],
              ["a", "Acionador de alarme"],
              ["s", "Saída"],
              ["r", "Rota de fuga"],
            ]
          : [
              ["e", "Extintor PQS"],
              ["l", "Iluminação de emergência"],
              ["s", "Saída"],
              ["r", "Rota de fuga"],
            ]
        ).map(([k, rotulo], i) => (
          <g key={k} transform={`translate(${(i % 2) * 62} ${Math.floor(i / 2) * 4.6})`}>
            {k === "e" && <circle cx="1.6" cy="-0.8" r="1.6" fill={VERMELHO} />}
            {k === "l" && <rect x="0" y="-1.8" width="3.4" height="1.8" fill="#f2c230" stroke="#7a5b00" strokeWidth="0.3" />}
            {k === "h" && <rect x="0" y="-2" width="3.4" height="2.6" fill={VERMELHO} />}
            {k === "a" && <circle cx="1.6" cy="-0.8" r="1.4" fill="#fff" stroke={VERMELHO} strokeWidth="0.7" />}
            {k === "s" && <rect x="0" y="-1.8" width="3.4" height="1.8" fill="#2f8f46" />}
            {k === "r" && <path d="M0 -0.8h3.4" stroke="#2f8f46" strokeWidth="0.8" strokeDasharray="1.2 0.8" />}
            <text x="5" y="0" fill={TINTA}>
              {rotulo}
            </text>
          </g>
        ))}
      </g>
      <Norte x={137} y={110} />
    </g>
  );
}

// Cronograma físico-financeiro: etapas por semana e desembolso por mês.
const ETAPAS = [
  ["Serviços preliminares", 0, 1, 4],
  ["Fundação", 1, 2, 12],
  ["Estrutura", 2, 4, 22],
  ["Alvenaria", 4, 3, 14],
  ["Cobertura", 6, 2, 10],
  ["Instalações", 6, 4, 16],
  ["Acabamentos", 8, 4, 18],
  ["Limpeza e entrega", 11, 1, 4],
];

function Cronograma() {
  const x0 = 54;
  const sem = 6;
  const y0 = 26;
  const alto = 8.6;
  return (
    <g>
      <rect x="10" y="12" width="130" height="14" fill={FUNDO} />
      <Tx x={12} y={21} s={2.4} b c={CINZA}>
        ETAPA
      </Tx>
      {["MÊS 1", "MÊS 2", "MÊS 3"].map((m, i) => (
        <Tx key={m} x={x0 + i * 24 + 12} y={17.4} s={2.3} b c={CINZA} a="middle">
          {m}
        </Tx>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <Tx key={i} x={x0 + i * sem + 3} y={23.6} s={1.9} c={CINZA} a="middle">
          {i + 1}
        </Tx>
      ))}
      <Tx x={135} y={21} s={2.4} b c={CINZA} a="middle">
        %
      </Tx>
      <g stroke={LINHA} strokeWidth="0.3">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={x0 + i * sem} y1={19.6} x2={x0 + i * sem} y2={y0 + ETAPAS.length * alto} strokeWidth={i % 4 === 0 ? 0.6 : 0.3} />
        ))}
        {ETAPAS.map((_, r) => (
          <line key={r} x1="10" y1={y0 + (r + 1) * alto} x2="140" y2={y0 + (r + 1) * alto} />
        ))}
      </g>
      {ETAPAS.map(([nome, ini, dur, pct], r) => {
        const y = y0 + r * alto;
        return (
          <g key={nome}>
            <Tx x={12} y={y + 5.6} s={2.4}>
              {nome}
            </Tx>
            <rect x={x0 + ini * sem + 0.6} y={y + 2.6} width={dur * sem - 1.2} height="3.6" rx="1.2" fill={r % 2 ? "#4f9a5b" : VERDE} />
            <Tx x={135} y={y + 5.6} s={2.4} a="middle">
              {pct}
            </Tx>
          </g>
        );
      })}
      {(() => {
        const y = y0 + ETAPAS.length * alto;
        return (
          <g>
            <rect x="10" y={y} width="130" height="15" fill={FUNDO} />
            <Tx x={12} y={y + 5.4} s={2.3} b>
              Desembolso no mês
            </Tx>
            <Tx x={12} y={y + 11.6} s={2.3} b>
              Acumulado
            </Tx>
            {[
              ["27%", "27%"],
              ["43%", "70%"],
              ["30%", "100%"],
            ].map(([m, a], i) => (
              <g key={i}>
                <Tx x={x0 + i * 24 + 12} y={y + 5.4} s={2.4} b c={VERDE} a="middle">
                  {m}
                </Tx>
                <Tx x={x0 + i * 24 + 12} y={y + 11.6} s={2.4} a="middle">
                  {a}
                </Tx>
              </g>
            ))}
          </g>
        );
      })()}
      <TituloDesenho y={115} titulo="CRONOGRAMA FÍSICO-FINANCEIRO" escala="PRAZO TOTAL: 12 SEMANAS" />
    </g>
  );
}

// Mapa do imóvel para o CAR: APP ao longo do córrego, reserva legal e área de uso consolidado.
function MapaCar({ uid }) {
  const poli = "16,98 28,22 98,14 136,40 126,100";
  const rio = "M70 8C78 32 60 50 78 64S106 84 114 110";
  return (
    <g>
      <defs>
        <clipPath id={`${uid}-car`}>
          <polygon points={poli} />
        </clipPath>
        <clipPath id={`${uid}-rl`}>
          <rect x="26" y="56" width="34" height="34" />
        </clipPath>
      </defs>
      <polygon points={poli} fill="#f3f6ef" />
      <g clipPath={`url(#${uid}-car)`}>
        <path d={rio} fill="none" stroke={VERDE_CL} strokeWidth="13" opacity="0.7" />
        <path d={rio} fill="none" stroke={AZUL} strokeWidth="1.1" />
        <g clipPath={`url(#${uid}-rl)`} stroke={VERDE} strokeWidth="0.45">
          {Array.from({ length: 18 }, (_, i) => (
            <line key={i} x1={26 + i * 4 - 34} y1="90" x2={26 + i * 4} y2="56" />
          ))}
        </g>
      </g>
      <rect x="26" y="56" width="34" height="34" fill="none" stroke={VERDE} strokeWidth="0.7" />
      <polygon points={poli} fill="none" stroke={TINTA} strokeWidth="0.9" />
      <rect x="100" y="56" width="4" height="4" fill={TINTA} />
      <Tx x={102} y={64.4} s={2.2} a="middle">
        Sede
      </Tx>
      <rect x="31" y="68.6" width="24" height="8.4" rx="1" fill="#fff" opacity="0.92" />
      <Tx x={43} y={72} s={2.2} b c={VERDE} a="middle">
        RESERVA
      </Tx>
      <Tx x={43} y={75.4} s={2.2} b c={VERDE} a="middle">
        LEGAL
      </Tx>
      <Tx x={74} y={40} s={2.1} b c="#2c6a34" r={-62}>
        APP 30 m
      </Tx>
      <Tx x={112} y={78} s={2.1} c={CINZA} a="middle">
        uso consolidado
      </Tx>
      <Norte x={130} y={14} />
      <TituloDesenho y={106} titulo="MAPA DO IMÓVEL PARA O CAR" escala="ÁREA 48,32 ha · RESERVA LEGAL 9,66 ha (20%)" />
      <g transform="translate(12 117)" fontSize="2.2">
        <rect x="0" y="-2.2" width="4" height="2.6" fill="none" stroke={VERDE} strokeWidth="0.5" />
        <path d="M0 0.4l2.6-2.6M1.6 0.4l2.4-2.4" stroke={VERDE} strokeWidth="0.4" />
        <text x="5.6" y="0" fill={TINTA}>
          Reserva legal
        </text>
        <rect x="34" y="-2.2" width="4" height="2.6" fill={VERDE_CL} />
        <text x="39.6" y="0" fill={TINTA}>
          APP
        </text>
        <path d="M54 -0.8h5" stroke={AZUL} strokeWidth="0.9" />
        <text x="61" y="0" fill={TINTA}>
          Córrego
        </text>
        <path d="M82 -0.8h5" stroke={TINTA} strokeWidth="0.8" />
        <text x="89" y="0" fill={TINTA}>
          Limite do imóvel
        </text>
      </g>
    </g>
  );
}

// Planta do georreferenciamento: vértices, azimutes e distâncias, e a tabela de coordenadas.
const VERTICES = [
  ["M-0001", 14, 96, "675.108,90", "7.671.233,84", 16, 101.6, "start"],
  ["M-0002", 24, 22, "675.212,48", "7.671.905,12", 22, 19.6, "end"],
  ["M-0003", 70, 14, "675.672,31", "7.671.987,40", 72, 11.8, "start"],
  ["M-0004", 92, 52, "675.891,05", "7.671.607,22", 89, 57.4, "end"],
  ["M-0005", 78, 104, "675.749,63", "7.671.120,57", 80, 108.2, "start"],
];

function Georref() {
  const pts = VERTICES.map(([, x, y]) => `${x},${y}`).join(" ");
  return (
    <g>
      <polygon points={pts} fill="#eef4ec" stroke={TINTA} strokeWidth="0.9" />
      {VERTICES.map(([id, x, y, , , lx, ly, la]) => (
        <g key={id}>
          <circle cx={x} cy={y} r="1.3" fill="#fff" stroke={TINTA} strokeWidth="0.5" />
          <circle cx={x} cy={y} r="0.45" fill={TINTA} />
          <Tx x={lx} y={ly} s={2.1} b a={la}>
            {id}
          </Tx>
        </g>
      ))}
      <Tx x={46} y={16.2} s={1.9} c={CINZA} a="middle" r={-9.9}>
        Az 80°08' · 467,12 m
      </Tx>
      <Tx x={83} y={31} s={1.9} c={CINZA} a="middle" r={59.9}>
        Az 149°55' · 438,90 m
      </Tx>
      <Tx x={50} y={60} s={2.4} b c={VERDE} a="middle">
        SÍTIO EXEMPLO
      </Tx>
      <Tx x={6} y={60} s={1.9} c={CINZA} a="middle" r={-90}>
        Confrontante: Sítio Vizinho A
      </Tx>
      <Tx x={46} y={110} s={1.9} c={CINZA} a="middle" r={7}>
        Estrada municipal
      </Tx>
      <g transform="translate(97 14)">
        <rect x="0" y="0" width="43" height="6" fill={FUNDO} />
        <Tx x={1.2} y={4.2} s={1.9} b c={CINZA}>
          VÉRTICE
        </Tx>
        <Tx x={13} y={4.2} s={1.9} b c={CINZA}>
          E (m)
        </Tx>
        <Tx x={27.4} y={4.2} s={1.9} b c={CINZA}>
          N (m)
        </Tx>
        {VERTICES.map(([id, , , e, n], i) => (
          <g key={id}>
            <line x1="0" y1={6 + i * 5.4} x2="43" y2={6 + i * 5.4} stroke={LINHA} strokeWidth="0.3" />
            <Tx x={1.2} y={10 + i * 5.4} s={1.9}>
              {id}
            </Tx>
            <Tx x={13} y={10 + i * 5.4} s={1.9}>
              {e}
            </Tx>
            <Tx x={27.4} y={10 + i * 5.4} s={1.9}>
              {n}
            </Tx>
          </g>
        ))}
        <Tx x={0} y={40} s={2.1} c={CINZA}>
          SIRGAS 2000 · UTM fuso 22S
        </Tx>
        <Tx x={0} y={44.6} s={2.3} b>
          Área: 48,32 ha
        </Tx>
        <Tx x={0} y={49} s={2.3} b>
          Perímetro: 2.914,36 m
        </Tx>
      </g>
      <Norte x={128} y={74} />
      <TituloDesenho y={118} x={56} titulo="PLANTA DO IMÓVEL GEORREFERENCIADO" escala="ESCALA 1:5.000" />
    </g>
  );
}

// Levantamento planialtimétrico: curvas a cada 1 m, mestras a cada 5 m, pontos cotados.
function Curvas({ uid }) {
  const curvas = Array.from({ length: 12 }, (_, i) => {
    const cota = 505 + i;
    const base = 96 - i * 7.2;
    let d = "";
    for (let x = 12; x <= 138; x += 6) {
      const y = base + 4.2 * Math.sin(x * 0.045 + i * 0.35) - (x > 70 && x < 96 ? 3 : 0);
      d += `${d ? "L" : "M"}${x} ${y.toFixed(2)}`;
    }
    return { cota, d, mestra: cota % 5 === 0, yl: base + 4.2 * Math.sin(40 * 0.045 + i * 0.35) };
  });
  return (
    <g>
      <defs>
        <clipPath id={`${uid}-lev`}>
          <polygon points="12,100 14,14 136,12 138,98" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-lev)`} fill="none">
        {curvas.map((c) => (
          <path key={c.cota} d={c.d} stroke={c.mestra ? MARROM : "#b79a7a"} strokeWidth={c.mestra ? 0.7 : 0.3} />
        ))}
        <path d="M82 12C80 40 86 60 84 100" stroke={AZUL} strokeWidth="0.6" strokeDasharray="2 1.2" />
      </g>
      {curvas
        .filter((c) => c.mestra)
        .map((c) => (
          <g key={c.cota}>
            <rect x="36" y={c.yl - 2.4} width="9" height="3.4" fill={PAPEL} />
            <Tx x={40.5} y={c.yl + 0.4} s={2.2} b c={MARROM} a="middle">
              {c.cota}
            </Tx>
          </g>
        ))}
      {[
        [110, 30, "+514,20"],
        [28, 80, "+506,85"],
        [62, 54, "+509,40"],
      ].map(([x, y, v]) => (
        <g key={v}>
          <path d={`M${x - 1.2} ${y}h2.4M${x} ${y - 1.2}v2.4`} stroke={TINTA} strokeWidth="0.4" />
          <Tx x={x + 1.8} y={y - 1} s={2.1}>
            {v}
          </Tx>
        </g>
      ))}
      <polygon points="12,100 14,14 136,12 138,98" fill="none" stroke={TINTA} strokeWidth="0.9" />
      <Tx x={86} y={104} s={2} c={AZUL}>
        drenagem natural
      </Tx>
      <g transform="translate(14 110)">
        <rect x="0" y="0" width="12" height="1.6" fill={TINTA} />
        <rect x="12" y="0" width="12" height="1.6" fill="#fff" stroke={TINTA} strokeWidth="0.3" />
        <Tx x={0} y={5} s={2} a="middle">
          0
        </Tx>
        <Tx x={12} y={5} s={2} a="middle">
          25
        </Tx>
        <Tx x={24} y={5} s={2} a="middle">
          50 m
        </Tx>
      </g>
      <TituloDesenho y={111} x={82} titulo="PLANTA PLANIALTIMÉTRICA" escala="CURVAS A CADA 1 m · ESCALA 1:1.000" />
      <Norte x={136} y={110} />
    </g>
  );
}

// Desenho da prancha (área de x 9 a 141 e y 9 a 122; o carimbo começa em y 126).
export function Desenho({ tipo, uid }) {
  switch (tipo) {
    case "incendio":
      return <PlantaComercio />;
    case "rota":
      return <PlantaComercio rota />;
    case "planta":
      return <PlantaCasa />;
    case "asbuilt":
      return <PlantaCasa asbuilt />;
    case "gantt":
      return <Cronograma />;
    case "car":
      return <MapaCar uid={uid} />;
    case "terreno":
      return <Georref />;
    case "curvas":
      return <Curvas uid={uid} />;
    default:
      return null;
  }
}

/* ── páginas internas das capas ───────────────────────────────────────────────────────────────── */

const COR_ESTADO = {
  Baixo: VERDE,
  Moderado: AMBAR,
  Médio: AMBAR,
  Alto: VERMELHO,
  Conforme: VERDE,
  Pendente: AMBAR,
  Enviado: VERDE,
  "Em andamento": AMBAR,
  Exigida: AZUL,
  "Acima do limite": VERMELHO,
  "Abaixo do limite": VERDE,
  "Sem exposição": VERDE,
  "Insalubre, grau médio": VERMELHO,
  "Não insalubre": VERDE,
  "Não perigoso": VERDE,
  Concluído: VERDE,
  "Em análise": AMBAR,
  Aguardando: CINZA,
  Protocolada: AZUL,
};

function Chip({ x, y, t, s = 2.1 }) {
  const cor = COR_ESTADO[t] || CINZA;
  const w = t.length * s * 0.6 + 3;
  return (
    <g>
      <rect x={x} y={y - s - 0.4} width={w} height={s + 2.2} rx="1.4" fill={cor} fillOpacity="0.12" stroke={cor} strokeWidth="0.35" />
      <text x={x + 1.5} y={y + 0.2} fontSize={s} fontWeight="700" fill={cor}>
        {t}
      </text>
    </g>
  );
}

// Tabela com cabeçalho; células com até duas linhas. Uma célula { chip: "Alto" } vira etiqueta colorida.
function Tabela({ x = 10, y, cols, linhas, alto = 9.6, s = 2.3 }) {
  const xs = [x];
  cols.forEach((c) => xs.push(xs[xs.length - 1] + c.w));
  const W = xs[xs.length - 1] - x;
  return (
    <g>
      <rect x={x} y={y} width={W} height="7" fill={FUNDO} />
      {cols.map((c, i) => (
        <text key={c.t} x={xs[i] + 1.4} y={y + 4.7} fontSize={s} fontWeight="700" fill={CINZA}>
          {c.t}
        </text>
      ))}
      {linhas.map((l, r) => {
        const yy = y + 7 + r * alto;
        return (
          <g key={r}>
            <line x1={x} y1={yy} x2={x + W} y2={yy} stroke={LINHA} strokeWidth="0.4" />
            {l.map((cel, i) =>
              cel && typeof cel === "object" ? (
                <Chip key={i} x={xs[i] + 1.2} y={yy + 4.4} t={cel.chip} s={s * 0.9} />
              ) : (
                quebra(cel, Math.max(5, Math.floor((cols[i].w - 2.4) / (s * 0.5))))
                  .slice(0, 2)
                  .map((t, k) => (
                    <text key={`${i}-${k}`} x={xs[i] + 1.4} y={yy + 3.8 + k * (s + 0.9)} fontSize={s} fill={TINTA}>
                      {t}
                    </text>
                  ))
              )
            )}
          </g>
        );
      })}
      <line x1={x} y1={y + 7 + linhas.length * alto} x2={x + W} y2={y + 7 + linhas.length * alto} stroke={BORDA} strokeWidth="0.5" />
    </g>
  );
}

function Lista({ y, itens }) {
  return (
    <g>
      {itens.map(([t, estado, obs], k) => {
        const yy = y + k * 10.4;
        const feito = ["Conforme", "Enviado", "Concluído", "Exigida"].includes(estado);
        return (
          <g key={t}>
            <rect x="10" y={yy - 3.4} width="4.4" height="4.4" rx="1" fill="none" stroke={VERDE} strokeWidth="0.6" />
            {feito && <path d={`M11 ${yy - 1.2}l1.2 1.2 2-2.6`} fill="none" stroke={VERDE} strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />}
            <Tx x={18} y={yy} s={2.7}>
              {t}
            </Tx>
            {obs && (
              <Tx x={18} y={yy + 3.6} s={2.2} c={CINZA}>
                {obs}
              </Tx>
            )}
            <Chip x={140 - (estado.length * 2.1 * 0.6 + 3)} y={yy} t={estado} />
            <line x1="10" y1={yy + 6} x2="140" y2={yy + 6} stroke={LINHA} strokeWidth="0.35" />
          </g>
        );
      })}
    </g>
  );
}

function Paragrafo({ y, texto, s = 2.7, max = 84, c = TINTA }) {
  return quebra(texto, max).map((l, k) => (
    <Tx key={k} x={10} y={y + k * (s + 1.5)} s={s} c={c}>
      {l}
    </Tx>
  ));
}

const LISTAS = {
  "PGR × PCMSO": [
    ["Funções e setores da empresa", "Enviado"],
    ["Riscos de cada função (inventário do PGR)", "Enviado"],
    ["Exposições acima do nível de ação", "Enviado", "Ruído no setor de produção"],
    ["Medidas de proteção em uso", "Enviado"],
    ["Mudanças previstas no plano de ação", "Em andamento", "Troca de máquina em 2027"],
  ],
  AVCB: [
    ["Extintores", "Conforme", "Dentro da validade e sinalizados"],
    ["Sinalização de emergência", "Conforme"],
    ["Iluminação de emergência", "Pendente", "2 blocos autônomos sem bateria"],
    ["Saídas de emergência desobstruídas", "Conforme"],
    ["Brigada de incêndio", "Pendente", "Treinamento a agendar"],
    ["Hidrantes e mangueiras", "Conforme", "Teste de mangueiras em dia"],
  ],
  CLCB: [
    ["Extintores", "Exigida"],
    ["Sinalização de emergência", "Exigida"],
    ["Iluminação de emergência", "Exigida"],
    ["Saídas de emergência", "Exigida"],
  ],
};

// Cada capa ganha uma página interna: { secao, intro, conteudo(y) }.
const MIOLOS = {
  tabela: {
    intro: "Para cada setor: os perigos, as possíveis lesões, o nível de risco (probabilidade × severidade) e as medidas de prevenção.",
    corpo: () => (
      <g>
        <Tabela
          y={52}
          alto={10.4}
          cols={[
            { t: "Setor", w: 20 },
            { t: "Perigo", w: 27 },
            { t: "Possível lesão", w: 26 },
            { t: "Nível", w: 19 },
            { t: "Medida de prevenção", w: 38 },
          ]}
          linhas={[
            ["Produção", "Ruído de máquinas", "Perda auditiva", { chip: "Moderado" }, "Protetor auricular; manutenção"],
            ["Produção", "Partes móveis da serra", "Cortes e esmagamento", { chip: "Alto" }, "Proteção fixa; bloqueio na manutenção"],
            ["Depósito", "Empilhamento alto", "Queda de objetos", { chip: "Moderado" }, "Prateleiras fixas; limite de altura"],
            ["Escritório", "Postura sentada", "Dor lombar", { chip: "Baixo" }, "Cadeira ajustável; pausas"],
            ["Pátio", "Circulação de veículos", "Atropelamento", { chip: "Alto" }, "Faixa de pedestres; sinalização"],
          ]}
        />
        <Tx x={10} y={122} s={2.6} b>
          Matriz de risco
        </Tx>
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => {
            const n = r + c;
            return <rect key={`${r}${c}`} x={10 + c * 8} y={126 + (2 - r) * 8} width="7.4" height="7.4" rx="1" fill={n < 2 ? VERDE : n < 3 ? AMBAR : VERMELHO} opacity="0.75" />;
          })
        )}
        <Tx x={22} y={153} s={2} c={CINZA} a="middle">
          Severidade →
        </Tx>
        <Tx x={7.6} y={138} s={2} c={CINZA} a="middle" r={-90}>
          Probabilidade →
        </Tx>
        {[
          ["Baixo", "manter os controles existentes"],
          ["Moderado", "incluir no plano de ação, com prazo"],
          ["Alto", "ação imediata antes de seguir a atividade"],
        ].map(([n, t], k) => (
          <g key={n}>
            <Chip x={42} y={131 + k * 7.4} t={n} />
            <Tx x={66} y={131 + k * 7.4} s={2.5}>
              {t}
            </Tx>
          </g>
        ))}
      </g>
    ),
  },
  residuos: {
    intro: "Resíduos gerados na empresa, classificados conforme a ABNT NBR 10004, com a forma de guardar e o destino de cada um.",
    corpo: () => (
      <g>
        <Tabela
          y={52}
          alto={10.4}
          cols={[
            { t: "Resíduo", w: 30 },
            { t: "Classe", w: 14 },
            { t: "Acondicionamento", w: 40 },
            { t: "Destino", w: 46 },
          ]}
          linhas={[
            ["Papel e papelão", "II A", "Contêiner azul em área coberta", "Coleta seletiva e reciclagem"],
            ["Lâmpadas fluorescentes", "I", "Caixa original, local seco", "Logística reversa (empresa licenciada)"],
            ["Óleo lubrificante usado", "I", "Tambor sobre bacia de contenção", "Coleta para rerrefino"],
            ["Restos de alimentos", "II A", "Lixeira com tampa e pedal", "Coleta municipal"],
            ["Entulho de reforma", "II B", "Caçamba identificada", "Aterro de inertes licenciado"],
          ]}
        />
        <Paragrafo y={124} texto="Registros: manifestos de transporte de resíduos (MTR) e certificados de destinação ficam arquivados por resíduo e por saída." />
        <Paragrafo y={140} s={2.4} c={CINZA} texto="Classe I: perigoso. Classe II A: não perigoso e não inerte. Classe II B: não perigoso e inerte." />
      </g>
    ),
  },
  apr: {
    intro: "Atividade: troca de telhas do galpão (trabalho em altura). Antes de começar, a equipe confere cada etapa e as medidas de controle.",
    corpo: () => (
      <g>
        <Tabela
          y={52}
          alto={10.4}
          cols={[
            { t: "Etapa", w: 24 },
            { t: "Perigo", w: 23 },
            { t: "Risco", w: 15 },
            { t: "Medida de controle", w: 46 },
            { t: "Resp.", w: 22 },
          ]}
          linhas={[
            ["Acesso ao telhado", "Queda de altura", { chip: "Alto" }, "Linha de vida, cinto paraquedista, equipe treinada na NR-35", "Encarregado"],
            ["Retirada das telhas", "Queda de materiais", { chip: "Médio" }, "Isolar a área abaixo; capacete com jugular", "Encarregado"],
            ["Corte e fixação", "Cortes nas mãos", { chip: "Baixo" }, "Luvas e ferramenta adequada", "Equipe"],
            ["Condições do tempo", "Chuva e vento", { chip: "Médio" }, "Suspender a atividade com chuva ou vento forte", "Encarregado"],
          ]}
        />
        <Tx x={10} y={115} s={2.7} b>
          Liberação da atividade
        </Tx>
        <Tx x={10} y={122} s={2.6}>
          ( ) Liberada ( ) Não liberada
        </Tx>
        <g stroke={BORDA} strokeWidth="0.5">
          <line x1="10" y1="146" x2="68" y2="146" />
          <line x1="82" y1="146" x2="140" y2="146" />
        </g>
        <Tx x={39} y={150.4} s={2.3} c={CINZA} a="middle">
          Elaborado por
        </Tx>
        <Tx x={111} y={150.4} s={2.3} c={CINZA} a="middle">
          Liberado por
        </Tx>
      </g>
    ),
  },
  checklist: {
    intro: (m) =>
      ({
        "PGR × PCMSO": "Informações do PGR que o médico do trabalho usa para elaborar o PCMSO. O PCMSO é de responsabilidade do médico.",
        AVCB: "Situação de cada medida de segurança contra incêndio antes de pedir a vistoria do Corpo de Bombeiros.",
        CLCB: "Dados da edificação usados para verificar se ela pode ser regularizada pelo CLCB, e as medidas exigidas.",
      })[m.titulo] || null,
    corpo: (m) =>
      m.titulo === "CLCB" ? (
        <g>
          {[
            ["Área construída", "480,00 m²"],
            ["Altura da edificação", "6,00 m"],
            ["Ocupação", "Comércio varejista"],
            ["Pavimentos", "1 (térreo)"],
          ].map(([k, v], i) => (
            <g key={k}>
              <Tx x={10} y={56 + i * 7} s={2.6} c={CINZA}>
                {k}
              </Tx>
              <Tx x={140} y={56 + i * 7} s={2.6} b a="end">
                {v}
              </Tx>
              <line x1="10" y1={58.4 + i * 7} x2="140" y2={58.4 + i * 7} stroke={LINHA} strokeWidth="0.35" />
            </g>
          ))}
          <rect x="10" y="88" width="130" height="11" rx="2" fill={FUNDO} />
          <Tx x={14} y={95.2} s={2.8} b>
            Resultado: a edificação atende às condições do CLCB.
          </Tx>
          <Tx x={10} y={110} s={2.8} b>
            Medidas de segurança exigidas
          </Tx>
          <Lista y={120} itens={LISTAS.CLCB} />
        </g>
      ) : (
        <Lista y={56} itens={LISTAS[m.titulo] || LISTAS.AVCB} />
      ),
  },
  grafico: {
    intro: "Ruído medido por função, comparado ao limite de tolerância de 85 dB(A) para 8 horas de trabalho (NR-15, Anexo 1).",
    corpo: () => {
      const funcoes = [
        ["Operador de máquina", 91.3],
        ["Auxiliar de produção", 86.8],
        ["Almoxarife", 79.5],
        ["Administrativo", 68.2],
      ];
      const xb = (v) => 52 + (v - 60) * 2;
      return (
        <g>
          {funcoes.map(([f, v], i) => (
            <g key={f}>
              <Tx x={10} y={60 + i * 9} s={2.5}>
                {f}
              </Tx>
              <rect x="52" y={56 + i * 9} width={xb(v) - 52} height="5" rx="1" fill={v > 85 ? VERMELHO : VERDE} opacity="0.85" />
              <Tx x={xb(v) + 1.6} y={60 + i * 9} s={2.4} b>
                {v.toFixed(1).replace(".", ",")}
              </Tx>
            </g>
          ))}
          <line x1={xb(85)} y1="52" x2={xb(85)} y2="92" stroke={VERMELHO} strokeWidth="0.5" strokeDasharray="1.6 1" />
          <Tx x={xb(85)} y={50.6} s={2.1} b c={VERMELHO} a="middle">
            85 dB(A)
          </Tx>
          {[60, 70, 80, 90, 100].map((v) => (
            <Tx key={v} x={xb(v)} y={96} s={1.9} c={CINZA} a="middle">
              {v}
            </Tx>
          ))}
          <Tx x={xb(100)} y={99.6} s={1.9} c={CINZA} a="end">
            dB(A)
          </Tx>
          <Tabela
            y={104}
            alto={8}
            cols={[
              { t: "Função", w: 40 },
              { t: "Agente", w: 24 },
              { t: "Conclusão", w: 66 },
            ]}
            linhas={[
              ["Operador de máquina", "Ruído", { chip: "Acima do limite" }],
              ["Auxiliar de produção", "Ruído", { chip: "Acima do limite" }],
              ["Almoxarife", "Ruído", { chip: "Abaixo do limite" }],
              ["Administrativo", "—", { chip: "Sem exposição" }],
            ]}
          />
        </g>
      );
    },
  },
  medicao: {
    intro: "Resultados das avaliações no posto de trabalho e a conclusão segundo a NR-15 (insalubridade) e a NR-16 (periculosidade).",
    corpo: () => (
      <g>
        <path d="M30 84a22 22 0 0 1 44 0" fill="none" stroke={LINHA} strokeWidth="5" />
        <path d="M30 84a22 22 0 0 1 33.6 -18.6" fill="none" stroke={VERDE_CL} strokeWidth="5" />
        <path d="M63.6 65.4a22 22 0 0 1 10.4 18.6" fill="none" stroke={VERMELHO} strokeWidth="5" opacity="0.75" />
        <line x1="52" y1="84" x2="68" y2="70" stroke={TINTA} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="52" cy="84" r="2" fill={TINTA} />
        <Tx x={52} y={93} s={4.4} b a="middle">
          88,2 dB(A)
        </Tx>
        <Tx x={52} y={97.6} s={2.2} c={CINZA} a="middle">
          ruído no posto · limite 85 dB(A)
        </Tx>
        {["Posto: operador da serra", "Jornada: 8 horas", "Medição: dosímetro de ruído", "Medidas: 3 dias de trabalho"].map((t, k) => (
          <Tx key={t} x={84} y={66 + k * 5} s={2.4} c={CINZA}>
            {t}
          </Tx>
        ))}
        <Tabela
          y={104}
          alto={10.4}
          cols={[
            { t: "Agente", w: 26 },
            { t: "Medido", w: 24 },
            { t: "Critério", w: 26 },
            { t: "Conclusão", w: 54 },
          ]}
          linhas={[
            ["Ruído contínuo", "88,2 dB(A)", "NR-15, Anexo 1", { chip: "Insalubre, grau médio" }],
            ["Calor", "IBUTG 25,9 °C", "NR-15, Anexo 3", { chip: "Não insalubre" }],
            ["Inflamáveis", "—", "NR-16", { chip: "Não perigoso" }],
          ]}
        />
        <Paragrafo y={150} s={2.4} c={CINZA} texto="Insalubridade em grau médio dá direito ao adicional de 20% sobre o salário mínimo, enquanto a exposição continuar." />
      </g>
    ),
  },
  fachada: {
    intro: "Anomalias encontradas na vistoria da fachada, numeradas no desenho, com a prioridade de correção de cada uma.",
    corpo: () => (
      <g>
        <path d="M18 58L75 46L132 58" fill="none" stroke={TINTA} strokeWidth="0.9" />
        <rect x="22" y="58" width="106" height="44" fill="#f6f4ee" stroke={TINTA} strokeWidth="0.9" />
        {[34, 58, 92, 116].map((x) => (
          <rect key={x} x={x - 6} y="64" width="12" height="11" fill="#e4ebef" stroke={TINTA} strokeWidth="0.5" />
        ))}
        {[34, 116].map((x) => (
          <rect key={x} x={x - 6} y="82" width="12" height="11" fill="#e4ebef" stroke={TINTA} strokeWidth="0.5" />
        ))}
        <rect x="68" y="80" width="14" height="22" fill="#d9cdb8" stroke={TINTA} strokeWidth="0.5" />
        <path d="M64 75l3 4-2 3 3 4-1 3" fill="none" stroke={VERMELHO} strokeWidth="0.7" strokeLinecap="round" />
        <ellipse cx="100" cy="61.6" rx="9" ry="3" fill={MARROM} opacity="0.35" />
        <rect x="40" y="95" width="12" height="7" fill="#c9bfae" />
        <path d="M40 102l4-7M44 102l4-7M48 102l4-7" stroke="#8d8270" strokeWidth="0.4" />
        {[
          [1, 68, 72],
          [2, 100, 56],
          [3, 46, 92],
        ].map(([n, x, y]) => (
          <g key={n}>
            <circle cx={x + 5} cy={y - 3} r="2.6" fill={VERMELHO} />
            <Tx x={x + 5} y={y - 2} s={2.6} b c="#fff" a="middle">
              {n}
            </Tx>
          </g>
        ))}
        <Tabela
          y={108}
          alto={9}
          cols={[
            { t: "Nº", w: 10 },
            { t: "Anomalia", w: 56 },
            { t: "Sistema", w: 30 },
            { t: "Grau de risco", w: 34 },
          ]}
          linhas={[
            ["1", "Fissura inclinada no canto da janela", "Vedação", { chip: "Médio" }],
            ["2", "Mancha de umidade sob o beiral", "Cobertura", { chip: "Alto" }],
            ["3", "Desplacamento do reboco junto ao piso", "Revestimento", { chip: "Alto" }],
          ]}
        />
      </g>
    ),
  },
  laudo: {
    intro: "Registro fotográfico da vistoria, com a descrição de cada ponto observado no imóvel.",
    corpo: () => (
      <g>
        <rect x="10" y="50" width="62" height="40" fill="#dfe8ee" />
        <rect x="10" y="76" width="62" height="14" fill="#cfd8c4" />
        <path d="M24 76V60l17-9 17 9v16z" fill="#f2efe6" stroke={TINTA} strokeWidth="0.5" />
        <rect x="37" y="66" width="8" height="10" fill="#b9a68a" />
        <rect x="78" y="50" width="62" height="40" fill="#efece4" />
        <path d="M96 52l4 8-3 6 5 9-2 6 4 8" fill="none" stroke="#6a5a48" strokeWidth="0.8" strokeLinecap="round" />
        <rect x="78" y="50" width="62" height="40" fill="none" stroke={BORDA} strokeWidth="0.5" />
        <rect x="10" y="50" width="62" height="40" fill="none" stroke={BORDA} strokeWidth="0.5" />
        <Tx x={10} y={95} s={2.4} c={CINZA}>
          Foto 1 · Fachada frontal
        </Tx>
        <Tx x={78} y={95} s={2.4} c={CINZA}>
          Foto 2 · Fissura na parede da sala
        </Tx>
        <Tx x={10} y={106} s={2.8} b>
          Observações
        </Tx>
        <Paragrafo y={112} texto="A fissura da foto 2 é superficial, no reboco, sem sinais de movimentação da estrutura nesta vistoria. Recomenda-se abrir a fissura, aplicar selante flexível e refazer a pintura." />
        <Tx x={10} y={134} s={2.8} b>
          Conclusão
        </Tx>
        <Paragrafo y={140} texto="O imóvel apresenta condições de uso. As correções indicadas são de manutenção e podem ser feitas sem desocupar o imóvel." />
      </g>
    ),
  },
  fluxo: {
    idx: 2,
    intro: "Etapas do licenciamento ambiental da atividade e do pedido de outorga de uso da água, com a situação de cada uma.",
    corpo: () => {
      const etapas = [
        ["1. Enquadramento da atividade", "Concluído"],
        ["2. Licença Prévia (LP)", "Concluído"],
        ["3. Licença de Instalação (LI)", "Em análise"],
        ["4. Licença de Operação (LO)", "Aguardando"],
      ];
      return (
        <g>
          {etapas.map(([t, e], i) => (
            <g key={t}>
              <rect x="10" y={52 + i * 18} width="84" height="12" rx="2.4" fill={i < 2 ? FUNDO : "#fff"} stroke={i === 2 ? AMBAR : BORDA} strokeWidth="0.6" />
              <Tx x={14} y={59.6 + i * 18} s={2.7} b>
                {t}
              </Tx>
              <Chip x={100} y={59.4 + i * 18} t={e} />
              {i < 3 && <path d={`M52 ${64 + i * 18}v5m-2 -2 2 2 2 -2`} fill="none" stroke={CINZA} strokeWidth="0.6" />}
            </g>
          ))}
          <rect x="10" y="126" width="130" height="14" rx="2.4" fill="#fff" stroke={AZUL} strokeWidth="0.6" strokeDasharray="2 1.2" />
          <Tx x={14} y={134.6} s={2.7} b>
            Outorga de uso da água (poço)
          </Tx>
          <Chip x={100} y={134.4} t="Protocolada" />
          <Paragrafo y={150} s={2.4} c={CINZA} texto="Protocolo nº 000000/2026 (exemplo). A RD acompanha os prazos e responde às exigências do órgão ambiental." />
        </g>
      );
    },
  },
};

export const TEM_MIOLO = new Set(Object.keys(MIOLOS));

export function Miolo({ m, area }) {
  const conteudo = MIOLOS[m.corpo];
  if (!conteudo) return null;
  const [cli] = clienteDe(m, area);
  const intro = typeof conteudo.intro === "function" ? conteudo.intro(m) : conteudo.intro;
  const i = conteudo.idx ?? 1;
  const secao = m.sumario?.[i] ? `${i + 1}. ${m.sumario[i]}` : m.doc || m.sub;
  return (
    <g fontFamily="inherit">
      <Marca x={10} y={7} s={0.62} />
      <Tx x={140} y={11} s={2.6} c={CINZA} a="end">
        {m.ref || m.titulo}
      </Tx>
      <Tx x={140} y={15.2} s={2.6} c={CINZA} a="end">
        Página 4 de 18
      </Tx>
      <line x1="10" y1="19.5" x2="140" y2="19.5" stroke={VERDE} strokeWidth="0.5" />
      {quebra(secao, 34)
        .slice(0, 2)
        .map((l, k) => (
          <Tx key={l} x={10} y={30 + k * 5.6} s={4.4} b>
            {l}
          </Tx>
        ))}
      {intro && <Paragrafo y={quebra(secao, 34).length > 1 ? 43 : 38} s={2.6} c={CINZA} max={88} texto={intro} />}
      {conteudo.corpo(m)}
      <line x1="10" y1="182" x2="140" y2="182" stroke={BORDA} strokeWidth="0.5" />
      <Tx x={10} y={187.4} s={2.4} c={CINZA}>
        {cli} · {m.titulo}
      </Tx>
      <Tx x={140} y={187.4} s={2.4} c={CINZA} a="end">
        Revisão 00 · RD Engenharia
      </Tx>
    </g>
  );
}

/* ── "Como ler": pontos numerados sobre a folha ───────────────────────────────────────────────── */

export const PINOS = {
  capa: [
    { x: 4.6, y: 47, t: "Nome do documento e a norma que ele atende." },
    { x: 4.6, y: 118, t: "Contratante: a sua empresa ou você." },
    { x: 4.6, y: 150, t: "Responsável técnico, com o registro no CREA." },
    { x: 145.4, y: 147, t: "ART: registro, no CREA, de quem responde tecnicamente pelo serviço." },
    { x: 4.6, y: 186, t: "Data e revisão: mostram se o documento está atualizado." },
  ],
  prancha: [
    { x: 75, y: 62, t: "O desenho: planta, mapa ou cronograma, com escala e orientação." },
    { x: 54, y: 133, t: "Carimbo: o título da prancha." },
    { x: 145.4, y: 148, t: "Cliente e local do imóvel ou da empresa." },
    { x: 145.4, y: 174, t: "Responsável técnico, com o registro no CREA." },
    { x: 4.6, y: 187, t: "Escala, data, número da folha e se há ART." },
  ],
  certificado: [
    { x: 75, y: 57, t: "Tipo de certificado e treinamento." },
    { x: 75, y: 104, t: "Treinamento concluído e a norma a que ele se refere." },
    { x: 107, y: 167, t: "Assinaturas do instrutor e do responsável técnico (em branco no exemplo)." },
  ],
};
