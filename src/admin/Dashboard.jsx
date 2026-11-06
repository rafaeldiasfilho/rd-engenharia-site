// Expiry dashboard: overdue and upcoming services, with a WhatsApp reminder button per client.

import { useMemo, useState } from "react";
import { daysUntil, formatDateBR } from "./dates.js";
import { whatsappLink } from "./clientWhatsapp.js";

export function Dashboard({ clients, services, openClient, markHandled }) {
  const [windowDays, setWindowDays] = useState(90);
  const byId = useMemo(() => Object.fromEntries(clients.map((c) => [c.id, c])), [clients]);

  const pending = services
    .filter((s) => s.vencimento && !s.encerrado)
    .map((s) => ({ ...s, days: daysUntil(s.vencimento) }))
    .sort((a, b) => a.days - b.days);
  const overdue = pending.filter((s) => s.days < 0);
  const upcoming = pending.filter((s) => s.days >= 0 && s.days <= windowDays);

  const Row = ({ s }) => {
    const client = byId[s.cliente_id];
    if (!client) return null;
    const msg = client.aceita_lembretes
      ? `Olá, ${client.nome}! Aqui é da RD Engenharia. ${
          s.days < 0
            ? `Passando para avisar que o seu documento "${s.tipo}" venceu em ${formatDateBR(s.vencimento)}.`
            : `Passando para avisar que o seu documento "${s.tipo}" vence em ${formatDateBR(s.vencimento)}${
                s.days <= 60 ? `, daqui a ${s.days} dia(s)` : ""
              }.`
        } A renovação leva um tempo, então vale começar logo. Posso cuidar disso para você?`
      : `Olá, ${client.nome}! Aqui é da RD Engenharia. Podemos avisar você por WhatsApp quando seus serviços estiverem perto do vencimento, para você não perder o prazo? Se preferir não receber, é só nos dizer.`;
    const waLink = whatsappLink(client.whatsapp || client.telefone, msg);
    return (
      <li className="admin-line">
        <div>
          <strong>{client.nome}</strong>
          <span>{s.tipo}</span>
          {!client.aceita_lembretes && <small>Sem aceite de lembretes registrado. O botão pede a autorização.</small>}
          <small className={s.days < 0 ? "admin-overdue" : ""}>
            {s.days < 0 ? `Venceu há ${-s.days} dia(s)` : s.days === 0 ? "Vence hoje" : `Vence em ${s.days} dia(s)`} ·{" "}
            {formatDateBR(s.vencimento)}
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
          <button className="btn btn-sec" type="button" onClick={() => markHandled(s)}>
            Marcar como tratado
          </button>
        </div>
      </li>
    );
  };

  return (
    <>
      <div className="admin-summary">
        <div>
          <strong>{overdue.length}</strong>
          <span>vencidos</span>
        </div>
        <div>
          <strong>{upcoming.length}</strong>
          <span>vencem nos próximos {windowDays} dias</span>
        </div>
        <div>
          <strong>{clients.length}</strong>
          <span>clientes</span>
        </div>
        <div>
          <strong>{services.length}</strong>
          <span>serviços registrados</span>
        </div>
      </div>

      <h2 className="admin-title">Vencidos</h2>
      {overdue.length ? (
        <ul className="admin-list">
          {overdue.map((s) => (
            <Row key={s.id} s={s} />
          ))}
        </ul>
      ) : (
        <p className="admin-empty">Nenhum serviço vencido.</p>
      )}

      <div className="admin-title-line">
        <h2 className="admin-title">Próximos vencimentos</h2>
        <label>
          Janela
          <select value={windowDays} onChange={(e) => setWindowDays(Number(e.target.value))}>
            {[30, 60, 90, 180, 365].map((d) => (
              <option key={d} value={d}>
                {d} dias
              </option>
            ))}
          </select>
        </label>
      </div>
      {upcoming.length ? (
        <ul className="admin-list">
          {upcoming.map((s) => (
            <Row key={s.id} s={s} />
          ))}
        </ul>
      ) : (
        <p className="admin-empty">
          Nada vencendo nesse período. Ao registrar um serviço, informe de quantos em quantos meses ele se repete
          para aparecer aqui.
        </p>
      )}
    </>
  );
}
