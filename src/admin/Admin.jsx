import { useCallback, useEffect, useState } from "react";
import { openDatabase } from "./db";
import { Login } from "./Login.jsx";
import { ClientForm } from "./ClientForm.jsx";
import { ClientDetail } from "./ClientDetail.jsx";
import { Dashboard } from "./Dashboard.jsx";
import { SiteReminders } from "./SiteReminders.jsx";
import { emptyClient, emptyService } from "./adminRecords.js";
import { ClientList } from "./ClientList.jsx";
import { downloadCSV } from "./csvExport.js";

export default function Admin() {
  const [db, setDb] = useState(null);
  const [user, setUser] = useState(undefined);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [clientId, setClientId] = useState(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    openDatabase().then(async (b) => {
      setDb(b);
      setUser(b.mode === "unavailable" ? null : await b.auth.session());
    });
  }, []);

  const reloadAdminData = useCallback(async () => {
    if (!db) return;
    try {
      const [c, s, r] = await Promise.all([
        db.clients.list(),
        db.services.list(),
        db.reminders.list(),
      ]);
      setClients(c);
      setServices(s);
      setReminders(r);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }, [db]);

  useEffect(() => {
    if (user) reloadAdminData();
  }, [user, reloadAdminData]);

  const runActionAndReload = async (fn) => {
    try {
      await fn();
      await reloadAdminData();
    } catch (e) {
      setError(e.message);
    }
  };

  const client = clients.find((c) => c.id === clientId);

  if (!db || user === undefined) return <p className="admin-empty">Carregando...</p>;
  if (db.mode === "unavailable")
    return (
      <div className="admin-login">
        <div className="form">
          <h1>Área interna da RD</h1>
          <p>O banco de dados ainda não foi ligado a este site. Assim que for ligado, o acesso será liberado aqui.</p>
        </div>
      </div>
    );
  if (!user) return <Login db={db} onLogin={setUser} />;

  const goTo = (name) => {
    setTab(name);
    setClientId(null);
    setCreatingNew(false);
  };

  return (
    <div className="admin">
      <header className="admin-top">
        <div className="admin-top-inner">
          <strong>RD Engenharia · Área interna</strong>
          <nav aria-label="Seções">
            <button type="button" aria-pressed={tab === "dashboard"} onClick={() => goTo("dashboard")}>
              Vencimentos
            </button>
            <button type="button" aria-pressed={tab === "clients"} onClick={() => goTo("clients")}>
              Clientes
            </button>
            <button type="button" aria-pressed={tab === "reminders"} onClick={() => goTo("reminders")}>
              Pedidos do site{reminders.filter((r) => !r.tratado).length ? ` (${reminders.filter((r) => !r.tratado).length})` : ""}
            </button>
          </nav>
          <div className="admin-user">
            <span>{user.email}</span>
            <button
              type="button"
              onClick={async () => {
                await db.auth.signOut();
                setUser(null);
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        {db.mode === "demo" && (
          <p className="admin-notice">Modo demonstração: dados só neste navegador. O banco de dados ainda não está ligado.</p>
        )}
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}

        {creatingNew ? (
          <>
            <h2 className="admin-title">Novo cliente</h2>
            <ClientForm
              initial={{}}
              onSave={(c) =>
                runActionAndReload(async () => {
                  const saved = await db.clients.save(c);
                  setCreatingNew(false);
                  setTab("clients");
                  setClientId(saved.id);
                })
              }
              onCancel={() => setCreatingNew(false)}
            />
          </>
        ) : client ? (
          <ClientDetail
            client={client}
            services={services}
            goBack={() => setClientId(null)}
            saveClient={(c) => runActionAndReload(() => db.clients.save(c))}
            deleteClient={(id) =>
              runActionAndReload(async () => {
                await db.clients.remove(id);
                setClientId(null);
              })
            }
            saveService={(s) => runActionAndReload(() => db.services.save(s))}
            deleteService={(id) => runActionAndReload(() => db.services.remove(id))}
          />
        ) : tab === "dashboard" ? (
          <Dashboard
            clients={clients}
            services={services}
            openClient={(id) => {
              setTab("clients");
              setClientId(id);
            }}
            markHandled={(s) => runActionAndReload(() => db.services.save({ ...s, encerrado: true }))}
          />
        ) : tab === "reminders" ? (
          <SiteReminders
            list={reminders}
            setHandled={(r, v) => runActionAndReload(() => db.reminders.save({ ...r, tratado: v }))}
            remove={(id) => runActionAndReload(() => db.reminders.remove(id))}
            convert={(r) =>
              runActionAndReload(async () => {
                const created = await db.clients.save({
                  ...emptyClient,
                  nome: r.nome,
                  whatsapp: r.whatsapp,
                  origem: "Site (lembrete de vencimento)",
                  aceita_lembretes: true,
                  aceite_lembretes_em: String(r.consentimento_em).slice(0, 10),
                });
                if (r.vencimento) {
                  await db.services.save({
                    ...emptyService,
                    cliente_id: created.id,
                    tipo: r.documento,
                    vencimento: r.vencimento,
                    descricao: "Criado a partir do pedido de lembrete feito no site.",
                  });
                }
                await db.reminders.save({ ...r, tratado: true });
              })
            }
          />
        ) : (
          <>
            <ClientList
              clients={clients}
              services={services}
              openClient={setClientId}
              newClient={() => setCreatingNew(true)}
            />
            <div className="admin-actions admin-backup">
              <button className="btn btn-sec" type="button" onClick={() => downloadCSV("clientes.csv", clients)}>
                Baixar clientes (CSV)
              </button>
              <button className="btn btn-sec" type="button" onClick={() => downloadCSV("servicos.csv", services)}>
                Baixar serviços (CSV)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
