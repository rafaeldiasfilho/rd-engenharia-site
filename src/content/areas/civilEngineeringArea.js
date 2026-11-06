// Area page content: Engenharia Civil e Regularização (/engenharia-civil).

export const CIVIL_ENGINEERING_AREA = {
  type: "area",
  slug: "engenharia-civil",
  situations: ["Construí sem projeto aprovado e quero regularizar.","Vou vender ou financiar o imóvel e preciso de laudo de vistoria ou de avaliação.","Vejo trincas ou infiltração e quero saber a causa.","Vou construir ou reformar e preciso de projeto e de alvará."],
  name: "Engenharia Civil e Regularização",
  label: "Engenharia Civil",
  subject: "obra e regularização",
  icon: "fa-solid fa-building",
  shortText: "Projetos, regularização de obras, laudos, inspeções e gerenciamento.",
  title: "Projetos e Regularização de Obras em Ibirá | RD Engenharia",
  description:
    "Projetos, regularização de obra (as-built e habite-se), laudos, perícias, inspeção predial e gerenciamento de obras em Ibirá e região.",
  h1: "Engenharia civil, projetos e regularização",
  intro:
    "Da planta ao habite-se: projetos, acompanhamento de obras, regularização de imóveis construídos sem documentação e laudos técnicos, sempre com ART de responsável técnico habilitado no CREA-SP.",
  items: [
    {
      name: "Projetos arquitetônicos, estruturais e complementares",
      example: {"title":"PROJETO","subtitle":"Planta e memorial descritivo","body":"floorPlan","art":true,"layout":"drawingSheet","doc":"Projeto Arquitetônico","ref":"Planta baixa","scale":"1:50"},
      text:
        "Projeto arquitetônico, fundações, projeto estrutural, drenagem, memorial descritivo e memória de cálculo, seguindo as normas da ABNT.",
      who: "Quem vai construir, ampliar ou reformar.",
    },
    {
      name: "Regularização de obra e habite-se",
      example: {"title":"AS-BUILT","subtitle":"Levantamento do que foi construído","body":"asbuilt","art":true,"layout":"drawingSheet","doc":"Levantamento Cadastral (As-built)","ref":"Planta baixa","scale":"1:50"},
      text:
        "Levantamento do que foi construído (as-built), ART ou RRT, alvará, habite-se e demais documentos junto à prefeitura. As regras variam de município para município.",
      who: "Proprietários de imóveis construídos sem projeto aprovado ou sem habite-se.",
    },
    {
      name: "Gerenciamento e planejamento de obras",
      example: {"title":"CRONOGRAMA","subtitle":"Cronograma físico-financeiro","body":"gantt","layout":"drawingSheet","doc":"Cronograma Físico-Financeiro","ref":"Etapas da obra","scale":"Sem escala"},
      text:
        "Orçamento, cronograma físico-financeiro, diário de obra, controle de qualidade e boletim de medição para acompanhar custo, prazo e qualidade da obra.",
      who: "Construtoras, empresas e proprietários que querem controle sobre a obra.",
    },
    {
      name: "Inspeção predial e laudos de patologias",
      example: {"title":"INSPEÇÃO","subtitle":"Laudo de patologias","body":"facadeAnomalies","art":true,"layout":"cover","doc":"Laudo de Inspeção Predial","ref":"Patologias da edificação","contents":["Vistoria por sistema","Anomalias e grau de risco","Recomendações"]},
      text:
        "Inspeção de fachada, estrutura, impermeabilização e instalações, com relatório técnico e orientação de manutenção preventiva.",
      who: "Condomínios, comércios e proprietários que notam trincas, infiltração ou desgaste.",
    },
    {
      name: "Laudos e perícias",
      example: {"title":"LAUDO","subtitle":"Vistoria e avaliação de imóvel","body":"photoRecord","art":true,"layout":"cover","doc":"Laudo Técnico de Vistoria","ref":"Imóvel residencial","contents":["Objeto e objetivo","Vistoria e registros","Conclusão"]},
      text:
        "Laudo de vistoria, de avaliação de imóvel, estrutural e perícia, para fins de financiamento, seguro, negociação ou processo judicial.",
      who: "Quem precisa de um parecer técnico formal sobre um imóvel.",
    },
  ],
  documents: [
    "Endereço e matrícula ou escritura do imóvel",
    "Planta ou projeto anterior, se existir",
    "Fotos do imóvel e da situação que motivou o pedido",
    "Documentos já emitidos pela prefeitura (alvará, habite-se, certidões)",
    "Descrição do que se pretende fazer: construir, reformar, vender ou regularizar",
  ],
  faq: [
    {
      q: "Construí sem projeto. Ainda consigo regularizar?",
      a: "Em muitos casos, sim. O primeiro passo é levantar o que existe no imóvel e verificar se ele atende às regras do município. A viabilidade depende do caso, e analisamos sem compromisso.",
    },
    {
      q: "Preciso de engenheiro para reformar a casa?",
      a: "Depende do tipo de reforma. Obras que mexem na estrutura, ampliam a área ou exigem alvará pedem responsável técnico e ART. Pelo WhatsApp, informamos o que o seu caso exige.",
    },
    {
      q: "A RD faz laudo para financiamento ou venda de imóvel?",
      a: "Sim. Fazemos laudos de vistoria e de avaliação de imóveis, com ART, conforme a finalidade que você precisa.",
    },
  ],
};
