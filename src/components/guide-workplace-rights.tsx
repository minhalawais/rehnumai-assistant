import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Calendar,
  CalendarOff,
  DoorOpen,
  FileSignature,
  FileText,
  HandCoins,
  Handshake,
  HeartPulse,
  Hourglass,
  IdCard,
  Landmark,
  MessageSquare,
  Moon,
  Plane,
  Scale,
  Shield,
  ShieldCheck,
  Stamp,
  Stethoscope,
  Utensils,
  Wallet,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  food: Utensils,
  health: Stethoscope,
  docs: FileText,
  contract: FileSignature,
  complaints: MessageSquare,
  safety: Shield,
  leave: Calendar,
  wages: Banknote,
  hours: Hourglass,
  permit: IdCard,
  embassy: Landmark,
  remedy: Scale,
  faith: Moon,
  travel: Plane,
  break: DoorOpen,
  holiday: CalendarOff,
  protect: HeartPulse,
  written: FileText,
  passport: Stamp,
  terminate: Scale,
  dues: HandCoins,
  probation: Hourglass,
  legal: ShieldCheck,
  mutual: Handshake,
  pay: Wallet,
};

export type WorkplaceCell = { text: string; icon: keyof typeof ICONS | string };

function cellShaded(index: number, columns: number) {
  const row = Math.floor(index / columns);
  const col = index % columns;
  return (row + col) % 2 === 0;
}

function WorkplaceGrid({
  title,
  tone,
  cells,
  columns,
}: {
  title: string;
  tone: "workers" | "employers";
  cells: WorkplaceCell[];
  columns: number;
}) {
  return (
    <section className={`guide__workplace-section guide__workplace-section--${tone}`}>
      <h2 className={`guide__workplace-title guide__workplace-title--${tone} urdu`} dir="rtl">
        {title}
      </h2>
      <ul className={`guide__workplace-grid guide__workplace-grid--cols-${columns}`}>
        {cells.map((cell, index) => {
          const Icon = ICONS[cell.icon] ?? FileText;
          const shaded = cellShaded(index, columns);
          return (
            <li
              key={cell.text}
              className={`guide__workplace-cell${shaded ? " guide__workplace-cell--shade" : ""}`}
            >
              <span className="guide__workplace-icon" aria-hidden>
                <Icon size={26} strokeWidth={1.65} />
              </span>
              <p className="guide__workplace-text urdu" dir="rtl">
                {cell.text}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function GuideWorkplaceRights({
  workersTitle,
  workers,
  employersTitle,
  employers,
}: {
  workersTitle: string;
  workers: WorkplaceCell[];
  employersTitle: string;
  employers: WorkplaceCell[];
}) {
  return (
    <div className="guide__workplace-rights">
      <WorkplaceGrid title={workersTitle} tone="workers" cells={workers} columns={4} />
      <WorkplaceGrid title={employersTitle} tone="employers" cells={employers} columns={3} />
    </div>
  );
}
