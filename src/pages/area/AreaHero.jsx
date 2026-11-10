// Top of an area page: breadcrumb, photo hero with title, intro and the quote button.
import AreaIcon from "../../AreaIcon";
import HeroBackground from "../../HeroBackground";
import { Breadcrumb } from "../../layout/Breadcrumb";
import { WhatsappButton } from "../../layout/WhatsappButton";
import { OfficeHoursStatus } from "../../OfficeHoursStatus.jsx";

export function AreaHero({ page, areaWhatsappText }) {
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
          <WhatsappButton className="btn-large" text={areaWhatsappText} label="Pedir orçamento pelo WhatsApp" />
          <small>{page.costDrivers ? `${page.costDrivers} ` : ""}Orçamento por escrito e sem compromisso.</small>
        </div>
        <OfficeHoursStatus className="hero-status" />
      </HeroBackground>
    </>
  );
}
