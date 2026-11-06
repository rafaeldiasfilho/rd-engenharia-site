// Content of the site's inner pages (service areas, guides, quiz and privacy).
// Plain text, with no prices and no fixed deadlines. Standards are cited as known
// in 2026; the team confirms each case before any quote.

export const SITE_URL = "https://rdibiraengenharia.com.br";

export const AREAS = [
  {
    type: "area",
    slug: "seguranca-do-trabalho",
    situations: ["Contratei funcionários e não sei por onde começar: PGR, laudos ou treinamentos?","A empresa responde a uma ação trabalhista que pede laudo de insalubridade ou periculosidade.","Um empregado precisa do PPP e a empresa não tem o LTCAT.","Minha equipe trabalha com eletricidade, em altura ou em espaço confinado e precisa de treinamento."],
    name: "Segurança do Trabalho",
    label: "Segurança do Trabalho", // short name, the same on cards, tabs and lists
    subject: "segurança do trabalho",
    icon: "fa-solid fa-helmet-safety",
    shortText: "PGR, LTCAT, laudos de insalubridade e periculosidade e treinamentos.",
    title: "PGR, LTCAT e Laudos em Ibirá e região | RD Engenharia",
    description:
      "PGR, LTCAT, laudos de insalubridade e periculosidade, APR e treinamentos de NRs para empresas de Ibirá e região. Peça orçamento pelo WhatsApp.",
    h1: "Segurança do Trabalho para empresas da região",
    intro:
      "Elaboramos os programas e laudos exigidos pelas Normas Regulamentadoras para que a sua empresa trabalhe em dia com a lei e, principalmente, com menos risco de acidente. Atendemos comércios, indústrias, fazendas, clínicas e prefeituras.",
    items: [
      {
        name: "PGR — Programa de Gerenciamento de Riscos",
        example: {"title":"PGR","subtitle":"Programa de Gerenciamento de Riscos","body":"tabela","art":true,"layout":"capa","doc":"Programa de Gerenciamento de Riscos","ref":"PGR · NR-01","contents":["Identificação da organização","Inventário de riscos","Plano de ação"]},
        text:
          "Documento da NR-1 que identifica os perigos do ambiente de trabalho, avalia os riscos e define as medidas de prevenção. É a base dos demais programas de segurança.",
        who: "Empresas que contratam empregados, em geral. Microempresas e empresas de pequeno porte de menor risco podem ter tratamento simplificado.",
      },
      {
        name: "PCMSO — integração com o programa médico",
        example: {"title":"PGR × PCMSO","subtitle":"Informações do PGR para o programa médico","body":"checklist","layout":"capa","doc":"Integração entre PGR e PCMSO","ref":"Informações para o médico do trabalho","contents":["Riscos por função","Exposições identificadas no PGR","Pontos para o programa médico"]},
        text:
          "O PCMSO (NR-7) é coordenado por médico do trabalho. Orientamos a empresa e integramos as informações do PGR com o programa médico, para que os documentos conversem entre si.",
        who: "Empresas com empregados.",
      },
      {
        name: "LTCAT e PPP",
        example: {"title":"LTCAT","subtitle":"Condições do ambiente de trabalho","body":"grafico","art":true,"layout":"capa","doc":"Laudo Técnico das Condições do Ambiente de Trabalho","ref":"LTCAT","contents":["Descrição dos ambientes","Agentes nocivos avaliados","Conclusão por função"]},
        text:
          "O LTCAT documenta os agentes nocivos presentes no trabalho e serve de base para o PPP, usado pela Previdência no reconhecimento de atividade especial para aposentadoria.",
        who: "Empresas com trabalhadores expostos a agentes nocivos, como ruído, calor, poeira e produtos químicos.",
      },
      {
        name: "Laudo de insalubridade (NR-15) e de periculosidade (NR-16)",
        example: {"title":"LAUDO","subtitle":"Insalubridade e periculosidade","body":"medicao","art":true,"layout":"capa","doc":"Laudo de Insalubridade e Periculosidade","ref":"NR-15 e NR-16","contents":["Atividades avaliadas","Avaliações e critérios","Conclusão por função"]},
        text:
          "Avaliação técnica no local de trabalho para definir se há direito a adicional de insalubridade ou de periculosidade. Também é usado em defesa da empresa em ações trabalhistas.",
        who: "Empresas que lidam com agentes nocivos, inflamáveis, explosivos ou eletricidade, e empresas que respondem a ações trabalhistas.",
      },
      {
        name: "APR, Mapa de Risco e AET",
        example: {"title":"APR","subtitle":"Análise preliminar de riscos","body":"apr","layout":"capa","doc":"Análise Preliminar de Riscos","ref":"Atividade não rotineira","contents":["Descrição da atividade","Etapas, perigos e controles","Liberação da atividade"]},
        text:
          "Análise Preliminar de Riscos para tarefas específicas, mapa de riscos do ambiente e Análise Ergonômica do Trabalho, conforme a atividade.",
        who: "Empresas com tarefas de risco, obras e postos de trabalho com exigência ergonômica.",
      },
      {
        name: "Treinamentos de NRs",
        example: {"title":"CERTIFICADO","subtitle":"Treinamento de Norma Regulamentadora","body":"certificado","layout":"certificado","doc":"NR-35 · Trabalho em altura"},
        text:
          "Capacitações como NR-5 (CIPA), NR-6 (EPI), NR-10 (eletricidade), NR-12 (máquinas), NR-18 (construção), NR-33 (espaço confinado) e NR-35 (trabalho em altura), além de primeiros socorros e combate a incêndio.",
        who: "Colaboradores e gestores de empresas cuja atividade exige a capacitação.",
      },
    ],
    documents: [
      "CNPJ e razão social da empresa",
      "Número de funcionários e suas funções",
      "Descrição das atividades e do local de trabalho",
      "Documentos anteriores, se existirem (PGR, PCMSO, LTCAT, laudos)",
      "Fotos do ambiente e dos equipamentos, se possível",
    ],
    faq: [
      {
        q: "Minha empresa pequena também precisa de PGR?",
        a: "Em regra, sim, quando há empregados. A NR-1 prevê tratamento simplificado para microempresas e empresas de pequeno porte de menor risco, mas a análise depende da atividade. Avaliamos o seu caso e indicamos o que é necessário.",
      },
      {
        q: "O PGR substitui o PPRA?",
        a: "Sim. Desde a atualização da NR-1, o PGR passou a ocupar o lugar do PPRA e reúne o gerenciamento dos riscos ocupacionais da empresa.",
      },
      {
        q: "Vocês fazem o exame médico dos funcionários?",
        a: "Não. Os exames e o PCMSO ficam a cargo do médico do trabalho. Nós cuidamos da parte de engenharia de segurança e integramos as informações entre os programas.",
      },
    ],
  },
  {
    type: "area",
    slug: "corpo-de-bombeiros",
    situations: ["Meu AVCB venceu ou está perto de vencer.","Vou abrir um comércio e não sei se preciso de AVCB ou de CLCB.","O imóvel precisa de projeto de rota de fuga, hidrantes ou alarme de incêndio.","O imóvel não tem licença do Corpo de Bombeiros."],
    name: "Corpo de Bombeiros (AVCB e CLCB)",
    label: "Corpo de Bombeiros",
    subject: "AVCB e CLCB",
    icon: "fa-solid fa-fire-extinguisher",
    shortText: "Projetos de segurança contra incêndio, AVCB e CLCB.",
    title: "AVCB, CLCB e Projeto de Incêndio em Ibirá | RD Engenharia",
    description:
      "Projeto de segurança contra incêndio (PSCIP), AVCB e CLCB para comércios, indústrias e imóveis de Ibirá e região. Peça orçamento pelo WhatsApp.",
    h1: "Projeto de incêndio, AVCB e CLCB",
    intro:
      "Cuidamos do projeto e da regularização da segurança contra incêndio do seu imóvel junto ao Corpo de Bombeiros do Estado de São Paulo, do enquadramento correto até a documentação final.",
    items: [
      {
        name: "PSCIP — Projeto de Segurança Contra Incêndio e Pânico",
        example: {"title":"PSCIP","subtitle":"Projeto de segurança contra incêndio","body":"incendio","art":true,"layout":"prancha","doc":"Projeto de Segurança Contra Incêndio","ref":"Planta de medidas de segurança","scale":"1:100"},
        text:
          "Projeto técnico que define as medidas de proteção exigidas para o seu imóvel, como extintores, sinalização, iluminação de emergência, alarme e hidrantes, conforme as Instruções Técnicas do Corpo de Bombeiros.",
        who: "Edificações e áreas de risco que não se enquadram em processo simplificado.",
      },
      {
        name: "AVCB — Auto de Vistoria do Corpo de Bombeiros",
        example: {"title":"AVCB","subtitle":"Preparação para a vistoria","body":"checklist","layout":"capa","doc":"Preparação para Vistoria do AVCB","ref":"Lista de exigências","contents":["Medidas de segurança exigidas","Situação de cada medida","Pendências antes da vistoria"]},
        text:
          "Documento que comprova que a edificação cumpre as medidas de segurança contra incêndio, emitido após vistoria do Corpo de Bombeiros.",
        who: "Comércios, indústrias, escolas, clínicas, condomínios e outros imóveis cuja ocupação exija o documento.",
      },
      {
        name: "CLCB — Certificado de Licença do Corpo de Bombeiros",
        example: {"title":"CLCB","subtitle":"Análise de enquadramento","body":"checklist","layout":"capa","doc":"Análise de Enquadramento para CLCB","ref":"Área, altura e ocupação","contents":["Dados da edificação","Enquadramento","Medidas exigidas"]},
        text:
          "Licença com processo mais simples, para edificações menores e de baixo risco. O enquadramento depende de área, altura e tipo de ocupação, e fazemos essa análise para você.",
        who: "Estabelecimentos de pequeno porte e baixo risco, conforme a legislação paulista.",
      },
      {
        name: "Projetos específicos",
        example: {"title":"PROJETO","subtitle":"Rota de fuga, hidrantes e alarme","body":"rota","art":true,"layout":"prancha","doc":"Rota de Fuga e Hidrantes","ref":"Projeto específico","scale":"1:100"},
        text:
          "Rota de fuga, hidrantes, sprinklers (chuveiros automáticos), detecção e alarme de incêndio, com ART do responsável técnico.",
        who: "Imóveis em que o projeto exige sistemas fixos de proteção.",
      },
    ],
    documents: [
      "Endereço e tipo de uso do imóvel (comércio, indústria, escola, etc.)",
      "Área construída e número de pavimentos",
      "Projeto arquitetônico ou planta do imóvel, se existir",
      "AVCB ou CLCB anterior, caso exista, e a data de vencimento",
      "Número de funcionários e de pessoas que circulam no local",
    ],
    faq: [
      {
        q: "Como sei se preciso de AVCB ou de CLCB?",
        a: "Depende da área construída, da altura e da ocupação do imóvel, de acordo com a legislação paulista. Mande os dados do imóvel pelo WhatsApp e informamos o enquadramento correto.",
      },
      {
        q: "Meu AVCB venceu. O que faço?",
        a: "É preciso renovar a licença antes do vencimento, sempre que possível. Se já venceu, avaliamos a situação do imóvel e conduzimos a regularização. Também é possível pedir um lembrete de vencimento pelo WhatsApp.",
      },
      {
        q: "A RD faz o projeto e acompanha a vistoria?",
        a: "Sim. Elaboramos o projeto, protocolamos a documentação e orientamos o cliente durante o processo, inclusive sobre as adequações necessárias no imóvel.",
      },
    ],
  },
  {
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
        example: {"title":"PROJETO","subtitle":"Planta e memorial descritivo","body":"planta","art":true,"layout":"prancha","doc":"Projeto Arquitetônico","ref":"Planta baixa","scale":"1:50"},
        text:
          "Projeto arquitetônico, fundações, projeto estrutural, drenagem, memorial descritivo e memória de cálculo, seguindo as normas da ABNT.",
        who: "Quem vai construir, ampliar ou reformar.",
      },
      {
        name: "Regularização de obra e habite-se",
        example: {"title":"AS-BUILT","subtitle":"Levantamento do que foi construído","body":"asbuilt","art":true,"layout":"prancha","doc":"Levantamento Cadastral (As-built)","ref":"Planta baixa","scale":"1:50"},
        text:
          "Levantamento do que foi construído (as-built), ART ou RRT, alvará, habite-se e demais documentos junto à prefeitura. As regras variam de município para município.",
        who: "Proprietários de imóveis construídos sem projeto aprovado ou sem habite-se.",
      },
      {
        name: "Gerenciamento e planejamento de obras",
        example: {"title":"CRONOGRAMA","subtitle":"Cronograma físico-financeiro","body":"gantt","layout":"prancha","doc":"Cronograma Físico-Financeiro","ref":"Etapas da obra","scale":"Sem escala"},
        text:
          "Orçamento, cronograma físico-financeiro, diário de obra, controle de qualidade e boletim de medição para acompanhar custo, prazo e qualidade da obra.",
        who: "Construtoras, empresas e proprietários que querem controle sobre a obra.",
      },
      {
        name: "Inspeção predial e laudos de patologias",
        example: {"title":"INSPEÇÃO","subtitle":"Laudo de patologias","body":"fachada","art":true,"layout":"capa","doc":"Laudo de Inspeção Predial","ref":"Patologias da edificação","contents":["Vistoria por sistema","Anomalias e grau de risco","Recomendações"]},
        text:
          "Inspeção de fachada, estrutura, impermeabilização e instalações, com relatório técnico e orientação de manutenção preventiva.",
        who: "Condomínios, comércios e proprietários que notam trincas, infiltração ou desgaste.",
      },
      {
        name: "Laudos e perícias",
        example: {"title":"LAUDO","subtitle":"Vistoria e avaliação de imóvel","body":"laudo","art":true,"layout":"capa","doc":"Laudo Técnico de Vistoria","ref":"Imóvel residencial","contents":["Objeto e objetivo","Vistoria e registros","Conclusão"]},
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
  },
  {
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
  },
];

