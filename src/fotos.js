// Mapa de fotos do site. Para trocar uma foto, edite só este arquivo (e coloque o .webp em
// public/fotos/otim/). Todas as fotos são de terceiros (Wikimedia Commons CC0 e Unsplash License)
// e NÃO são trabalhos da RD Engenharia. Cada uma aparece com a legenda "Imagem ilustrativa".
// A página /creditos é gerada daqui e lista só as fotos que estão em uso.
// Unsplash License NÃO é CC0: nunca rotular como CC0. Autores do Unsplash lidos na página de cada foto em 20/10/2026.

const COMMONS = "https://commons.wikimedia.org/wiki/File:";
const UNSPLASH_LICENCA = "https://unsplash.com/license";

const unsplash = (id, autor) => ({
  autor,
  licenca: "Unsplash License",
  licencaUrl: UNSPLASH_LICENCA,
  fonte: `https://unsplash.com/photos/${id}`,
  fonteNome: "Unsplash",
});

const commons = (arquivo, autor, licenca = "CC0") => ({
  licenca,
  autor,
  arquivo,
  fonte: COMMONS + encodeURIComponent(arquivo.replace(/ /g, "_")).replace(/%2C/g, ","),
  fonteNome: "Wikimedia Commons",
});

// Cada foto tem um arquivo único em public/fotos/otim/<arq>.webp.
export const FOTOS = {
  "capacete-vermelho-epi": {
    arq: "capacete-vermelho-epi", w: 1600, h: 900,
    alt: "Capacete de segurança vermelho sobre o asfalto, com uma obra desfocada ao fundo",
    ...unsplash("9OB46apMbC4", "Ümit Yıldırım"),
  },
  "trabalhador-altura-cinto-seguranca": {
    arq: "trabalhador-altura-cinto-seguranca", w: 1600, h: 1008,
    alt: "Trabalhador em viga metálica com cinto de segurança e talabarte, de capacete com viseira",
    ...unsplash("niSnhfMjiMI", "Jeriden Villegas"),
  },
  "capacetes-amarelos-epi": {
    arq: "capacetes-amarelos-epi", w: 1600, h: 1067,
    alt: "Quatro capacetes de segurança amarelos sobre um piso de madeira escura",
    ...unsplash("YSxcf6C_SEg", "Silvia Brazzoduro"),
  },
  "extintor-parede-concreto-pictograma": {
    arq: "extintor-parede-concreto-pictograma", w: 1600, h: 1067,
    alt: "Extintor de incêndio vermelho fixado em parede de concreto, com a placa de sinalização de extintor acima",
    ...unsplash("GCmVg5lztwI", "Jakub Żerdzicki"),
  },
  "sirene-alarme-incendio-teto": {
    arq: "sirene-alarme-incendio-teto", w: 1600, h: 1065,
    alt: "Sirene e luz de alarme de incêndio fixadas no forro de um ambiente interno",
    ...unsplash("Ea4OPjLDt5k", "Etienne Girardet"),
  },
  "luminaria-saida-emergencia-verde": {
    arq: "luminaria-saida-emergencia-verde", w: 1600, h: 1201,
    alt: "Luminária de saída de emergência verde, com figura em movimento e seta, em parede escura",
    ...unsplash("SKrgZQgYy2g", "Andrew Teoh"),
  },
  "tubulacao-sprinklers-teto-estacionamento": {
    arq: "tubulacao-sprinklers-teto-estacionamento", w: 1600, h: 1067,
    alt: "Tubulação vermelha de combate a incêndio com chuveiros automáticos no teto de concreto de um estacionamento",
    ...unsplash("YkPY2Awkra8", "Valentin Lacoste"),
  },
  "tubulacao-incendio-teto-vermelha": {
    arq: "tubulacao-incendio-teto-vermelha", w: 1600, h: 1200,
    alt: "Tubulação vermelha de incêndio e eletrodutos no teto de concreto de uma edificação",
    ...unsplash("eENezYdWSIg", "Nopparuj Lamaikul"),
  },
  "escada-saida-emergencia-sinalizada": {
    arq: "escada-saida-emergencia-sinalizada", w: 1600, h: 901,
    alt: "Escada interna ao lado de uma porta de saída de emergência com a placa verde iluminada acima dela",
    ...commons("Stair Corner with Emergency Exit.jpg", "诺尔0"),
  },
  "sobrado-alvenaria-em-obra": {
    arq: "sobrado-alvenaria-em-obra", w: 1600, h: 1204,
    alt: "Sobrado de tijolos com telhado de telhas em construção, com andaime de madeira e areia na frente",
    ...unsplash("VggmWsUgA10", "Divaris Shirichena"),
  },
  "casa-alvenaria-tijolo-telhado-metalico": {
    arq: "casa-alvenaria-tijolo-telhado-metalico", w: 1600, h: 767,
    alt: "Casa de tijolos aparentes em construção, já com a estrutura e o telhado metálico, sob céu azul",
    ...unsplash("zizZk3AMhpI", "Divaris Shirichena"),
  },
  "edificio-estrutura-concreto-pavimentos": {
    arq: "edificio-estrutura-concreto-pavimentos", w: 1600, h: 1009,
    alt: "Edifício de vários pavimentos com estrutura de concreto e escoramento, em construção, sob céu azul",
    ...unsplash("PlBsJ5MybGc", "Tolu Olubode"),
  },
  "obra-alvenaria-guindaste": {
    arq: "obra-alvenaria-guindaste", w: 1600, h: 1200,
    alt: "Edifício residencial de alvenaria com andaimes e guindaste de torre em obra",
    ...commons("Construction site Daumstraße north 2019-10-29 10.jpg", "Leonhard Lenz"),
  },
  "estacao-total-prisma-tripes": {
    arq: "estacao-total-prisma-tripes", w: 1600, h: 1200,
    alt: "Estação total e prisma topográficos sobre tripés amarelos, ao lado de cones de sinalização",
    ...commons("Surveying prism and total station, for land surveying, in Shibuya-ku.jpg", "Syced"),
  },
  "rio-mata-vista-aerea": {
    arq: "rio-mata-vista-aerea", w: 1300, h: 867,
    alt: "Vista aérea de um rio de águas azul-turquesa entre mata densa e rochas",
    ...unsplash("Zj9bdiD4wno", "Christian Thöni"),
  },
  "dosimetro-ruido-calibrador-acustico": {
    arq: "dosimetro-ruido-calibrador-acustico", w: 1600, h: 1200,
    alt: "Dosímetro de ruído classe 2 e calibrador de microfone, lado a lado sobre uma superfície cinza",
    ...commons("Noise Dosimeters 02.jpg", "Chuck Kardous (NIOSH)", "Domínio público"),
  },
  "medidor-nivel-sonoro-com-celular": {
    arq: "medidor-nivel-sonoro-com-celular", w: 1600, h: 1060,
    alt: "Calibrador acústico ligado a um smartphone que mostra um medidor de nível sonoro, sobre uma mesa de madeira",
    ...commons("NIOSHSLM Calibration.jpg", "Chuck Kardous (NIOSH)", "Domínio público"),
  },
  "medidor-nivel-sonoro-portatil": {
    arq: "medidor-nivel-sonoro-portatil", w: 1600, h: 1200,
    alt: "Medidor de nível sonoro portátil segurado com uma das mãos, com um caminhão ao fundo",
    ...commons("TrasportationNoiseMeasurement.jpg", "Chuck Kardous (NIOSH)", "Domínio público"),
  },
  "extintor-em-caixa-com-sinalizacao": {
    arq: "extintor-em-caixa-com-sinalizacao", w: 1600, h: 1067,
    alt: "Extintor dentro de um abrigo vermelho de parede, com a placa de sinalização de extintor ao lado",
    ...unsplash("9eHynv5JG9o", "Jacob Mejicanos"),
  },
  "abrigo-mangueira-incendio-vermelho": {
    arq: "abrigo-mangueira-incendio-vermelho", w: 1600, h: 1067,
    alt: "Abrigo plástico vermelho de mangueira de incêndio em parede branca",
    ...unsplash("lPh_joRZA6A", "Pix Tresa"),
  },
  "caixa-mangueira-e-registro-recalque": {
    arq: "caixa-mangueira-e-registro-recalque", w: 1600, h: 1200,
    alt: "Caixa de mangueira de incêndio e válvula de registro na parede",
    ...unsplash("jv1BTz-X4wg", "Syed Hussaini"),
  },
  "acionador-manual-alarme-vermelho": {
    arq: "acionador-manual-alarme-vermelho", w: 1600, h: 1067,
    alt: "Acionador manual de alarme de incêndio vermelho, com o pictograma de fogo",
    ...unsplash("YfDOeb52PRA", "Zonduurzaam Deventer"),
  },
  "detector-fumaca-teto": {
    arq: "detector-fumaca-teto", w: 1600, h: 1067,
    alt: "Detector de fumaça branco fixado no teto de concreto (foto em preto e branco)",
    ...unsplash("2uyCMNGYhnM", "Yosuke Ota"),
  },
  "receptor-gnss-tripe-obra-guindaste": {
    arq: "receptor-gnss-tripe-obra-guindaste", w: 1600, h: 1200,
    alt: "Receptor GNSS sobre um tripé, com uma obra e um guindaste desfocados ao fundo",
    ...unsplash("OO4laKg2HS0", "Valerie V"),
  },
  "receptor-gnss-sobre-tripe-gramado": {
    arq: "receptor-gnss-sobre-tripe-gramado", w: 1600, h: 1067,
    alt: "Receptor GNSS sobre um tripé em um campo gramado, com mata ao fundo",
    ...unsplash("zSrksQgp4W0", "Valerie V"),
  },
  "receptor-gnss-rtk-floresta": {
    arq: "receptor-gnss-rtk-floresta", w: 1600, h: 1067,
    alt: "Receptor GNSS RTK preso a um bastão, em primeiro plano, com floresta desfocada ao fundo",
    ...unsplash("ReMVJ5gCTi0", "Valerie V"),
  },
  "estacao-total-tripe-amarelo-campo": {
    arq: "estacao-total-tripe-amarelo-campo", w: 1600, h: 1067,
    alt: "Estação total em um tripé amarelo, em campo aberto, com ruínas de pedra ao fundo",
    ...unsplash("-tcGBtU7O6Q", "Dave Meckler"),
  },
  "drone-multirotor-camera": {
    arq: "drone-multirotor-camera", w: 1600, h: 1200,
    alt: "Drone multirotor branco com câmera, em voo, com montanhas desfocadas ao fundo",
    ...unsplash("duNHkmSkW6M", "Jared Brashier"),
  },
  "estacao-total-amarela-campo": {
    arq: "estacao-total-amarela-campo", w: 1600, h: 1070,
    alt: "Estação total amarela montada em um tripé, em campo, com árvores ao fundo",
    ...unsplash("MK2ZSaI0W2k", "Nasim Uddin"),
  },
  "nivel-laser-linha-verde": {
    arq: "nivel-laser-linha-verde", w: 1600, h: 1067,
    alt: "Nível a laser projetando uma linha verde horizontal em uma parede com perfis metálicos",
    ...unsplash("vQtHGJ2ekVE", "Thanh Nguyen"),
  },
  "trena-aco-5-metros": {
    arq: "trena-aco-5-metros", w: 1600, h: 1200,
    alt: "Trena de aço de 5 metros, com a fita estendida, sobre fundo branco",
    ...unsplash("M779tNeoSKc", "William Warby"),
  },
  "nivel-bolha-trena-ferramentas": {
    arq: "nivel-bolha-trena-ferramentas", w: 1600, h: 1067,
    alt: "Nível de bolha azul e amarelo de 600 mm, trena e outras ferramentas de bancada sobre madeira",
    ...unsplash("WiHrohmLYL8", "Jametlene Reskp"),
  },
};

