import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession, sessionHasRole } from "@/lib/auth";
import { portalMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = portalMetadata;

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await getSession();
  if (!session) redirect("/login");
  if (!sessionHasRole(session, ["data_entry", "case_manager", "program_manager"])) redirect("/login");
  return children;
}