export const GUIDES = [
  {
    type: "guide",
    slug: "guias/quando-minha-empresa-precisa-de-pgr",
    title: "Quando minha empresa precisa de PGR? | Guia RD Engenharia",
    description:
      "Entenda o que é o PGR da NR-1, quem precisa elaborar e o que o programa deve conter. Guia da RD Engenharia, Ibirá/SP.",
    h1: "Quando minha empresa precisa de PGR?",
    area: "seguranca-do-trabalho",
    service: "PGR (Programa de Gerenciamento de Riscos)",
    paragraphs: [
      "O PGR, ou Programa de Gerenciamento de Riscos, é o documento previsto na NR-1 que reúne a identificação dos perigos do ambiente de trabalho, a avaliação dos riscos e as medidas para controlá-los. Ele substituiu o antigo PPRA e é a base para os demais documentos de segurança da empresa.",
      "Em regra, o PGR é exigido de organizações que contratam trabalhadores como empregados. Microempreendedores individuais sem funcionários ficam, em geral, fora dessa obrigação. Já microempresas e empresas de pequeno porte de menor grau de risco podem ter tratamento simplificado, conforme a própria NR-1.",
      "O programa é composto, principalmente, pelo inventário de riscos e pelo plano de ação. O inventário descreve os perigos de cada função e ambiente, e o plano de ação define o que será feito, por quem e quando. A NR-1 também determina que os fatores de risco psicossociais sejam considerados no gerenciamento de riscos.",
      "O PGR precisa ser revisado periodicamente e sempre que houver mudança relevante na empresa, como nova máquina, nova atividade ou acidente. Por isso, um documento antigo e parado em uma gaveta não cumpre o seu papel.",
      "Não existe um modelo único: o conteúdo depende da atividade, do número de funcionários e do local de trabalho. Uma visita ou a análise das informações da empresa é o caminho para saber exatamente o que é preciso.",
    ],
  },
  {
    type: "guide",
    slug: "guias/avcb-ou-clcb-qual-a-diferenca",
    title: "AVCB ou CLCB: qual a diferença? | Guia RD Engenharia",
    description:
      "Entenda a diferença entre AVCB e CLCB no Estado de São Paulo e como saber qual licença do Corpo de Bombeiros o seu imóvel precisa.",
    h1: "AVCB ou CLCB: qual a diferença?",
    area: "corpo-de-bombeiros",
    service: "AVCB / CLCB (Corpo de Bombeiros)",
    paragraphs: [
      "No Estado de São Paulo, todo imóvel que exige segurança contra incêndio precisa de uma licença do Corpo de Bombeiros. As duas mais comuns são o AVCB e o CLCB.",
      "O AVCB (Auto de Vistoria do Corpo de Bombeiros) é o documento que atesta que a edificação cumpre as medidas de segurança contra incêndio exigidas para ela. Ele é emitido depois da análise do projeto e da vistoria do Corpo de Bombeiros.",
      "O CLCB (Certificado de Licença do Corpo de Bombeiros) é uma licença de processo mais simples, destinada a edificações menores e de baixo risco. Os limites de área, de altura e de carga de incêndio que definem esse enquadramento estão na legislação paulista e nas Instruções Técnicas do Corpo de Bombeiros.",
      "Por isso, a pergunta correta não é qual das duas é melhor, e sim em qual delas o seu imóvel se enquadra. Isso depende da área construída, do número de pavimentos e do que é feito no local, seja comércio, indústria, escola, clínica ou outra ocupação.",
      "Qualquer que seja a licença, ela tem prazo de validade e precisa ser renovada. Funcionar com a licença vencida expõe o proprietário a multa, a interdição e, principalmente, a risco real para quem circula no local.",
    ],
  },
  {
    type: "guide",
    slug: "guias/georreferenciamento-quando-e-obrigatorio",
    title: "Georreferenciamento: quando é obrigatório? | RD Engenharia",
    description:
      "Saiba o que é o georreferenciamento de imóvel rural, quando ele é exigido pelo INCRA e como se preparar. Guia da RD Engenharia, Ibirá/SP.",
    h1: "Georreferenciamento de imóvel rural: quando é obrigatório?",
    area: "meio-ambiente-topografia",
    service: "Georreferenciamento de imóvel rural",
    paragraphs: [
      "O georreferenciamento é o levantamento que descreve os limites de um imóvel rural com coordenadas oficiais. Ele é previsto na Lei 10.267/2001 e certificado pelo INCRA, que confere se a área não se sobrepõe à de nenhum vizinho.",
      "A exigência aparece quando o imóvel passa por alguma alteração na matrícula, como desmembramento, parcelamento, remembramento ou transferência de propriedade, seja por venda, doação ou outra forma. Sem a certificação, o cartório não faz o registro.",
      "Os prazos para a exigência foram escalonados por tamanho do imóvel. Em regra, hoje ela alcança imóveis de todos os tamanhos, mas confirmamos o seu caso, porque a regra pode ser ajustada pelo INCRA.",
      "O trabalho é feito por profissional habilitado e credenciado, com equipamento de precisão e ART. Ele começa com a análise da matrícula e a visita ao imóvel, e termina com a certificação e a averbação no cartório.",
      "Para começar, separe a matrícula do imóvel, o CCIR e o ITR atualizados, e informe o que você pretende fazer: vender, dividir ou apenas regularizar.",
    ],
  },
  {
    type: "guide",
    slug: "guias/laudo-de-insalubridade-como-funciona",
    title: "Laudo de insalubridade: como funciona? | Guia RD Engenharia",
    description:
      "Entenda o que é o laudo de insalubridade, quem pode elaborá-lo, como os graus do adicional são definidos e quando a empresa precisa dele.",
    h1: "Laudo de insalubridade: como funciona?",
    area: "seguranca-do-trabalho",
    service: "Laudo de insalubridade",
    paragraphs: [
      "A insalubridade é a exposição do trabalhador a agentes nocivos à saúde acima dos limites previstos na NR-15, como ruído, calor, agentes químicos, poeira e agentes biológicos. Quando ela existe e não é neutralizada, o trabalhador tem direito a um adicional sobre o salário.",
      "O laudo de insalubridade é o documento técnico que comprova se há ou não essa exposição. A CLT prevê que a caracterização seja feita por perícia de médico do trabalho ou de engenheiro de segurança do trabalho registrado no órgão competente.",
      "O trabalho começa com uma visita ao local, observando as tarefas, o tempo de exposição e os equipamentos usados. Quando necessário, são feitas medições, como a do nível de ruído. Os resultados são comparados com os limites da norma.",
      "Se houver insalubridade, o laudo indica o grau (mínimo, médio ou máximo), que define o percentual do adicional, calculado conforme a CLT. O laudo também registra se há medidas que eliminam ou neutralizam o agente, como o uso correto de EPI com certificado de aprovação, o que pode afastar o direito ao adicional.",
      "Para a empresa, o laudo serve para pagar o adicional corretamente, quando devido, e para se defender em ações trabalhistas. Ele deve ser atualizado quando mudam o ambiente, as máquinas ou as atividades.",
    ],
  },
  {
    type: "guide",
    slug: "guias/o-que-e-art-anotacao-de-responsabilidade-tecnica",
    title: "O que é ART e quando é obrigatória? | RD Engenharia",
    description:
      "Entenda o que é a ART, quando ela é obrigatória e por que ela protege quem contrata um serviço de engenharia.",
    h1: "O que é ART e quando ela é obrigatória?",
    area: "engenharia-civil",
    service: "Serviço de engenharia com ART",
    paragraphs: [
      "A ART, ou Anotação de Responsabilidade Técnica, é o documento que registra no CREA qual profissional é responsável por um serviço de engenharia. Ela está prevista na Lei 6.496/1977.",
      "Em geral, a ART é exigida em projetos, obras, laudos, perícias, topografia, projetos de incêndio e outros serviços técnicos regulamentados. Sem ela, o serviço pode ficar sem validade perante órgãos como prefeituras e o Corpo de Bombeiros, e o profissional e o contratante ficam expostos a problemas.",
      "Para quem contrata, a ART mostra quem assinou o trabalho, qual é o serviço contratado e o período de execução. Se houver erro ou dano, é possível identificar quem responde tecnicamente por ele, e isso protege o cliente.",
      "A ART é emitida pelo profissional, no sistema do CREA, e vinculada ao contrato. Ela é paga por serviço, e o valor é definido pelo conselho. Por isso, vale sempre pedir a ART junto com o orçamento e guardar uma cópia.",
      "Desconfie de quem oferece serviços de engenharia sem ART ou sem registro no CREA. Você pode conferir o registro do profissional no site do conselho.",
    ],
  },
  {
    type: "guide",
    slug: "guias/habite-se-o-que-e-e-como-conseguir",
    title: "Habite-se: o que é e como conseguir | Guia RD Engenharia",
    description:
      "Entenda o que é o habite-se, para que serve e que documentos costumam ser necessários para conseguir o seu na prefeitura.",
    h1: "Habite-se: o que é e como conseguir",
    area: "engenharia-civil",
    service: "Habite-se e regularização de obra",
    paragraphs: [
      "O habite-se é o documento da prefeitura que atesta que a obra foi concluída de acordo com o projeto aprovado e pode ser usada. Ele é pedido para ligar serviços em definitivo, para averbar a construção na matrícula do imóvel e para vender ou financiar.",
      "Cada município tem as suas regras, mas, em geral, o processo exige o projeto aprovado e o alvará de construção, a ART ou RRT do responsável técnico, a vistoria da prefeitura e a regularização da obra junto à Receita Federal e ao INSS. Em imóveis que exigem, também é preciso apresentar a licença do Corpo de Bombeiros.",
      "Quando a obra foi construída sem projeto, ou com diferenças em relação ao que foi aprovado, o primeiro passo é levantar o que existe no local e fazer o projeto como construído (as-built). Depois, verifica-se se a obra atende às regras de uso e ocupação do solo do município.",
      "Em alguns casos, pode ser necessário adequar a construção antes da aprovação, ou pagar multas previstas na legislação municipal. A viabilidade e os custos dependem de cada caso, por isso a análise dos documentos vem primeiro.",
      "Se você já tem plantas, alvará ou certidões, separe tudo. Isso acelera a análise e evita retrabalho.",
    ],
  },
  {
    type: "guide",
    slug: "guias/car-cadastro-ambiental-rural",
    title: "CAR: o que é o Cadastro Ambiental Rural | Guia RD Engenharia",
    description:
      "Entenda o que é o CAR, quem precisa fazer, o que ele contém e por que ele importa para o produtor rural.",
    h1: "CAR: o que é e por que o produtor rural precisa dele",
    area: "meio-ambiente-topografia",
    service: "CAR (Cadastro Ambiental Rural)",
    paragraphs: [
      "O CAR, ou Cadastro Ambiental Rural, é um registro eletrônico e obrigatório para os imóveis rurais, criado pelo Código Florestal (Lei 12.651/2012). Ele reúne, em um mapa, os limites da propriedade, as áreas de vegetação nativa, as áreas de preservação permanente e a reserva legal.",
      "O cadastro é feito no sistema oficial, o SICAR, a partir de informações declaradas pelo proprietário ou possuidor, com apoio de imagens de satélite e de um levantamento do imóvel. Por ser autodeclaratório, as informações precisam ser corretas, porque o órgão ambiental pode analisá-las depois.",
      "O CAR é a base da regularização ambiental da propriedade. Quando há áreas que precisam ser recuperadas, ele é a porta de entrada para os programas de regularização previstos em lei. Em geral, o produtor também precisa comprovar o CAR para obter crédito rural.",
      "Ter o CAR não significa que a propriedade está regular. Significa que ela está cadastrada e pode ser analisada. Por isso, vale revisar se os dados batem com a realidade do imóvel, principalmente se a propriedade foi dividida ou vendida.",
      "Para começar, separe a matrícula, o CCIR e o ITR do imóvel, e informe a localização da propriedade. Se você já tem o recibo de inscrição do CAR, também ajuda.",
    ],
  },
  {
    type: "guide",
    slug: "guias/ltcat-e-ppp-para-que-servem",
    title: "LTCAT e PPP: para que servem | Guia RD Engenharia",
    description:
      "Entenda a diferença entre LTCAT e PPP, quem precisa emitir e como eles se relacionam com a aposentadoria especial.",
    h1: "LTCAT e PPP: para que servem e como se relacionam",
    area: "seguranca-do-trabalho",
    service: "LTCAT e PPP",
    paragraphs: [
      "O LTCAT (Laudo Técnico das Condições do Ambiente de Trabalho) é o documento que identifica os agentes nocivos presentes no trabalho, como ruído, calor, poeira e produtos químicos, e avalia a exposição dos trabalhadores a eles.",
      "O PPP (Perfil Profissiográfico Previdenciário) é o documento individual de cada trabalhador, emitido pela empresa. Ele resume o histórico do trabalhador e as exposições a agentes nocivos ao longo do tempo, com base nas informações do LTCAT e de outros programas de segurança.",
      "Os dois documentos são usados pela Previdência para avaliar se o trabalhador teve atividade especial, que pode reduzir o tempo necessário para a aposentadoria. Por isso, as informações precisam ser verdadeiras e atualizadas: erros prejudicam o trabalhador e geram risco para a empresa.",
      "A empresa deve emitir o PPP quando o trabalhador pede e quando o contrato termina, e manter o LTCAT atualizado quando há mudança no ambiente, nas máquinas ou nas atividades.",
      "A elaboração do LTCAT exige visita ao local e profissional habilitado. Se a sua empresa nunca fez o laudo, ou se o último é muito antigo, vale revisar.",
    ],
  },
];

