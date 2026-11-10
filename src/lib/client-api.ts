export type CaseSummary = {
  caseReference: string;
  status: string;
  applicantSummary?: { displayName?: string };
  migrationSummary?: { category?: string; stage?: string; purpose?: string; destinationCountry?: string };
  attentionSignalCodes?: string[];
  assignedUserId?: string;
  updatedAt?: string;
  submittedAt?: string;
  version?: number;
};

export type CaseDetail = CaseSummary & {
  createdAt?: string;
  answers?: Record<string, unknown>;
  activity?: { action: string; occurredAt: string; actor?: { userId?: string }; metadata?: { reason?: string } }[];
};

export async function apiGet<T>(path: string): Promise<{ data: T; meta?: Record<string, unknown> }> {
  const response = await fetch(path, { cache: "no-store" });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message ?? "Unable to load data.");
  return payload;
}

export async function apiWrite<T>(path: string, method: "POST" | "PATCH", body?: unknown): Promise<{ data: T }> {
  const tokenResponse = await fetch("/api/auth/csrf", { cache: "no-store" });
  if (!tokenResponse.ok) throw new Error("Security verification is unavailable. Try again.");
  const token = (await tokenResponse.json()).data?.token ?? "";
  const response = await fetch(path, { method, headers: { "content-type": "application/json", "x-csrf-token": token }, body: JSON.stringify(body ?? {}) });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message ?? "The action could not be completed.");
  return payload;
}

export function friendlyStatus(status: string) {
  return ({ draft: "Draft", submitted: "Submitted", under_review: "Under review", needs_correction: "Needs correction", on_hold: "On hold", closed: "Closed" } as Record<string, string>)[status] ?? status.replaceAll("_", " ");
}

export function friendlyStage(stage?: string) { return stage ? stage.replaceAll("_", " ").replace(/\b\w/g, letter => letter.toUpperCase()) : "Not set"; }
export function localizedStage(stage: string | undefined, language: "ur" | "en") { if (language === "en") return friendlyStage(stage); return ({ exploring: "غور کر رہے ہیں", preparing: "تیاری", offer_received: "پیشکش ملی ہے", pre_departure: "روانگی سے پہلے", overseas: "بیرون ملک", returned: "واپس آ گئے ہیں", employment: "ملازمت", education: "تعلیم", family: "خاندان", visit: "دورہ", returning_to_job: "ملازمت پر واپسی", undecided: "ابھی طے نہیں", other: "دیگر" } as Record<string, string>)[stage ?? ""] ?? "معلوم نہیں"; }
export function localizedStatus(status: string, language: "ur" | "en") { if (language === "en") return friendlyStatus(status); return ({ draft: "ڈرافٹ", submitted: "جمع ہو چکا", under_review: "ٹیم دیکھ رہی ہے", needs_correction: "درستگی چاہیے", on_hold: "روک دیا گیا", closed: "بند" } as Record<string, string>)[status] ?? status; }
export function shortDate(value?: string, language: "ur" | "en" = "en") {
  if (!value) return "—";
  const locale = language === "ur" ? "ur-PK" : "en-PK";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
