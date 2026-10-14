import { useCallback, useEffect, useMemo, useState } from "react";
import { abrirBanco } from "./db";

const TIPOS_SERVICO = [
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

const clienteVazio = {
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

const servicoVazio = {
  tipo: TIPOS_SERVICO[0],
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

const hojeISO = () => {
  const d = new Date();
  const dois = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
};

function somarMeses(iso, meses) {
  if (!iso || !meses) return "";
  const [a, m, d] = iso.split("-").map(Number);
  const alvo = new Date(Date.UTC(a, m - 1 + Number(meses), 1));
  const ultimo = new Date(Date.UTC(alvo.getUTCFullYear(), alvo.getUTCMonth() + 1, 0)).getUTCDate();
  alvo.setUTCDate(Math.min(d, ultimo));
  return alvo.toISOString().slice(0, 10);
}

function diasAte(iso) {
  if (!iso) return null;
  const [a, m, d] = iso.split("-").map(Number);
  const alvo = Date.UTC(a, m - 1, d);
  const [ha, hm, hd] = hojeISO().split("-").map(Number);
  return Math.round((alvo - Date.UTC(ha, hm - 1, hd)) / 86400000);
}

const dataBR = (iso) => (iso ? iso.split("-").reverse().join("/") : "—");

function linkZap(numero, texto) {
  let n = String(numero || "").replace(/\D/g, "");
  if (!n) return "";
  if (n.length <= 11) n = "55" + n;
  return `https://wa.me/${n}?text=${encodeURIComponent(texto)}`;
}

function baixarCSV(nome, linhas) {
  if (!linhas.length) return;
  const colunas = Object.keys(linhas[0]);
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [colunas.join(";"), ...linhas.map((l) => colunas.map((c) => esc(l[c])).join(";"))].join("\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
}

function Campo({ rotulo, children }) {
  return (
    <label className="adm-campo">
      <span>{rotulo}</span>
      {children}
    </label>
  );
}

function Login({ banco, aoEntrar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      aoEntrar(await banco.auth.entrar(email.trim(), senha));
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="adm-login">
      <form className="formulario" onSubmit={enviar}>
        <h1>Área interna da RD</h1>
        {banco.modo === "demo" && (
          <p className="adm-aviso">
            Modo demonstração: o banco de dados ainda não está ligado. Os dados ficam só neste navegador.
          </p>
        )}
        <Campo rotulo="E-mail">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </Campo>
        <Campo rotulo="Senha">
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            required
          />
        </Campo>
        {erro && (
          <p className="adm-erro" role="alert">
            {erro}
          </p>
        )}
        <button className="btn btn-zap btn-grande" type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

function Painel({ clientes, servicos, abrirCliente, marcarTratado }) {
  const [janela, setJanela] = useState(90);
  const porId = useMemo(() => Object.fromEntries(clientes.map((c) => [c.id, c])), [clientes]);

  const pendentes = servicos
    .filter((s) => s.vencimento && !s.encerrado)
    .map((s) => ({ ...s, dias: diasAte(s.vencimento) }))
    .sort((a, b) => a.dias - b.dias);
  const vencidos = pendentes.filter((s) => s.dias < 0);
  const proximos = pendentes.filter((s) => s.dias >= 0 && s.dias <= janela);

  const Linha = ({ s }) => {
    const cli = porId[s.cliente_id];
    if (!cli) return null;
    const msg = cli.aceita_lembretes
      ? `Olá, ${cli.nome}! Aqui é da RD Engenharia. O serviço "${s.tipo}" ${
          s.dias < 0 ? "venceu" : "vence"
        } em ${dataBR(s.vencimento)}. Podemos cuidar da renovação para você?`
      : `Olá, ${cli.nome}! Aqui é da RD Engenharia. Podemos avisar você por WhatsApp quando seus serviços estiverem perto do vencimento, para você não perder o prazo? Se preferir não receber, é só nos dizer.`;
    const zap = linkZap(cli.whatsapp || cli.telefone, msg);
    return (
      <li className="adm-linha">
        <div>
          <strong>{cli.nome}</strong>
          <span>{s.tipo}</span>
          {!cli.aceita_lembretes && <small>Sem aceite de lembretes registrado. O botão pede a autorização.</small>}
          <small className={s.dias < 0 ? "adm-atraso" : ""}>
            {s.dias < 0 ? `Venceu há ${-s.dias} dia(s)` : s.dias === 0 ? "Vence hoje" : `Vence em ${s.dias} dia(s)`} ·{" "}
            {dataBR(s.vencimento)}
          </small>
        </div>
        <div className="adm-acoes">
          {zap ? (
            <a className="btn btn-zap" href={zap} target="_blank" rel="noopener noreferrer">
              {cli.aceita_lembretes ? "Chamar no WhatsApp" : "Pedir autorização"}
            </a>
          ) : (
            <span className="adm-sem">Sem telefone</span>
          )}
          <button className="btn btn-sec" type="button" onClick={() => abrirCliente(cli.id)}>
            Abrir cliente
          </button>
          <button className="btn btn-sec" type="button" onClick={() => marcarTratado(s)}>
            Marcar como tratado
          </button>
        </div>
      </li>
    );
  };

  return (
    <>
      <div className="adm-resumo">
        <div>
          <strong>{vencidos.length}</strong>
          <span>vencidos</span>
        </div>
        <div>
          <strong>{proximos.length}</strong>
          <span>vencem nos próximos {janela} dias</span>
        </div>
        <div>
          <strong>{clientes.length}</strong>
          <span>clientes</span>
        </div>
        <div>
          <strong>{servicos.length}</strong>
          <span>serviços registrados</span>
        </div>
      </div>

      <h2 className="adm-titulo">Vencidos</h2>
      {vencidos.length ? (
        <ul className="adm-lista">
          {vencidos.map((s) => (
            <Linha key={s.id} s={s} />
          ))}
        </ul>
      ) : (
        <p className="adm-vazio">Nenhum serviço vencido.</p>
      )}

      <div className="adm-titulo-linha">
        <h2 className="adm-titulo">Próximos vencimentos</h2>
        <label>
          Janela
          <select value={janela} onChange={(e) => setJanela(Number(e.target.value))}>
            {[30, 60, 90, 180, 365].map((d) => (
              <option key={d} value={d}>
                {d} dias
              </option>
            ))}
          </select>
        </label>
      </div>
      {proximos.length ? (
        <ul className="adm-lista">
          {proximos.map((s) => (
            <Linha key={s.id} s={s} />
          ))}
        </ul>
      ) : (
        <p className="adm-vazio">
          Nada vencendo nesse período. Ao registrar um serviço, informe de quantos em quantos meses ele se repete
          para aparecer aqui.
        </p>
      )}
    </>
  );
}

function FormCliente({ inicial, aoSalvar, aoCancelar }) {
  const [c, setC] = useState({ ...clienteVazio, ...inicial });
  const mudar = (campo) => (e) => setC((x) => ({ ...x, [campo]: e.target.value }));
  return (
    <form
      className="adm-form"
      onSubmit={(e) => {
        e.preventDefault();
        aoSalvar(c);
      }}
    >
      <div className="adm-grade">
        <Campo rotulo="Nome ou razão social">
          <input value={c.nome} onChange={mudar("nome")} required />
        </Campo>
        <Campo rotulo="Tipo">
          <select value={c.tipo} onChange={mudar("tipo")}>
            <option value="pf">Pessoa física</option>
            <option value="pj">Empresa</option>
          </select>
        </Campo>
        <Campo rotulo="CPF ou CNPJ">
          <input value={c.documento || ""} onChange={mudar("documento")} />
        </Campo>
        <Campo rotulo="Pessoa de contato">
          <input value={c.contato || ""} onChange={mudar("contato")} />
        </Campo>
        <Campo rotulo="WhatsApp">
          <input value={c.whatsapp || ""} onChange={mudar("whatsapp")} inputMode="tel" placeholder="(17) 99999-9999" />
        </Campo>
        <Campo rotulo="Outro telefone">
          <input value={c.telefone || ""} onChange={mudar("telefone")} inputMode="tel" />
        </Campo>
        <Campo rotulo="E-mail">
          <input type="email" value={c.email || ""} onChange={mudar("email")} />
        </Campo>
        <Campo rotulo="CEP">
          <input value={c.cep || ""} onChange={mudar("cep")} inputMode="numeric" />
        </Campo>
        <Campo rotulo="Rua">
          <input value={c.logradouro || ""} onChange={mudar("logradouro")} />
        </Campo>
        <Campo rotulo="Número">
          <input value={c.numero || ""} onChange={mudar("numero")} />
        </Campo>
        <Campo rotulo="Bairro">
          <input value={c.bairro || ""} onChange={mudar("bairro")} />
        </Campo>
        <Campo rotulo="Cidade">
          <input value={c.cidade || ""} onChange={mudar("cidade")} />
        </Campo>
        <Campo rotulo="Como chegou até nós">
          <input value={c.origem || ""} onChange={mudar("origem")} placeholder="Indicação, Instagram, site..." />
        </Campo>
      </div>
      <label className="adm-aceite">
        <input
          type="checkbox"
          checked={!!c.aceita_lembretes}
          onChange={(e) =>
            setC((x) => ({
              ...x,
              aceita_lembretes: e.target.checked,
              aceite_lembretes_em: e.target.checked ? x.aceite_lembretes_em || hojeISO() : "",
            }))
          }
        />
        <span>
          O cliente aceitou receber lembretes de vencimento por WhatsApp
          {c.aceita_lembretes && c.aceite_lembretes_em ? ` (aceite em ${dataBR(c.aceite_lembretes_em)})` : ""}
        </span>
      </label>
      <Campo rotulo="Observações">
        <textarea rows="3" value={c.observacoes || ""} onChange={mudar("observacoes")} />
      </Campo>
      <div className="adm-acoes">
        <button className="btn btn-zap" type="submit">
          Salvar cliente
        </button>
        <button className="btn btn-sec" type="button" onClick={aoCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

function FormServico({ inicial, aoSalvar, aoCancelar }) {
  const [s, setS] = useState({ ...servicoVazio, ...inicial });
  const mudar = (campo) => (e) => setS((x) => ({ ...x, [campo]: e.target.value }));
  const sugestao = somarMeses(s.data_realizacao, s.repetir_meses);
  return (
    <form
      className="adm-form"
      onSubmit={(e) => {
        e.preventDefault();
        aoSalvar({ ...s, vencimento: s.vencimento || sugestao || "" });
      }}
    >
      <div className="adm-grade">
        <Campo rotulo="Serviço">
          <select value={s.tipo} onChange={mudar("tipo")}>
            {TIPOS_SERVICO.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Campo>
        <Campo rotulo="Situação">
          <select value={s.status} onChange={mudar("status")}>
            {Object.entries(STATUS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Campo>
        <Campo rotulo="Data de realização">
          <input type="date" value={s.data_realizacao || ""} onChange={mudar("data_realizacao")} />
        </Campo>
        <Campo rotulo="Repetir a cada (meses)">
          <input
            type="number"
            min="1"
            value={s.repetir_meses || ""}
            onChange={mudar("repetir_meses")}
            placeholder="Ex.: 36"
          />
        </Campo>
        <Campo rotulo={`Vencimento${sugestao && !s.vencimento ? ` (será ${dataBR(sugestao)})` : ""}`}>
          <input type="date" value={s.vencimento || ""} onChange={mudar("vencimento")} />
        </Campo>
        <Campo rotulo="Número da ART">
          <input value={s.art_numero || ""} onChange={mudar("art_numero")} />
        </Campo>
        <Campo rotulo="Valor (R$)">
          <input type="number" step="0.01" min="0" value={s.valor || ""} onChange={mudar("valor")} />
        </Campo>
        <Campo rotulo="Local do serviço">
          <input value={s.local_servico || ""} onChange={mudar("local_servico")} placeholder="Endereço ou nome da propriedade" />
        </Campo>
      </div>
      <Campo rotulo="Descrição">
        <textarea rows="2" value={s.descricao || ""} onChange={mudar("descricao")} />
      </Campo>
      <Campo rotulo="Observações">
        <textarea rows="2" value={s.observacoes || ""} onChange={mudar("observacoes")} />
      </Campo>
      <div className="adm-acoes">
        <button className="btn btn-zap" type="submit">
          Salvar serviço
        </button>
        <button className="btn btn-sec" type="button" onClick={aoCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Clientes({ clientes, servicos, abrirCliente, novoCliente }) {
  const [busca, setBusca] = useState("");
  const termo = busca.trim().toLowerCase();
  const lista = clientes.filter((c) =>
    [c.nome, c.documento, c.cidade, c.whatsapp, c.telefone, c.email].some((v) => String(v || "").toLowerCase().includes(termo))
  );
  const contar = (id) => servicos.filter((s) => s.cliente_id === id).length;

  return (
    <>
      <div className="adm-barra">
        <input
          type="search"
          placeholder="Buscar por nome, CPF/CNPJ, cidade ou telefone"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar clientes"
        />
        <button className="btn btn-zap" type="button" onClick={novoCliente}>
          Novo cliente
        </button>
      </div>
      {lista.length ? (
        <ul className="adm-lista">
          {lista.map((c) => (
            <li className="adm-linha" key={c.id}>
              <div>
                <strong>{c.nome}</strong>
                <span>{[c.cidade, c.whatsapp || c.telefone].filter(Boolean).join(" · ") || "Sem dados de contato"}</span>
                <small>{contar(c.id)} serviço(s)</small>
              </div>
              <div className="adm-acoes">
                <button className="btn btn-sec" type="button" onClick={() => abrirCliente(c.id)}>
                  Abrir
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="adm-vazio">{clientes.length ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado ainda."}</p>
      )}
    </>
  );
}

function DetalheCliente({ cliente, servicos, salvarCliente, excluirCliente, salvarServico, excluirServico, voltar }) {
  const [editando, setEditando] = useState(false);
  const [servicoEmEdicao, setServicoEmEdicao] = useState(null);
  const meus = servicos.filter((s) => s.cliente_id === cliente.id);
  const endereco = [
    [cliente.logradouro, cliente.numero].filter(Boolean).join(", "),
    cliente.bairro,
    [cliente.cidade, cliente.uf].filter(Boolean).join("/"),
    cliente.cep,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <button className="btn btn-sec" type="button" onClick={voltar}>
        Voltar
      </button>

      {editando ? (
        <FormCliente
          inicial={cliente}
          aoSalvar={async (c) => {
            await salvarCliente(c);
            setEditando(false);
          }}
          aoCancelar={() => setEditando(false)}
        />
      ) : (
        <section className="adm-ficha">
          <h2>{cliente.nome}</h2>
          <dl>
            <div>
              <dt>Tipo</dt>
              <dd>
                {cliente.tipo === "pj" ? "Empresa" : "Pessoa física"}
                {cliente.documento ? ` · ${cliente.documento}` : ""}
              </dd>
            </div>
            <div>
              <dt>Contato</dt>
              <dd>
                {[cliente.contato, cliente.whatsapp, cliente.telefone, cliente.email].filter(Boolean).join(" · ") || "—"}
              </dd>
            </div>
            <div>
              <dt>Endereço</dt>
              <dd>{endereco || "—"}</dd>
            </div>
            <div>
              <dt>Lembretes por WhatsApp</dt>
              <dd>
                {cliente.aceita_lembretes
                  ? `Aceitou${cliente.aceite_lembretes_em ? ` em ${dataBR(cliente.aceite_lembretes_em)}` : ""}`
                  : "Sem aceite registrado"}
              </dd>
            </div>
            {cliente.origem && (
              <div>
                <dt>Como chegou</dt>
                <dd>{cliente.origem}</dd>
              </div>
            )}
            {cliente.observacoes && (
              <div>
                <dt>Observações</dt>
                <dd>{cliente.observacoes}</dd>
              </div>
            )}
          </dl>
          <div className="adm-acoes">
            {linkZap(cliente.whatsapp || cliente.telefone, `Olá, ${cliente.nome}! Aqui é da RD Engenharia.`) && (
              <a
                className="btn btn-zap"
                href={linkZap(cliente.whatsapp || cliente.telefone, `Olá, ${cliente.nome}! Aqui é da RD Engenharia.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            )}
            <button className="btn btn-sec" type="button" onClick={() => setEditando(true)}>
              Editar
            </button>
            <button
              className="btn btn-sec"
              type="button"
              onClick={() => {
                if (window.confirm(`Excluir ${cliente.nome} e todos os serviços dele? Isso não pode ser desfeito.`))
                  excluirCliente(cliente.id);
              }}
            >
              Excluir
            </button>
          </div>
        </section>
      )}

      <div className="adm-titulo-linha">
        <h2 className="adm-titulo">Serviços</h2>
        {!servicoEmEdicao && (
          <button className="btn btn-zap" type="button" onClick={() => setServicoEmEdicao({ data_realizacao: hojeISO() })}>
            Registrar serviço
          </button>
        )}
      </div>

      {servicoEmEdicao && (
        <FormServico
          inicial={servicoEmEdicao}
          aoSalvar={async (s) => {
            await salvarServico({ ...s, cliente_id: cliente.id });
            setServicoEmEdicao(null);
          }}
          aoCancelar={() => setServicoEmEdicao(null)}
        />
      )}

      {meus.length ? (
        <ul className="adm-lista">
          {meus.map((s) => {
            const dias = diasAte(s.vencimento);
            return (
              <li className="adm-linha" key={s.id}>
                <div>
                  <strong>{s.tipo}</strong>
                  <span>
                    {STATUS[s.status]} · {dataBR(s.data_realizacao)}
                    {s.art_numero ? ` · ART ${s.art_numero}` : ""}
                    {s.valor ? ` · R$ ${Number(s.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : ""}
                  </span>
                  {s.local_servico && <span>{s.local_servico}</span>}
                  {s.descricao && <span>{s.descricao}</span>}
                  {s.vencimento && (
                    <small className={dias < 0 && !s.encerrado ? "adm-atraso" : ""}>
                      Vencimento: {dataBR(s.vencimento)}
                      {s.encerrado ? " · tratado" : dias < 0 ? " · vencido" : ` · em ${dias} dia(s)`}
                    </small>
                  )}
                </div>
                <div className="adm-acoes">
                  <button className="btn btn-sec" type="button" onClick={() => setServicoEmEdicao(s)}>
                    Editar
                  </button>
                  <button
                    className="btn btn-sec"
                    type="button"
                    onClick={() => {
                      if (window.confirm("Excluir este serviço?")) excluirServico(s.id);
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
        <p className="adm-vazio">Nenhum serviço registrado para este cliente.</p>
      )}
    </>
  );
}

const STATUS_PROC = {
  recebido: "Recebido",
  em_andamento: "Em andamento",
  protocolado: "Protocolado",
  aguardando_orgao: "Aguardando o órgão",
  concluido: "Concluído",
};

// 32 símbolos (sem I, O, 0 e 1) para o código não gerar confusão ao ser ditado ou digitado.
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const gerarCodigo = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(8)), (n) => ALFABETO[n % 32]).join("");

const mesAno = (iso) => (iso ? iso.slice(0, 7).split("-").reverse().join("/") : "sem data");

function LembretesSite({ lista, tratar, converter, excluir }) {
  const pendentes = lista.filter((l) => !l.tratado);
  const tratados = lista.filter((l) => l.tratado);
  const Linha = ({ l }) => {
    const msg = `Olá, ${l.nome}! Aqui é da RD Engenharia. Recebemos o seu pedido de lembrete sobre: ${l.documento}. Vamos avisar você antes do vencimento. Pode nos confirmar a data exata do vencimento?`;
    return (
      <li className="adm-linha">
        <div>
          <strong>{l.nome}</strong>
          <span>{l.documento}</span>
          <small>
            Vencimento: {mesAno(l.vencimento)} · Autorizou em {dataBR(String(l.consentimento_em).slice(0, 10))}
          </small>
        </div>
        <div className="adm-acoes">
          <a className="btn btn-zap" href={linkZap(l.whatsapp, msg)} target="_blank" rel="noopener noreferrer">
            Chamar no WhatsApp
          </a>
          {!l.tratado && (
            <button className="btn btn-sec" type="button" onClick={() => converter(l)}>
              Cadastrar como cliente
            </button>
          )}
          <button className="btn btn-sec" type="button" onClick={() => tratar(l, !l.tratado)}>
            {l.tratado ? "Reabrir" : "Marcar como tratado"}
          </button>
          <button
            className="btn btn-sec"
            type="button"
            onClick={() => window.confirm(`Excluir o pedido de ${l.nome}?`) && excluir(l.id)}
          >
            Excluir
          </button>
        </div>
      </li>
    );
  };
  return (
    <>
      <h2 className="adm-titulo">Pedidos de lembrete feitos no site</h2>
      {pendentes.length ? (
        <ul className="adm-lista">
          {pendentes.map((l) => (
            <Linha key={l.id} l={l} />
          ))}
        </ul>
      ) : (
        <p className="adm-vazio">Nenhum pedido novo.</p>
      )}
      {tratados.length > 0 && (
        <>
          <h2 className="adm-titulo">Já tratados</h2>
          <ul className="adm-lista">
            {tratados.map((l) => (
              <Linha key={l.id} l={l} />
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function Processos({ lista, clientes, criar, atualizar, excluir }) {
  const [novo, setNovo] = useState({ servico_tipo: TIPOS_SERVICO[0], cliente_id: "", mensagem: "" });
  const [rascunho, setRascunho] = useState({});
  const porId = useMemo(() => Object.fromEntries(clientes.map((c) => [c.id, c])), [clientes]);
  return (
    <>
      <h2 className="adm-titulo">Acompanhamento de processos</h2>
      <p className="adm-vazio">
        Cada processo recebe um código. O cliente digita o código em /acompanhe e vê só o serviço, a etapa e a
        mensagem abaixo. Não escreva dados pessoais na mensagem.
      </p>
      <form
        className="adm-form"
        onSubmit={(e) => {
          e.preventDefault();
          criar({ ...novo, cliente_id: novo.cliente_id || null, codigo: gerarCodigo(), status: "recebido" });
          setNovo({ servico_tipo: TIPOS_SERVICO[0], cliente_id: "", mensagem: "" });
        }}
      >
        <div className="adm-grade">
          <Campo rotulo="Serviço">
            <select value={novo.servico_tipo} onChange={(e) => setNovo({ ...novo, servico_tipo: e.target.value })}>
              {TIPOS_SERVICO.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Campo>
          <Campo rotulo="Cliente (opcional)">
            <select value={novo.cliente_id} onChange={(e) => setNovo({ ...novo, cliente_id: e.target.value })}>
              <option value="">—</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </Campo>
        </div>
        <Campo rotulo="Mensagem para o cliente (opcional, até 400 caracteres)">
          <input
            maxLength={400}
            value={novo.mensagem}
            onChange={(e) => setNovo({ ...novo, mensagem: e.target.value })}
            placeholder="Ex.: Recebemos os documentos e vamos iniciar o levantamento."
          />
        </Campo>
        <div className="adm-acoes">
          <button className="btn btn-zap" type="submit">
            Criar processo e gerar código
          </button>
        </div>
      </form>

      {lista.length ? (
        <ul className="adm-lista">
          {lista.map((p) => {
            const cli = porId[p.cliente_id];
            const texto = `Olá${cli ? ", " + cli.nome : ""}! Aqui é da RD Engenharia. Você pode acompanhar o seu processo (${p.servico_tipo}) em https://rdibiraengenharia.com.br/acompanhe com o código ${p.codigo}.`;
            const zap = cli ? linkZap(cli.whatsapp || cli.telefone, texto) : "";
            const msg = rascunho[p.id] ?? p.mensagem ?? "";
            return (
              <li className="adm-linha" key={p.id}>
                <div>
                  <strong>
                    <code>{p.codigo}</code> · {p.servico_tipo}
                  </strong>
                  <span>{cli ? cli.nome : "Sem cliente vinculado"}</span>
                  <small>Atualizado em {dataBR(String(p.atualizado_em || p.criado_em || "").slice(0, 10))}</small>
                  <label className="adm-campo">
                    <span>Etapa</span>
                    <select value={p.status} onChange={(e) => atualizar({ ...p, status: e.target.value })}>
                      {Object.entries(STATUS_PROC).map(([id, nome]) => (
                        <option key={id} value={id}>
                          {nome}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="adm-campo">
                    <span>Mensagem para o cliente</span>
                    <input
                      maxLength={400}
                      value={msg}
                      onChange={(e) => setRascunho({ ...rascunho, [p.id]: e.target.value })}
                    />
                  </label>
                </div>
                <div className="adm-acoes">
                  {msg !== (p.mensagem ?? "") && (
                    <button
                      className="btn btn-sec"
                      type="button"
                      onClick={() => {
                        atualizar({ ...p, mensagem: msg });
                        setRascunho({ ...rascunho, [p.id]: undefined });
                      }}
                    >
                      Salvar mensagem
                    </button>
                  )}
                  {zap ? (
                    <a className="btn btn-zap" href={zap} target="_blank" rel="noopener noreferrer">
                      Enviar código pelo WhatsApp
                    </a>
                  ) : (
                    <button
                      className="btn btn-sec"
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(texto)}
                    >
                      Copiar mensagem com o código
                    </button>
                  )}
                  <button
                    className="btn btn-sec"
                    type="button"
                    onClick={() => window.confirm(`Excluir o processo ${p.codigo}?`) && excluir(p.id)}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="adm-vazio">Nenhum processo criado ainda.</p>
      )}
    </>
  );
}

export default function Admin() {
  const [banco, setBanco] = useState(null);
  const [usuario, setUsuario] = useState(undefined);
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [lembretes, setLembretes] = useState([]);
  const [processos, setProcessos] = useState([]);
  const [aba, setAba] = useState("painel");
  const [clienteId, setClienteId] = useState(null);
  const [novo, setNovo] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    abrirBanco().then(async (b) => {
      setBanco(b);
      setUsuario(b.modo === "indisponivel" ? null : await b.auth.sessao());
    });
  }, []);

  const carregar = useCallback(async () => {
    if (!banco) return;
    try {
      const [c, s, l, p] = await Promise.all([
        banco.clientes.listar(),
        banco.servicos.listar(),
        banco.lembretes.listar(),
        banco.processos.listar(),
      ]);
      setClientes(c);
      setServicos(s);
      setLembretes(l);
      setProcessos(p);
      setErro("");
    } catch (e) {
      setErro(e.message);
    }
  }, [banco]);

  useEffect(() => {
    if (usuario) carregar();
  }, [usuario, carregar]);

  const executar = async (fn) => {
    try {
      await fn();
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  };

  const cliente = clientes.find((c) => c.id === clienteId);

  if (!banco || usuario === undefined) return <p className="adm-vazio">Carregando...</p>;
  if (banco.modo === "indisponivel")
    return (
      <div className="adm-login">
        <div className="formulario">
          <h1>Área interna da RD</h1>
          <p>O banco de dados ainda não foi ligado a este site. Assim que for ligado, o acesso será liberado aqui.</p>
        </div>
      </div>
    );
  if (!usuario) return <Login banco={banco} aoEntrar={setUsuario} />;

  const irPara = (nome) => {
    setAba(nome);
    setClienteId(null);
    setNovo(false);
  };

  return (
    <div className="adm">
      <header className="adm-topo">
        <div className="adm-topo-in">
          <strong>RD Engenharia · Área interna</strong>
          <nav aria-label="Seções">
            <button type="button" aria-pressed={aba === "painel"} onClick={() => irPara("painel")}>
              Vencimentos
            </button>
            <button type="button" aria-pressed={aba === "clientes"} onClick={() => irPara("clientes")}>
              Clientes
            </button>
            <button type="button" aria-pressed={aba === "lembretes"} onClick={() => irPara("lembretes")}>
              Pedidos do site{lembretes.filter((l) => !l.tratado).length ? ` (${lembretes.filter((l) => !l.tratado).length})` : ""}
            </button>
            <button type="button" aria-pressed={aba === "processos"} onClick={() => irPara("processos")}>
              Processos
            </button>
          </nav>
          <div className="adm-usuario">
            <span>{usuario.email}</span>
            <button
              type="button"
              onClick={async () => {
                await banco.auth.sair();
                setUsuario(null);
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="adm-conteudo">
        {banco.modo === "demo" && (
          <p className="adm-aviso">Modo demonstração: dados só neste navegador. O banco de dados ainda não está ligado.</p>
        )}
        {erro && (
          <p className="adm-erro" role="alert">
            {erro}
          </p>
        )}

        {novo ? (
          <>
            <h2 className="adm-titulo">Novo cliente</h2>
            <FormCliente
              inicial={{}}
              aoSalvar={(c) =>
                executar(async () => {
                  const salvo = await banco.clientes.salvar(c);
                  setNovo(false);
                  setAba("clientes");
                  setClienteId(salvo.id);
                })
              }
              aoCancelar={() => setNovo(false)}
            />
          </>
        ) : cliente ? (
          <DetalheCliente
            cliente={cliente}
            servicos={servicos}
            voltar={() => setClienteId(null)}
            salvarCliente={(c) => executar(() => banco.clientes.salvar(c))}
            excluirCliente={(id) =>
              executar(async () => {
                await banco.clientes.excluir(id);
                setClienteId(null);
              })
            }
            salvarServico={(s) => executar(() => banco.servicos.salvar(s))}
            excluirServico={(id) => executar(() => banco.servicos.excluir(id))}
          />
        ) : aba === "painel" ? (
          <Painel
            clientes={clientes}
            servicos={servicos}
            abrirCliente={(id) => {
              setAba("clientes");
              setClienteId(id);
            }}
            marcarTratado={(s) => executar(() => banco.servicos.salvar({ ...s, encerrado: true }))}
          />
        ) : aba === "lembretes" ? (
          <LembretesSite
            lista={lembretes}
            tratar={(l, v) => executar(() => banco.lembretes.salvar({ ...l, tratado: v }))}
            excluir={(id) => executar(() => banco.lembretes.excluir(id))}
            converter={(l) =>
              executar(async () => {
                const cli = await banco.clientes.salvar({
                  ...clienteVazio,
                  nome: l.nome,
                  whatsapp: l.whatsapp,
                  origem: "Site (lembrete de vencimento)",
                  aceita_lembretes: true,
                  aceite_lembretes_em: String(l.consentimento_em).slice(0, 10),
                });
                if (l.vencimento) {
                  await banco.servicos.salvar({
                    ...servicoVazio,
                    cliente_id: cli.id,
                    tipo: l.documento,
                    vencimento: l.vencimento,
                    descricao: "Criado a partir do pedido de lembrete feito no site.",
                  });
                }
                await banco.lembretes.salvar({ ...l, tratado: true });
              })
            }
          />
        ) : aba === "processos" ? (
          <Processos
            lista={processos}
            clientes={clientes}
            criar={(p) => executar(() => banco.processos.salvar(p))}
            atualizar={(p) => executar(() => banco.processos.salvar(p))}
            excluir={(id) => executar(() => banco.processos.excluir(id))}
          />
        ) : (
          <>
            <Clientes
              clientes={clientes}
              servicos={servicos}
              abrirCliente={setClienteId}
              novoCliente={() => setNovo(true)}
            />
            <div className="adm-acoes adm-backup">
              <button className="btn btn-sec" type="button" onClick={() => baixarCSV("clientes.csv", clientes)}>
                Baixar clientes (CSV)
              </button>
              <button className="btn btn-sec" type="button" onClick={() => baixarCSV("servicos.csv", servicos)}>
                Baixar serviços (CSV)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
