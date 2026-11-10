import { describe, expect, it } from "vitest";
import { caseDraftSchema } from "@/lib/intake-schema";

const base = {
  language: "en" as const,
  migrantCategory: "potential_migrants" as const,
  fullName: "Ali Khan",
  primaryPhone: "03001234567",
  email: "",
  city: "",
  address: "",
  fatherHusbandName: "",
  gender: "",
  maritalStatus: "",
  religion: "",
  cnic: "",
  passportNo: "",
  passportNoAlt: "",
  qualification: "",
  tradeSkill: "",
  countryReturnFrom: "",
  reasonForReturning: "",
  dateOfReturn: "",
  currentStatus: "",
  helpTopics: [] as string[],
  bankAccountMode: "",
  bankRelation: "",
  bankName: "",
  accountTitle: "",
  iban: "",
};

describe("caseDraftSchema", () => {
  it("accepts valid minimal payload", () => {
    expect(caseDraftSchema.safeParse(base).success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = caseDraftSchema.safeParse({ ...base, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid gender enum", () => {
    const result = caseDraftSchema.safeParse({ ...base, gender: "alien" });
    expect(result.success).toBe(false);
  });

  it("rejects short phone", () => {
    const result = caseDraftSchema.safeParse({ ...base, primaryPhone: "123" });
    expect(result.success).toBe(false);
  });
});
