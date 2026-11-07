import type { Metadata } from "next";
import { intakeMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = intakeMetadata;

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
