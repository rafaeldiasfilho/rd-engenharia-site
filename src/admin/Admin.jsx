import { useCallback, useEffect, useMemo, useState } from "react";
import { openDatabase } from "./db";

const SERVICE_TYPES = [
  "PGR (gerenciamento de riscos)",
  "PCMSO (integração com o programa médico)",
  "LTCAT e PPP",
  "Laudo de insalubridade",
  "Laudo de periculosidade",
  "APR, mapa de risco ou AET",
  "Treinamento de NR",
  "AVCB",
  "CLCB",
  "Projeto de segurança contra incêndio",
  "Projeto arquitetônico ou estrutural",
  "Regularização de obra e habite-se",
  "Laudo, vistoria ou perícia",
  "Inspeção predial",
  "Gerenciamento ou planejamento de obra",
  "CAR",
  "Georreferenciamento",
  "Topografia",
  "Licenciamento ambiental",
  "Outorga de uso da água",
  "PGRS ou PGRSS",
  "Outro",
];

const STATUS = { orcamento: "Orçamento", em_andamento: "Em andamento", concluido: "Concluído" };

const emptyClient = {
  nome: "",
  tipo: "pf",
  documento: "",
  contato: "",
  telefone: "",
  whatsapp: "",
  email: "",
  cep: "",
  logradouro: "",
  numero: "",
  bairro: "",
  cidade: "",
  uf: "SP",
  origem: "",
  observacoes: "",
  aceita_lembretes: false,
  aceite_lembretes_em: "",
};

const emptyService = {
  tipo: SERVICE_TYPES[0],
  descricao: "",
  local_servico: "",
  status: "concluido",
  data_realizacao: "",
  repetir_meses: "",
  vencimento: "",
  art_numero: "",
  valor: "",
  observacoes: "",
};

