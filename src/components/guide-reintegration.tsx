import { ContentImage } from "@/components/content-image";
import { LinkText } from "@/components/guide-link-text";

export type ReintegrationStep = { num: string; title: string; detail: string };

function detailItems(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !/^[.\-۔\s]+$/.test(line));
}

export function GuideReintegration({
  intro,
  roadmapImage,
  steps,
}: {
  intro: string;
  roadmapImage: string;
  steps: ReintegrationStep[];
}) {
  return (
    <div className="guide__reint" dir="rtl">
      <p className="guide__reint-intro urdu">{intro}</p>

      <figure className="guide__reint-roadmap">
        <ContentImage src={roadmapImage} alt="" preset="figure" />
      </figure>

      <ol className="guide__reint-steps">
        {steps.map((step) => {
          const items = detailItems(step.detail);
          return (
            <li key={step.num} className="guide__reint-step">
              <header className="guide__reint-step-head">
                <span className="guide__reint-step-num" dir="ltr">
                  {step.num}
                </span>
                <h3 className="guide__reint-step-title urdu">{step.title}</h3>
              </header>
              <ul className="guide__reint-list">
                {items.map((item, index) => (
                  <li key={index} className="guide__reint-item urdu">
                    <span className="guide__reint-bullet" aria-hidden />
                    <span className="guide__reint-item-text">
                      <LinkText text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
