import { useEffect, useId, useRef, useState } from "react";
import Icone from "./Icone";
import { AREAS, GUIAS, PAGINAS } from "./paginas";
import { zap } from "./contato";

// Busca por documento ou serviço ("Qual documento você precisa?"), sem biblioteca.
// - O índice sai do próprio conteúdo do site (áreas, serviços de cada área, guias e páginas úteis):
//   nada a manter à parte. Ignora acentos e maiúsculas; todas as palavras digitadas precisam aparecer.
// - Padrão de combobox acessível: setas sobem e descem, Enter abre, Esc limpa. A última opção é sempre
//   perguntar no WhatsApp com o texto digitado, para nunca terminar sem saída.
// - Nada de window/document na renderização: seguro para o prerender.

export const normaliza = (t) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Âncora de cada serviço na página da área (usada também em Paginas.jsx).
export const ancora = (nome) =>
  "servico-" +
  normaliza(nome)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);

const PAGINAS_UTEIS = ["o-que-preciso", "lembrete-de-vencimento", "onde-atendemos"];

const INDICE = [
  ...AREAS.flatMap((a) =>
    a.itens.map((it) => ({
      tipo: "Serviço",
      titulo: it.nome,
      texto: a.nome,
      href: `/${a.slug}#${ancora(it.nome)}`,
      titulo_n: normaliza(it.nome),
      busca: normaliza([it.nome, it.texto, it.quem, a.nome].join(" ")),
    }))
  ),
  ...AREAS.map((a) => ({
    tipo: "Área",
    titulo: a.nome,
    texto: a.curto,
    href: `/${a.slug}`,
    titulo_n: normaliza(a.nome),
    busca: normaliza([a.nome, a.curto, a.intro, ...(a.situacoes || [])].join(" ")),
  })),
  ...GUIAS.map((g) => ({
    tipo: "Guia",
    titulo: g.h1,
    texto: "Guia em linguagem simples",
    href: `/${g.slug}`,
    titulo_n: normaliza(g.h1),
    busca: normaliza([g.h1, g.description, g.servico].join(" ")),
  })),
  ...PAGINAS.filter((p) => PAGINAS_UTEIS.includes(p.slug)).map((p) => ({
    tipo: "Página",
    titulo: p.h1,
    texto: p.description,
    href: `/${p.slug}`,
    titulo_n: normaliza(p.h1),
    busca: normaliza([p.h1, p.description].join(" ")),
  })),
];

const PESO_TIPO = { Serviço: 3, Área: 2, Guia: 1, Página: 0 };

export function buscar(consulta, limite = 6) {
  const termos = normaliza(consulta).split(/[^a-z0-9-]+/).filter((t) => t.length >= 2);
  if (!termos.length) return [];
  return INDICE.map((it) => {
    let pontos = 0;
    for (const t of termos) {
      if (!it.busca.includes(t)) return null;
      if (it.titulo_n.startsWith(t)) pontos += 6;
      if (new RegExp(`(^|[^a-z0-9])${t}([^a-z0-9]|$)`).test(it.titulo_n)) pontos += 4;
      else if (it.titulo_n.includes(t)) pontos += 2;
      pontos += 1;
    }
    return { ...it, pontos: pontos * 10 + PESO_TIPO[it.tipo] };
  })
    .filter(Boolean)
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, limite);
}

const SUGESTOES = ["AVCB", "PGR", "LTCAT", "CAR", "Habite-se", "Georreferenciamento"];

