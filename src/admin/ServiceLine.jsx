// One service on the client page: data and expiry, plus its actions (review request, renewal, edit, delete).

import { daysUntil, formatDateBR } from "./dates.js";
import { SERVICE_STATUS_LABELS } from "./adminRecords.js";
import { buildReviewRequestLink } from "./reviewRequest.js";
import { canRenewService } from "./serviceRenewal.js";
import { RenewServiceButton } from "./RenewServiceButton.jsx";

export function ServiceLine({ client, service, onEdit, onDelete, onRenew }) {
  const days = daysUntil(service.vencimento);
  const reviewRequestLink = buildReviewRequestLink(client, service);
  return (
    <li className="admin-line">
      <div>
        <strong>{service.tipo}</strong>
        <span>
          {SERVICE_STATUS_LABELS[service.status]} · {formatDateBR(service.data_realizacao)}
          {service.art_numero ? ` · ART ${service.art_numero}` : ""}
          {service.valor ? ` · R$ ${Number(service.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : ""}
        </span>
        {service.local_servico && <span>{service.local_servico}</span>}
        {service.descricao && <span>{service.descricao}</span>}
        {service.vencimento && (
          <small className={days < 0 && !service.encerrado ? "admin-overdue" : ""}>
            Vencimento: {formatDateBR(service.vencimento)}
            {service.encerrado ? " · tratado" : days < 0 ? " · vencido" : ` · em ${days} dia(s)`}
          </small>
        )}
      </div>
      <div className="admin-actions">
        {reviewRequestLink && (
          <a
            className="btn btn-sec"
            href={reviewRequestLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Pedir avaliação no Google pelo WhatsApp: ${service.tipo}`}
          >
            Pedir avaliação
          </a>
        )}
        {canRenewService(service) && <RenewServiceButton service={service} onRenew={onRenew} />}
        <button className="btn btn-sec" type="button" onClick={onEdit}>
          Editar
        </button>
        <button
          className="btn btn-sec"
          type="button"
          onClick={() => {
            if (window.confirm("Excluir este serviço?")) onDelete();
          }}
        >
          Excluir
        </button>
      </div>
    </li>
  );
}
