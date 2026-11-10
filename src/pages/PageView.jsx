import { useEffect, useState } from "react";
import { Shell } from "../layout/Shell.jsx";
import { whatsappLink } from "../contact";
import Icon from "../Icon";
import AreaIcon from "../AreaIcon";
import { AREAS } from "../content/areas";
import { notFoundWhatsappMessage } from "../whatsappMessages";
import { AreaPage } from "./AreaPage.jsx";
import { LocationPage } from "./LocationPage.jsx";
import { GuidePage } from "./GuidePage.jsx";
import { QuizPage } from "./QuizPage.jsx";
import { GuidesPage } from "./GuidesPage.jsx";
import { ReminderPage } from "./ReminderPage.jsx";
import { CreditsPage } from "./CreditsPage.jsx";
import { TermsPage } from "./TermsPage.jsx";
import { PrivacyPage } from "./PrivacyPage.jsx";

export default function PageView({ page }) {
  let body = null;
  if (page.type === "area") body = <AreaPage page={page} />;
  else if (page.type === "location") body = <LocationPage page={page} />;
  else if (page.type === "guide") body = <GuidePage page={page} />;
  else if (page.type === "quiz") body = <QuizPage page={page} />;
  else if (page.type === "guide-index") body = <GuidesPage page={page} />;
  else if (page.type === "reminder") body = <ReminderPage page={page} />;
  else if (page.type === "credits") body = <CreditsPage />;
  else if (page.type === "terms") body = <TermsPage />;
  else body = <PrivacyPage />;
  return <Shell current={page.slug}>{body}</Shell>;
}

// The broken address goes into the WhatsApp message, read after hydration so the prerendered HTML matches.
export function NotFound() {
  const [brokenPath, setBrokenPath] = useState("");
  useEffect(() => setBrokenPath(window.location.pathname), []);
  return (
    <Shell current="404">
      <section className="not-found">
        <div className="container">
          <p className="eyebrow">Erro 404</p>
          <h1 className="display-m">Página não encontrada.</h1>
          <p className="lead">O endereço pode ter mudado ou estar digitado errado. Veja por onde seguir:</p>
          <div className="actions">
            <a
              className="btn btn-whatsapp btn-large"
              href={whatsappLink(notFoundWhatsappMessage(brokenPath))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="fa-brands fa-whatsapp" /> Falar no WhatsApp
            </a>
            <a className="btn btn-sec btn-large" href="/">
              Ir para o início
            </a>
          </div>
          <p className="not-found-areas-title">Ou escolha a área:</p>
          <ul className="not-found-areas">
            {AREAS.map((area) => (
              <li key={area.slug}>
                <a href={`/${area.slug}`}>
                  <AreaIcon slug={area.slug} size={22} /> {area.name}
                </a>
              </li>
            ))}
            <li>
              <a href="/guias">Guias</a>
            </li>
            <li>
              <a href="/o-que-preciso">Não sei o que preciso</a>
            </li>
          </ul>
        </div>
      </section>
    </Shell>
  );
}
