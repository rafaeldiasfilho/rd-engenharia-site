// "Como ler uma prancha": the parts of a drawing sheet, one at a time.

import { useState } from "react";

/* ── How to read a drawing sheet (next to the real projects, which are not redrawn) ─────────── */

const SHEET_PARTS = [
  ["Carimbo", "O quadro no canto inferior da folha: título do desenho, escala, data, número da folha e o responsável técnico."],
  ["Escala", "1:50 quer dizer que 1 cm no papel são 50 cm na obra. Por isso o desenho cabe na folha e continua na proporção certa."],
  ["Cotas", "Os números nas linhas de medida. Dão o tamanho de paredes, vãos e cômodos, em metros."],
  ["Planta, corte e fachada", "A planta é a casa vista de cima; o corte, como se ela fosse fatiada de lado; a fachada, vista de frente, de fora."],
];

export function HowToReadSheet() {
  const [active, setActive] = useState(-1);
  return (
    <div className="how-read">
      <p className="how-read-title">Como ler uma prancha</p>
      <ul className="caption" aria-label="Partes de uma prancha">
        {SHEET_PARTS.map(([name], i) => (
          <li key={name}>
            <button type="button" aria-pressed={active === i} onClick={() => setActive((a) => (a === i ? -1 : i))}>
              {name}
            </button>
          </li>
        ))}
      </ul>
      <p className="illustration-explain" aria-live="polite">
        {active >= 0 ? (
          <>
            <strong>{SHEET_PARTS[active][0]}.</strong> {SHEET_PARTS[active][1]}
          </>
        ) : (
          "Toque numa parte para ver o que ela mostra no desenho."
        )}
      </p>
    </div>
  );
}
