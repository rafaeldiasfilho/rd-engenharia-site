// Rules of the /o-que-preciso wizard: profiles, yes/no situations and the documents each one suggests.

// "O que preciso?" (what do I need?) guide: each situation points to the likely documents/services.
export const PROFILES = [
  {
    id: "empresa",
    name: "Tenho uma empresa ou comércio",
    icon: "fa-solid fa-shop",
    situations: [
      { text: "Tenho funcionários registrados", items: ["pgr"] },
      { text: "Meus funcionários lidam com ruído, calor, poeira ou produtos químicos", items: ["ltcat", "insalubridade"] },
      { text: "Trabalham com inflamáveis, eletricidade ou explosivos", items: ["periculosidade"] },
      { text: "Meu estabelecimento não tem AVCB/CLCB ou a licença está vencida", items: ["bombeiros"] },
      { text: "Vou abrir ou regularizar a empresa e preciso de alvará", items: ["alvara", "bombeiros"] },
      { text: "Minha equipe trabalha em altura, com eletricidade ou em espaço confinado", items: ["treinamentos"] },
      { text: "Gero resíduos (clínica, indústria, oficina, obra)", items: ["residuos"] },
    ],
  },
  {
    id: "rural",
    name: "Tenho um imóvel rural",
    icon: "fa-solid fa-tractor",
    situations: [
      { text: "Vou vender, dividir ou desmembrar a propriedade", items: ["georref"] },
      { text: "Nunca fiz o CAR (Cadastro Ambiental Rural)", items: ["car"] },
      { text: "Uso água de poço, represa ou rio na propriedade", items: ["outorga"] },
      { text: "Preciso de planta, medição ou divisão de áreas", items: ["topografia"] },
      { text: "Minha atividade pode exigir licença ambiental", items: ["licenciamento"] },
    ],
  },
  {
    id: "urbano",
    name: "Tenho obra ou imóvel urbano",
    icon: "fa-solid fa-house",
    situations: [
      { text: "Vou construir, ampliar ou reformar", items: ["projetos", "alvara"] },
      { text: "Construí sem projeto aprovado ou sem habite-se", items: ["regularizacao"] },
      { text: "Preciso de laudo para vender, financiar ou fazer seguro do imóvel", items: ["laudos"] },
      { text: "Vejo trincas, infiltração ou problemas na estrutura", items: ["inspecao"] },
      { text: "Preciso de levantamento ou medidas do terreno", items: ["topografia"] },
      { text: "Meu imóvel comercial precisa de licença do Corpo de Bombeiros", items: ["bombeiros"] },
    ],
  },
];

export const RESULTS = {
  pgr: { name: "PGR (Programa de Gerenciamento de Riscos)", area: "seguranca-do-trabalho", text: "Exigido, em regra, de empresas com empregados." },
  ltcat: { name: "LTCAT e PPP", area: "seguranca-do-trabalho", text: "Documenta os agentes nocivos e serve de base para a aposentadoria especial." },
  insalubridade: { name: "Laudo de insalubridade", area: "seguranca-do-trabalho", text: "Avalia se há direito ao adicional por exposição a agentes nocivos." },
  periculosidade: { name: "Laudo de periculosidade", area: "seguranca-do-trabalho", text: "Avalia atividades de risco acentuado, como inflamáveis e eletricidade." },
  treinamentos: { name: "Treinamentos de NRs", area: "seguranca-do-trabalho", text: "Capacitações como NR-35, NR-10 e NR-33, conforme a atividade." },
  bombeiros: { name: "AVCB ou CLCB (Corpo de Bombeiros)", area: "corpo-de-bombeiros", text: "Verificamos qual licença se aplica ao seu imóvel." },
  alvara: { name: "Alvará e documentação na prefeitura", area: "engenharia-civil", text: "Alvará de construção ou de funcionamento, conforme o caso." },
  residuos: { name: "Plano de gerenciamento de resíduos (PGRS/PGRSS)", area: "meio-ambiente-topografia", text: "Comprova o destino correto dos resíduos gerados." },
  georref: { name: "Georreferenciamento do imóvel rural", area: "meio-ambiente-topografia", text: "Em regra, exigido para desmembrar ou transferir imóvel rural." },
  car: { name: "CAR (Cadastro Ambiental Rural)", area: "meio-ambiente-topografia", text: "Cadastro obrigatório dos imóveis rurais." },
  outorga: { name: "Outorga de uso da água", area: "meio-ambiente-topografia", text: "Pode ser necessária para captar água de poço, represa ou rio." },
  topografia: { name: "Levantamento topográfico", area: "meio-ambiente-topografia", text: "Medidas, relevo e divisão do terreno." },
  licenciamento: { name: "Licenciamento ambiental", area: "meio-ambiente-topografia", text: "Indicamos qual licença ou dispensa se aplica à atividade." },
  projetos: { name: "Projetos e ART", area: "engenharia-civil", text: "Projeto arquitetônico, estrutural e acompanhamento da obra." },
  regularizacao: { name: "Regularização de obra (as-built e habite-se)", area: "engenharia-civil", text: "Levantamento do construído e documentação na prefeitura." },
  laudos: { name: "Laudo de vistoria ou avaliação de imóvel", area: "engenharia-civil", text: "Parecer técnico formal para venda, financiamento ou seguro." },
  inspecao: { name: "Inspeção predial e laudo de patologias", area: "engenharia-civil", text: "Diagnóstico de trincas, infiltrações e problemas estruturais." },
};
