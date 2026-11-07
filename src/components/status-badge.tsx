"use client";
import { AlertCircle, CheckCircle2, Clock3, FilePenLine, FileText } from "lucide-react";
import { localizedStatus } from "@/lib/client-api";
import { useLocale } from "@/components/locale";

const styles: Record<string, { tone: string; icon: typeof FileText }> = {
  draft: { tone: "bg-[#eef2f1] text-[var(--ink-700)]", icon: FilePenLine },
  submitted: { tone: "bg-[#e5f0f5] text-[var(--navy-900)]", icon: Clock3 },
  under_review: { tone: "bg-[#e5f0f5] text-[var(--navy-900)]", icon: Clock3 },
  needs_correction: { tone: "bg-[var(--amber-100)] text-[var(--amber-700)]", icon: AlertCircle },
  on_hold: { tone: "bg-[#eef2f1] text-[var(--ink-700)]", icon: AlertCircle },
  closed: { tone: "bg-[var(--teal-100)] text-[var(--teal-700)]", icon: CheckCircle2 },
};
export function StatusBadge({ value }: { value: string }) { const { language } = useLocale(); const item = styles[value] ?? { tone: "bg-[#eef2f1] text-[var(--ink-700)]", icon: FileText }; const Icon = item.icon; return <span className={`inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1 text-xs font-semibold ${item.tone}`}><Icon size={14} aria-hidden="true" />{localizedStatus(value, language)}</span>; }
