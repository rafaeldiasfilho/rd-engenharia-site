-- Migration 20261109_reminder_protection: abuse protection for public.lembretes_site (public reminder form).
--
-- What it does:
--   * BEFORE INSERT trigger lembretes_site_limita_pedidos, which rejects a new request when
--       - the same whatsapp + documento was already requested in the last 24 hours (SQLSTATE PT409: HTTP 409), or
--       - 200 requests (from anyone) already arrived in the last hour, so the next one is refused (SQLSTATE PT429: HTTP 429).
--         The cap is high on purpose: it stops a flood without letting a bot block real visitors for an hour.
--     The team (public.eh_equipe()) is not limited: /admin saves reminders with upsert, and an upsert also fires
--     BEFORE INSERT triggers, so without this exception the team could not mark a new request as handled.
--     The function is SECURITY DEFINER because anon cannot read the table (and RLS hides every row from anon);
--     its owner must be able to read all rows (the table owner, as the postgres role is in Supabase).
--   * CHECK lembretes_site_whatsapp_formato_br: whatsapp ~ '^55[0-9]{10,11}$', added NOT VALID, so the existing rows
--     are not checked. New rows are, and so is every later save of an old row (the /admin upsert): before applying,
--     count the old rows outside the format, because /admin could no longer mark them as handled:
--       select count(*) from public.lembretes_site where whatsapp !~ '^55[0-9]{10,11}$';
--     With 0 rows, the constraint can later be validated:
--       alter table public.lembretes_site validate constraint lembretes_site_whatsapp_formato_br;
--   * Index on criado_em, used by both checks.
-- Safe to run more than once (create or replace, drop trigger if exists, if not exists).
-- NOT applied yet. After the owner's approval: run it in the Supabase SQL Editor, then record the change in
-- supabase/schema.sql and docs/TECH_SPEC.md and run the Supabase advisors.
--
-- Rollback (no data is lost):
--   drop trigger if exists lembretes_site_limita_pedidos on public.lembretes_site;
--   drop function if exists public.lembretes_site_limita_pedidos();
--   alter table public.lembretes_site drop constraint if exists lembretes_site_whatsapp_formato_br;
--   drop index if exists public.lembretes_site_criado_em_idx;

create index if not exists lembretes_site_criado_em_idx on public.lembretes_site (criado_em);

create or replace function public.lembretes_site_limita_pedidos()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.eh_equipe() then
    return new;
  end if;

  -- One public insert at a time, so parallel requests cannot all pass the checks together.
  perform pg_advisory_xact_lock(hashtext('public.lembretes_site'));

  if exists (
    select 1
    from public.lembretes_site
    where whatsapp = new.whatsapp
      and documento = new.documento
      and criado_em > now() - interval '24 hours'
  ) then
    raise sqlstate 'PT409' using message = 'reminder already requested for this whatsapp and documento in the last 24 hours';
  end if;

  if (
    select count(*)
    from public.lembretes_site
    where criado_em > now() - interval '1 hour'
  ) >= 200 then
    raise sqlstate 'PT429' using message = 'too many reminder requests in the last hour';
  end if;

  return new;
end;
$$;

-- A trigger function is never called through the API; the trigger still fires without these grants.
revoke all on function public.lembretes_site_limita_pedidos() from public, anon, authenticated;

drop trigger if exists lembretes_site_limita_pedidos on public.lembretes_site;
create trigger lembretes_site_limita_pedidos
  before insert on public.lembretes_site
  for each row execute function public.lembretes_site_limita_pedidos();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'lembretes_site_whatsapp_formato_br'
      and conrelid = 'public.lembretes_site'::regclass
  ) then
    alter table public.lembretes_site
      add constraint lembretes_site_whatsapp_formato_br check (whatsapp ~ '^55[0-9]{10,11}$') not valid;
  end if;
end;
$$;
