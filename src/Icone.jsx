import {
  Bell,
  Buildings,
  CaretLeft,
  CaretRight,
  Circle,
  CheckCircle,
  FireExtinguisher,
  HardHat,
  House,
  Leaf,
  MagnifyingGlass,
  Pause,
  Play,
  Storefront,
  Tractor,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";

// Ícones do site: Phosphor Icons (licença MIT), um só peso ("regular") em todo o site.
// Os nomes antigos (estilo Font Awesome) continuam valendo, para não mexer em cada página.
const ICONES = {
  "fa-brands fa-whatsapp": WhatsappLogo,
  "fa-solid fa-bell": Bell,
  "fa-solid fa-building": Buildings,
  "fa-solid fa-chevron-left": CaretLeft,
  "fa-solid fa-chevron-right": CaretRight,
  "fa-solid fa-circle": Circle,
  "fa-solid fa-circle-check": CheckCircle,
  "fa-solid fa-fire-extinguisher": FireExtinguisher,
  "fa-solid fa-helmet-safety": HardHat,
  "fa-solid fa-house": House,
  "fa-solid fa-leaf": Leaf,
  "fa-solid fa-magnifying-glass": MagnifyingGlass,
  "fa-solid fa-pause": Pause,
  "fa-solid fa-play": Play,
  "fa-solid fa-shop": Storefront,
  "fa-solid fa-tractor": Tractor,
  "fa-solid fa-xmark": X,
};

export default function Icone({ nome }) {
  const Componente = ICONES[nome];
  if (!Componente) return null;
  // O ponto de status ("Atendendo agora") é um círculo cheio, não um ícone de traço.
  const peso = nome === "fa-solid fa-circle" ? "fill" : "regular";
  return <Componente className="icone" size="1em" weight={peso} aria-hidden="true" focusable="false" />;
}
