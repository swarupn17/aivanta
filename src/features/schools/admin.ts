import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export type AdminSchool = {
  id: string;
  name: string;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  academic_year: string;
  status: string;
  school_code: string | null;
  students: number;
};

type Raw = Omit<AdminSchool, "students"> & { students: { count: number }[] | null };

/** All schools with a student count (one query). Admin-gated by RLS. */
export async function getAdminSchools(): Promise<AdminSchool[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("schools")
    .select(
      "id, name, city, district, state, country, academic_year, status, school_code, students(count)"
    )
    .order("name", { ascending: true });

  return ((data as unknown as Raw[]) ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    city: s.city,
    district: s.district,
    state: s.state,
    country: s.country,
    academic_year: s.academic_year,
    status: s.status,
    school_code: s.school_code,
    students: s.students?.[0]?.count ?? 0,
  }));
}

/** Full record for one school (admin detail view). */
export async function getSchoolById(id: string) {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("schools").select("*").eq("id", id).maybeSingle();
  return data as Record<string, string | null> | null;
}

export type SchoolFilters = {
  year?: string;
  state?: string;
  district?: string;
  city?: string;
  q?: string;
};

/** Apply the cascading filters + free-text search. Empty values match all. */
export function applyFilters(schools: AdminSchool[], f: SchoolFilters): AdminSchool[] {
  const q = (f.q ?? "").trim().toLowerCase();
  return schools.filter(
    (s) =>
      (!f.year || s.academic_year === f.year) &&
      (!f.state || s.state === f.state) &&
      (!f.district || s.district === f.district) &&
      (!f.city || s.city === f.city) &&
      (!q ||
        s.name.toLowerCase().includes(q) ||
        (s.school_code ?? "").toLowerCase().includes(q))
  );
}

/** Distinct options for each filter, narrowed by the levels above it. */
export function filterOptions(schools: AdminSchool[], f: SchoolFilters) {
  const uniq = (xs: (string | null)[]) =>
    [...new Set(xs.filter((x): x is string => !!x))].sort();

  const byYear = schools.filter((s) => !f.year || s.academic_year === f.year);
  const byState = byYear.filter((s) => !f.state || s.state === f.state);
  const byDistrict = byState.filter((s) => !f.district || s.district === f.district);

  return {
    years: uniq(schools.map((s) => s.academic_year)),
    states: uniq(byYear.map((s) => s.state)),
    districts: uniq(byState.map((s) => s.district)),
    cities: uniq(byDistrict.map((s) => s.city)),
  };
}
