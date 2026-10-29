// Ilustrações de documentos de exemplo, desenhadas como capas e pranchas de verdade. Nada é um documento
// real: o cliente é fictício ("Exemplo"), não há assinatura nem número de ART; só os dados públicos da RD
// e do responsável técnico (os mesmos do rodapé) aparecem. Toda folha leva o carimbo "EXEMPLO".
// O papel é sempre claro, então funciona nos temas claro e escuro. Cada folha tem texto alternativo.
//  - FolhaSvg: a folha (capa, prancha ou certificado), ou a página interna de uma capa.
//  - FolhaLeitura: a folha ampliada, com abas "Capa / Página interna / Como ler" e zoom.
//  - DocsIlustracao (padrão): duas folhas empilhadas na seção "Para agilizar, separe".
import { useId, useState } from "react";
import { BORDA, CINZA, CREA, DATA, FUNDO, LEGENDA_EXEMPLO, Marca, PAPEL, RD_CNPJ, RESP, SeloExemplo, TINTA, VERDE, VERMELHO, clienteDe, quebra } from "./FolhaBase";
import { Desenho, Miolo, PINOS, TEM_MIOLO } from "./DocsDesenhos";

export { LEGENDA_EXEMPLO };

// ── Folhas com cara de documento de verdade ──────────────────────────────────────────────────
// Três formatos, escolhidos por `m.layout` (campo `exemplo` em src/paginas.js):
//  - "capa": capa de relatório (laudos, programas, análises), com sumário e uma página interna;
//  - "prancha": desenho técnico com carimbo (plantas, mapas, cronograma);
//  - "certificado": certificado de treinamento.

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
                {[3, 4, 11][k]}
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

function Prancha({ m, area, uid }) {
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
      <Desenho tipo={m.corpo} uid={uid} />
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

function Folha({ x = 0, y = 0, rot = 0, m, area, pagina = "folha", uid }) {
  const Layout = m.layout === "prancha" ? Prancha : m.layout === "certificado" ? Certificado : Capa;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="2" y="3" width="150" height="198" rx="3" fill="#000" opacity="0.1" />
      <rect width="150" height="198" rx="3" fill={PAPEL} stroke={BORDA} />
      {pagina === "miolo" ? <Miolo m={m} area={area} /> : <Layout m={m} area={area} uid={uid} />}
    </g>
  );
}

function Pinos({ lista }) {
  return (
    <g>
      {lista.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4.4" fill={VERMELHO} stroke="#fff" strokeWidth="0.9" />
          <text x={p.x} y={p.y + 1.6} fontSize="4.4" fontWeight="700" fill="#fff" textAnchor="middle">
            {i + 1}
          </text>
        </g>
      ))}
    </g>
  );
}

const descricao = (m, nome, pagina) =>
  pagina === "miolo"
    ? `Página interna de exemplo de ${nome}: ${(m.doc || m.sub).toLowerCase()}`
    : `Exemplo ilustrativo de ${nome}: ${(m.doc || m.sub).toLowerCase()}`;

// A folha (ou a página interna de uma capa), com o carimbo EXEMPLO e, se pedido, os pontos de "Como ler".
export function FolhaSvg({ m, nome, area, pagina = "folha", pinos = null }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg className="folha-svg" viewBox="0 -10 158 218" role="img" aria-label={descricao(m, nome, pagina)} focusable="false">
      <Folha m={m} area={area} pagina={pagina} uid={uid} />
      {pinos && <Pinos lista={pinos} />}
      <SeloExemplo x={60} y={-3} />
    </svg>
  );
}

