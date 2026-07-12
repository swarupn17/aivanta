import type { SupabaseClient } from "@supabase/supabase-js";
import { ApiError } from "../lib/http";

export type School = { id: string; name: string };

/**
 * The school owned by the current user (after they've claimed a code).
 * Uses the user-scoped client, so RLS guarantees a user only ever sees their
 * own school. Throws a friendly 400 when they haven't claimed one yet.
 */
export async function getMySchool(
  supabase: SupabaseClient,
  userId: string
): Promise<School> {
  const { data } = await supabase
    .from("schools")
    .select("id, name")
    .eq("owner_profile_id", userId)
    .maybeSingle();

  if (!data) {
    throw new ApiError(400, "Claim your school with a code first.");
  }
  return data as School;
}
