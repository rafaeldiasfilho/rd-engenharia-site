import { useEffect, useRef, useState } from "react";
import IconeArea from "./Icones";
import { FOTOS, caminho, srcset } from "./fotos";

// Blocos de vitrine da página inicial: faixa de documentos, painel de exemplo e números.
// Nada aqui inventa cliente, depoimento ou dado real: o painel é um exemplo rotulado como ilustrativo.

// Documentos que já aparecem nas páginas do site.
const DOCUMENTOS = [
  "PGR", "LTCAT", "PPP", "PCMSO", "APR", "AET", "Treinamentos de NR", "Laudo de insalubridade",
  "AVCB", "CLCB", "PSCIP", "Projeto arquitetônico", "Habite-se", "As-built", "ART", "Laudo de vistoria",
  "Inspeção predial", "CAR", "Georreferenciamento", "Topografia", "Outorga", "Licenciamento ambiental", "PGRS",
];

// Faixa que anda devagar; para ao passar o mouse ou focar e fica parada com "reduzir movimento" (CSS).
export function FaixaDocumentos() {
  const grupo = (oculto) => (
    <ul className="marquee-grupo" aria-hidden={oculto ? "true" : undefined}>
      {DOCUMENTOS.map((d) => (
        <li key={d}>{d}</li>
      ))}
    </ul>
  );
  return (
    <section className="marquee" aria-label="Documentos e serviços que a RD elabora">
      <div className="marquee-trilho">
        {grupo(false)}
        {grupo(true)}
      </div>
    </section>
  );
}

const ITENS_PAINEL = [
  { nome: "PGR", estado: "ok" },
  { nome: "LTCAT", estado: "ok" },
  { nome: "AVCB", estado: "vence" },
  { nome: "Treinamento NR-35", estado: "ok" },
  { nome: "Laudo de insalubridade", estado: "pendente" },
];
const ROTULO = { ok: "Em dia", vence: "Vence em 30 dias", pendente: "Pendente" };
const SIMBOLO = { ok: "✓", vence: "◔", pendente: "○" };

// Cartão no estilo de painel, só para explicar a organização dos documentos. Dados inventados.
export function PainelExemplo() {
  const emDia = ITENS_PAINEL.filter((x) => x.estado === "ok").length;
  const pct = Math.round((emDia / ITENS_PAINEL.length) * 100);
  return (
    <figure className="painel">
      <div className="painel-cab">
        <span>Painel de documentos</span>
        <span className="painel-selo">Exemplo ilustrativo</span>
      </div>
      <div className="painel-numero">
        <strong>{pct}%</strong>
        <span>
          dos documentos em dia ({emDia} de {ITENS_PAINEL.length})
        </span>
      </div>
      <div className="painel-barra" role="img" aria-label={`${emDia} de ${ITENS_PAINEL.length} documentos em dia`}>
        <i style={{ width: `${pct}%` }} />
      </div>
      <ul className="painel-lista">
        {ITENS_PAINEL.map((x) => (
          <li key={x.nome}>
            <span>{x.nome}</span>
            <span className={`chip chip-${x.estado}`}>
              <span aria-hidden="true">{SIMBOLO[x.estado]}</span> {ROTULO[x.estado]}
            </span>
          </li>
        ))}
      </ul>
      <figcaption>Exemplo ilustrativo, sem dados de clientes: nomes e situações são inventados para mostrar como os vencimentos ficam organizados.</figcaption>
    </figure>
  );
}

// Número que sobe uma vez quando entra na tela. O texto final já está no HTML (sem script, aparece igual);
// com "reduzir movimento" fica direto no valor final.
function Numero({ alvo, sufixo = "" }) {
  const [v, setV] = useState(alvo);
  const ref = useRef(null);
  useEffect(() => {
    const reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduz || !("IntersectionObserver" in window) || !ref.current) return undefined;
    let raf = 0;
    let fim = 0;
    let feito = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || feito) return;
        feito = true;
        io.disconnect();
        const dur = 1400;
        const t0 = performance.now();
        const passo = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          setV(Math.round(alvo * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(passo);
        };
        setV(0);
        raf = requestAnimationFrame(passo);
        fim = setTimeout(() => setV(alvo), dur + 400); // garante o valor final mesmo se o navegador pausar a animação
      },
      { threshold: 0.6 }
    );
    io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(fim);
    };
  }, [alvo]);
  return (
    <span ref={ref}>
      {v}
      {sufixo}
    </span>
  );
}

