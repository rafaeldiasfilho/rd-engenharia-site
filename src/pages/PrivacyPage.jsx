// Privacy notice (/privacidade).

import { PageClosing } from "../layout/PageClosing";
import { TRADE_NAME, PHONE_DISPLAY, ADDRESS } from "../company";
import { GENERAL_LINKS, PageTop } from "./pageParts.jsx";

export function PrivacyPage() {
  return (
    <>
      <PageTop breadcrumb={[{ label: "Privacidade" }]} eyebrow="Transparência" title="Política de Privacidade" />
      <section className="sec article-sec">
        <div className="container container-reading article">
          <p className="article-lead">
            Esta página explica, de forma simples, como o site da RD Engenharia Segurança e Meio Ambiente trata as
            informações de quem entra em contato.
          </p>
          <h2>Quais dados coletamos</h2>
          <p>
            Quando você preenche o formulário de orçamento ou usa o passo a passo "O que preciso?", as informações
            digitadas (como nome, cidade e a descrição do serviço) são usadas apenas para montar uma mensagem de
            WhatsApp. Elas são enviadas por você, ao clicar no botão, diretamente para o nosso número. As respostas do
            passo a passo ficam guardadas só nesta aba do navegador, para você poder voltar sem perder o que respondeu,
            e somem quando a aba é fechada. Nada vai para a RD até você enviar a mensagem.
          </p>
          <h2>Lembrete de vencimento</h2>
          <p>
            Se você pedir o lembrete de vencimento, guardamos o seu nome, o número de WhatsApp, o tipo de documento, o
            mês do vencimento (se informado) e a data da sua autorização. Usamos esses dados somente para avisar você
            sobre o prazo e oferecer a renovação. Eles ficam em banco de dados protegido, com acesso restrito à nossa
            equipe, e você pode pedir a exclusão a qualquer momento pelo WhatsApp.
          </p>
          <h2>Estatísticas de visita</h2>
          <p>
            Usamos o Vercel Web Analytics para medir quantas pessoas visitam o site e quais páginas acessam. A
            ferramenta gera estatísticas agregadas e não utiliza cookies para identificar visitantes individualmente.
          </p>
          <h2>Uso das informações</h2>
          <p>
            As mensagens recebidas pelo WhatsApp são usadas somente para responder ao seu pedido, elaborar orçamento e
            prestar o serviço contratado. Não vendemos nem compartilhamos seus dados com terceiros para fins de
            publicidade.
          </p>
          <h2>Seus direitos</h2>
          <p>
            De acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode pedir informações sobre os
            seus dados, a correção ou a exclusão deles. Basta nos chamar no WhatsApp.
          </p>
          <h2>Contato</h2>
          <p>
            {TRADE_NAME} · {ADDRESS} · WhatsApp {PHONE_DISPLAY}.
          </p>
        </div>
      </section>
      <PageClosing
        title="Dúvida sobre os seus dados?"
        text="Pergunte pelo WhatsApp. Respondemos no horário de atendimento, de segunda a sexta, das 7h às 17h."
        whatsappText="Olá! Tenho uma dúvida sobre a política de privacidade do site."
        related={[GENERAL_LINKS.reminder, GENERAL_LINKS.guides, GENERAL_LINKS.quiz]}
      />
    </>
  );
}
