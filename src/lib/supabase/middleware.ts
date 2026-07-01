import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, clientEnv } from "@/lib/env";

/**
 * Refreshes the Supabase auth session on every request and keeps cookies in sync.
 * Called from the root `middleware.ts`. Returns the response to send onward.
 *
 * No-ops cleanly until Supabase is configured, so the marketing site runs with
 * zero setup. This is the canonical Supabase SSR middleware pattern otherwise —
 * do not remove the `getUser()` call; it's what refreshes expired tokens.
 */
export async function updateSession(request: NextRequest) {
  // Before Supabase is wired up, just pass requests through untouched.
  if (!isSupabaseConfigured) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL!,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: refreshes the session. Keep this here.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Gate the authenticated portal. Public marketing pages stay open.
  const isPortal = request.nextUrl.pathname.startsWith("/portal");
  if (isPortal && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
