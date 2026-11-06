// Quote form of the home page: nothing is sent to a server; it opens WhatsApp with the message ready.
import { useState } from "react";
import Icon from "../Icon";
import { whatsappLink } from "../contact";
import { FORM_SERVICES } from "../content/home.js";
import { buildQuoteRequestMessage } from "./quoteRequest.js";

export function QuoteRequestForm() {
  const [request, setRequest] = useState({ name: "", city: "", service: "", message: "" });
  const handleChange = (field) => (e) => setRequest((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    window.open(whatsappLink(buildQuoteRequestMessage(request)), "_blank", "noopener,noreferrer");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Seu nome
        <input value={request.name} onChange={handleChange("name")} autoComplete="name" />
      </label>
      <label>
        Cidade
        <input value={request.city} onChange={handleChange("city")} />
      </label>
      <label>
        Área do serviço
        <select value={request.service} onChange={handleChange("service")}>
          <option value="">Escolha uma área</option>
          {FORM_SERVICES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          <option value="Ainda não sei">Ainda não sei</option>
        </select>
      </label>
      <label>
        O que você precisa
        <textarea rows="4" value={request.message} onChange={handleChange("message")} />
      </label>
      <button className="btn btn-whatsapp btn-large" type="submit">
        <Icon name="fa-brands fa-whatsapp" /> Continuar no WhatsApp
      </button>
    </form>
  );
}
