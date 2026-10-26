# CLAUDE.md — Site da RD Engenharia

Instruções para o Claude Code neste repositório. Site institucional da **RD Engenharia Segurança e Meio Ambiente** (Ibirá/SP), empresa do Rafael e do pai dele. Produção: https://rdibiraengenharia.com.br. O Rafael escreve em português; responda sempre em português, em tom sóbrio e direto, sem excesso de listas.

## Regras de negócio (nunca quebrar)

- O único canal de atendimento é o **WhatsApp**. Formulários só montam a mensagem e abrem a conversa. Não criar telefone fixo, e-mail de contato nem "acompanhe seu processo" (foi removido de propósito: o cliente pergunta o andamento pelo WhatsApp).
- **Sem preços e sem prazos fixos** nos textos. Normas citadas conforme o conhecimento de 2026, sempre com a ressalva de que a equipe confirma cada caso.
- **Não inventar** informação sobre a empresa, clientes, depoimentos, números, fotos ou avaliações. Se faltar dado, perguntar ao Rafael. Itens pendentes dele: foto do responsável (`FOTO_RESPONSAVEL` em `src/paginas.js`, hoje `null`), fotos e depoimentos reais, revisão dos textos pelo pai, Search Console. A nota do Google (5,0, 8 avaliações, verificada em 20/10/2026) já está no site (`NOTA_GOOGLE`), sem nomes nem textos de avaliações e sem AggregateRating.
- Projetos de exemplo são **anonimizados** (sem endereço, nome ou matrícula) e levam marca d'água "RD Engenharia – exemplo". Nunca publicar planta de cliente sem anonimizar.
- Acessibilidade: respeitar `prefers-reduced-motion`, manter `aria-label`/`aria-pressed` nos controles novos, não depender só de cor.

## Stack

React 18 + Vite 5, JavaScript. Componentes vindos do 21st.dev/shadcn ficam em `src/components/ui/` (TypeScript + Tailwind v4 + `cn()` de `src/lib/utils.ts`, atalho `@/` para `src/`, `components.json` na raiz). O Tailwind só lê `src/components/ui` e `src/lib` (`@source` em `src/index.css`) e não carrega o reset (preflight): o resto do site continua em `styles.css`, numa camada abaixo das classes do Tailwind. Ao colar um componente novo, se ele usar uma classe fora dessas pastas, ela não é gerada. Site estático: `npm run build` roda `vite build` e depois `node scripts/prerender.mjs`, que gera um HTML por página (para o Google ler), o `sitemap.xml` e o JSON-LD. Hospedagem na **Vercel**, banco e login no **Supabase**, código no **GitHub** (branch `main`).

```bash
npm install
npm run dev        # desenvolvimento
npm run build      # build + prerender (deve gerar todas as páginas, hoje 18)
npm run preview    # serve o dist/ em localhost:4173
VITE_DEMO=1 npm run dev   # área /admin sem banco (dados só no navegador)
```

## Onde mexer em cada coisa

| Quero mudar | Arquivo |
|---|---|
| Página inicial (seções, contato, onde atendemos) | `src/App.jsx` |
| Textos das áreas, guias, equipamentos de referência, projetos, quiz, dicas do lembrete | `src/paginas.js` |
| Como as páginas internas são desenhadas | `src/Paginas.jsx` |
| Abas de exemplos da página inicial | `src/ExemplosHome.jsx` |
| Arrastar/trocar automático (carrosséis) | `src/Carrossel.jsx` (único componente de carrossel) |
| Cabeçalho e rodapé | `src/Layout.jsx` |
| Perguntas frequentes (também no JSON-LD) | `src/faq.js` |
| Ícones (Font Awesome, importados um a um) | `src/Icone.jsx` |
| Visual (cores, espaçamento, animações) | `src/styles.css` |
| Área interna `/admin` (clientes, serviços, vencimentos) | `src/admin/Admin.jsx`, `src/admin/db.js` |
| Envio do "lembrete de vencimento" do site | `src/publico/api.js` |
| Esquema do banco e políticas de segurança | `supabase/schema.sql` |
| Redirecionamentos e URLs limpas | `vercel.json` |
| Imagens dos exemplos | `public/exemplos/<pasta>/*.webp` |

Não há páginas por cidade: a página única `/onde-atendemos` lista as cidades (constante `CIDADES` em `src/paginas.js`), e `/cidades` e `/cidades/:slug` redirecionam para ela em `vercel.json`. Fotos ficam em `public/fotos/otim/` e são declaradas em `src/fotos.js` (que alimenta `/creditos`). Projetos de exemplo ficam em `PROJETOS`; para adicionar um, criar a pasta em `public/exemplos/<pasta>/` com `.webp` anonimizados e acrescentar o objeto em `PROJETOS`.

## Como trabalhamos (fluxo padrão)

1. Entender o pedido e, se envolver informação da empresa que não está no código, perguntar antes de escrever.
2. Editar os arquivos da tabela acima. Preferir mudanças pequenas e focadas; reaproveitar componentes e classes CSS existentes em vez de criar novos.
3. Rodar `npm run build` e conferir que passa e que o número de páginas prerenderizadas está correto.
4. **Testar de verdade** com Playwright contra o `npm run preview` (porta 4173): conferir o comportamento, ausência de rolagem horizontal em celular (390 px), tema claro e escuro e erros no console. Para arrastar no celular, usar `Input.dispatchTouchEvent` via CDP. Dois avisos: o erro de hidratação #418 no `vite preview` é artefato do preview, não do site; e o 404 de `/_vercel/insights/script.js` só existe fora da Vercel.
5. Commitar com mensagem em português descrevendo o resultado, depois `git push origin HEAD:main`. A Vercel publica sozinha em 1 a 2 minutos.
6. Conferir se o deploy ficou **READY** (painel da Vercel ou MCP da Vercel) e abrir o site para validar. Só então dizer ao Rafael que está no ar, em uma ou duas frases, sem recapitular os passos.

Ao commitar via Claude, terminar a mensagem com as linhas de atribuição pedidas pelo ambiente (Co-Authored-By e link da sessão).

## Segurança e Supabase

- O front usa só a chave pública (anon/publishable) do Supabase; ela pode ficar no código. **Nunca** colocar `service_role` nem senhas no repositório.
- Segurança por RLS: a tabela `equipe` define quem entra no `/admin`; a função `eh_equipe()` é usada nas políticas. O visitante anônimo só pode **inserir** na tabela `lembretes_site` (política de INSERT e permissão de INSERT só nas colunas permitidas). Qualquer alteração de banco deve atualizar `supabase/schema.sql` e ser executada pelo Rafael no SQL Editor (ou aplicada por migração com a aprovação dele). Depois rodar os "advisors" do Supabase.
- Proteção contra senhas vazadas do Supabase Auth exige plano pago; no plano atual, manter cadastros fechados, senhas longas e MFA por aplicativo (TOTP) para a equipe.
- Domínios antigos redirecionam em `vercel.json` (redirect permanente para o domínio atual).

## Padrões de código

- Componentes funcionais com hooks; sem bibliotecas novas sem necessidade (o projeto tem poucas dependências de propósito).
- Animações em CSS (`@keyframes` em `styles.css`) e, quando preciso, controladas por classe; sempre incluir a regra de `prefers-reduced-motion`.
- Imagens em `.webp`, com `width`/`height` ou proporção definida para não deslocar o layout.
- Todo texto novo em português do Brasil, com acentuação correta. Datas e números no formato brasileiro.
- Cada página nova precisa de `title`, `description`, `h1` e entrada em `PAGINAS` para o prerender gerar o HTML e o sitemap.
