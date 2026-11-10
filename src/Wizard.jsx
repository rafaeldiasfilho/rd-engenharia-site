import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import AreaIcon from "./AreaIcon";
import { AREAS, findArea } from "./content/areas";
import { PROFILES, WIZARD_UNKNOWN_DOCUMENT_MESSAGE } from "./content/wizard";
import { whatsappLink } from "./contact";
import { setCurrentWhatsappMessage } from "./currentWhatsappMessage.js";
import {
  WIZARD_CITY_MAX_LENGTH,
  WIZARD_NOTE_MAX_LENGTH,
  buildWizardHistoryState,
  buildWizardResultHref,
  buildWizardResultSummary,
  clampWizardStep,
  clearWizardProgress,
  describeWizardUnanswered,
  loadWizardProgress,
  readWizardHistoryTag,
  restoreWizardProgress,
  saveWizardProgress,
  shouldOfferWizardEarlyResult,
} from "./wizardResult.js";
import { WhatsappButton } from "./layout/WhatsappButton";

// Step-by-step guide for the /o-que-preciso page: one question per screen, large choices, progress bar,
// back button and result screen. Uses the PROFILES/RESULTS rules (src/content/wizard.js).
// Each screen is an entry of the browser history, so the phone's Back button goes to the previous question.
// The answers stay only in this browser tab (sessionStorage "rd_wizard_answers", until "Recomeçar" or the
// tab is closed) and leave the page only in the WhatsApp message the visitor sends.

