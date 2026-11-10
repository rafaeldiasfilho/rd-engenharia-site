// Area page content: Corpo de Bombeiros, AVCB and CLCB (/corpo-de-bombeiros).

export const FIRE_SAFETY_AREA = {
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
    "Cuidamos do projeto e da regularização da segurança contra incêndio do seu imóvel, em Ibirá e região, junto ao Corpo de Bombeiros do Estado de São Paulo, do enquadramento correto até a documentação final.",
  // Blanks of the prefilled WhatsApp message (src/whatsappMessages.js): what the team needs to answer fast.
  whatsappFields: ["Uso do imóvel (comércio, galpão, escola...):", "Área construída (m²):", "Cidade:"],
  // Document preselected when this page links to the reminder form (keys in src/content/reminder.js).
  reminderDocumentKey: "avcb",
  // Shown under the quote button: what decides cost and time, without prices or deadlines.
  costDrivers:
    "O valor e o tempo dependem da área construída, do uso do imóvel e de já existir projeto aprovado. Uma parte do prazo depende do Corpo de Bombeiros.",
  items: [
    {
      name: "PSCIP — Projeto de Segurança Contra Incêndio e Pânico",
      example: {"title":"PSCIP","subtitle":"Projeto de segurança contra incêndio","body":"fireSafetyPlan","art":true,"layout":"drawingSheet","doc":"Projeto de Segurança Contra Incêndio","ref":"Planta de medidas de segurança","scale":"1:100"},
      text:
        "Projeto técnico que define as medidas de proteção exigidas para o seu imóvel, como extintores, sinalização, iluminação de emergência, alarme e hidrantes, conforme as Instruções Técnicas do Corpo de Bombeiros.",
      who: "Edificações e áreas de risco que não se enquadram em processo simplificado.",
    },
    {
      name: "AVCB — Auto de Vistoria do Corpo de Bombeiros",
      example: {"title":"AVCB","subtitle":"Preparação para a vistoria","body":"checklist","layout":"cover","doc":"Preparação para Vistoria do AVCB","ref":"Lista de exigências","contents":["Medidas de segurança exigidas","Situação de cada medida","Pendências antes da vistoria"]},
      text:
        "Documento que comprova que a edificação cumpre as medidas de segurança contra incêndio, emitido após vistoria do Corpo de Bombeiros.",
      who: "Comércios, indústrias, escolas, clínicas, condomínios e outros imóveis cuja ocupação exija o documento.",
    },
    {
      name: "CLCB — Certificado de Licença do Corpo de Bombeiros",
      example: {"title":"CLCB","subtitle":"Análise de enquadramento","body":"checklist","layout":"cover","doc":"Análise de Enquadramento para CLCB","ref":"Área, altura e ocupação","contents":["Dados da edificação","Enquadramento","Medidas exigidas"]},
      text:
        "Licença com processo mais simples, para edificações menores e de baixo risco. O enquadramento depende de área, altura e tipo de ocupação, e fazemos essa análise para você.",
      who: "Estabelecimentos de pequeno porte e baixo risco, conforme a legislação paulista.",
    },
    {
      name: "Projetos específicos",
      example: {"title":"PROJETO","subtitle":"Rota de fuga, hidrantes e alarme","body":"escapeRoutePlan","art":true,"layout":"drawingSheet","doc":"Rota de Fuga e Hidrantes","ref":"Projeto específico","scale":"1:100"},
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
      a: "É preciso renovar a licença antes do vencimento, sempre que possível. Se já venceu, avaliamos a situação do imóvel e conduzimos a regularização. Também é possível pedir aqui no site um lembrete de vencimento.",
    },
    {
      q: "A RD faz o projeto e acompanha a vistoria?",
      a: "Sim. Elaboramos o projeto, protocolamos a documentação e orientamos o cliente durante o processo, inclusive sobre as adequações necessárias no imóvel.",
    },
  ],
};
