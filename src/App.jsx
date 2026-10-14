import { useEffect, useMemo, useRef, useState } from "react";

const NAV_LINKS = [
  { id: "sobre", label: "Sobre" },
  { id: "profissional", label: "Profissional" },
  { id: "servicos", label: "Serviços" },
  { id: "diferenciais", label: "Diferenciais" },
  { id: "portfolio", label: "Portfólio" },
  { id: "contato", label: "Orçamento", cta: true },
];

const IMAGE_ROTATION_DAYS = Math.max(1, Number(import.meta.env.VITE_IMAGE_ROTATION_DAYS ?? 7));
const AI_IMAGE_PROVIDER_URL = String(import.meta.env.VITE_AI_IMAGE_PROVIDER_URL ?? "").trim();
const DAY_MS = 24 * 60 * 60 * 1000;
const ROTATION_BUCKET = Math.floor(Date.now() / (DAY_MS * IMAGE_ROTATION_DAYS));

const pickRotatingImage = (pool, seed = 0) => {
  if (!Array.isArray(pool) || pool.length === 0) return "";
  return pool[(ROTATION_BUCKET + seed) % pool.length];
};

const resolveRotatingImage = (pool, seed = 0, prompt = "") => {
  if (AI_IMAGE_PROVIDER_URL && prompt) {
    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost";
      const providerUrl = new URL(AI_IMAGE_PROVIDER_URL, baseUrl);
      providerUrl.searchParams.set("prompt", prompt);
      providerUrl.searchParams.set("seed", String(ROTATION_BUCKET + seed));
      return providerUrl.toString();
    } catch {
      return pickRotatingImage(pool, seed);
    }
  }
  return pickRotatingImage(pool, seed);
};

const HERO_IMAGE_POOLS = [
  [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1900&q=80",
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1900&q=80",
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1474674556023-efef886fa147?auto=format&fit=crop&w=1900&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1900&q=80",
    "https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?auto=format&fit=crop&w=1900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1581092916367-41b6c2fd6a2c?auto=format&fit=crop&w=1900&q=80",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1900&q=80",
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1900&q=80",
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1900&q=80",
    "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&w=1900&q=80",
  ],
];

const ABOUT_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1581092160612-7dee749a9d5c?auto=format&fit=crop&w=900&q=80",
];

const SLIDES = HERO_IMAGE_POOLS.map((pool, index) => ({
  id: `slide-${index + 1}`,
  image: resolveRotatingImage(pool, index * 2, `hero engenharia civil ${index + 1}`),
}));

const ABOUT_IMAGE = resolveRotatingImage(
  ABOUT_IMAGE_POOL,
  11,
  "equipe de engenharia em campo com EPI no Brasil"
);

const HERO_STATS = [
  { key: "anos", label: "Anos de Experiência", valor: 10, sufixo: "+" },
  { key: "projetos", label: "Projetos Realizados", valor: 200, sufixo: "+" },
  { key: "especialidades", label: "Especialidades", valor: 15, sufixo: "" },
  { key: "compromisso", label: "Compromisso Técnico", valor: 100, sufixo: "%" },
];

const DIF_STATS = [
  { key: "mercado", label: "Anos no Mercado", valor: 10, sufixo: "+" },
  { key: "entregues", label: "Projetos Entregues", valor: 200, sufixo: "+" },
  { key: "crea", label: "Habilitação CREA", valor: 100, sufixo: "%" },
  { key: "areas", label: "Áreas de Especialidade", valor: 3, sufixo: "" },
];

const SOBRE_MVV = [
  {
    icone: "fa-solid fa-bullseye",
    titulo: "Missão",
    texto:
      "Oferecer soluções técnicas integradas com qualidade, responsabilidade e inovação para o desenvolvimento sustentável.",
  },
  {
    icone: "fa-solid fa-eye",
    titulo: "Visão",
    texto:
      "Ser referência regional em engenharia, segurança e meio ambiente, reconhecida pela excelência e ética profissional.",
  },
  {
    icone: "fa-solid fa-gem",
    titulo: "Valores",
    texto:
      "Ética, competência técnica, responsabilidade socioambiental, segurança e compromisso total com os clientes.",
  },
];

