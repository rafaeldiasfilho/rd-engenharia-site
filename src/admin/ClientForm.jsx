// Client create/edit form.

import { useState } from "react";
import { emptyClient } from "./adminRecords.js";
import { Field } from "./AdminFormField.jsx";
import { formatDateBR, todayISO } from "./dates.js";

export function ClientForm({ initial, onSave, onCancel }) {
  const [c, setC] = useState({ ...emptyClient, ...initial });
  const update = (field) => (e) => setC((x) => ({ ...x, [field]: e.target.value }));
  return (
    <form
      className="admin-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(c);
      }}
    >
      <div className="admin-grid">
        <Field label="Nome ou razão social">
          <input value={c.nome} onChange={update("nome")} required />
        </Field>
        <Field label="Tipo">
          <select value={c.tipo} onChange={update("tipo")}>
            <option value="pf">Pessoa física</option>
            <option value="pj">Empresa</option>
          </select>
        </Field>
        <Field label="CPF ou CNPJ">
          <input value={c.documento || ""} onChange={update("documento")} />
        </Field>
        <Field label="Pessoa de contato">
          <input value={c.contato || ""} onChange={update("contato")} />
        </Field>
        <Field label="WhatsApp">
          <input value={c.whatsapp || ""} onChange={update("whatsapp")} inputMode="tel" placeholder="(17) 99999-9999" />
        </Field>
        <Field label="Outro telefone">
          <input value={c.telefone || ""} onChange={update("telefone")} inputMode="tel" />
        </Field>
        <Field label="E-mail">
          <input type="email" value={c.email || ""} onChange={update("email")} />
        </Field>
        <Field label="CEP">
          <input value={c.cep || ""} onChange={update("cep")} inputMode="numeric" />
        </Field>
        <Field label="Rua">
          <input value={c.logradouro || ""} onChange={update("logradouro")} />
        </Field>
        <Field label="Número">
          <input value={c.numero || ""} onChange={update("numero")} />
        </Field>
        <Field label="Bairro">
          <input value={c.bairro || ""} onChange={update("bairro")} />
        </Field>
        <Field label="Cidade">
          <input value={c.cidade || ""} onChange={update("cidade")} />
        </Field>
        <Field label="Como chegou até nós">
          <input value={c.origem || ""} onChange={update("origem")} placeholder="Indicação, Instagram, site..." />
        </Field>
      </div>
      <label className="admin-consent">
        <input
          type="checkbox"
          checked={!!c.aceita_lembretes}
          onChange={(e) =>
            setC((x) => ({
              ...x,
              aceita_lembretes: e.target.checked,
              aceite_lembretes_em: e.target.checked ? x.aceite_lembretes_em || todayISO() : "",
            }))
          }
        />
        <span>
          O cliente aceitou receber lembretes de vencimento por WhatsApp
          {c.aceita_lembretes && c.aceite_lembretes_em ? ` (aceite em ${formatDateBR(c.aceite_lembretes_em)})` : ""}
        </span>
      </label>
      <Field label="Observações">
        <textarea rows="3" value={c.observacoes || ""} onChange={update("observacoes")} />
      </Field>
      <div className="admin-actions">
        <button className="btn btn-whatsapp" type="submit">
          Salvar cliente
        </button>
        <button className="btn btn-sec" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