// "Em resumo" (summary) box at the top of each guide: 3 points taken from the guide's own text (nothing new here).
export const GUIDE_SUMMARIES = {
  "guias/quando-minha-empresa-precisa-de-pgr": [
    "O PGR é o documento da NR-1 que identifica os perigos, avalia os riscos e define as medidas de controle.",
    "Em regra, é exigido de quem contrata empregados; micro e pequenas empresas de menor risco podem ter tratamento simplificado.",
    "Deve ser revisado periodicamente e sempre que algo relevante muda na empresa.",
  ],
  "guias/avcb-ou-clcb-qual-a-diferenca": [
    "AVCB e CLCB são as duas licenças mais comuns do Corpo de Bombeiros no Estado de São Paulo.",
    "O CLCB tem processo mais simples e vale para edificações menores e de baixo risco.",
    "O enquadramento depende da área, dos pavimentos e do uso do imóvel, e as duas licenças precisam ser renovadas.",
  ],
  "guias/georreferenciamento-quando-e-obrigatorio": [
    "É o levantamento dos limites do imóvel rural com coordenadas oficiais, certificado pelo INCRA.",
    "É exigido em alterações na matrícula, como desmembramento, parcelamento ou transferência.",
    "Para começar, separe a matrícula, o CCIR e o ITR atualizados.",
  ],
  "guias/laudo-de-insalubridade-como-funciona": [
    "O laudo comprova se há exposição a agentes nocivos acima dos limites da NR-15.",
    "Pela CLT, é feito por médico do trabalho ou engenheiro de segurança do trabalho.",
    "Indica o grau do adicional, quando devido, e ajuda a empresa a se defender em ações trabalhistas.",
  ],
  "guias/o-que-e-art-anotacao-de-responsabilidade-tecnica": [
    "A ART registra no CREA quem é o responsável técnico por um serviço de engenharia.",
    "Em geral, é exigida em projetos, obras, laudos, perícias, topografia e projetos de incêndio.",
    "Vale pedir a ART junto com o orçamento e guardar uma cópia.",
  ],
  "guias/habite-se-o-que-e-e-como-conseguir": [
    "É o documento da prefeitura que atesta que a obra foi concluída conforme o projeto aprovado.",
    "É pedido para averbar a construção na matrícula, vender ou financiar o imóvel.",
    "Obra sem projeto aprovado começa pelo levantamento do que existe (projeto como construído).",
  ],
  "guias/car-cadastro-ambiental-rural": [
    "O CAR é o registro eletrônico e obrigatório dos imóveis rurais, previsto no Código Florestal.",
    "É a base da regularização ambiental e, em geral, é exigido para obter crédito rural.",
    "Ter o CAR não significa estar regular: os dados precisam bater com a realidade do imóvel.",
  ],
  "guias/ltcat-e-ppp-para-que-servem": [
    "O LTCAT identifica os agentes nocivos do trabalho e avalia a exposição dos trabalhadores.",
    "O PPP é o documento individual de cada trabalhador, feito com base no LTCAT e em outros programas.",
    "Os dois são usados pela Previdência para avaliar a atividade especial na aposentadoria.",
  ],
};


