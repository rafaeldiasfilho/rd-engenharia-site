// Every prerendered page (areas, guides and the other inner pages) and the lookup by URL slug.
// Plain text, with no prices and no fixed deadlines; the team confirms each case before any quote.

import { AREAS } from "./areas.js";
import { GUIDES } from "./guides.js";

export const SITE_URL = "https://rdibiraengenharia.com.br";

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

export const findPage = (slug) => PAGES.find((p) => p.slug === slug);
