// "Quem somos" inside the contact block: the people who answer for the service and their WhatsApp numbers.
import { useState } from "react";
import Icon from "../Icon";
import Dialog from "../Dialog";
import { WHATSAPP_PROJECTS, whatsappLink } from "../contact";
import { CREA_NUMBER, PHONE_DISPLAY } from "../company";
import { EDUCATION } from "../content/home.js";

export function HomeTeam() {
  const [showEducation, setShowEducation] = useState(false);
  return (
    <div className="container contact-people" id="quem-somos">
      <h3 className="contact-people-title">Quem responde pelo seu serviço</h3>
      <p className="contact-text">
        A RD Engenharia é uma empresa familiar de Ibirá. Todo serviço é assinado por profissional habilitado no CREA-SP,
        e você conversa direto com quem vai executar.
      </p>
      <div className="people cascade">
        <article className="reveal">
          <span className="person-initials" aria-hidden="true">
            RA
          </span>
          <h3>Rafael Antonio Dias</h3>
          <p className="person-role">
            Engenheiro civil e ambiental · Especialista em segurança do trabalho · {CREA_NUMBER}
          </p>
          <p className="person-summary">
            {EDUCATION.length} formações, entre bacharelados, pós-graduações e curso técnico.
          </p>
          <div className="person-actions">
            <button type="button" className="btn btn-sec" onClick={() => setShowEducation(true)} aria-haspopup="dialog">
              Ver formação completa
            </button>
            <a
              className="btn btn-sec"
              href={whatsappLink("Olá Rafael! Gostaria de solicitar um orçamento.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="fa-brands fa-whatsapp" /> {PHONE_DISPLAY}
            </a>
          </div>
          <Dialog open={showEducation} onClose={() => setShowEducation(false)} title="Rafael Antonio Dias">
            <p className="person-role">
              Engenheiro civil e ambiental · Especialista em segurança do trabalho · {CREA_NUMBER}
            </p>
            <ul className="person-education">
              {EDUCATION.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="person-extra">Também corretor de imóveis e perito grafotécnico.</p>
          </Dialog>
        </article>
        <article className="reveal">
          <span className="person-initials" aria-hidden="true">
            RF
          </span>
          <h3>Rafael Antonio Dias Filho</h3>
          <p className="person-role">Técnico em edificações · Projetos e atendimento</p>
          <a
            className="btn btn-sec"
            href={whatsappLink("Olá! Gostaria de solicitar um orçamento.", WHATSAPP_PROJECTS)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="fa-brands fa-whatsapp" /> (17) 99659-0330
          </a>
        </article>
      </div>
    </div>
  );
}
