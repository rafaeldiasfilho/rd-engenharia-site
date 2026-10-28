import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BotaoZap } from "./Layout";

// No prerender (Node) não há layout: usa useEffect lá para não gerar aviso.
const useLayoutSeguro = typeof window === "undefined" ? useEffect : useLayoutEffect;

const curto = (nome) => nome.split(/ — | \(/)[0];

// Marcar vários serviços da área e mandar tudo numa mensagem só. O item que entra na caixa da mensagem
// sai da posição do chip tocado e desliza até o lugar dele (animação só nesse elemento, sem travar a página).
// Com "reduzir movimento", aparece direto.
export default function MontarPedido({ area, itens }) {
  const [marcados, setMarcados] = useState([]);
  const botoes = useRef({});
  const itensCaixa = useRef({});
  const voo = useRef(null);

  const alternar = (nome, voltarFoco) => {
    const entrando = !marcados.includes(nome);
    if (entrando && botoes.current[nome]) voo.current = { nome, origem: botoes.current[nome].getBoundingClientRect() };
    setMarcados((atual) => (atual.includes(nome) ? atual.filter((n) => n !== nome) : [...atual, nome]));
    if (voltarFoco && botoes.current[nome]) botoes.current[nome].focus();
  };

  useLayoutSeguro(() => {
    const v = voo.current;
    voo.current = null;
    const el = v && itensCaixa.current[v.nome];
    if (!el || !el.animate) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const destino = el.getBoundingClientRect();
    const dx = v.origem.left - destino.left;
    const dy = v.origem.top - destino.top;
    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(0.92)`, opacity: 0.4 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 460, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
    );
  }, [marcados]);

  const texto = marcados.length
    ? `Olá! Gostaria de um orçamento na área de ${area} para: ${marcados.join("; ")}.`
    : `Olá! Gostaria de um orçamento na área de ${area}.`;

  return (
    <div className="pedido rev">
      <div className="pedido-cab">
        <h3>Precisa de mais de um serviço?</h3>
        <p>Toque nos serviços que você precisa e envie tudo numa mensagem só.</p>
      </div>
      <div className="pedido-opcoes" role="group" aria-label="Serviços desta área">
        {itens.map((item) => (
          <button
            type="button"
            key={item.nome}
            ref={(el) => (botoes.current[item.nome] = el)}
            className="pedido-chip"
            aria-pressed={marcados.includes(item.nome)}
            onClick={() => alternar(item.nome)}
          >
            <span className="pedido-marca" aria-hidden="true" />
            {curto(item.nome)}
          </button>
        ))}
      </div>
      <div className="pedido-caixa">
        <p className="rotulo-mini" aria-live="polite">
          {marcados.length === 0 ? "Sua mensagem" : marcados.length === 1 ? "Sua mensagem · 1 serviço" : `Sua mensagem · ${marcados.length} serviços`}
        </p>
        {marcados.length === 0 ? (
          <p className="pedido-vazio">Nenhum serviço marcado. Você também pode enviar sem marcar e contar o caso na conversa.</p>
        ) : (
          <ul className="pedido-lista">
            {marcados.map((nome) => (
              <li key={nome} ref={(el) => (itensCaixa.current[nome] = el)}>
                <span>{curto(nome)}</span>
                <button type="button" aria-label={`Tirar: ${curto(nome)}`} onClick={() => alternar(nome, true)}>
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
        <BotaoZap texto={texto} rotulo={marcados.length ? "Enviar pelo WhatsApp" : "Falar no WhatsApp"} />
      </div>
    </div>
  );
}
