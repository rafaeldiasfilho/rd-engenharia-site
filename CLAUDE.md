# CLAUDE.md — Site da RD Engenharia

Instruções para o Claude Code neste repositório. Site institucional da **RD Engenharia Segurança e Meio Ambiente** (Ibirá/SP), empresa do Rafael e do pai dele. Produção: https://rdibiraengenharia.com.br. O Rafael escreve em português; responda sempre em português, em tom sóbrio e direto, sem excesso de listas.

Antes de escrever código, leia `docs/PRD.md` (o que o site faz e por quê, regras e caminhos de falha) e `docs/TECH_SPEC.md` (stack, bibliotecas proibidas, pastas, banco e contratos). Se uma tabela, uma chamada ao banco, a stack ou a estrutura de pastas mudar, atualize o TECH_SPEC no mesmo trabalho.

## Regras de negócio (nunca quebrar)

- O único canal de atendimento é o **WhatsApp**. Formulários só montam a mensagem e abrem a conversa. A única exceção é o lembrete de vencimento, que grava o pedido no banco. Não criar telefone fixo, e-mail de contato nem "acompanhe seu processo" (foi removido de propósito: o cliente pergunta o andamento pelo WhatsApp).
- **Sem preços e sem prazos fixos** nos textos. Normas citadas conforme o conhecimento de 2026, sempre com a ressalva de que a equipe confirma cada caso.
- **Não inventar** informação sobre a empresa, clientes, depoimentos, números, fotos ou avaliações. Se faltar dado, perguntar ao Rafael. Pendentes dele: foto do responsável (`TECHNICAL_LEAD_PHOTO` em `src/content/technicalLead.js`, hoje `null`), fotos e depoimentos reais, revisão dos textos pelo pai, Search Console. A nota do Google (`GOOGLE_RATING` em `src/content/googleAndMaps.js`, 5,0 com 8 avaliações, verificada em 20/10/2026) aparece só como texto, sem nomes, sem textos de avaliações e sem AggregateRating.
- Projetos de exemplo são **anonimizados** (sem endereço, nome ou matrícula) e levam marca d'água "RD Engenharia – exemplo". Nunca publicar planta de cliente sem anonimizar.
- Fotos só CC0, domínio público ou Unsplash License, declaradas em `src/content/photoList.js` (alimenta `/creditos`). A Unsplash License não é CC0.
- Acessibilidade: respeitar `prefers-reduced-motion` e o alto contraste (forced colors), alvos de toque de 44 px, `aria-label`/`aria-pressed` nos controles novos, não depender só de cor.

## Método de trabalho (método do Rafael para código com IA)

- A IA digita; o Rafael decide arquitetura, especificação e revisão. Nada de colar erro no chat até funcionar.
- Pedidos em partes pequenas e delimitadas, a partir do PRD e do TECH_SPEC.
- **Código todo em inglês**: nomes de arquivos, variáveis, funções, classes CSS, atributos `data-*`, chaves internas, comentários e mensagens de log. O que o visitante vê ou ouve fica em português. Ficam em português de propósito: endereços (slugs) e âncoras de seção (`#contato`, `#duvidas`...), nomes de arquivos públicos (`public/fotos`, `public/exemplos`, `public/og`), nomes e valores do banco (tabelas, colunas, `status`, `tipo`), chaves do `localStorage` (`tema`, `rd_demo_*`) e chaves e valores enviados à análise de cliques (`pagina`, `origem`, `texto`).
- **Nomes fáceis de achar numa busca**: longos e únicos (`buildClientWhatsappLink`, não `link`). Nada de `Row`, `Field`, `data`, `item` soltos em escopo de arquivo.
- **Arquivos pequenos**: de 100 a 150 linhas; acima de ~200, dividir por responsabilidade. Exceções conhecidas, ainda grandes: componentes únicos com muito estado (`src/Carousel.jsx`, `src/PhotoViewer.jsx`, `src/Wizard.jsx`, `src/layout/Header.jsx`), os componentes de terceiros em `src/components/ui/` e o gerador de QR (`scripts/generate-whatsapp-qr.mjs`). Os arquivos CSS em `src/styles/` têm até ~650 linhas.
- **Cláusulas de guarda**: tratar o erro primeiro e sair cedo; sem if/else aninhado. Funções de regra retornam códigos explícitos (`ERROR_INVALID_WHATSAPP`, `SUCCESS_REMINDER_READY`).
- **Lógica fora dos componentes**: regra de negócio vai numa função pura num `.js` próprio (ex.: `src/pages/reminderForm.js`, `src/wizardResult.js`, `src/admin/dates.js`), e o componente só chama. Assim ela ganha teste.
- **Testes**: um arquivo de teste por arquivo de lógica, espelhando `src/` em `tests/` (`src/admin/dates.js` → `tests/admin/dates.test.js`). Vitest, só no terminal, com mocks (sem internet e sem banco real). Caminho feliz e pelo menos três falhas tiradas do PRD.
- **Ciclo**: depois de mexer em código testado, rodar `npm test`; se falhar, ler o erro, corrigir e rodar de novo. Só entregar com tudo passando e com `npm run build` passando.

