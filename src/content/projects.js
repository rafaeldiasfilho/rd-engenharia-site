// Anonymised example projects (public/exemplos/<folder>) and the slides built from them.

const HOUSE_ITEMS = [
  { file: "planta-baixa", shape: "alto", w: 829, h: 1631, title: "Planta baixa", text: "Residência térrea de 105 m², com 2 suítes, closet e sala integrada à cozinha gourmet.", alt: "Planta baixa de uma residência térrea com duas suítes, closet, sala e cozinha integradas" },
  { file: "cobertura-implantacao", w: 788, h: 895, title: "Cobertura e implantação", text: "Posição da casa no terreno e desenho do telhado, com os recuos e beirais.", alt: "Plantas de cobertura e de implantação de uma residência térrea" },
  { file: "fachada", w: 624, h: 392, title: "Fachada frontal", text: "Vista da frente da casa, com telhado cerâmico e esquadrias.", alt: "Fachada frontal de uma residência térrea com telhado cerâmico" },
  { file: "cortes", shape: "largo", w: 1864, h: 448, title: "Cortes e detalhe da calçada", text: "Cortes AA e BB, com alturas e inclinação do telhado, e detalhe da calçada.", alt: "Cortes AA e BB e detalhe da calçada de uma residência térrea" },
  { file: "quadros", shape: "largo", w: 901, h: 321, title: "Quadro de aberturas", text: "Áreas, iluminação e ventilação de cada ambiente, conforme exigido na aprovação.", alt: "Quadro com áreas e aberturas de iluminação e ventilação dos ambientes" },
];

const COMPACT_HOUSE_ITEMS = [
  { file: "planta-baixa", shape: "alto", w: 768, h: 1497, title: "Planta baixa", text: "Casa térrea de cerca de 62 m², com 2 dormitórios, banheiro e cozinha integrada à sala, e área permeável no fundo do lote.", alt: "Planta baixa de uma casa térrea com dois dormitórios, banheiro, cozinha integrada à sala, área de serviço e área permeável" },
  { file: "cobertura-implantacao", w: 766, h: 838, title: "Cobertura e implantação", text: "Posição da casa no lote de 10 × 22 m e desenho do telhado, com os recuos exigidos.", alt: "Plantas de cobertura e de implantação de uma casa térrea em lote retangular" },
  { file: "fachada", w: 544, h: 332, title: "Fachada frontal", text: "Vista da frente da casa, com platibanda e esquadrias.", alt: "Fachada frontal de uma casa térrea com platibanda, porta e duas janelas" },
  { file: "cortes", shape: "largo", w: 1833, h: 515, title: "Cortes e detalhe da calçada", text: "Cortes AA e BB, com pé-direito, forro e cobertura metálica, e detalhe da calçada.", alt: "Cortes AA e BB de uma casa térrea e detalhe da calçada com árvore" },
  { file: "quadros", shape: "largo", w: 893, h: 207, title: "Quadro de aberturas", text: "Áreas, iluminação e ventilação de cada ambiente, conforme exigido na aprovação.", alt: "Quadro com as áreas e as aberturas de cada ambiente da casa" },
];

// To add another project: create the folder public/exemplos/<pasta> with the same 5 files
// (any number of images; forma: "alto" spans two rows, "largo" spans the full row).
// Example files: (planta-baixa, cobertura-implantacao, fachada, cortes, quadros), then add an item here.
export const PROJECTS = [
  {
    folder: "residencia-terrea",
    name: "Residência térrea",
    summary: "105 m² · 2 suítes · terreno de 11 × 25 m",
    items: HOUSE_ITEMS,
  },
  {
    folder: "residencia-compacta",
    name: "Casa térrea compacta",
    summary: "62 m² · 2 dormitórios · lote de 10 × 22 m",
    items: COMPACT_HOUSE_ITEMS,
  },
];

// Drawings of the real projects as Carousel slides (one image per slide).
// highlightsOnly = true: floor plan and front elevation only (used on the home page).
export const projectSlides = (highlightsOnly = false) =>
  PROJECTS.flatMap((p) =>
    p.items
      .filter((e) => !highlightsOnly || ["planta-baixa", "fachada"].includes(e.file))
      .map((e) => ({
        key: `${p.folder}-${e.file}`,
        src: `/exemplos/${p.folder}/${e.file}.webp`,
        imgHref: `/exemplos/${p.folder}/${e.file}.webp`,
        w: e.w,
        h: e.h,
        alt: e.alt,
        caption: `${p.name} · ${e.title}`,
        note: e.text,
        contain: true,
      }))
  );
