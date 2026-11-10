// Home page. Each block lives in src/home/ (or in its own component); this file only sets the order.
import { Shell } from "./layout/Shell.jsx";
import { SectionNav } from "./layout/SectionNav";
import HomeExamples from "./HomeExamples";
import { DocumentsMarquee } from "./Showcase";
import Reviews from "./Reviews";
import RevealPhrase from "./RevealPhrase";
import { HOME_SECTIONS } from "./content/home.js";
import { HomeHero } from "./home/HomeHero.jsx";
import { HomeAreaCards } from "./home/HomeAreaCards.jsx";
import { HomeDocumentRequest } from "./home/HomeDocumentRequest.jsx";
import { HomeFaq, HomeHowItWorks, HomeOrganize } from "./home/HomeSections.jsx";
import { HomeContact } from "./home/HomeContact.jsx";

export default function App() {
  return (
    <Shell current="">
      <HomeHero />
      <HomeAreaCards />
      <HomeDocumentRequest />
      <RevealPhrase text="Todo serviço é assinado por profissional habilitado no CREA-SP, e você conversa direto com quem vai executar." />
      <DocumentsMarquee />
      <SectionNav items={HOME_SECTIONS} label="Nesta página" />
      <HomeOrganize />
      <HomeExamples />
      <HomeHowItWorks />
      <Reviews />
      <HomeFaq />
      <HomeContact />
    </Shell>
  );
}
