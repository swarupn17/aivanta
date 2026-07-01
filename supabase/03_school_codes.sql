-- ============================================================
-- Aivanta — school claim codes + role-guard patch
-- Run AFTER 02_auth_rls.sql. Safe to re-run.
-- ============================================================

-- 1. Add claim-code columns to schools (idempotent)
alter table public.schools add column if not exists school_code text;
alter table public.schools add column if not exists code_claimed_at timestamptz;

do $$ begin
  alter table public.schools
    add constraint schools_school_code_unique unique (school_code);
exception when duplicate_object then null; end $$;

-- 2. Patch the role-change guard so trusted SERVER code (service_role, where
--    auth.uid() is null) can set roles during admin approval / school claim,
--    while still blocking normal users from changing their own role.
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- auth.uid() is null for service_role (server) connections — allow those.
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;
