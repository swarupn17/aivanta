import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Request augmentation. `requireAuth` populates these; downstream handlers can
 * rely on `req.user` and `req.supabase` (the user-scoped, RLS-enforcing client).
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
      supabase?: SupabaseClient;
      accessToken?: string;
    }
  }
}

export {};