const todayISO = () => {
  const d = new Date();
  const pad2 = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

function addMonths(iso, months) {
  if (!iso || !months) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(Date.UTC(y, m - 1 + Number(months), 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d, lastDay));
  return target.toISOString().slice(0, 10);
}

function daysUntil(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const target = Date.UTC(y, m - 1, d);
  const [ty, tm, td] = todayISO().split("-").map(Number);
  return Math.round((target - Date.UTC(ty, tm - 1, td)) / 86400000);
}

const formatDateBR = (iso) => (iso ? iso.split("-").reverse().join("/") : "—");

function whatsappLink(number, text) {
  let n = String(number || "").replace(/\D/g, "");
  if (!n) return "";
  if (n.length <= 11) n = "55" + n;
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

function downloadCSV(fileName, rows) {
  if (!rows.length) return;
  const columns = Object.keys(rows[0]);
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [columns.join(";"), ...rows.map((row) => columns.map((col) => esc(row[col])).join(";"))].join("\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

function Field({ label, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Login({ db, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      onLogin(await db.auth.signIn(email.trim(), password));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Área interna da RD</h1>
        {db.mode === "demo" && (
          <p className="admin-notice">
            Modo demonstração: o banco de dados ainda não está ligado. Os dados ficam só neste navegador.
          </p>
        )}
        <Field label="E-mail">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </Field>
        <Field label="Senha">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </Field>
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-whatsapp btn-large" type="submit" disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ clients, services, openClient, markHandled }) {
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

function ClientForm({ initial, onSave, onCancel }) {
  const [c, setC] = useState({ ...emptyClient, ...initial });
  const update = (field) => (e) => setC((x) => ({ ...x, [field]: e.target.value }));
  return (
    <form
      className="admin-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(c);
      }}
    >
      <div className="admin-grid">
        <Field label="Nome ou razão social">
          <input value={c.nome} onChange={update("nome")} required />
        </Field>
        <Field label="Tipo">
          <select value={c.tipo} onChange={update("tipo")}>
            <option value="pf">Pessoa física</option>
            <option value="pj">Empresa</option>
          </select>
        </Field>
        <Field label="CPF ou CNPJ">
          <input value={c.documento || ""} onChange={update("documento")} />
        </Field>
        <Field label="Pessoa de contato">
          <input value={c.contato || ""} onChange={update("contato")} />
        </Field>
        <Field label="WhatsApp">
          <input value={c.whatsapp || ""} onChange={update("whatsapp")} inputMode="tel" placeholder="(17) 99999-9999" />
        </Field>
        <Field label="Outro telefone">
          <input value={c.telefone || ""} onChange={update("telefone")} inputMode="tel" />
        </Field>
        <Field label="E-mail">
          <input type="email" value={c.email || ""} onChange={update("email")} />
        </Field>
        <Field label="CEP">
          <input value={c.cep || ""} onChange={update("cep")} inputMode="numeric" />
        </Field>
        <Field label="Rua">
          <input value={c.logradouro || ""} onChange={update("logradouro")} />
        </Field>
        <Field label="Número">
          <input value={c.numero || ""} onChange={update("numero")} />
        </Field>
        <Field label="Bairro">
          <input value={c.bairro || ""} onChange={update("bairro")} />
        </Field>
        <Field label="Cidade">
          <input value={c.cidade || ""} onChange={update("cidade")} />
        </Field>
        <Field label="Como chegou até nós">
          <input value={c.origem || ""} onChange={update("origem")} placeholder="Indicação, Instagram, site..." />
        </Field>
      </div>
      <label className="admin-consent">
        <input
          type="checkbox"
          checked={!!c.aceita_lembretes}
          onChange={(e) =>
            setC((x) => ({
              ...x,
              aceita_lembretes: e.target.checked,
              aceite_lembretes_em: e.target.checked ? x.aceite_lembretes_em || todayISO() : "",
            }))
          }
        />
        <span>
          O cliente aceitou receber lembretes de vencimento por WhatsApp
          {c.aceita_lembretes && c.aceite_lembretes_em ? ` (aceite em ${formatDateBR(c.aceite_lembretes_em)})` : ""}
        </span>
      </label>
      <Field label="Observações">
        <textarea rows="3" value={c.observacoes || ""} onChange={update("observacoes")} />
      </Field>
      <div className="admin-actions">
        <button className="btn btn-whatsapp" type="submit">
          Salvar cliente
        </button>
        <button className="btn btn-sec" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

function ServiceForm({ initial, onSave, onCancel }) {
  const [s, setS] = useState({ ...emptyService, ...initial });
  const update = (field) => (e) => setS((x) => ({ ...x, [field]: e.target.value }));
  const suggestion = addMonths(s.data_realizacao, s.repetir_meses);
  return (
    <form
      className="admin-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...s, vencimento: s.vencimento || suggestion || "" });
      }}
    >
      <div className="admin-grid">
        <Field label="Serviço">
          <select value={s.tipo} onChange={update("tipo")}>
            {SERVICE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Situação">
          <select value={s.status} onChange={update("status")}>
            {Object.entries(STATUS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Data de realização">
          <input type="date" value={s.data_realizacao || ""} onChange={update("data_realizacao")} />
        </Field>
        <Field label="Repetir a cada (meses)">
          <input
            type="number"
            min="1"
            value={s.repetir_meses || ""}
            onChange={update("repetir_meses")}
            placeholder="Ex.: 36"
          />
        </Field>
        <Field label={`Vencimento${suggestion && !s.vencimento ? ` (será ${formatDateBR(suggestion)})` : ""}`}>
          <input type="date" value={s.vencimento || ""} onChange={update("vencimento")} />
        </Field>
        <Field label="Número da ART">
          <input value={s.art_numero || ""} onChange={update("art_numero")} />
        </Field>
        <Field label="Valor (R$)">
          <input type="number" step="0.01" min="0" value={s.valor || ""} onChange={update("valor")} />
        </Field>
        <Field label="Local do serviço">
          <input value={s.local_servico || ""} onChange={update("local_servico")} placeholder="Endereço ou nome da propriedade" />
        </Field>
      </div>
      <Field label="Descrição">
        <textarea rows="2" value={s.descricao || ""} onChange={update("descricao")} />
      </Field>
      <Field label="Observações">
        <textarea rows="2" value={s.observacoes || ""} onChange={update("observacoes")} />
      </Field>
      <div className="admin-actions">
        <button className="btn btn-whatsapp" type="submit">
          Salvar serviço
        </button>
        <button className="btn btn-sec" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

function ClientList({ clients, services, openClient, newClient }) {
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

function ClientDetail({ client, services, saveClient, deleteClient, saveService, deleteService, goBack }) {
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

const monthYear = (iso) => (iso ? iso.slice(0, 7).split("-").reverse().join("/") : "sem data");

function SiteReminders({ list, setHandled, convert, remove }) {
  const pending = list.filter((r) => !r.tratado);
  const handled = list.filter((r) => r.tratado);
  const Row = ({ r }) => {
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
          <a className="btn btn-whatsapp" href={whatsappLink(r.whatsapp, msg)} target="_blank" rel="noopener noreferrer">
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
            <Row key={r.id} r={r} />
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
              <Row key={r.id} r={r} />
            ))}
          </ul>
        </>
      )}
    </>
  );
}

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

  const reload = useCallback(async () => {
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
    if (user) reload();
  }, [user, reload]);

  const run = async (fn) => {
    try {
      await fn();
      await reload();
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
                run(async () => {
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
            saveClient={(c) => run(() => db.clients.save(c))}
            deleteClient={(id) =>
              run(async () => {
                await db.clients.remove(id);
                setClientId(null);
              })
            }
            saveService={(s) => run(() => db.services.save(s))}
            deleteService={(id) => run(() => db.services.remove(id))}
          />
        ) : tab === "dashboard" ? (
          <Dashboard
            clients={clients}
            services={services}
            openClient={(id) => {
              setTab("clients");
              setClientId(id);
            }}
            markHandled={(s) => run(() => db.services.save({ ...s, encerrado: true }))}
          />
        ) : tab === "reminders" ? (
          <SiteReminders
            list={reminders}
            setHandled={(r, v) => run(() => db.reminders.save({ ...r, tratado: v }))}
            remove={(id) => run(() => db.reminders.remove(id))}
            convert={(r) =>
              run(async () => {
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
