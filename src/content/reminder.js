// Documents offered on the expiry reminder form (/lembrete-de-vencimento) and the tip shown for each one.
// key: stable lowercase ASCII id used in links (/lembrete-de-vencimento?documento=<key>). Other pages link
//   with it, so never rename a key; add an alias instead.
// aliases: other link keys that open the same option (?documento=clcb opens "AVCB ou CLCB").
// label: text the visitor sees; it is also the value saved in lembretes_site.documento.
// tip: deadline guidance shown when the option is chosen (null when there is none). Each document states its
//   own validity; the standards fix a deadline only in some cases. The exact deadline is confirmed for each case at renewal.

export const REMINDER_DOCUMENTS = [
  {
    key: "avcb",
    aliases: ["clcb"],
    label: "AVCB ou CLCB (Corpo de Bombeiros)",
    tip: "A validade varia conforme o risco da edificação e está impressa no certificado. A renovação leva tempo, por isso vale começar com antecedência.",
  },
  {
    key: "pgr",
    aliases: [],
    label: "PGR (gerenciamento de riscos)",
    tip: "A NR-1 pede que a avaliação de riscos seja revista, no máximo, a cada 2 anos, e antes disso quando algo muda no trabalho.",
  },
  {
    key: "ltcat",
    aliases: ["ppp"],
    label: "LTCAT / PPP",
    tip: "Não tem prazo fixo de validade. O LTCAT é atualizado quando muda o ambiente, as máquinas ou as atividades.",
  },
  {
    key: "insalubridade",
    aliases: ["periculosidade"],
    label: "Laudo de insalubridade ou periculosidade",
    tip: "Não tem prazo fixo. Vale revisar quando mudam o ambiente, os processos ou os equipamentos.",
  },
  {
    key: "treinamento",
    aliases: [],
    label: "Treinamento de NR (CIPA, NR-35, NR-10 etc.)",
    tip: "NR-35 e NR-10 pedem reciclagem a cada 2 anos. O treinamento da CIPA é renovado a cada mandato. Confira a data no certificado.",
  },
  {
    key: "alvara",
    aliases: [],
    label: "Alvará ou licença",
    tip: "A validade e a renovação dependem da prefeitura. Informe a data que consta no documento.",
  },
  {
    key: "car",
    aliases: ["licenciamento", "outorga"],
    label: "CAR, licença ambiental ou outorga",
    tip: "O prazo depende do órgão que emitiu. Informe a data que consta no documento.",
  },
  { key: "outro", aliases: [], label: "Outro documento", tip: null },
];

// Document chosen when the page opens without a valid ?documento=<key>.
export const DEFAULT_REMINDER_DOCUMENT_KEY = "avcb";

// Every key another page may use in ?documento=<key>: each main key followed by its aliases.
export const REMINDER_DOCUMENT_LINK_KEYS = REMINDER_DOCUMENTS.flatMap((reminderDocument) => [
  reminderDocument.key,
  ...reminderDocument.aliases,
]);

// Document of a link key (main key or alias), or null when the key is unknown.
export function findReminderDocument(linkKey) {
  return REMINDER_DOCUMENTS.find((d) => d.key === linkKey || d.aliases.includes(linkKey)) || null;
}

// Link to the reminder form with the document already chosen: "pgr" -> "/lembrete-de-vencimento?documento=pgr".
export function buildReminderPageHref(documentKey) {
  return `/lembrete-de-vencimento?documento=${encodeURIComponent(documentKey)}`;
}
