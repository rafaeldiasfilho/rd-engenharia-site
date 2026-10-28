import { useEffect, useId, useRef } from "react";

// Janela sobre a página (adaptado dos "cartões expansíveis" da biblioteca de prompts, sem biblioteca de
// animação): <dialog> nativo, que já prende o foco, fecha com Esc e devolve o foco ao botão que abriu.
// Clicar fora do painel também fecha. A entrada é só opacidade e escala (CSS), parada com "reduzir movimento".
// O conteúdo fica no HTML pré-gerado (o Google lê), só escondido até abrir.
export default function Janela({ aberta, aoFechar, titulo, children }) {
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aberta && !d.open) d.showModal();
    if (!aberta && d.open) d.close();
  }, [aberta]);

  return (
    <dialog
      ref={ref}
      className="janela"
      aria-labelledby={`${id}-t`}
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === e.currentTarget) aoFechar();
      }}
    >
      <div className="janela-painel">
        <div className="janela-cab">
          <h3 id={`${id}-t`}>{titulo}</h3>
          <button type="button" className="janela-fechar" onClick={aoFechar} aria-label="Fechar">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
