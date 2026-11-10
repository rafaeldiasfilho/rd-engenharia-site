// Expiry reminder form (/lembrete-de-vencimento). Shows every field error next to its field, saves the request
// with sendReminder and offers WhatsApp when the document already expired, when sending fails and after success.
// The rules and the WhatsApp texts live in reminderForm.js; this file only draws the screen and moves the focus.

import { useEffect, useState } from "react";
import { AREAS } from "../content/areas";
import { REMINDER_DOCUMENTS } from "../content/reminder";
import { PageClosing } from "../layout/PageClosing";
import { WhatsappButton } from "../layout/WhatsappButton";
import { sendReminder } from "../publicApi/api";
import { GENERAL_LINKS, PageTop, areaLink } from "./pageParts.jsx";
import {
  INITIAL_REMINDER_FORM, REMINDER_ALREADY_RECEIVED_MESSAGE, REMINDER_FORM_ERROR_MESSAGES, REMINDER_SEND_FAILED_MESSAGE,
  buildExpiredDocumentWhatsappMessage, buildReminderConfirmWhatsappMessage, buildReminderRequest, buildReminderSendFailedWhatsappMessage,
  buildReminderSuccessText, buildReminderYearOptions, classifyReminderSendError, collectReminderFieldErrors,
  readReminderDocumentKeyFromSearch, startAnotherReminderForm,
} from "./reminderForm.js";

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// Element that gets the focus when its field is the first one with an error.
const REMINDER_FIELD_FOCUS_IDS = {
  name: "reminder-name",
  whatsapp: "reminder-whatsapp",
  document: `reminder-document-${REMINDER_DOCUMENTS[0].key}`,
  expiry: "reminder-expiry-month",
  consent: "reminder-consent",
};

const reminderErrorId = (field) => `reminder-${field}-error`;

// aria-invalid and aria-describedby of a field with an error; nothing when the field is fine.
const invalidFieldAttributes = (field, errorCode) =>
  errorCode ? { "aria-invalid": "true", "aria-describedby": reminderErrorId(field) } : {};

// Moves the focus to the element with this id after the next render, once its error texts and aria attributes exist.
function useFocusAfterRender() {
  const [focusRequest, setFocusRequest] = useState(null);
  useEffect(() => {
    if (focusRequest) document.getElementById(focusRequest.id)?.focus();
  }, [focusRequest]);
  return (id) => setFocusRequest({ id });
}

// Error text right under its field; the field points to it with aria-describedby.
function ReminderFieldError({ field, errorCode }) {
  if (!errorCode) return null;
  return (
    <span id={reminderErrorId(field)} className="error-form reminder-field-error">
      {REMINDER_FORM_ERROR_MESSAGES[errorCode]}
    </span>
  );
}

// Text field with its error inside the label (6 px under the input). aria-labelledby keeps the
// error text out of the field's name; the error is read as its description instead.
function ReminderTextField({ field, label, errorCode, ...inputAttributes }) {
  return (
    <label>
      <span id={`reminder-${field}-label`}>{label}</span>
      <input id={`reminder-${field}`} aria-labelledby={`reminder-${field}-label`} {...inputAttributes} {...invalidFieldAttributes(field, errorCode)} />
      <ReminderFieldError field={field} errorCode={errorCode} />
    </label>
  );
}

function ReminderDocumentOptions({ documentKey, errorCode, onChange }) {
  return (
    <fieldset className="doc-options">
      <legend>Qual documento?</legend>
      {REMINDER_DOCUMENTS.map((reminderDocument) => (
        <label key={reminderDocument.key} className="doc-option">
          <input type="radio" name="document" id={`reminder-document-${reminderDocument.key}`} value={reminderDocument.key}
            checked={documentKey === reminderDocument.key} onChange={onChange} {...invalidFieldAttributes("document", errorCode)} />
          <span className="doc-option-name">{reminderDocument.label}</span>
          {documentKey === reminderDocument.key && reminderDocument.tip && <small className="hint-doc">{reminderDocument.tip}</small>}
        </label>
      ))}
      <ReminderFieldError field="document" errorCode={errorCode} />
    </fieldset>
  );
}

