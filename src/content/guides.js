// Guide articles (/guias/<slug>) and their short summaries.
// Per guide, besides the text:
// - published / updated (YYYY-MM-DD): first appearance and last change of the guide's text, from git history
//   (src/paginas.js -> src/pagesData.js -> this file). Used by the "Atualizado em" line, the Article JSON-LD
//   and the sitemap lastmod. Change `updated` only when what the guide says changes.
// - relatedServiceAnchor: id of the matching service card on the area page (serviceAnchorId in src/searchIndex.js),
//   or "o-que-fazemos" (the whole services section) when no single service matches.
// - reminderDocumentKey: key of the document on the reminder form (src/content/reminder.js), only on guides about
//   documents that expire or are renewed.
// - whatsappQuestion / whatsappPrompt: the guide's own question and its prefilled WhatsApp message (first line says
//   where the visitor came from; lines ending in ": " are blanks the visitor fills in). Also read by src/whatsappMessages.js.
// - legalSources: official text of each norm or law the guide itself names (official government hosts only);
//   namedInGuideAs is how the guide's text names it, so a source is never added for a norm the text does not cite.

const MTE_NR_PAGES =
  "https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes";

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
    published: "2026-10-13",
    updated: "2026-10-13",
    relatedServiceAnchor: "servico-pgr-programa-de-gerenciamento-de-riscos",
    reminderDocumentKey: "pgr",
    whatsappQuestion: "Quer saber se a sua empresa precisa de PGR?",
    whatsappPrompt: "Olá! Li o guia sobre PGR no site.\nRamo da empresa: \nNúmero de funcionários: \nCidade: ",
    paragraphs: [
      "O PGR, ou Programa de Gerenciamento de Riscos, é o documento previsto na NR-1 que reúne a identificação dos perigos do ambiente de trabalho, a avaliação dos riscos e as medidas para controlá-los. Ele substituiu o antigo PPRA e é a base para os demais documentos de segurança da empresa.",
      "Em regra, o PGR é exigido de organizações que contratam trabalhadores como empregados. Microempreendedores individuais sem funcionários ficam, em geral, fora dessa obrigação. Já microempresas e empresas de pequeno porte de menor grau de risco podem ter tratamento simplificado, conforme a própria NR-1.",
      "O programa é composto, principalmente, pelo inventário de riscos e pelo plano de ação. O inventário descreve os perigos de cada função e ambiente, e o plano de ação define o que será feito, por quem e quando. A NR-1 também determina que os fatores de risco psicossociais sejam considerados no gerenciamento de riscos.",
      "O PGR precisa ser revisado periodicamente e sempre que houver mudança relevante na empresa, como nova máquina, nova atividade ou acidente. Por isso, um documento antigo e parado em uma gaveta não cumpre o seu papel.",
      "Não existe um modelo único: o conteúdo depende da atividade, do número de funcionários e do local de trabalho. Uma visita ou a análise das informações da empresa é o caminho para saber exatamente o que é preciso.",
    ],
    legalSources: [{ label: "NR-1 (Ministério do Trabalho e Emprego)", namedInGuideAs: "NR-1", url: `${MTE_NR_PAGES}/nr-1` }],
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
    published: "2026-10-13",
    updated: "2026-10-13",
    relatedServiceAnchor: "servico-avcb-auto-de-vistoria-do-corpo-de-bombeiros",
    reminderDocumentKey: "avcb",
    whatsappQuestion: "Quer saber se o seu imóvel precisa de AVCB ou de CLCB?",
    whatsappPrompt:
      "Olá! Li o guia sobre AVCB e CLCB no site.\nÁrea construída (m²): \nNúmero de pavimentos: \nUso do imóvel (comércio, galpão, escola...): \nCidade: ",
    paragraphs: [
      "No Estado de São Paulo, todo imóvel que exige segurança contra incêndio precisa de uma licença do Corpo de Bombeiros. As duas mais comuns são o AVCB e o CLCB.",
      "O AVCB (Auto de Vistoria do Corpo de Bombeiros) é o documento que atesta que a edificação cumpre as medidas de segurança contra incêndio exigidas para ela. Ele é emitido depois da análise do projeto e da vistoria do Corpo de Bombeiros.",
      "O CLCB (Certificado de Licença do Corpo de Bombeiros) é uma licença de processo mais simples, destinada a edificações menores e de baixo risco. Os limites de área, de altura e de carga de incêndio que definem esse enquadramento estão na legislação paulista e nas Instruções Técnicas do Corpo de Bombeiros.",
      "Por isso, a pergunta correta não é qual das duas é melhor, e sim em qual delas o seu imóvel se enquadra. Isso depende da área construída, do número de pavimentos e do que é feito no local, seja comércio, indústria, escola, clínica ou outra ocupação.",
      "Qualquer que seja a licença, ela tem prazo de validade e precisa ser renovada. Funcionar com a licença vencida expõe o proprietário a multa, a interdição e, principalmente, a risco real para quem circula no local.",
    ],
    legalSources: [
      {
        label: "Decreto Estadual 69.118/2024, regulamento de segurança contra incêndio de SP (Assembleia Legislativa de SP)",
        namedInGuideAs: "legislação paulista",
        url: "https://www.al.sp.gov.br/repositorio/legislacao/decreto/2024/decreto-69118-09.12.2024.html",
      },
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
    published: "2026-10-13",
    // 2026-11-09: deadline sentences rewritten after Decreto 12.689/2025 and the federal court decision of May 2026.
    updated: "2026-11-09",
    relatedServiceAnchor: "servico-georreferenciamento-de-imovel-rural",
    whatsappQuestion: "Quer saber se o seu imóvel rural precisa de georreferenciamento?",
    whatsappPrompt:
      "Olá! Li o guia sobre georreferenciamento no site.\nO que pretendo fazer (vender, dividir ou regularizar): \nTamanho aproximado da área (hectares ou alqueires): \nCidade: ",
    paragraphs: [
      "O georreferenciamento é o levantamento que descreve os limites de um imóvel rural com coordenadas oficiais. Ele é previsto na Lei 10.267/2001 e certificado pelo INCRA, que confere se a área não se sobrepõe à de nenhum vizinho.",
      "A exigência aparece quando o imóvel passa por alguma alteração na matrícula, como desmembramento, parcelamento, remembramento ou transferência de propriedade, seja por venda, doação ou outra forma. Quando a certificação já é exigida para o imóvel, o cartório só faz o registro com ela.",
      "Os prazos para a exigência foram escalonados por tamanho do imóvel e mudaram em 2025 e em 2026. O Decreto 12.689/2025 adiou para 21 de outubro de 2029 a exigência da certificação pelo INCRA, para imóveis de qualquer tamanho. Em maio de 2026, uma decisão provisória da Justiça Federal, com efeito em todo o país, voltou a exigir a certificação dos imóveis com 101 hectares ou mais; para os menores, vale por enquanto a data de 2029.",
      "Segundo o Instituto de Registro Imobiliário do Brasil (IRIB), o decreto adiou só a exigência da certificação: o georreferenciamento continua obrigatório em situações como desmembramento, parcelamento e remembramento. Como essas regras ainda podem mudar, confirmamos a situação do seu imóvel antes de começar.",
      "O trabalho é feito por profissional habilitado e credenciado, com equipamento de precisão e ART. Ele começa com a análise da matrícula e a visita ao imóvel, e termina com a certificação e a averbação no cartório.",
      "Para começar, separe a matrícula do imóvel, o CCIR e o ITR atualizados, e informe o que você pretende fazer: vender, dividir ou apenas regularizar.",
    ],
    legalSources: [
      {
        label: "Lei 10.267/2001 (Presidência da República)",
        namedInGuideAs: "Lei 10.267/2001",
        url: "https://www.planalto.gov.br/ccivil_03/leis/leis_2001/l10267.htm",
      },
      {
        label: "Decreto 12.689/2025 (Presidência da República)",
        namedInGuideAs: "Decreto 12.689/2025",
        url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12689.htm",
      },
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
    published: "2026-10-13",
    updated: "2026-10-13",
    relatedServiceAnchor: "servico-laudo-de-insalubridade-nr-15-e-de-periculosidade",
    reminderDocumentKey: "insalubridade",
    whatsappQuestion: "Quer saber se a sua empresa precisa de laudo de insalubridade?",
    whatsappPrompt: "Olá! Li o guia sobre laudo de insalubridade no site.\nRamo da empresa: \nNúmero de funcionários: \nCidade: ",
    paragraphs: [
      "A insalubridade é a exposição do trabalhador a agentes nocivos à saúde acima dos limites previstos na NR-15, como ruído, calor, agentes químicos, poeira e agentes biológicos. Quando ela existe e não é neutralizada, o trabalhador tem direito a um adicional sobre o salário.",
      "O laudo de insalubridade é o documento técnico que comprova se há ou não essa exposição. A CLT prevê que a caracterização seja feita por perícia de médico do trabalho ou de engenheiro de segurança do trabalho registrado no órgão competente.",
      "O trabalho começa com uma visita ao local, observando as tarefas, o tempo de exposição e os equipamentos usados. Quando necessário, são feitas medições, como a do nível de ruído. Os resultados são comparados com os limites da norma.",
      "Se houver insalubridade, o laudo indica o grau (mínimo, médio ou máximo), que define o percentual do adicional, calculado conforme a CLT. O laudo também registra se há medidas que eliminam ou neutralizam o agente, como o uso correto de EPI com certificado de aprovação, o que pode afastar o direito ao adicional.",
      "Para a empresa, o laudo serve para pagar o adicional corretamente, quando devido, e para se defender em ações trabalhistas. Ele deve ser atualizado quando mudam o ambiente, as máquinas ou as atividades.",
    ],
    legalSources: [
      { label: "NR-15 (Ministério do Trabalho e Emprego)", namedInGuideAs: "NR-15", url: `${MTE_NR_PAGES}/norma-regulamentadora-no-15-nr-15` },
      {
        label: "CLT, Decreto-Lei 5.452/1943 (Presidência da República)",
        namedInGuideAs: "CLT",
        url: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm",
      },
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
    published: "2026-10-13",
    updated: "2026-10-13",
    relatedServiceAnchor: "o-que-fazemos",
    whatsappQuestion: "Precisa de um serviço de engenharia com ART?",
    whatsappPrompt: "Olá! Li o guia sobre ART no site.\nServiço de que preciso: \nCidade: ",
    paragraphs: [
      "A ART, ou Anotação de Responsabilidade Técnica, é o documento que registra no CREA qual profissional é responsável por um serviço de engenharia. Ela está prevista na Lei 6.496/1977.",
      "Em geral, a ART é exigida em projetos, obras, laudos, perícias, topografia, projetos de incêndio e outros serviços técnicos regulamentados. Sem ela, o serviço pode ficar sem validade perante órgãos como prefeituras e o Corpo de Bombeiros, e o profissional e o contratante ficam expostos a problemas.",
      "Para quem contrata, a ART mostra quem assinou o trabalho, qual é o serviço contratado e o período de execução. Se houver erro ou dano, é possível identificar quem responde tecnicamente por ele, e isso protege o cliente.",
      "A ART é emitida pelo profissional, no sistema do CREA, e vinculada ao contrato. Ela é paga por serviço, e o valor é definido pelo conselho. Por isso, vale sempre pedir a ART junto com o orçamento e guardar uma cópia.",
      "Desconfie de quem oferece serviços de engenharia sem ART ou sem registro no CREA. Você pode conferir o registro do profissional no site do conselho.",
    ],
    legalSources: [
      { label: "Lei 6.496/1977 (Presidência da República)", namedInGuideAs: "Lei 6.496/1977", url: "https://www.planalto.gov.br/ccivil_03/leis/l6496.htm" },
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
    published: "2026-10-13",
    updated: "2026-10-13",
    relatedServiceAnchor: "servico-regularizacao-de-obra-e-habite-se",
    whatsappQuestion: "Quer saber o que falta para o habite-se do seu imóvel?",
    whatsappPrompt: "Olá! Li o guia sobre habite-se no site.\nA obra tem projeto aprovado (sim ou não): \nCidade: ",
    paragraphs: [
      "O habite-se é o documento da prefeitura que atesta que a obra foi concluída de acordo com o projeto aprovado e pode ser usada. Ele é pedido para ligar serviços em definitivo, para averbar a construção na matrícula do imóvel e para vender ou financiar.",
      "Cada município tem as suas regras, mas, em geral, o processo exige o projeto aprovado e o alvará de construção, a ART ou RRT do responsável técnico, a vistoria da prefeitura e a regularização da obra junto à Receita Federal e ao INSS. Em imóveis que exigem, também é preciso apresentar a licença do Corpo de Bombeiros.",
      "Quando a obra foi construída sem projeto, ou com diferenças em relação ao que foi aprovado, o primeiro passo é levantar o que existe no local e fazer o projeto como construído (as-built). Depois, verifica-se se a obra atende às regras de uso e ocupação do solo do município.",
      "Em alguns casos, pode ser necessário adequar a construção antes da aprovação, ou pagar multas previstas na legislação municipal. A viabilidade e os custos dependem de cada caso, por isso a análise dos documentos vem primeiro.",
      "Se você já tem plantas, alvará ou certidões, separe tudo. Isso acelera a análise e evita retrabalho.",
    ],
    // No legal sources: the guide names no specific norm (the rules are municipal).
    legalSources: [],
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
    published: "2026-10-13",
    updated: "2026-10-13",
    relatedServiceAnchor: "servico-car-cadastro-ambiental-rural",
    whatsappQuestion: "Precisa fazer ou revisar o CAR do seu imóvel rural?",
    whatsappPrompt:
      "Olá! Li o guia sobre o CAR no site.\nJá tenho o recibo do CAR (sim ou não): \nTamanho aproximado da área (hectares ou alqueires): \nCidade: ",
    paragraphs: [
      "O CAR, ou Cadastro Ambiental Rural, é um registro eletrônico e obrigatório para os imóveis rurais, criado pelo Código Florestal (Lei 12.651/2012). Ele reúne, em um mapa, os limites da propriedade, as áreas de vegetação nativa, as áreas de preservação permanente e a reserva legal.",
      "O cadastro é feito no sistema oficial, o SICAR, a partir de informações declaradas pelo proprietário ou possuidor, com apoio de imagens de satélite e de um levantamento do imóvel. Por ser autodeclaratório, as informações precisam ser corretas, porque o órgão ambiental pode analisá-las depois.",
      "O CAR é a base da regularização ambiental da propriedade. Quando há áreas que precisam ser recuperadas, ele é a porta de entrada para os programas de regularização previstos em lei. Em geral, o produtor também precisa comprovar o CAR para obter crédito rural.",
      "Ter o CAR não significa que a propriedade está regular. Significa que ela está cadastrada e pode ser analisada. Por isso, vale revisar se os dados batem com a realidade do imóvel, principalmente se a propriedade foi dividida ou vendida.",
      "Para começar, separe a matrícula, o CCIR e o ITR do imóvel, e informe a localização da propriedade. Se você já tem o recibo de inscrição do CAR, também ajuda.",
    ],
    legalSources: [
      {
        label: "Código Florestal, Lei 12.651/2012 (Presidência da República)",
        namedInGuideAs: "Lei 12.651/2012",
        url: "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12651.htm",
      },
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
    published: "2026-10-13",
    updated: "2026-10-13",
    relatedServiceAnchor: "servico-ltcat-e-ppp",
    reminderDocumentKey: "ltcat",
    whatsappQuestion: "Sua empresa precisa do LTCAT ou do PPP de um funcionário?",
    whatsappPrompt: "Olá! Li o guia sobre LTCAT e PPP no site.\nRamo da empresa: \nNúmero de funcionários: \nCidade: ",
    paragraphs: [
      "O LTCAT (Laudo Técnico das Condições do Ambiente de Trabalho) é o documento que identifica os agentes nocivos presentes no trabalho, como ruído, calor, poeira e produtos químicos, e avalia a exposição dos trabalhadores a eles.",
      "O PPP (Perfil Profissiográfico Previdenciário) é o documento individual de cada trabalhador, emitido pela empresa. Ele resume o histórico do trabalhador e as exposições a agentes nocivos ao longo do tempo, com base nas informações do LTCAT e de outros programas de segurança.",
      "Os dois documentos são usados pela Previdência para avaliar se o trabalhador teve atividade especial, que pode reduzir o tempo necessário para a aposentadoria. Por isso, as informações precisam ser verdadeiras e atualizadas: erros prejudicam o trabalhador e geram risco para a empresa.",
      "A empresa deve emitir o PPP quando o trabalhador pede e quando o contrato termina, e manter o LTCAT atualizado quando há mudança no ambiente, nas máquinas ou nas atividades.",
      "A elaboração do LTCAT exige visita ao local e profissional habilitado. Se a sua empresa nunca fez o laudo, ou se o último é muito antigo, vale revisar.",
    ],
    // No legal sources: the guide names no specific norm or law.
    legalSources: [],
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
    "É exigido em alterações na matrícula, como desmembramento ou transferência; os prazos mudaram em 2025 e em 2026.",
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

// "2026-10-13" -> "13/10/2026" (the "Atualizado em" line). Returns "" for anything that is not YYYY-MM-DD.
export function formatGuideDate(isoDate) {
  if (typeof isoDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return "";
  return isoDate.split("-").reverse().join("/");
}
