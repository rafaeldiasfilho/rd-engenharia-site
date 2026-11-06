// Client list with search.

import { useState } from "react";

export function ClientList({ clients, services, openClient, newClient }) {
  const [search, setSearch] = useState("");
  const term = search.trim().toLowerCase();
  const filtered = clients.filter((c) =>
    [c.nome, c.documento, c.cidade, c.whatsapp, c.telefone, c.email].some((v) => String(v || "").toLowerCase().includes(term))
  );
  const countServices = (id) => services.filter((s) => s.cliente_id === id).length;

  return (
    <>
      <div className="admin-bar">
        <input
          type="search"
          placeholder="Buscar por nome, CPF/CNPJ, cidade ou telefone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar clientes"
        />
        <button className="btn btn-whatsapp" type="button" onClick={newClient}>
          Novo cliente
        </button>
      </div>
      {filtered.length ? (
        <ul className="admin-list">
          {filtered.map((c) => (
            <li className="admin-line" key={c.id}>
              <div>
                <strong>{c.nome}</strong>
                <span>{[c.cidade, c.whatsapp || c.telefone].filter(Boolean).join(" · ") || "Sem dados de contato"}</span>
                <small>{countServices(c.id)} serviço(s)</small>
              </div>
              <div className="admin-actions">
                <button className="btn btn-sec" type="button" onClick={() => openClient(c.id)}>
                  Abrir
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="admin-empty">{clients.length ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado ainda."}</p>
      )}
    </>
  );
}
