// The four service areas, in menu order, and the overview data shown on each area page.
// Plain text, with no prices and no fixed deadlines; the team confirms each case before any quote.

import { WORK_SAFETY_AREA } from "./areas/workSafetyArea.js";
import { FIRE_SAFETY_AREA } from "./areas/fireSafetyArea.js";
import { CIVIL_ENGINEERING_AREA } from "./areas/civilEngineeringArea.js";
import { ENVIRONMENT_AND_SURVEY_AREA } from "./areas/environmentAndSurveyArea.js";

export const AREAS = [WORK_SAFETY_AREA, FIRE_SAFETY_AREA, CIVIL_ENGINEERING_AREA, ENVIRONMENT_AND_SURVEY_AREA];

export const findArea = (slug) => AREAS.find((p) => p.slug === slug);

// Quick summary and steps for each area (no fixed deadlines or prices).
export const AREA_OVERVIEW = {
  "seguranca-do-trabalho": {
    who: "Empresas com empregados, de qualquer porte.",
    deliverable: "Programas e laudos assinados por profissional habilitado, prontos para uma fiscalização.",
    steps: [
      { t: "Conversa no WhatsApp", d: "Você conta o ramo da empresa e quantos funcionários tem." },
      { t: "Visita ao local", d: "Olhamos os ambientes, as máquinas e as tarefas de cada função." },
      { t: "Elaboração", d: "Preparamos o programa ou o laudo com base no que foi visto." },
      { t: "Entrega e acompanhamento", d: "Entregamos os documentos e avisamos antes de vencerem." },
    ],
  },
  "corpo-de-bombeiros": {
    who: "Comércios, indústrias, escolas, clínicas e condomínios.",
    deliverable: "Projeto, protocolo e licença do Corpo de Bombeiros (AVCB ou CLCB), conforme o enquadramento.",
    steps: [
      { t: "Enquadramento", d: "Com área, altura e uso do imóvel, definimos qual licença é exigida." },
      { t: "Levantamento no imóvel", d: "Medimos e anotamos o que já existe de proteção contra incêndio." },
      { t: "Projeto e protocolo", d: "Elaboramos o projeto e protocolamos junto ao Corpo de Bombeiros." },
      { t: "Vistoria e licença", d: "Orientamos as adequações e acompanhamos até a emissão." },
    ],
  },
  "engenharia-civil": {
    who: "Quem vai construir, reformar, vender ou regularizar um imóvel.",
    deliverable: "Projetos, regularização, laudos e documentos prontos para a prefeitura, com ART.",
    steps: [
      { t: "Conversa e documentos", d: "Você envia matrícula, fotos e conta o que pretende fazer." },
      { t: "Visita e levantamento", d: "Medimos o imóvel e verificamos a situação real da obra." },
      { t: "Projeto ou regularização", d: "Elaboramos os projetos e protocolamos na prefeitura." },
      { t: "Alvará ou habite-se", d: "Acompanhamos o processo até a liberação dos documentos." },
    ],
  },
  "meio-ambiente-topografia": {
    who: "Proprietários rurais, empresas e quem vai dividir ou vender um terreno.",
    deliverable: "Cadastros, levantamentos e certificações, conforme o caso.",
    steps: [
      { t: "Análise dos documentos", d: "Conferimos matrícula, CCIR e a finalidade do trabalho." },
      { t: "Trabalho de campo", d: "Medimos a área com equipamento de precisão." },
      { t: "Elaboração", d: "Montamos mapas, memoriais e o cadastro ou pedido de licença." },
      { t: "Entrega e acompanhamento", d: "Conduzimos o processo no órgão responsável até a conclusão." },
    ],
  },
};
