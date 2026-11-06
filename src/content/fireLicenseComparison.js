// AVCB × CLCB comparison table shown on the fire safety pages.

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
