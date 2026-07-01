-- ============================================================
-- Aivanta — Supabase Auth wiring + Row-Level Security
-- Run this AFTER the table schema exists (see supabase/README.md).
-- Safe to re-run (idempotent where practical).
-- ============================================================

-- ---- 1. Link profiles.id -> auth.users.id ----
do $$ begin
  alter table public.profiles
    add constraint profiles_id_fkey
    foreign key (id) references auth.users(id) on delete cascade;
exception when duplicate_object then null; end $$;

-- ---- 2. Auto-create a profile row when a new auth user signs up ----
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---- 3. Helper functions (SECURITY DEFINER bypasses RLS, avoids recursion) ----
create or replace function public.is_admin()
returns boolean
language sql stable
security definer set search_path = public
as $$
  select coalesce(
    (select role in ('admin', 'super_admin') from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.owns_school(p_school_id uuid)
returns boolean
language sql stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.schools
    where id = p_school_id and owner_profile_id = auth.uid()
  );
$$;

-- ---- 4. Prevent non-admins from changing their own role ----
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.prevent_role_change();

-- ============================================================
-- 5. Enable RLS on every table
-- ============================================================
alter table public.profiles     enable row level security;
alter table public.coordinators enable row level security;
alter table public.schools      enable row level security;
alter table public.students     enable row level security;
alter table public.enrollments  enable row level security;
alter table public.exams        enable row level security;
alter table public.exam_dates   enable row level security;
alter table public.payments     enable row level security;

-- ============================================================
-- 6. Policies
-- Helper to (re)create policies cleanly.
-- ============================================================

-- ---- profiles ----
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists profiles_admin_delete on public.profiles;
create policy profiles_admin_delete on public.profiles
  for delete using (public.is_admin());
-- (inserts happen via the SECURITY DEFINER trigger, so no insert policy needed)

-- ---- schools ----
drop policy if exists schools_select on public.schools;
create policy schools_select on public.schools
  for select using (owner_profile_id = auth.uid() or public.is_admin());

drop policy if exists schools_insert on public.schools;
create policy schools_insert on public.schools
  for insert with check (owner_profile_id = auth.uid());

drop policy if exists schools_update on public.schools;
create policy schools_update on public.schools
  for update using (owner_profile_id = auth.uid() or public.is_admin())
  with check (owner_profile_id = auth.uid() or public.is_admin());

drop policy if exists schools_delete on public.schools;
create policy schools_delete on public.schools
  for delete using (public.is_admin());

-- ---- students (owned via their school) ----
drop policy if exists students_all on public.students;
create policy students_all on public.students
  for all
  using (public.owns_school(school_id) or public.is_admin())
  with check (public.owns_school(school_id) or public.is_admin());

-- ---- enrollments (owned via student -> school) ----
drop policy if exists enrollments_all on public.enrollments;
create policy enrollments_all on public.enrollments
  for all
  using (
    public.is_admin() or exists (
      select 1 from public.students s
      where s.id = enrollments.student_id and public.owns_school(s.school_id)
    )
  )
  with check (
    public.is_admin() or exists (
      select 1 from public.students s
      where s.id = enrollments.student_id and public.owns_school(s.school_id)
    )
  );

-- ---- payments (owned via school) ----
drop policy if exists payments_all on public.payments;
create policy payments_all on public.payments
  for all
  using (public.owns_school(school_id) or public.is_admin())
  with check (public.owns_school(school_id) or public.is_admin());

-- ---- coordinators (self + admin) ----
drop policy if exists coordinators_select on public.coordinators;
create policy coordinators_select on public.coordinators
  for select using (profile_id = auth.uid() or public.is_admin());

drop policy if exists coordinators_admin_write on public.coordinators;
create policy coordinators_admin_write on public.coordinators
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- exams + exam_dates (public catalog: anyone can read, admins write) ----
drop policy if exists exams_public_read on public.exams;
create policy exams_public_read on public.exams
  for select using (true);

drop policy if exists exams_admin_write on public.exams;
create policy exams_admin_write on public.exams
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists exam_dates_public_read on public.exam_dates;
create policy exam_dates_public_read on public.exam_dates
  for select using (true);

drop policy if exists exam_dates_admin_write on public.exam_dates;
create policy exam_dates_admin_write on public.exam_dates
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- lead tables (public write via service role; admins read) ----
-- Inserts happen through the service-role client (bypasses RLS). We still
-- enable RLS + admin-only SELECT so nothing leaks via the anon key.
alter table public.contact_messages   enable row level security;
alter table public.registration_leads enable row level security;

drop policy if exists contact_messages_admin_read on public.contact_messages;
create policy contact_messages_admin_read on public.contact_messages
  for select using (public.is_admin());

drop policy if exists registration_leads_admin_read on public.registration_leads;
create policy registration_leads_admin_read on public.registration_leads
  for select using (public.is_admin());
