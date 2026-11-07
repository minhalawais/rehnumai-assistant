import { z } from "zod";

export const loginSchema = z.object({ email: z.string().email().max(254), password: z.string().min(8).max(128) });
export const checklistStatusSchema = z.enum(["available", "in_progress", "not_available", "not_applicable", "unknown"]);
function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export const caseDraftSchema = z.object({ language: z.enum(["ur", "en"]).default("ur"), serviceConsent: z.literal(true), contactConsent: z.boolean(), referralConsent: z.boolean().default(false), fullName: z.string().trim().min(1).max(120), primaryPhone: z.string().trim().min(1).max(20).refine(value => phoneDigits(value).length >= 7, { message: "Enter a valid mobile number." }), safeContactMethod: z.enum(["none", "phone", "message"]).default("none"), ageBand: z.string().max(40).optional(), migrationStage: z.enum(["exploring", "preparing", "offer_received", "pre_departure", "overseas", "returned"]), migrationPurpose: z.enum(["employment", "education", "family", "visit", "returning_to_job", "other", "undecided"]), destinationCountry: z.string().trim().max(80).optional(), targetOccupation: z.string().trim().max(120).optional(), recruitmentChannel: z.string().trim().max(80).optional(), readiness: z.record(z.string(), checklistStatusSchema).default({}), safetyAnswers: z.record(z.string(), z.enum(["yes", "no", "skip"])).default({}), attentionSignalCodes: z.array(z.string().regex(/^AT-\d{3}$/)).max(20).default([]), supportNeeded: z.array(z.string().max(60)).max(20).default([]), notes: z.string().trim().max(2000).optional() });
export const partialCaseSchema = caseDraftSchema.partial().extend({ language: z.enum(["ur", "en"]).default("ur"), serviceConsent: z.literal(true) });
export type CaseDraftInput = z.infer<typeof caseDraftSchema>;
