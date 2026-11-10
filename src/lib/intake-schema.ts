import { z } from "zod";
import {
  bankAccountModeOptions,
  bankRelationOptions,
  currentStatusOptions,
  genderOptions,
  maritalStatusOptions,
  qualificationOptions,
  reasonForReturningOptions,
  religionOptions,
} from "@/lib/kobo-intake-form";

export const loginSchema = z.object({ email: z.string().email().max(254), password: z.string().min(8).max(128) });

const migrantCategorySchema = z.enum(["potential_migrants", "return_migrants"]);

function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

const controlChar = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
function plainText(max: number) {
  return z
    .string()
    .trim()
    .max(max)
    .refine(value => !value || !controlChar.test(value) && !/[<>]/.test(value), { message: "Invalid characters." });
}

function optionalPlainText(max: number) {
  return plainText(max).optional().or(z.literal(""));
}

function keysOf<const T extends readonly (readonly [string, ...unknown[]])[]>(options: T) {
  return options.map(([key]) => key) as [string, ...string[]];
}

const emptyOrEnum = (keys: [string, ...string[]]) => z.union([z.literal(""), z.enum(keys)]);

export const caseDraftSchema = z.object({
  language: z.enum(["ur", "en"]).default("ur"),
  migrantCategory: migrantCategorySchema,
  fullName: plainText(120).min(1),
  primaryPhone: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .refine(value => phoneDigits(value).length >= 7, { message: "Enter a valid mobile number." }),
  email: z.union([z.literal(""), z.string().trim().email().max(120)]),
  city: optionalPlainText(80),
  address: optionalPlainText(240),
  fatherHusbandName: optionalPlainText(120),
  gender: emptyOrEnum(keysOf(genderOptions)),
  maritalStatus: emptyOrEnum(keysOf(maritalStatusOptions)),
  religion: emptyOrEnum(keysOf(religionOptions)),
  cnic: optionalPlainText(20),
  passportNo: optionalPlainText(40),
  passportNoAlt: optionalPlainText(40),
  qualification: emptyOrEnum(keysOf(qualificationOptions)),
  tradeSkill: optionalPlainText(120),
  countryReturnFrom: optionalPlainText(80),
  reasonForReturning: emptyOrEnum(keysOf(reasonForReturningOptions)),
  dateOfReturn: optionalPlainText(40),
  currentStatus: emptyOrEnum(keysOf(currentStatusOptions)),
  bankAccountMode: emptyOrEnum(keysOf(bankAccountModeOptions)),
  bankRelation: emptyOrEnum(keysOf(bankRelationOptions)),
  bankName: optionalPlainText(80),
  accountTitle: optionalPlainText(120),
  iban: z
    .union([
      z.literal(""),
      z
        .string()
        .trim()
        .max(34)
        .refine(value => /^[A-Za-z0-9]+$/.test(value.replace(/\s/g, "")), { message: "Invalid IBAN format." }),
    ]),
});

export const partialCaseSchema = caseDraftSchema.partial().extend({ language: z.enum(["ur", "en"]).default("ur") });
export type CaseDraftInput = z.infer<typeof caseDraftSchema>;