export const PAGES = [
  ...AREAS,
  ...GUIDES,
  {
    type: "location",
    slug: "onde-atendemos",
    title: "Onde atendemos: Ibirá e região | RD Engenharia",
    description: "Atendemos presencialmente e online em Ibirá e região. Conte onde fica o seu imóvel ou a sua empresa pelo WhatsApp e confirmamos o atendimento.",
    h1: "Atendemos presencialmente e online em Ibirá e região",
  },
  {
    type: "quiz",
    slug: "o-que-preciso",
    title: "O que o seu caso precisa? Passo a passo | RD Engenharia",
    description:
      "Responda uma pergunta por vez e descubra quais documentos e serviços técnicos o seu caso provavelmente exige. Depois peça orçamento pelo WhatsApp.",
    h1: "Descubra o que o seu caso precisa",
  },
  {
    type: "guide-index",
    slug: "guias",
    title: "Guias e artigos | RD Engenharia",
    description:
      "Guias curtos sobre PGR, LTCAT, laudos, AVCB, CLCB, ART, habite-se, CAR e georreferenciamento, escritos pela equipe da RD Engenharia.",
    h1: "Guias e artigos",
  },
  {
    type: "reminder",
    slug: "lembrete-de-vencimento",
    title: "Lembrete de vencimento dos seus documentos | RD Engenharia",
    description:
      "Peça um aviso por WhatsApp antes do vencimento do AVCB, laudos, PGR e outros documentos, para não perder o prazo de renovação.",
    h1: "Lembrete de vencimento dos seus documentos",
  },
  {
    type: "privacy",
    slug: "privacidade",
    title: "Política de Privacidade | RD Engenharia",
    description: "Como o site da RD Engenharia trata os dados de quem entra em contato.",
    h1: "Política de Privacidade",
  },
  {
    // DRAFT (2026-11-06): text written by the AI from what the site already says; the owner reviews it before publishing.
    type: "terms",
    slug: "termos-de-uso",
    title: "Termos de Uso | RD Engenharia",
    description: "Regras de uso do site da RD Engenharia: orçamentos, conteúdo informativo, imagens e direitos.",
    h1: "Termos de Uso",
  },
  {
    type: "credits",
    slug: "creditos",
    title: "Créditos das imagens | RD Engenharia",
    description: "Origem, autor e licença de cada foto ilustrativa usada no site da RD Engenharia.",
    h1: "Créditos das imagens",
  },
];

