// Real projects (public/exemplos/<folder>/<file>.jpg): the same slides posted on the RD Instagram,
// drawn from drawing crops only (no client name, address, title block or location map), in the site
// identity (Manrope, green and lime), with hand-marker notes explaining the drawing.
// Every slide is 900 x 1200 (3:4). The cover of each project is the only slide shown on the home page.
// To add a project: export its slides (without the WhatsApp closing slide) as JPG 900 px wide
// into public/exemplos/<folder>/ and add an entry here.

const SLIDE_W = 900;
const SLIDE_H = 1200;

export const PROJECTS = [
  {
    folder: "residencia-terrea",
    name: "Residência térrea",
    kind: "Projeto",
    items: [
      { file: "capa", title: "Visão geral", text: "105 m², 2 suítes, lote de 11 × 25 m.", alt: "Capa do projeto de uma casa térrea com duas suítes, com a planta baixa e a casa circulada" },
      { file: "planta-baixa", title: "Planta baixa", text: "Duas suítes, closet e sala integrada à cozinha gourmet.", alt: "Planta baixa com as suítes, o closet e a sala com cozinha circulados" },
      { file: "fachada", title: "Fachada", text: "Telhado em duas águas, visto da rua.", alt: "Fachada frontal de uma casa térrea com telhado em duas águas" },
      { file: "cortes", title: "Cortes", text: "Alturas, telha cerâmica e caixa d'água.", alt: "Cortes AA e BB de uma casa térrea com telhado cerâmico e caixa d'água" },
      { file: "area-permeavel", title: "Área permeável", text: "141 m² do lote ficam sem piso.", alt: "Trecho da planta com a área permeável de 141 metros quadrados circulada" },
    ],
  },
  {
    folder: "residencia-compacta",
    name: "Casa térrea compacta",
    kind: "Projeto",
    items: [
      { file: "capa", title: "Visão geral", text: "2 quartos, lote de 10 × 22 m.", alt: "Capa do projeto de uma casa térrea de dois quartos, com a planta baixa e a casa circulada" },
      { file: "planta-baixa", title: "Planta baixa", text: "Cada cômodo vem com a área escrita.", alt: "Planta baixa com a área dos dormitórios e da cozinha com sala circulada" },
      { file: "area-permeavel", title: "Área permeável", text: "30 m² do lote ficam sem piso.", alt: "Trecho da planta com a área permeável de 30 metros quadrados circulada" },
      { file: "fachada", title: "Fachada", text: "A casa vista da rua.", alt: "Fachada frontal de uma casa térrea com platibanda, porta e duas janelas" },
      { file: "cortes", title: "Cortes", text: "Forro, telhado e caixa d'água.", alt: "Cortes AA e BB de uma casa térrea" },
    ],
  },
  {
    folder: "regularizacao-residencial",
    name: "Regularização de casa",
    kind: "Regularização",
    items: [
      { file: "capa", title: "Visão geral", text: "O que o vermelho desta planta quer dizer?", alt: "Capa de uma regularização residencial com as varandas em vermelho circuladas" },
      { file: "planta-baixa", title: "Planta baixa", text: "Azul é a casa que já tinha projeto aprovado.", alt: "Planta baixa com as paredes aprovadas em azul circuladas" },
      { file: "area-a-regularizar", title: "Área a regularizar", text: "Vermelho é o que foi construído depois: quatro varandas.", alt: "Planta com as quatro varandas a regularizar circuladas" },
      { file: "fachada-e-corte", title: "Corte e fachada", text: "Com as medidas tiradas no local.", alt: "Corte A-A e vista frontal da casa em regularização" },
    ],
  },
  {
    folder: "regularizacao-area-construida",
    name: "Regularização de 147 m²",
    kind: "Regularização",
    items: [
      { file: "capa", title: "Visão geral", text: "147 m² de construção para regularizar.", alt: "Capa com a implantação e a área a regularizar circulada" },
      { file: "implantacao", title: "Implantação", text: "A área hachurada em vermelho entrou no processo.", alt: "Implantação com a área a regularizar hachurada em vermelho" },
      { file: "planta-baixa", title: "Planta baixa", text: "Cada cômodo medido no local.", alt: "Planta baixa de uma casa em regularização com áreas e cotas" },
      { file: "cortes", title: "Cortes", text: "Alturas, cobertura e calha.", alt: "Cortes de uma casa em regularização" },
      { file: "vista-frontal", title: "Vista frontal", text: "A casa como está construída.", alt: "Vista frontal de uma casa em regularização" },
    ],
  },
  {
    folder: "regularizacao-salao-comercial",
    name: "Regularização de salão comercial",
    kind: "Regularização",
    items: [
      { file: "capa", title: "Visão geral", text: "Salão funcionando sem projeto aprovado também se regulariza.", alt: "Capa com a planta de três salões comerciais" },
      { file: "planta-baixa", title: "Planta baixa", text: "Desenhada a partir do que já estava construído.", alt: "Planta baixa dos salões com os quatro banheiros circulados" },
      { file: "cortes-e-fachada", title: "Cortes e fachada", text: "Telhado, alturas e aberturas.", alt: "Cortes e fachada de um salão comercial em regularização" },
    ],
  },
  {
    folder: "regularizacao-predio-comercial",
    name: "Regularização de prédio comercial",
    kind: "Regularização",
    items: [
      { file: "capa", title: "Visão geral", text: "Um prédio comercial inteiro regularizado, com barracão de 570 m².", alt: "Capa com parte da planta do barracão de um prédio comercial" },
      { file: "cozinha-e-banheiros", title: "Cozinha e banheiros", text: "Também entram no desenho.", alt: "Trecho da planta com a cozinha e os banheiros circulados" },
      { file: "cortes", title: "Corte", text: "Estrutura e telhado metálicos.", alt: "Corte de um prédio comercial com estrutura e telhado metálicos" },
      { file: "sanitario-acessivel", title: "Sanitário acessível", text: "Com as medidas da norma.", alt: "Detalhe de sanitário acessível com barras de apoio e medidas" },
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
