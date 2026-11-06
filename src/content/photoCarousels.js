// Which photos appear in each carousel and fixed slot, and the list of photos actually in use.

import { PHOTOS } from "./photoList.js";

// Slot (place on the site) -> single photo. A null value = no photo.
export const SLOTS = {};

// Carousels: key = place on the site; each slide points to a photo in FOTOS, with a short caption and,
// optionally, a link to the area page. A carousel with no photos does not appear on the page.
// "equip-*": only GENERIC reference equipment (never RD's inventory) and only when there are 3 or more
// photos that truly match the page's list (visible brands are allowed here; people are not).
export const CAROUSELS = {
  home: [
    { photo: "capacete-vermelho-epi", caption: "Segurança do trabalho", href: "/seguranca-do-trabalho" },
    { photo: "extintor-parede-concreto-pictograma", caption: "Corpo de Bombeiros", href: "/corpo-de-bombeiros" },
    { photo: "edificio-estrutura-concreto-pavimentos", caption: "Engenharia civil", href: "/engenharia-civil" },
    { photo: "estacao-total-prisma-tripes", caption: "Topografia e georreferenciamento", href: "/meio-ambiente-topografia" },
    { photo: "rio-mata-vista-aerea", caption: "Meio ambiente", href: "/meio-ambiente-topografia" },
  ],
  "area-seguranca-do-trabalho": [
    { photo: "capacete-vermelho-epi", caption: "Capacete: proteção da cabeça (EPI)" },
    { photo: "trabalhador-altura-cinto-seguranca", caption: "Trabalho em altura, com cinto e talabarte" },
    { photo: "capacetes-amarelos-epi", caption: "Capacetes de segurança" },
  ],
  "area-corpo-de-bombeiros": [
    { photo: "tubulacao-sprinklers-teto-estacionamento", caption: "Rede de combate a incêndio com chuveiros automáticos" },
    { photo: "tubulacao-incendio-teto-vermelha", caption: "Tubulação de incêndio em edificação" },
    { photo: "escada-saida-emergencia-sinalizada", caption: "Rota de saída sinalizada" },
  ],
  "area-engenharia-civil": [
    { photo: "edificio-estrutura-concreto-pavimentos", caption: "Estrutura de concreto em obra" },
    { photo: "obra-alvenaria-guindaste", caption: "Obra de edifício em alvenaria" },
    { photo: "sobrado-alvenaria-em-obra", caption: "Sobrado em construção" },
    { photo: "casa-alvenaria-tijolo-telhado-metalico", caption: "Casa de tijolos com telhado metálico" },
  ],
  "area-meio-ambiente-topografia": [
    { photo: "estacao-total-prisma-tripes", caption: "Estação total e prisma, usados em topografia" },
    { photo: "rio-mata-vista-aerea", caption: "Rio e mata: o que a área ambiental protege" },
  ],
  "equip-seguranca-do-trabalho": [
    { photo: "dosimetro-ruido-calibrador-acustico", caption: "Dosímetro de ruído e calibrador acústico" },
    { photo: "medidor-nivel-sonoro-portatil", caption: "Medidor de nível sonoro (decibelímetro) portátil" },
    { photo: "medidor-nivel-sonoro-com-celular", caption: "Calibrador acústico e medidor de nível sonoro no celular" },
  ],
  "equip-corpo-de-bombeiros": [
    { photo: "extintor-parede-concreto-pictograma", caption: "Extintor de incêndio com a sinalização" },
    { photo: "extintor-em-caixa-com-sinalizacao", caption: "Extintor em abrigo, com sinalização" },
    { photo: "abrigo-mangueira-incendio-vermelho", caption: "Abrigo de mangueira de incêndio" },
    { photo: "caixa-mangueira-e-registro-recalque", caption: "Caixa de mangueira e registro de recalque" },
    { photo: "acionador-manual-alarme-vermelho", caption: "Acionador manual de alarme de incêndio" },
    { photo: "detector-fumaca-teto", caption: "Detector de fumaça no teto" },
    { photo: "sirene-alarme-incendio-teto", caption: "Sirene e luz de alarme de incêndio" },
    { photo: "luminaria-saida-emergencia-verde", caption: "Luminária de saída de emergência" },
  ],
  "equip-engenharia-civil": [
    { photo: "estacao-total-amarela-campo", caption: "Estação total, usada para medidas e alturas" },
    { photo: "nivel-laser-linha-verde", caption: "Nível a laser de linha" },
    { photo: "trena-aco-5-metros", caption: "Trena de aço" },
    { photo: "nivel-bolha-trena-ferramentas", caption: "Nível de bolha e trena" },
  ],
  "equip-meio-ambiente-topografia": [
    { photo: "receptor-gnss-tripe-obra-guindaste", caption: "Receptor GNSS (GPS de precisão) sobre tripé" },
    { photo: "receptor-gnss-sobre-tripe-gramado", caption: "Receptor GNSS sobre tripé, em campo" },
    { photo: "receptor-gnss-rtk-floresta", caption: "Receptor GNSS RTK em bastão" },
    { photo: "estacao-total-tripe-amarelo-campo", caption: "Estação total em tripé" },
    { photo: "drone-multirotor-camera", caption: "Drone com câmera (aeronave remotamente pilotada)" },
  ],
};

export const slidesFor = (key) =>
  (CAROUSELS[key] || []).filter((s) => PHOTOS[s.photo]).map((s) => ({ ...s, f: PHOTOS[s.photo] }));

export const getPhoto = (slot) => {
  const id = SLOTS[slot];
  return id ? PHOTOS[id] || null : null;
};

// List for the credits page: only the photos in use (slots and carousels), without repeats.
const idsInUse = new Set([
  ...Object.values(SLOTS).filter(Boolean),
  ...Object.values(CAROUSELS).flatMap((list) => list.map((s) => s.photo)),
]);

export const PHOTOS_IN_USE = [...idsInUse].filter((id) => PHOTOS[id]).map((id) => PHOTOS[id]);
