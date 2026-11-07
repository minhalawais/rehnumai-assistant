import type { Metadata } from "next";
import { accountHelpMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = accountHelpMetadata;

export default function AccountHelpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
