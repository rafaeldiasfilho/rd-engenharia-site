// Every photo used on the site, with author, source and licence (CC0 / public domain / Unsplash). Feeds /creditos.
// Photo map of the site. To change a photo, edit this file and src/content/photoCarousels.js (and put the .webp in
// public/fotos/otim/). All photos are third-party (Wikimedia Commons CC0 and Unsplash License)
// and are NOT RD Engenharia's work. Each one is shown with the caption "Imagem ilustrativa" (illustrative image).
// The /creditos page is generated from here and lists only the photos in use.
// The Unsplash License is NOT CC0: never label it as CC0. Unsplash authors read from each photo's page on 2026-10-20.

const COMMONS = "https://commons.wikimedia.org/wiki/File:";

const UNSPLASH_LICENSE_URL = "https://unsplash.com/license";

const unsplash = (id, author) => ({
  author: author,
  license: "Unsplash License",
  licenseUrl: UNSPLASH_LICENSE_URL,
  source: `https://unsplash.com/photos/${id}`,
  sourceName: "Unsplash",
});

const commons = (fileName, author, license = "CC0") => ({
  license: license,
  author: author,
  fileName: fileName,
  source: COMMONS + encodeURIComponent(fileName.replace(/ /g, "_")).replace(/%2C/g, ","),
  sourceName: "Wikimedia Commons",
});

