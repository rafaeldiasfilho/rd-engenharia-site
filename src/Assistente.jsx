import { useEffect, useRef, useState } from "react";
import Icone from "./Icone";
import { AREAS, PERFIS, RESULTADOS, achaArea } from "./paginas";
import { BotaoZap } from "./Layout";

// Passo a passo da página /o-que-preciso: uma pergunta por tela, escolhas grandes, barra de progresso,
// botão de voltar e tela de resultado. Usa as mesmas regras de PERFIS/RESULTADOS (src/paginas.js).
// Nada é guardado: as respostas ficam só na memória da página e viram a mensagem de WhatsApp.
export default function Assistente() {
  const [perfilId, setPerfilId] = useState("");
  const [respostas, setRespostas] = useState({}); // índice da situação -> true | false
  const [etapa, setEtapa] = useState(0); // 0 = perfil; 1..n = situações; n+1 = resultado
  const [cidade, setCidade] = useState("");
  const titulo = useRef(null);
  const montado = useRef(false);

  const perfil = PERFIS.find((p) => p.id === perfilId);
  const n = perfil ? perfil.situacoes.length : 0;
  const total = 1 + n; // perguntas (o resultado não conta)
  const noResultado = perfil && etapa > n;
  const situacao = perfil && etapa >= 1 && etapa <= n ? perfil.situacoes[etapa - 1] : null;

  // Foco no título da nova tela (teclado e leitor de tela), mas não na primeira exibição da página.
  useEffect(() => {
    if (montado.current && titulo.current) titulo.current.focus({ preventScroll: false });
    montado.current = true;
  }, [etapa]);

  const ids = [];
  if (perfil) {
    perfil.situacoes.forEach((s, i) => {
      if (respostas[i]) s.itens.forEach((id) => !ids.includes(id) && ids.push(id));
    });
  }
  const resultados = ids.map((id) => ({ id, ...RESULTADOS[id] }));

  const escolherPerfil = (id) => {
    if (id !== perfilId) setRespostas({});
    setPerfilId(id);
    setEtapa(1);
  };
  const responder = (valor) => {
    setRespostas((r) => ({ ...r, [etapa - 1]: valor }));
    setEtapa((e) => e + 1);
  };
  const voltar = () => setEtapa((e) => Math.max(0, e - 1));
  const recomecar = () => {
    setPerfilId("");
    setRespostas({});
    setCidade("");
    setEtapa(0);
  };

  // Atalhos: teclas 1, 2 e 3 escolhem a opção correspondente; Backspace/Esc não são usados para não
  // atrapalhar quem digita a cidade.
  const aoTeclar = useRef(null);
  aoTeclar.current = (e) => {
    const alvo = e.target && e.target.tagName;
    if (alvo === "INPUT" || alvo === "TEXTAREA" || alvo === "SELECT" || e.altKey || e.ctrlKey || e.metaKey) return;
    if (!noResultado && etapa === 0 && ["1", "2", "3"].includes(e.key)) {
      const p = PERFIS[Number(e.key) - 1];
      if (p) escolherPerfil(p.id);
    } else if (situacao && (e.key === "1" || e.key === "2")) {
      responder(e.key === "1");
    }
  };
  useEffect(() => {
    const f = (e) => aoTeclar.current(e);
    document.addEventListener("keydown", f);
    return () => document.removeEventListener("keydown", f);
  }, []);

  const nomePerfil = perfil ? perfil.nome : "";
  const mensagem = [
    "Olá! Fiz o guia do site e acho que preciso de:",
    ...resultados.map((r) => `- ${r.nome}`),
    nomePerfil ? `Meu caso: ${nomePerfil.charAt(0).toLowerCase() + nomePerfil.slice(1)}` : "",
    cidade.trim() ? `Cidade: ${cidade.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const mensagemSemItens = [
    "Olá! Fiz o guia do site e nenhuma opção bateu com o meu caso. Gostaria de conversar.",
    nomePerfil ? `Meu caso: ${nomePerfil.charAt(0).toLowerCase() + nomePerfil.slice(1)}` : "",
    cidade.trim() ? `Cidade: ${cidade.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const atual = noResultado ? total : etapa + 1;
  const pct = noResultado ? 100 : Math.round((etapa / total) * 100);

  return (
    <div className="assistente">
      <div className="ass-topo">
        {etapa > 0 ? (
          <button type="button" className="ass-voltar" onClick={voltar}>
            <span aria-hidden="true">←</span> Voltar
          </button>
        ) : (
          <span className="ass-voltar-vazio" />
        )}
        <p className="ass-contador" aria-live="polite">
          {noResultado ? "Resultado" : perfil ? `Pergunta ${atual} de ${total}` : "Pergunta 1"}
        </p>
        {etapa > 0 ? (
          <button type="button" className="ass-recomecar" onClick={recomecar}>
            Recomeçar
          </button>
        ) : (
          <span className="ass-voltar-vazio" />
        )}
      </div>
      <div
        className="ass-barra"
        role="progressbar"
        aria-label="Progresso do guia"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <i style={{ transform: `scaleX(${pct / 100})` }} />
      </div>

      <div className="ass-tela" key={`${perfilId}-${etapa}`}>
        {etapa === 0 && (
          <>
            <h2 className="ass-pergunta" tabIndex={-1} ref={titulo}>
              Qual é a sua situação?
            </h2>
            <p className="ass-apoio">Escolha a que mais se parece com o seu caso.</p>
            <div className="ass-opcoes" role="group" aria-label="Qual é a sua situação?">
              {PERFIS.map((p, i) => (
                <button
                  type="button"
                  key={p.id}
                  className={`ass-opcao ${perfilId === p.id ? "ativo" : ""}`}
                  aria-pressed={perfilId === p.id}
                  onClick={() => escolherPerfil(p.id)}
                >
                  <Icone nome={p.icone} />
                  <span>{p.nome}</span>
                  <kbd aria-hidden="true">{i + 1}</kbd>
                </button>
              ))}
            </div>
          </>
        )}

        {situacao && (
          <>
            <p className="ass-rotulo">Isso se aplica ao seu caso?</p>
            <h2 className="ass-pergunta" tabIndex={-1} ref={titulo}>
              {situacao.texto}
            </h2>
            <div className="ass-opcoes ass-sn" role="group" aria-label={`${situacao.texto}. Isso se aplica ao seu caso?`}>
              <button
                type="button"
                className={`ass-opcao ${respostas[etapa - 1] === true ? "ativo" : ""}`}
                aria-pressed={respostas[etapa - 1] === true}
                onClick={() => responder(true)}
              >
                <span>Sim, se aplica</span>
                <kbd aria-hidden="true">1</kbd>
              </button>
              <button
                type="button"
                className={`ass-opcao ${respostas[etapa - 1] === false ? "ativo" : ""}`}
                aria-pressed={respostas[etapa - 1] === false}
                onClick={() => responder(false)}
              >
                <span>Não, ou não sei</span>
                <kbd aria-hidden="true">2</kbd>
              </button>
            </div>
          </>
        )}

        {noResultado && (
          <>
            <h2 className="ass-pergunta" tabIndex={-1} ref={titulo}>
              {resultados.length
                ? "Pelo que você respondeu, costumam ser exigidos:"
                : "Nenhum item específico apareceu para as suas respostas."}
            </h2>
            {resultados.length > 0 ? (
              <ul className="ass-resultados">
                {resultados.map((r) => {
                  const area = achaArea(r.area);
                  return (
                    <li key={r.id}>
                      <small>{area ? area.nome : ""}</small>
                      <h3>{r.nome}</h3>
                      <p>{r.texto}</p>
                      <a href={`/${r.area}`} aria-label={`${r.nome}: ver na página da área`}>
                        Ver na página da área <span aria-hidden="true">→</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <>
                <p className="ass-apoio">
                  Isso não significa que nada seja exigido: cada caso tem particularidades. Conte a sua situação pelo
                  WhatsApp, ou veja as áreas de atuação.
                </p>
                <ul className="ass-areas">
                  {AREAS.map((a) => (
                    <li key={a.slug}>
                      <a href={`/${a.slug}`}>{a.nome}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="aviso-guia">
              Este resultado é uma orientação inicial e não substitui a análise técnica. Confirmamos o que é realmente
              exigido no seu caso.
            </p>
            <div className="quiz-cidade">
              <label htmlFor="cidade-quiz">Sua cidade (opcional, vai só na mensagem)</label>
              <input
                id="cidade-quiz"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex.: Ibirá"
                autoComplete="off"
              />
            </div>
            <div className="acoes">
              <BotaoZap
                className="btn-grande"
                texto={resultados.length ? mensagem : mensagemSemItens}
                rotulo={resultados.length ? "Enviar para a RD pelo WhatsApp" : "Contar o meu caso no WhatsApp"}
              />
              <button type="button" className="btn btn-sec btn-grande" onClick={recomecar}>
                Recomeçar
              </button>
            </div>
          </>
        )}
      </div>
      {etapa < 2 && <p className="ass-dica">Nada do que você responde é guardado. <span className="so-teclado">Dica: as teclas 1, 2 e 3 escolhem as opções.</span></p>}
      <noscript>
        <p className="ass-apoio">
          Este passo a passo precisa de JavaScript. Sem ele, veja as áreas:{" "}
          {AREAS.map((a) => (
            <a key={a.slug} href={`/${a.slug}`}>
              {a.nome}{" "}
            </a>
          ))}
        </p>
      </noscript>
    </div>
  );
}
