import { LinkText } from "@/components/guide-link-text";
import {
  Frown,
  Fingerprint,
  Hand,
  House,
  Languages,
  ShieldAlert,
  UserLock,
  type LucideIcon,
} from "lucide-react";

const FACTOR_ICONS: LucideIcon[] = [
  Hand,
  ShieldAlert,
  UserLock,
  Fingerprint,
  House,
  Frown,
  Languages,
];

export function GuideFactorGrid({
  intro,
  items,
}: {
  intro?: string;
  items: { title: string; text: string }[];
}) {
  return (
    <section className="guide__factors" dir="rtl">
      {intro ? <p className="guide__factors-intro urdu">{intro}</p> : null}
      <ul className="guide__factors-grid">
        {items.map((item, index) => {
          const Icon = FACTOR_ICONS[index] ?? ShieldAlert;
          return (
            <li key={item.title} className="guide__factor">
              <span className="guide__factor-icon" aria-hidden>
                <Icon strokeWidth={2.2} />
              </span>
              <h3 className="guide__factor-title urdu">{item.title}</h3>
              <p className="guide__factor-text urdu">
                <LinkText text={item.text} />
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
