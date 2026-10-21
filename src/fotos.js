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

const commons = (arquivo, autor) => ({
  licenca: "CC0",
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
  "luminaria-emergencia-corredor": {
    arq: "luminaria-emergencia-corredor", w: 1600, h: 1200,
    alt: "Luminária de emergência com pictograma de saída verde, instalada em viga de um corredor",
    ...unsplash("J2094d0y5Xc", "Haberdoedas"),
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
  "notebook-mesa-ao-ar-livre": {
    arq: "notebook-mesa-ao-ar-livre", w: 1600, h: 1067,
    alt: "Notebook e caderno sobre uma mesa ao ar livre, em área arborizada",
    ...unsplash("Ul_En6LL8Sc", "An Shved"),
  },
};

// Slot (lugar do site) -> foto única. Valor null = sem foto.
export const SLOTS = {
  "onde-atendemos": "notebook-mesa-ao-ar-livre",
};

// Carrosséis: chave = lugar do site; cada slide aponta para uma foto de FOTOS, com legenda curta e,
// opcionalmente, link para a página da área. Um carrossel sem fotos não aparece na página.
// "equip-*": só equipamento GENÉRICO de referência (nunca o inventário da RD) e só quando há 3 ou mais
// fotos que combinam de verdade com a lista da página. Faltam fotos para segurança do trabalho, civil e
// topografia, então esses carrosséis ficam ocultos.
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
  "equip-corpo-de-bombeiros": [
    { foto: "extintor-parede-concreto-pictograma", legenda: "Extintor de incêndio com a sinalização" },
    { foto: "sirene-alarme-incendio-teto", legenda: "Sirene e luz de alarme de incêndio" },
    { foto: "luminaria-saida-emergencia-verde", legenda: "Luminária de saída de emergência" },
    { foto: "luminaria-emergencia-corredor", legenda: "Iluminação de emergência em corredor" },
  ],
};

export const slidesDe = (chave) =>
  (CARROSSEIS[chave] || []).filter((s) => FOTOS[s.foto]).map((s) => ({ ...s, f: FOTOS[s.foto] }));

export const foto = (slot) => {
  const id = SLOTS[slot];
  return id ? FOTOS[id] || null : null;
};

export const caminho = (f) => `/fotos/otim/${f.arq}.webp`;

// Legenda curta com a licença correta de cada foto.
export const aviso = (f) => `Imagem ilustrativa (${f.licenca}), não é um trabalho da RD.`;

// Lista para a página de créditos: só as fotos em uso (slots e carrosséis), sem repetir.
const idsEmUso = new Set([
  ...Object.values(SLOTS).filter(Boolean),
  ...Object.values(CARROSSEIS).flatMap((l) => l.map((s) => s.foto)),
]);
export const FOTOS_EM_USO = [...idsEmUso].filter((id) => FOTOS[id]).map((id) => FOTOS[id]);
