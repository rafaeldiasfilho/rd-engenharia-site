// Expiry reminder form (/lembrete-de-vencimento): validates the form and saves the request with sendReminder.

import { useEffect, useState } from "react";
import { AREAS, REMINDER_DOCUMENTS, REMINDER_TIPS } from "../pagesData";
import { PageClosing } from "../Layout";
import { sendReminder } from "../publicApi/api";
import { GENERAL_LINKS, PageTop, areaLink } from "./pageParts.jsx";

function lastDayOfMonth(yearMonth) {
  const [year, month] = yearMonth.split("-").map(Number);
  const day = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return `${yearMonth}-${String(day).padStart(2, "0")}`;
}

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export function ReminderPage({ page }) {
  const [form, setForm] = useState({ name: "", whatsapp: "", document: REMINDER_DOCUMENTS[0], monthNum: "", year: "", consent: false, site: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  // Years computed in the browser (the prerendered HTML does not freeze the site's build year).
  const [years, setYears] = useState([]);
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYears(Array.from({ length: 6 }, (_, i) => String(currentYear + i)));
  }, []);
  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  // "Mês do vencimento" (expiry month) as two lists (month and year): the type="month" field does not work in desktop Safari.
  const expiryMonth = form.monthNum && form.year ? `${form.year}-${form.monthNum}` : "";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.site) return; // honeypot field for bots
    let phoneNumber = form.whatsapp.replace(/\D/g, "");
    if (phoneNumber.length === 10 || phoneNumber.length === 11) phoneNumber = "55" + phoneNumber;
    if (phoneNumber.length < 12 || phoneNumber.length > 13) {
      setError("Confira o número do WhatsApp. Informe o DDD e o número, por exemplo (17) 99999-9999.");
      return;
    }
    if (form.name.trim().length < 2) {
      setError("Informe o seu nome.");
      return;
    }
    if (!form.consent) {
      setError("Marque a autorização para receber os lembretes.");
      return;
    }
    setStatus("sending");
    try {
      await sendReminder({
        name: form.name.trim(),
        whatsapp: phoneNumber,
        document: form.document,
        expiry: expiryMonth ? lastDayOfMonth(expiryMonth) : null,
        consent: true,
      });
      setStatus("ok");
    } catch {
      setStatus("idle");
      setError("Não foi possível enviar agora. Tente de novo ou chame a RD pelo WhatsApp.");
    }
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
          {status === "ok" ? (
            <div className="notice-ok" role="status">
              <h2>Pedido recebido</h2>
              <p>
                Obrigado! Guardamos o seu pedido e vamos avisar você pelo WhatsApp antes do vencimento. Se quiser
                desistir a qualquer momento, é só nos dizer.
              </p>
              <a className="btn btn-sec" href="/">
                Voltar ao início
              </a>
            </div>
          ) : (
            <form className="form-public" onSubmit={submit} noValidate>
              <label>
                <span>Seu nome</span>
                <input value={form.name} onChange={handleChange("name")} autoComplete="name" maxLength={120} required />
              </label>
              <label>
                <span>WhatsApp com DDD</span>
                <input
                  value={form.whatsapp}
                  onChange={handleChange("whatsapp")}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(17) 99999-9999"
                  required
                />
              </label>
              <fieldset className="doc-options">
                <legend>Qual documento?</legend>
                {REMINDER_DOCUMENTS.map((d) => (
                  <label key={d} className="doc-option">
                    <input type="radio" name="document" value={d} checked={form.document === d} onChange={handleChange("document")} />
                    <span className="doc-option-name">{d}</span>
                    {form.document === d && REMINDER_TIPS[d] && <small className="hint-doc">{REMINDER_TIPS[d]}</small>}
                  </label>
                ))}
              </fieldset>
              <fieldset className="field-month">
                <legend>Mês do vencimento (se souber)</legend>
                <div>
                  <select aria-label="Mês" value={form.monthNum} onChange={handleChange("monthNum")}>
                    <option value="">Mês</option>
                    {MONTHS.map((m, i) => (
                      <option key={m} value={String(i + 1).padStart(2, "0")}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select aria-label="Ano" value={form.year} onChange={handleChange("year")}>
                    <option value="">Ano</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>
              <label className="is-hidden" aria-hidden="true">
                <span>Não preencha este campo</span>
                <input tabIndex={-1} autoComplete="off" value={form.site} onChange={handleChange("site")} />
              </label>
              <label className="consent">
                <input type="checkbox" checked={form.consent} onChange={handleChange("consent")} />
                <span>
                  Autorizo a RD Engenharia a me enviar lembretes por WhatsApp sobre o vencimento deste documento. Posso
                  pedir a exclusão dos meus dados quando quiser. Veja a <a href="/privacidade">política de privacidade</a>.
                </span>
              </label>
              {error && (
                <p className="error-form" role="alert">
                  {error}
                </p>
              )}
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
        related={[GENERAL_LINKS.guias, GENERAL_LINKS.quiz, areaLink(AREAS[1])]}
      />
    </>
  );
}
