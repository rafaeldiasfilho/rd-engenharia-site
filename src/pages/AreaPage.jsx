// Template of the four area pages (/seguranca-do-trabalho, /corpo-de-bombeiros, /engenharia-civil, /meio-ambiente-topografia).

import Icon from "../Icon";
import { AREAS, AREA_OVERVIEW } from "../content/areas";
import { GUIDES } from "../content/guides";
import { EQUIPMENT, EQUIPMENT_NOTE } from "../content/equipment";
import { TECHNICAL_LEAD_PHOTO } from "../content/technicalLead";
import { Breadcrumb } from "../layout/Breadcrumb";
import { SectionNav } from "../layout/SectionNav";
import { PageClosing } from "../layout/PageClosing";
import { WhatsappButton } from "../layout/WhatsappButton";
import { whatsappLink } from "../contact";
import { Illustration } from "../Illustrations";
import Carousel from "../Carousel";
import DocIllustration from "../DocIllustration";
import { SheetReader } from "../sheets/SheetReader";
import { SheetSvg } from "../sheets/SheetSvg";
import { SAMPLE_CAPTION } from "../SheetBase";
import HeroBackground from "../HeroBackground";
import AreaIcon from "../AreaIcon";
import { slidesFor } from "../content/photoCarousels";
import { anchorId } from "../searchIndex";
import Faq from "../Faq";
import RequestBuilder from "../RequestBuilder";
import { AnimatedFolder } from "../components/ui/3d-folder";
import { CREA_NUMBER } from "../company";
import Scene3D from "../Scene3D";
import { Collapsible, Comparison, Examples, Section, areaLink, guideLink, pad } from "./pageParts.jsx";

// 3D block on each area page: label, title and text describe the illustration (not a real job or client).
const AREA_SCENES = {
  "meio-ambiente-topografia": {
    scene: "terreno",
    label: "Do campo à planta",
    title: "O terreno medido vira curvas de nível.",
    text: "No levantamento, cada ponto medido em campo ganha coordenadas e altitude. Com eles desenhamos as curvas de nível, a planta e o memorial que o seu processo pede.",
    alt: "Ilustração em 3D de um terreno com curvas de nível e pontos levantados",
  },
  "engenharia-civil": {
    scene: "casa",
    label: "Do projeto à obra",
    title: "Cada etapa resolvida antes de começar.",
    text: "No projeto, a casa é pensada etapa por etapa: fundação, paredes, aberturas e telhado. Assim a obra começa com as dúvidas respondidas no papel.",
    alt: "Ilustração em 3D de uma casa térrea sendo construída por etapas: contrapiso, paredes, janelas e porta, telhado",
  },
  "corpo-de-bombeiros": {
    scene: "rota",
    label: "Rota de fuga",
    title: "De qualquer sala até a saída.",
    text: "No projeto de prevenção, cada ambiente tem rota de fuga, sinalização, iluminação de emergência e extintores no lugar certo. É isso que o Corpo de Bombeiros confere na vistoria.",
    alt: "Ilustração em 3D da planta de um pavimento com as rotas de fuga se acendendo até a saída e os extintores marcados",
  },
  "seguranca-do-trabalho": {
    scene: "capacete",
    label: "Proteção no trabalho",
    title: "A proteção certa para cada risco.",
    text: "No PGR levantamos os riscos de cada função e indicamos as medidas: primeiro as proteções coletivas, depois os EPIs que ainda forem necessários.",
    alt: "Ilustração em 3D de um capacete de segurança girando, cercado por anéis de proteção",
  },
};

