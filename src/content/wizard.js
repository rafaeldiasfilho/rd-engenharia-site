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

export const RESULTS = {
  pgr: { name: "PGR (Programa de Gerenciamento de Riscos)", area: "seguranca-do-trabalho", text: "Exigido, em regra, de empresas com empregados." },
  ltcat: { name: "LTCAT e PPP", area: "seguranca-do-trabalho", text: "Documenta os agentes nocivos e serve de base para a aposentadoria especial." },
  unhealthinessReport: { name: "Laudo de insalubridade", area: "seguranca-do-trabalho", text: "Avalia se há direito ao adicional por exposição a agentes nocivos." },
  hazardReport: { name: "Laudo de periculosidade", area: "seguranca-do-trabalho", text: "Avalia atividades de risco acentuado, como inflamáveis e eletricidade." },
  nrTrainings: { name: "Treinamentos de NRs", area: "seguranca-do-trabalho", text: "Capacitações como NR-35, NR-10 e NR-33, conforme a atividade." },
  fireLicense: { name: "AVCB ou CLCB (Corpo de Bombeiros)", area: "corpo-de-bombeiros", text: "Verificamos qual licença se aplica ao seu imóvel." },
  municipalPermit: { name: "Alvará e documentação na prefeitura", area: "engenharia-civil", text: "Alvará de construção ou de funcionamento, conforme o caso." },
  wastePlan: { name: "Plano de gerenciamento de resíduos (PGRS/PGRSS)", area: "meio-ambiente-topografia", text: "Comprova o destino correto dos resíduos gerados." },
  georeferencing: { name: "Georreferenciamento do imóvel rural", area: "meio-ambiente-topografia", text: "Em regra, exigido para desmembrar ou transferir imóvel rural." },
  car: { name: "CAR (Cadastro Ambiental Rural)", area: "meio-ambiente-topografia", text: "Cadastro obrigatório dos imóveis rurais." },
  waterUseGrant: { name: "Outorga de uso da água", area: "meio-ambiente-topografia", text: "Pode ser necessária para captar água de poço, represa ou rio." },
  topographicSurvey: { name: "Levantamento topográfico", area: "meio-ambiente-topografia", text: "Medidas, relevo e divisão do terreno." },
  environmentalLicense: { name: "Licenciamento ambiental", area: "meio-ambiente-topografia", text: "Indicamos qual licença ou dispensa se aplica à atividade." },
  buildingDesign: { name: "Projetos e ART", area: "engenharia-civil", text: "Projeto arquitetônico, estrutural e acompanhamento da obra." },
  buildingRegularization: { name: "Regularização de obra (as-built e habite-se)", area: "engenharia-civil", text: "Levantamento do construído e documentação na prefeitura." },
  technicalReports: { name: "Laudo de vistoria ou avaliação de imóvel", area: "engenharia-civil", text: "Parecer técnico formal para venda, financiamento ou seguro." },
  buildingInspection: { name: "Inspeção predial e laudo de patologias", area: "engenharia-civil", text: "Diagnóstico de trincas, infiltrações e problemas estruturais." },
};
