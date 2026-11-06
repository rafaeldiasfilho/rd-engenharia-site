import { FireExtinguisher, HardHat, House, Mountains } from "@phosphor-icons/react";

// Icons for the four areas: Phosphor Icons (MIT), same weight as the site's other icons.
// They are decorative (aria-hidden): the area name always appears as text next to them.
const AREA = {
  "seguranca-do-trabalho": HardHat,
  "corpo-de-bombeiros": FireExtinguisher,
  "engenharia-civil": House,
  "meio-ambiente-topografia": Mountains,
};

export default function AreaIcon({ slug, size = 24, className = "" }) {
  const Component = AREA[slug];
  if (!Component) return null;
  return <Component className={`icon-area ${className}`} size={size} weight="regular" aria-hidden="true" focusable="false" />;
}