// Folha ampliada: capa ou prancha, página interna (das capas), "Como ler" com pontos numerados e zoom.
export function FolhaLeitura({ m, nome, area }) {
  const [vista, setVista] = useState("folha");
  const [zoom, setZoom] = useState(false);
  const temMiolo = m.layout === "capa" && TEM_MIOLO.has(m.corpo);
  const pinos = vista === "ler" ? PINOS[m.layout] || PINOS.capa : null;
  const abas = [
    ["folha", m.layout === "capa" ? "Capa" : m.layout === "certificado" ? "Certificado" : "Prancha"],
    ...(temMiolo ? [["miolo", "Página interna"]] : []),
    ["ler", "Como ler"],
  ];
  return (
    <div className="folha-leitura" data-zoom={zoom ? "" : undefined}>
      <div className="folha-leitura-barra">
        <div className="folha-abas" role="group" aria-label="O que ver na folha">
          {abas.map(([id, rotulo]) => (
            <button key={id} type="button" aria-pressed={vista === id} onClick={() => setVista(id)}>
              {rotulo}
            </button>
          ))}
        </div>
        <button type="button" className="folha-zoom" aria-pressed={zoom} onClick={() => setZoom((z) => !z)}>
          {zoom ? "Reduzir" : "Ampliar"}
        </button>
      </div>
      <div className="folha-leitura-area" tabIndex={zoom ? 0 : undefined} aria-label={zoom ? "Folha ampliada: role para ver as partes" : undefined}>
        <FolhaSvg m={m} nome={nome} area={area} pagina={vista === "miolo" ? "miolo" : "folha"} pinos={pinos} />
      </div>
      {pinos && (
        <ol className="folha-pinos">
          {pinos.map((p, i) => (
            <li key={i}>
              <span aria-hidden="true">{i + 1}</span>
              {p.t}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// Uma folha para um serviço/documento. `m` vem do campo `exemplo` do item em src/paginas.js.
export function FolhaExemplo({ m, nome, area }) {
  if (!m) return null;
  return (
    <figure className="folha-ex">
      <FolhaSvg m={m} nome={nome} area={area} />
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
    alt: "Duas folhas de exemplo empilhadas: na frente, a prancha de um projeto de segurança contra incêndio com planta, extintores, iluminação de emergência, rota de fuga e carimbo; atrás, a capa da preparação para a vistoria do AVCB",
    frente: { titulo: "PSCIP", sub: "Projeto de segurança contra incêndio", corpo: "incendio", layout: "prancha", doc: "Projeto de Segurança Contra Incêndio", ref: "Planta de medidas de segurança", escala: "1:100", art: true },
    tras: { titulo: "AVCB", sub: "Preparação para a vistoria", layout: "capa", doc: "Preparação para Vistoria do AVCB", ref: "Lista de exigências" },
  },
  "engenharia-civil": {
    alt: "Duas folhas de exemplo empilhadas: na frente, a prancha de um projeto arquitetônico com planta baixa cotada e carimbo; atrás, a capa de um laudo técnico de vistoria",
    frente: { titulo: "PROJETO", sub: "Projeto arquitetônico", corpo: "planta", layout: "prancha", doc: "Projeto Arquitetônico", ref: "Planta baixa", escala: "1:50", art: true },
    tras: { titulo: "LAUDO", sub: "Laudo técnico de vistoria", layout: "capa", doc: "Laudo Técnico de Vistoria", ref: "Imóvel residencial" },
  },
  "meio-ambiente-topografia": {
    alt: "Duas folhas de exemplo empilhadas: na frente, a planta de um imóvel rural georreferenciado com vértices, coordenadas e carimbo; atrás, a prancha do mapa do imóvel para o CAR",
    frente: { titulo: "MEMORIAL", sub: "Georreferenciamento do imóvel", corpo: "terreno", layout: "prancha", doc: "Planta do Imóvel Georreferenciado", ref: "Vértices e confrontações", escala: "1:5.000", art: true },
    tras: { titulo: "CAR", sub: "Cadastro ambiental rural", corpo: "car", layout: "prancha", doc: "Mapa do Imóvel para o CAR", ref: "APP e reserva legal", escala: "1:5.000" },
  },
};

export default function DocsIlustracao({ slug }) {
  const uid = useId().replace(/:/g, "");
  const m = PAR[slug];
  if (!m) return null;
  return (
    <figure className="docs-ilustra">
      <svg viewBox="0 0 335 250" role="img" aria-label={m.alt} focusable="false">
        <Folha x={168} y={10} rot={5} m={m.tras} area={slug} uid={`${uid}t`} />
        <Folha x={26} y={28} rot={-4} m={m.frente} area={slug} uid={`${uid}f`} />
        <SeloExemplo x={40} y={10} rot={-10} s={1.3} />
      </svg>
      <figcaption>{LEGENDA_EXEMPLO}</figcaption>
    </figure>
  );
}
