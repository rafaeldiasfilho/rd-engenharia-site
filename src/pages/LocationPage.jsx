// Where we work (/onde-atendemos): address, map and city list.

import { AREAS } from "../content/areas";
import { GOOGLE_REVIEWS_URL, DIRECTIONS_URL, MAP_EMBED_URL } from "../content/googleAndMaps";
import { ADDRESS } from "../company";
import { Breadcrumb } from "../layout/Breadcrumb";
import { PageClosing } from "../layout/PageClosing";
import { WhatsappButton } from "../layout/WhatsappButton";
import { GENERAL_LINKS, PageSection, areaLink } from "./pageParts.jsx";

export function LocationPage({ page }) {
  const locationZapText = "Olá! Gostaria de saber se vocês atendem o meu endereço.";
  return (
    <>
      <header className="hero-inner hero-area">
        <div className="container">
          <Breadcrumb items={[{ label: "Onde atendemos" }]} />
          <p className="eyebrow">Onde atendemos</p>
          <h1 className="display-m">{page.h1}</h1>
          <p className="lead">
            Isso vale para todos os serviços. Conte a sua situação pelo WhatsApp e combinamos a melhor forma de atender você.
          </p>
          <div className="actions">
            <WhatsappButton className="btn-large" text={locationZapText} label="Perguntar pelo WhatsApp" />
          </div>
        </div>
      </header>

      {/* This section used to just repeat the page title; now it explains the two service modes. */}
      <PageSection id="atendimento-regiao" n="01" label="Formas de atendimento" title="Como funciona o atendimento.">
        <ul className="modes-grid">
          <li className="modes-card reveal">
            <p className="label-mini">Presencial</p>
            <h3>No local, quando o serviço exige.</h3>
            <p>Visitas, medições, levantamentos e vistorias no imóvel, na empresa ou na propriedade rural.</p>
          </li>
          <li className="modes-card reveal">
            <p className="label-mini">Online</p>
            <h3>O resto, pelo WhatsApp.</h3>
            <p>Conversa, orçamento, envio de fotos e documentos e acompanhamento, sem precisar sair de casa.</p>
          </li>
          <li className="modes-card modes-card-featured reveal">
            <p className="label-mini">Seu endereço</p>
            <h3>Não sabe se está na região?</h3>
            <p>Conte onde fica o imóvel ou a empresa e confirmamos o atendimento.</p>
            <WhatsappButton text={locationZapText} label="Perguntar" />
          </li>
        </ul>
      </PageSection>

      <section className="sec sec-alt" id="mapa" aria-labelledby="map-title">
        <div className="container map-grid">
          <div className="reveal">
            <p className="sec-n">
              <span>02</span> Onde fica
            </p>
            <h2 id="map-title" className="sec-title">
              Nosso endereço.
            </h2>
            <p className="lead">{ADDRESS}</p>
            <p className="map-hours">Segunda a sexta, das 7h às 17h.</p>
            <div className="actions">
              <a className="btn btn-whatsapp btn-large" href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
                Como chegar
              </a>
              <a className="btn btn-sec btn-large" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
                Ver no Google Maps
              </a>
            </div>
          </div>
          <figure className="map reveal">
            <div className="map-box">
              <iframe
                title="Mapa com a localização da RD Engenharia em Ibirá/SP"
                src={MAP_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer"
                allowFullScreen
              />
            </div>
            <figcaption>O mapa é fornecido pelo Google.</figcaption>
          </figure>
        </div>
      </section>

      <PageClosing
        whatsappText={locationZapText}
        related={[areaLink(AREAS[0]), areaLink(AREAS[2]), GENERAL_LINKS.quiz]}
      />
    </>
  );
}