const PROFISSIONAIS = [
  {
    id: "rafael-pai",
    nome: "Rafael Antonio Dias",
    cargo:
      "Engenheiro Civil · Engenheiro Ambiental · Especialista em Segurança do Trabalho",
    iniciais: "RAD",
    status: "CREA Ativo",
    statusIcone: "fa-solid fa-circle-check",
    whatsapp: "(17) 99721-1208",
    whatsappHref:
      "https://wa.me/5517997211208?text=Olá%20Rafael!%20Gostaria%20de%20solicitar%20um%20orçamento.",
    botaoClasse: "btn-verde",
    selos: [
      { icone: "fa-solid fa-graduation-cap", texto: "2 Bacharelados" },
      { icone: "fa-solid fa-medal", texto: "5 Pós-Graduações" },
      { icone: "fa-solid fa-shield-halved", texto: "Técnico em Seg. do Trabalho" },
      { icone: "fa-solid fa-house-chimney", texto: "Corretor de Imóveis" },
      { icone: "fa-solid fa-magnifying-glass", texto: "Perito Grafotécnico" },
    ],
    formacoes: [
      {
        titulo: "Graduação — Bacharelado",
        icone: "fa-solid fa-graduation-cap",
        itens: [
          {
            icone: "fa-solid fa-building-columns",
            titulo: "Bacharel em Engenharia Ambiental",
            detalhe: "Universidade de Franca - Franca/SP",
          },
          {
            icone: "fa-solid fa-building-columns",
            titulo: "Bacharel em Engenharia Civil",
            detalhe: "Universidade Cruzeiro do Sul",
          },
        ],
      },
      {
        titulo: "Pós-Graduação — Especializações",
        icone: "fa-solid fa-medal",
        itens: [
          {
            icone: "fa-solid fa-helmet-safety",
            titulo: "Engenharia de Segurança do Trabalho",
            detalhe: "Universidade Cruzeiro do Sul",
          },
          {
            icone: "fa-solid fa-map",
            titulo: "Georreferenciamento de Imóveis Rurais",
            detalhe: "Faculdade Única de Ipatinga/MG",
          },
          {
            icone: "fa-solid fa-mountain-sun",
            titulo: "Topografia e Sensoriamento Remoto",
            detalhe: "Faculdade Única de Ipatinga/MG",
          },
          {
            icone: "fa-solid fa-leaf",
            titulo: "Gestão Ambiental",
            detalhe: "Faculdade Líbano",
          },
          {
            icone: "fa-solid fa-lungs",
            titulo: "Higiene Ocupacional",
            detalhe: "Faculdade Líbano",
          },
        ],
      },
      {
        titulo: "Formação Técnica e Profissional",
        icone: "fa-solid fa-certificate",
        itens: [
          {
            icone: "fa-solid fa-shield-halved",
            titulo: "Técnico em Segurança do Trabalho",
            detalhe: "SENAC",
          },
          {
            icone: "fa-solid fa-house-chimney",
            titulo: "Corretor de Imóveis",
            detalhe: "Instituto Monitor",
          },
        ],
      },
      {
        titulo: "Certificação Pericial",
        icone: "fa-solid fa-magnifying-glass",
        itens: [
          {
            icone: "fa-solid fa-signature",
            titulo: "Perito Grafotécnico",
            detalhe: "Nero Perícias",
          },
        ],
      },
    ],
    competencias: [
      {
        titulo: "Engenharia Civil",
        icone: "fa-solid fa-building",
        tags: [
          "Projetos Arquitetônicos",
          "Projetos Estruturais",
          "Gerenciamento de Obras",
          "Planejamento e Orçamentos",
          "Laudos de Vistoria",
          "Regularização de Obras",
          "Perícias de Engenharia Civil",
          "Elaboração de ART",
          "As-Built",
        ],
      },
      {
        titulo: "Engenharia Ambiental",
        icone: "fa-solid fa-leaf",
        tags: [
          "Licenciamento Ambiental (LP/LI/LO)",
          "Elaboração de EIA/RIMA",
          "RAP e RCA",
          "CAR - Cadastro Ambiental Rural",
          "Outorga de Uso de Recursos Hídricos",
          "Laudos e Relatórios Ambientais",
          "Monitoramento Ambiental",
        ],
      },
      {
        titulo: "Segurança do Trabalho",
        icone: "fa-solid fa-helmet-safety",
        tags: [
          "Elaboração de PGR/PPRA",
          "PCMSO",
          "LTCAT",
          "PCMAT",
          "PPP",
          "Laudo de Insalubridade",
          "Laudo de Periculosidade",
          "APR - Análise Preliminar de Risco",
          "Mapa de Risco",
          "Análise Ergonômica do Trabalho (AET)",
          "Plano de Emergência",
          "Investigação de Acidentes",
          "Treinamentos de NRs",
        ],
      },
      {
        titulo: "Topografia e Georreferenciamento",
        icone: "fa-solid fa-map",
        tags: [
          "Levantamento Planialtimétrico",
          "Georreferenciamento de Imóveis Rurais (INCRA)",
          "Locação de Obras",
          "Divisão de Glebas",
          "Planta Cadastral e Topográfica",
          "Curvas de Nível",
          "Sensoriamento Remoto",
        ],
      },
    ],
  },
  {
    id: "rafael-filho",
    nome: "Rafael Antonio Dias Filho",
    cargo: "Técnico em Edificações · Estudante de Administração",
    iniciais: "RADF",
    status: "Técnico em Edificações",
    statusIcone: "fa-solid fa-hard-hat",
    whatsapp: "(17) 99659-0330",
    whatsappHref:
      "https://wa.me/5517996590330?text=Olá!%20Gostaria%20de%20solicitar%20um%20orçamento.",
    botaoClasse: "btn-cinza",
    variante: "secundario",
    selos: [
      { icone: "fa-solid fa-school", texto: "Técnico em Edificações - ETEC" },
      { icone: "fa-solid fa-book-open", texto: "Administração em Curso - ETEC" },
    ],
    formacoes: [
      {
        titulo: "Formação Técnica",
        icone: "fa-solid fa-school",
        itens: [
          {
            icone: "fa-solid fa-ruler-combined",
            titulo: "Técnico em Edificações",
            detalhe: "ETEC - Escola Técnica Estadual",
          },
        ],
      },
      {
        titulo: "Formação em Andamento",
        icone: "fa-solid fa-book-open",
        itens: [
          {
            icone: "fa-solid fa-briefcase",
            titulo: "Administração (Em Curso)",
            detalhe: "ETEC - Escola Técnica Estadual",
          },
        ],
      },
    ],
    competencias: [
      {
        titulo: "Técnico em Edificações",
        icone: "fa-solid fa-ruler-combined",
        tags: [
          "Leitura e Interpretação de Projetos",
          "Desenho Técnico",
          "Acompanhamento de Obras",
          "Especificação de Materiais",
          "Orçamentos Básicos de Construção",
          "Controle de Qualidade de Obras",
          "Topografia Básica",
          "Fiscalização de Obras",
        ],
      },
      {
        titulo: "Administração (Em Curso)",
        icone: "fa-solid fa-briefcase",
        tags: [
          "Gestão de Processos",
          "Controle Administrativo",
          "Atendimento ao Cliente",
          "Organização de Documentos",
          "Elaboração de Relatórios",
          "Gestão de Contratos",
        ],
      },
    ],
  },
];

