// Home page block right under the hero: document search, the four area cards and the proof badges.
import AreaIcon from "../AreaIcon";
import DocumentSearch from "../Search";
import { NEEDS } from "../content/home.js";
import { PHOTOS } from "../content/photoList";
import { photoPath, srcset } from "../photos";

export function HomeAreaCards() {
  return (
    <div className="choices-cards-wrap" id="servicos">
      <div className="container">
        <h2 className="sr-only">Do que você precisa?</h2>
        <DocumentSearch className="search-home" />
        <ol className="choices-cards">
          {NEEDS.map((n, i) => {
            const f = PHOTOS[n.photo];
            return (
              <li key={n.slug}>
                <a href={`/${n.slug}`} className="card-area">
                  <span className="card-area-photo">
                    <img src={photoPath(f)} srcSet={srcset(f)} sizes={i === 0 || i === 3 ? "(min-width: 1100px) 800px, (min-width: 700px) 50vw, 100vw" : "(min-width: 1100px) 400px, (min-width: 700px) 50vw, 100vw"} width={f.w} height={f.h} alt="" loading="lazy" decoding="async" />
                  </span>
                  <span className="icon-tile card-area-icon">
                    <AreaIcon slug={n.slug} size={30} />
                  </span>
                  <span className="card-area-n" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <strong>{n.title}</strong>
                  <small>{n.phrase}</small>
                  <span className="card-area-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
        <p className="fine-print choices-note">
          Fotos ilustrativas de terceiros, não são trabalhos da RD. <a href="/creditos">Créditos</a>
        </p>
        <ul className="proof">
          <li>
            <strong>CREA-SP</strong>
            <span>Todo serviço é assinado por profissional habilitado</span>
          </li>
          <li>
            <strong>ART</strong>
            <span>Anotação de Responsabilidade Técnica nos trabalhos que a exigem</span>
          </li>
          <li>
            <strong>WhatsApp</strong>
            <span>Você conversa direto com quem vai executar</span>
          </li>
          <li>
            <strong>Presencial e online</strong>
            <span>Em Ibirá e região, com conversa e orçamento pelo WhatsApp</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
