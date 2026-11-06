import { useEffect, useRef, useState } from "react";
import { zap } from "./contact";

// For desktop visitors: QR code that opens the chat on the phone. The SVG is static
// (scripts/generate-whatsapp-qr.mjs). Only shows on screens with a mouse (CSS); on mobile the WhatsApp button is enough.
const MESSAGE = "Olá! Gostaria de solicitar um orçamento.";

export default function QrWhatsapp() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(zap(MESSAGE));
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // no clipboard permission: the QR code still works
    }
  };

  return (
    <div className="qr-whatsapp">
      <button type="button" className="qr-whatsapp-button" aria-expanded={open} aria-controls="qr-zap-painel" onClick={() => setOpen((v) => !v)}>
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="currentColor">
          <path d="M1 1h6v6H1zm2 2v2h2V3zM11 1h6v6h-6zm2 2v2h2V3zM1 11h6v6H1zm2 2v2h2v-2zM10 10h2v2h-2zm2 2h2v2h-2zm2-2h3v2h-3zm-4 4h2v3h-2zm4 1h3v2h-3z" />
        </svg>
        {open ? "Fechar o QR code" : "Abrir a conversa no celular"}
      </button>
      {open && (
        <div id="qr-zap-painel" className="qr-whatsapp-panel">
          <img src="/marca/qr-whatsapp.svg" width="196" height="196" alt="QR code que abre a conversa com a RD Engenharia no WhatsApp" />
          <div className="qr-whatsapp-text">
            <p>
              <strong>Aponte a câmera do celular.</strong> O WhatsApp abre com a mensagem pronta.
            </p>
            <button type="button" className="qr-whatsapp-copy" onClick={copy}>
              <span key={copied ? "s" : "n"} className="qr-whatsapp-swap">
                {copied ? "Link copiado ✓" : "Copiar o link"}
              </span>
            </button>
            <span className="sr-only" aria-live="polite">
              {copied ? "Link copiado" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
