// One overdue or upcoming expiry on the dashboard, with its actions (WhatsApp reminder, open client, renew,
// mark as handled). `days` comes beside the service, never inside it: the record goes back to the database as it is,
// and an extra field such as `days` would make the Supabase save fail (the column does not exist).

import { formatDateBR } from "./dates.js";
import { buildClientWhatsappLink } from "./clientWhatsapp.js";
import { canRenewService } from "./serviceRenewal.js";
import { RenewServiceButton } from "./RenewServiceButton.jsx";

export function ExpiryRow({ service, days, client, openClient, markHandled, renewService }) {
  if (!client) return null;
  const msg = client.aceita_lembretes
    ? `Olá, ${client.nome}! Aqui é da RD Engenharia. ${
        days < 0
          ? `Passando para avisar que o seu documento "${service.tipo}" venceu em ${formatDateBR(service.vencimento)}.`
          : `Passando para avisar que o seu documento "${service.tipo}" vence em ${formatDateBR(service.vencimento)}${
              days <= 60 ? `, daqui a ${days} dia(s)` : ""
            }.`
      } A renovação leva um tempo, então vale começar logo. Posso cuidar disso para você?`
    : `Olá, ${client.nome}! Aqui é da RD Engenharia. Podemos avisar você por WhatsApp quando seus serviços estiverem perto do vencimento, para você não perder o prazo? Se preferir não receber, é só nos dizer.`;
  const waLink = buildClientWhatsappLink(client.whatsapp || client.telefone, msg);
  return (
    <li className="admin-line">
      <div>
        <strong>{client.nome}</strong>
        <span>{service.tipo}</span>
        {!client.aceita_lembretes && <small>Sem aceite de lembretes registrado. O botão pede a autorização.</small>}
        <small className={days < 0 ? "admin-overdue" : ""}>
          {days < 0 ? `Venceu há ${-days} dia(s)` : days === 0 ? "Vence hoje" : `Vence em ${days} dia(s)`} ·{" "}
          {formatDateBR(service.vencimento)}
        </small>
      </div>
      <div className="admin-actions">
        {waLink ? (
          <a className="btn btn-whatsapp" href={waLink} target="_blank" rel="noopener noreferrer">
            {client.aceita_lembretes ? "Chamar no WhatsApp" : "Pedir autorização"}
          </a>
        ) : (
          <span className="admin-none">Sem telefone</span>
        )}
        <button className="btn btn-sec" type="button" onClick={() => openClient(client.id)}>
          Abrir cliente
        </button>
        {canRenewService(service) && <RenewServiceButton service={service} onRenew={renewService} />}
        <button className="btn btn-sec" type="button" onClick={() => markHandled(service)}>
          Marcar como tratado
        </button>
      </div>
    </li>
  );
}
