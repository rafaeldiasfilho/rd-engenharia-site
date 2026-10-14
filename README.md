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
