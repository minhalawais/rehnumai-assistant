/** Site-wide titles and PWA copy (English; Urdu UI strings stay in locale). */
export const siteConfig = {
  applicationName: "Rehnumai",
  defaultTitle: "Rehnumai | Migration support booklet",
  titleTemplate: "%s | Rehnumai",
  defaultDescription:
    "Urdu-first migration readiness booklet, public intake, and staff review workspace for safe and legal migration preparation.",
  themeColor: "#062e43",
  backgroundColor: "#f4f7f5",
  manifestDescription: "Migration readiness booklet and intake for safe and legal migration preparation.",
} as const;

export const pageTitles = {
  login: "Login",
  intake: "Migration intake form",
  portal: "Staff portal",
  submissions: "Submitted forms",
  submission: "Submitted form",
  privacy: "Privacy and use",
  staffPrivacy: "Staff privacy",
  accountHelp: "Account help",
} as const;

export function resolveMetadataBase(): URL {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (raw) return new URL(raw);
  if (process.env.VERCEL_URL) return new URL(`https://${process.env.VERCEL_URL}`);
  return new URL("http://localhost:3000");
}
