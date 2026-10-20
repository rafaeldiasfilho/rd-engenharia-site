// Mapa de fotos do site: slot -> foto. Para trocar uma foto, edite só este arquivo
// (e coloque o arquivo em public/fotos/otim/). Se um slot for null ou o arquivo faltar,
// a página usa a ilustração ou o desenho de projeto no lugar, sem quebrar o layout.
// Todas as fotos abaixo são de terceiros (CC0 / domínio público, Wikimedia Commons)
// e NÃO são trabalhos da RD Engenharia. Cada uma aparece com a legenda "Imagem ilustrativa".

const COMMONS = "https://commons.wikimedia.org/wiki/File:";

// Cada foto tem duas larguras: a pequena (celular) e a grande (tela larga).
export const FOTOS = {
  "topografia-estacao-total": {
    arq: "topografia-estacao-total", pequena: 760, grande: 1400, w: 1400, h: 1050,
    alt: "Estação total sobre um tripé amarelo em uma clareira de floresta, com duas maletas vermelhas ao pé do tripé",
    autor: "Stamboliyski", licenca: "CC0", arquivo: "Bjorn22.JPG",
    fonte: COMMONS + "Bjorn22.JPG",
  },
  "bombeiros-saida-emergencia": {
    arq: "bombeiros-saida-emergencia", pequena: 760, grande: 1400, w: 1400, h: 788,
    alt: "Escada interna ao lado de uma porta de saída de emergência com a placa verde iluminada acima dela",
    autor: "诺尔0", licenca: "CC0", arquivo: "Stair Corner with Emergency Exit.jpg",
    fonte: COMMONS + "Stair_Corner_with_Emergency_Exit.jpg",
  },
  "civil-casa-alvenaria": {
    arq: "civil-casa-alvenaria", pequena: 760, grande: 1400, w: 1400, h: 1050,
    alt: "Casa de alvenaria com telhado cerâmico, varanda e pintura branca, cercada de gramado e morros ao fundo",
    autor: "DAR7", licenca: "CC0",
    arquivo: "Casa de alvenaria e tijolo no município de Campos Novos, Santa Catarina, Brasil (2).jpg",
    fonte: COMMONS + "Casa_de_alvenaria_e_tijolo_no_município_de_Campos_Novos,_Santa_Catarina,_Brasil_(2).jpg",
  },
  "seguranca-epi": {
    arq: "seguranca-epi", pequena: 760, grande: 1400, w: 1400, h: 993,
    alt: "Equipamentos de proteção individual sobre uma mesa de madeira clara: capacete laranja, colete refletivo, protetor auricular e luvas",
    autor: "CANVA", licenca: "CC0", arquivo: "EPIs de segurança do trabalhador.png",
    fonte: COMMONS + "EPIs_de_segurança_do_trabalhador.png",
  },
  "seguranca-luva": {
    arq: "seguranca-luva", pequena: 760, grande: 1400, w: 1400, h: 1050,
    alt: "Mão com luva de proteção de couro branco e tecido amarelo com faixa refletiva, sobre uma rua de asfalto",
    autor: "Petey21", licenca: "CC0", arquivo: "Yellow-work-glove.jpg",
    fonte: COMMONS + "Yellow-work-glove.jpg",
  },
  "civil-casa-obra": {
    arq: "civil-casa-obra", pequena: 760, grande: 1225, w: 1225, h: 740,
    alt: "Casa simples em construção no interior do Brasil, com paredes rebocadas, telhado de telha cerâmica, porta e janela ainda sem acabamento",
    autor: "Almanaque Lusofonista", licenca: "Domínio público", arquivo: "Minha casa, Minha Vida BRASIL.JPG",
    fonte: COMMONS + "Minha_casa,_Minha_Vida_BRASIL.JPG",
  },
  "civil-andaime": {
    arq: "civil-andaime", pequena: 760, grande: 1400, w: 1400, h: 1050,
    alt: "Andaimes metálicos com pranchas de madeira em volta de uma construção de tijolos, sob céu azul (imagem genérica de obra)",
    autor: "Baltimore Heritage", licenca: "CC0", arquivo: "Back with scaffolding, 1232 Druid Hill Avenue (32483635746).jpg",
    fonte: COMMONS + "Back_with_scaffolding,_1232_Druid_Hill_Avenue_(32483635746).jpg",
  },
  "rural-montanhas-mg": {
    arq: "rural-montanhas-mg", pequena: 760, grande: 1400, w: 1400, h: 788,
    alt: "Vale de pasto verde cercado por morros e montanhas, sob céu azul com nuvens (paisagem rural de Minas Gerais)",
    autor: "Themium", licenca: "CC0", arquivo: "Vista Rural de Gonçalves, Minas Gerais.jpg",
    fonte: COMMONS + "Vista_Rural_de_Gonçalves,_Minas_Gerais.jpg",
  },
  "lavouras-pivos-aerea": {
    arq: "lavouras-pivos-aerea", pequena: 760, grande: 1400, w: 1400, h: 930,
    alt: "Vista aérea, feita de satélite, de lavouras com irrigação em círculos e talhões retangulares, cortadas por um curso d'água",
    autor: "Tripulação da Expedição 26 da ISS (NASA)", licenca: "Domínio público",
    arquivo: "Agricultural Fields near Perdizes, Minas Gerais, Brazil.JPG",
    fonte: COMMONS + "Agricultural_Fields_near_Perdizes,_Minas_Gerais,_Brazil.JPG",
  },
  "mata-ciliar-corrego": {
    arq: "mata-ciliar-corrego", pequena: 760, grande: 1400, w: 1400, h: 788,
    alt: "Córrego de águas calmas cercado por vegetação densa, com o céu refletido na água",
    autor: "Matt9019", licenca: "CC0", arquivo: "Rio do Meio jusante.jpg",
    fonte: COMMONS + "Rio_do_Meio_jusante.jpg",
  },
  "rural-pasto-gado": {
    arq: "rural-pasto-gado", pequena: 760, grande: 1400, w: 1400, h: 857,
    alt: "Rebanho de gado branco em um pasto verde, com um morro de topo plano ao fundo",
    autor: "Miguelrangeljr", licenca: "Domínio público", arquivo: "Bois morro do diabo.jpg",
    fonte: COMMONS + "Bois_morro_do_diabo.jpg",
  },
  "bombeiros-detector-fumaca": {
    arq: "bombeiros-detector-fumaca", pequena: 760, grande: 1200, w: 1200, h: 948,
    alt: "Detector de fumaça branco preso ao teto texturizado de um ambiente interno",
    autor: "Georg Pik", licenca: "Domínio público", arquivo: "Smoke detector (1).JPG",
    fonte: COMMONS + "Smoke_detector_(1).JPG",
  },
  "bombeiros-sprinkler": {
    arq: "bombeiros-sprinkler", pequena: 560, grande: 900, w: 900, h: 938,
    alt: "Bico de sprinkler de latão com elo fusível, pendurado no teto de um ambiente interno",
    autor: "Stebanoid", licenca: "CC0", arquivo: "Fusable link sprinkler head.jpg",
    fonte: COMMONS + "Fusable_link_sprinkler_head.jpg",
  },
  "seguranca-capacete": {
    arq: "seguranca-capacete", pequena: 760, grande: 1200, w: 1200, h: 900,
    alt: "Capacete de segurança amarelo, com aba frontal, sobre fundo branco",
    autor: "Batholith", licenca: "Domínio público", arquivo: "Hard hat 20111111.jpg",
    fonte: COMMONS + "Hard_hat_20111111.jpg",
  },
};