// Month and year lists. A month that has passed blocks the request and offers WhatsApp to regularize.
function ReminderExpiryFields({ form, years, errorCode, onChange }) {
  const invalidAttributes = invalidFieldAttributes("expiry", errorCode);
  return (
    <>
      <fieldset className="field-month">
        <legend>Mês do vencimento (se souber)</legend>
        <div>
          <select id="reminder-expiry-month" aria-label="Mês" value={form.monthNum} onChange={onChange("monthNum")} {...invalidAttributes}>
            <option value="">Mês</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={String(i + 1).padStart(2, "0")}>{m}</option>
            ))}
          </select>
          <select id="reminder-expiry-year" aria-label="Ano" value={form.year} onChange={onChange("year")} {...invalidAttributes}>
            <option value="">Ano</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </fieldset>
      {errorCode && (
        <div className="reminder-expired" data-origin="lembrete-vencido">
          <ReminderFieldError field="expiry" errorCode={errorCode} />
          <div className="actions">
            <WhatsappButton text={buildExpiredDocumentWhatsappMessage(form)} label="Falar pelo WhatsApp" />
          </div>
        </div>
      )}
    </>
  );
}

// Supabase refused the row or there is no network: the form stays filled and WhatsApp carries what was typed.
function ReminderSendFailedNotice({ form }) {
  return (
    <div id="reminder-send-failed" className="reminder-send-failed" tabIndex={-1} data-origin="lembrete-erro-envio">
      <p className="error-form">{REMINDER_SEND_FAILED_MESSAGE}</p>
      <div className="actions">
        <WhatsappButton text={buildReminderSendFailedWhatsappMessage(form)} label="Enviar pelo WhatsApp" />
      </div>
    </div>
  );
}

// "Pedido recebido" (request received), also for a request the database already had (HTTP 409).
// The focus goes to the heading when it appears.
function ReminderSuccessPanel({ reminder, alreadyReceived, onAnotherDocument }) {
  return (
    <div className="notice-ok reminder-success" data-origin="lembrete-confirmar">
      <h2 id="reminder-success-title" tabIndex={-1}>
        Pedido recebido
      </h2>
      <p>{alreadyReceived ? REMINDER_ALREADY_RECEIVED_MESSAGE : buildReminderSuccessText(reminder)}</p>
      <WhatsappButton text={buildReminderConfirmWhatsappMessage(reminder)} label="Confirmar pelo WhatsApp" />
      <button className="btn btn-sec" type="button" onClick={onAnotherDocument}>
        Avisar sobre outro documento
      </button>
      <a className="link-arrow" href="/">
        Voltar ao início
      </a>
    </div>
  );
}

