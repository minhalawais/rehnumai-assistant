import { describe, expect, it } from "vitest";
import { cnicMatchPattern, identityFromAnswers, normalizeCnic, normalizePassport, passportMatchPattern } from "@/lib/intake-identity";

describe("intake identity", () => {
  it("treats dashed and plain CNIC values as the same number", () => {
    expect(normalizeCnic("35202-9876543-1")).toBe("3520298765431");
    expect("35202-9876543-1").toMatch(new RegExp(cnicMatchPattern("3520298765431")));
    expect(identityFromAnswers({ cnic: "35202-9876543-1", passportNo: "ab-12 34", passportNoAlt: "AB1234" }).passports).toEqual(["AB1234"]);
  });

  it("matches a passport ignoring spaces, dashes, and letter case", () => {
    expect(normalizePassport(" zx-998877 ")).toBe("ZX998877");
    expect("zx-998877").toMatch(new RegExp(passportMatchPattern("ZX998877"), "i"));
  });

  it("does not treat a blank document as an identity", () => {
    expect(identityFromAnswers({ cnic: " - ", passportNo: "", passportNoAlt: "---" })).toEqual({ cnic: "", passports: [] });
  });
});
