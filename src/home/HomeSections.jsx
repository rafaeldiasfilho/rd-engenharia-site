// Home page sections between the area cards and the contact block: "O que organizamos" (01),
// "Como funciona" (03) and "Dúvidas" (04). Section 02 ("Na prática") is src/HomeExamples.jsx.
import Icon from "../Icon";
import FaqList from "../Faq";
import StepStack from "../StepStack";
import Tilt3D from "../Tilt3D";
import { ExamplePanel, NumbersLine } from "../Showcase";
import { whatsappLink } from "../contact";
import { generalWhatsappMessage } from "../whatsappMessages";
import { FAQ } from "../faqItems";
import { STEPS } from "../content/home.js";

export function HomeOrganize() {
  return (
    <section className="sec band-section organize" id="organizamos" aria-labelledby="organize-title">
      <div className="container organize-grid">
        <div>
          <header className="sec-head reveal">
            <p className="sec-n">
              <span>01</span> O que organizamos
            </p>
            <h2 id="organize-title" className="sec-title">
              Seus documentos e vencimentos, em um só lugar.
            </h2>
          </header>
          <p className="lead reveal">
            Montamos a lista do que o seu caso exige, elaboramos os documentos e avisamos pelo WhatsApp antes de cada vencimento.
          </p>
          <div className="actions reveal">
            <a className="btn btn-sec btn-large" href="/o-que-preciso">
              Descubra o que o seu caso precisa
            </a>
            <a className="link-arrow" href="/lembrete-de-vencimento">
              Pedir o lembrete de vencimento <span aria-hidden="true">→</span>
            </a>
          </div>
          <NumbersLine />
        </div>
        <div className="reveal">
          <Tilt3D>
            <ExamplePanel />
          </Tilt3D>
        </div>
      </div>
    </section>
  );
}

export function HomeHowItWorks() {
  return (
    <section className="sec band-section" id="como-funciona" aria-labelledby="how-title">
      <div className="container">
        <header className="sec-head reveal">
          <p className="sec-n">
            <span>03</span> Como funciona
          </p>
          <h2 id="how-title" className="sec-title">
            Quatro passos, sem surpresa.
          </h2>
        </header>
        <StepStack
          steps={STEPS}
          firstAction={
            <a className="btn btn-whatsapp btn-small" href={whatsappLink(generalWhatsappMessage())} target="_blank" rel="noopener noreferrer">
              <Icon name="fa-brands fa-whatsapp" /> Começar agora
            </a>
          }
        />
      </div>
    </section>
  );
}

export function HomeFaq() {
  return (
    <section className="sec sec-alt" id="duvidas" aria-labelledby="faq-title">
      <div className="container">
        <header className="sec-head reveal">
          <p className="sec-n">
            <span>04</span> Dúvidas
          </p>
          <h2 id="faq-title" className="sec-title">
            Dúvidas frequentes.
          </h2>
        </header>
        <FaqList items={FAQ} limit={5} />
      </div>
    </section>
  );
}