// Faixa verde escura com os números ditos pelo dono.
export function FaixaNumeros() {
  return (
    <section className="faixa-numeros" aria-label="A RD em números">
      <div className="container faixa-numeros-grade">
        <p className="rev">
          <strong>
            <Numero alvo={500} sufixo="+" />
          </strong>
          <span>documentos técnicos</span>
        </p>
        <p className="rev">
          <strong>
            <Numero alvo={70} sufixo="+" />
          </strong>
          <span>projetos</span>
        </p>
        <p className="rev">
          <strong>
            <small>Desde</small> 2017
          </strong>
          <span>em Ibirá/SP</span>
        </p>
      </div>
    </section>
  );
}

// Bancada de equipamentos: duas fichas por área, cada uma com foto, nome e para que serve.
// Sem movimento. O título de cada ficha leva aos equipamentos da página da área. Textos tirados da pesquisa de equipamentos (o que COSTUMA ser usado, nunca o inventário da RD).
// As fotos também estão nas listas "equip-*" de fotos.js, então /creditos já cobre todas.
const BANCADA = [
  {
    slug: "seguranca-do-trabalho",
    nome: "Segurança do trabalho",
    itens: [
      { foto: "dosimetro-ruido-calibrador-acustico", nome: "Dosímetro de ruído", uso: "Fica preso ao trabalhador e registra o ruído recebido ao longo da jornada." },
      { foto: "medidor-nivel-sonoro-portatil", nome: "Decibelímetro", uso: "Mede o ruído de um ponto, na hora, para mapear o ambiente." },
    ],
  },
  {
    slug: "corpo-de-bombeiros",
    nome: "Corpo de Bombeiros",
    itens: [
      { foto: "extintor-em-caixa-com-sinalizacao", nome: "Extintor e sinalização", uso: "Combate inicial ao fogo; o tipo e o lugar dependem do risco do imóvel." },
      { foto: "detector-fumaca-teto", nome: "Detector de fumaça", uso: "Parte do alarme: avisa as pessoas logo no início do fogo." },
    ],
  },
  {
    slug: "engenharia-civil",
    nome: "Engenharia civil",
    itens: [
      { foto: "trena-aco-5-metros", nome: "Trena", uso: "Mede cômodos e fachadas para o desenho do que foi construído (as-built)." },
      { foto: "estacao-total-amarela-campo", nome: "Estação total", uso: "Mede ângulos, distâncias e alturas no terreno e na obra." },
    ],
  },
  {
    slug: "meio-ambiente-topografia",
    nome: "Meio ambiente e topografia",
    itens: [
      { foto: "receptor-gnss-sobre-tripe-gramado", nome: "Receptor GNSS", uso: "GPS de precisão: mede por satélite as coordenadas dos limites do imóvel." },
      { foto: "drone-multirotor-camera", nome: "Drone com câmera", uso: "Fotos aéreas para mapear o terreno, nos casos em que o método é permitido." },
    ],
  },
];

export function FaixaEquipamentos() {
  return (
    <section className="sec bancada" id="equipamentos" aria-labelledby="equip-t">
      <div className="container">
        <header className="sec-cab rev">
          <h2 id="equip-t" className="sec-titulo">
            Equipamentos de referência em cada área.
          </h2>
          <p className="lead">O que costuma ser usado para medir, conferir e documentar cada tipo de serviço.</p>
        </header>
        <div className="bancada-grade">
          {BANCADA.map((a) => (
            <article key={a.slug} className="bancada-area rev" aria-labelledby={`bancada-${a.slug}`}>
              <h3 id={`bancada-${a.slug}`} className="bancada-area-t">
                <a href={`/${a.slug}#equipamentos`}>
                  <IconeArea slug={a.slug} tamanho={20} /> {a.nome} <span aria-hidden="true">→</span>
                </a>
              </h3>
              <ul className="bancada-itens">
                {a.itens
                  .filter((i) => FOTOS[i.foto])
                  .map((i) => {
                    const f = FOTOS[i.foto];
                    return (
                      <li key={i.foto} className="bancada-item">
                        <div className="bancada-foto">
                          <img src={caminho(f)} srcSet={srcset(f)} sizes="84px" width={f.w} height={f.h} alt={f.alt} loading="lazy" decoding="async" />
                        </div>
                        <p className="bancada-nome">{i.nome}</p>
                        <p className="bancada-uso">{i.uso}</p>
                      </li>
                    );
                  })}
              </ul>
            </article>
          ))}
        </div>
        <p className="nota-fina bancada-nota">
          Exemplos genéricos de equipamentos. Imagens ilustrativas de terceiros, não são o inventário da RD.{" "}
          <a href="/creditos">Créditos</a>
        </p>
      </div>
    </section>
  );
}

export { IconeArea };
