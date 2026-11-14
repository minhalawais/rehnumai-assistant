import { LinkText } from "@/components/guide-link-text";

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
        {items.map((item) => (
          <li key={item.title} className="guide__factor">
            <h3 className="guide__factor-title urdu">{item.title}</h3>
            <p className="guide__factor-text urdu">
              <LinkText text={item.text} />
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
