// Service types, statuses and empty records used by the internal area forms. Field names follow the database columns (Portuguese).

export const SERVICE_TYPES = [
  "PGR (gerenciamento de riscos)",
  "PCMSO (integração com o programa médico)",
  "LTCAT e PPP",
  "Laudo de insalubridade",
  "Laudo de periculosidade",
  "APR, mapa de risco ou AET",
  "Treinamento de NR",
  "AVCB",
  "CLCB",
  "Projeto de segurança contra incêndio",
  "Projeto arquitetônico ou estrutural",
  "Regularização de obra e habite-se",
  "Laudo, vistoria ou perícia",
  "Inspeção predial",
  "Gerenciamento ou planejamento de obra",
  "CAR",
  "Georreferenciamento",
  "Topografia",
  "Licenciamento ambiental",
  "Outorga de uso da água",
  "PGRS ou PGRSS",
  "Outro",
];

export const STATUS = { orcamento: "Orçamento", em_andamento: "Em andamento", concluido: "Concluído" };

export const emptyClient = {
  nome: "",
  tipo: "pf",
  documento: "",
  contato: "",
  telefone: "",
  whatsapp: "",
  email: "",
  cep: "",
  logradouro: "",
  numero: "",
  bairro: "",
  cidade: "",
  uf: "SP",
  origem: "",
  observacoes: "",
  aceita_lembretes: false,
  aceite_lembretes_em: "",
};

export const emptyService = {
  tipo: SERVICE_TYPES[0],
  descricao: "",
  local_servico: "",
  status: "concluido",
  data_realizacao: "",
  repetir_meses: "",
  vencimento: "",
  art_numero: "",
  valor: "",
  observacoes: "",
};
