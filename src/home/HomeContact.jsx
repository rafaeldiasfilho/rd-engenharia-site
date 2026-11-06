// Contact block of the home page (05): address with the on-demand map, hours, region, Instagram, the WhatsApp
// QR code, the quote form and the team. Contact and "onde atendemos" share this single block: address, hours
// and region appear here once (the top badge and the footer are the other fixed places).
import { useState } from "react";
import WhatsappQr from "../WhatsappQr";
import { TopoField } from "../components/ui/contour-field";
import { ADDRESS } from "../company";
import { DIRECTIONS_URL, MAP_EMBED_URL } from "../content/googleAndMaps";
import { HomeTeam } from "./HomeTeam.jsx";
import { QuoteRequestForm } from "./QuoteRequestForm.jsx";

export function HomeContact() {
  const [showMap, setShowMap] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  return (
    <section className="contact-block sec-top" id="contato" aria-labelledby="contact-title">
      <TopoField className="sec-top-field contact-top" grid={0} lines={0.4} />
      <div className="container contact-grid">
        <div>
          <p className="sec-n">
            <span>05</span> Contato
          </p>
          <h2 id="contact-title" className="sec-title">
            Peça seu orçamento.
          </h2>
          <p className="contact-text">
            Preencha e continue no WhatsApp. A mensagem já vai pronta, sem compromisso.
          </p>
          <dl className="contact-data">
            <div>
              <dt>Escritório</dt>
              <dd>
                {ADDRESS}
                <span className="contact-links">
                  <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
                    Como chegar
                  </a>
                  <button
                    type="button"
                    className="contact-map-button"
                    aria-expanded={showMap}
                    aria-controls={showMap ? "contact-map" : undefined}
                    onClick={() => {
                      setShowMap((v) => !v);
                      setMapReady(false);
                    }}
                  >
                    {showMap ? "Fechar o mapa" : "Ver o mapa aqui"}
                  </button>
                </span>
                {showMap && (
                  <figure id="contact-map" className="where-map">
                    <div className="map-box">
                      {!mapReady && <p className="where-map-loading">Carregando o mapa…</p>}
                      <iframe
                        title="Mapa com a localização da RD Engenharia em Ibirá/SP"
                        src={MAP_EMBED_URL}
                        referrerPolicy="no-referrer"
                        allowFullScreen
                        onLoad={() => setMapReady(true)}
                        className={mapReady ? "ready" : ""}
                      />
                    </div>
                    <figcaption>O mapa é fornecido pelo Google.</figcaption>
                  </figure>
                )}
              </dd>
            </div>
            <div>
              <dt>Atendimento</dt>
              <dd>Segunda a sexta, das 7h às 17h</dd>
            </div>
            <div>
              <dt>Região</dt>
              <dd>
                Ibirá e região, presencial e online.
                <a href="/onde-atendemos">Ver onde atendemos</a>
              </dd>
            </div>
            <div>
              <dt>Instagram</dt>
              <dd>
                <a href="https://www.instagram.com/rd_engenhariaibira/" target="_blank" rel="noopener noreferrer">
                  @rd_engenhariaibira
                </a>
              </dd>
            </div>
          </dl>
          <WhatsappQr />
        </div>

        <QuoteRequestForm />
      </div>
      <HomeTeam />
    </section>
  );
}
