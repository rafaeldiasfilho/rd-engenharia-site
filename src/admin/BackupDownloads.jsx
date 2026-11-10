// Backup of the internal area: one CSV per table (clients, services and the reminder requests sent from the site).
// downloadCSV protects every file against formula injection.

import { downloadCSV } from "./csvExport.js";

export function BackupDownloads({ clients, services, reminders }) {
  return (
    <div className="admin-actions admin-backup">
      <button className="btn btn-sec" type="button" onClick={() => downloadCSV("clientes.csv", clients)}>
        Baixar clientes (CSV)
      </button>
      <button className="btn btn-sec" type="button" onClick={() => downloadCSV("servicos.csv", services)}>
        Baixar serviços (CSV)
      </button>
      <button className="btn btn-sec" type="button" onClick={() => downloadCSV("lembretes_site.csv", reminders)}>
        Baixar pedidos do site (CSV)
      </button>
    </div>
  );
}
