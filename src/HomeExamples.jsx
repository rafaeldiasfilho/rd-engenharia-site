import { useState } from "react";
import Carrossel from "./Carousel";
import IconeArea from "./AreaIcon";
import { ComoLerPrancha, Ilustracao } from "./Illustrations";
import { AREAS, slidesProjetos } from "./pagesData";

const ABAS = ["engenharia-civil", "corpo-de-bombeiros", "seguranca-do-trabalho", "meio-ambiente-topografia"].map((slug) => ({
  slug,
  nome: AREAS.find((a) => a.slug === slug).rotulo,
}));

function Civil() {
  return (
    <div className="home-civil">
      <Carrossel
        itens={slidesProjetos(true)}
        rotulo="Desenhos de projetos reais de engenharia civil"
        aspecto="4 / 3"
        className="carousel-projects carousel-3d"
      />
      <p className="fine-print">Projetos reais, com os dados dos clientes retirados e marca d'água. Toque ou clique numa imagem para ampliar.</p>
      <ComoLerPrancha />
      <p className="center">
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
        <header className="sec-head reveal">
          <p className="sec-n">
            <span>02</span> Na prática
          </p>
          <h2 id="pratica-t" className="sec-title">
            Veja o que entregamos.
          </h2>
          <p className="lead">Escolha uma área para ver um exemplo. Os projetos de engenharia civil são reais, com os dados dos clientes retirados.</p>
        </header>
        <div className="tabs reveal" role="group" aria-label="Áreas">
          {ABAS.map((a) => (
            <button key={a.slug} type="button" aria-pressed={aba === a.slug} onClick={() => setAba(a.slug)}>
              <IconeArea slug={a.slug} tamanho={20} /> {a.nome}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {aba === "engenharia-civil" ? <Civil /> : <Ilustracao slug={aba} />}
        </div>
        <p className="center">
          <a className="link-arrow" href={`/${aba}`}>
            Ver todos os serviços desta área <span aria-hidden="true">→</span>
          </a>
        </p>
      </div>
    </section>
  );
}