export function ReminderPage({ page }) {
  const [form, setForm] = useState(INITIAL_REMINDER_FORM);
  const [status, setStatus] = useState("idle"); // "idle" | "sending" | "sent" | "already-received" | "send-failed"
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [sentReminder, setSentReminder] = useState(null);
  const [years, setYears] = useState([]);
  const focusAfterRender = useFocusAfterRender();

  // Read in the browser after hydration: the prerendered HTML has no years (it would freeze the build year)
  // and keeps the default document; a link such as ?documento=pgr then chooses its document.
  useEffect(() => {
    setYears(buildReminderYearOptions(new Date()));
    const documentKey = readReminderDocumentKeyFromSearch(window.location.search);
    setForm((prev) => ({ ...prev, documentKey }));
  }, []);

  // After the first try, the errors follow the typing: each one goes away as soon as its field is fixed.
  const fieldErrors = showFieldErrors ? collectReminderFieldErrors(form, new Date()) : [];
  const errorOf = (field) => fieldErrors.find((fieldError) => fieldError.field === field)?.code || "";
  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  // Success screen, for a new request or for one the database already had.
  const showReceived = (reminder, receivedStatus) => {
    setSentReminder(reminder);
    setStatus(receivedStatus);
    focusAfterRender("reminder-success-title");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const request = buildReminderRequest(form, new Date());
    if (request.code === "IGNORED_HONEYPOT_FILLED") return; // honeypot field for bots
    setShowFieldErrors(true);
    if (request.code !== "SUCCESS_REMINDER_READY") {
      setStatus("idle");
      focusAfterRender(REMINDER_FIELD_FOCUS_IDS[request.fieldErrors[0].field]);
      return;
    }
    setStatus("sending");
    try {
      await sendReminder(request.reminder);
      showReceived(request.reminder, "sent");
    } catch (sendError) {
      if (classifyReminderSendError(sendError) === "SUCCESS_REMINDER_ALREADY_RECEIVED") return showReceived(request.reminder, "already-received");
      setStatus("send-failed");
      focusAfterRender("reminder-send-failed");
    }
  };

  const startAnotherReminder = () => {
    setForm(startAnotherReminderForm);
    setShowFieldErrors(false);
    setStatus("idle");
    focusAfterRender(REMINDER_FIELD_FOCUS_IDS.document);
  };

  return (
    <>
      <PageTop
        breadcrumb={[{ label: "Lembrete de vencimento" }]}
        eyebrow="Serviço gratuito"
        title={page.h1}
        text="Deixe o seu contato e o vencimento do documento. Avisamos pelo WhatsApp com antecedência, para você renovar sem correria."
      />
      <section className="sec" aria-label="Formulário do lembrete">
        <div className="container reminder-grid">
          <div>
          {status === "sent" || status === "already-received" ? (
            <ReminderSuccessPanel reminder={sentReminder} alreadyReceived={status === "already-received"} onAnotherDocument={startAnotherReminder} />
          ) : (
            <form className="form-public" onSubmit={submit} noValidate>
              <ReminderTextField field="name" label="Seu nome" errorCode={errorOf("name")} value={form.name} onChange={handleChange("name")}
                autoComplete="name" maxLength={120} required />
              <ReminderTextField field="whatsapp" label="WhatsApp com DDD" errorCode={errorOf("whatsapp")} value={form.whatsapp}
                onChange={handleChange("whatsapp")} inputMode="tel" autoComplete="tel" placeholder="(17) 99999-9999" required />
              <ReminderDocumentOptions documentKey={form.documentKey} errorCode={errorOf("document")} onChange={handleChange("documentKey")} />
              <ReminderExpiryFields form={form} years={years} errorCode={errorOf("expiry")} onChange={handleChange} />
              <label className="is-hidden" aria-hidden="true">
                <span>Não preencha este campo</span>
                <input tabIndex={-1} autoComplete="off" value={form.site} onChange={handleChange("site")} />
              </label>
              <label className="consent">
                <input id="reminder-consent" type="checkbox" checked={form.consent} onChange={handleChange("consent")}
                  {...invalidFieldAttributes("consent", errorOf("consent"))} />
                <span>
                  Autorizo a RD Engenharia a me enviar lembretes por WhatsApp sobre o vencimento deste documento. Posso
                  pedir a exclusão dos meus dados quando quiser. Veja a <a href="/privacidade">política de privacidade</a>.
                </span>
              </label>
              <ReminderFieldError field="consent" errorCode={errorOf("consent")} />
              {status === "send-failed" && <ReminderSendFailedNotice form={form} />}
              <button className="btn btn-whatsapp btn-large" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Enviando..." : "Quero ser avisado"}
              </button>
            </form>
          )}
          </div>
          <aside className="reminder-how reveal" aria-label="Como funciona o lembrete">
            <p className="label-mini">Como funciona</p>
            <ol>
              <li>
                <strong>Você informa</strong> o documento e, se souber, o mês do vencimento.
              </li>
              <li>
                <strong>Guardamos com segurança</strong>, em um banco de dados que só a equipe da RD acessa.
              </li>
              <li>
                <strong>Avisamos pelo WhatsApp</strong> antes do vencimento, para dar tempo de renovar.
              </li>
            </ol>
            <p className="reminder-how-note">
              É gratuito e você pode pedir a exclusão dos seus dados quando quiser. <a href="/privacidade">Política de privacidade</a>.
            </p>
          </aside>
        </div>
      </section>
      <PageClosing
        title="Prefere falar com a gente?"
        text="Conte pelo WhatsApp qual documento você quer acompanhar. O lembrete é gratuito e respondemos no horário de atendimento."
        whatsappText="Olá! Tenho uma dúvida sobre o lembrete de vencimento."
        related={[GENERAL_LINKS.guides, GENERAL_LINKS.quiz, areaLink(AREAS[1])]}
      />
    </>
  );
}
