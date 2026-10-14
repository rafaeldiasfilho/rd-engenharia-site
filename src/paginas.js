// Conteúdo das páginas internas do site (áreas de atuação, guias, quiz e privacidade).
// Texto simples, sem preços e sem prazos fixos. Normas citadas conforme o conhecimento
// disponível em 2026; cada caso é confirmado pela equipe antes de qualquer orçamento.

export const SITE_URL = "https://rdibiraengenharia.com.br";

export const AREAS = [
  {
    tipo: "area",
    slug: "seguranca-do-trabalho",
    nome: "Segurança do Trabalho",
    icone: "fa-solid fa-helmet-safety",
    curto: "PGR, LTCAT, laudos de insalubridade e periculosidade e treinamentos.",
    title: "Segurança do Trabalho em Ibirá e região | PGR, LTCAT e Laudos | RD Engenharia",
    description:
      "PGR, LTCAT, laudos de insalubridade e periculosidade, APR e treinamentos de NRs para empresas de Ibirá, Catanduva, Rio Preto e região. Peça orçamento pelo WhatsApp.",
    h1: "Segurança do Trabalho para empresas da região",
    intro:
      "Elaboramos os programas e laudos exigidos pelas Normas Regulamentadoras para que a sua empresa trabalhe em dia com a lei e, principalmente, com menos risco de acidente. Atendemos comércios, indústrias, fazendas, clínicas e prefeituras.",
    itens: [
      {
        nome: "PGR — Programa de Gerenciamento de Riscos",
        texto:
          "Documento da NR-1 que identifica os perigos do ambiente de trabalho, avalia os riscos e define as medidas de prevenção. É a base dos demais programas de segurança.",
        quem: "Empresas que contratam empregados, em geral. Microempresas e empresas de pequeno porte de menor risco podem ter tratamento simplificado.",
      },
      {
        nome: "PCMSO — integração com o programa médico",
        texto:
          "O PCMSO (NR-7) é coordenado por médico do trabalho. Orientamos a empresa e integramos as informações do PGR com o programa médico, para que os documentos conversem entre si.",
        quem: "Empresas com empregados.",
      },
      {
        nome: "LTCAT e PPP",
        texto:
          "O LTCAT documenta os agentes nocivos presentes no trabalho e serve de base para o PPP, usado pela Previdência no reconhecimento de atividade especial para aposentadoria.",
        quem: "Empresas com trabalhadores expostos a agentes nocivos, como ruído, calor, poeira e produtos químicos.",
      },
      {
        nome: "Laudo de insalubridade (NR-15) e de periculosidade (NR-16)",
        texto:
          "Avaliação técnica no local de trabalho para definir se há direito a adicional de insalubridade ou de periculosidade. Também é usado em defesa da empresa em ações trabalhistas.",
        quem: "Empresas que lidam com agentes nocivos, inflamáveis, explosivos ou eletricidade, e empresas que respondem a ações trabalhistas.",
      },
      {
        nome: "APR, Mapa de Risco e AET",
        texto:
          "Análise Preliminar de Riscos para tarefas específicas, mapa de riscos do ambiente e Análise Ergonômica do Trabalho, conforme a atividade.",
        quem: "Empresas com tarefas de risco, obras e postos de trabalho com exigência ergonômica.",
      },
      {
        nome: "Treinamentos de NRs",
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
    nome: "Corpo de Bombeiros (AVCB e CLCB)",
    icone: "fa-solid fa-fire-extinguisher",
    curto: "Projetos de segurança contra incêndio, AVCB e CLCB.",
    title: "AVCB e CLCB em Ibirá e região | Projeto de Incêndio | RD Engenharia",
    description:
      "Projeto de segurança contra incêndio (PSCIP), AVCB e CLCB para comércios, indústrias e imóveis de Ibirá, Catanduva, Rio Preto e região. Peça orçamento pelo WhatsApp.",
    h1: "Projeto de incêndio, AVCB e CLCB",
    intro:
      "Cuidamos do projeto e da regularização da segurança contra incêndio do seu imóvel junto ao Corpo de Bombeiros do Estado de São Paulo, do enquadramento correto até a documentação final.",
    itens: [
      {
        nome: "PSCIP — Projeto de Segurança Contra Incêndio e Pânico",
        texto:
          "Projeto técnico que define as medidas de proteção exigidas para o seu imóvel, como extintores, sinalização, iluminação de emergência, alarme e hidrantes, conforme as Instruções Técnicas do Corpo de Bombeiros.",
        quem: "Edificações e áreas de risco que não se enquadram em processo simplificado.",
      },
      {
        nome: "AVCB — Auto de Vistoria do Corpo de Bombeiros",
        texto:
          "Documento que comprova que a edificação cumpre as medidas de segurança contra incêndio, emitido após vistoria do Corpo de Bombeiros.",
        quem: "Comércios, indústrias, escolas, clínicas, condomínios e outros imóveis cuja ocupação exija o documento.",
      },
      {
        nome: "CLCB — Certificado de Licença do Corpo de Bombeiros",
        texto:
          "Licença com processo mais simples, para edificações menores e de baixo risco. O enquadramento depende de área, altura e tipo de ocupação, e fazemos essa análise para você.",
        quem: "Estabelecimentos de pequeno porte e baixo risco, conforme a legislação paulista.",
      },
      {
        nome: "Projetos específicos",
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
    nome: "Engenharia Civil e Regularização",
    icone: "fa-solid fa-building",
    curto: "Projetos, regularização de obras, laudos, inspeções e gerenciamento.",
    title: "Engenharia Civil e Regularização de Obras em Ibirá e região | RD Engenharia",
    description:
      "Projetos, regularização de obra (as-built e habite-se), laudos, perícias, inspeção predial e gerenciamento de obras em Ibirá, Catanduva, Rio Preto e região.",
    h1: "Engenharia civil, projetos e regularização",
    intro:
      "Da planta ao habite-se: projetos, acompanhamento de obras, regularização de imóveis construídos sem documentação e laudos técnicos, sempre com ART de responsável técnico habilitado no CREA-SP.",
    itens: [
      {
        nome: "Projetos arquitetônicos, estruturais e complementares",
        texto:
          "Projeto arquitetônico, fundações, projeto estrutural, drenagem, memorial descritivo e memória de cálculo, seguindo as normas da ABNT.",
        quem: "Quem vai construir, ampliar ou reformar.",
      },
      {
        nome: "Regularização de obra e habite-se",
        texto:
          "Levantamento do que foi construído (as-built), ART ou RRT, alvará, habite-se e demais documentos junto à prefeitura. As regras variam de município para município.",
        quem: "Proprietários de imóveis construídos sem projeto aprovado ou sem habite-se.",
      },
      {
        nome: "Gerenciamento e planejamento de obras",
        texto:
          "Orçamento, cronograma físico-financeiro, diário de obra, controle de qualidade e boletim de medição para acompanhar custo, prazo e qualidade da obra.",
        quem: "Construtoras, empresas e proprietários que querem controle sobre a obra.",
      },
      {
        nome: "Inspeção predial e laudos de patologias",
        texto:
          "Inspeção de fachada, estrutura, impermeabilização e instalações, com relatório técnico e orientação de manutenção preventiva.",
        quem: "Condomínios, comércios e proprietários que notam trincas, infiltração ou desgaste.",
      },
      {
        nome: "Laudos e perícias",
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
    nome: "Meio Ambiente, Topografia e Imóvel Rural",
    icone: "fa-solid fa-leaf",
    curto: "CAR, licenciamento, outorga, resíduos, topografia e georreferenciamento.",
    title: "CAR, Georreferenciamento e Topografia em Ibirá e região | RD Engenharia",
    description:
      "CAR, georreferenciamento de imóvel rural, topografia, licenciamento ambiental, outorga e gestão de resíduos em Ibirá, Catanduva, Rio Preto e região.",
    h1: "Meio ambiente, topografia e imóvel rural",
    intro:
      "Regularização ambiental, levantamentos de terreno e documentação de propriedades rurais e urbanas. Unimos a parte ambiental e a topografia para resolver o processo de ponta a ponta.",
    itens: [
      {
        nome: "CAR — Cadastro Ambiental Rural",
        texto:
          "Cadastro eletrônico obrigatório dos imóveis rurais, previsto no Código Florestal, que reúne as informações ambientais da propriedade e é base para a regularização ambiental.",
        quem: "Proprietários e possuidores de imóveis rurais.",
      },
      {
        nome: "Georreferenciamento de imóvel rural",
        texto:
          "Levantamento que define os limites do imóvel com coordenadas oficiais e é certificado junto ao INCRA, exigido em situações como desmembramento e transferência de propriedade.",
        quem: "Quem vai vender, dividir ou regularizar um imóvel rural.",
      },
      {
        nome: "Topografia",
        texto:
          "Levantamento planialtimétrico, locação de obras, divisão de glebas, planta cadastral, curvas de nível e cálculo de volume.",
        quem: "Quem vai construir, dividir um terreno ou precisa conhecer as medidas e o relevo da área.",
      },
      {
        nome: "Licenciamento ambiental e outorga",
        texto:
          "Orientação e condução de licenças (prévia, de instalação e de operação) e da outorga de uso da água, conforme a atividade e o órgão responsável.",
        quem: "Empreendimentos e atividades que impactam o meio ambiente ou usam recursos hídricos.",
      },
      {
        nome: "Gestão de resíduos e gestão ambiental",
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
    title: "Georreferenciamento de imóvel rural: quando é obrigatório? | Guia RD Engenharia",
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
    title: "O que é ART (Anotação de Responsabilidade Técnica)? | Guia RD Engenharia",
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

export const PAGINAS = [
  ...AREAS,
  ...GUIAS,
  {
    tipo: "quiz",
    slug: "o-que-preciso",
    title: "O que minha empresa ou imóvel precisa? Guia rápido | RD Engenharia",
    description:
      "Responda algumas perguntas e descubra quais documentos e serviços técnicos o seu caso provavelmente exige. Depois peça orçamento pelo WhatsApp.",
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
    tipo: "privacidade",
    slug: "privacidade",
    title: "Política de Privacidade | RD Engenharia",
    description: "Como o site da RD Engenharia trata os dados de quem entra em contato.",
    h1: "Política de Privacidade",
  },
];

export const achaPagina = (slug) => PAGINAS.find((p) => p.slug === slug);
export const achaArea = (slug) => AREAS.find((p) => p.slug === slug);

export const CIDADES = ["Ibirá", "Urupes", "Potirendaba", "Irapuã", "Catanduva", "São José do Rio Preto"];

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
