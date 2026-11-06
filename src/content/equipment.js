// General reference list of equipment shown on the area pages (not RD's inventory).

// Equipment that is USUALLY used in services of this kind (general reference list).
// Never state that RD owns or uses any of it; no brands and no prices.
export const EQUIPMENT_NOTE = "Lista geral de referência, não é o inventário da RD.";

export const EQUIPMENT = {
  "seguranca-do-trabalho": {
    text:
      "Para saber se o ambiente de trabalho está dentro dos limites das normas, o profissional pode medir o que está no ar e no entorno do trabalhador, como ruído, calor, luz e poeira. Em serviços como PGR, LTCAT e laudos de insalubridade, podem ser usados aparelhos de medição específicos, conferidos antes e depois da medida. Os métodos seguem normas como a NR-15 e as Normas de Higiene Ocupacional (NHO) da Fundacentro.",
    items: [
      "Dosímetro de ruído e medidor de nível de som (decibelímetro)",
      "Medidor de calor (IBUTG, com termômetros de globo e de bulbo úmido)",
      "Luxímetro, para medir a iluminação do posto de trabalho",
      "Bomba de amostragem de ar com filtro, para coletar poeira e outros agentes",
      "Calibradores, para conferir os aparelhos de ruído e a vazão das bombas",
    ],
  },
  "corpo-de-bombeiros": {
    text:
      "O projeto de segurança contra incêndio define quais proteções o imóvel precisa ter, de acordo com as Instruções Técnicas do Corpo de Bombeiros do Estado de São Paulo. Na vistoria, os bombeiros podem conferir se esses sistemas estão instalados e funcionando. Por isso, o levantamento do imóvel e o projeto tratam de cada um deles.",
    items: [
      "Extintores de incêndio, de tipos adequados ao risco",
      "Hidrantes e mangotinhos (rede de água e mangueiras)",
      "Iluminação de emergência nas rotas de saída",
      "Sistema de detecção e alarme de incêndio (detectores, acionadores e central)",
      "Sinalização de emergência e, quando exigido, para-raios (SPDA) com laudo",
    ],
  },
  "engenharia-civil": {
    text:
      "Para regularizar uma obra, laudar um imóvel ou investigar trincas e infiltrações, o engenheiro pode começar medindo o que existe e observando sinais que não aparecem a olho nu. Em serviços como esses, podem ser usados instrumentos de medição e de ensaio, muitos deles sem necessidade de quebrar a construção. O resultado entra no relatório técnico com ART.",
    items: [
      "Trena e medidor de distância a laser, para o desenho \"como construído\"",
      "Nível e estação total, para medidas e alturas do terreno e da obra",
      "Fissurômetro e medidor de umidade, para acompanhar trincas e infiltrações",
      "Câmera termográfica, que ajuda a achar infiltração sem quebrar a parede",
      "Esclerômetro e aparelho de ultrassom, para avaliar a qualidade do concreto",
    ],
  },
  "meio-ambiente-topografia": {
    text:
      "Medir um terreno ou um imóvel rural com precisão exige aparelhos que usam satélites e instrumentos de campo, seguindo as normas do INCRA e da ABNT. No georreferenciamento, o Manual Técnico do INCRA descreve os métodos aceitos, como receptores GNSS, estação total e, em certos casos, drones. Na parte ambiental, a coleta de amostras segue guias técnicos nacionais.",
    items: [
      "Receptor GNSS (GPS de precisão), com correção em tempo real (RTK) ou por ponto preciso (PPP)",
      "Estação total, com prisma, balizas e trena",
      "Nível e mira, para medir diferenças de altura",
      "Aeronave remotamente pilotada (drone) com câmera, nos casos em que o método é permitido",
      "Frascos e amostradores para coleta de água e sedimento",
    ],
  },
};
