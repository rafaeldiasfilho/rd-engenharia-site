import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import AreaIcon from "./AreaIcon";
import { AREAS, findArea } from "./content/areas";
import { PROFILES } from "./content/wizard";
import { buildWizardWhatsappMessage, collectWizardResults } from "./wizardResult.js";
import { WhatsappButton } from "./layout/WhatsappButton";

// Step-by-step guide for the /o-que-preciso page: one question per screen, large choices, progress bar,
// back button and result screen. Uses the PROFILES/RESULTS rules (src/content/wizard.js).
// Nothing is stored: the answers live only in the page's memory and become the WhatsApp message.
export default function Wizard() {
  const [profileId, setProfileId] = useState("");
  const [answers, setAnswers] = useState({}); // situation index -> true | false
  const [step, setStep] = useState(0); // 0 = profile; 1..n = situations; n+1 = result
  const [city, setCity] = useState("");
  const titleRef = useRef(null);
  const mounted = useRef(false);

  const profile = PROFILES.find((p) => p.id === profileId);
  const n = profile ? profile.situations.length : 0;
  const total = 1 + n; // questions (the result does not count)
  const onResult = profile && step > n;
  const situation = profile && step >= 1 && step <= n ? profile.situations[step - 1] : null;

  // Focus the new screen's heading (keyboard and screen reader), but not on the page's first render.
  useEffect(() => {
    if (mounted.current && titleRef.current) titleRef.current.focus({ preventScroll: false });
    mounted.current = true;
  }, [step]);

  const results = collectWizardResults(profile, answers);

  const chooseProfile = (id) => {
    if (id !== profileId) setAnswers({});
    setProfileId(id);
    setStep(1);
  };
  const answer = (value) => {
    setAnswers((r) => ({ ...r, [step - 1]: value }));
    setStep((e) => e + 1);
  };
  const goBack = () => setStep((e) => Math.max(0, e - 1));
  const restart = () => {
    setProfileId("");
    setAnswers({});
    setCity("");
    setStep(0);
  };

  // Shortcuts: keys 1, 2 and 3 pick the matching option; Backspace/Esc are not used so they do not
  // get in the way of someone typing the city.
  const keyHandler = useRef(null);
  keyHandler.current = (e) => {
    const tag = e.target && e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.altKey || e.ctrlKey || e.metaKey) return;
    if (!onResult && step === 0 && ["1", "2", "3"].includes(e.key)) {
      const p = PROFILES[Number(e.key) - 1];
      if (p) chooseProfile(p.id);
    } else if (situation && (e.key === "1" || e.key === "2")) {
      answer(e.key === "1");
    }
  };
  useEffect(() => {
    const f = (e) => keyHandler.current(e);
    document.addEventListener("keydown", f);
    return () => document.removeEventListener("keydown", f);
  }, []);

  const whatsappMessage = buildWizardWhatsappMessage({ results, profileName: profile ? profile.name : "", city });

  const current = onResult ? total : step + 1;
  const pct = onResult ? 100 : Math.round((step / total) * 100);

  return (
    <div className="wizard">
      <div className="wizard-top">
        {step > 0 ? (
          <button type="button" className="wizard-back" onClick={goBack}>
            <span aria-hidden="true">←</span> Voltar
          </button>
        ) : (
          <span className="wizard-back-empty" />
        )}
        <p className="wizard-counter" aria-live="polite">
          {onResult ? "Resultado" : profile ? `Pergunta ${current} de ${total}` : "Pergunta 1"}
        </p>
        {step > 0 ? (
          <button type="button" className="wizard-restart" onClick={restart}>
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

      <div className="wizard-screen" key={`${profileId}-${step}`}>
        {step === 0 && (
          <>
            <h2 className="wizard-question" tabIndex={-1} ref={titleRef}>
              Qual é a sua situação?
            </h2>
            <p className="wizard-support">Escolha a que mais se parece com o seu caso.</p>
            <div className="wizard-options" role="group" aria-label="Qual é a sua situação?">
              {PROFILES.map((p, i) => (
                <button
                  type="button"
                  key={p.id}
                  className={`wizard-option ${profileId === p.id ? "active" : ""}`}
                  aria-pressed={profileId === p.id}
                  onClick={() => chooseProfile(p.id)}
                >
                  <Icon name={p.icon} />
                  <span>{p.name}</span>
                  <kbd aria-hidden="true">{i + 1}</kbd>
                </button>
              ))}
            </div>
          </>
        )}

        {situation && (
          <>
            <p className="wizard-label">Isso se aplica ao seu caso?</p>
            <h2 className="wizard-question" tabIndex={-1} ref={titleRef}>
              {situation.text}
            </h2>
            <div className="wizard-options wizard-yesno" role="group" aria-label={`${situation.text}. Isso se aplica ao seu caso?`}>
              <button
                type="button"
                className={`wizard-option ${answers[step - 1] === true ? "active" : ""}`}
                aria-pressed={answers[step - 1] === true}
                onClick={() => answer(true)}
              >
                <span>Sim, se aplica</span>
                <kbd aria-hidden="true">1</kbd>
              </button>
              <button
                type="button"
                className={`wizard-option ${answers[step - 1] === false ? "active" : ""}`}
                aria-pressed={answers[step - 1] === false}
                onClick={() => answer(false)}
              >
                <span>Não, ou não sei</span>
                <kbd aria-hidden="true">2</kbd>
              </button>
            </div>
          </>
        )}

        {onResult && (
          <>
            <h2 className="wizard-question" tabIndex={-1} ref={titleRef}>
              {results.length
                ? "Pelo que você respondeu, costumam ser exigidos:"
                : "Nenhum item específico apareceu para as suas respostas."}
            </h2>
            {results.length > 0 ? (
              <ul className="wizard-results">
                {results.map((r) => {
                  const area = findArea(r.area);
                  return (
                    <li key={r.id}>
                      <small className="wizard-area">
                        {area && <AreaIcon slug={area.slug} size={18} />} {area ? area.name : ""}
                      </small>
                      <h3>{r.name}</h3>
                      <p>{r.text}</p>
                      <a href={`/${r.area}`} aria-label={`${r.name}: ver na página da área`}>
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
                        <AreaIcon slug={a.slug} size={18} /> {a.name}
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
              <label htmlFor="wizard-city">Sua cidade (opcional, vai só na mensagem)</label>
              <input
                id="wizard-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex.: Ibirá"
                autoComplete="off"
              />
            </div>
            <div className="actions">
              <WhatsappButton
                className="btn-large"
                text={whatsappMessage}
                label={results.length ? "Enviar para a RD pelo WhatsApp" : "Contar o meu caso no WhatsApp"}
              />
              <button type="button" className="btn btn-sec btn-large" onClick={restart}>
                Recomeçar
              </button>
            </div>
          </>
        )}
      </div>
      {step < 2 && <p className="wizard-hint">Nada do que você responde é guardado. <span className="keyboard-only">Dica: as teclas 1, 2 e 3 escolhem as opções.</span></p>}
      <noscript>
        <p className="wizard-support">
          Este passo a passo precisa de JavaScript. Sem ele, veja as áreas:{" "}
          {AREAS.map((a) => (
            <a key={a.slug} href={`/${a.slug}`}>
              {a.name}{" "}
            </a>
          ))}
        </p>
      </noscript>
    </div>
  );
}
