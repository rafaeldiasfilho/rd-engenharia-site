// Template of the four area pages (/seguranca-do-trabalho, /corpo-de-bombeiros, /engenharia-civil, /meio-ambiente-topografia).
// Each section lives in src/pages/area/; this file only decides which sections appear and numbers them in order.
import { AREAS, AREA_OVERVIEW } from "../content/areas";
import { AREA_SCENES } from "../content/areaScenes";
import { GUIDES } from "../content/guides";
import { EQUIPMENT } from "../content/equipment";
import { SectionNav } from "../layout/SectionNav";
import { PageClosing } from "../layout/PageClosing";
import { Illustration } from "../Illustrations";
import Faq from "../Faq";
import { AreaHero } from "./area/AreaHero.jsx";
import { AreaSummary } from "./area/AreaSummary.jsx";
import { AreaScene } from "./area/AreaScene.jsx";
import { AreaSituations } from "./area/AreaSituations.jsx";
import { AreaServices } from "./area/AreaServices.jsx";
import { AreaEquipment } from "./area/AreaEquipment.jsx";
import { AreaProcess } from "./area/AreaProcess.jsx";
import { CollapsibleSection, ProjectExamples, PageSection, areaLink, guideLink, twoDigitNumber } from "./pageParts.jsx";

const AREA_SECTION_LINKS = [
  { id: "situacoes", label: "Situações comuns" },
  { id: "o-que-fazemos", label: "Serviços" },
  { id: "equipamentos", label: "Equipamentos" },
  { id: "na-pratica", label: "Na prática" },
  { id: "atendimento", label: "Atendimento" },
  { id: "duvidas", label: "Dúvidas" },
  { id: "proximo-passo", label: "Próximo passo" },
];

export function AreaPage({ page }) {
  const overview = AREA_OVERVIEW[page.slug];
  const guides = GUIDES.filter((g) => g.area === page.slug);
  const otherAreas = AREAS.filter((a) => a.slug !== page.slug);
  const related = [...guides.slice(0, 2).map(guideLink), ...otherAreas.map(areaLink)].slice(0, 3);
  const areaWhatsappText = `Olá! Gostaria de um orçamento na área de ${page.name}.`;
  const isCivil = page.slug === "engenharia-civil";
  const equipment = EQUIPMENT[page.slug];
  // Section numbering in the order they appear (01, 02, ...), with no fixed numbers.
  let sectionCount = 0;
  const nextNumber = () => twoDigitNumber(sectionCount++);

  return (
    <>
      <AreaHero page={page} areaWhatsappText={areaWhatsappText} />
      <SectionNav items={AREA_SECTION_LINKS} />
      {overview && <AreaSummary overview={overview} />}
      {AREA_SCENES[page.slug] && <AreaScene areaScene={AREA_SCENES[page.slug]} />}
      {page.situations && <AreaSituations page={page} number={nextNumber()} areaWhatsappText={areaWhatsappText} />}
      <AreaServices page={page} number={nextNumber()} />
      {equipment && <AreaEquipment page={page} equipment={equipment} number={nextNumber()} />}

      <PageSection
        id="na-pratica"
        n={nextNumber()}
        label="Na prática"
        title={isCivil ? "Projetos reais, com os dados dos clientes retirados." : "Veja como isso aparece no papel."}
        lead={isCivil ? undefined : "Exemplos ilustrativos para você entender o que entregamos."}
      >
        <CollapsibleSection label={isCivil ? "Ver os projetos" : "Ver os exemplos"}>{isCivil ? <ProjectExamples /> : <Illustration slug={page.slug} />}</CollapsibleSection>
      </PageSection>

      <AreaProcess page={page} overview={overview} number={nextNumber()} areaWhatsappText={areaWhatsappText} />

      <PageSection id="duvidas" n={nextNumber()} label="Dúvidas" title="Perguntas frequentes.">
        <Faq items={page.faq} />
      </PageSection>

      <PageClosing whatsappText={areaWhatsappText} related={related} />
    </>
  );
}