## Stack

React 18 + Vite 5, JavaScript (TypeScript só nos componentes de `src/components/ui/`). CSS puro, sem framework: `src/styles.css` só importa as 20 partes de `src/styles/`, **em ordem** (as últimas valem sobre as primeiras). Ícones Phosphor (`@phosphor-icons/react`), chamados por `src/Icon.jsx` com os nomes antigos do Font Awesome. Cenas 3D com three.js. Site estático: `npm run build` roda `vite build` e depois `node scripts/prerender.mjs`, que gera um HTML por página (para o Google ler), o `sitemap.xml`, o JSON-LD e o `llms.txt`. Hospedagem na **Vercel**, banco e login no **Supabase**, código no **GitHub** (branch `main`). Testes com Vitest.

```bash
npm install
npm run dev        # desenvolvimento
npm test           # testes (Vitest), sem internet e sem banco
npm run build      # build + prerender (hoje: 19 páginas no sitemap + 4 de impressão)
npm run preview    # serve o dist/ em localhost:4173
VITE_DEMO=1 npm run dev   # área /admin sem banco (dados só no navegador)
node scripts/og.mjs       # refaz as imagens de compartilhamento (public/og/)
```

## Onde mexer em cada coisa

| Quero mudar | Arquivo |
|---|---|
| Lista de páginas (título, descrição, h1) | `src/content/pages.js` |
| Textos de cada área | `src/content/areas/*.js` (um arquivo por área); resumo de cada área em `src/content/areas.js` |
| Guias, assistente "O que preciso?", lembrete | `src/content/guides.js`, `src/content/wizard.js`, `src/content/reminder.js` |
| Equipamentos, projetos de exemplo, cenas 3D | `src/content/equipment.js`, `src/content/projects.js`, `src/content/areaScenes.js` |
| Textos da página inicial | `src/content/home.js` e os blocos em `src/home/` (a ordem fica em `src/App.jsx`) |
| Dados da empresa, WhatsApp, Google e mapa | `src/company.js`, `src/contact.js`, `src/content/googleAndMaps.js` |
| Perguntas frequentes (também no JSON-LD) | `src/faqItems.js` |
| Fotos e carrosséis | `src/content/photoList.js`, `src/content/photoCarousels.js`; arquivos em `public/fotos/otim/` |
| Modelos das páginas internas | `src/pages/` (`PageView.jsx` escolhe pelo `type`); seções da página de área em `src/pages/area/` |
| Cabeçalho, rodapé, barra "Nesta página" | `src/layout/` |
| Busca por documento | `src/searchIndex.js` (índice e ordem) e `src/Search.jsx` (tela) |
| Folhas de exemplo | `src/sheets/` (capa, prancha, certificado), `src/drawings/` (desenhos e páginas internas), `src/SheetBase.jsx` (cores e dados fictícios) |
| Ilustrações interativas | `src/illustrations/` |
| Cenas 3D | `src/Scene3D.jsx` e `src/scenes3d/` |
| Visual (cores, espaçamento, animações) | `src/styles/` (variáveis do tema em `01-theme.css`) |
| Área interna `/admin` | `src/admin/` (telas, `db.js` para os dados, `dates.js` para vencimentos) |
| Envio do lembrete de vencimento | `src/pages/reminderForm.js` (validação) e `src/publicApi/api.js` (envio) |
| Esquema do banco e políticas de segurança | `supabase/schema.sql` |
| Redirecionamentos e URLs limpas | `vercel.json` |
| Imagens dos projetos de exemplo | `public/exemplos/<pasta>/*.webp` |

