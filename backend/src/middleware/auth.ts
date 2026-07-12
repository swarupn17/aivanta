import type { Request, Response, NextFunction } from "express";
import { ApiError, asyncHandler } from "../lib/http";
import { createUserClient } from "../lib/supabase";
import { isSupabaseConfigured } from "../env";

/**
 * Auth guard for protected routes.
 *
 * Expects `Authorization: Bearer <supabase-access-token>`. We verify the token
 * with Supabase, then attach BOTH the user and a user-scoped client (which
 * forwards the same token, so RLS applies) to the request. This is the piece
 * that keeps the original security model intact across the network boundary.
 */
export const requireAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!isSupabaseConfigured) {
      throw new ApiError(503, "Auth is unavailable — Supabase isn't configured.");
    }

    const header = req.header("authorization") ?? "";
    const token = header.toLowerCase().startsWith("bearer ")
      ? header.slice(7).trim()
      : "";
    if (!token) {
      throw new ApiError(401, "Missing bearer token. Please log in.");
    }

    const supabase = createUserClient(token);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new ApiError(401, "Invalid or expired session. Please log in again.");
    }

    req.user = user;
    req.supabase = supabase;
    req.accessToken = token;
    next();
  }
);
