import { useState } from "react";
import Carrossel from "./Carrossel";
import IconeArea from "./Icones";
import { Ilustracao } from "./Ilustracoes";
import { slidesProjetos } from "./paginas";

const ABAS = [
  { slug: "engenharia-civil", nome: "Engenharia civil" },
  { slug: "corpo-de-bombeiros", nome: "Bombeiros" },
  { slug: "seguranca-do-trabalho", nome: "Segurança do trabalho" },
  { slug: "meio-ambiente-topografia", nome: "Topografia" },
];

function Civil() {
  return (
    <div className="home-civil">
      <Carrossel
        itens={slidesProjetos(true)}
        rotulo="Desenhos de projetos reais de engenharia civil"
        aspecto="4 / 3"
        className="car-projetos"
      />
      <p className="nota-fina">Projetos reais, com os dados dos clientes retirados e marca d'água. Toque ou clique numa imagem para ampliar.</p>
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
            <span>02</span> Na prática
          </p>
          <h2 id="pratica-t" className="sec-titulo">
            Veja o que entregamos.
          </h2>
          <p className="lead">Escolha uma área para ver um exemplo. Os projetos de engenharia civil são reais, com os dados dos clientes retirados.</p>
        </header>
        <div className="abas rev" role="group" aria-label="Áreas">
          {ABAS.map((a) => (
            <button key={a.slug} type="button" aria-pressed={aba === a.slug} onClick={() => setAba(a.slug)}>
              <IconeArea slug={a.slug} tamanho={20} /> {a.nome}
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
