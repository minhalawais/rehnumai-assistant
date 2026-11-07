const STORAGE_KEY = "rehnumai_public_intake_submitted";

export function hasPublicIntakeSubmitted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markPublicIntakeSubmitted(reference?: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
    if (reference) window.localStorage.setItem(`${STORAGE_KEY}_ref`, reference);
  } catch {
    /* private mode */
  }
}
