// "Renovar" with a confirmation on the page itself (no window.confirm). Confirming creates the next service
// and marks this one as handled (renewServiceInDatabase, called by Admin.jsx through onRenew).

import { useEffect, useId, useRef, useState } from "react";
import { computeRenewalExpiry, formatDateBR } from "./dates.js";

export function RenewServiceButton({ service, onRenew }) {
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const renewButtonRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const wasConfirmingRef = useRef(false);
  const questionId = useId();
  const nextExpiry = computeRenewalExpiry(service.vencimento, service.repetir_meses);

  // Keyboard focus follows the confirmation: onto "Confirmar renovação" when it opens, back to "Renovar" when it closes.
  useEffect(() => {
    if (confirming) confirmButtonRef.current?.focus();
    else if (wasConfirmingRef.current) renewButtonRef.current?.focus();
    wasConfirmingRef.current = confirming;
  }, [confirming]);

  const confirmRenewal = async () => {
    setSaving(true); // blocks a second click while saving, which would create two next services
    try {
      await onRenew(service);
    } finally {
      setSaving(false);
      setConfirming(false);
    }
  };

  if (!confirming)
    return (
      <button
        ref={renewButtonRef}
        className="btn btn-sec"
        type="button"
        aria-label={`Renovar ${service.tipo}`}
        onClick={() => setConfirming(true)}
      >
        Renovar
      </button>
    );

  return (
    <div
      className="admin-notice"
      role="group"
      aria-labelledby={questionId}
      onKeyDown={(e) => e.key === "Escape" && !saving && setConfirming(false)}
    >
      <p id={questionId}>
        Renovar "{service.tipo}"? Será criado um novo serviço, como orçamento, com vencimento em {formatDateBR(nextExpiry)}, e
        este será marcado como tratado.
      </p>
      <div className="admin-actions">
        <button ref={confirmButtonRef} className="btn btn-whatsapp" type="button" disabled={saving} onClick={confirmRenewal}>
          {saving ? "Renovando..." : "Confirmar renovação"}
        </button>
        <button className="btn btn-sec" type="button" disabled={saving} onClick={() => setConfirming(false)}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
