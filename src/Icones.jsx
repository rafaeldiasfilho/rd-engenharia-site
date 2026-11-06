import { FireExtinguisher, HardHat, House, Mountains } from "@phosphor-icons/react";

// Ícones das quatro áreas: Phosphor Icons (MIT), mesmo peso dos outros ícones do site.
// São decorativos (aria-hidden): o nome da área sempre aparece em texto ao lado.
const AREA = {
  "seguranca-do-trabalho": HardHat,
  "corpo-de-bombeiros": FireExtinguisher,
  "engenharia-civil": House,
  "meio-ambiente-topografia": Mountains,
};

export default function IconeArea({ slug, tamanho = 24, className = "" }) {
  const Componente = AREA[slug];
  if (!Componente) return null;
  return <Componente className={`icon-area ${className}`} size={tamanho} weight="regular" aria-hidden="true" focusable="false" />;
}
