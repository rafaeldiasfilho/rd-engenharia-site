// Illustrations of sample documents, drawn like real covers and drawing sheets. None of them is a real
// document: the client is fictitious ("Exemplo"), there is no signature and no ART number; only RD's public
// data and the technical lead's (the same as in the footer) appear. Every sheet carries the "EXEMPLO" stamp.
// The paper is always light, so it works in both light and dark themes. Every sheet has alt text.
//  - FolhaSvg: the sheet (cover, drawing sheet or certificate), or the inner page of a cover.
//  - FolhaLeitura: the enlarged sheet, with "Capa / Página interna / Como ler" tabs and zoom.
//  - DocsIlustracao (default): two stacked sheets in the "Para agilizar, separe" section.

import { useId } from "react";
import { SAMPLE_CAPTION, ExampleStamp } from "./SheetBase";
import { SheetByLayout } from "./sheets/SheetSvg.jsx";

const PAIRS = {
  "seguranca-do-trabalho": {
    alt: "Duas folhas de exemplo empilhadas: na frente, a capa de um Programa de Gerenciamento de Riscos (PGR) da RD para uma empresa fictícia; atrás, a capa de um LTCAT",
    front: { title: "PGR", subtitle: "Programa de Gerenciamento de Riscos", layout: "capa", doc: "Programa de Gerenciamento de Riscos", ref: "PGR · NR-01", contents: ["Identificação da organização", "Inventário de riscos", "Plano de ação"], art: true },
    back: { title: "LTCAT", subtitle: "Laudo das condições do ambiente de trabalho", layout: "capa", doc: "Laudo Técnico das Condições do Ambiente de Trabalho", ref: "LTCAT" },
  },
  "corpo-de-bombeiros": {
    alt: "Duas folhas de exemplo empilhadas: na frente, a prancha de um projeto de segurança contra incêndio com planta, extintores, iluminação de emergência, rota de fuga e carimbo; atrás, a capa da preparação para a vistoria do AVCB",
    front: { title: "PSCIP", subtitle: "Projeto de segurança contra incêndio", body: "incendio", layout: "prancha", doc: "Projeto de Segurança Contra Incêndio", ref: "Planta de medidas de segurança", scale: "1:100", art: true },
    back: { title: "AVCB", subtitle: "Preparação para a vistoria", layout: "capa", doc: "Preparação para Vistoria do AVCB", ref: "Lista de exigências" },
  },
  "engenharia-civil": {
    alt: "Duas folhas de exemplo empilhadas: na frente, a prancha de um projeto arquitetônico com planta baixa cotada e carimbo; atrás, a capa de um laudo técnico de vistoria",
    front: { title: "PROJETO", subtitle: "Projeto arquitetônico", body: "planta", layout: "prancha", doc: "Projeto Arquitetônico", ref: "Planta baixa", scale: "1:50", art: true },
    back: { title: "LAUDO", subtitle: "Laudo técnico de vistoria", layout: "capa", doc: "Laudo Técnico de Vistoria", ref: "Imóvel residencial" },
  },
  "meio-ambiente-topografia": {
    alt: "Duas folhas de exemplo empilhadas: na frente, a planta de um imóvel rural georreferenciado com vértices, coordenadas e carimbo; atrás, a prancha do mapa do imóvel para o CAR",
    front: { title: "MEMORIAL", subtitle: "Georreferenciamento do imóvel", body: "terreno", layout: "prancha", doc: "Planta do Imóvel Georreferenciado", ref: "Vértices e confrontações", scale: "1:5.000", art: true },
    back: { title: "CAR", subtitle: "Cadastro ambiental rural", body: "car", layout: "prancha", doc: "Mapa do Imóvel para o CAR", ref: "APP e reserva legal", scale: "1:5.000" },
  },
};

export default function DocIllustration({ slug }) {
  const uid = useId().replace(/:/g, "");
  const m = PAIRS[slug];
  if (!m) return null;
  return (
    <figure className="docs-illustration">
      <svg viewBox="0 0 335 250" role="img" aria-label={m.alt} focusable="false">
        <SheetByLayout x={168} y={10} rot={5} m={m.back} area={slug} uid={`${uid}t`} />
        <SheetByLayout x={26} y={28} rot={-4} m={m.front} area={slug} uid={`${uid}f`} />
        <ExampleStamp x={40} y={10} rot={-10} s={1.3} />
      </svg>
      <figcaption>{SAMPLE_CAPTION}</figcaption>
    </figure>
  );
}
