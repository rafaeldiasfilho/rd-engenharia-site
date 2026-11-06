// Area page content: Meio Ambiente, Topografia e Imóvel Rural (/meio-ambiente-topografia).

export const ENVIRONMENT_AND_SURVEY_AREA = {
  type: "area",
  slug: "meio-ambiente-topografia",
  situations: ["Vou vender ou dividir o imóvel rural e preciso de georreferenciamento.","Nunca fiz o CAR da propriedade.","Uso água de poço, represa ou rio e quero saber se preciso de outorga.","Preciso de planta ou das medidas do terreno antes de construir ou dividir."],
  name: "Meio Ambiente, Topografia e Imóvel Rural",
  label: "Meio Ambiente e Topografia",
  subject: "imóvel rural e topografia",
  icon: "fa-solid fa-leaf",
  shortText: "CAR, licenciamento, outorga, resíduos, topografia e georreferenciamento.",
  title: "CAR, Georreferenciamento e Topografia | RD Engenharia",
  description:
    "CAR, georreferenciamento de imóvel rural, topografia, licenciamento ambiental, outorga e gestão de resíduos em Ibirá e região.",
  h1: "Meio ambiente, topografia e imóvel rural",
  intro:
    "Regularização ambiental, levantamentos de terreno e documentação de propriedades rurais e urbanas. Unimos a parte ambiental e a topografia para resolver o processo de ponta a ponta.",
  items: [
    {
      name: "CAR — Cadastro Ambiental Rural",
      example: {"title":"CAR","subtitle":"Cadastro ambiental rural","body":"car","layout":"prancha","doc":"Mapa do Imóvel para o CAR","ref":"APP e reserva legal","scale":"1:5.000"},
      text:
        "Cadastro eletrônico obrigatório dos imóveis rurais, previsto no Código Florestal, que reúne as informações ambientais da propriedade e é base para a regularização ambiental.",
      who: "Proprietários e possuidores de imóveis rurais.",
    },
    {
      name: "Georreferenciamento de imóvel rural",
      example: {"title":"MEMORIAL","subtitle":"Georreferenciamento do imóvel","body":"terreno","art":true,"layout":"prancha","doc":"Planta do Imóvel Georreferenciado","ref":"Vértices e confrontações","scale":"1:5.000"},
      text:
        "Levantamento que define os limites do imóvel com coordenadas oficiais e é certificado junto ao INCRA, exigido em situações como desmembramento e transferência de propriedade.",
      who: "Quem vai vender, dividir ou regularizar um imóvel rural.",
    },
    {
      name: "Topografia",
      example: {"title":"LEVANTAMENTO","subtitle":"Planta e curvas de nível","body":"curvas","art":true,"layout":"prancha","doc":"Levantamento Planialtimétrico","ref":"Curvas de nível","scale":"1:1.000"},
      text:
        "Levantamento planialtimétrico, locação de obras, divisão de glebas, planta cadastral, curvas de nível e cálculo de volume.",
      who: "Quem vai construir, dividir um terreno ou precisa conhecer as medidas e o relevo da área.",
    },
    {
      name: "Licenciamento ambiental e outorga",
      example: {"title":"LICENÇA","subtitle":"Licenciamento e outorga","body":"fluxo","layout":"capa","doc":"Licenciamento Ambiental e Outorga","ref":"Acompanhamento do processo","client":"empresa","contents":["Atividade e enquadramento","Documentos exigidos","Andamento do processo"]},
      text:
        "Orientação e condução de licenças (prévia, de instalação e de operação) e da outorga de uso da água, conforme a atividade e o órgão responsável.",
      who: "Empreendimentos e atividades que impactam o meio ambiente ou usam recursos hídricos.",
    },
    {
      name: "Gestão de resíduos e gestão ambiental",
      example: {"title":"PGRS","subtitle":"Plano de gestão de resíduos","body":"residuos","layout":"capa","doc":"Plano de Gerenciamento de Resíduos Sólidos","ref":"PGRS","client":"empresa","contents":["Resíduos gerados","Acondicionamento e destino","Responsáveis e registros"]},
      text:
        "PGRS e PGRSS, inventário e manifesto de resíduos e planos de ação ambiental para empresas, clínicas, indústrias e propriedades.",
      who: "Empresas que geram resíduos e precisam comprovar o destino correto.",
    },
  ],
  documents: [
    "Matrícula ou escritura do imóvel e dados do proprietário",
    "Localização da propriedade (município, estrada, coordenadas, se tiver)",
    "CCIR e ITR, no caso de imóvel rural",
    "Mapas, plantas ou levantamentos anteriores, se existirem",
    "Finalidade: venda, divisão, financiamento, obra ou licença",
  ],
  faq: [
    {
      q: "O CAR é obrigatório para todo imóvel rural?",
      a: "Sim, o CAR é obrigatório para os imóveis rurais, conforme o Código Florestal (Lei 12.651/2012). Fazemos o cadastro e analisamos a situação ambiental da propriedade.",
    },
    {
      q: "Vou vender um pedaço da fazenda. Preciso de georreferenciamento?",
      a: "Em regra, sim. Desmembramento e transferência de imóveis rurais exigem georreferenciamento certificado pelo INCRA. Confirmamos a exigência para o seu caso.",
    },
    {
      q: "Qual a diferença entre topografia e georreferenciamento?",
      a: "A topografia mede e representa o terreno. O georreferenciamento é um tipo de levantamento com exigências oficiais do INCRA, feito para imóveis rurais e certificado por ele.",
    },
  ],
};
