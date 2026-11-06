// Printable area summary (/imprimir/<area>).

import { useEffect, useState } from "react";
import { LEGAL_NAME, CNPJ, PHONE_DISPLAY, ADDRESS } from "../company";

// Dedicated page to print or save as PDF an area's document list (/imprimir/<area>).
// No site header or footer, no state: the button calls window.print() directly. noindex.
export function PrintPage({ area }) {
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }));
  }, []);
  return (
    <div className="print">
      <div className="print-bar no-print">
        <a className="btn btn-sec" href={`/${area.slug}#atendimento`}>
          <span aria-hidden="true">←</span> Voltar
        </a>
        <button type="button" className="btn btn-whatsapp" onClick={() => window.print()}>
          Imprimir / Salvar PDF
        </button>
        <p>Para salvar em PDF, escolha "Salvar como PDF" como impressora.</p>
      </div>
      <main className="sheet-doc" id="conteudo">
        <header className="sheet-top">
          <img src="/marca/marca-lockup.webp" width="120" height="66" alt="RD Engenharia" />
          <div>
            <p className="sheet-company">RD Engenharia Segurança e Meio Ambiente</p>
            <p className="sheet-date">{date || "\u00a0"}</p>
          </div>
        </header>
        <h1>Lista de documentos necessários</h1>
        <p className="sheet-area">Área: {area.name}</p>
        <ul className="sheet-list">
          {area.documents.map((d) => (
            <li key={d}>
              <span className="sheet-box" aria-hidden="true" />
              {d}
            </li>
          ))}
        </ul>
        <p className="sheet-note">Lista de orientação geral. Confirmamos com você o que cada caso realmente exige.</p>
        <footer className="sheet-footer">
          <p>{LEGAL_NAME} · CNPJ {CNPJ}</p>
          <p>
            {ADDRESS} · WhatsApp {PHONE_DISPLAY}
          </p>
        </footer>
      </main>
    </div>
  );
}
