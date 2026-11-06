// Area page content: Segurança do Trabalho (/seguranca-do-trabalho).

export const WORK_SAFETY_AREA = {
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
};
