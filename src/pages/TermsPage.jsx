// Terms of use (/termos-de-uso).

import { PageClosing } from "../layout/PageClosing";
import { TRADE_NAME, PHONE_DISPLAY, ADDRESS } from "../company";
import { GENERAL_LINKS, PageTop } from "./pageParts.jsx";

// Terms of use: DRAFT written from what the site already states (quotes via WhatsApp, no prices on the
// site, ART when required, illustrative images, real projects with data removed). The owner reviews before publishing.
export function TermsPage() {
  return (
    <>
      <PageTop breadcrumb={[{ label: "Termos de uso" }]} eyebrow="Transparência" title="Termos de Uso" />
      <section className="sec article-sec">
        <div className="container container-reading article">
          <p className="article-lead">
            Estes termos explicam, de forma simples, como funciona o site da RD Engenharia Segurança e Meio Ambiente.
            Ao usar o site, você concorda com eles.
          </p>
          <h2>Para que serve o site</h2>
          <p>
            O site apresenta os serviços da RD Engenharia e ajuda você a descobrir o que o seu caso precisa. Ele não
            vende serviços diretamente: todo atendimento começa por uma conversa no WhatsApp.
          </p>
          <h2>Orçamento e contratação</h2>
          <p>
            O site não mostra preços nem prazos fixos, porque cada caso é diferente. Valor, prazo e condições são
            informados no orçamento, por escrito e sem compromisso, depois de conhecermos o seu caso. O serviço só
            começa depois que você aprova o orçamento. Os trabalhos que exigem são acompanhados de ART (Anotação de
            Responsabilidade Técnica) de profissional habilitado no CREA-SP.
          </p>
          <h2>Conteúdo informativo</h2>
          <p>
            Os guias, as perguntas frequentes e o passo a passo "O que preciso?" trazem orientações gerais. Eles não
            substituem a análise técnica do seu caso, e normas e prazos dos órgãos públicos podem mudar. Antes de
            decidir, fale com a gente.
          </p>
          <h2>Imagens e exemplos</h2>
          <p>
            As fotos marcadas como ilustrativas são de terceiros, usadas conforme a licença de cada uma (veja os{" "}
            <a href="/creditos">créditos das imagens</a>), e não mostram trabalhos da RD. Os desenhos de projeto da
            página de engenharia civil são trabalhos reais, com os dados dos clientes retirados. Os documentos de
            exemplo e as ilustrações interativas são inventados, feitos só para o site.
          </p>
          <h2>Direitos sobre o conteúdo</h2>
          <p>
            Os textos, a marca e os desenhos próprios do site pertencem à RD Engenharia. Para usar qualquer parte
            deles, peça autorização pelo WhatsApp.
          </p>
          <h2>Links para outros serviços</h2>
          <p>
            O site tem links para o WhatsApp, o Google Maps e o Instagram. Ao usá-los, valem os termos e a política de
            privacidade de cada serviço.
          </p>
          <h2>Seus dados</h2>
          <p>
            O tratamento dos dados de quem entra em contato está na <a href="/privacidade">política de privacidade</a>.
          </p>
          <h2>Mudanças nestes termos</h2>
          <p>Estes termos podem ser atualizados. A versão válida é sempre a publicada nesta página.</p>
          <h2>Contato</h2>
          <p>
            {TRADE_NAME} · {ADDRESS} · WhatsApp {PHONE_DISPLAY}.
          </p>
        </div>
      </section>
      <PageClosing
        title="Ficou alguma dúvida?"
        text="Pergunte pelo WhatsApp. Respondemos no horário de atendimento, de segunda a sexta, das 7h às 17h."
        whatsappText="Olá! Tenho uma dúvida sobre os termos de uso do site."
        related={[GENERAL_LINKS.guides, GENERAL_LINKS.quiz, GENERAL_LINKS.reminder]}
      />
    </>
  );
}
