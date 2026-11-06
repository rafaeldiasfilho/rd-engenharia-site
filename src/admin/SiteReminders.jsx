// Reminder requests sent from the public site (lembretes_site).

import { formatDateBR, monthYear } from "./dates.js";
import { buildClientWhatsappLink } from "./clientWhatsapp.js";

export function SiteReminders({ list, setHandled, convert, remove }) {
  const pending = list.filter((r) => !r.tratado);
  const handled = list.filter((r) => r.tratado);
  const SiteReminderRow = ({ r }) => {
    const msg = `Olá, ${r.nome}! Aqui é da RD Engenharia. Recebemos o seu pedido de lembrete sobre: ${r.documento}. Vamos avisar você antes do vencimento. Pode nos confirmar a data exata do vencimento?`;
    return (
      <li className="admin-line">
        <div>
          <strong>{r.nome}</strong>
          <span>{r.documento}</span>
          <small>
            Vencimento: {monthYear(r.vencimento)} · Autorizou em {formatDateBR(String(r.consentimento_em).slice(0, 10))}
          </small>
        </div>
        <div className="admin-actions">
          <a className="btn btn-whatsapp" href={buildClientWhatsappLink(r.whatsapp, msg)} target="_blank" rel="noopener noreferrer">
            Chamar no WhatsApp
          </a>
          {!r.tratado && (
            <button className="btn btn-sec" type="button" onClick={() => convert(r)}>
              Cadastrar como cliente
            </button>
          )}
          <button className="btn btn-sec" type="button" onClick={() => setHandled(r, !r.tratado)}>
            {r.tratado ? "Reabrir" : "Marcar como tratado"}
          </button>
          <button
            className="btn btn-sec"
            type="button"
            onClick={() => window.confirm(`Excluir o pedido de ${r.nome}?`) && remove(r.id)}
          >
            Excluir
          </button>
        </div>
      </li>
    );
  };
  return (
    <>
      <h2 className="admin-title">Pedidos de lembrete feitos no site</h2>
      {pending.length ? (
        <ul className="admin-list">
          {pending.map((r) => (
            <SiteReminderRow key={r.id} r={r} />
          ))}
        </ul>
      ) : (
        <p className="admin-empty">Nenhum pedido novo.</p>
      )}
      {handled.length > 0 && (
        <>
          <h2 className="admin-title">Já tratados</h2>
          <ul className="admin-list">
            {handled.map((r) => (
              <SiteReminderRow key={r.id} r={r} />
            ))}
          </ul>
        </>
      )}
    </>
  );
}