export default function BuscaDocumento({ autoFoco = false, aoSair, className = "" }) {
  const base = useId().replace(/:/g, "");
  const [q, setQ] = useState("");
  const [ativo, setAtivo] = useState(-1);
  const campo = useRef(null);

  useEffect(() => {
    if (autoFoco && campo.current) campo.current.focus();
  }, [autoFoco]);

  const resultados = buscar(q);
  const texto = q.trim();
  const opcoes = texto
    ? [
        ...resultados,
        {
          tipo: "WhatsApp",
          titulo: `Perguntar no WhatsApp: “${texto}”`,
          texto: resultados.length ? "Ou fale direto com o responsável técnico." : "Não achamos no site, mas respondemos por lá.",
          href: zap(`Olá! Procurei no site por "${texto}" e gostaria de saber se vocês fazem.`),
          externo: true,
        },
      ]
    : [];
  const aberto = opcoes.length > 0;

  const abrir = (op) => {
    if (!op) return;
    if (op.externo) window.open(op.href, "_blank", "noopener,noreferrer");
    else window.location.href = op.href;
    if (aoSair) aoSair();
  };

  const teclas = (e) => {
    if (e.key === "ArrowDown" && aberto) {
      e.preventDefault();
      setAtivo((n) => (n + 1) % opcoes.length);
    } else if (e.key === "ArrowUp" && aberto) {
      e.preventDefault();
      setAtivo((n) => (n <= 0 ? opcoes.length - 1 : n - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      abrir(opcoes[ativo >= 0 ? ativo : 0]);
    } else if (e.key === "Escape" && q) {
      e.preventDefault();
      e.stopPropagation(); // primeiro Esc limpa; o segundo fecha a janela da busca
      setQ("");
      setAtivo(-1);
    }
  };

  const idLista = `${base}-lista`;
  const idOpcao = (n) => `${base}-op-${n}`;

  return (
    <form className={`busca ${className}`} role="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={`${base}-campo`} className="busca-rotulo">
        Qual documento ou serviço você precisa?
      </label>
      <div className="busca-caixa">
        <Icone nome="fa-solid fa-magnifying-glass" />
        <input
          ref={campo}
          id={`${base}-campo`}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={aberto}
          aria-controls={idLista}
          aria-activedescendant={aberto && ativo >= 0 ? idOpcao(ativo) : undefined}
          autoComplete="off"
          enterKeyHint="search"
          placeholder="Ex.: AVCB, PGR, CAR, habite-se"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setAtivo(-1);
          }}
          onKeyDown={teclas}
        />
      </div>
      <ul id={idLista} role="listbox" className="busca-lista" aria-label="Resultados da busca" hidden={!aberto}>
        {opcoes.map((op, n) => (
          <li
            key={op.href}
            id={idOpcao(n)}
            role="option"
            aria-selected={n === ativo}
            className={`busca-op ${op.externo ? "busca-op-zap" : ""}`}
            onMouseMove={() => setAtivo(n)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => abrir(op)}
          >
            <span className="busca-tipo">{op.externo ? <Icone nome="fa-brands fa-whatsapp" /> : op.tipo}</span>
            <span className="busca-txt">
              <strong>{op.titulo}</strong>
              <small>{op.texto}</small>
            </span>
          </li>
        ))}
      </ul>
      <p className="busca-status" aria-live="polite">
        {texto ? (resultados.length ? `${resultados.length} resultado${resultados.length > 1 ? "s" : ""}` : "Nenhum resultado no site") : ""}
      </p>
      {!texto && (
        <p className="busca-sugestoes">
          <span>Mais procurados:</span>
          {SUGESTOES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setQ(s);
                setAtivo(0);
                campo.current?.focus();
              }}
            >
              {s}
            </button>
          ))}
        </p>
      )}
    </form>
  );
}

// Botão da busca no cabeçalho: abre a busca numa janela (dialog nativo, que já prende o foco e fecha com Esc).
// Atalhos: Ctrl+K / Cmd+K e "/" (fora de campos de texto).
export function BotaoBusca() {
  const janela = useRef(null);
  const [aberta, setAberta] = useState(false);

  const abrir = () => {
    const d = janela.current;
    if (!d || d.open) return;
    if (typeof d.showModal === "function") d.showModal();
    else d.setAttribute("open", "");
    setAberta(true);
  };
  const fechar = () => {
    const d = janela.current;
    if (d && d.open) d.close ? d.close() : d.removeAttribute("open");
    setAberta(false);
  };

  useEffect(() => {
    const atalho = (e) => {
      const digitando = e.target.closest && e.target.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        abrir();
      } else if (e.key === "/" && !digitando && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        abrir();
      }
    };
    document.addEventListener("keydown", atalho);
    return () => document.removeEventListener("keydown", atalho);
  }, []);

  return (
    <>
      <button type="button" className="busca-botao" aria-label="Buscar documento ou serviço" aria-haspopup="dialog" onClick={abrir}>
        <Icone nome="fa-solid fa-magnifying-glass" />
        <span className="busca-botao-txt">Buscar</span>
      </button>
      <dialog
        ref={janela}
        className="busca-janela"
        aria-label="Buscar documento ou serviço"
        onClose={() => setAberta(false)}
        onClick={(e) => {
          if (e.target === janela.current) fechar(); // clique fora da caixa
        }}
      >
        <div className="busca-janela-in">
          <button type="button" className="busca-fechar" aria-label="Fechar a busca" onClick={fechar}>
            <Icone nome="fa-solid fa-xmark" />
          </button>
          {aberta && <BuscaDocumento autoFoco aoSair={fechar} />}
        </div>
      </dialog>
    </>
  );
}
