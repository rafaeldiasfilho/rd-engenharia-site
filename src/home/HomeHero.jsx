// Home page hero: Google rating badge, title, quote button and the office hours status.
import { useEffect, useState } from "react";
import Icon from "../Icon";
import HeroBackground from "../HeroBackground";
import { whatsappLink } from "../contact";
import { GOOGLE_RATING, GOOGLE_REVIEWS_URL } from "../content/googleAndMaps";
import { isWithinOfficeHours } from "../officeHours.js";

export function HomeHero() {
  // null until mount: the prerendered HTML (Google and first paint) shows only the hours, without "fora do horário"
  const [isOpenNow, setIsOpenNow] = useState(null);

  useEffect(() => {
    setIsOpenNow(isWithinOfficeHours());
    const id = setInterval(() => setIsOpenNow(isWithinOfficeHours()), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <HeroBackground setKey="home" label="As quatro áreas de atuação da RD Engenharia, em fotos ilustrativas" className="hero-home">
      <a className="badge-top" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
        <span className="badge-top-stars" aria-hidden="true">
          ★★★★★
        </span>
        <span>{GOOGLE_RATING}</span>
        <span className="badge-top-arrow" aria-hidden="true">
          →
        </span>
      </a>
      <p className="eyebrow">RD Engenharia · Ibirá/SP</p>
      <h1 className="display">Laudos, projetos e licenças em dia para empresas, obras e imóveis rurais.</h1>
      <p className="hero-triad">
        Documentos em dia. Obra regular. <span className="accent">Equipe protegida.</span>
      </p>
      <p className="lead">
        Engenharia, segurança do trabalho e meio ambiente em Ibirá e região, presencial e online. Você fala direto com o responsável técnico pelo WhatsApp.
      </p>
      <div className="actions">
        <a className="btn btn-whatsapp btn-large" href={whatsappLink("Olá! Gostaria de solicitar um orçamento.")} target="_blank" rel="noopener noreferrer">
          <Icon name="fa-brands fa-whatsapp" /> Pedir orçamento pelo WhatsApp
        </a>
        <a className="link-arrow hero-link" href="/o-que-preciso">
          Não sabe o que precisa? Descubra aqui <span aria-hidden="true">→</span>
        </a>
      </div>
      <p className="hero-risk">Orçamento por escrito e sem compromisso.</p>
      <p className={`status status-bg ${isOpenNow ? "on" : ""}`}>
        <Icon name="fa-solid fa-circle" />{" "}
        {isOpenNow === null
          ? "Atendimento de segunda a sexta, das 7h às 17h"
          : isOpenNow
            ? "Atendendo agora. Seg. a sex., das 7h às 17h"
            : "Fora do horário. Respondemos no próximo dia útil (seg. a sex., das 7h às 17h)"}
      </p>
    </HeroBackground>
  );
}