export const REMINDER_DOCUMENTS = [
  "AVCB ou CLCB (Corpo de Bombeiros)",
  "PGR (gerenciamento de riscos)",
  "LTCAT / PPP",
  "Laudo de insalubridade ou periculosidade",
  "Treinamento de NR (CIPA, NR-35, NR-10 etc.)",
  "Alvará ou licença",
  "CAR, licença ambiental ou outorga",
  "Outro documento",
];

export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/RD+Engenharia+Seguran%C3%A7a+e+Meio+Ambiente/@-21.0824485,-49.2433844,1046m/data=!3m2!1e3!4b1!4m6!3m5!1s0x94bc3184084c66fb:0x9998e55c89839066!8m2!3d-21.0824485!4d-49.2433844!16s%2Fg%2F11fky31jy7";
// Company address and Google Maps links (the same Google listing used for the reviews).
export { ADDRESS as ADDRESS } from "./company.js";
export const DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=-21.0824485,-49.2433844";
export const MAP_EMBED_URL = "https://maps.google.com/maps?q=-21.0824485,-49.2433844&z=16&output=embed";
// Rating checked on the Google profile on 2026-10-20 and again on 2026-10-26. Update by hand; do not use AggregateRating markup.
export const GOOGLE_RATING = "5,0 no Google · 8 avaliações";

