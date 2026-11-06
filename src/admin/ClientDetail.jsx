// One client: data, services and actions.

import { useState } from "react";
import { ClientForm } from "./ClientForm.jsx";
import { daysUntil, formatDateBR, todayISO } from "./dates.js";
import { whatsappLink } from "./clientWhatsapp.js";
import { ServiceForm } from "./ServiceForm.jsx";
import { STATUS } from "./adminRecords.js";

export function ClientDetail({ client, services, saveClient, deleteClient, saveService, deleteService, goBack }) {
  const [editing, setEditing] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const ownServices = services.filter((s) => s.cliente_id === client.id);
  const address = [
    [client.logradouro, client.numero].filter(Boolean).join(", "),
    client.bairro,
    [client.cidade, client.uf].filter(Boolean).join("/"),
    client.cep,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <button className="btn btn-sec" type="button" onClick={goBack}>
        Voltar
      </button>

      {editing ? (
        <ClientForm
          initial={client}
          onSave={async (c) => {
            await saveClient(c);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <section className="admin-record">
          <h2>{client.nome}</h2>
          <dl>
            <div>
              <dt>Tipo</dt>
              <dd>
                {client.tipo === "pj" ? "Empresa" : "Pessoa física"}
                {client.documento ? ` · ${client.documento}` : ""}
              </dd>
            </div>
            <div>
              <dt>Contato</dt>
              <dd>
                {[client.contato, client.whatsapp, client.telefone, client.email].filter(Boolean).join(" · ") || "—"}
              </dd>
            </div>
            <div>
              <dt>Endereço</dt>
              <dd>{address || "—"}</dd>
            </div>
            <div>
              <dt>Lembretes por WhatsApp</dt>
              <dd>
                {client.aceita_lembretes
                  ? `Aceitou${client.aceite_lembretes_em ? ` em ${formatDateBR(client.aceite_lembretes_em)}` : ""}`
                  : "Sem aceite registrado"}
              </dd>
            </div>
            {client.origem && (
              <div>
                <dt>Como chegou</dt>
                <dd>{client.origem}</dd>
              </div>
            )}
            {client.observacoes && (
              <div>
                <dt>Observações</dt>
                <dd>{client.observacoes}</dd>
              </div>
            )}
          </dl>
          <div className="admin-actions">
            {whatsappLink(client.whatsapp || client.telefone, `Olá, ${client.nome}! Aqui é da RD Engenharia.`) && (
              <a
                className="btn btn-whatsapp"
                href={whatsappLink(client.whatsapp || client.telefone, `Olá, ${client.nome}! Aqui é da RD Engenharia.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            )}
            <button className="btn btn-sec" type="button" onClick={() => setEditing(true)}>
              Editar
            </button>
            <button
              className="btn btn-sec"
              type="button"
              onClick={() => {
                if (window.confirm(`Excluir ${client.nome} e todos os serviços dele? Isso não pode ser desfeito.`))
                  deleteClient(client.id);
              }}
            >
              Excluir
            </button>
          </div>
        </section>
      )}

      <div className="admin-title-line">
        <h2 className="admin-title">Serviços</h2>
        {!editingService && (
          <button className="btn btn-whatsapp" type="button" onClick={() => setEditingService({ data_realizacao: todayISO() })}>
            Registrar serviço
          </button>
        )}
      </div>

      {editingService && (
        <ServiceForm
          initial={editingService}
          onSave={async (s) => {
            await saveService({ ...s, cliente_id: client.id });
            setEditingService(null);
          }}
          onCancel={() => setEditingService(null)}
        />
      )}

      {ownServices.length ? (
        <ul className="admin-list">
          {ownServices.map((s) => {
            const days = daysUntil(s.vencimento);
            return (
              <li className="admin-line" key={s.id}>
                <div>
                  <strong>{s.tipo}</strong>
                  <span>
                    {STATUS[s.status]} · {formatDateBR(s.data_realizacao)}
                    {s.art_numero ? ` · ART ${s.art_numero}` : ""}
                    {s.valor ? ` · R$ ${Number(s.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : ""}
                  </span>
                  {s.local_servico && <span>{s.local_servico}</span>}
                  {s.descricao && <span>{s.descricao}</span>}
                  {s.vencimento && (
                    <small className={days < 0 && !s.encerrado ? "admin-overdue" : ""}>
                      Vencimento: {formatDateBR(s.vencimento)}
                      {s.encerrado ? " · tratado" : days < 0 ? " · vencido" : ` · em ${days} dia(s)`}
                    </small>
                  )}
                </div>
                <div className="admin-actions">
                  <button className="btn btn-sec" type="button" onClick={() => setEditingService(s)}>
                    Editar
                  </button>
                  <button
                    className="btn btn-sec"
                    type="button"
                    onClick={() => {
                      if (window.confirm("Excluir este serviço?")) deleteService(s.id);
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="admin-empty">Nenhum serviço registrado para este cliente.</p>
      )}
    </>
  );
}
