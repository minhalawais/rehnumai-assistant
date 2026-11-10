const STORAGE_KEY = "rehnumai_public_intake_submitted";
const REF_KEY = `${STORAGE_KEY}_ref`;
export const CLIENT_REQUEST_ID_KEY = "rehnumai_public_intake_client_request_id";

export function hasPublicIntakeSubmitted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function getPublicIntakeReference(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(REF_KEY);
  } catch {
    return null;
  }
}

export function markPublicIntakeSubmitted(reference?: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
    if (reference) window.localStorage.setItem(REF_KEY, reference);
  } catch {
    /* private mode */
  }
}

export function clearPublicIntakeSubmitted(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(REF_KEY);
  } catch {
    /* private mode */
  }
}

export function getPersistedClientRequestId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(CLIENT_REQUEST_ID_KEY);
  } catch {
    return null;
  }
}

export function persistClientRequestId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CLIENT_REQUEST_ID_KEY, id);
  } catch {
    /* private mode */
  }
}

export function clearPersistedClientRequestId(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(CLIENT_REQUEST_ID_KEY);
  } catch {
    /* private mode */
  }
}
