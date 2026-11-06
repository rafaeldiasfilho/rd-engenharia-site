// Wizard page (/o-que-preciso): wraps the Wizard component.

import { AREAS } from "../content/areas";
import { PageClosing } from "../layout/PageClosing";
import Wizard from "../Wizard";
import { GENERAL_LINKS, PageTop, areaLink } from "./pageParts.jsx";

export function QuizPage({ page }) {
  return (
    <>
      <PageTop
        breadcrumb={[{ label: "O que preciso?" }]}
        eyebrow="Passo a passo"
        title={page.h1}
        text="Responda uma pergunta por vez. No fim, você vê o que o seu caso provavelmente exige e fala com a gente pelo WhatsApp."
      />
      <section className="sec quiz" aria-label="Perguntas">
        <div className="container container-reading">
          <Wizard />
        </div>
      </section>
      <PageClosing
        title="Prefere conversar direto?"
        whatsappText="Olá! Tenho uma dúvida sobre o que o meu caso precisa."
        related={[GENERAL_LINKS.guides, GENERAL_LINKS.reminder, areaLink(AREAS[1])]}
      />
    </>
  );
}
