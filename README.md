# Site da RD Engenharia

Site institucional da **RD Engenharia Segurança e Meio Ambiente** (Ibirá/SP), no ar em
[rdibiraengenharia.com.br](https://rdibiraengenharia.com.br/).

A empresa atua em engenharia civil, engenharia ambiental e segurança do trabalho. O atendimento e os
pedidos de orçamento são feitos pelo WhatsApp: o formulário do site monta a mensagem e abre a conversa.

## Tecnologias

React 18 e Vite 5, sem back-end. O site é estático e gera apenas HTML, CSS e JavaScript.

## Como rodar

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # gera a pasta dist/
npm run preview  # confere o resultado do build
```

## Estrutura

- `src/App.jsx`: conteúdo e seções da página
- `src/styles.css`: estilos
- `public/`: favicon, `robots.txt` e `sitemap.xml`
- `index.html`: metadados de SEO e dados estruturados da empresa

## Estrutura do site

- Página inicial (`src/App.jsx`) e páginas internas por área, guias, guia "o que preciso?" e privacidade (`src/paginas.js`, `src/Paginas.jsx`). Cada página é gerada como HTML estático no build (`scripts/prerender.mjs`) para o Google ler o conteúdo.
- Perguntas frequentes em `src/faq.js` (usadas também no JSON-LD).
- Área interna em `/admin` (`src/admin`): clientes, serviços e vencimentos, com login pelo Supabase. O esquema do banco está em `supabase/schema.sql`. Só e-mails cadastrados na tabela `equipe` acessam os dados.
- Para testar a área interna sem o banco: `VITE_DEMO=1 npm run dev` (dados só no navegador).
