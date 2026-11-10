"use client";

import { useParams } from "next/navigation";
import { SupportGroupPage } from "@/components/support-pages";

export default function SupportGroupRoute() {
  const params = useParams<{ group: string }>();
  const groupId = Array.isArray(params.group) ? params.group[0] : params.group;
  return <SupportGroupPage groupId={groupId} />;
}
