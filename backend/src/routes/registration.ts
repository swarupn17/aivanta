import { Router } from "express";
import { asyncHandler, ApiError } from "../lib/http";
import { createAdminClient } from "../lib/supabase";
import { isSupabaseConfigured } from "../env";
import { registrationSchema } from "../domain/schemas";

export const registrationRouter = Router();

/**
 * POST /api/registration — public school code-request (SOF-style lead).
 * No auth: service-role insert into `registration_leads` (status: pending).
 * Mirrors the old `submitRegistration` server action + dev no-op fallback.
 */
registrationRouter.post(
  "/registration",
  asyncHandler(async (req, res) => {
    const parsed = registrationSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, "Please check the form and try again.");
    }
    const d = parsed.data;

    if (!isSupabaseConfigured) {
      console.info("[registration] (not persisted — Supabase off)", d);
    } else {
      const supabase = createAdminClient();
      const { error } = await supabase.from("registration_leads").insert({
        applicant_role: d.applicantRole,
        applicant_name: d.applicantName,
        applicant_email: d.applicantEmail,
        applicant_mobile: d.applicantMobile,
        school_name: d.schoolName,
        school_address: d.schoolAddress,
        city: d.city,
        district: d.district,
        state: d.state,
        country: d.country,
        pincode: d.pincode,
        school_email: d.schoolEmail,
        school_phone: d.schoolPhone,
        principal_name: d.principalName,
        principal_contact: d.principalContact,
      });
      if (error) {
        console.error("[registration] insert failed", error);
        throw new ApiError(500, "Something went wrong. Please email us directly.");
      }
    }

    res.json({
      ok: true,
      message:
        "Thank you! Your request has been received. An Aivanta representative will contact you to assist with registration and issue your school code.",
    });
  })
);
