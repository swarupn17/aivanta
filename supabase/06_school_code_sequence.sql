-- ============================================================
-- Aivanta — 5-digit incremental school codes
-- Run AFTER 03_school_codes.sql. Safe to re-run.
--
-- Replaces the old random claim code (ASF-XXXXXX) with a unique,
-- incremental 5-digit number issued by a Postgres SEQUENCE. Using a
-- sequence makes "unique + incremental" race-free for free — the
-- database, not app code, owns code generation (single source of truth).
-- ============================================================

-- 1. The sequence: 10001, 10002, ... 99999 (always exactly 5 digits).
create sequence if not exists public.school_code_seq
  as integer
  start with 10001
  minvalue 10001
  maxvalue 99999
  no cycle;

-- 2. Helper that returns the next code as zero-padded 5-char text.
--    (lpad is defensive; starting at 10001 already guarantees 5 digits.)
create or replace function public.next_school_code()
returns text
language sql
volatile
set search_path = public
as $$
  select lpad(nextval('public.school_code_seq')::text, 5, '0');
$$;

-- 3. Make it the column default so every new school row gets a code
--    automatically — approveLead just inserts and reads it back.
alter table public.schools
  alter column school_code set default public.next_school_code();
