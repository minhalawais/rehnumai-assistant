import { describe, expect, it } from "vitest";
import { initialIntake, type IntakeAnswers } from "@/lib/intake-ui";
import {
  RETURN_BLOCK_KEYS,
  applicableFieldKeys,
  isKoboFieldVisible,
  stripHiddenAnswers,
  validatePublicAnswersForCategory,
} from "@/lib/kobo-intake-rules";

describe("isKoboFieldVisible", () => {
  it("hides return block for potential migrants", () => {
    for (const key of RETURN_BLOCK_KEYS) {
      expect(isKoboFieldVisible(key, "potential_migrants")).toBe(false);
    }
    expect(isKoboFieldVisible("fullName", "potential_migrants")).toBe(true);
  });

  it("shows return block for return migrants", () => {
    for (const key of RETURN_BLOCK_KEYS) {
      expect(isKoboFieldVisible(key, "return_migrants")).toBe(true);
    }
  });
});

describe("stripHiddenAnswers", () => {
  it("clears return fields for potential migrants", () => {
    const filled: IntakeAnswers = {
      ...initialIntake,
      migrantCategory: "potential_migrants",
      fullName: "Test User",
      countryReturnFrom: "Saudi Arabia",
      reasonForReturning: "volunteer",
    };
    const stripped = stripHiddenAnswers(filled);
    expect(stripped.countryReturnFrom).toBe("");
    expect(stripped.reasonForReturning).toBe("");
    expect(stripped.fullName).toBe("Test User");
  });
});

describe("validatePublicAnswersForCategory", () => {
  it("rejects return data on potential migrants", () => {
    const answers: IntakeAnswers = {
      ...initialIntake,
      migrantCategory: "potential_migrants",
      currentStatus: "job",
    };
    expect(validatePublicAnswersForCategory(answers).ok).toBe(false);
  });
});

describe("applicableFieldKeys", () => {
  it("excludes return block for potential", () => {
    const keys = applicableFieldKeys("potential_migrants");
    for (const key of RETURN_BLOCK_KEYS) {
      expect(keys).not.toContain(key);
    }
  });
});
