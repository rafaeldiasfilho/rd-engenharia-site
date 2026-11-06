# Site da RD Engenharia

Site institucional da **RD Engenharia Segurança e Meio Ambiente** (Ibirá/SP), no ar em
[rdibiraengenharia.com.br](https://rdibiraengenharia.com.br/).

A empresa atua em engenharia civil, engenharia ambiental e segurança do trabalho. O atendimento e os
pedidos de orçamento são feitos pelo WhatsApp: o formulário do site monta a mensagem e abre a conversa.

## Tecnologias

React 18 e Vite 5. O site é estático (HTML gerado no build para cada página); o único serviço externo é o Supabase,
usado pela área interna `/admin` e pelo pedido de lembrete de vencimento. Hospedagem na Vercel.

## Como rodar

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm test         # testes automáticos (Vitest), sem internet e sem banco
npm run build    # gera a pasta dist/ (build + HTML de cada página)
npm run preview  # confere o resultado do build
```

## Documentação

- `docs/PRD.md`: o que o site faz, regras de negócio e o que acontece em cada falha.
- `docs/TECH_SPEC.md`: tecnologias, bibliotecas proibidas, estrutura de pastas, banco de dados e chamadas.
- `claude.md`: instruções para o Claude Code e o mapa de "onde mexer em cada coisa".

O código é todo em inglês; o texto que o visitante vê é em português.

Para testar a área interna sem o banco: `VITE_DEMO=1 npm run dev` (dados só no navegador).