// Slot (lugar do site) -> foto única. Valor null = sem foto.
export const SLOTS = {};

// Carrosséis: chave = lugar do site; cada slide aponta para uma foto de FOTOS, com legenda curta e,
// opcionalmente, link para a página da área. Um carrossel sem fotos não aparece na página.
// "equip-*": só equipamento GENÉRICO de referência (nunca o inventário da RD) e só quando há 3 ou mais
// fotos que combinam de verdade com a lista da página (marcas visíveis são permitidas aqui; pessoas não).
export const CARROSSEIS = {
  home: [
    { foto: "capacete-vermelho-epi", legenda: "Segurança do trabalho", href: "/seguranca-do-trabalho" },
    { foto: "extintor-parede-concreto-pictograma", legenda: "Corpo de Bombeiros", href: "/corpo-de-bombeiros" },
    { foto: "edificio-estrutura-concreto-pavimentos", legenda: "Engenharia civil", href: "/engenharia-civil" },
    { foto: "estacao-total-prisma-tripes", legenda: "Topografia e georreferenciamento", href: "/meio-ambiente-topografia" },
    { foto: "rio-mata-vista-aerea", legenda: "Meio ambiente", href: "/meio-ambiente-topografia" },
  ],
  "area-seguranca-do-trabalho": [
    { foto: "capacete-vermelho-epi", legenda: "Capacete: proteção da cabeça (EPI)" },
    { foto: "trabalhador-altura-cinto-seguranca", legenda: "Trabalho em altura, com cinto e talabarte" },
    { foto: "capacetes-amarelos-epi", legenda: "Capacetes de segurança" },
  ],
  "area-corpo-de-bombeiros": [
    { foto: "tubulacao-sprinklers-teto-estacionamento", legenda: "Rede de combate a incêndio com chuveiros automáticos" },
    { foto: "tubulacao-incendio-teto-vermelha", legenda: "Tubulação de incêndio em edificação" },
    { foto: "escada-saida-emergencia-sinalizada", legenda: "Rota de saída sinalizada" },
  ],
  "area-engenharia-civil": [
    { foto: "edificio-estrutura-concreto-pavimentos", legenda: "Estrutura de concreto em obra" },
    { foto: "obra-alvenaria-guindaste", legenda: "Obra de edifício em alvenaria" },
    { foto: "sobrado-alvenaria-em-obra", legenda: "Sobrado em construção" },
    { foto: "casa-alvenaria-tijolo-telhado-metalico", legenda: "Casa de tijolos com telhado metálico" },
  ],
  "area-meio-ambiente-topografia": [
    { foto: "estacao-total-prisma-tripes", legenda: "Estação total e prisma, usados em topografia" },
    { foto: "rio-mata-vista-aerea", legenda: "Rio e mata: o que a área ambiental protege" },
  ],
  "equip-seguranca-do-trabalho": [
    { foto: "dosimetro-ruido-calibrador-acustico", legenda: "Dosímetro de ruído e calibrador acústico" },
    { foto: "medidor-nivel-sonoro-portatil", legenda: "Medidor de nível sonoro (decibelímetro) portátil" },
    { foto: "medidor-nivel-sonoro-com-celular", legenda: "Calibrador acústico e medidor de nível sonoro no celular" },
  ],
  "equip-corpo-de-bombeiros": [
    { foto: "extintor-parede-concreto-pictograma", legenda: "Extintor de incêndio com a sinalização" },
    { foto: "extintor-em-caixa-com-sinalizacao", legenda: "Extintor em abrigo, com sinalização" },
    { foto: "abrigo-mangueira-incendio-vermelho", legenda: "Abrigo de mangueira de incêndio" },
    { foto: "caixa-mangueira-e-registro-recalque", legenda: "Caixa de mangueira e registro de recalque" },
    { foto: "acionador-manual-alarme-vermelho", legenda: "Acionador manual de alarme de incêndio" },
    { foto: "detector-fumaca-teto", legenda: "Detector de fumaça no teto" },
    { foto: "sirene-alarme-incendio-teto", legenda: "Sirene e luz de alarme de incêndio" },
    { foto: "luminaria-saida-emergencia-verde", legenda: "Luminária de saída de emergência" },
  ],
  "equip-engenharia-civil": [
    { foto: "estacao-total-amarela-campo", legenda: "Estação total, usada para medidas e alturas" },
    { foto: "nivel-laser-linha-verde", legenda: "Nível a laser de linha" },
    { foto: "trena-aco-5-metros", legenda: "Trena de aço" },
    { foto: "nivel-bolha-trena-ferramentas", legenda: "Nível de bolha e trena" },
  ],
  "equip-meio-ambiente-topografia": [
    { foto: "receptor-gnss-tripe-obra-guindaste", legenda: "Receptor GNSS (GPS de precisão) sobre tripé" },
    { foto: "receptor-gnss-sobre-tripe-gramado", legenda: "Receptor GNSS sobre tripé, em campo" },
    { foto: "receptor-gnss-rtk-floresta", legenda: "Receptor GNSS RTK em bastão" },
    { foto: "estacao-total-tripe-amarelo-campo", legenda: "Estação total em tripé" },
    { foto: "drone-multirotor-camera", legenda: "Drone com câmera (aeronave remotamente pilotada)" },
  ],
};

