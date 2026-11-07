import type { Document } from "mongodb";
import { sessionHasRole } from "./auth";

type Role = { role?: string; fieldClearance?: string };
type Session = { tenantId: string; roles?: (string | Role)[] };

export function caseScope(rawSession: unknown): Document | null {
  const session = rawSession as Session;
  if (!sessionHasRole(session, ["data_entry", "case_manager", "program_manager"])) return null;
  return { tenantId: session.tenantId, status: "submitted" };
}

export function hasP3Access(rawSession: unknown) {
  const session = rawSession as Session;
  return (session.roles ?? []).some(entry => typeof entry === "object" && entry.role === "case_manager" && entry.fieldClearance === "P3");
}