// Google reviews shown on the home page. Rafael authorized on 2026-10-26 publishing the texts
// and first names. Rules: text EXACTLY as it is on Google (no editing or summarizing), first name
// only, only reviews that have text. No Review/AggregateRating markup in the JSON-LD.
// Format: { nome: "First name", texto: "Text as it appears on Google", estrelas: 5 }
export const REVIEWS = [];

// Deadline guidance shown on the reminder page. Each document states its own validity;
// the standards fix a deadline only in some cases. The exact deadline is confirmed for each case at renewal.
export const REMINDER_TIPS = {
  "AVCB ou CLCB (Corpo de Bombeiros)":
    "A validade varia conforme o risco da edificação e está impressa no certificado. A renovação leva tempo, por isso vale começar com antecedência.",
  "PGR (gerenciamento de riscos)":
    "A NR-1 pede que a avaliação de riscos seja revista, no máximo, a cada 2 anos, e antes disso quando algo muda no trabalho.",
  "LTCAT / PPP":
    "Não tem prazo fixo de validade. O LTCAT é atualizado quando muda o ambiente, as máquinas ou as atividades.",
  "Laudo de insalubridade ou periculosidade":
    "Não tem prazo fixo. Vale revisar quando mudam o ambiente, os processos ou os equipamentos.",
  "Treinamento de NR (CIPA, NR-35, NR-10 etc.)":
    "NR-35 e NR-10 pedem reciclagem a cada 2 anos. O treinamento da CIPA é renovado a cada mandato. Confira a data no certificado.",
  "Alvará ou licença": "A validade e a renovação dependem da prefeitura. Informe a data que consta no documento.",
  "CAR, licença ambiental ou outorga": "O prazo depende do órgão que emitiu. Informe a data que consta no documento.",
};

export const findPage = (slug) => PAGES.find((p) => p.slug === slug);
export const findArea = (slug) => AREAS.find((p) => p.slug === slug);


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