const SERVICOS = [
  {
    icone: "fa-solid fa-building",
    titulo: "Engenharia Civil",
    texto:
      "Projetos e acompanhamento de obras civis com rigor técnico e conformidade às normas ABNT.",
    tags: [
      "ART",
      "Memorial Descritivo",
      "Memorial de Cálculo",
      "Planilha Orçamentária",
      "Cronograma Físico-Financeiro",
      "Projeto Arquitetônico",
      "Projeto de Fundações",
      "Projeto de Drenagem",
      "As-Built",
      "Laudo de Vistoria",
    ],
  },
  {
    icone: "fa-solid fa-leaf",
    titulo: "Engenharia Ambiental",
    texto:
      "Estudos, licenciamentos e soluções ambientais para conformidade legal e preservação dos recursos naturais.",
    tags: [
      "EIA",
      "RIMA",
      "RAP",
      "RCA",
      "PBA",
      "Licença Prévia (LP)",
      "Licença de Instalação (LI)",
      "Licença de Operação (LO)",
      "Outorga de Uso Hídrico",
      "CAR",
    ],
  },
  {
    icone: "fa-solid fa-helmet-safety",
    titulo: "Segurança do Trabalho",
    texto:
      "Programas e laudos ocupacionais conforme as Normas Regulamentadoras vigentes.",
    tags: [
      "PGR",
      "PPRA",
      "PCMSO",
      "LTCAT",
      "PCMAT",
      "PPP",
      "PCA",
      "Laudo de Insalubridade",
      "Laudo de Periculosidade",
      "APR",
      "Mapa de Risco",
      "AET",
    ],
  },
  {
    icone: "fa-solid fa-fire-extinguisher",
    titulo: "Corpo de Bombeiros",
    texto:
      "Elaboração e aprovação de projetos de segurança contra incêndio e pânico.",
    tags: [
      "PSCIP",
      "PPCI",
      "AVCB",
      "CLCB",
      "ART de Incêndio",
      "Planta de Rota de Fuga",
      "Projeto de Hidrantes",
      "Projeto de Sprinklers",
      "Projeto de Detecção e Alarme",
    ],
  },
  {
    icone: "fa-solid fa-map",
    titulo: "Topografia",
    texto:
      "Levantamentos topográficos com equipamentos modernos para obras, divisões de terra e regularizações.",
    tags: [
      "Levantamento Planialtimétrico",
      "Georreferenciamento Rural",
      "Locação de Obras",
      "Divisão de Glebas",
      "Planta Cadastral",
      "Curvas de Nível",
      "Cálculo de Volume",
    ],
  },
  {
    icone: "fa-solid fa-drafting-compass",
    titulo: "Projetos Estruturais",
    texto:
      "Cálculo e dimensionamento estrutural para edificações em concreto armado, metálicas e mistas.",
    tags: [
      "Memória de Cálculo Estrutural",
      "Prancha Estrutural",
      "ART Estrutural",
      "Detalhamento de Armadura",
      "Projeto de Fundações",
      "Laudo de Inspeção Estrutural",
    ],
  },
  {
    icone: "fa-solid fa-person-digging",
    titulo: "Gerenciamento de Obras",
    texto:
      "Gestão completa de obras com controle de custos, prazos, qualidade e conformidade técnica.",
    tags: [
      "Diário de Obra",
      "Relatório de Progresso",
      "Controle de Qualidade",
      "Boletim de Medição",
      "Plano de Qualidade da Obra",
      "Curva S",
    ],
  },
  {
    icone: "fa-solid fa-user-tie",
    titulo: "Consultoria Técnica",
    texto:
      "Assessoria especializada em engenharia, segurança e meio ambiente para empresas e órgãos públicos.",
    tags: [
      "Relatório Técnico",
      "Parecer Técnico",
      "Nota Técnica",
      "Due Diligence Técnica",
      "Análise de Risco",
      "Estudo de Viabilidade Técnica",
    ],
  },
  {
    icone: "fa-solid fa-file-signature",
    titulo: "Laudos e Perícias",
    texto:
      "Laudos técnicos e perícias para fins legais, seguros, judiciais e administrativos.",
    tags: [
      "Laudo Pericial",
      "Laudo de Avaliação de Imóvel",
      "Laudo de Vistoria",
      "Laudo Estrutural",
      "Laudo Grafotécnico",
      "Perícia Judicial",
    ],
  },
  {
    icone: "fa-solid fa-earth-americas",
    titulo: "Gestão Ambiental",
    texto:
      "Implantação de sistemas de gestão ambiental, monitoramento e relatórios para conformidade regulatória.",
    tags: [
      "PGRSS",
      "PGRS",
      "Inventário de Resíduos",
      "Manifesto de Resíduos",
      "Plano de Ação Ambiental",
      "ISO 14001",
    ],
  },
  {
    icone: "fa-solid fa-stamp",
    titulo: "Regularização Técnica",
    texto:
      "Habite-se, AVCB, regularização de obras e documentação junto aos órgãos competentes.",
    tags: [
      "Habite-se",
      "AVCB / CLCB",
      "Alvará de Construção",
      "Alvará de Funcionamento",
      "RRT / ART de Regularização",
    ],
  },
  {
    icone: "fa-solid fa-clipboard-check",
    titulo: "Inspeções Técnicas",
    texto:
      "Inspeção predial, de equipamentos e instalações com emissão de relatórios detalhados.",
    tags: [
      "Laudo de Inspeção Predial",
      "Laudo de Fachada",
      "Laudo de Patologias",
      "Laudo de Impermeabilização",
      "ABNT NBR 5674",
      "Plano de Manutenção Preventiva",
    ],
  },
  {
    icone: "fa-solid fa-list-check",
    titulo: "Planejamento de Obras",
    texto:
      "Planejamento completo do ciclo da obra para garantir eficiência e cumprimento de prazos.",
    tags: [
      "EAP",
      "Cronograma PERT/CPM",
      "Cronograma Físico-Financeiro",
      "Planilha de Quantitativos",
      "Orçamento Analítico",
      "BDI",
      "Fluxo de Caixa da Obra",
    ],
  },
  {
    icone: "fa-solid fa-chalkboard-user",
    titulo: "Treinamentos",
    texto:
      "Capacitações em segurança do trabalho, NRs e gestão ambiental para colaboradores e gestores.",
    tags: [
      "NR-05 / CIPA",
      "NR-06 / EPI",
      "NR-10",
      "NR-12",
      "NR-17",
      "NR-18",
      "NR-33",
      "NR-35",
      "Primeiros Socorros",
      "Combate a Incêndio",
    ],
  },
];

