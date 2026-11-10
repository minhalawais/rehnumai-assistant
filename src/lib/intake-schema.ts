import { z } from "zod";

export const loginSchema = z.object({ email: z.string().email().max(254), password: z.string().min(8).max(128) });

const migrantCategorySchema = z.enum(["potential_migrants", "return_migrants"]);

function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export const caseDraftSchema = z.object({
  language: z.enum(["ur", "en"]).default("ur"),
  migrantCategory: migrantCategorySchema,
  fullName: z.string().trim().min(1).max(120),
  primaryPhone: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .refine(value => phoneDigits(value).length >= 7, { message: "Enter a valid mobile number." }),
  email: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  address: z.string().trim().max(240).optional().or(z.literal("")),
  fatherHusbandName: z.string().trim().max(120).optional().or(z.literal("")),
  gender: z.string().max(20).optional(),
  maritalStatus: z.string().max(20).optional(),
  religion: z.string().max(20).optional(),
  cnic: z.string().trim().max(20).optional().or(z.literal("")),
  passportNo: z.string().trim().max(40).optional().or(z.literal("")),
  passportNoAlt: z.string().trim().max(40).optional().or(z.literal("")),
  qualification: z.string().max(40).optional(),
  tradeSkill: z.string().trim().max(120).optional().or(z.literal("")),
  countryReturnFrom: z.string().trim().max(80).optional().or(z.literal("")),
  reasonForReturning: z.string().max(40).optional(),
  dateOfReturn: z.string().trim().max(40).optional().or(z.literal("")),
  currentStatus: z.string().max(40).optional(),
  bankAccountMode: z.string().max(20).optional(),
  bankRelation: z.string().max(40).optional(),
  bankName: z.string().trim().max(80).optional().or(z.literal("")),
  accountTitle: z.string().trim().max(120).optional().or(z.literal("")),
  iban: z.string().trim().max(34).optional().or(z.literal("")),
});

export const partialCaseSchema = caseDraftSchema.partial().extend({ language: z.enum(["ur", "en"]).default("ur") });
export type CaseDraftInput = z.infer<typeof caseDraftSchema>;
