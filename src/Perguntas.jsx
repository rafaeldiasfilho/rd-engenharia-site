import { useState } from "react";
import { normaliza } from "./Busca";
import { zap } from "./contato";

// Lista de perguntas frequentes. Com 6 perguntas ou mais, ganha um campo para filtrar (pergunta e
// resposta, sem acentos). Sem JavaScript, o campo não atrapalha: todas as perguntas aparecem.
export default function Perguntas({ itens, minimoFiltro = 6 }) {
  const [q, setQ] = useState("");
  const termos = normaliza(q).split(/\s+/).filter((t) => t.length >= 2);
  const visiveis = termos.length ? itens.filter((f) => termos.every((t) => normaliza(`${f.q} ${f.a}`).includes(t))) : itens;
  const comFiltro = itens.length >= minimoFiltro;

  return (
    <div className="faq-lista rev">
      {comFiltro && (
        <div className="faq-filtro">
          <label>
            <span>Filtrar perguntas</span>
            <input type="search" placeholder="Ex.: ART, CAR, orçamento" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <p aria-live="polite">
            {termos.length ? `${visiveis.length} de ${itens.length} perguntas` : ""}
          </p>
        </div>
      )}
      {visiveis.map((f) => (
        <details className="faq-item" key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
          {f.guia && (
            <p className="faq-guia">
              <a href={`/${f.guia}`}>
                Ler o guia completo <span aria-hidden="true">→</span>
              </a>
            </p>
          )}
        </details>
      ))}
      {comFiltro && termos.length > 0 && visiveis.length === 0 && (
        <p className="faq-vazio">
          Nenhuma pergunta com “{q.trim()}”.{" "}
          <a href={zap(`Olá! Tenho uma dúvida sobre: ${q.trim()}`)} target="_blank" rel="noopener noreferrer">
            Pergunte direto no WhatsApp
          </a>
          .
        </p>
      )}
    </div>
  );
}