export const slidesDe = (chave) =>
  (CARROSSEIS[chave] || []).filter((s) => FOTOS[s.foto]).map((s) => ({ ...s, f: FOTOS[s.foto] }));

export const foto = (slot) => {
  const id = SLOTS[slot];
  return id ? FOTOS[id] || null : null;
};

export const caminho = (f) => `/fotos/otim/${f.arq}.webp`;

// Versões menores (480 e 960 px de largura, geradas ao lado do original em public/fotos/otim/<arq>-<w>.webp)
// para o navegador baixar só o tamanho que vai mostrar. Use junto com um "sizes" que diga a largura exibida.
export const srcset = (f) =>
  [...[480, 960].filter((w) => w < f.w).map((w) => `/fotos/otim/${f.arq}-${w}.webp ${w}w`), `${caminho(f)} ${f.w}w`].join(", ");

// Legenda curta com a licença correta de cada foto.
// Legenda curta por foto; a frase completa ("não são trabalhos da RD") fica uma vez na home e em /creditos.
export const aviso = (f) => `Imagem ilustrativa (${f.licenca}).`;

// Lista para a página de créditos: só as fotos em uso (slots e carrosséis), sem repetir.
const idsEmUso = new Set([
  ...Object.values(SLOTS).filter(Boolean),
  ...Object.values(CARROSSEIS).flatMap((l) => l.map((s) => s.foto)),
]);
export const FOTOS_EM_USO = [...idsEmUso].filter((id) => FOTOS[id]).map((id) => FOTOS[id]);
