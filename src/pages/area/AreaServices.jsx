// "Serviços" section of an area page: the folder of sample sheets, one card per service, the request
// builder and (fire safety only) the AVCB × CLCB comparison.
// Services and documents are together: each card shows the sample sheet of what the client receives.
import Icon from "../../Icon";
import { whatsappLink } from "../../contact";
import { servicesWhatsappMessage } from "../../whatsappMessages";
import { serviceAnchorId } from "../../searchIndex";
import { SAMPLE_CAPTION } from "../../SheetBase";
import { SheetReader } from "../../sheets/SheetReader";
import { SheetSvg } from "../../sheets/SheetSvg";
import { AnimatedFolder } from "../../components/ui/3d-folder";
import RequestBuilder from "../../RequestBuilder";
import { FireLicenseComparisonTable, PageSection, twoDigitNumber } from "../pageParts.jsx";

// Quote button of one service card: the same message as the chips with only this service marked.
const serviceQuoteLink = (page, item) => whatsappLink(servicesWhatsappMessage(page, [item.name]));

export function AreaServices({ page, number }) {
  return (
    <PageSection
      id="o-que-fazemos"
      n={number}
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
              id: serviceAnchorId(item.name),
              title: item.name,
              short: item.name.split(/ — | \(/)[0],
              media: <SheetSvg m={item.example} name={item.name} area={page.slug} />,
              expanded: <SheetReader m={item.example} name={item.name} area={page.slug} />,
              caption: SAMPLE_CAPTION,
              action: { label: "Pedir orçamento pelo WhatsApp", href: serviceQuoteLink(page, item) },
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
          <li className="service-card reveal" key={item.name} id={serviceAnchorId(item.name)}>
            {item.example && (
              <div className="service-sheet" aria-hidden="true">
                <SheetSvg m={item.example} name={item.name} area={page.slug} />
              </div>
            )}
            <div className="service-body">
              <span className="service-n">{twoDigitNumber(n)}</span>
              <h3>{item.name}</h3>
              <p>{item.text}</p>
              <p className="item-who">
                <strong>Para quem:</strong> {item.who}
              </p>
              <a className="btn btn-sec btn-small" href={serviceQuoteLink(page, item)} target="_blank" rel="noopener noreferrer">
                <Icon name="fa-brands fa-whatsapp" /> Pedir orçamento pelo WhatsApp
              </a>
            </div>
          </li>
        ))}
      </ol>
      <p className="fine-print">As folhas são exemplos ilustrativos, não são documentos reais.</p>
      {page.items.length > 1 && <RequestBuilder area={page} items={page.items} />}
      {page.slug === "corpo-de-bombeiros" && <FireLicenseComparisonTable />}
    </PageSection>
  );
}
