// "Equipamentos" section of an area page: general reference list (not RD's inventory) and photos.
import Carousel from "../../Carousel";
import { EQUIPMENT_NOTE } from "../../content/equipment";
import { slidesFor } from "../../content/photoCarousels";
import { CollapsibleSection, PageSection } from "../pageParts.jsx";

export function AreaEquipment({ page, equipment, number }) {
  const hasEquipmentPhotos = slidesFor(`equip-${page.slug}`).length > 0;
  return (
    <PageSection id="equipamentos" n={number} label="Equipamentos" title="Equipamentos que podem ser usados." className="sec-alt">
      <CollapsibleSection label="Ver os equipamentos">
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
      </CollapsibleSection>
    </PageSection>
  );
}
