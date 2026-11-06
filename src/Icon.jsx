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

// Site icons: Phosphor Icons (MIT license), a single weight ("regular") across the whole site.
// The old names (Font Awesome style) still work, so every page does not need to change.
const ICONS = {
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

export default function Icon({ name }) {
  const Component = ICONS[name];
  if (!Component) return null;
  // The status dot ("Atendendo agora") is a filled circle, not an outline icon.
  const weight = name === "fa-solid fa-circle" ? "fill" : "regular";
  return <Component className="icon" size="1em" weight={weight} aria-hidden="true" focusable="false" />;
}
