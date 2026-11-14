import { ContentImage } from "@/components/content-image";

function StepCheck() {
  return (
    <span className="guide__airport-step-box" aria-hidden>
      <span className="guide__airport-step-tick">✓</span>
    </span>
  );
}

export function GuideYellowChecklist({
  banner,
  items,
  photo,
}: {
  banner: string;
  items: string[];
  photo?: string;
}) {
  return (
    <div className="guide__yellow-checklist">
      <h2 className="guide__airport-banner urdu" dir="rtl">
        {banner}
      </h2>
      <ol className="guide__airport-steps">
        {items.map((line) => (
          <li key={line} className="guide__airport-step">
            <span className="guide__airport-step-text urdu" dir="rtl">
              {line}
            </span>
            <StepCheck />
          </li>
        ))}
      </ol>
      {photo ? (
        <figure className="guide__airport-photo">
          <ContentImage src={photo} alt="" preset="figure" />
        </figure>
      ) : null}
    </div>
  );
}
