import { useEffect, useRef, useState } from "react";

// Blocos de vitrine da página inicial: faixa de documentos, painel de exemplo e números.
// Nada aqui inventa cliente, depoimento ou dado real: o painel é um exemplo rotulado como ilustrativo.

// Documentos que a RD elabora e que já aparecem nas páginas do site. Sem o PCMSO: ele é do médico do
// trabalho (a RD só integra com o PGR).
const DOCUMENTOS = [
  "PGR", "LTCAT", "PPP", "APR", "AET", "Treinamentos de NR", "Laudo de insalubridade",
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
