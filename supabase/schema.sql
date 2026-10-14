-- RD Engenharia: cadastro de clientes, serviços e vencimentos.
-- Já aplicado no projeto Supabase "RdEngenharia". Mantido aqui como registro do que existe no banco.
-- Depois: em Authentication, desligue o cadastro aberto de novos usuários e crie os usuários da equipe.

create table if not exists public.equipe (
  email text primary key
);

create or replace function public.eh_equipe()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.equipe where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text not null default 'pf' check (tipo in ('pf', 'pj')),
  documento text,
  contato text,
  telefone text,
  whatsapp text,
  email text,
  cep text,
  logradouro text,
  numero text,
  bairro text,
  cidade text,
  uf text default 'SP',
  origem text,
  observacoes text,
  aceita_lembretes boolean not null default false,
  aceite_lembretes_em date,
  criado_em timestamptz not null default now()
);

create table if not exists public.servicos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes (id) on delete cascade,
  tipo text not null,
  descricao text,
  local_servico text,
  status text not null default 'concluido' check (status in ('orcamento', 'em_andamento', 'concluido')),
  data_realizacao date,
  repetir_meses integer check (repetir_meses is null or repetir_meses > 0),
  vencimento date,
  encerrado boolean not null default false,
  art_numero text,
  valor numeric(12, 2),
  observacoes text,
  criado_em timestamptz not null default now()
);

create index if not exists servicos_cliente_idx on public.servicos (cliente_id);
create index if not exists servicos_vencimento_idx on public.servicos (vencimento) where encerrado = false;

alter table public.equipe enable row level security;
alter table public.clientes enable row level security;
alter table public.servicos enable row level security;

drop policy if exists "equipe_ve_clientes" on public.clientes;
create policy "equipe_ve_clientes" on public.clientes
  for all to authenticated using (public.eh_equipe()) with check (public.eh_equipe());

drop policy if exists "equipe_ve_servicos" on public.servicos;
create policy "equipe_ve_servicos" on public.servicos
  for all to authenticated using (public.eh_equipe()) with check (public.eh_equipe());

-- A tabela "equipe" não tem política: ninguém lê pelo site. Cadastre os e-mails pelo SQL Editor:
-- insert into public.equipe (email) values ('email1@exemplo.com'), ('email2@exemplo.com');

revoke execute on function public.eh_equipe() from public, anon;
grant execute on function public.eh_equipe() to authenticated;

-- ============================================================
-- Lembrete de vencimento (formulário público) 
-- ============================================================
create table if not exists public.lembretes_site (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text not null,
  documento text not null,
  vencimento date,
  consentimento boolean not null,
  consentimento_em timestamptz not null default now(),
  tratado boolean not null default false,
  criado_em timestamptz not null default now()
);
-- (as constraints de tamanho/formato estão nas migrations aplicadas no projeto)
alter table public.lembretes_site enable row level security;

drop policy if exists "site_cria_lembrete" on public.lembretes_site;
create policy "site_cria_lembrete" on public.lembretes_site
  for insert to anon with check (consentimento = true and tratado = false);

drop policy if exists "equipe_gerencia_lembretes" on public.lembretes_site;
create policy "equipe_gerencia_lembretes" on public.lembretes_site
  for all to authenticated using (public.eh_equipe()) with check (public.eh_equipe());

revoke all on public.lembretes_site from anon;
grant insert (nome, whatsapp, documento, vencimento, consentimento) on public.lembretes_site to anon;
