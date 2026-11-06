// Example certificate sheet (licences such as CLCB).

import { SHEET_BORDER, SHEET_GRAY, CREA, ISSUE_DATE, Logo, RESPONSIBLE_ENGINEER, SHEET_INK, SHEET_GREEN, clientFor } from "../SheetBase";

export function Certificate({ m, area }) {
  const [client] = clientFor(m, area);
  return (
    <g fontFamily="inherit" textAnchor="middle">
      <rect x="7" y="7" width="136" height="184" rx="2" fill="none" stroke={SHEET_GREEN} strokeWidth="1.2" />
      <rect x="10.5" y="10.5" width="129" height="177" rx="1.5" fill="none" stroke={SHEET_GREEN} strokeWidth="0.4" />
      <g textAnchor="start">
        <Logo x={47} y={20} />
      </g>
      <text x="75" y="54" fontSize="11" fontWeight="700" fill={SHEET_GREEN} letterSpacing="1">
        CERTIFICADO
      </text>
      <text x="75" y="61" fontSize="3.8" fill={SHEET_GRAY} letterSpacing="1.4">
        DE TREINAMENTO
      </text>
      <text x="75" y="76" fontSize="4" fill={SHEET_GRAY}>
        Certificamos que
      </text>
      <text x="75" y="86" fontSize="6.4" fontWeight="700" fill={SHEET_INK}>
        Nome do Participante
      </text>
      <text x="75" y="95" fontSize="4" fill={SHEET_GRAY}>
        concluiu o treinamento de
      </text>
      <text x="75" y="104" fontSize="5.4" fontWeight="700" fill={SHEET_GREEN}>
        {m.doc || m.subtitle}
      </text>
      <text x="75" y="111.6" fontSize="3.5" fill={SHEET_GRAY}>
        Carga horária e conteúdo conforme a norma
      </text>
      <text x="75" y="126" fontSize="3.6" fill={SHEET_INK}>
        {client} · Ibirá/SP, {ISSUE_DATE}
      </text>
      <line x1="18" y1="158" x2="68" y2="158" stroke={SHEET_BORDER} />
      <line x1="82" y1="158" x2="132" y2="158" stroke={SHEET_BORDER} />
      <text x="43" y="164" fontSize="3.4" fill={SHEET_INK}>
        Instrutor
      </text>
      <text x="107" y="164" fontSize="3.4" fill={SHEET_INK}>
        Responsável técnico
      </text>
      <text x="107" y="169" fontSize="2.8" fill={SHEET_GRAY}>
        {RESPONSIBLE_ENGINEER} · {CREA}
      </text>
    </g>
  );
}
