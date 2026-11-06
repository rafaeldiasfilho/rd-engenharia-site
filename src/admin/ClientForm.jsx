// Client create/edit form.

import { useState } from "react";
import { emptyClient } from "./adminRecords.js";
import { AdminFormField } from "./AdminFormField.jsx";
import { formatDateBR, todayISO } from "./dates.js";

export function ClientForm({ initial, onSave, onCancel }) {
  const [c, setC] = useState({ ...emptyClient, ...initial });
  const updateClientField = (field) => (e) => setC((x) => ({ ...x, [field]: e.target.value }));
  return (
    <form
      className="admin-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(c);
      }}
    >
      <div className="admin-grid">
        <AdminFormField label="Nome ou razão social">
          <input value={c.nome} onChange={updateClientField("nome")} required />
        </AdminFormField>
        <AdminFormField label="Tipo">
          <select value={c.tipo} onChange={updateClientField("tipo")}>
            <option value="pf">Pessoa física</option>
            <option value="pj">Empresa</option>
          </select>
        </AdminFormField>
        <AdminFormField label="CPF ou CNPJ">
          <input value={c.documento || ""} onChange={updateClientField("documento")} />
        </AdminFormField>
        <AdminFormField label="Pessoa de contato">
          <input value={c.contato || ""} onChange={updateClientField("contato")} />
        </AdminFormField>
        <AdminFormField label="WhatsApp">
          <input value={c.whatsapp || ""} onChange={updateClientField("whatsapp")} inputMode="tel" placeholder="(17) 99999-9999" />
        </AdminFormField>
        <AdminFormField label="Outro telefone">
          <input value={c.telefone || ""} onChange={updateClientField("telefone")} inputMode="tel" />
        </AdminFormField>
        <AdminFormField label="E-mail">
          <input type="email" value={c.email || ""} onChange={updateClientField("email")} />
        </AdminFormField>
        <AdminFormField label="CEP">
          <input value={c.cep || ""} onChange={updateClientField("cep")} inputMode="numeric" />
        </AdminFormField>
        <AdminFormField label="Rua">
          <input value={c.logradouro || ""} onChange={updateClientField("logradouro")} />
        </AdminFormField>
        <AdminFormField label="Número">
          <input value={c.numero || ""} onChange={updateClientField("numero")} />
        </AdminFormField>
        <AdminFormField label="Bairro">
          <input value={c.bairro || ""} onChange={updateClientField("bairro")} />
        </AdminFormField>
        <AdminFormField label="Cidade">
          <input value={c.cidade || ""} onChange={updateClientField("cidade")} />
        </AdminFormField>
        <AdminFormField label="Como chegou até nós">
          <input value={c.origem || ""} onChange={updateClientField("origem")} placeholder="Indicação, Instagram, site..." />
        </AdminFormField>
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
      <AdminFormField label="Observações">
        <textarea rows="3" value={c.observacoes || ""} onChange={updateClientField("observacoes")} />
      </AdminFormField>
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
