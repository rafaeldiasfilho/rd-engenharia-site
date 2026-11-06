import { useState } from "react";
import Carousel from "./Carousel";
import AreaIcon from "./AreaIcon";
import { Illustration } from "./Illustrations";
import { HowToReadSheet } from "./illustrations/HowToReadSheet";
import { AREAS } from "./content/areas";
import { projectSlides } from "./content/projects";

const TABS = ["engenharia-civil", "corpo-de-bombeiros", "seguranca-do-trabalho", "meio-ambiente-topografia"].map((slug) => ({
  slug,
  name: AREAS.find((a) => a.slug === slug).label,
}));

function Civil() {
  return (
    <div className="home-civil">
      <Carousel
        items={projectSlides(true)}
        label="Desenhos de projetos reais de engenharia civil"
        aspect="4 / 3"
        className="carousel-projects carousel-3d"
      />
      <p className="fine-print">Projetos reais, com os dados dos clientes retirados e marca d'água. Toque ou clique numa imagem para ampliar.</p>
      <HowToReadSheet />
      <p className="center">
        <a className="btn btn-sec" href="/engenharia-civil#na-pratica">
          Ver o projeto completo
        </a>
      </p>
    </div>
  );
}

export default function HomeExamples() {
  const [activeTab, setActiveTab] = useState(TABS[0].slug);
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
          {TABS.map((a) => (
            <button key={a.slug} type="button" aria-pressed={activeTab === a.slug} onClick={() => setActiveTab(a.slug)}>
              <AreaIcon slug={a.slug} size={20} /> {a.name}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {activeTab === "engenharia-civil" ? <Civil /> : <Illustration slug={activeTab} />}
        </div>
        <p className="center">
          <a className="link-arrow" href={`/${activeTab}`}>
            Ver todos os serviços desta área <span aria-hidden="true">→</span>
          </a>
        </p>
      </div>
    </section>
  );
}