// Each photo has a unique file at public/fotos/otim/<arq>.webp.
export const PHOTOS = {
  "capacete-vermelho-epi": {
    file: "capacete-vermelho-epi", w: 1600, h: 900,
    alt: "Capacete de segurança vermelho sobre o asfalto, com uma obra desfocada ao fundo",
    ...unsplash("9OB46apMbC4", "Ümit Yıldırım"),
  },
  "trabalhador-altura-cinto-seguranca": {
    file: "trabalhador-altura-cinto-seguranca", w: 1600, h: 1008,
    alt: "Trabalhador em viga metálica com cinto de segurança e talabarte, de capacete com viseira",
    ...unsplash("niSnhfMjiMI", "Jeriden Villegas"),
  },
  "capacetes-amarelos-epi": {
    file: "capacetes-amarelos-epi", w: 1600, h: 1067,
    alt: "Quatro capacetes de segurança amarelos sobre um piso de madeira escura",
    ...unsplash("YSxcf6C_SEg", "Silvia Brazzoduro"),
  },
  "extintor-parede-concreto-pictograma": {
    file: "extintor-parede-concreto-pictograma", w: 1600, h: 1067,
    alt: "Extintor de incêndio vermelho fixado em parede de concreto, com a placa de sinalização de extintor acima",
    ...unsplash("GCmVg5lztwI", "Jakub Żerdzicki"),
  },
  "sirene-alarme-incendio-teto": {
    file: "sirene-alarme-incendio-teto", w: 1600, h: 1065,
    alt: "Sirene e luz de alarme de incêndio fixadas no forro de um ambiente interno",
    ...unsplash("Ea4OPjLDt5k", "Etienne Girardet"),
  },
  "luminaria-saida-emergencia-verde": {
    file: "luminaria-saida-emergencia-verde", w: 1600, h: 1201,
    alt: "Luminária de saída de emergência verde, com figura em movimento e seta, em parede escura",
    ...unsplash("SKrgZQgYy2g", "Andrew Teoh"),
  },
  "tubulacao-sprinklers-teto-estacionamento": {
    file: "tubulacao-sprinklers-teto-estacionamento", w: 1600, h: 1067,
    alt: "Tubulação vermelha de combate a incêndio com chuveiros automáticos no teto de concreto de um estacionamento",
    ...unsplash("YkPY2Awkra8", "Valentin Lacoste"),
  },
  "tubulacao-incendio-teto-vermelha": {
    file: "tubulacao-incendio-teto-vermelha", w: 1600, h: 1200,
    alt: "Tubulação vermelha de incêndio e eletrodutos no teto de concreto de uma edificação",
    ...unsplash("eENezYdWSIg", "Nopparuj Lamaikul"),
  },
  "escada-saida-emergencia-sinalizada": {
    file: "escada-saida-emergencia-sinalizada", w: 1600, h: 901,
    alt: "Escada interna ao lado de uma porta de saída de emergência com a placa verde iluminada acima dela",
    ...commons("Stair Corner with Emergency Exit.jpg", "诺尔0"),
  },
  "sobrado-alvenaria-em-obra": {
    file: "sobrado-alvenaria-em-obra", w: 1600, h: 1204,
    alt: "Sobrado de tijolos com telhado de telhas em construção, com andaime de madeira e areia na frente",
    ...unsplash("VggmWsUgA10", "Divaris Shirichena"),
  },
  "casa-alvenaria-tijolo-telhado-metalico": {
    file: "casa-alvenaria-tijolo-telhado-metalico", w: 1600, h: 767,
    alt: "Casa de tijolos aparentes em construção, já com a estrutura e o telhado metálico, sob céu azul",
    ...unsplash("zizZk3AMhpI", "Divaris Shirichena"),
  },
  "edificio-estrutura-concreto-pavimentos": {
    file: "edificio-estrutura-concreto-pavimentos", w: 1600, h: 1009,
    alt: "Edifício de vários pavimentos com estrutura de concreto e escoramento, em construção, sob céu azul",
    ...unsplash("PlBsJ5MybGc", "Tolu Olubode"),
  },
  "obra-alvenaria-guindaste": {
    file: "obra-alvenaria-guindaste", w: 1600, h: 1200,
    alt: "Edifício residencial de alvenaria com andaimes e guindaste de torre em obra",
    ...commons("Construction site Daumstraße north 2019-10-29 10.jpg", "Leonhard Lenz"),
  },
  "estacao-total-prisma-tripes": {
    file: "estacao-total-prisma-tripes", w: 1600, h: 1200,
    alt: "Estação total e prisma topográficos sobre tripés amarelos, ao lado de cones de sinalização",
    ...commons("Surveying prism and total station, for land surveying, in Shibuya-ku.jpg", "Syced"),
  },
  "rio-mata-vista-aerea": {
    file: "rio-mata-vista-aerea", w: 1300, h: 867,
    alt: "Vista aérea de um rio de águas azul-turquesa entre mata densa e rochas",
    ...unsplash("Zj9bdiD4wno", "Christian Thöni"),
  },
  "dosimetro-ruido-calibrador-acustico": {
    file: "dosimetro-ruido-calibrador-acustico", w: 1600, h: 1200,
    alt: "Dosímetro de ruído classe 2 e calibrador de microfone, lado a lado sobre uma superfície cinza",
    ...commons("Noise Dosimeters 02.jpg", "Chuck Kardous (NIOSH)", "Domínio público"),
  },
  "medidor-nivel-sonoro-com-celular": {
    file: "medidor-nivel-sonoro-com-celular", w: 1600, h: 1060,
    alt: "Calibrador acústico ligado a um smartphone que mostra um medidor de nível sonoro, sobre uma mesa de madeira",
    ...commons("NIOSHSLM Calibration.jpg", "Chuck Kardous (NIOSH)", "Domínio público"),
  },
  "medidor-nivel-sonoro-portatil": {
    file: "medidor-nivel-sonoro-portatil", w: 1600, h: 1200,
    alt: "Medidor de nível sonoro portátil segurado com uma das mãos, com um caminhão ao fundo",
    ...commons("TrasportationNoiseMeasurement.jpg", "Chuck Kardous (NIOSH)", "Domínio público"),
  },
  "extintor-em-caixa-com-sinalizacao": {
    file: "extintor-em-caixa-com-sinalizacao", w: 1600, h: 1067,
    alt: "Extintor dentro de um abrigo vermelho de parede, com a placa de sinalização de extintor ao lado",
    ...unsplash("9eHynv5JG9o", "Jacob Mejicanos"),
  },
  "abrigo-mangueira-incendio-vermelho": {
    file: "abrigo-mangueira-incendio-vermelho", w: 1600, h: 1067,
    alt: "Abrigo plástico vermelho de mangueira de incêndio em parede branca",
    ...unsplash("lPh_joRZA6A", "Pix Tresa"),
  },
  "caixa-mangueira-e-registro-recalque": {
    file: "caixa-mangueira-e-registro-recalque", w: 1600, h: 1200,
    alt: "Caixa de mangueira de incêndio e válvula de registro na parede",
    ...unsplash("jv1BTz-X4wg", "Syed Hussaini"),
  },
  "acionador-manual-alarme-vermelho": {
    file: "acionador-manual-alarme-vermelho", w: 1600, h: 1067,
    alt: "Acionador manual de alarme de incêndio vermelho, com o pictograma de fogo",
    ...unsplash("YfDOeb52PRA", "Zonduurzaam Deventer"),
  },
  "detector-fumaca-teto": {
    file: "detector-fumaca-teto", w: 1600, h: 1067,
    alt: "Detector de fumaça branco fixado no teto de concreto (foto em preto e branco)",
    ...unsplash("2uyCMNGYhnM", "Yosuke Ota"),
  },
  "receptor-gnss-tripe-obra-guindaste": {
    file: "receptor-gnss-tripe-obra-guindaste", w: 1600, h: 1200,
    alt: "Receptor GNSS sobre um tripé, com uma obra e um guindaste desfocados ao fundo",
    ...unsplash("OO4laKg2HS0", "Valerie V"),
  },
  "receptor-gnss-sobre-tripe-gramado": {
    file: "receptor-gnss-sobre-tripe-gramado", w: 1600, h: 1067,
    alt: "Receptor GNSS sobre um tripé em um campo gramado, com mata ao fundo",
    ...unsplash("zSrksQgp4W0", "Valerie V"),
  },
  "receptor-gnss-rtk-floresta": {
    file: "receptor-gnss-rtk-floresta", w: 1600, h: 1067,
    alt: "Receptor GNSS RTK preso a um bastão, em primeiro plano, com floresta desfocada ao fundo",
    ...unsplash("ReMVJ5gCTi0", "Valerie V"),
  },
  "estacao-total-tripe-amarelo-campo": {
    file: "estacao-total-tripe-amarelo-campo", w: 1600, h: 1067,
    alt: "Estação total em um tripé amarelo, em campo aberto, com ruínas de pedra ao fundo",
    ...unsplash("-tcGBtU7O6Q", "Dave Meckler"),
  },
  "drone-multirotor-camera": {
    file: "drone-multirotor-camera", w: 1600, h: 1200,
    alt: "Drone multirotor branco com câmera, em voo, com montanhas desfocadas ao fundo",
    ...unsplash("duNHkmSkW6M", "Jared Brashier"),
  },
  "estacao-total-amarela-campo": {
    file: "estacao-total-amarela-campo", w: 1600, h: 1070,
    alt: "Estação total amarela montada em um tripé, em campo, com árvores ao fundo",
    ...unsplash("MK2ZSaI0W2k", "Nasim Uddin"),
  },
  "nivel-laser-linha-verde": {
    file: "nivel-laser-linha-verde", w: 1600, h: 1067,
    alt: "Nível a laser projetando uma linha verde horizontal em uma parede com perfis metálicos",
    ...unsplash("vQtHGJ2ekVE", "Thanh Nguyen"),
  },
  "trena-aco-5-metros": {
    file: "trena-aco-5-metros", w: 1600, h: 1200,
    alt: "Trena de aço de 5 metros, com a fita estendida, sobre fundo branco",
    ...unsplash("M779tNeoSKc", "William Warby"),
  },
  "nivel-bolha-trena-ferramentas": {
    file: "nivel-bolha-trena-ferramentas", w: 1600, h: 1067,
    alt: "Nível de bolha azul e amarelo de 600 mm, trena e outras ferramentas de bancada sobre madeira",
    ...unsplash("WiHrohmLYL8", "Jametlene Reskp"),
  },
};