`/cidades` e `/cidades/:slug` redirecionam para `/onde-atendemos` em `vercel.json`. Para adicionar um projeto de exemplo, criar a pasta em `public/exemplos/<pasta>/` com `.webp` anonimizados e acrescentar o objeto em `PROJECTS` (`src/content/projects.js`).

## Como trabalhamos (fluxo padrão)

1. Entender o pedido. Se envolver informação da empresa que não está no código, perguntar antes de escrever. Ler o PRD e o TECH_SPEC.
2. Trabalhar num branch (nunca direto no `main`). Mudanças pequenas e focadas; reaproveitar componentes e classes existentes.
3. Rodar `npm test` e `npm run build`; conferir que tudo passa e que o número de páginas prerenderizadas está certo.
4. **Testar de verdade** no navegador contra o `npm run preview`: comportamento, ausência de rolagem horizontal no celular (390 px), tema claro e escuro e erros no console. Dois avisos: o erro de hidratação #418 no `vite preview` é artefato do preview, não do site; e o 404 de `/_vercel/insights/script.js` só existe fora da Vercel.
5. Revisar o diff linha a linha (`git diff --cached`) antes de cada commit. Mensagens de commit em inglês, como o código, terminando com as linhas de atribuição pedidas pelo ambiente.
6. **Publicar só com o "pode publicar" do Rafael**, dado para aquela publicação. Aí juntar o branch no `main` e fazer `git push origin main`; a Vercel publica sozinha em 1 a 2 minutos.
7. Conferir se o deploy ficou **READY** (painel ou MCP da Vercel) e abrir o site para validar. Só então dizer ao Rafael que está no ar, em uma ou duas frases.

## Segurança e Supabase

- O front usa só a chave pública (anon/publishable) do Supabase; ela pode ficar no código. **Nunca** colocar `service_role`, senhas ou tokens no repositório. Segredos locais só em `.env` / `.env.local`, que o `.gitignore` já ignora.
- Segurança por RLS: a tabela `equipe` define quem entra no `/admin`; a função `eh_equipe()` é usada nas políticas. O visitante anônimo só pode **inserir** na tabela `lembretes_site`, nas 5 colunas permitidas e com consentimento. Qualquer mudança de banco atualiza `supabase/schema.sql` e o TECH_SPEC e é executada pelo Rafael no SQL Editor (ou aplicada por migração com a aprovação dele). Depois rodar os "advisors" do Supabase.
- A proteção contra senhas vazadas do Supabase Auth exige plano pago; no plano atual, manter cadastros fechados, senhas longas e MFA por aplicativo (TOTP) para a equipe.
- Domínios antigos redirecionam em `vercel.json` (redirect permanente para o domínio atual).
- A IA trabalha só dentro da pasta do projeto, sem permissão global ou de administrador.

## Padrões de código

- Componentes funcionais com hooks; sem bibliotecas novas sem necessidade (lista de proibidas no TECH_SPEC).
- Animações em CSS (`@keyframes` em `src/styles/`), controladas por classe ou atributo `data-*`, sempre com a regra de `prefers-reduced-motion`.
- Imagens em `.webp`, com `width`/`height` ou proporção definida para não deslocar o layout.
- Texto para o visitante em português do Brasil, com acentuação correta; datas e números no formato brasileiro.
- Cada página nova precisa de `title`, `description`, `h1`, um `type` conhecido e entrada em `PAGES` (`src/content/pages.js`) para o prerender gerar o HTML e o sitemap. O teste `tests/content/pages.test.js` confere isso.
