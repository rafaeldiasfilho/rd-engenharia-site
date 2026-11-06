// Service create/edit form (computes the next expiry from the repeat interval).

import { useState } from "react";
import { SERVICE_TYPES, SERVICE_STATUS_LABELS, emptyService } from "./adminRecords.js";
import { addMonths, formatDateBR } from "./dates.js";
import { AdminFormField } from "./AdminFormField.jsx";

export function ServiceForm({ initial, onSave, onCancel }) {
  const [s, setS] = useState({ ...emptyService, ...initial });
  const updateServiceField = (field) => (e) => setS((x) => ({ ...x, [field]: e.target.value }));
  const suggestion = addMonths(s.data_realizacao, s.repetir_meses);
  return (
    <form
      className="admin-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...s, vencimento: s.vencimento || suggestion || "" });
      }}
    >
      <div className="admin-grid">
        <AdminFormField label="Serviço">
          <select value={s.tipo} onChange={updateServiceField("tipo")}>
            {SERVICE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </AdminFormField>
        <AdminFormField label="Situação">
          <select value={s.status} onChange={updateServiceField("status")}>
            {Object.entries(SERVICE_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </AdminFormField>
        <AdminFormField label="Data de realização">
          <input type="date" value={s.data_realizacao || ""} onChange={updateServiceField("data_realizacao")} />
        </AdminFormField>
        <AdminFormField label="Repetir a cada (meses)">
          <input
            type="number"
            min="1"
            value={s.repetir_meses || ""}
            onChange={updateServiceField("repetir_meses")}
            placeholder="Ex.: 36"
          />
        </AdminFormField>
        <AdminFormField label={`Vencimento${suggestion && !s.vencimento ? ` (será ${formatDateBR(suggestion)})` : ""}`}>
          <input type="date" value={s.vencimento || ""} onChange={updateServiceField("vencimento")} />
        </AdminFormField>
        <AdminFormField label="Número da ART">
          <input value={s.art_numero || ""} onChange={updateServiceField("art_numero")} />
        </AdminFormField>
        <AdminFormField label="Valor (R$)">
          <input type="number" step="0.01" min="0" value={s.valor || ""} onChange={updateServiceField("valor")} />
        </AdminFormField>
        <AdminFormField label="Local do serviço">
          <input value={s.local_servico || ""} onChange={updateServiceField("local_servico")} placeholder="Endereço ou nome da propriedade" />
        </AdminFormField>
      </div>
      <AdminFormField label="Descrição">
        <textarea rows="2" value={s.descricao || ""} onChange={updateServiceField("descricao")} />
      </AdminFormField>
      <AdminFormField label="Observações">
        <textarea rows="2" value={s.observacoes || ""} onChange={updateServiceField("observacoes")} />
      </AdminFormField>
      <div className="admin-actions">
        <button className="btn btn-whatsapp" type="submit">
          Salvar serviço
        </button>
        <button className="btn btn-sec" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
