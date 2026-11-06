// Service create/edit form (computes the next expiry from the repeat interval).

import { useState } from "react";
import { SERVICE_TYPES, STATUS, emptyService } from "./adminRecords.js";
import { addMonths, formatDateBR } from "./dates.js";
import { Field } from "./AdminFormField.jsx";

export function ServiceForm({ initial, onSave, onCancel }) {
  const [s, setS] = useState({ ...emptyService, ...initial });
  const update = (field) => (e) => setS((x) => ({ ...x, [field]: e.target.value }));
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
        <Field label="Serviço">
          <select value={s.tipo} onChange={update("tipo")}>
            {SERVICE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Situação">
          <select value={s.status} onChange={update("status")}>
            {Object.entries(STATUS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Data de realização">
          <input type="date" value={s.data_realizacao || ""} onChange={update("data_realizacao")} />
        </Field>
        <Field label="Repetir a cada (meses)">
          <input
            type="number"
            min="1"
            value={s.repetir_meses || ""}
            onChange={update("repetir_meses")}
            placeholder="Ex.: 36"
          />
        </Field>
        <Field label={`Vencimento${suggestion && !s.vencimento ? ` (será ${formatDateBR(suggestion)})` : ""}`}>
          <input type="date" value={s.vencimento || ""} onChange={update("vencimento")} />
        </Field>
        <Field label="Número da ART">
          <input value={s.art_numero || ""} onChange={update("art_numero")} />
        </Field>
        <Field label="Valor (R$)">
          <input type="number" step="0.01" min="0" value={s.valor || ""} onChange={update("valor")} />
        </Field>
        <Field label="Local do serviço">
          <input value={s.local_servico || ""} onChange={update("local_servico")} placeholder="Endereço ou nome da propriedade" />
        </Field>
      </div>
      <Field label="Descrição">
        <textarea rows="2" value={s.descricao || ""} onChange={update("descricao")} />
      </Field>
      <Field label="Observações">
        <textarea rows="2" value={s.observacoes || ""} onChange={update("observacoes")} />
      </Field>
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
