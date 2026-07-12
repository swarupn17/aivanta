import { Router } from "express";
import { asyncHandler, ApiError } from "../lib/http";
import { createAdminClient } from "../lib/supabase";
import { isSupabaseConfigured } from "../env";
import { contactSchema } from "../domain/schemas";

export const contactRouter = Router();

/**
 * POST /api/contact — public contact message.
 * No auth: uses the service-role (admin) client to insert the lead. Mirrors the
 * old `submitContactMessage` server action, including the dev no-op fallback.
 */
contactRouter.post(
  "/contact",
  asyncHandler(async (req, res) => {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, "Please check the form and try again.");
    }

    if (!isSupabaseConfigured) {
      console.info("[contact] (not persisted — Supabase off)", parsed.data);
    } else {
      const supabase = createAdminClient();
      const { error } = await supabase.from("contact_messages").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone ?? null,
        role: parsed.data.role,
        message: parsed.data.message,
      });
      if (error) {
        console.error("[contact] insert failed", error);
        throw new ApiError(500, "Something went wrong. Please email us directly.");
      }
    }

    res.json({
      ok: true,
      message:
        "Thank you! Your message has been received. Our team will get back to you shortly.",
    });
  })
);
