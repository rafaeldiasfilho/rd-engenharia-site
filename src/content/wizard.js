// Rules of the /o-que-preciso wizard: profiles, yes/no situations and the documents each one suggests.

// "O que preciso?" (what do I need?) guide: each situation points to the likely documents/services.
export const PROFILES = [
  {
    id: "business",
    name: "Tenho uma empresa ou comércio",
    icon: "fa-solid fa-shop",
    situations: [
      { text: "Tenho funcionários registrados", items: ["pgr"] },
      { text: "Meus funcionários lidam com ruído, calor, poeira ou produtos químicos", items: ["ltcat", "unhealthinessReport"] },
      { text: "Trabalham com inflamáveis, eletricidade ou explosivos", items: ["hazardReport"] },
      { text: "Meu estabelecimento não tem AVCB/CLCB ou a licença está vencida", items: ["fireLicense"] },
      { text: "Vou abrir ou regularizar a empresa e preciso de alvará", items: ["municipalPermit", "fireLicense"] },
      { text: "Minha equipe trabalha em altura, com eletricidade ou em espaço confinado", items: ["nrTrainings"] },
      { text: "Gero resíduos (clínica, indústria, oficina, obra)", items: ["wastePlan"] },
    ],
  },
  {
    id: "rural",
    name: "Tenho um imóvel rural",
    icon: "fa-solid fa-tractor",
    situations: [
      { text: "Vou vender, dividir ou desmembrar a propriedade", items: ["georeferencing"] },
      { text: "Nunca fiz o CAR (Cadastro Ambiental Rural)", items: ["car"] },
      { text: "Uso água de poço, represa ou rio na propriedade", items: ["waterUseGrant"] },
      { text: "Preciso de planta, medição ou divisão de áreas", items: ["topographicSurvey"] },
      { text: "Minha atividade pode exigir licença ambiental", items: ["environmentalLicense"] },
    ],
  },
  {
    id: "urbanProperty",
    name: "Tenho obra ou imóvel urbano",
    icon: "fa-solid fa-house",
    situations: [
      { text: "Vou construir, ampliar ou reformar", items: ["buildingDesign", "municipalPermit"] },
      { text: "Construí sem projeto aprovado ou sem habite-se", items: ["buildingRegularization"] },
      { text: "Preciso de laudo para vender, financiar ou fazer seguro do imóvel", items: ["technicalReports"] },
      { text: "Vejo trincas, infiltração ou problemas na estrutura", items: ["buildingInspection"] },
      { text: "Preciso de levantamento ou medidas do terreno", items: ["topographicSurvey"] },
      { text: "Meu imóvel comercial precisa de licença do Corpo de Bombeiros", items: ["fireLicense"] },
    ],
  },
];

// area: slug of the area page. service: anchor id of the matching service card on that page, the same
// id that serviceAnchorId(item.name) gives in src/searchIndex.js (checked by tests/wizardResult.test.js).
export const RESULTS = {
  pgr: { name: "PGR (Programa de Gerenciamento de Riscos)", area: "seguranca-do-trabalho", service: "servico-pgr-programa-de-gerenciamento-de-riscos", text: "Exigido, em regra, de empresas com empregados." },
  ltcat: { name: "LTCAT e PPP", area: "seguranca-do-trabalho", service: "servico-ltcat-e-ppp", text: "Documenta os agentes nocivos e serve de base para a aposentadoria especial." },
  unhealthinessReport: { name: "Laudo de insalubridade", area: "seguranca-do-trabalho", service: "servico-laudo-de-insalubridade-nr-15-e-de-periculosidade", text: "Avalia se há direito ao adicional por exposição a agentes nocivos." },
  hazardReport: { name: "Laudo de periculosidade", area: "seguranca-do-trabalho", service: "servico-laudo-de-insalubridade-nr-15-e-de-periculosidade", text: "Avalia atividades de risco acentuado, como inflamáveis e eletricidade." },
  nrTrainings: { name: "Treinamentos de NRs", area: "seguranca-do-trabalho", service: "servico-treinamentos-de-nrs", text: "Capacitações como NR-35, NR-10 e NR-33, conforme a atividade." },
  fireLicense: { name: "AVCB ou CLCB (Corpo de Bombeiros)", area: "corpo-de-bombeiros", service: "servico-avcb-auto-de-vistoria-do-corpo-de-bombeiros", text: "Verificamos qual licença se aplica ao seu imóvel." },
  municipalPermit: { name: "Alvará e documentação na prefeitura", area: "engenharia-civil", service: "servico-regularizacao-de-obra-e-habite-se", text: "Alvará de construção ou de funcionamento, conforme o caso." },
  wastePlan: { name: "Plano de gerenciamento de resíduos (PGRS/PGRSS)", area: "meio-ambiente-topografia", service: "servico-gestao-de-residuos-e-gestao-ambiental", text: "Comprova o destino correto dos resíduos gerados." },
  georeferencing: { name: "Georreferenciamento do imóvel rural", area: "meio-ambiente-topografia", service: "servico-georreferenciamento-de-imovel-rural", text: "Em regra, exigido para desmembrar ou transferir imóvel rural." },
  car: { name: "CAR (Cadastro Ambiental Rural)", area: "meio-ambiente-topografia", service: "servico-car-cadastro-ambiental-rural", text: "Cadastro obrigatório dos imóveis rurais." },
  waterUseGrant: { name: "Outorga de uso da água", area: "meio-ambiente-topografia", service: "servico-licenciamento-ambiental-e-outorga", text: "Pode ser necessária para captar água de poço, represa ou rio." },
  topographicSurvey: { name: "Levantamento topográfico", area: "meio-ambiente-topografia", service: "servico-topografia", text: "Medidas, relevo e divisão do terreno." },
  environmentalLicense: { name: "Licenciamento ambiental", area: "meio-ambiente-topografia", service: "servico-licenciamento-ambiental-e-outorga", text: "Indicamos qual licença ou dispensa se aplica à atividade." },
  buildingDesign: { name: "Projetos e ART", area: "engenharia-civil", service: "servico-projetos-arquitetonicos-estruturais-e-complement", text: "Projeto arquitetônico, estrutural e acompanhamento da obra." },
  buildingRegularization: { name: "Regularização de obra (as-built e habite-se)", area: "engenharia-civil", service: "servico-regularizacao-de-obra-e-habite-se", text: "Levantamento do construído e documentação na prefeitura." },
  technicalReports: { name: "Laudo de vistoria ou avaliação de imóvel", area: "engenharia-civil", service: "servico-laudos-e-pericias", text: "Parecer técnico formal para venda, financiamento ou seguro." },
  buildingInspection: { name: "Inspeção predial e laudo de patologias", area: "engenharia-civil", service: "servico-inspecao-predial-e-laudos-de-patologias", text: "Diagnóstico de trincas, infiltrações e problemas estruturais." },
};

// Secondary option of the first screen ("Alguém me pediu um documento e não sei qual é"): opens WhatsApp
// with this message instead of the questions.
export const WIZARD_UNKNOWN_DOCUMENT_MESSAGE = [
  "Olá! Vim pelo passo a passo do site.",
  "Me pediram um documento e não sei qual é.",
  "Posso mandar a foto do pedido?",
].join("\n");