const HOUSE_ITEMS = [
  { file: "planta-baixa", shape: "alto", w: 829, h: 1631, title: "Planta baixa", text: "Residência térrea de 105 m², com 2 suítes, closet e sala integrada à cozinha gourmet.", alt: "Planta baixa de uma residência térrea com duas suítes, closet, sala e cozinha integradas" },
  { file: "cobertura-implantacao", w: 788, h: 895, title: "Cobertura e implantação", text: "Posição da casa no terreno e desenho do telhado, com os recuos e beirais.", alt: "Plantas de cobertura e de implantação de uma residência térrea" },
  { file: "fachada", w: 624, h: 392, title: "Fachada frontal", text: "Vista da frente da casa, com telhado cerâmico e esquadrias.", alt: "Fachada frontal de uma residência térrea com telhado cerâmico" },
  { file: "cortes", shape: "largo", w: 1864, h: 448, title: "Cortes e detalhe da calçada", text: "Cortes AA e BB, com alturas e inclinação do telhado, e detalhe da calçada.", alt: "Cortes AA e BB e detalhe da calçada de uma residência térrea" },
  { file: "quadros", shape: "largo", w: 901, h: 321, title: "Quadro de aberturas", text: "Áreas, iluminação e ventilação de cada ambiente, conforme exigido na aprovação.", alt: "Quadro com áreas e aberturas de iluminação e ventilação dos ambientes" },
];

const COMPACT_HOUSE_ITEMS = [
  { file: "planta-baixa", shape: "alto", w: 768, h: 1497, title: "Planta baixa", text: "Casa térrea de cerca de 62 m², com 2 dormitórios, banheiro e cozinha integrada à sala, e área permeável no fundo do lote.", alt: "Planta baixa de uma casa térrea com dois dormitórios, banheiro, cozinha integrada à sala, área de serviço e área permeável" },
  { file: "cobertura-implantacao", w: 766, h: 838, title: "Cobertura e implantação", text: "Posição da casa no lote de 10 × 22 m e desenho do telhado, com os recuos exigidos.", alt: "Plantas de cobertura e de implantação de uma casa térrea em lote retangular" },
  { file: "fachada", w: 544, h: 332, title: "Fachada frontal", text: "Vista da frente da casa, com platibanda e esquadrias.", alt: "Fachada frontal de uma casa térrea com platibanda, porta e duas janelas" },
  { file: "cortes", shape: "largo", w: 1833, h: 515, title: "Cortes e detalhe da calçada", text: "Cortes AA e BB, com pé-direito, forro e cobertura metálica, e detalhe da calçada.", alt: "Cortes AA e BB de uma casa térrea e detalhe da calçada com árvore" },
  { file: "quadros", shape: "largo", w: 893, h: 207, title: "Quadro de aberturas", text: "Áreas, iluminação e ventilação de cada ambiente, conforme exigido na aprovação.", alt: "Quadro com as áreas e as aberturas de cada ambiente da casa" },
];

// To add another project: create the folder public/exemplos/<pasta> with the same 5 files
// (any number of images; forma: "alto" spans two rows, "largo" spans the full row).
// Example files: (planta-baixa, cobertura-implantacao, fachada, cortes, quadros), then add an item here.
export const PROJECTS = [
  {
    folder: "residencia-terrea",
    name: "Residência térrea",
    summary: "105 m² · 2 suítes · terreno de 11 × 25 m",
    items: HOUSE_ITEMS,
  },
  {
    folder: "residencia-compacta",
    name: "Casa térrea compacta",
    summary: "62 m² · 2 dormitórios · lote de 10 × 22 m",
    items: COMPACT_HOUSE_ITEMS,
  },
];

// Quick summary and steps for each area (no fixed deadlines or prices).
export const AREA_OVERVIEW = {
  "seguranca-do-trabalho": {
    who: "Empresas com empregados, de qualquer porte.",
    deliverable: "Programas e laudos assinados por profissional habilitado, prontos para uma fiscalização.",
    steps: [
      { t: "Conversa no WhatsApp", d: "Você conta o ramo da empresa e quantos funcionários tem." },
      { t: "Visita ao local", d: "Olhamos os ambientes, as máquinas e as tarefas de cada função." },
      { t: "Elaboração", d: "Preparamos o programa ou o laudo com base no que foi visto." },
      { t: "Entrega e acompanhamento", d: "Entregamos os documentos e avisamos antes de vencerem." },
    ],
  },
  "corpo-de-bombeiros": {
    who: "Comércios, indústrias, escolas, clínicas e condomínios.",
    deliverable: "Projeto, protocolo e licença do Corpo de Bombeiros (AVCB ou CLCB), conforme o enquadramento.",
    steps: [
      { t: "Enquadramento", d: "Com área, altura e uso do imóvel, definimos qual licença é exigida." },
      { t: "Levantamento no imóvel", d: "Medimos e anotamos o que já existe de proteção contra incêndio." },
      { t: "Projeto e protocolo", d: "Elaboramos o projeto e protocolamos junto ao Corpo de Bombeiros." },
      { t: "Vistoria e licença", d: "Orientamos as adequações e acompanhamos até a emissão." },
    ],
  },
  "engenharia-civil": {
    who: "Quem vai construir, reformar, vender ou regularizar um imóvel.",
    deliverable: "Projetos, regularização, laudos e documentos prontos para a prefeitura, com ART.",
    steps: [
      { t: "Conversa e documentos", d: "Você envia matrícula, fotos e conta o que pretende fazer." },
      { t: "Visita e levantamento", d: "Medimos o imóvel e verificamos a situação real da obra." },
      { t: "Projeto ou regularização", d: "Elaboramos os projetos e protocolamos na prefeitura." },
      { t: "Alvará ou habite-se", d: "Acompanhamos o processo até a liberação dos documentos." },
    ],
  },
  "meio-ambiente-topografia": {
    who: "Proprietários rurais, empresas e quem vai dividir ou vender um terreno.",
    deliverable: "Cadastros, levantamentos e certificações, conforme o caso.",
    steps: [
      { t: "Análise dos documentos", d: "Conferimos matrícula, CCIR e a finalidade do trabalho." },
      { t: "Trabalho de campo", d: "Medimos a área com equipamento de precisão." },
      { t: "Elaboração", d: "Montamos mapas, memoriais e o cadastro ou pedido de licença." },
      { t: "Entrega e acompanhamento", d: "Conduzimos o processo no órgão responsável até a conclusão." },
    ],
  },
};