export function AreaPage({ page }) {
  const visual = AREA_OVERVIEW[page.slug];
  const guides = GUIDES.filter((g) => g.area === page.slug);
  const otherAreas = AREAS.filter((a) => a.slug !== page.slug);
  const related = [...guides.slice(0, 2).map(guideLink), ...otherAreas.map(areaLink)].slice(0, 3);
  const areaZapText = `Olá! Gostaria de um orçamento na área de ${page.name}.`;
  const isCivil = page.slug === "engenharia-civil";
  const equipment = EQUIPMENT[page.slug];
  const hasEquipmentPhotos = slidesFor(`equip-${page.slug}`).length > 0;
  // Section numbering in the order they appear (01, 02, ...), with no fixed numbers.
  let sectionCount = 0;
  const nextNumber = () => pad(sectionCount++);

  return (
    <>
      <div className="container breadcrumb-over-hero">
        <Breadcrumb items={[{ label: "Serviços", href: "/#servicos" }, { label: page.name }]} />
      </div>
      <HeroBackground setKey={`area-${page.slug}`} label={`Fotos ilustrativas da área de ${page.name}`} className="hero-area-bg">
        <p className="eyebrow eyebrow-icon">
          <AreaIcon slug={page.slug} size={22} /> Serviço
        </p>
        <h1 className="display">{page.h1}</h1>
        <p className="lead">{page.intro}</p>
        <div className="actions">
          <WhatsappButton className="btn-large" text={areaZapText} label="Pedir orçamento pelo WhatsApp" />
          <small>Orçamento por escrito e sem compromisso. Prazo e valor são informados depois de conhecermos o seu caso.</small>
        </div>
      </HeroBackground>

      <SectionNav
        items={[
          { id: "situacoes", label: "Situações comuns" },
          { id: "o-que-fazemos", label: "Serviços" },
          { id: "equipamentos", label: "Equipamentos" },
          { id: "na-pratica", label: "Na prática" },
          { id: "atendimento", label: "Atendimento" },
          { id: "duvidas", label: "Dúvidas" },
          { id: "proximo-passo", label: "Próximo passo" },
        ]}
      />

      {visual && (
        <section className="summary-editorial" aria-label="Resumo">
          <div className="container summary-editorial-grid">
            <div className="reveal">
              <p className="label-mini">Para quem</p>
              <p>{visual.who}</p>
            </div>
            <div className="reveal">
              <p className="label-mini">Você recebe</p>
              <p>{visual.deliverable}</p>
            </div>
            <div className="signer reveal">
              <p className="label-mini">Quem assina</p>
              <div className="signer-line">
                {TECHNICAL_LEAD_PHOTO ? (
                  <img src={TECHNICAL_LEAD_PHOTO} width="56" height="56" alt="Rafael Antonio Dias" />
                ) : (
                  <span className="signer-initials" aria-hidden="true">
                    RD
                  </span>
                )}
                <p>
                  <strong>Rafael Antonio Dias</strong>
                  <span>Engenheiro civil e ambiental · {CREA_NUMBER}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {AREA_SCENES[page.slug] && (
        <section className="band-scene" aria-labelledby="cena-t">
          <div className="container band-scene-grid">
            <div className="band-scene-text reveal">
              <p className="label-mini">{AREA_SCENES[page.slug].label}</p>
              <h2 id="cena-t" className="sec-title">
                {AREA_SCENES[page.slug].title}
              </h2>
              <p>{AREA_SCENES[page.slug].text}</p>
              <p className="fine-print">
                Ilustração em 3D. Arraste com o mouse ou o dedo para girar.
              </p>
            </div>
            <Scene3D scene={AREA_SCENES[page.slug].scene} className="band-scene-3d" label={AREA_SCENES[page.slug].alt} />
          </div>
        </section>
      )}

      {page.situations && (
        <Section id="situacoes" n={nextNumber()} label="Situações comuns" title="Você se reconhece em alguma destas?">
          <ul className="situations-list">
            {page.situations.map((t) => (
              <li key={t} className="reveal">
                <AreaIcon slug={page.slug} size={26} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="situations-help reveal">
            Não tem certeza de qual é o seu caso? <a href="/o-que-preciso">Responda ao passo a passo</a> ou{" "}
            <a href={whatsappLink(areaZapText)} target="_blank" rel="noopener noreferrer">
              conte pelo WhatsApp
            </a>
            .
          </p>
        </Section>
      )}

      {/* Services and documents together: each card shows the sample sheet of what the client receives.
          These used to be two sections that repeated the same list of services. */}
      <Section
        id="o-que-fazemos"
        n={nextNumber()}
        label="Serviços"
        title={<>O que fazemos nesta área.</>}
        lead="Cada cartão mostra uma folha de exemplo do documento que você recebe."
      >
        {/* Folder with the sample sheets at reading size (on the card they are small). */}
        <div className="folder-band reveal">
          <AnimatedFolder
            title="Documentos de exemplo"
            countLabel={(n) => `${n} folhas desta área`}
            items={page.items
              .filter((item) => item.example)
              .map((item) => ({
                id: anchorId(item.name),
                title: item.name,
                short: item.name.split(/ — | \(/)[0],
                media: <SheetSvg m={item.example} name={item.name} area={page.slug} />,
                expanded: <SheetReader m={item.example} name={item.name} area={page.slug} />,
                caption: SAMPLE_CAPTION,
                action: { label: "Pedir orçamento pelo WhatsApp", href: whatsappLink(`Olá! Gostaria de um orçamento para: ${item.name}.`) },
              }))}
          />
          <div className="folder-band-text">
            <h3>Veja cada documento em tamanho de leitura.</h3>
            <p>
              Abra a pasta e escolha uma folha. Dá para ampliar, ver uma página interna e, em “Como ler”, entender cada
              parte do documento. Depois, peça o orçamento daquele documento direto pelo WhatsApp.
            </p>
            <p className="fine-print">{SAMPLE_CAPTION} Não há dados de clientes.</p>
          </div>
        </div>
        <ol className="services-grid">
          {page.items.map((item, n) => (
            <li className="service-card reveal" key={item.name} id={anchorId(item.name)}>
              {item.example && (
                <div className="service-sheet" aria-hidden="true">
                  <SheetSvg m={item.example} name={item.name} area={page.slug} />
                </div>
              )}
              <div className="service-body">
                <span className="service-n">{pad(n)}</span>
                <h3>{item.name}</h3>
                <p>{item.text}</p>
                <p className="item-who">
                  <strong>Para quem:</strong> {item.who}
                </p>
                <a
                  className="btn btn-sec btn-small"
                  href={whatsappLink(`Olá! Gostaria de um orçamento para: ${item.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="fa-brands fa-whatsapp" /> Pedir orçamento pelo WhatsApp
                </a>
              </div>
            </li>
          ))}
        </ol>
        <p className="fine-print">As folhas são exemplos ilustrativos, não são documentos reais.</p>
        {page.items.length > 1 && <RequestBuilder area={page.name} items={page.items} />}
        {page.slug === "corpo-de-bombeiros" && <Comparison />}
      </Section>

      {equipment && (
        <Section id="equipamentos" n={nextNumber()} label="Equipamentos" title="Equipamentos que podem ser usados." className="sec-alt">
          <Collapsible label="Ver os equipamentos">
          <div className="equipment">
            <p className="lead equipment-lead reveal">{equipment.text}</p>
            {hasEquipmentPhotos && (
              <div className="reveal">
                <Carousel
                  setKey={`equip-${page.slug}`}
                  label={`Equipamentos de referência usados em serviços de ${page.name}`}
                  aspect="4 / 3"
                  className="carousel-shelf"
                  auto={false}
                  sizes="(min-width: 900px) 340px, 78vw"
                />
              </div>
            )}
            <ul className="equipment-list reveal">
              {equipment.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <p className="fine-print equipment-note">{EQUIPMENT_NOTE}</p>
          </Collapsible>
        </Section>
      )}

      <Section
        id="na-pratica"
        n={nextNumber()}
        label="Na prática"
        title={isCivil ? "Projetos reais, com os dados dos clientes retirados." : "Veja como isso aparece no papel."}
        lead={isCivil ? undefined : "Exemplos ilustrativos para você entender o que entregamos."}
      >
        <Collapsible label={isCivil ? "Ver os projetos" : "Ver os exemplos"}>{isCivil ? <Examples /> : <Illustration slug={page.slug} />}</Collapsible>
      </Section>

      <Section id="atendimento" n={nextNumber()} label="Atendimento" title="Do primeiro contato à entrega." lead="Veja o caminho e o que ter em mãos para agilizar o orçamento." className="sec-alt">
        {visual && (
          <ol className="steps-editorial timeline reveal">
            {visual.steps.map((e, n) => (
              <li key={e.t} className="reveal">
                <span className="step-big" aria-hidden="true">
                  {n + 1}
                </span>
                <h3>{e.t}</h3>
                <p>{e.d}</p>
                {n === 0 && (
                  <a className="btn btn-whatsapp btn-small" href={whatsappLink(areaZapText)} target="_blank" rel="noopener noreferrer">
                    <Icon name="fa-brands fa-whatsapp" /> Começar agora
                  </a>
                )}
              </li>
            ))}
          </ol>
        )}
        <div className="split reveal">
          <div className="split-grid">
            <div className="split-text">
              <h3>Para agilizar, separe</h3>
              <ul className="list-docs">
                {page.documents.map((d) => (
                  <li key={d}>
                    <Icon name="fa-solid fa-circle-check" /> {d}
                  </li>
                ))}
              </ul>
              <p className="notice-reminder">
                <Icon name="fa-solid fa-bell" /> Pode pedir também o nosso lembrete de vencimento, para não perder o prazo
                de renovação dos documentos. <a href="/lembrete-de-vencimento">Pedir o lembrete</a>.
              </p>
              <a
                className="btn btn-sec no-print"
                href={`/imprimir/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir a lista para imprimir ou salvar em PDF
              </a>
            </div>
            <DocIllustration slug={page.slug} />
          </div>
        </div>
      </Section>

      <Section id="duvidas" n={nextNumber()} label="Dúvidas" title="Perguntas frequentes.">
        <Faq items={page.faq} />
      </Section>

      <PageClosing whatsappText={areaZapText} related={related} />
    </>
  );
}
