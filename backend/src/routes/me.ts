import { Router } from "express";
import { asyncHandler } from "../lib/http";
import { requireAuth } from "../middleware/auth";

export const meRouter = Router();

/**
 * GET /api/me — the current user + profile + claimed school (or nulls).
 * Mirrors the old `getCurrentUser` + `getMySchool`. RLS scopes every read.
 * Not consumed by the frontend yet (portal reads still run in the Next server);
 * it's here so the API is complete and independently testable via curl.
 */
meRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const supabase = req.supabase!;
    const user = req.user!;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { data: school } = await supabase
      .from("schools")
      .select("*")
      .eq("owner_profile_id", user.id)
      .maybeSingle();

    res.json({
      ok: true,
      user: { id: user.id, email: user.email ?? null },
      profile: profile ?? null,
      school: school ?? null,
    });
  })
);
