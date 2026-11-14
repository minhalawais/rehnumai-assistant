import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Building2,
  FilePenLine,
  FileSearch,
  HandHelping,
  Plane,
  Receipt,
  ShieldCheck,
  Users,
  Wallet,
  Stamp,
} from "lucide-react";

const ROW_ICONS: LucideIcon[] = [
  Building2,
  ShieldCheck,
  Receipt,
  FilePenLine,
  HandHelping,
  AlertCircle,
  Users,
  Plane,
  Stamp,
  Wallet,
  FileSearch,
];

/** RTL display: نمبر → آئیکن → تفصیل → چیک لسٹ */
const COLUMN_ORDER = ["num", "icon", "detail", "check"] as const;

type ParsedRow = { num: string; detail: string };

function parseBody(rows: string[][]): ParsedRow[] {
  return rows
    .map((row) => {
      const cells = row.map((c) => c.trim());
      const num = cells.find((c) => /^\d{1,2}$/.test(c)) ?? cells[cells.length - 1] ?? "";
      const detail = cells.find((c) => c.length > 12 && !/^\d{1,2}$/.test(c)) ?? "";
      return { num, detail };
    })
    .filter((row) => row.detail);
}

export function GuideDepartureTable({ rows }: { rows: string[][] }) {
  const head = rows[0] ?? [];
  const body = parseBody(rows.slice(1));
  const headCheck = head.map((c) => c.replace(/\s+/g, " ").trim()).find((c) => c.includes("چیک")) ?? "چیک لسٹ";
  const headDetail = head.map((c) => c.trim()).find((c) => c === "تفصیل") ?? "تفصیل";
  const headNum = head.map((c) => c.trim()).find((c) => c === "نمبر") ?? "نمبر";

  const headers: Record<(typeof COLUMN_ORDER)[number], string> = {
    check: headCheck,
    detail: headDetail,
    icon: "",
    num: headNum,
  };

  return (
    <div className="guide__checklist-table-wrap guide__departure-table-wrap">
      <table className="guide__checklist-table guide__departure-table">
        <thead>
          <tr>
            {COLUMN_ORDER.map((key) => (
              <th
                key={key}
                scope="col"
                className={
                  key === "num"
                    ? "guide__checklist-th guide__checklist-th--num"
                    : key === "detail"
                      ? "guide__checklist-th guide__checklist-th--doc"
                      : key === "icon"
                        ? "guide__checklist-th guide__checklist-th--icon"
                        : "guide__checklist-th guide__checklist-th--tick"
                }
              >
                {headers[key] ? <span className="urdu">{headers[key]}</span> : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => {
            const Icon = ROW_ICONS[rowIndex] ?? FileSearch;
            return (
              <tr key={row.num}>
                {COLUMN_ORDER.map((key) => {
                  if (key === "num") {
                    return (
                      <td key={key} className="guide__checklist-td guide__checklist-td--num" dir="ltr">
                        {row.num}
                      </td>
                    );
                  }
                  if (key === "icon") {
                    return (
                      <td key={key} className="guide__checklist-td guide__checklist-td--icon">
                        <Icon className="guide__departure-icon" size={26} strokeWidth={1.75} aria-hidden />
                      </td>
                    );
                  }
                  if (key === "detail") {
                    return (
                      <td key={key} className="guide__checklist-td guide__checklist-td--doc urdu">
                        {row.detail}
                      </td>
                    );
                  }
                  return (
                    <td key={key} className="guide__checklist-td guide__checklist-td--tick">
                      <span className="guide__departure-check" aria-hidden>
                        ✓
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
