-- ============================================================
-- Aivanta — seed the three assessments for the current cycle.
-- Enrollments reference these; fee is read from here (server-side source of truth).
-- Safe to re-run (won't duplicate for the same subject + academic year).
-- ============================================================

insert into public.exams (subject, name, academic_year, min_class, max_class, fee_per_student_paise, is_active)
select v.subject::subject_code, v.name, v.year, 1, 10, 15000, true
from (values
  ('fia', 'Financial Intelligence Assessment', '2025-26'),
  ('cia', 'Cyber Intelligence Assessment',     '2025-26'),
  ('aia', 'Artificial Intelligence Assessment','2025-26')
) as v(subject, name, year)
where not exists (
  select 1 from public.exams e
  where e.subject = v.subject::subject_code and e.academic_year = v.year
);
