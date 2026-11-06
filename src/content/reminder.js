// Documents offered on the expiry reminder form and the tip shown for each one.

export const REMINDER_DOCUMENTS = [
  "AVCB ou CLCB (Corpo de Bombeiros)",
  "PGR (gerenciamento de riscos)",
  "LTCAT / PPP",
  "Laudo de insalubridade ou periculosidade",
  "Treinamento de NR (CIPA, NR-35, NR-10 etc.)",
  "Alvará ou licença",
  "CAR, licença ambiental ou outorga",
  "Outro documento",
];

// Deadline guidance shown on the reminder page. Each document states its own validity;
// the standards fix a deadline only in some cases. The exact deadline is confirmed for each case at renewal.
export const REMINDER_TIPS = {
  "AVCB ou CLCB (Corpo de Bombeiros)":
    "A validade varia conforme o risco da edificação e está impressa no certificado. A renovação leva tempo, por isso vale começar com antecedência.",
  "PGR (gerenciamento de riscos)":
    "A NR-1 pede que a avaliação de riscos seja revista, no máximo, a cada 2 anos, e antes disso quando algo muda no trabalho.",
  "LTCAT / PPP":
    "Não tem prazo fixo de validade. O LTCAT é atualizado quando muda o ambiente, as máquinas ou as atividades.",
  "Laudo de insalubridade ou periculosidade":
    "Não tem prazo fixo. Vale revisar quando mudam o ambiente, os processos ou os equipamentos.",
  "Treinamento de NR (CIPA, NR-35, NR-10 etc.)":
    "NR-35 e NR-10 pedem reciclagem a cada 2 anos. O treinamento da CIPA é renovado a cada mandato. Confira a data no certificado.",
  "Alvará ou licença": "A validade e a renovação dependem da prefeitura. Informe a data que consta no documento.",
  "CAR, licença ambiental ou outorga": "O prazo depende do órgão que emitiu. Informe a data que consta no documento.",
};
