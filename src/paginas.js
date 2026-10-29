// Conteúdo das páginas internas do site (áreas de atuação, guias, quiz e privacidade).
// Texto simples, sem preços e sem prazos fixos. Normas citadas conforme o conhecimento
// disponível em 2026; cada caso é confirmado pela equipe antes de qualquer orçamento.

export const SITE_URL = "https://rdibiraengenharia.com.br";

export const AREAS = [
  {
    tipo: "area",
    slug: "seguranca-do-trabalho",
    situacoes: ["Contratei funcionários e não sei por onde começar: PGR, laudos ou treinamentos?","A empresa responde a uma ação trabalhista que pede laudo de insalubridade ou periculosidade.","Um empregado precisa do PPP e a empresa não tem o LTCAT.","Minha equipe trabalha com eletricidade, em altura ou em espaço confinado e precisa de treinamento."],
    nome: "Segurança do Trabalho",
    rotulo: "Segurança do Trabalho", // nome curto, igual em cartões, abas e listas
    assunto: "segurança do trabalho",
    icone: "fa-solid fa-helmet-safety",
    curto: "PGR, LTCAT, laudos de insalubridade e periculosidade e treinamentos.",
    title: "PGR, LTCAT e Laudos em Ibirá e região | RD Engenharia",
    description:
      "PGR, LTCAT, laudos de insalubridade e periculosidade, APR e treinamentos de NRs para empresas de Ibirá e região. Peça orçamento pelo WhatsApp.",
    h1: "Segurança do Trabalho para empresas da região",
    intro:
      "Elaboramos os programas e laudos exigidos pelas Normas Regulamentadoras para que a sua empresa trabalhe em dia com a lei e, principalmente, com menos risco de acidente. Atendemos comércios, indústrias, fazendas, clínicas e prefeituras.",
    itens: [
      {
        nome: "PGR — Programa de Gerenciamento de Riscos",
        exemplo: {"titulo":"PGR","sub":"Programa de Gerenciamento de Riscos","corpo":"tabela","art":true,"layout":"capa","doc":"Programa de Gerenciamento de Riscos","ref":"PGR · NR-01","sumario":["Identificação da organização","Inventário de riscos","Plano de ação"]},
        texto:
          "Documento da NR-1 que identifica os perigos do ambiente de trabalho, avalia os riscos e define as medidas de prevenção. É a base dos demais programas de segurança.",
        quem: "Empresas que contratam empregados, em geral. Microempresas e empresas de pequeno porte de menor risco podem ter tratamento simplificado.",
      },
      {
        nome: "PCMSO — integração com o programa médico",
        exemplo: {"titulo":"PGR × PCMSO","sub":"Informações do PGR para o programa médico","corpo":"checklist","layout":"capa","doc":"Integração entre PGR e PCMSO","ref":"Informações para o médico do trabalho","sumario":["Riscos por função","Exposições identificadas no PGR","Pontos para o programa médico"]},
        texto:
          "O PCMSO (NR-7) é coordenado por médico do trabalho. Orientamos a empresa e integramos as informações do PGR com o programa médico, para que os documentos conversem entre si.",
        quem: "Empresas com empregados.",
      },
      {
        nome: "LTCAT e PPP",
        exemplo: {"titulo":"LTCAT","sub":"Condições do ambiente de trabalho","corpo":"grafico","art":true,"layout":"capa","doc":"Laudo Técnico das Condições do Ambiente de Trabalho","ref":"LTCAT","sumario":["Descrição dos ambientes","Agentes nocivos avaliados","Conclusão por função"]},
        texto:
          "O LTCAT documenta os agentes nocivos presentes no trabalho e serve de base para o PPP, usado pela Previdência no reconhecimento de atividade especial para aposentadoria.",
        quem: "Empresas com trabalhadores expostos a agentes nocivos, como ruído, calor, poeira e produtos químicos.",
      },
      {
        nome: "Laudo de insalubridade (NR-15) e de periculosidade (NR-16)",
        exemplo: {"titulo":"LAUDO","sub":"Insalubridade e periculosidade","corpo":"medicao","art":true,"layout":"capa","doc":"Laudo de Insalubridade e Periculosidade","ref":"NR-15 e NR-16","sumario":["Atividades avaliadas","Avaliações e critérios","Conclusão por função"]},
        texto:
          "Avaliação técnica no local de trabalho para definir se há direito a adicional de insalubridade ou de periculosidade. Também é usado em defesa da empresa em ações trabalhistas.",
        quem: "Empresas que lidam com agentes nocivos, inflamáveis, explosivos ou eletricidade, e empresas que respondem a ações trabalhistas.",
      },
      {
        nome: "APR, Mapa de Risco e AET",
        exemplo: {"titulo":"APR","sub":"Análise preliminar de riscos","corpo":"apr","layout":"capa","doc":"Análise Preliminar de Riscos","ref":"Atividade não rotineira","sumario":["Descrição da atividade","Etapas, perigos e controles","Liberação da atividade"]},
        texto:
          "Análise Preliminar de Riscos para tarefas específicas, mapa de riscos do ambiente e Análise Ergonômica do Trabalho, conforme a atividade.",
        quem: "Empresas com tarefas de risco, obras e postos de trabalho com exigência ergonômica.",
      },
      {
        nome: "Treinamentos de NRs",
        exemplo: {"titulo":"CERTIFICADO","sub":"Treinamento de Norma Regulamentadora","corpo":"certificado","layout":"certificado","doc":"NR-35 · Trabalho em altura"},
        texto:
          "Capacitações como NR-5 (CIPA), NR-6 (EPI), NR-10 (eletricidade), NR-12 (máquinas), NR-18 (construção), NR-33 (espaço confinado) e NR-35 (trabalho em altura), além de primeiros socorros e combate a incêndio.",
        quem: "Colaboradores e gestores de empresas cuja atividade exige a capacitação.",
      },
    ],
    documentos: [
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
    tipo: "area",
    slug: "corpo-de-bombeiros",
    situacoes: ["Meu AVCB venceu ou está perto de vencer.","Vou abrir um comércio e não sei se preciso de AVCB ou de CLCB.","O imóvel precisa de projeto de rota de fuga, hidrantes ou alarme de incêndio.","O imóvel não tem licença do Corpo de Bombeiros."],
    nome: "Corpo de Bombeiros (AVCB e CLCB)",
    rotulo: "Corpo de Bombeiros",
    assunto: "AVCB e CLCB",
    icone: "fa-solid fa-fire-extinguisher",
    curto: "Projetos de segurança contra incêndio, AVCB e CLCB.",
    title: "AVCB, CLCB e Projeto de Incêndio em Ibirá | RD Engenharia",
    description:
      "Projeto de segurança contra incêndio (PSCIP), AVCB e CLCB para comércios, indústrias e imóveis de Ibirá e região. Peça orçamento pelo WhatsApp.",
    h1: "Projeto de incêndio, AVCB e CLCB",
    intro:
      "Cuidamos do projeto e da regularização da segurança contra incêndio do seu imóvel junto ao Corpo de Bombeiros do Estado de São Paulo, do enquadramento correto até a documentação final.",
    itens: [
      {
        nome: "PSCIP — Projeto de Segurança Contra Incêndio e Pânico",
        exemplo: {"titulo":"PSCIP","sub":"Projeto de segurança contra incêndio","corpo":"incendio","art":true,"layout":"prancha","doc":"Projeto de Segurança Contra Incêndio","ref":"Planta de medidas de segurança","escala":"1:100"},
        texto:
          "Projeto técnico que define as medidas de proteção exigidas para o seu imóvel, como extintores, sinalização, iluminação de emergência, alarme e hidrantes, conforme as Instruções Técnicas do Corpo de Bombeiros.",
        quem: "Edificações e áreas de risco que não se enquadram em processo simplificado.",
      },
      {
        nome: "AVCB — Auto de Vistoria do Corpo de Bombeiros",
        exemplo: {"titulo":"AVCB","sub":"Preparação para a vistoria","corpo":"checklist","layout":"capa","doc":"Preparação para Vistoria do AVCB","ref":"Lista de exigências","sumario":["Medidas de segurança exigidas","Situação de cada medida","Pendências antes da vistoria"]},
        texto:
          "Documento que comprova que a edificação cumpre as medidas de segurança contra incêndio, emitido após vistoria do Corpo de Bombeiros.",
        quem: "Comércios, indústrias, escolas, clínicas, condomínios e outros imóveis cuja ocupação exija o documento.",
      },
      {
        nome: "CLCB — Certificado de Licença do Corpo de Bombeiros",
        exemplo: {"titulo":"CLCB","sub":"Análise de enquadramento","corpo":"checklist","layout":"capa","doc":"Análise de Enquadramento para CLCB","ref":"Área, altura e ocupação","sumario":["Dados da edificação","Enquadramento","Medidas exigidas"]},
        texto:
          "Licença com processo mais simples, para edificações menores e de baixo risco. O enquadramento depende de área, altura e tipo de ocupação, e fazemos essa análise para você.",
        quem: "Estabelecimentos de pequeno porte e baixo risco, conforme a legislação paulista.",
      },
      {
        nome: "Projetos específicos",
        exemplo: {"titulo":"PROJETO","sub":"Rota de fuga, hidrantes e alarme","corpo":"rota","art":true,"layout":"prancha","doc":"Rota de Fuga e Hidrantes","ref":"Projeto específico","escala":"1:100"},
        texto:
          "Rota de fuga, hidrantes, sprinklers (chuveiros automáticos), detecção e alarme de incêndio, com ART do responsável técnico.",
        quem: "Imóveis em que o projeto exige sistemas fixos de proteção.",
      },
    ],
    documentos: [
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
    tipo: "area",
    slug: "engenharia-civil",
    situacoes: ["Construí sem projeto aprovado e quero regularizar.","Vou vender ou financiar o imóvel e preciso de laudo de vistoria ou de avaliação.","Vejo trincas ou infiltração e quero saber a causa.","Vou construir ou reformar e preciso de projeto e de alvará."],
    nome: "Engenharia Civil e Regularização",
    rotulo: "Engenharia Civil",
    assunto: "obra e regularização",
    icone: "fa-solid fa-building",
    curto: "Projetos, regularização de obras, laudos, inspeções e gerenciamento.",
    title: "Projetos e Regularização de Obras em Ibirá | RD Engenharia",
    description:
      "Projetos, regularização de obra (as-built e habite-se), laudos, perícias, inspeção predial e gerenciamento de obras em Ibirá e região.",
    h1: "Engenharia civil, projetos e regularização",
    intro:
      "Da planta ao habite-se: projetos, acompanhamento de obras, regularização de imóveis construídos sem documentação e laudos técnicos, sempre com ART de responsável técnico habilitado no CREA-SP.",
    itens: [
      {
        nome: "Projetos arquitetônicos, estruturais e complementares",
        exemplo: {"titulo":"PROJETO","sub":"Planta e memorial descritivo","corpo":"planta","art":true,"layout":"prancha","doc":"Projeto Arquitetônico","ref":"Planta baixa","escala":"1:50"},
        texto:
          "Projeto arquitetônico, fundações, projeto estrutural, drenagem, memorial descritivo e memória de cálculo, seguindo as normas da ABNT.",
        quem: "Quem vai construir, ampliar ou reformar.",
      },
      {
        nome: "Regularização de obra e habite-se",
        exemplo: {"titulo":"AS-BUILT","sub":"Levantamento do que foi construído","corpo":"asbuilt","art":true,"layout":"prancha","doc":"Levantamento Cadastral (As-built)","ref":"Planta baixa","escala":"1:50"},
        texto:
          "Levantamento do que foi construído (as-built), ART ou RRT, alvará, habite-se e demais documentos junto à prefeitura. As regras variam de município para município.",
        quem: "Proprietários de imóveis construídos sem projeto aprovado ou sem habite-se.",
      },
      {
        nome: "Gerenciamento e planejamento de obras",
        exemplo: {"titulo":"CRONOGRAMA","sub":"Cronograma físico-financeiro","corpo":"gantt","layout":"prancha","doc":"Cronograma Físico-Financeiro","ref":"Etapas da obra","escala":"Sem escala"},
        texto:
          "Orçamento, cronograma físico-financeiro, diário de obra, controle de qualidade e boletim de medição para acompanhar custo, prazo e qualidade da obra.",
        quem: "Construtoras, empresas e proprietários que querem controle sobre a obra.",
      },
      {
        nome: "Inspeção predial e laudos de patologias",
        exemplo: {"titulo":"INSPEÇÃO","sub":"Laudo de patologias","corpo":"fachada","art":true,"layout":"capa","doc":"Laudo de Inspeção Predial","ref":"Patologias da edificação","sumario":["Vistoria por sistema","Anomalias e grau de risco","Recomendações"]},
        texto:
          "Inspeção de fachada, estrutura, impermeabilização e instalações, com relatório técnico e orientação de manutenção preventiva.",
        quem: "Condomínios, comércios e proprietários que notam trincas, infiltração ou desgaste.",
      },
      {
        nome: "Laudos e perícias",
        exemplo: {"titulo":"LAUDO","sub":"Vistoria e avaliação de imóvel","corpo":"laudo","art":true,"layout":"capa","doc":"Laudo Técnico de Vistoria","ref":"Imóvel residencial","sumario":["Objeto e objetivo","Vistoria e registros","Conclusão"]},
        texto:
          "Laudo de vistoria, de avaliação de imóvel, estrutural e perícia, para fins de financiamento, seguro, negociação ou processo judicial.",
        quem: "Quem precisa de um parecer técnico formal sobre um imóvel.",
      },
    ],
    documentos: [
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
    tipo: "area",
    slug: "meio-ambiente-topografia",
    situacoes: ["Vou vender ou dividir o imóvel rural e preciso de georreferenciamento.","Nunca fiz o CAR da propriedade.","Uso água de poço, represa ou rio e quero saber se preciso de outorga.","Preciso de planta ou das medidas do terreno antes de construir ou dividir."],
    nome: "Meio Ambiente, Topografia e Imóvel Rural",
    rotulo: "Meio Ambiente e Topografia",
    assunto: "imóvel rural e topografia",
    icone: "fa-solid fa-leaf",
    curto: "CAR, licenciamento, outorga, resíduos, topografia e georreferenciamento.",
    title: "CAR, Georreferenciamento e Topografia | RD Engenharia",
    description:
      "CAR, georreferenciamento de imóvel rural, topografia, licenciamento ambiental, outorga e gestão de resíduos em Ibirá e região.",
    h1: "Meio ambiente, topografia e imóvel rural",
    intro:
      "Regularização ambiental, levantamentos de terreno e documentação de propriedades rurais e urbanas. Unimos a parte ambiental e a topografia para resolver o processo de ponta a ponta.",
    itens: [
      {
        nome: "CAR — Cadastro Ambiental Rural",
        exemplo: {"titulo":"CAR","sub":"Cadastro ambiental rural","corpo":"car","layout":"prancha","doc":"Mapa do Imóvel para o CAR","ref":"APP e reserva legal","escala":"1:5.000"},
        texto:
          "Cadastro eletrônico obrigatório dos imóveis rurais, previsto no Código Florestal, que reúne as informações ambientais da propriedade e é base para a regularização ambiental.",
        quem: "Proprietários e possuidores de imóveis rurais.",
      },
      {
        nome: "Georreferenciamento de imóvel rural",
        exemplo: {"titulo":"MEMORIAL","sub":"Georreferenciamento do imóvel","corpo":"terreno","art":true,"layout":"prancha","doc":"Planta do Imóvel Georreferenciado","ref":"Vértices e confrontações","escala":"1:5.000"},
        texto:
          "Levantamento que define os limites do imóvel com coordenadas oficiais e é certificado junto ao INCRA, exigido em situações como desmembramento e transferência de propriedade.",
        quem: "Quem vai vender, dividir ou regularizar um imóvel rural.",
      },
      {
        nome: "Topografia",
        exemplo: {"titulo":"LEVANTAMENTO","sub":"Planta e curvas de nível","corpo":"curvas","art":true,"layout":"prancha","doc":"Levantamento Planialtimétrico","ref":"Curvas de nível","escala":"1:1.000"},
        texto:
          "Levantamento planialtimétrico, locação de obras, divisão de glebas, planta cadastral, curvas de nível e cálculo de volume.",
        quem: "Quem vai construir, dividir um terreno ou precisa conhecer as medidas e o relevo da área.",
      },
      {
        nome: "Licenciamento ambiental e outorga",
        exemplo: {"titulo":"LICENÇA","sub":"Licenciamento e outorga","corpo":"fluxo","layout":"capa","doc":"Licenciamento Ambiental e Outorga","ref":"Acompanhamento do processo","cliente":"empresa","sumario":["Atividade e enquadramento","Documentos exigidos","Andamento do processo"]},
        texto:
          "Orientação e condução de licenças (prévia, de instalação e de operação) e da outorga de uso da água, conforme a atividade e o órgão responsável.",
        quem: "Empreendimentos e atividades que impactam o meio ambiente ou usam recursos hídricos.",
      },
      {
        nome: "Gestão de resíduos e gestão ambiental",
        exemplo: {"titulo":"PGRS","sub":"Plano de gestão de resíduos","corpo":"residuos","layout":"capa","doc":"Plano de Gerenciamento de Resíduos Sólidos","ref":"PGRS","cliente":"empresa","sumario":["Resíduos gerados","Acondicionamento e destino","Responsáveis e registros"]},
        texto:
          "PGRS e PGRSS, inventário e manifesto de resíduos e planos de ação ambiental para empresas, clínicas, indústrias e propriedades.",
        quem: "Empresas que geram resíduos e precisam comprovar o destino correto.",
      },
    ],
    documentos: [
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

export const GUIAS = [
  {
    tipo: "guia",
    slug: "guias/quando-minha-empresa-precisa-de-pgr",
    title: "Quando minha empresa precisa de PGR? | Guia RD Engenharia",
    description:
      "Entenda o que é o PGR da NR-1, quem precisa elaborar e o que o programa deve conter. Guia da RD Engenharia, Ibirá/SP.",
    h1: "Quando minha empresa precisa de PGR?",
    area: "seguranca-do-trabalho",
    servico: "PGR (Programa de Gerenciamento de Riscos)",
    paragrafos: [
      "O PGR, ou Programa de Gerenciamento de Riscos, é o documento previsto na NR-1 que reúne a identificação dos perigos do ambiente de trabalho, a avaliação dos riscos e as medidas para controlá-los. Ele substituiu o antigo PPRA e é a base para os demais documentos de segurança da empresa.",
      "Em regra, o PGR é exigido de organizações que contratam trabalhadores como empregados. Microempreendedores individuais sem funcionários ficam, em geral, fora dessa obrigação. Já microempresas e empresas de pequeno porte de menor grau de risco podem ter tratamento simplificado, conforme a própria NR-1.",
      "O programa é composto, principalmente, pelo inventário de riscos e pelo plano de ação. O inventário descreve os perigos de cada função e ambiente, e o plano de ação define o que será feito, por quem e quando. A NR-1 também determina que os fatores de risco psicossociais sejam considerados no gerenciamento de riscos.",
      "O PGR precisa ser revisado periodicamente e sempre que houver mudança relevante na empresa, como nova máquina, nova atividade ou acidente. Por isso, um documento antigo e parado em uma gaveta não cumpre o seu papel.",
      "Não existe um modelo único: o conteúdo depende da atividade, do número de funcionários e do local de trabalho. Uma visita ou a análise das informações da empresa é o caminho para saber exatamente o que é preciso.",
    ],
  },
  {
    tipo: "guia",
    slug: "guias/avcb-ou-clcb-qual-a-diferenca",
    title: "AVCB ou CLCB: qual a diferença? | Guia RD Engenharia",
    description:
      "Entenda a diferença entre AVCB e CLCB no Estado de São Paulo e como saber qual licença do Corpo de Bombeiros o seu imóvel precisa.",
    h1: "AVCB ou CLCB: qual a diferença?",
    area: "corpo-de-bombeiros",
    servico: "AVCB / CLCB (Corpo de Bombeiros)",
    paragrafos: [
      "No Estado de São Paulo, todo imóvel que exige segurança contra incêndio precisa de uma licença do Corpo de Bombeiros. As duas mais comuns são o AVCB e o CLCB.",
      "O AVCB (Auto de Vistoria do Corpo de Bombeiros) é o documento que atesta que a edificação cumpre as medidas de segurança contra incêndio exigidas para ela. Ele é emitido depois da análise do projeto e da vistoria do Corpo de Bombeiros.",
      "O CLCB (Certificado de Licença do Corpo de Bombeiros) é uma licença de processo mais simples, destinada a edificações menores e de baixo risco. Os limites de área, de altura e de carga de incêndio que definem esse enquadramento estão na legislação paulista e nas Instruções Técnicas do Corpo de Bombeiros.",
      "Por isso, a pergunta correta não é qual das duas é melhor, e sim em qual delas o seu imóvel se enquadra. Isso depende da área construída, do número de pavimentos e do que é feito no local, seja comércio, indústria, escola, clínica ou outra ocupação.",
      "Qualquer que seja a licença, ela tem prazo de validade e precisa ser renovada. Funcionar com a licença vencida expõe o proprietário a multa, a interdição e, principalmente, a risco real para quem circula no local.",
    ],
  },
  {
    tipo: "guia",
    slug: "guias/georreferenciamento-quando-e-obrigatorio",
    title: "Georreferenciamento: quando é obrigatório? | RD Engenharia",
    description:
      "Saiba o que é o georreferenciamento de imóvel rural, quando ele é exigido pelo INCRA e como se preparar. Guia da RD Engenharia, Ibirá/SP.",
    h1: "Georreferenciamento de imóvel rural: quando é obrigatório?",
    area: "meio-ambiente-topografia",
    servico: "Georreferenciamento de imóvel rural",
    paragrafos: [
      "O georreferenciamento é o levantamento que descreve os limites de um imóvel rural com coordenadas oficiais. Ele é previsto na Lei 10.267/2001 e certificado pelo INCRA, que confere se a área não se sobrepõe à de nenhum vizinho.",
      "A exigência aparece quando o imóvel passa por alguma alteração na matrícula, como desmembramento, parcelamento, remembramento ou transferência de propriedade, seja por venda, doação ou outra forma. Sem a certificação, o cartório não faz o registro.",
      "Os prazos para a exigência foram escalonados por tamanho do imóvel. Em regra, hoje ela alcança imóveis de todos os tamanhos, mas confirmamos o seu caso, porque a regra pode ser ajustada pelo INCRA.",
      "O trabalho é feito por profissional habilitado e credenciado, com equipamento de precisão e ART. Ele começa com a análise da matrícula e a visita ao imóvel, e termina com a certificação e a averbação no cartório.",
      "Para começar, separe a matrícula do imóvel, o CCIR e o ITR atualizados, e informe o que você pretende fazer: vender, dividir ou apenas regularizar.",
    ],
  },
  {
    tipo: "guia",
    slug: "guias/laudo-de-insalubridade-como-funciona",
    title: "Laudo de insalubridade: como funciona? | Guia RD Engenharia",
    description:
      "Entenda o que é o laudo de insalubridade, quem pode elaborá-lo, como os graus do adicional são definidos e quando a empresa precisa dele.",
    h1: "Laudo de insalubridade: como funciona?",
    area: "seguranca-do-trabalho",
    servico: "Laudo de insalubridade",
    paragrafos: [
      "A insalubridade é a exposição do trabalhador a agentes nocivos à saúde acima dos limites previstos na NR-15, como ruído, calor, agentes químicos, poeira e agentes biológicos. Quando ela existe e não é neutralizada, o trabalhador tem direito a um adicional sobre o salário.",
      "O laudo de insalubridade é o documento técnico que comprova se há ou não essa exposição. A CLT prevê que a caracterização seja feita por perícia de médico do trabalho ou de engenheiro de segurança do trabalho registrado no órgão competente.",
      "O trabalho começa com uma visita ao local, observando as tarefas, o tempo de exposição e os equipamentos usados. Quando necessário, são feitas medições, como a do nível de ruído. Os resultados são comparados com os limites da norma.",
      "Se houver insalubridade, o laudo indica o grau (mínimo, médio ou máximo), que define o percentual do adicional, calculado conforme a CLT. O laudo também registra se há medidas que eliminam ou neutralizam o agente, como o uso correto de EPI com certificado de aprovação, o que pode afastar o direito ao adicional.",
      "Para a empresa, o laudo serve para pagar o adicional corretamente, quando devido, e para se defender em ações trabalhistas. Ele deve ser atualizado quando mudam o ambiente, as máquinas ou as atividades.",
    ],
  },
  {
    tipo: "guia",
    slug: "guias/o-que-e-art-anotacao-de-responsabilidade-tecnica",
    title: "O que é ART e quando é obrigatória? | RD Engenharia",
    description:
      "Entenda o que é a ART, quando ela é obrigatória e por que ela protege quem contrata um serviço de engenharia.",
    h1: "O que é ART e quando ela é obrigatória?",
    area: "engenharia-civil",
    servico: "Serviço de engenharia com ART",
    paragrafos: [
      "A ART, ou Anotação de Responsabilidade Técnica, é o documento que registra no CREA qual profissional é responsável por um serviço de engenharia. Ela está prevista na Lei 6.496/1977.",
      "Em geral, a ART é exigida em projetos, obras, laudos, perícias, topografia, projetos de incêndio e outros serviços técnicos regulamentados. Sem ela, o serviço pode ficar sem validade perante órgãos como prefeituras e o Corpo de Bombeiros, e o profissional e o contratante ficam expostos a problemas.",
      "Para quem contrata, a ART mostra quem assinou o trabalho, qual é o serviço contratado e o período de execução. Se houver erro ou dano, é possível identificar quem responde tecnicamente por ele, e isso protege o cliente.",
      "A ART é emitida pelo profissional, no sistema do CREA, e vinculada ao contrato. Ela é paga por serviço, e o valor é definido pelo conselho. Por isso, vale sempre pedir a ART junto com o orçamento e guardar uma cópia.",
      "Desconfie de quem oferece serviços de engenharia sem ART ou sem registro no CREA. Você pode conferir o registro do profissional no site do conselho.",
    ],
  },
  {
    tipo: "guia",
    slug: "guias/habite-se-o-que-e-e-como-conseguir",
    title: "Habite-se: o que é e como conseguir | Guia RD Engenharia",
    description:
      "Entenda o que é o habite-se, para que serve e que documentos costumam ser necessários para conseguir o seu na prefeitura.",
    h1: "Habite-se: o que é e como conseguir",
    area: "engenharia-civil",
    servico: "Habite-se e regularização de obra",
    paragrafos: [
      "O habite-se é o documento da prefeitura que atesta que a obra foi concluída de acordo com o projeto aprovado e pode ser usada. Ele é pedido para ligar serviços em definitivo, para averbar a construção na matrícula do imóvel e para vender ou financiar.",
      "Cada município tem as suas regras, mas, em geral, o processo exige o projeto aprovado e o alvará de construção, a ART ou RRT do responsável técnico, a vistoria da prefeitura e a regularização da obra junto à Receita Federal e ao INSS. Em imóveis que exigem, também é preciso apresentar a licença do Corpo de Bombeiros.",
      "Quando a obra foi construída sem projeto, ou com diferenças em relação ao que foi aprovado, o primeiro passo é levantar o que existe no local e fazer o projeto como construído (as-built). Depois, verifica-se se a obra atende às regras de uso e ocupação do solo do município.",
      "Em alguns casos, pode ser necessário adequar a construção antes da aprovação, ou pagar multas previstas na legislação municipal. A viabilidade e os custos dependem de cada caso, por isso a análise dos documentos vem primeiro.",
      "Se você já tem plantas, alvará ou certidões, separe tudo. Isso acelera a análise e evita retrabalho.",
    ],
  },
  {
    tipo: "guia",
    slug: "guias/car-cadastro-ambiental-rural",
    title: "CAR: o que é o Cadastro Ambiental Rural | Guia RD Engenharia",
    description:
      "Entenda o que é o CAR, quem precisa fazer, o que ele contém e por que ele importa para o produtor rural.",
    h1: "CAR: o que é e por que o produtor rural precisa dele",
    area: "meio-ambiente-topografia",
    servico: "CAR (Cadastro Ambiental Rural)",
    paragrafos: [
      "O CAR, ou Cadastro Ambiental Rural, é um registro eletrônico e obrigatório para os imóveis rurais, criado pelo Código Florestal (Lei 12.651/2012). Ele reúne, em um mapa, os limites da propriedade, as áreas de vegetação nativa, as áreas de preservação permanente e a reserva legal.",
      "O cadastro é feito no sistema oficial, o SICAR, a partir de informações declaradas pelo proprietário ou possuidor, com apoio de imagens de satélite e de um levantamento do imóvel. Por ser autodeclaratório, as informações precisam ser corretas, porque o órgão ambiental pode analisá-las depois.",
      "O CAR é a base da regularização ambiental da propriedade. Quando há áreas que precisam ser recuperadas, ele é a porta de entrada para os programas de regularização previstos em lei. Em geral, o produtor também precisa comprovar o CAR para obter crédito rural.",
      "Ter o CAR não significa que a propriedade está regular. Significa que ela está cadastrada e pode ser analisada. Por isso, vale revisar se os dados batem com a realidade do imóvel, principalmente se a propriedade foi dividida ou vendida.",
      "Para começar, separe a matrícula, o CCIR e o ITR do imóvel, e informe a localização da propriedade. Se você já tem o recibo de inscrição do CAR, também ajuda.",
    ],
  },
  {
    tipo: "guia",
    slug: "guias/ltcat-e-ppp-para-que-servem",
    title: "LTCAT e PPP: para que servem | Guia RD Engenharia",
    description:
      "Entenda a diferença entre LTCAT e PPP, quem precisa emitir e como eles se relacionam com a aposentadoria especial.",
    h1: "LTCAT e PPP: para que servem e como se relacionam",
    area: "seguranca-do-trabalho",
    servico: "LTCAT e PPP",
    paragrafos: [
      "O LTCAT (Laudo Técnico das Condições do Ambiente de Trabalho) é o documento que identifica os agentes nocivos presentes no trabalho, como ruído, calor, poeira e produtos químicos, e avalia a exposição dos trabalhadores a eles.",
      "O PPP (Perfil Profissiográfico Previdenciário) é o documento individual de cada trabalhador, emitido pela empresa. Ele resume o histórico do trabalhador e as exposições a agentes nocivos ao longo do tempo, com base nas informações do LTCAT e de outros programas de segurança.",
      "Os dois documentos são usados pela Previdência para avaliar se o trabalhador teve atividade especial, que pode reduzir o tempo necessário para a aposentadoria. Por isso, as informações precisam ser verdadeiras e atualizadas: erros prejudicam o trabalhador e geram risco para a empresa.",
      "A empresa deve emitir o PPP quando o trabalhador pede e quando o contrato termina, e manter o LTCAT atualizado quando há mudança no ambiente, nas máquinas ou nas atividades.",
      "A elaboração do LTCAT exige visita ao local e profissional habilitado. Se a sua empresa nunca fez o laudo, ou se o último é muito antigo, vale revisar.",
    ],
  },
];

// "Em resumo" no topo de cada guia: 3 pontos tirados do próprio texto do guia (nada novo aqui).
export const RESUMOS_GUIAS = {
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


export const PAGINAS = [
  ...AREAS,
  ...GUIAS,
  {
    tipo: "onde",
    slug: "onde-atendemos",
    title: "Onde atendemos: Ibirá e região | RD Engenharia",
    description: "Atendemos presencialmente e online em Ibirá e região. Conte onde fica o seu imóvel ou a sua empresa pelo WhatsApp e confirmamos o atendimento.",
    h1: "Atendemos presencialmente e online em Ibirá e região",
  },
  {
    tipo: "quiz",
    slug: "o-que-preciso",
    title: "O que o seu caso precisa? Passo a passo | RD Engenharia",
    description:
      "Responda uma pergunta por vez e descubra quais documentos e serviços técnicos o seu caso provavelmente exige. Depois peça orçamento pelo WhatsApp.",
    h1: "Descubra o que o seu caso precisa",
  },
  {
    tipo: "guias-indice",
    slug: "guias",
    title: "Guias e artigos | RD Engenharia",
    description:
      "Guias curtos sobre PGR, LTCAT, laudos, AVCB, CLCB, ART, habite-se, CAR e georreferenciamento, escritos pela equipe da RD Engenharia.",
    h1: "Guias e artigos",
  },
  {
    tipo: "lembrete",
    slug: "lembrete-de-vencimento",
    title: "Lembrete de vencimento dos seus documentos | RD Engenharia",
    description:
      "Peça um aviso por WhatsApp antes do vencimento do AVCB, laudos, PGR e outros documentos, para não perder o prazo de renovação.",
    h1: "Lembrete de vencimento dos seus documentos",
  },
  {
    tipo: "privacidade",
    slug: "privacidade",
    title: "Política de Privacidade | RD Engenharia",
    description: "Como o site da RD Engenharia trata os dados de quem entra em contato.",
    h1: "Política de Privacidade",
  },
  {
    tipo: "creditos",
    slug: "creditos",
    title: "Créditos das imagens | RD Engenharia",
    description: "Origem, autor e licença de cada foto ilustrativa usada no site da RD Engenharia.",
    h1: "Créditos das imagens",
  },
];

export const DOCUMENTOS_LEMBRETE = [
  "AVCB ou CLCB (Corpo de Bombeiros)",
  "PGR (gerenciamento de riscos)",
  "LTCAT / PPP",
  "Laudo de insalubridade ou periculosidade",
  "Treinamento de NR (CIPA, NR-35, NR-10 etc.)",
  "Alvará ou licença",
  "CAR, licença ambiental ou outorga",
  "Outro documento",
];

export const URL_AVALIACOES_GOOGLE =
  "https://www.google.com/maps/place/RD+Engenharia+Seguran%C3%A7a+e+Meio+Ambiente/@-21.0824485,-49.2433844,1046m/data=!3m2!1e3!4b1!4m6!3m5!1s0x94bc3184084c66fb:0x9998e55c89839066!8m2!3d-21.0824485!4d-49.2433844!16s%2Fg%2F11fky31jy7";
// Endereço da empresa e links do Google Maps (o mesmo cartão do Google usado nas avaliações).
export const ENDERECO = "Rua José Alves de Mello, 770, Centro, Ibirá/SP";
export const URL_COMO_CHEGAR = "https://www.google.com/maps/dir/?api=1&destination=-21.0824485,-49.2433844";
export const MAPA_EMBED = "https://maps.google.com/maps?q=-21.0824485,-49.2433844&z=16&output=embed";
// Nota verificada no perfil do Google em 20/10/2026 e de novo em 26/10/2026. Atualizar à mão; não usar marcação AggregateRating.
export const NOTA_GOOGLE = "5,0 no Google · 8 avaliações";

// Avaliações do Google mostradas na página inicial. O Rafael autorizou em 26/10/2026 publicar os textos
// e os primeiros nomes. Regras: texto EXATAMENTE como está no Google (sem editar nem resumir), só o
// primeiro nome, só avaliações que têm texto. Sem marcação Review/AggregateRating no JSON-LD.
// Formato: { nome: "Primeiro nome", texto: "Texto como está no Google", estrelas: 5 }
export const AVALIACOES = [];

// Orientação de prazo mostrada na página do lembrete. Cada documento traz a própria validade;
// a norma só fixa prazo em alguns casos. Confirmamos o prazo exato de cada caso na renovação.
export const DICAS_LEMBRETE = {
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

export const achaPagina = (slug) => PAGINAS.find((p) => p.slug === slug);
export const achaArea = (slug) => AREAS.find((p) => p.slug === slug);


// Guia "o que preciso?": cada situação aponta para os documentos/serviços prováveis.
export const PERFIS = [
  {
    id: "empresa",
    nome: "Tenho uma empresa ou comércio",
    icone: "fa-solid fa-shop",
    situacoes: [
      { texto: "Tenho funcionários registrados", itens: ["pgr"] },
      { texto: "Meus funcionários lidam com ruído, calor, poeira ou produtos químicos", itens: ["ltcat", "insalubridade"] },
      { texto: "Trabalham com inflamáveis, eletricidade ou explosivos", itens: ["periculosidade"] },
      { texto: "Meu estabelecimento não tem AVCB/CLCB ou a licença está vencida", itens: ["bombeiros"] },
      { texto: "Vou abrir ou regularizar a empresa e preciso de alvará", itens: ["alvara", "bombeiros"] },
      { texto: "Minha equipe trabalha em altura, com eletricidade ou em espaço confinado", itens: ["treinamentos"] },
      { texto: "Gero resíduos (clínica, indústria, oficina, obra)", itens: ["residuos"] },
    ],
  },
  {
    id: "rural",
    nome: "Tenho um imóvel rural",
    icone: "fa-solid fa-tractor",
    situacoes: [
      { texto: "Vou vender, dividir ou desmembrar a propriedade", itens: ["georref"] },
      { texto: "Nunca fiz o CAR (Cadastro Ambiental Rural)", itens: ["car"] },
      { texto: "Uso água de poço, represa ou rio na propriedade", itens: ["outorga"] },
      { texto: "Preciso de planta, medição ou divisão de áreas", itens: ["topografia"] },
      { texto: "Minha atividade pode exigir licença ambiental", itens: ["licenciamento"] },
    ],
  },
  {
    id: "urbano",
    nome: "Tenho obra ou imóvel urbano",
    icone: "fa-solid fa-house",
    situacoes: [
      { texto: "Vou construir, ampliar ou reformar", itens: ["projetos", "alvara"] },
      { texto: "Construí sem projeto aprovado ou sem habite-se", itens: ["regularizacao"] },
      { texto: "Preciso de laudo para vender, financiar ou fazer seguro do imóvel", itens: ["laudos"] },
      { texto: "Vejo trincas, infiltração ou problemas na estrutura", itens: ["inspecao"] },
      { texto: "Preciso de levantamento ou medidas do terreno", itens: ["topografia"] },
      { texto: "Meu imóvel comercial precisa de licença do Corpo de Bombeiros", itens: ["bombeiros"] },
    ],
  },
];

export const RESULTADOS = {
  pgr: { nome: "PGR (Programa de Gerenciamento de Riscos)", area: "seguranca-do-trabalho", texto: "Exigido, em regra, de empresas com empregados." },
  ltcat: { nome: "LTCAT e PPP", area: "seguranca-do-trabalho", texto: "Documenta os agentes nocivos e serve de base para a aposentadoria especial." },
  insalubridade: { nome: "Laudo de insalubridade", area: "seguranca-do-trabalho", texto: "Avalia se há direito ao adicional por exposição a agentes nocivos." },
  periculosidade: { nome: "Laudo de periculosidade", area: "seguranca-do-trabalho", texto: "Avalia atividades de risco acentuado, como inflamáveis e eletricidade." },
  treinamentos: { nome: "Treinamentos de NRs", area: "seguranca-do-trabalho", texto: "Capacitações como NR-35, NR-10 e NR-33, conforme a atividade." },
  bombeiros: { nome: "AVCB ou CLCB (Corpo de Bombeiros)", area: "corpo-de-bombeiros", texto: "Verificamos qual licença se aplica ao seu imóvel." },
  alvara: { nome: "Alvará e documentação na prefeitura", area: "engenharia-civil", texto: "Alvará de construção ou de funcionamento, conforme o caso." },
  residuos: { nome: "Plano de gerenciamento de resíduos (PGRS/PGRSS)", area: "meio-ambiente-topografia", texto: "Comprova o destino correto dos resíduos gerados." },
  georref: { nome: "Georreferenciamento do imóvel rural", area: "meio-ambiente-topografia", texto: "Em regra, exigido para desmembrar ou transferir imóvel rural." },
  car: { nome: "CAR (Cadastro Ambiental Rural)", area: "meio-ambiente-topografia", texto: "Cadastro obrigatório dos imóveis rurais." },
  outorga: { nome: "Outorga de uso da água", area: "meio-ambiente-topografia", texto: "Pode ser necessária para captar água de poço, represa ou rio." },
  topografia: { nome: "Levantamento topográfico", area: "meio-ambiente-topografia", texto: "Medidas, relevo e divisão do terreno." },
  licenciamento: { nome: "Licenciamento ambiental", area: "meio-ambiente-topografia", texto: "Indicamos qual licença ou dispensa se aplica à atividade." },
  projetos: { nome: "Projetos e ART", area: "engenharia-civil", texto: "Projeto arquitetônico, estrutural e acompanhamento da obra." },
  regularizacao: { nome: "Regularização de obra (as-built e habite-se)", area: "engenharia-civil", texto: "Levantamento do construído e documentação na prefeitura." },
  laudos: { nome: "Laudo de vistoria ou avaliação de imóvel", area: "engenharia-civil", texto: "Parecer técnico formal para venda, financiamento ou seguro." },
  inspecao: { nome: "Inspeção predial e laudo de patologias", area: "engenharia-civil", texto: "Diagnóstico de trincas, infiltrações e problemas estruturais." },
};

const ITENS_RESIDENCIA = [
  { arq: "planta-baixa", forma: "alto", w: 829, h: 1631, titulo: "Planta baixa", texto: "Residência térrea de 105 m², com 2 suítes, closet e sala integrada à cozinha gourmet.", alt: "Planta baixa de uma residência térrea com duas suítes, closet, sala e cozinha integradas" },
  { arq: "cobertura-implantacao", w: 788, h: 895, titulo: "Cobertura e implantação", texto: "Posição da casa no terreno e desenho do telhado, com os recuos e beirais.", alt: "Plantas de cobertura e de implantação de uma residência térrea" },
  { arq: "fachada", w: 624, h: 392, titulo: "Fachada frontal", texto: "Vista da frente da casa, com telhado cerâmico e esquadrias.", alt: "Fachada frontal de uma residência térrea com telhado cerâmico" },
  { arq: "cortes", forma: "largo", w: 1864, h: 448, titulo: "Cortes e detalhe da calçada", texto: "Cortes AA e BB, com alturas e inclinação do telhado, e detalhe da calçada.", alt: "Cortes AA e BB e detalhe da calçada de uma residência térrea" },
  { arq: "quadros", forma: "largo", w: 901, h: 321, titulo: "Quadro de aberturas", texto: "Áreas, iluminação e ventilação de cada ambiente, conforme exigido na aprovação.", alt: "Quadro com áreas e aberturas de iluminação e ventilação dos ambientes" },
];

const ITENS_COMPACTA = [
  { arq: "planta-baixa", forma: "alto", w: 768, h: 1497, titulo: "Planta baixa", texto: "Casa térrea de cerca de 62 m², com 2 dormitórios, banheiro e cozinha integrada à sala, e área permeável no fundo do lote.", alt: "Planta baixa de uma casa térrea com dois dormitórios, banheiro, cozinha integrada à sala, área de serviço e área permeável" },
  { arq: "cobertura-implantacao", w: 766, h: 838, titulo: "Cobertura e implantação", texto: "Posição da casa no lote de 10 × 22 m e desenho do telhado, com os recuos exigidos.", alt: "Plantas de cobertura e de implantação de uma casa térrea em lote retangular" },
  { arq: "fachada", w: 544, h: 332, titulo: "Fachada frontal", texto: "Vista da frente da casa, com platibanda e esquadrias.", alt: "Fachada frontal de uma casa térrea com platibanda, porta e duas janelas" },
  { arq: "cortes", forma: "largo", w: 1833, h: 515, titulo: "Cortes e detalhe da calçada", texto: "Cortes AA e BB, com pé-direito, forro e cobertura metálica, e detalhe da calçada.", alt: "Cortes AA e BB de uma casa térrea e detalhe da calçada com árvore" },
  { arq: "quadros", forma: "largo", w: 893, h: 207, titulo: "Quadro de aberturas", texto: "Áreas, iluminação e ventilação de cada ambiente, conforme exigido na aprovação.", alt: "Quadro com as áreas e as aberturas de cada ambiente da casa" },
];

// Para incluir outro projeto: crie a pasta public/exemplos/<pasta> com os mesmos 5 arquivos
// (qualquer quantidade de imagens; forma: "alto" ocupa duas linhas, "largo" ocupa a linha toda).
// Exemplo de arquivos: (planta-baixa, cobertura-implantacao, fachada, cortes, quadros) e acrescente um item aqui.
export const PROJETOS = [
  {
    pasta: "residencia-terrea",
    nome: "Residência térrea",
    resumo: "105 m² · 2 suítes · terreno de 11 × 25 m",
    itens: ITENS_RESIDENCIA,
  },
  {
    pasta: "residencia-compacta",
    nome: "Casa térrea compacta",
    resumo: "62 m² · 2 dormitórios · lote de 10 × 22 m",
    itens: ITENS_COMPACTA,
  },
];

// Resumo rápido e etapas de cada área (sem prazos nem valores fixos).
export const VISUAL = {
  "seguranca-do-trabalho": {
    quem: "Empresas com empregados, de qualquer porte.",
    recebe: "Programas e laudos assinados por profissional habilitado, prontos para uma fiscalização.",
    etapas: [
      { t: "Conversa no WhatsApp", d: "Você conta o ramo da empresa e quantos funcionários tem." },
      { t: "Visita ao local", d: "Olhamos os ambientes, as máquinas e as tarefas de cada função." },
      { t: "Elaboração", d: "Preparamos o programa ou o laudo com base no que foi visto." },
      { t: "Entrega e acompanhamento", d: "Entregamos os documentos e avisamos antes de vencerem." },
    ],
  },
  "corpo-de-bombeiros": {
    quem: "Comércios, indústrias, escolas, clínicas e condomínios.",
    recebe: "Projeto, protocolo e licença do Corpo de Bombeiros (AVCB ou CLCB), conforme o enquadramento.",
    etapas: [
      { t: "Enquadramento", d: "Com área, altura e uso do imóvel, definimos qual licença é exigida." },
      { t: "Levantamento no imóvel", d: "Medimos e anotamos o que já existe de proteção contra incêndio." },
      { t: "Projeto e protocolo", d: "Elaboramos o projeto e protocolamos junto ao Corpo de Bombeiros." },
      { t: "Vistoria e licença", d: "Orientamos as adequações e acompanhamos até a emissão." },
    ],
  },
  "engenharia-civil": {
    quem: "Quem vai construir, reformar, vender ou regularizar um imóvel.",
    recebe: "Projetos, regularização, laudos e documentos prontos para a prefeitura, com ART.",
    etapas: [
      { t: "Conversa e documentos", d: "Você envia matrícula, fotos e conta o que pretende fazer." },
      { t: "Visita e levantamento", d: "Medimos o imóvel e verificamos a situação real da obra." },
      { t: "Projeto ou regularização", d: "Elaboramos os projetos e protocolamos na prefeitura." },
      { t: "Alvará ou habite-se", d: "Acompanhamos o processo até a liberação dos documentos." },
    ],
  },
  "meio-ambiente-topografia": {
    quem: "Proprietários rurais, empresas e quem vai dividir ou vender um terreno.",
    recebe: "Cadastros, levantamentos e certificações, conforme o caso.",
    etapas: [
      { t: "Análise dos documentos", d: "Conferimos matrícula, CCIR e a finalidade do trabalho." },
      { t: "Trabalho de campo", d: "Medimos a área com equipamento de precisão." },
      { t: "Elaboração", d: "Montamos mapas, memoriais e o cadastro ou pedido de licença." },
      { t: "Entrega e acompanhamento", d: "Conduzimos o processo no órgão responsável até a conclusão." },
    ],
  },
};

// Comparativo AVCB x CLCB (página de Corpo de Bombeiros e guia). Só reúne o que o site já afirma
// nos textos da área e do guia; os limites exatos de área, altura e ocupação NÃO são citados aqui.
export const COMPARATIVO_BOMBEIROS = {
  colunas: [
    { sigla: "AVCB", nome: "Auto de Vistoria do Corpo de Bombeiros" },
    { sigla: "CLCB", nome: "Certificado de Licença do Corpo de Bombeiros" },
  ],
  linhas: [
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
  nota: "Resumo geral, conforme a legislação paulista conhecida em 2026. O enquadramento depende da área construída, da altura e do uso do imóvel, e a equipe confirma cada caso.",
  zap: "Olá! Quero saber se o meu imóvel precisa de AVCB ou de CLCB.\nUso do imóvel (comércio, indústria, escola etc.): \nÁrea construída (m²): \nNúmero de pavimentos: \nCidade: ",
};

// Foto do responsável técnico. Quando houver o arquivo em public/ (ex.: "/rafael.webp"), coloque o caminho aqui.
export const FOTO_RESPONSAVEL = null;

// Equipamentos que COSTUMAM ser usados em serviços desse tipo (lista geral de referência).
// Nunca afirmar que a RD possui ou usa algum deles; sem marcas e sem preços.
export const NOTA_EQUIPAMENTOS = "Lista geral de referência, não é o inventário da RD.";
export const EQUIPAMENTOS = {
  "seguranca-do-trabalho": {
    texto:
      "Para saber se o ambiente de trabalho está dentro dos limites das normas, o profissional pode medir o que está no ar e no entorno do trabalhador, como ruído, calor, luz e poeira. Em serviços como PGR, LTCAT e laudos de insalubridade, podem ser usados aparelhos de medição específicos, conferidos antes e depois da medida. Os métodos seguem normas como a NR-15 e as Normas de Higiene Ocupacional (NHO) da Fundacentro.",
    itens: [
      "Dosímetro de ruído e medidor de nível de som (decibelímetro)",
      "Medidor de calor (IBUTG, com termômetros de globo e de bulbo úmido)",
      "Luxímetro, para medir a iluminação do posto de trabalho",
      "Bomba de amostragem de ar com filtro, para coletar poeira e outros agentes",
      "Calibradores, para conferir os aparelhos de ruído e a vazão das bombas",
    ],
  },
  "corpo-de-bombeiros": {
    texto:
      "O projeto de segurança contra incêndio define quais proteções o imóvel precisa ter, de acordo com as Instruções Técnicas do Corpo de Bombeiros do Estado de São Paulo. Na vistoria, os bombeiros podem conferir se esses sistemas estão instalados e funcionando. Por isso, o levantamento do imóvel e o projeto tratam de cada um deles.",
    itens: [
      "Extintores de incêndio, de tipos adequados ao risco",
      "Hidrantes e mangotinhos (rede de água e mangueiras)",
      "Iluminação de emergência nas rotas de saída",
      "Sistema de detecção e alarme de incêndio (detectores, acionadores e central)",
      "Sinalização de emergência e, quando exigido, para-raios (SPDA) com laudo",
    ],
  },
  "engenharia-civil": {
    texto:
      "Para regularizar uma obra, laudar um imóvel ou investigar trincas e infiltrações, o engenheiro pode começar medindo o que existe e observando sinais que não aparecem a olho nu. Em serviços como esses, podem ser usados instrumentos de medição e de ensaio, muitos deles sem necessidade de quebrar a construção. O resultado entra no relatório técnico com ART.",
    itens: [
      "Trena e medidor de distância a laser, para o desenho \"como construído\"",
      "Nível e estação total, para medidas e alturas do terreno e da obra",
      "Fissurômetro e medidor de umidade, para acompanhar trincas e infiltrações",
      "Câmera termográfica, que ajuda a achar infiltração sem quebrar a parede",
      "Esclerômetro e aparelho de ultrassom, para avaliar a qualidade do concreto",
    ],
  },
  "meio-ambiente-topografia": {
    texto:
      "Medir um terreno ou um imóvel rural com precisão exige aparelhos que usam satélites e instrumentos de campo, seguindo as normas do INCRA e da ABNT. No georreferenciamento, o Manual Técnico do INCRA descreve os métodos aceitos, como receptores GNSS, estação total e, em certos casos, drones. Na parte ambiental, a coleta de amostras segue guias técnicos nacionais.",
    itens: [
      "Receptor GNSS (GPS de precisão), com correção em tempo real (RTK) ou por ponto preciso (PPP)",
      "Estação total, com prisma, balizas e trena",
      "Nível e mira, para medir diferenças de altura",
      "Aeronave remotamente pilotada (drone) com câmera, nos casos em que o método é permitido",
      "Frascos e amostradores para coleta de água e sedimento",
    ],
  },
};

// Desenhos dos projetos reais como slides do Carrossel (uma imagem por slide).
// destaques = true: só planta baixa e fachada (usado na página inicial).
export const slidesProjetos = (destaques = false) =>
  PROJETOS.flatMap((p) =>
    p.itens
      .filter((e) => !destaques || ["planta-baixa", "fachada"].includes(e.arq))
      .map((e) => ({
        key: `${p.pasta}-${e.arq}`,
        src: `/exemplos/${p.pasta}/${e.arq}.webp`,
        imgHref: `/exemplos/${p.pasta}/${e.arq}.webp`,
        w: e.w,
        h: e.h,
        alt: e.alt,
        legenda: `${p.nome} · ${e.titulo}`,
        nota: e.texto,
        contem: true,
      }))
  );
