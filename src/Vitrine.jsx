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

// Datas e situações inventadas; o texto de cada item explica o documento e o que acontece perto da data.
const ITENS_PAINEL = [
  { nome: "PGR", estado: "ok", data: "Próxima revisão: 03/2027", texto: "Programa de Gerenciamento de Riscos. Revisado quando o trabalho muda e na data prevista no próprio programa." },
  { nome: "LTCAT", estado: "ok", data: "Atualizar se o ambiente mudar", texto: "Laudo das condições do ambiente de trabalho, base do PPP. Precisa ser refeito quando mudam máquinas, processos ou setores." },
  { nome: "AVCB", estado: "vence", data: "Vence em 28/11/2026", texto: "Auto de Vistoria do Corpo de Bombeiros. Perto do vencimento, a RD avisa pelo WhatsApp e prepara a renovação com antecedência." },
  { nome: "Treinamento NR-35", estado: "ok", data: "Reciclagem: 08/2027", texto: "Trabalho em altura. A reciclagem fica no calendário para nenhum trabalhador ficar com o treinamento vencido." },
  { nome: "Laudo de insalubridade", estado: "pendente", data: "Aguardando a medição", texto: "A avaliação do posto ainda não foi feita. O painel mostra o que falta para a empresa ficar em dia." },
];
const ROTULO = { ok: "Em dia", vence: "Vence em 30 dias", pendente: "Pendente" };
const SIMBOLO = { ok: "✓", vence: "◔", pendente: "○" };

// Cartão no estilo de painel, só para explicar a organização dos documentos. Dados inventados.
export function PainelExemplo() {
  const [aberto, setAberto] = useState("");
  const emDia = ITENS_PAINEL.filter((x) => x.estado === "ok").length;
  const pct = Math.round((emDia / ITENS_PAINEL.length) * 100);
  const atual = ITENS_PAINEL.find((x) => x.nome === aberto);
  return (
    <figure className="painel">
      <span className="selo-exemplo" aria-hidden="true">
        EXEMPLO
      </span>
      <div className="painel-cab">
        <span>Painel de documentos</span>
        <span className="painel-cliente">Empresa Exemplo Ltda.</span>
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
            <button type="button" aria-pressed={aberto === x.nome} onClick={() => setAberto((a) => (a === x.nome ? "" : x.nome))}>
              <span className="painel-doc">
                <span>{x.nome}</span>
                <small>{x.data}</small>
              </span>
              <span className={`chip chip-${x.estado}`}>
                <span aria-hidden="true">{SIMBOLO[x.estado]}</span> {ROTULO[x.estado]}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="painel-explica" aria-live="polite">
        {atual ? (
          <>
            <strong>{atual.nome}.</strong> {atual.texto}
          </>
        ) : (
          "Toque num documento para ver o que ele é e o que acontece perto da data."
        )}
      </p>
      <figcaption>Exemplo ilustrativo, sem dados de clientes: nomes, datas e situações são inventados para mostrar como os vencimentos ficam organizados.</figcaption>
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
