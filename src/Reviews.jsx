import { AVALIACOES, NOTA_GOOGLE, URL_AVALIACOES_GOOGLE } from "./pagesData";

// Faixa de avaliações do Google na página inicial. A nota e o total vêm de NOTA_GOOGLE; os cartões só
// aparecem para as avaliações listadas em AVALIACOES (textos reais, copiados do Google pelo Rafael).
// Sem lista, a faixa não aparece: a nota e o link para o Google já estão no topo e no contato.
const Estrelas = ({ n = 5 }) => (
  <span className="review-stars" role="img" aria-label={`${n} de 5 estrelas`}>
    {"★".repeat(n)}
    <span aria-hidden="true" className="review-stars-empty">
      {"★".repeat(5 - n)}
    </span>
  </span>
);

export default function Avaliacoes() {
  if (AVALIACOES.length === 0) return null;
  return (
    <section className="review" aria-labelledby="aval-t">
      <div className="container">
        <div className="review-top reveal">
          <div>
            <p className="eyebrow">Avaliações no Google</p>
            <h2 id="aval-t" className="sec-title">
              O que dizem os clientes.
            </h2>
          </div>
          <a className="review-note" href={URL_AVALIACOES_GOOGLE} target="_blank" rel="noopener noreferrer">
            <Estrelas n={5} />
            <span>{NOTA_GOOGLE}</span>
            <small>Ver todas no Google →</small>
          </a>
        </div>
        <ul className="review-list">
          {AVALIACOES.map((a) => (
            <li key={`${a.nome}-${a.texto.slice(0, 20)}`} className="review-card reveal">
              <Estrelas n={a.estrelas || 5} />
              <blockquote>
                <p>“{a.texto}”</p>
              </blockquote>
              <p className="review-author">{a.nome}, no Google</p>
            </li>
          ))}
        </ul>
        <p className="fine-print review-note-fine">Textos como os clientes escreveram no Google, sem edição.</p>
      </div>
    </section>
  );
}
