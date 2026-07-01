-- ============================================================
-- Aivanta — registration_leads reshaped to SOF-style code requests,
-- and schools gains district / country / academic_year (for admin hierarchy).
--
-- NOTE: this DROPS the old registration_leads columns. Existing rows there are
-- test leads; we clear them first so NOT NULL columns can be added cleanly.
-- Run in the Supabase SQL Editor.
-- ============================================================

-- 1. schools: hierarchy fields
alter table public.schools add column if not exists district text;
alter table public.schools add column if not exists country text;
alter table public.schools add column if not exists academic_year text not null default '2025-26';

-- 2. registration_leads: clear test data, then reshape
truncate table public.registration_leads;

alter table public.registration_leads drop column if exists school;
alter table public.registration_leads drop column if exists udise;
alter table public.registration_leads drop column if exists board;
alter table public.registration_leads drop column if exists school_type;
alter table public.registration_leads drop column if exists address;
alter table public.registration_leads drop column if exists contact_person;
alter table public.registration_leads drop column if exists phone;
alter table public.registration_leads drop column if exists email;
alter table public.registration_leads drop column if exists fia_count;
alter table public.registration_leads drop column if exists cia_count;
alter table public.registration_leads drop column if exists aia_count;
alter table public.registration_leads drop column if exists total_paise;

alter table public.registration_leads add column if not exists applicant_role text;
alter table public.registration_leads add column if not exists applicant_name text not null;
alter table public.registration_leads add column if not exists applicant_email text not null;
alter table public.registration_leads add column if not exists applicant_mobile text not null;
alter table public.registration_leads add column if not exists school_name text not null;
alter table public.registration_leads add column if not exists school_address text;
alter table public.registration_leads add column if not exists city text;
alter table public.registration_leads add column if not exists district text;
alter table public.registration_leads add column if not exists state text;
alter table public.registration_leads add column if not exists country text;
alter table public.registration_leads add column if not exists pincode text;
alter table public.registration_leads add column if not exists school_email text;
alter table public.registration_leads add column if not exists school_phone text;
alter table public.registration_leads add column if not exists principal_name text;
alter table public.registration_leads add column if not exists principal_contact text;
