import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BookUser,
  Files,
  GraduationCap,
  HeartPulse,
  Languages,
  UserCheck,
  Wrench,
} from "lucide-react";

const DOCUMENT_ICONS: LucideIcon[] = [
  BookUser,
  GraduationCap,
  Wrench,
  BadgeCheck,
  HeartPulse,
  UserCheck,
  Languages,
  Files,
];

export function GuideDocumentList({ items }: { items: string[] }) {
  return (
    <ul className="guide__document-list">
      {items.map((item, index) => {
        const Icon = DOCUMENT_ICONS[index] ?? Files;
        return (
          <li key={item} className="guide__document-item">
            <span className="guide__document-icon" aria-hidden>
              <Icon size={24} strokeWidth={1.9} />
            </span>
            <span className="guide__document-label urdu">{item}</span>
          </li>
        );
      })}
    </ul>
  );
}
