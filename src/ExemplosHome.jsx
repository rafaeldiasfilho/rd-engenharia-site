import { useState } from "react";
import Icone from "./Icone";
import { useDeslizar } from "./Deslizar";
import { Ilustracao } from "./Ilustracoes";
import { PROJETOS } from "./paginas";

const ABAS = [
  { slug: "engenharia-civil", nome: "Engenharia civil" },
  { slug: "corpo-de-bombeiros", nome: "Bombeiros" },
  { slug: "seguranca-do-trabalho", nome: "Segurança do trabalho" },
  { slug: "meio-ambiente-topografia", nome: "Topografia" },
];

function Civil() {
  const total = PROJETOS.length;
  const d = useDeslizar(total);
  const projeto = PROJETOS[d.i];
  const mostrar = projeto.itens.filter((i) => ["planta-baixa", "fachada"].includes(i.arq));
  return (
    <div className="home-civil" {...d.pausarAoPassar} aria-roledescription="carrossel" aria-label="Projetos de engenharia civil">
      <div
        className={`home-civil-bloco ${d.trocou ? "troca" : ""} ${total > 1 ? "arrastavel" : ""}`}
        data-dir={d.dir}
        key={projeto.pasta}
        ref={d.bloco}
        {...d.gesto}
      >
        <div className="home-civil-imgs">
          {mostrar.map((e) => (
            <a
              key={e.arq}
              href={`/exemplos/${projeto.pasta}/${e.arq}.webp`}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
            >
              <img
                src={`/exemplos/${projeto.pasta}/${e.arq}.webp`}
                width={e.w}
                height={e.h}
                loading="lazy"
                alt={e.alt}
                draggable={false}
              />
            </a>
          ))}
        </div>
        <p className="home-civil-txt" aria-live="polite">
          <strong>{projeto.nome}</strong>. {projeto.resumo}. Projeto real, com os dados do cliente retirados.
        </p>
      </div>
      {total > 1 && (
        <div className="home-civil-nav">
          <button type="button" className="seta seta-p" onClick={() => d.manual(-1)} aria-label="Projeto anterior">
            <Icone nome="fa-solid fa-chevron-left" />
          </button>
          <span className="pontos" aria-hidden="true">
            {PROJETOS.map((p, n) => (
              <i key={p.pasta} className={n === d.i ? "ativo" : ""} />
            ))}
          </span>
          <button type="button" className="seta seta-p" onClick={() => d.manual(1)} aria-label="Próximo projeto">
            <Icone nome="fa-solid fa-chevron-right" />
          </button>
        </div>
      )}
      <p className="centro">
        <a className="btn btn-sec" href="/engenharia-civil#na-pratica">
          Ver o projeto completo
        </a>
      </p>
    </div>
  );
}

export default function ExemplosHome() {
  const [aba, setAba] = useState(ABAS[0].slug);
  return (
    <section className="sec sec-alt" id="na-pratica" aria-labelledby="pratica-t">
      <div className="container">
        <header className="sec-cab rev">
          <p className="sec-n">
            <span>01</span> Na prática
          </p>
          <h2 id="pratica-t" className="sec-titulo">
            Veja o que entregamos.
          </h2>
          <p className="lead">Escolha uma área para ver um exemplo. Os projetos de engenharia civil são reais, com os dados dos clientes retirados.</p>
        </header>
        <div className="abas rev" role="group" aria-label="Áreas">
          {ABAS.map((a) => (
            <button key={a.slug} type="button" aria-pressed={aba === a.slug} onClick={() => setAba(a.slug)}>
              {a.nome}
            </button>
          ))}
        </div>
        <div className="aba-conteudo">
          {aba === "engenharia-civil" ? <Civil /> : <Ilustracao slug={aba} />}
        </div>
        <p className="centro">
          <a className="link-seta" href={`/${aba}`}>
            Ver todos os serviços desta área <span aria-hidden="true">→</span>
          </a>
        </p>
      </div>
    </section>
  );
}
