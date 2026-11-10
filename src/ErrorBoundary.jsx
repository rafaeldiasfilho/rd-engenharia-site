// Last line of defence for the public pages: if a part of the page throws while rendering, React would
// remove the whole page and leave the visitor without any way to reach the team. This boundary shows a
// short message with the WhatsApp button (the only contact channel) instead.
// It adds no element of its own, so the prerendered HTML still matches during hydration.
import { Component } from "react";
import { whatsappLink } from "./contact";
import { generalWhatsappMessage } from "./whatsappMessages";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { renderFailed: false };
  }

  static getDerivedStateFromError() {
    return { renderFailed: true };
  }

  componentDidCatch(error) {
    console.error("Page render failed:", error);
  }

  render() {
    if (!this.state.renderFailed) return this.props.children;
    return (
      <main className="container error-fallback">
        <h1>Não foi possível mostrar esta página agora.</h1>
        <p>Tente recarregar a página. Se preferir, fale com a RD Engenharia pelo WhatsApp.</p>
        <p>
          <a className="btn btn-whatsapp btn-large" href={whatsappLink(generalWhatsappMessage())} target="_blank" rel="noopener noreferrer">
            Falar no WhatsApp
          </a>
        </p>
        <p>
          <a href="/">Ir para o início</a>
        </p>
      </main>
    );
  }
}
