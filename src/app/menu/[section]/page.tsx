"use client";

import { useParams } from "next/navigation";
import { ManzilSectionMenu } from "@/components/manzil-section-menu";

export default function MenuSectionPage() {
  const params = useParams<{ section: string }>();
  const sectionId = Array.isArray(params.section) ? params.section[0] : params.section;
  return <ManzilSectionMenu sectionId={sectionId} />;
}
