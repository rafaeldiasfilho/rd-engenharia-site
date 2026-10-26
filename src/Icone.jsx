import {
  faBars,
  faBell,
  faBuilding,
  faChevronLeft,
  faChevronRight,
  faCircle,
  faCircleCheck,
  faFireExtinguisher,
  faHelmetSafety,
  faHouse,
  faLeaf,
  faMagnifyingGlass,
  faPause,
  faPlay,
  faShop,
  faTractor,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

// Ícones embutidos no site (Font Awesome Free, licença CC BY 4.0), sem carregar biblioteca externa.
const ICONES = {
  "fa-brands fa-whatsapp": faWhatsapp,
  "fa-solid fa-bars": faBars,
  "fa-solid fa-bell": faBell,
  "fa-solid fa-building": faBuilding,
  "fa-solid fa-chevron-left": faChevronLeft,
  "fa-solid fa-chevron-right": faChevronRight,
  "fa-solid fa-circle": faCircle,
  "fa-solid fa-circle-check": faCircleCheck,
  "fa-solid fa-fire-extinguisher": faFireExtinguisher,
  "fa-solid fa-helmet-safety": faHelmetSafety,
  "fa-solid fa-house": faHouse,
  "fa-solid fa-leaf": faLeaf,
  "fa-solid fa-magnifying-glass": faMagnifyingGlass,
  "fa-solid fa-pause": faPause,
  "fa-solid fa-play": faPlay,
  "fa-solid fa-shop": faShop,
  "fa-solid fa-tractor": faTractor,
  "fa-solid fa-xmark": faXmark,
};

export default function Icone({ nome }) {
  const def = ICONES[nome];
  if (!def) return null;
  const [largura, altura, , , caminho] = def.icon;
  return (
    <svg
      className="icone"
      viewBox={`0 0 ${largura} ${altura}`}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={caminho} />
    </svg>
  );
}