const DIFERENCIAIS = [
  {
    icone: "fa-solid fa-award",
    titulo: "Atendimento Especializado",
    texto:
      "Cada projeto é tratado de forma única, com soluções personalizadas às necessidades do cliente.",
  },
  {
    icone: "fa-solid fa-users-gear",
    titulo: "Equipe Altamente Qualificada",
    texto: "Profissionais registrados no CREA com especialização comprovada em suas áreas.",
  },
  {
    icone: "fa-solid fa-scale-balanced",
    titulo: "Conformidade com Normas Técnicas",
    texto: "Projetos e laudos seguindo rigorosamente normas ABNT, NRs e legislação ambiental.",
  },
  {
    icone: "fa-solid fa-rocket",
    titulo: "Agilidade e Eficiência",
    texto: "Processos otimizados para entregar no prazo sem abrir mão da qualidade.",
  },
];

const PORTFOLIO_CATEGORIAS = [
  { id: "todos", nome: "Todos" },
  { id: "civil", nome: "Engenharia Civil" },
  { id: "ambiental", nome: "Ambiental" },
  { id: "seguranca", nome: "Segurança" },
  { id: "projetos", nome: "Projetos" },
];

const PORTFOLIO_ITENS = [
  {
    categoria: "civil",
    titulo: "Obra Residencial Multifamiliar",
    tipo: "Engenharia Civil · Gerenciamento",
    imagens: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    categoria: "projetos",
    titulo: "Projeto Estrutural Industrial",
    tipo: "Projetos Estruturais",
    imagens: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    categoria: "ambiental",
    titulo: "Estudo de Impacto Ambiental",
    tipo: "Engenharia Ambiental · Licenciamento",
    imagens: [
      "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    categoria: "seguranca",
    titulo: "Programa de Segurança Industrial",
    tipo: "Segurança do Trabalho · Treinamentos",
    imagens: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1581092334441-9f26d3212f7d?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    categoria: "civil",
    titulo: "Fiscalização de Obras Públicas",
    tipo: "Fiscalização · Gerenciamento",
    imagens: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    categoria: "projetos",
    titulo: "Projeto Elétrico Comercial",
    tipo: "Projetos Elétricos",
    imagens: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    categoria: "civil",
    titulo: "Ampliação de Galpão Logístico",
    tipo: "Estruturas · Execução",
    imagens: [
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    categoria: "ambiental",
    titulo: "Plano de Gestão de Resíduos",
    tipo: "Gestão Ambiental · PGRS",
    imagens: [
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    categoria: "seguranca",
    titulo: "Implantação de PGR",
    tipo: "Segurança do Trabalho · Conformidade",
    imagens: [
      "https://images.unsplash.com/photo-1581092334441-9f26d3212f7d?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    categoria: "projetos",
    titulo: "Projeto de Regularização Predial",
    tipo: "Projetos · Aprovações",
    imagens: [
      "https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    categoria: "civil",
    titulo: "Planejamento de Canteiro",
    tipo: "Obras · Planejamento",
    imagens: [
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    categoria: "ambiental",
    titulo: "Licenciamento de Operação",
    tipo: "Ambiental · Regularização",
    imagens: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&w=700&q=80",
    ],
  },
];

const PORTFOLIO_ITENS_ROTATIVOS = PORTFOLIO_ITENS.map((item, index) => ({
  ...item,
  imagem: resolveRotatingImage(
    item.imagens,
    index * 3,
    `projeto de ${item.categoria} em engenharia ${item.titulo}`
  ),
}));

const CONTATOS = [
  {
    icone: "fa-solid fa-location-dot",
    titulo: "Endereço",
    texto: "Rua José Alves de Mello, 770 · Centro - Ibirá/SP",
  },
  {
    icone: "fa-brands fa-whatsapp",
    titulo: "WhatsApp — Rafael Antonio Dias",
    texto: "(17) 99721-1208",
    href: "https://wa.me/5517997211208",
  },
  {
    icone: "fa-brands fa-whatsapp",
    titulo: "WhatsApp — Rafael Antonio Dias Filho",
    texto: "(17) 99659-0330",
    href: "https://wa.me/5517996590330",
  },
  {
    icone: "fa-solid fa-clock",
    titulo: "Atendimento",
    texto: "Seg. a Sex. 08h-18h · Sáb. 08h-12h",
  },
];

const SERVICOS_FORM_OPTIONS = [
  "Engenharia Civil",
  "Engenharia Ambiental",
  "Segurança do Trabalho",
  "Corpo de Bombeiros (PSCIP / AVCB / CLCB)",
  "Topografia",
  "Projetos Estruturais",
  "Gerenciamento de Obras",
  "Planejamento de Obras",
  "Consultoria Técnica",
  "Laudos e Perícias",
  "Gestão Ambiental",
  "Regularização Técnica",
  "Inspeções Técnicas",
  "Treinamentos",
];

const SECTION_IDS = NAV_LINKS.map((item) => item.id);

export default function App() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [slideAtual, setSlideAtual] = useState(0);
  const [abaPortfolio, setAbaPortfolio] = useState("todos");
  const [navAtiva, setNavAtiva] = useState("");
  const [navbarScroll, setNavbarScroll] = useState(false);
  const [pedido, setPedido] = useState({ nome: "", servico: "", mensagem: "" });

  const [heroAnimados, setHeroAnimados] = useState(
    HERO_STATS.reduce((acc, item) => ({ ...acc, [item.key]: 0 }), {})
  );
  const [difAnimados, setDifAnimados] = useState(
    DIF_STATS.reduce((acc, item) => ({ ...acc, [item.key]: 0 }), {})
  );

  const heroStatsRef = useRef(null);
  const difStatsRef = useRef(null);
  const heroAnimouRef = useRef(false);
  const difAnimouRef = useRef(false);

  const portfolioFiltrado = useMemo(() => {
    if (abaPortfolio === "todos") return PORTFOLIO_ITENS_ROTATIVOS;
    return PORTFOLIO_ITENS_ROTATIVOS.filter((item) => item.categoria === abaPortfolio);
  }, [abaPortfolio]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideAtual((atual) => (atual + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let ticking = false;

    const atualizarScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setNavbarScroll(y > 60);

        let secaoAtual = "";
        SECTION_IDS.forEach((id) => {
          const elemento = document.getElementById(id);
          if (elemento && y >= elemento.offsetTop - 120) secaoAtual = id;
        });
        setNavAtiva(secaoAtual);
        ticking = false;
      });
    };

    atualizarScroll();
    window.addEventListener("scroll", atualizarScroll, { passive: true });
    return () => window.removeEventListener("scroll", atualizarScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Array.from(entry.target.parentElement?.children ?? []).indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(index * 0.06, 0.45)}s`;
          entry.target.classList.add("ok");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".rv, .rv-l, .rv-r").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!heroStatsRef.current || heroAnimouRef.current) return undefined;

    let frameId = null;

    const animar = () => {
      const inicio = performance.now();
      const duracao = 1300;

      const tick = (agora) => {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const valores = HERO_STATS.reduce((acc, stat) => {
          acc[stat.key] = Math.floor(stat.valor * progresso);
          return acc;
        }, {});
        setHeroAnimados(valores);
        if (progresso < 1) frameId = requestAnimationFrame(tick);
      };

      frameId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (entries[0]?.isIntersecting) {
          heroAnimouRef.current = true;
          animar();
          obs.disconnect();
        }
      },
      { threshold: 0.28 }
    );

    observer.observe(heroStatsRef.current);
    return () => {
      observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!difStatsRef.current || difAnimouRef.current) return undefined;

    let frameId = null;

    const animar = () => {
      const inicio = performance.now();
      const duracao = 1300;

      const tick = (agora) => {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const valores = DIF_STATS.reduce((acc, stat) => {
          acc[stat.key] = Math.floor(stat.valor * progresso);
          return acc;
        }, {});
        setDifAnimados(valores);
        if (progresso < 1) frameId = requestAnimationFrame(tick);
      };

      frameId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (entries[0]?.isIntersecting) {
          difAnimouRef.current = true;
          animar();
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(difStatsRef.current);
    return () => {
      observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  const WHATSAPP_PRINCIPAL = "5517997211208";

  const atualizarPedido = (campo) => (event) =>
    setPedido((atual) => ({ ...atual, [campo]: event.target.value }));

  const enviarPeloWhatsApp = (event) => {
    event.preventDefault();
    const linhas = ["Olá! Gostaria de solicitar um orçamento."];
    if (pedido.nome.trim()) linhas.push(`Nome: ${pedido.nome.trim()}`);
    if (pedido.servico) linhas.push(`Serviço de interesse: ${pedido.servico}`);
    if (pedido.mensagem.trim()) linhas.push(`Mensagem: ${pedido.mensagem.trim()}`);
    const url = `https://wa.me/${WHATSAPP_PRINCIPAL}?text=${encodeURIComponent(linhas.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const trocarSlide = (indice) => {
    setSlideAtual((indice + SLIDES.length) % SLIDES.length);
  };

  return (
    <>
      <header id="navbar" className={`navbar ${navbarScroll ? "scrolled" : ""}`}>
        <nav className="nav-wrap">
          <a className="logo" href="#hero">
            <span className="logo-icone">RD</span>
            <span className="logo-txt">
              <strong>RD Engenharia</strong>
              <small>Segurança e Meio Ambiente</small>
            </span>
          </a>

          <ul className="nav-links">
            {NAV_LINKS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`${navAtiva === item.id ? "ativa" : ""} ${item.cta ? "nav-cta" : ""}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            className={`hamburger ${menuAberto ? "open" : ""}`}
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
            onClick={() => setMenuAberto((valor) => !valor)}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
      </header>

      <aside id="menu-mobile" className={`nav-mobile ${menuAberto ? "open" : ""}`}>
        {NAV_LINKS.map((item) => (
          <a key={item.id} href={`#${item.id}`} onClick={() => setMenuAberto(false)}>
            {item.cta ? "Solicitar Orçamento" : item.label}
          </a>
        ))}
      </aside>

      <main>
        <section id="hero">
          <div className="slides-wrap">
            {SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`slide ${index === slideAtual ? "ativo" : ""}`}
                style={{
                  backgroundImage: `linear-gradient(120deg, rgba(10,15,12,.82), rgba(26,94,22,.45)), url('${slide.image}')`,
                }}
              />
            ))}
          </div>

          <div className="hero-overlay" />

          <div className="hero-content">
            <span className="hero-tag">
              <i className="fa-solid fa-location-dot" /> Ibirá/SP · Engenharia de Alto Padrão
            </span>
            <h1>
              Soluções <span>Inteligentes</span> em Engenharia, Segurança e Meio Ambiente
            </h1>
            <p>
              Excelência técnica, responsabilidade ambiental e segurança do trabalho reunidas em
              projetos de alto padrão, com eficiência, conformidade e compromisso total.
            </p>
            <div className="hero-btns">
              <a className="btn-verde" href="#contato">
                <i className="fa-solid fa-file-signature" /> Solicite um Orçamento
              </a>
              <a className="btn-outline" href="#servicos">
                <i className="fa-solid fa-grid-2" /> Nossos Serviços
              </a>
            </div>
          </div>

          <div className="slider-nav">
            <button className="sarr" aria-label="Slide anterior" onClick={() => trocarSlide(slideAtual - 1)}>
              <i className="fa-solid fa-chevron-left" />
            </button>

            <div className="s-dots">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  className={`sdot ${slideAtual === index ? "ativo" : ""}`}
                  onClick={() => trocarSlide(index)}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>

            <button className="sarr" aria-label="Próximo slide" onClick={() => trocarSlide(slideAtual + 1)}>
              <i className="fa-solid fa-chevron-right" />
            </button>
          </div>

          <div className="hero-stats" ref={heroStatsRef}>
            {HERO_STATS.map((stat) => (
              <div className="stat" key={stat.key}>
                <strong>
                  {heroAnimados[stat.key]}
                  {stat.sufixo}
                </strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="sobre" className="secao">
          <div className="container sobre-grid">
            <div className="sobre-vis rv-l">
              <div className="sobre-img">
                <img
                  src={ABOUT_IMAGE}
                  alt="Equipe de engenharia em campo"
                  loading="lazy"
                />
              </div>
              <div className="sobre-badge">
                <strong>CREA</strong>
                <span>Habilitação Registrada</span>
              </div>
            </div>

            <article className="sobre-txt rv-r">
              <div className="head-secao left">
                <h2>
                  Excelência técnica com <span>responsabilidade</span>
                </h2>
              </div>
              <p>
                A <strong>RD Engenharia Segurança e Meio Ambiente</strong> é uma empresa especializada
                em soluções de engenharia civil, ambiental e segurança do trabalho, sediada em Ibirá/SP.
              </p>
              <p>
                Fundada com o propósito de oferecer serviços técnicos de alto nível, atendemos clientes
                dos setores público e privado com comprometimento, inovação e rigor normativo.
              </p>
              <p>
                Nossa equipe é formada por engenheiros e consultores habilitados junto ao CREA, prontos
                para desenvolver projetos completos, do planejamento à execução.
              </p>

              <div className="sobre-cards mvv">
                {SOBRE_MVV.map((item) => (
                  <div className="sobre-card" key={item.titulo}>
                    <i className={item.icone} />
                    <h3>{item.titulo}</h3>
                    <p>{item.texto}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="profissional" className="secao secao-cinza">
          <div className="container">
            <div className="head-secao rv">
              <h2>
                Conheça os <span>Profissionais</span>
              </h2>
              <p>
                Equipe multidisciplinar com formação técnica completa para atender projetos de
                engenharia civil, ambiental, segurança do trabalho e muito mais.
              </p>
            </div>

            {PROFISSIONAIS.map((profissional, index) => (
              <div
                className={`profissional-bloco rv ${profissional.variante === "secundario" ? "secundario" : ""}`}
                key={profissional.id}
              >
                <aside className="prof-card-detalhe">
                  <div className="prof-avatar">
                    <span className="prof-iniciais">{profissional.iniciais}</span>
                    <span className="prof-status">
                      <i className={profissional.statusIcone} /> {profissional.status}
                    </span>
                  </div>
                  <h3>{profissional.nome}</h3>
                  <p>{profissional.cargo}</p>

                  <div className="prof-selos">
                    {profissional.selos.map((selo) => (
                      <div className="selo" key={`${profissional.id}-${selo.texto}`}>
                        <i className={selo.icone} />
                        <span>{selo.texto}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href={profissional.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={profissional.botaoClasse}
                  >
                    <i className="fa-brands fa-whatsapp" /> {profissional.whatsapp}
                  </a>
                </aside>

                <div className="prof-conteudo">
                  <div className="formacoes-grid">
                    {profissional.formacoes.map((grupo) => (
                      <div className="formacao-grupo" key={`${profissional.id}-${grupo.titulo}`}>
                        <h4>
                          <i className={grupo.icone} /> {grupo.titulo}
                        </h4>
                        <div className="formacao-lista">
                          {grupo.itens.map((item) => (
                            <div className="formacao-item" key={`${profissional.id}-${item.titulo}`}>
                              <i className={item.icone} />
                              <div>
                                <strong>{item.titulo}</strong>
                                <span>{item.detalhe}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="comp-grupo">
                    <h4>
                      <i className="fa-solid fa-star" /> Competências Técnicas
                    </h4>
                    <div className="competencias-grid">
                      {profissional.competencias.map((area) => (
                        <article className="comp-area" key={`${profissional.id}-${area.titulo}`}>
                          <h5>
                            <i className={area.icone} /> {area.titulo}
                          </h5>
                          <div className="comp-tags">
                            {area.tags.map((tag) => (
                              <span key={`${profissional.id}-${area.titulo}-${tag}`}>{tag}</span>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>

                {index === 0 && <div className="prof-divisor-linha" />}
              </div>
            ))}
          </div>
        </section>

        <section id="servicos" className="secao">
          <div className="container">
            <div className="head-secao rv">
              <h2>
                Soluções completas em <span>Engenharia</span>
              </h2>
              <p>
                Ampla gama de serviços técnicos para empresas, indústrias, órgãos públicos e pessoas
                físicas, com excelência e total conformidade legal.
              </p>
            </div>

            <div className="serv-grid serv-grid-amplo">
              {SERVICOS.map((servico) => (
                <article className="serv-card rv" key={servico.titulo}>
                  <i className={servico.icone} />
                  <h3>{servico.titulo}</h3>
                  <p>{servico.texto}</p>
                  <div className="serv-tags">
                    {servico.tags.map((tag) => (
                      <span key={`${servico.titulo}-${tag}`}>{tag}</span>
                    ))}
                  </div>
                  <a href="#contato" className="btn-saiba">
                    Saiba Mais <i className="fa-solid fa-arrow-right" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="diferenciais" className="secao secao-verde">
          <div className="container dif-layout">
            <article className="dif-col rv-l">
              <div className="head-secao left">
                <h2>
                  O que nos torna <span>diferentes</span>
                </h2>
                <p>
                  Combinamos experiência técnica sólida com tecnologia moderna e atendimento
                  personalizado para garantir resultados excepcionais.
                </p>
              </div>

              <div className="dif-lista">
                {DIFERENCIAIS.map((item) => (
                  <article className="dif-item" key={item.titulo}>
                    <i className={item.icone} />
                    <div>
                      <h4>{item.titulo}</h4>
                      <p>{item.texto}</p>
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <aside className="dif-numeros rv-r" ref={difStatsRef}>
              {DIF_STATS.map((item) => (
                <div className="dif-num-card" key={item.key}>
                  <strong>
                    {difAnimados[item.key]}
                    {item.sufixo}
                  </strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </aside>
          </div>
        </section>

        <section id="portfolio" className="secao">
          <div className="container">
            <div className="head-secao rv">
              <h2>
                Nossos <span>Projetos</span> Realizados
              </h2>
              <p>
                Uma seleção de obras, projetos e serviços executados com excelência técnica e
                compromisso com a qualidade.
              </p>
            </div>

            <div className="port-tabs">
              {PORTFOLIO_CATEGORIAS.map((cat) => (
                <button
                  key={cat.id}
                  className={`ptab ${abaPortfolio === cat.id ? "ativo" : ""}`}
                  aria-pressed={abaPortfolio === cat.id}
                  onClick={() => setAbaPortfolio(cat.id)}
                >
                  {cat.nome}
                </button>
              ))}
            </div>

            <div className="port-grid">
              {portfolioFiltrado.map((item) => (
                <article className="port-card rv" key={`${item.titulo}-${item.categoria}`}>
                  <img
                    src={item.imagem}
                    alt={item.titulo}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="port-overlay">
                    <h3>{item.titulo}</h3>
                    <span>{item.tipo}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="secao secao-cinza">
          <div className="container">
            <div className="contato-grid">
              <article className="rv-l">
                <div className="head-secao left">
                  <h2>
                    Vamos trabalhar <span>juntos</span>
                  </h2>
                  <p>
                    Entre em contato e solicite seu orçamento sem compromisso. Nossa equipe está
                    pronta para apresentar a melhor solução técnica para o seu projeto.
                  </p>
                </div>

                <div className="ct-itens">
                  {CONTATOS.map((item) => (
                    <div className="ct-item" key={`${item.titulo}-${item.texto}`}>
                      <div className="ct-ico">
                        <i className={item.icone} />
                      </div>
                      <div className="ct-txt">
                        <strong>{item.titulo}</strong>
                        {item.href ? (
                          <a href={item.href} target="_blank" rel="noopener noreferrer">
                            {item.texto}
                          </a>
                        ) : (
                          <span>{item.texto}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="https://wa.me/5517997211208?text=Olá!%20Gostaria%20de%20solicitar%20um%20orçamento."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wpp-link"
                >
                  <i className="fa-brands fa-whatsapp" /> Falar pelo WhatsApp
                </a>
              </article>

              <form className="form-box contato-form rv-r" onSubmit={enviarPeloWhatsApp}>
                <h3 className="form-titulo">Peça seu orçamento pelo WhatsApp</h3>
                <p className="form-aviso">
                  Preencha se quiser. Ao clicar no botão, o WhatsApp abre com a sua mensagem pronta
                  para enviar.
                </p>

                <div className="fg">
                  <label htmlFor="nome">Seu nome</label>
                  <input
                    id="nome"
                    type="text"
                    autoComplete="name"
                    placeholder="Como podemos te chamar?"
                    value={pedido.nome}
                    onChange={atualizarPedido("nome")}
                  />
                </div>

                <div className="fg">
                  <label htmlFor="servico">Serviço de interesse</label>
                  <select id="servico" value={pedido.servico} onChange={atualizarPedido("servico")}>
                    <option value="">Selecione um serviço...</option>
                    {SERVICOS_FORM_OPTIONS.map((opcao) => (
                      <option key={opcao} value={opcao}>
                        {opcao}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="fg">
                  <label htmlFor="msg">Mensagem</label>
                  <textarea
                    id="msg"
                    rows="4"
                    placeholder="Descreva brevemente seu projeto ou necessidade..."
                    value={pedido.mensagem}
                    onChange={atualizarPedido("mensagem")}
                  />
                </div>

                <button type="submit" className="btn-verde submit-btn">
                  <i className="fa-brands fa-whatsapp" /> Continuar no WhatsApp
                </button>
              </form>
            </div>

            <div className="mapa-bloco rv">
              <iframe
                src="https://www.google.com/maps?q=Rua+Jos%C3%A9+Alves+de+Mello+770+Ibir%C3%A1+SP&hl=pt-BR&z=16&output=embed"
                width="100%"
                height="380"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RD Engenharia - Ibirá/SP"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="#hero" className="logo">
              <span className="logo-icone">RD</span>
              <span className="logo-txt">
                <strong>RD Engenharia</strong>
                <small>Seg. e Meio Ambiente</small>
              </span>
            </a>
            <p>
              Soluções técnicas integradas em engenharia civil, ambiental e segurança do trabalho.
              Qualidade, responsabilidade e inovação em cada projeto.
            </p>
            <div className="redes">
              <a
                href="https://wa.me/5517997211208"
                className="rede"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <i className="fa-brands fa-whatsapp" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navegação</h4>
            <ul>
              <li>
                <a href="#sobre">Sobre a Empresa</a>
              </li>
              <li>
                <a href="#servicos">Serviços</a>
              </li>
              <li>
                <a href="#diferenciais">Diferenciais</a>
              </li>
              <li>
                <a href="#portfolio">Portfólio</a>
              </li>
              <li>
                <a href="#contato">Contato</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Serviços</h4>
            <ul>
              <li>
                <a href="#servicos">Engenharia Civil</a>
              </li>
              <li>
                <a href="#servicos">Engenharia Ambiental</a>
              </li>
              <li>
                <a href="#servicos">Segurança do Trabalho</a>
              </li>
              <li>
                <a href="#servicos">Corpo de Bombeiros</a>
              </li>
              <li>
                <a href="#servicos">Topografia</a>
              </li>
              <li>
                <a href="#servicos">Laudos e Perícias</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Credenciais</h4>
            <div className="cert">
              <i className="fa-solid fa-id-card" />
              <span>
                Habilitados junto ao <strong>CREA-SP</strong>
              </span>
            </div>
            <div className="cert">
              <i className="fa-solid fa-shield-halved" />
              <span>
                Conformidade com <strong>ABNT e NRs</strong>
              </span>
            </div>
            <div className="cert">
              <i className="fa-solid fa-leaf" />
              <span>
                Responsabilidade <strong>Ambiental</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 <strong>RD Engenharia Segurança e Meio Ambiente</strong> - Todos os direitos reservados.
          </p>
          <p>
            Rua José Alves de Mello, 770, Centro - Ibirá/SP ·{" "}
            <a href="https://www.rdibiraengenharia.com.br">rdibiraengenharia.com.br</a>
          </p>
        </div>
      </footer>

      <a
        href="https://wa.me/5517997211208?text=Olá!%20Gostaria%20de%20um%20orçamento."
        target="_blank"
        rel="noopener noreferrer"
        className="wpp-float"
        aria-label="WhatsApp"
      >
        <i className="fa-brands fa-whatsapp" />
      </a>
    </>
  );
}