// AVCB vs CLCB comparison (fire department page and guide). It only gathers what the site already states
// in the area and guide texts; the exact limits of area, height and occupancy are NOT cited here.
export const FIRE_LICENSE_COMPARISON = {
  columns: [
    { acronym: "AVCB", name: "Auto de Vistoria do Corpo de Bombeiros" },
    { acronym: "CLCB", name: "Certificado de Licença do Corpo de Bombeiros" },
  ],
  rows: [
    {
      t: "O que é",
      v: [
        "Atesta que a edificação cumpre as medidas de segurança contra incêndio exigidas para ela.",
        "Licença do Corpo de Bombeiros com processo mais simples.",
      ],
    },
    {
      t: "Para quais imóveis",
      v: [
        "Imóveis que não se enquadram no processo simplificado, como muitos comércios, indústrias, escolas, clínicas e condomínios.",
        "Edificações menores e de baixo risco, dentro dos limites de área, altura e ocupação da legislação paulista.",
      ],
    },
    {
      t: "Como é emitido",
      v: ["Depois da análise do projeto e da vistoria do Corpo de Bombeiros.", "Por um processo simplificado, conforme as regras do Corpo de Bombeiros."],
    },
    {
      t: "Projeto técnico",
      v: ["Em geral, exige o projeto de segurança contra incêndio (PSCIP), com ART.", "A documentação exigida depende do enquadramento do imóvel."],
    },
    {
      t: "Validade",
      v: ["Tem prazo de validade e precisa ser renovado.", "Também tem prazo de validade e precisa ser renovado."],
    },
  ],
  note: "Resumo geral, conforme a legislação paulista conhecida em 2026. O enquadramento depende da área construída, da altura e do uso do imóvel, e a equipe confirma cada caso.",
  whatsappMessage: "Olá! Quero saber se o meu imóvel precisa de AVCB ou de CLCB.\nUso do imóvel (comércio, indústria, escola etc.): \nÁrea construída (m²): \nNúmero de pavimentos: \nCidade: ",
};

// Photo of the technical lead. When the file exists in public/ (e.g. "/rafael.webp"), put its path here.
export const TECHNICAL_LEAD_PHOTO = null;

// Equipment that is USUALLY used in services of this kind (general reference list).
// Never state that RD owns or uses any of it; no brands and no prices.
export const EQUIPMENT_NOTE = "Lista geral de referência, não é o inventário da RD.";
export const EQUIPMENT = {
  "seguranca-do-trabalho": {
    text:
      "Para saber se o ambiente de trabalho está dentro dos limites das normas, o profissional pode medir o que está no ar e no entorno do trabalhador, como ruído, calor, luz e poeira. Em serviços como PGR, LTCAT e laudos de insalubridade, podem ser usados aparelhos de medição específicos, conferidos antes e depois da medida. Os métodos seguem normas como a NR-15 e as Normas de Higiene Ocupacional (NHO) da Fundacentro.",
    items: [
      "Dosímetro de ruído e medidor de nível de som (decibelímetro)",
      "Medidor de calor (IBUTG, com termômetros de globo e de bulbo úmido)",
      "Luxímetro, para medir a iluminação do posto de trabalho",
      "Bomba de amostragem de ar com filtro, para coletar poeira e outros agentes",
      "Calibradores, para conferir os aparelhos de ruído e a vazão das bombas",
    ],
  },
  "corpo-de-bombeiros": {
    text:
      "O projeto de segurança contra incêndio define quais proteções o imóvel precisa ter, de acordo com as Instruções Técnicas do Corpo de Bombeiros do Estado de São Paulo. Na vistoria, os bombeiros podem conferir se esses sistemas estão instalados e funcionando. Por isso, o levantamento do imóvel e o projeto tratam de cada um deles.",
    items: [
      "Extintores de incêndio, de tipos adequados ao risco",
      "Hidrantes e mangotinhos (rede de água e mangueiras)",
      "Iluminação de emergência nas rotas de saída",
      "Sistema de detecção e alarme de incêndio (detectores, acionadores e central)",
      "Sinalização de emergência e, quando exigido, para-raios (SPDA) com laudo",
    ],
  },
  "engenharia-civil": {
    text:
      "Para regularizar uma obra, laudar um imóvel ou investigar trincas e infiltrações, o engenheiro pode começar medindo o que existe e observando sinais que não aparecem a olho nu. Em serviços como esses, podem ser usados instrumentos de medição e de ensaio, muitos deles sem necessidade de quebrar a construção. O resultado entra no relatório técnico com ART.",
    items: [
      "Trena e medidor de distância a laser, para o desenho \"como construído\"",
      "Nível e estação total, para medidas e alturas do terreno e da obra",
      "Fissurômetro e medidor de umidade, para acompanhar trincas e infiltrações",
      "Câmera termográfica, que ajuda a achar infiltração sem quebrar a parede",
      "Esclerômetro e aparelho de ultrassom, para avaliar a qualidade do concreto",
    ],
  },
  "meio-ambiente-topografia": {
    text:
      "Medir um terreno ou um imóvel rural com precisão exige aparelhos que usam satélites e instrumentos de campo, seguindo as normas do INCRA e da ABNT. No georreferenciamento, o Manual Técnico do INCRA descreve os métodos aceitos, como receptores GNSS, estação total e, em certos casos, drones. Na parte ambiental, a coleta de amostras segue guias técnicos nacionais.",
    items: [
      "Receptor GNSS (GPS de precisão), com correção em tempo real (RTK) ou por ponto preciso (PPP)",
      "Estação total, com prisma, balizas e trena",
      "Nível e mira, para medir diferenças de altura",
      "Aeronave remotamente pilotada (drone) com câmera, nos casos em que o método é permitido",
      "Frascos e amostradores para coleta de água e sedimento",
    ],
  },
};

// Drawings of the real projects as Carousel slides (one image per slide).
// highlightsOnly = true: floor plan and front elevation only (used on the home page).
export const projectSlides = (highlightsOnly = false) =>
  PROJECTS.flatMap((p) =>
    p.items
      .filter((e) => !highlightsOnly || ["planta-baixa", "fachada"].includes(e.file))
      .map((e) => ({
        key: `${p.folder}-${e.file}`,
        src: `/exemplos/${p.folder}/${e.file}.webp`,
        imgHref: `/exemplos/${p.folder}/${e.file}.webp`,
        w: e.w,
        h: e.h,
        alt: e.alt,
        caption: `${p.name} · ${e.title}`,
        note: e.text,
        contain: true,
      }))
  );
