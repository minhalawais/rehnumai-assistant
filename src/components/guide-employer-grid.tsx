import type { LucideIcon } from "lucide-react";
import { Handshake, Home, IdCard, Receipt, Scale, ShieldAlert } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  laws: Scale,
  contact: Handshake,
  sponsor: IdCard,
  statement: Receipt,
  facilities: Home,
  complaint: ShieldAlert,
};

export type EmployerGridCell = { text: string; icon: keyof typeof ICONS };

export function GuideEmployerGrid({ rows }: { rows: EmployerGridCell[][] }) {
  return (
    <div className="guide__employer-grid-wrap" dir="ltr">
      <table className="guide__employer-grid">
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell) => {
                const Icon = ICONS[cell.icon] ?? Scale;
                return (
                  <td key={cell.text} className="guide__employer-grid-cell">
                    <div className="guide__employer-grid-inner">
                      <span className="guide__employer-grid-icon" aria-hidden>
                        <Icon size={28} strokeWidth={1.65} />
                      </span>
                      <p className="guide__employer-grid-text urdu" dir="rtl">
                        {cell.text}
                      </p>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
