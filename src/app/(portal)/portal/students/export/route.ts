import { getCurrentUser } from "@/features/auth/queries";
import { getMySchool } from "@/features/schools/queries";
import { listRoster } from "@/features/students/queries";
import { buildRosterWorkbook } from "@/features/students/excel";

const XLSX_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/** GET /portal/students/export -> the caller's roster as a styled .xlsx. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const school = await getMySchool(user.id);
  if (!school) return new Response("No school linked", { status: 403 });
  const s = school as { id: string; name: string };

  const roster = await listRoster(s.id);
  const buf = await buildRosterWorkbook(s.name, roster);
  const slug = s.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "school";

  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": XLSX_TYPE,
      "Content-Disposition": `attachment; filename="${slug}-roster.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
