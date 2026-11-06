import { useEffect, useRef, useState } from "react";
import Icone from "./Icone";
import IconeArea from "./Icones";
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
    <div className="wizard">
      <div className="wizard-top">
        {etapa > 0 ? (
          <button type="button" className="wizard-back" onClick={voltar}>
            <span aria-hidden="true">←</span> Voltar
          </button>
        ) : (
          <span className="wizard-back-empty" />
        )}
        <p className="wizard-counter" aria-live="polite">
          {noResultado ? "Resultado" : perfil ? `Pergunta ${atual} de ${total}` : "Pergunta 1"}
        </p>
        {etapa > 0 ? (
          <button type="button" className="wizard-restart" onClick={recomecar}>
            <svg className="wizard-restart-arrow" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
              <path d="M13.2 8a5.2 5.2 0 1 1-1.6-3.75" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M12.2 1.8v2.9H9.3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Recomeçar
          </button>
        ) : (
          <span className="wizard-back-empty" />
        )}
      </div>
      <div
        className="wizard-bar"
        role="progressbar"
        aria-label="Progresso do guia"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <i style={{ transform: `scaleX(${pct / 100})` }} />
      </div>

      <div className="wizard-screen" key={`${perfilId}-${etapa}`}>
        {etapa === 0 && (
          <>
            <h2 className="wizard-question" tabIndex={-1} ref={titulo}>
              Qual é a sua situação?
            </h2>
            <p className="wizard-support">Escolha a que mais se parece com o seu caso.</p>
            <div className="wizard-options" role="group" aria-label="Qual é a sua situação?">
              {PERFIS.map((p, i) => (
                <button
                  type="button"
                  key={p.id}
                  className={`wizard-option ${perfilId === p.id ? "active" : ""}`}
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
            <p className="wizard-label">Isso se aplica ao seu caso?</p>
            <h2 className="wizard-question" tabIndex={-1} ref={titulo}>
              {situacao.texto}
            </h2>
            <div className="wizard-options wizard-yesno" role="group" aria-label={`${situacao.texto}. Isso se aplica ao seu caso?`}>
              <button
                type="button"
                className={`wizard-option ${respostas[etapa - 1] === true ? "active" : ""}`}
                aria-pressed={respostas[etapa - 1] === true}
                onClick={() => responder(true)}
              >
                <span>Sim, se aplica</span>
                <kbd aria-hidden="true">1</kbd>
              </button>
              <button
                type="button"
                className={`wizard-option ${respostas[etapa - 1] === false ? "active" : ""}`}
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
            <h2 className="wizard-question" tabIndex={-1} ref={titulo}>
              {resultados.length
                ? "Pelo que você respondeu, costumam ser exigidos:"
                : "Nenhum item específico apareceu para as suas respostas."}
            </h2>
            {resultados.length > 0 ? (
              <ul className="wizard-results">
                {resultados.map((r) => {
                  const area = achaArea(r.area);
                  return (
                    <li key={r.id}>
                      <small className="wizard-area">
                        {area && <IconeArea slug={area.slug} tamanho={18} />} {area ? area.nome : ""}
                      </small>
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
                <p className="wizard-support">
                  Isso não significa que nada seja exigido: cada caso tem particularidades. Conte a sua situação pelo
                  WhatsApp, ou veja as áreas de atuação.
                </p>
                <ul className="wizard-areas">
                  {AREAS.map((a) => (
                    <li key={a.slug}>
                      <a href={`/${a.slug}`}>
                        <IconeArea slug={a.slug} tamanho={18} /> {a.nome}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="notice-guide">
              Este resultado é uma orientação inicial e não substitui a análise técnica. Confirmamos o que é realmente
              exigido no seu caso.
            </p>
            <div className="quiz-city">
              <label htmlFor="cidade-quiz">Sua cidade (opcional, vai só na mensagem)</label>
              <input
                id="cidade-quiz"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex.: Ibirá"
                autoComplete="off"
              />
            </div>
            <div className="actions">
              <BotaoZap
                className="btn-large"
                texto={resultados.length ? mensagem : mensagemSemItens}
                rotulo={resultados.length ? "Enviar para a RD pelo WhatsApp" : "Contar o meu caso no WhatsApp"}
              />
              <button type="button" className="btn btn-sec btn-large" onClick={recomecar}>
                Recomeçar
              </button>
            </div>
          </>
        )}
      </div>
      {etapa < 2 && <p className="wizard-hint">Nada do que você responde é guardado. <span className="keyboard-only">Dica: as teclas 1, 2 e 3 escolhem as opções.</span></p>}
      <noscript>
        <p className="wizard-support">
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
