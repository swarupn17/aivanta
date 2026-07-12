import { Router } from "express";
import { isSupabaseConfigured } from "../env";

export const healthRouter = Router();

/** Liveness + config probe. Handy for `curl` smoke tests and uptime checks. */
healthRouter.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "aivanta-api",
    supabaseConfigured: isSupabaseConfigured,
    time: new Date().toISOString(),
  });
});
