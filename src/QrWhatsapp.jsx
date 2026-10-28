import { useEffect, useRef, useState } from "react";
import { zap } from "./contato";

// Para quem está no computador: QR code que abre a conversa no celular. O SVG é estático
// (scripts/gerar-qr-whatsapp.mjs). Só aparece em telas com mouse (CSS); no celular o botão do WhatsApp já basta.
const MENSAGEM = "Olá! Gostaria de solicitar um orçamento.";

export default function QrWhatsapp() {
  const [aberto, setAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const espera = useRef(0);
  useEffect(() => () => clearTimeout(espera.current), []);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(zap(MENSAGEM));
      setCopiado(true);
      clearTimeout(espera.current);
      espera.current = setTimeout(() => setCopiado(false), 2000);
    } catch {
      // sem permissão para a área de transferência: o QR continua valendo
    }
  };

  return (
    <div className="qr-zap">
      <button type="button" className="qr-zap-botao" aria-expanded={aberto} aria-controls="qr-zap-painel" onClick={() => setAberto((v) => !v)}>
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="currentColor">
          <path d="M1 1h6v6H1zm2 2v2h2V3zM11 1h6v6h-6zm2 2v2h2V3zM1 11h6v6H1zm2 2v2h2v-2zM10 10h2v2h-2zm2 2h2v2h-2zm2-2h3v2h-3zm-4 4h2v3h-2zm4 1h3v2h-3z" />
        </svg>
        {aberto ? "Fechar o QR code" : "Abrir a conversa no celular"}
      </button>
      {aberto && (
        <div id="qr-zap-painel" className="qr-zap-painel">
          <img src="/marca/qr-whatsapp.svg" width="196" height="196" alt="QR code que abre a conversa com a RD Engenharia no WhatsApp" />
          <div className="qr-zap-texto">
            <p>
              <strong>Aponte a câmera do celular.</strong> O WhatsApp abre com a mensagem pronta.
            </p>
            <button type="button" className="qr-zap-copiar" onClick={copiar}>
              <span key={copiado ? "s" : "n"} className="qr-zap-troca">
                {copiado ? "Link copiado ✓" : "Copiar o link"}
              </span>
            </button>
            <span className="sr-only" aria-live="polite">
              {copiado ? "Link copiado" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
