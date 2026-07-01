import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Root middleware — refreshes the Supabase session on every request and guards
 * the /portal area. Session refresh is required for SSR auth to work.
 */
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on everything EXCEPT static assets & images, so we don't waste
     * work refreshing sessions for files.
     */
    "/((?!_next/static|_next/image|favicon.ico|img/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
