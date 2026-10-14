import { useState } from "react";
import { Ilustracao } from "./Ilustracoes";
import { PROJETOS } from "./paginas";

const ABAS = [
  { slug: "engenharia-civil", nome: "Engenharia civil" },
  { slug: "corpo-de-bombeiros", nome: "Bombeiros" },
  { slug: "seguranca-do-trabalho", nome: "Segurança do trabalho" },
  { slug: "meio-ambiente-topografia", nome: "Topografia" },
];

function Civil() {
  const projeto = PROJETOS[0];
  const mostrar = projeto.itens.filter((i) => ["planta-baixa", "fachada"].includes(i.arq));
  return (
    <div className="home-civil">
      <div className="home-civil-imgs">
        {mostrar.map((e) => (
          <a key={e.arq} href={`/exemplos/${projeto.pasta}/${e.arq}.webp`} target="_blank" rel="noopener noreferrer">
            <img src={`/exemplos/${projeto.pasta}/${e.arq}.webp`} width={e.w} height={e.h} loading="lazy" alt={e.alt} />
          </a>
        ))}
      </div>
      <p className="home-civil-txt">
        <strong>{projeto.nome}</strong>. {projeto.resumo}. Projeto real, com os dados do cliente retirados.
      </p>
      <p className="centro">
        <a className="btn btn-sec" href="/engenharia-civil#exemplos">
          Ver o projeto completo
        </a>
      </p>
    </div>
  );
}

export default function ExemplosHome() {
  const [aba, setAba] = useState(ABAS[0].slug);
  return (
    <section className="bloco" id="na-pratica">
      <div className="wrap">
        <h2 className="titulo-bloco">Veja na prática</h2>
        <p className="na-pratica-sub">Escolha uma área para ver um exemplo do que entregamos.</p>
        <div className="abas" role="group" aria-label="Áreas">
          {ABAS.map((a) => (
            <button key={a.slug} type="button" aria-pressed={aba === a.slug} onClick={() => setAba(a.slug)}>
              {a.nome}
            </button>
          ))}
        </div>
        <div className="aba-conteudo">{aba === "engenharia-civil" ? <Civil /> : <Ilustracao slug={aba} />}</div>
        <p className="centro">
          <a className="mais-link" href={`/${aba}`}>
            Ver todos os serviços desta área
          </a>
        </p>
      </div>
    </section>
  );
}
