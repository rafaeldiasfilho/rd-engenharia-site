// Real projects (public/exemplos/<folder>/<file>.jpg): the same slides posted on the RD Instagram,
// made in Canva from drawing crops only (no client name, address, title block or location map).
// Every slide is 900 x 1200 (3:4). The cover of each project is the only slide shown on the home page.
// To add a project: export its Canva slides (without the WhatsApp closing slide) as JPG 900 px wide
// into public/exemplos/<folder>/ and add an entry here.

const SLIDE_W = 900;
const SLIDE_H = 1200;

export const PROJECTS = [
  {
    folder: "residencia-terrea",
    name: "Residência térrea",
    kind: "Projeto",
    items: [
      { file: "capa", title: "Visão geral", text: "105 m², 2 suítes, lote de 11 × 25 m.", alt: "Capa do projeto de uma casa térrea com duas suítes, com a planta baixa reduzida" },
      { file: "planta-baixa", title: "Planta baixa", text: "Duas suítes, closet e sala integrada à cozinha gourmet.", alt: "Planta baixa de uma casa térrea com duas suítes, closet e sala integrada à cozinha" },
      { file: "fachada", title: "Fachada", text: "Telhado em duas águas, vista da rua.", alt: "Fachada frontal de uma casa térrea com telhado em duas águas" },
      { file: "cortes", title: "Cortes", text: "Alturas, telha cerâmica e caixa d'água de 500 L.", alt: "Cortes AA e BB de uma casa térrea com telhado cerâmico e caixa d'água" },
    ],
  },
  {
    folder: "residencia-compacta",
    name: "Casa térrea compacta",
    kind: "Projeto",
    items: [
      { file: "capa", title: "Visão geral", text: "2 quartos, lote de 10 × 22 m.", alt: "Capa do projeto de uma casa térrea de dois quartos, com a planta baixa reduzida" },
      { file: "planta-baixa", title: "Planta baixa", text: "Cotas e área de cada cômodo, mais a área permeável.", alt: "Planta baixa de uma casa térrea com dois dormitórios, banheiro, cozinha e sala" },
      { file: "fachada", title: "Fachada", text: "Como a casa fica vista da rua.", alt: "Fachada frontal de uma casa térrea com platibanda, porta e duas janelas" },
      { file: "cortes", title: "Cortes", text: "Alturas, forro, cobertura e caixa d'água.", alt: "Cortes AA e BB de uma casa térrea" },
    ],
  },
  {
    folder: "regularizacao-residencial",
    name: "Regularização de casa",
    kind: "Regularização",
    items: [
      { file: "capa", title: "Visão geral", text: "Azul: o que já existe. Vermelho: o que falta regularizar.", alt: "Capa de um projeto de regularização residencial com a planta e as fachadas reduzidas" },
      { file: "planta-baixa", title: "Planta baixa", text: "Paredes existentes em azul e área a regularizar em vermelho.", alt: "Planta baixa de regularização com paredes existentes em azul e acréscimos em vermelho" },
      { file: "fachada-e-corte", title: "Fachada e corte", text: "Altura, telhado e aberturas, tudo medido no local.", alt: "Fachada e corte de uma casa em regularização" },
      { file: "corte-transversal", title: "Corte transversal", text: "Cada parede e cada abertura entra no desenho.", alt: "Corte transversal de uma casa em regularização" },
    ],
  },
  {
    folder: "regularizacao-area-construida",
    name: "Regularização de 147 m²",
    kind: "Regularização",
    items: [
      { file: "capa", title: "Visão geral", text: "147 m² de construção para regularizar.", alt: "Capa de um projeto de regularização de 147 metros quadrados com a implantação reduzida" },
      { file: "implantacao", title: "Implantação", text: "Em vermelho, toda a área que entrou no processo.", alt: "Implantação com a área a regularizar hachurada em vermelho" },
      { file: "planta-baixa", title: "Planta baixa", text: "Cada cômodo medido no local, com área e cota.", alt: "Planta baixa de uma casa em regularização com áreas e cotas" },
      { file: "cortes", title: "Cortes", text: "Alturas, cobertura e calha.", alt: "Cortes de uma casa em regularização" },
      { file: "vista-frontal", title: "Vista frontal", text: "A fachada como está construída.", alt: "Vista frontal de uma casa em regularização" },
    ],
  },
  {
    folder: "regularizacao-salao-comercial",
    name: "Regularização de salão comercial",
    kind: "Regularização",
    items: [
      { file: "capa", title: "Visão geral", text: "Salão pronto e funcionando, regularizado a partir do que já existia.", alt: "Capa de um projeto de regularização de salão comercial" },
      { file: "planta-baixa", title: "Planta baixa", text: "Os salões desenhados como já estavam construídos.", alt: "Planta baixa de salões comerciais em regularização" },
      { file: "cortes-e-fachada", title: "Cortes e fachada", text: "Estrutura do telhado, alturas e aberturas.", alt: "Cortes e fachada de um salão comercial em regularização" },
    ],
  },
  {
    folder: "regularizacao-predio-comercial",
    name: "Regularização de prédio comercial",
    kind: "Regularização",
    items: [
      { file: "capa", title: "Visão geral", text: "Barracão, cozinha, varandas, quadra e estacionamento em uma prancha.", alt: "Capa de um projeto de regularização de prédio comercial com quadra" },
      { file: "planta-geral", title: "Planta geral", text: "Tudo o que existe no terreno, com a área de cada parte.", alt: "Planta geral de um prédio comercial com quadra em regularização" },
      { file: "fachada", title: "Fachada", text: "A frente do imóvel em escala.", alt: "Fachada de um prédio comercial em regularização" },
      { file: "cortes", title: "Cortes", text: "Estrutura metálica, telhado e caixa d'água.", alt: "Cortes de um prédio comercial com estrutura metálica" },
      { file: "sanitario-acessivel", title: "Sanitário acessível", text: "Barras e alturas conforme a norma de acessibilidade.", alt: "Detalhe de sanitário acessível com barras de apoio e medidas" },
    ],
  },
];

// Slides of the real projects for the Carousel (one image per slide).
// coversOnly = true: one cover per project (used on the home page).
export const projectSlides = (coversOnly = false) =>
  PROJECTS.flatMap((p) =>
    p.items
      .filter((e) => !coversOnly || e.file === "capa")
      .map((e) => ({
        key: `${p.folder}-${e.file}`,
        src: `/exemplos/${p.folder}/${e.file}.jpg`,
        imgHref: `/exemplos/${p.folder}/${e.file}.jpg`,
        w: SLIDE_W,
        h: SLIDE_H,
        alt: e.alt,
        caption: `${p.kind} · ${p.name}`,
        note: coversOnly ? e.text : `${e.title}: ${e.text}`,
        contain: true,
      }))
  );
