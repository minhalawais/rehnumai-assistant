import type { Metadata } from "next";
import { staffPrivacyMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = staffPrivacyMetadata;

export default function StaffPrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
