import type { Metadata } from "next";
import { loginMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = loginMetadata;

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