// sessionStorage does not exist during the prerender and may be blocked by the browser: then nothing is kept.
function getWizardSessionStorage() {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

const RESULT_WHATSAPP_LABEL = "Enviar meu resultado";
const RESULT_NOTICE =
  "Este resultado é uma orientação inicial e não substitui a análise técnica. Confirmamos o que é realmente exigido no seu caso.";

export default function Wizard() {
  const [profileId, setProfileId] = useState("");
  const [answers, setAnswers] = useState({}); // situation index -> true | false; unanswered: missing
  const [step, setStep] = useState(0); // 0 = profile; 1..n = situations; n+1 = result
  const [city, setCity] = useState("");
  const [note, setNote] = useState(""); // "O que aconteceu?" of the all-"no" result
  const [progressRestored, setProgressRestored] = useState(false);
  const titleRef = useRef(null);
  const focusTitleOnNextScreen = useRef(false); // set by the visitor's moves, never by the restore on load
  const historyDepth = useRef(0); // wizard history entries below the current one, on this page

  const profile = PROFILES.find((p) => p.id === profileId);
  const n = profile ? profile.situations.length : 0;
  const total = 1 + n; // questions (the result does not count)
  const onResult = Boolean(profile) && step > n;
  const situation = profile && step >= 1 && step <= n ? profile.situations[step - 1] : null;
  const { results, whatsappText, unansweredCount } = buildWizardResultSummary(profile, answers, { city, note });

  // On load (after hydration, so the first render matches the prerendered HTML): tag this history entry
  // and bring back the progress saved in this tab.
  useEffect(() => {
    const tag = readWizardHistoryTag(window.history.state);
    const restored = restoreWizardProgress(loadWizardProgress(getWizardSessionStorage()), tag);
    historyDepth.current = tag ? tag.depth : 0;
    window.history.replaceState(buildWizardHistoryState(window.history.state, restored.step, historyDepth.current), "");
    if (restored.profileId) {
      setProfileId(restored.profileId);
      setAnswers(restored.answers);
      setStep(restored.step);
    }
    setProgressRestored(true);
  }, []);

  useEffect(() => {
    if (progressRestored) saveWizardProgress(getWizardSessionStorage(), { profileId, answers, step });
  }, [progressRestored, profileId, answers, step]);

  // Browser Back/Forward between the wizard's own entries; other entries (an anchor link) are ignored.
  const popStateHandler = useRef(null);
  popStateHandler.current = (event) => {
    const tag = readWizardHistoryTag(event.state);
    if (!tag) return;
    const nextStep = clampWizardStep(tag.step, profile);
    historyDepth.current = tag.depth;
    if (nextStep !== tag.step) window.history.replaceState(buildWizardHistoryState(event.state, nextStep, tag.depth), "");
    focusTitleOnNextScreen.current = true;
    setStep(nextStep);
  };
  useEffect(() => {
    const listener = (event) => popStateHandler.current(event);
    window.addEventListener("popstate", listener);
    return () => window.removeEventListener("popstate", listener);
  }, []);

  // Focus the new screen's heading (keyboard and screen reader) after a move, but not on load.
  useEffect(() => {
    if (!focusTitleOnNextScreen.current || !titleRef.current) return;
    focusTitleOnNextScreen.current = false;
    titleRef.current.focus({ preventScroll: false });
  }, [step, profileId]);

  // While the result is on screen, the floating WhatsApp button and the page's closing button send it.
  useEffect(() => {
    if (!onResult) return undefined;
    setCurrentWhatsappMessage({ text: whatsappText, label: RESULT_WHATSAPP_LABEL });
    return () => setCurrentWhatsappMessage(null);
  }, [onResult, whatsappText]);

  // Every move forward adds one history entry, so the browser's Back returns to the previous screen.
  const openStep = (nextStep) => {
    historyDepth.current += 1;
    window.history.pushState(buildWizardHistoryState(null, nextStep, historyDepth.current), "");
    focusTitleOnNextScreen.current = true;
    setStep(nextStep);
  };
  const chooseProfile = (id) => {
    if (id !== profileId) setAnswers({});
    setProfileId(id);
    openStep(1);
  };
  const answer = (value) => {
    setAnswers((current) => ({ ...current, [step - 1]: value }));
    openStep(step + 1);
  };
  const showResultNow = () => openStep(n + 1);
  // Same as the browser's Back while there is a wizard entry below; after a restore on a new visit there is
  // none, so it only shows the previous question.
  const goBack = () => {
    if (historyDepth.current > 0) {
      historyDepth.current -= 1; // a second quick click must not leave the page
      window.history.back();
      return;
    }
    const previousStep = Math.max(0, step - 1);
    window.history.replaceState(buildWizardHistoryState(window.history.state, previousStep, 0), "");
    focusTitleOnNextScreen.current = true;
    setStep(previousStep);
  };
  const restart = () => {
    clearWizardProgress(getWizardSessionStorage());
    setCurrentWhatsappMessage(null);
    setProfileId("");
    setAnswers({});
    setCity("");
    setNote("");
    focusTitleOnNextScreen.current = true;
    setStep(0);
    // Back to the page's first wizard entry, so the browser's Back then leaves the wizard as after a fresh start.
    const depth = historyDepth.current;
    historyDepth.current = 0;
    if (depth > 0) window.history.go(-depth);
    else window.history.replaceState(buildWizardHistoryState(window.history.state, 0, 0), "");
  };

  // Shortcuts: keys 1, 2 and 3 pick the matching option; Backspace/Esc are not used so they do not
  // get in the way of someone typing the city. A held key (repeat) does not answer every question.
  const keyHandler = useRef(null);
  keyHandler.current = (e) => {
    const targetTag = e.target && e.target.tagName;
    if (targetTag === "INPUT" || targetTag === "TEXTAREA" || targetTag === "SELECT" || e.altKey || e.ctrlKey || e.metaKey || e.repeat) return;
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

  const current = onResult ? total : step + 1;
  const pct = onResult ? 100 : Math.round((step / total) * 100);
  const offerEarlyResult = shouldOfferWizardEarlyResult(profile, answers, step);

  const cityField = (
    <div className="quiz-city">
      <label htmlFor="wizard-city">Sua cidade (opcional, vai só na mensagem)</label>
      <input
        id="wizard-city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Ex.: Ibirá"
        autoComplete="off"
        maxLength={WIZARD_CITY_MAX_LENGTH}
      />
    </div>
  );
  const restartButton = (
    <button type="button" className="btn btn-sec btn-large" onClick={restart}>
      Recomeçar
    </button>
  );

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
            <div className="actions">
              <a
                className="btn btn-sec"
                href={whatsappLink(WIZARD_UNKNOWN_DOCUMENT_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                aria-describedby="wizard-unknown-document-note"
              >
                <Icon name="fa-brands fa-whatsapp" /> Alguém me pediu um documento e não sei qual é
              </a>
              <small id="wizard-unknown-document-note">Abre o WhatsApp para você mandar a foto do pedido.</small>
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
            {offerEarlyResult && (
              <div className="actions">
                <button type="button" className="btn btn-sec" onClick={showResultNow} aria-describedby="wizard-early-result-note">
                  Ver o resultado agora
                </button>
                <small id="wizard-early-result-note">As perguntas que faltam contam como “não”.</small>
              </div>
            )}
          </>
        )}

        {onResult && results.length > 0 && (
          <>
            <h2 className="wizard-question" tabIndex={-1} ref={titleRef}>
              Pelo que você respondeu, estes itens costumam ser exigidos.
            </h2>
            <div className="actions">
              <WhatsappButton className="btn-large" text={whatsappText} label="Enviar meu resultado pelo WhatsApp" />
            </div>
            {unansweredCount > 0 && <p className="wizard-support">{describeWizardUnanswered(unansweredCount)}</p>}
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
                    <a href={buildWizardResultHref(r)} aria-label={`${r.name}: ver na página da área`}>
                      Ver na página da área <span aria-hidden="true">→</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className="notice-guide">{RESULT_NOTICE}</p>
            {cityField}
            <div className="actions">
              <WhatsappButton className="btn-large" text={whatsappText} label="Enviar meu resultado pelo WhatsApp" />
              {restartButton}
            </div>
          </>
        )}

        {onResult && results.length === 0 && (
          <>
            <h2 className="wizard-question" tabIndex={-1} ref={titleRef}>
              Seu caso precisa de uma conversa rápida.
            </h2>
            <p className="wizard-support">
              Nenhuma das situações bateu com as suas respostas. Isso não significa que nada seja exigido: cada caso tem
              particularidades. Conte o que aconteceu pelo WhatsApp.
            </p>
            <div className="quiz-city">
              <label htmlFor="wizard-note">O que aconteceu? (opcional)</label>
              <input
                id="wizard-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex.: recebi uma notificação da prefeitura"
                autoComplete="off"
                maxLength={WIZARD_NOTE_MAX_LENGTH}
              />
            </div>
            {cityField}
            <div className="actions">
              <WhatsappButton className="btn-large" text={whatsappText} label="Contar o meu caso no WhatsApp" />
            </div>
            <p className="wizard-support">Se preferir, veja as áreas de atuação:</p>
            <ul className="wizard-areas">
              {AREAS.map((a) => (
                <li key={a.slug}>
                  <a href={`/${a.slug}`}>
                    <AreaIcon slug={a.slug} size={18} /> {a.name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="notice-guide">{RESULT_NOTICE}</p>
            <div className="actions">{restartButton}</div>
          </>
        )}
      </div>
      {step < 2 && (
        <p className="wizard-hint">
          As respostas ficam só nesta aba do navegador. Nada vai para a RD até você enviar a mensagem.{" "}
          <span className="keyboard-only">Dica: as teclas 1, 2 e 3 escolhem as opções.</span>
        </p>
      )}
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
