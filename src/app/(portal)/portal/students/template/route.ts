import { getCurrentUser } from "@/features/auth/queries";
import { buildTemplateWorkbook } from "@/features/students/excel";

const XLSX_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/** GET /portal/students/template -> the styled .xlsx fill-in template. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const buf = await buildTemplateWorkbook();
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": XLSX_TYPE,
      "Content-Disposition":
        'attachment; filename="aivanta-students-template.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
