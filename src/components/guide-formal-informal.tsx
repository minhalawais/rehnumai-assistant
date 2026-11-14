import { LinkText } from "@/components/guide-link-text";

function listItems(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^[-–•]\s*/, "").trim())
    .filter((line) => line && !/^[.\-۔\s]+$/.test(line));
}

function FiSection({ title, tone, text }: { title: string; tone: "good" | "risk"; text: string }) {
  const items = listItems(text);
  return (
    <section className={`guide__fi-section guide__fi-section--${tone}`}>
      <h3 className="guide__fi-section-title urdu">{title}</h3>
      <ul className="guide__fi-list">
        {items.map((item, index) => (
          <li key={index} className="guide__fi-item urdu">
            <span className="guide__fi-bullet" aria-hidden />
            <span className="guide__fi-item-text">
              <LinkText text={item} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function isFormalInformalCompare(head: string[] | null, body: string[][]): boolean {
  if (!head || head.length !== 3 || body.length < 1) return false;
  const [a, b, c] = head.map((cell) => cell.replace(/\s+/g, " ").trim());
  return a === "نقصانات" && b === "فوائد" && c === "ذرائع";
}

export function GuideFormalInformal({ rows }: { rows: string[][] }) {
  const head = rows[0];
  const body = rows.slice(1);
  const disadvantage = head[0] ?? "نقصانات";
  const benefits = head[1] ?? "فوائد";

  return (
    <div className="guide__fi" dir="rtl">
      {body.map((row, index) => {
        const source = row[2]?.trim() ?? "";
        const informal = /غیر/.test(source);
        return (
          <article
            key={index}
            className={informal ? "guide__fi-channel guide__fi-channel--informal" : "guide__fi-channel guide__fi-channel--formal"}
          >
            <header className="guide__fi-channel-head">
              <p className="guide__fi-channel-kicker urdu">ذرائع</p>
              <h2 className="guide__fi-channel-title urdu">{source}</h2>
            </header>
            <div className="guide__fi-channel-body">
              <FiSection title={disadvantage} tone="risk" text={row[0] ?? ""} />
              <FiSection title={benefits} tone="good" text={row[1] ?? ""} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
