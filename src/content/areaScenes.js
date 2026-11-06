// 3D block on each area page: label, title and text describe the illustration (not a real job or client).
// "scene" is the key of the three.js scene in src/Scene3D.jsx.
export const AREA_SCENES = {
  "meio-ambiente-topografia": {
    scene: "terrain",
    label: "Do campo à planta",
    title: "O terreno medido vira curvas de nível.",
    text: "No levantamento, cada ponto medido em campo ganha coordenadas e altitude. Com eles desenhamos as curvas de nível, a planta e o memorial que o seu processo pede.",
    alt: "Ilustração em 3D de um terreno com curvas de nível e pontos levantados",
  },
  "engenharia-civil": {
    scene: "house",
    label: "Do projeto à obra",
    title: "Cada etapa resolvida antes de começar.",
    text: "No projeto, a casa é pensada etapa por etapa: fundação, paredes, aberturas e telhado. Assim a obra começa com as dúvidas respondidas no papel.",
    alt: "Ilustração em 3D de uma casa térrea sendo construída por etapas: contrapiso, paredes, janelas e porta, telhado",
  },
  "corpo-de-bombeiros": {
    scene: "escapeRoute",
    label: "Rota de fuga",
    title: "De qualquer sala até a saída.",
    text: "No projeto de prevenção, cada ambiente tem rota de fuga, sinalização, iluminação de emergência e extintores no lugar certo. É isso que o Corpo de Bombeiros confere na vistoria.",
    alt: "Ilustração em 3D da planta de um pavimento com as rotas de fuga se acendendo até a saída e os extintores marcados",
  },
  "seguranca-do-trabalho": {
    scene: "hardHat",
    label: "Proteção no trabalho",
    title: "A proteção certa para cada risco.",
    text: "No PGR levantamos os riscos de cada função e indicamos as medidas: primeiro as proteções coletivas, depois os EPIs que ainda forem necessários.",
    alt: "Ilustração em 3D de um capacete de segurança girando, cercado por anéis de proteção",
  },
};
