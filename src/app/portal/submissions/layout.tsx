import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/page-metadata";
import { pageTitles } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata(pageTitles.submissions, { robotsIndex: false });

export default function SubmissionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