// Slot (lugar no site) -> foto. Valor null = sem foto: a página usa a ilustração.
export const SLOTS = {
  "home-hero": "rural-montanhas-mg",
  "seguranca-do-trabalho": "seguranca-epi",
  "seguranca-do-trabalho-2": "seguranca-luva",
  "corpo-de-bombeiros": "bombeiros-saida-emergencia",
  "engenharia-civil": "civil-casa-alvenaria",
  "engenharia-civil-2": "civil-casa-obra",
  "engenharia-civil-3": "civil-andaime",
  "meio-ambiente-topografia": "topografia-estacao-total",
  "meio-ambiente-topografia-2": "lavouras-pivos-aerea",
  "meio-ambiente-topografia-3": "mata-ciliar-corrego",
  "onde-atendemos": "rural-pasto-gado",
  "equip-seguranca-do-trabalho": "seguranca-capacete",
  "equip-corpo-de-bombeiros": "bombeiros-detector-fumaca",
  "equip-corpo-de-bombeiros-2": "bombeiros-sprinkler",
};

// Fotos de apoio por área, na ordem em que aparecem na seção "Na prática".
export const FOTOS_PRATICA = {
  "seguranca-do-trabalho": ["seguranca-do-trabalho-2"],
  "corpo-de-bombeiros": [],
  "engenharia-civil": ["engenharia-civil-2", "engenharia-civil-3"],
  "meio-ambiente-topografia": ["meio-ambiente-topografia-2", "meio-ambiente-topografia-3"],
};

export const foto = (slot) => {
  const id = SLOTS[slot];
  return id ? FOTOS[id] || null : null;
};

export const caminho = (f, largura) => `/fotos/otim/${f.arq}-${largura}.webp`;

// Lista para a página de créditos: só as fotos que estão em uso em algum slot (sem repetir).
export const FOTOS_EM_USO = [...new Set(Object.values(SLOTS).filter((id) => id && FOTOS[id]))].map((id) => FOTOS[id]);
