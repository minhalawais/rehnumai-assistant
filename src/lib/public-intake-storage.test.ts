/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  clearPublicIntakeSubmitted,
  getPublicIntakeReference,
  hasPublicIntakeSubmitted,
  markPublicIntakeSubmitted,
} from "@/lib/public-intake-storage";

describe("public-intake-storage", () => {
  beforeEach(() => {
    clearPublicIntakeSubmitted();
  });

  it("tracks submission and reference", () => {
    expect(hasPublicIntakeSubmitted()).toBe(false);
    markPublicIntakeSubmitted("MIG-26-ABCD1234");
    expect(hasPublicIntakeSubmitted()).toBe(true);
    expect(getPublicIntakeReference()).toBe("MIG-26-ABCD1234");
  });
});
