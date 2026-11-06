// Home page content: needs by area, how-it-works steps, technical lead education, request form services and section links.

import { AREAS } from "./areas";

// Each card's title comes from AREAS (rotulo), so the area name is the same across the whole site.
export const NEEDS = [
  {
    slug: "seguranca-do-trabalho",
    photo: "capacete-vermelho-epi",
    phrase: "Tenho funcionários e preciso de PGR, laudos ou treinamentos.",
  },
  {
    slug: "corpo-de-bombeiros",
    photo: "extintor-parede-concreto-pictograma",
    phrase: "Preciso de AVCB ou CLCB para o meu imóvel ou comércio.",
  },
  {
    slug: "engenharia-civil",
    photo: "edificio-estrutura-concreto-pavimentos",
    phrase: "Vou construir, reformar ou regularizar um imóvel.",
  },
  {
    slug: "meio-ambiente-topografia",
    photo: "rio-mata-vista-aerea",
    phrase: "Tenho imóvel rural e preciso de CAR, georreferenciamento ou topografia.",
  },
].map((n) => ({ ...n, title: AREAS.find((a) => a.slug === n.slug).label }));

export const STEPS = [
  { title: "Você chama no WhatsApp", text: "Conte o que precisa. Respondemos no horário de atendimento." },
  { title: "Entendemos o seu caso", text: "Analisamos a situação e os documentos que você já tem." },
  { title: "Você recebe o orçamento", text: "Valor e condições claros, por escrito e sem compromisso." },
  { title: "Executamos e entregamos", text: "Trabalho feito por responsável técnico habilitado, com ART." },
];

export const EDUCATION = [
  "Engenharia Civil e Engenharia Ambiental (bacharelados)",
  "Pós-graduação em Engenharia de Segurança do Trabalho",
  "Pós-graduação em Georreferenciamento de Imóveis Rurais",
  "Pós-graduação em Topografia e Sensoriamento Remoto",
  "Pós-graduação em Gestão Ambiental e em Higiene Ocupacional",
  "Técnico em Segurança do Trabalho",
];

export const FORM_SERVICES = AREAS.map((a) => a.name);

export const HOME_SECTIONS = [
  { id: "organizamos", label: "O que organizamos" },
  { id: "na-pratica", label: "Na prática" },
  { id: "como-funciona", label: "Como funciona" },
  { id: "duvidas", label: "Dúvidas" },
  { id: "contato", label: "Contato" },
];
