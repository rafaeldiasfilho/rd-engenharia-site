import { Shell } from "../layout/Shell.jsx";
import { whatsappLink } from "../contact";
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

export function NotFound() {
  return (
    <Shell current="404">
      <section className="not-found">
        <div className="container">
          <p className="eyebrow">Erro 404</p>
          <h1 className="display-m">Página não encontrada.</h1>
          <p className="lead">O endereço pode ter mudado ou estar digitado errado. Veja por onde seguir:</p>
          <div className="actions">
            <a className="btn btn-whatsapp btn-large" href="/">
              Ir para o início
            </a>
            <a className="btn btn-sec btn-large" href="/guias">
              Ver os guias
            </a>
            <a
              className="btn btn-sec btn-large"
              href={whatsappLink("Olá! Não encontrei o que procurava no site.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Shell>
  );
}
