// Search vocabulary, for the owner's review: the filler words the search ignores, and the synonyms that lead
// everyday words to the words the site itself uses, so a search such as "sítio" or "bombeiro" reaches the right
// area even when the visitor does not know the document's name. Accents and capitals do not matter anywhere.

// Filler words dropped from what the visitor types. A query made only of these returns no result, and the
// search box then offers the step-by-step wizard and WhatsApp.
export const SEARCH_STOP_WORDS = [
  // Owner's list
  "de", "do", "da", "dos", "das", "o", "a", "os", "as", "um", "uma", "meu", "minha", "meus", "minhas",
  "para", "pra", "com", "sem", "que", "e", "ou", "no", "na", "nos", "nas", "em", "por",
  "pediu", "pediram", "preciso", "precisa", "quero", "vou", "tenho", "estou", "sobre", "como", "qual",
  // Added for review (2026-11-09): other forms of the same fillers, and words that only repeat the search question
  "ao", "aos", "pelo", "pela", "pelos", "pelas", "num", "numa", "pro", "se", "eu", "me", "seu", "sua", "seus", "suas",
  "isso", "já", "não", "sei", "tem", "ter", "fazer", "saber", "pede", "pedem", "pedido", "precisam", "queria",
  "gostaria", "onde", "quando", "quais", "documento", "documentos", "serviço", "serviços",
];

// Synonyms: one line per everyday word; the comment above each group says where it leads.
// - Keys in the singular. A plural ending in "s" or "es" is looked up by its singular (bombeiros → bombeiro).
// - A synonym only adds results and scores less than the visitor's own word found in a title.
// - Every target below appears in the site's own text (src/content); checked on 2026-11-09 and by a test.
export const SEARCH_SYNONYMS = {
  // Imóvel rural → Meio Ambiente e Topografia (CAR, georreferenciamento)
  "sítio": ["imóvel rural", "cadastro ambiental rural", "georreferenciamento"],
  "chácara": ["imóvel rural", "cadastro ambiental rural", "georreferenciamento"],
  "fazenda": ["imóvel rural", "cadastro ambiental rural", "georreferenciamento"],
  "rural": ["imóvel rural", "cadastro ambiental rural", "georreferenciamento"],

  // Corpo de Bombeiros (AVCB e CLCB)
  "bombeiro": ["corpo de bombeiros"],
  "incêndio": ["corpo de bombeiros"],
  "extintor": ["corpo de bombeiros"],

  // Segurança do Trabalho
  // "esocial" was left out: the site never mentions eSocial. Add it here if RD handles it.
  "fiscalização": ["segurança do trabalho"],
  "fiscal": ["segurança do trabalho"],
  "funcionário": ["segurança do trabalho"],
  "empregado": ["segurança do trabalho"],

  // Engenharia Civil e Regularização
  "habite-se": ["engenharia civil"],
  "averbação": ["engenharia civil"],
  "reforma": ["engenharia civil"],
  "construção": ["engenharia civil"],
  "obra": ["engenharia civil"],

  // Selling or financing a property → regularização de obra (habite-se) and georreferenciamento (rural property)
  "vender": ["regularização de obra", "georreferenciamento"],
  "venda": ["regularização de obra", "georreferenciamento"],
  "escritura": ["regularização de obra", "georreferenciamento"],
  "cartório": ["regularização de obra", "georreferenciamento"],
  "banco": ["regularização de obra", "georreferenciamento"],
  "financiamento": ["regularização de obra", "georreferenciamento"],
};
