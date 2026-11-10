-- Migration 20261109_conversion_events: conversion events of the public site (public.eventos_site)
-- and a keep-alive check (public.ping()).
--
-- What it does:
--   * Creates public.eventos_site: one row per WhatsApp click (tipo 'whatsapp') or reminder sent (tipo 'lembrete'),
--     with the page (pagina), an optional origin (origem) and an optional source (fonte).
--   * RLS on. anon may only INSERT, and only the columns tipo, pagina, origem and fonte (column grants + insert policy).
--     The team (public.eh_equipe()) may SELECT. Nobody may UPDATE or DELETE through the API: no grant and no policy
--     for it, for anon or authenticated.
--   * Creates public.ping(), returning 'ok', executable by anon, for a keep-alive check:
--     POST {SUPABASE_URL}/rest/v1/rpc/ping with the publishable key.
-- The public insert must send "Prefer: return=minimal": anon has no SELECT, so asking for the row back fails.
-- Safe to run more than once (if not exists, create or replace, drop policy if exists).
-- NOT applied yet. After the owner's approval: run it in the Supabase SQL Editor, then record the change in
-- supabase/schema.sql and docs/TECH_SPEC.md and run the Supabase advisors.
--
-- Rollback (deletes the table and every event recorded in it; its policies and grants go with it):
--   drop function if exists public.ping();
--   drop table if exists public.eventos_site;

create table if not exists public.eventos_site (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('whatsapp', 'lembrete')),
  pagina text not null check (char_length(pagina) <= 200),
  origem text check (char_length(origem) <= 80),
  fonte text check (char_length(fonte) <= 40),
  criado_em timestamptz not null default now()
);

alter table public.eventos_site enable row level security;

-- Supabase grants every table privilege to anon and authenticated by default: start from none,
-- then grant only what each role needs.
revoke all on public.eventos_site from public, anon, authenticated;
grant insert (tipo, pagina, origem, fonte) on public.eventos_site to anon;
grant select on public.eventos_site to authenticated;

-- Same rule as the CHECK on tipo; it keeps the policy from being a bare "true".
drop policy if exists "site_registra_evento" on public.eventos_site;
create policy "site_registra_evento" on public.eventos_site
  for insert to anon
  with check (tipo in ('whatsapp', 'lembrete'));

drop policy if exists "equipe_le_eventos" on public.eventos_site;
create policy "equipe_le_eventos" on public.eventos_site
  for select to authenticated
  using (public.eh_equipe());

create or replace function public.ping()
returns text
language sql
stable
set search_path = ''
as $$
  select 'ok'::text;
$$;

revoke all on function public.ping() from public, anon, authenticated;
grant execute on function public.ping() to anon;
