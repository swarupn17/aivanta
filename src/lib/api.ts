import { createClient } from "@/lib/supabase/client";
import { clientEnv, isSupabaseConfigured } from "@/lib/env";

/**
 * Browser → Node API client.
 *
 * Talks to the separate backend (see /backend) over HTTP. For authenticated
 * calls we pull the current Supabase access token from the browser session and
 * send it as `Authorization: Bearer <jwt>`. The API forwards that token to
 * Postgres, so Row-Level Security enforces access exactly as before — the auth
 * model is unchanged, only the transport moved out of the Next server.
 *
 * Every call resolves to a discriminated `{ ok: true, ... } | { ok: false, error }`
 * union, so callers never have to try/catch network noise.
 */

const BASE = clientEnv.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

export type ApiOk<T> = { ok: true } & T;
export type ApiErr = { ok: false; error: string };
export type ApiResult<T> = ApiOk<T> | ApiErr;

const NETWORK_ERROR =
  "Could not reach the server. Please check your connection and try again.";

/** Current Supabase access token from the browser session, or null. */
async function getAccessToken(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

type RequestOptions = {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
  /** Attach the Supabase bearer token (for RLS-protected endpoints). */
  auth?: boolean;
};

async function request<T>(
  path: string,
  { method = "GET", body, auth = false }: RequestOptions = {}
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = await getAccessToken();
    if (!token) return { ok: false, error: "Please log in." };
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    return { ok: false, error: NETWORK_ERROR };
  }

  // The API always speaks JSON; be defensive if something upstream doesn't.
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    return { ok: false, error: NETWORK_ERROR };
  }

  if (data && typeof data === "object" && "ok" in data) {
    return data as ApiResult<T>;
  }
  return { ok: false, error: "Unexpected response from the server." };
}

export const api = {
  get: <T>(path: string, auth = false) => request<T>(path, { method: "GET", auth }),
  post: <T>(path: string, body?: unknown, auth = false) =>
    request<T>(path, { method: "POST", body, auth }),
  del: <T>(path: string, auth = false) => request<T>(path, { method: "DELETE", auth }),
};
