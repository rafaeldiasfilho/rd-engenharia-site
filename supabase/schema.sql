-- RD Engenharia: cadastro de clientes, serviços e vencimentos.
-- Rode este arquivo uma vez no Supabase (SQL Editor). Depois, em Authentication > Providers > Email,
-- desligue "Allow new users to sign up" e crie os usuários da equipe em Authentication > Users.

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
