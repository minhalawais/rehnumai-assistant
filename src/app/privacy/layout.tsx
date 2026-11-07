import type { Metadata } from "next";
import { privacyMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = privacyMetadata;

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
