// Expiry dashboard: overdue and upcoming services, with a WhatsApp reminder button per client,
// and the download of the next 12 months of expiries as a calendar file (.ics).

import { useMemo, useState } from "react";
import { daysUntil, todayISO } from "./dates.js";
import { ExpiryRow } from "./ExpiryRow.jsx";
import { buildExpiryCalendar, selectCalendarExpiries } from "./expiryCalendar.js";
import { downloadTextFile } from "./fileDownload.js";

export function Dashboard({ clients, services, openClient, markHandled, renewService }) {
  const [windowDays, setWindowDays] = useState(90);
  const byId = useMemo(() => Object.fromEntries(clients.map((c) => [c.id, c])), [clients]);

  // Each entry keeps the database record untouched and the day count beside it.
  const pending = services
    .filter((s) => s.vencimento && !s.encerrado)
    .map((service) => ({ service, days: daysUntil(service.vencimento) }))
    .sort((a, b) => a.days - b.days);
  const overdue = pending.filter((entry) => entry.days < 0);
  const upcoming = pending.filter((entry) => entry.days >= 0 && entry.days <= windowDays);
  const hasCalendarExpiries = selectCalendarExpiries(services, todayISO()).length > 0;

  const downloadExpiryCalendar = () =>
    downloadTextFile(
      "vencimentos.ics",
      buildExpiryCalendar({ services, clients, todayIso: todayISO(), generatedAt: new Date() }),
      "text/calendar;charset=utf-8"
    );

  const renderExpiryRow = ({ service, days }) => (
    <ExpiryRow
      key={service.id}
      service={service}
      days={days}
      client={byId[service.cliente_id]}
      openClient={openClient}
      markHandled={markHandled}
      renewService={renewService}
    />
  );

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
        <ul className="admin-list">{overdue.map(renderExpiryRow)}</ul>
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
        <ul className="admin-list">{upcoming.map(renderExpiryRow)}</ul>
      ) : (
        <p className="admin-empty">
          Nada vencendo nesse período. Ao registrar um serviço, informe de quantos em quantos meses ele se repete
          para aparecer aqui.
        </p>
      )}

      {hasCalendarExpiries && (
        <div className="admin-actions admin-backup">
          <button className="btn btn-sec" type="button" onClick={downloadExpiryCalendar}>
            Baixar vencimentos dos próximos 12 meses (agenda .ics)
          </button>
        </div>
      )}
    </>
  );
}
