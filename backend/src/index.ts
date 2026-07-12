import { createApp } from "./app";
import { env, isSupabaseConfigured } from "./env";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`[api] aivanta-api listening on http://localhost:${env.PORT}`);
  console.log(`[api] CORS origin(s): ${env.CORS_ORIGIN}`);
  if (!isSupabaseConfigured) {
    console.warn(
      "[api] WARNING: Supabase not configured — auth + DB routes will 503. " +
        "Set SUPABASE_URL / SUPABASE_ANON_KEY in backend/.env."
    );
  }
});
