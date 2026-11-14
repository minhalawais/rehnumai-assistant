import { ContentImage } from "@/components/content-image";

export function GuideWorkerRights({
  intro,
  image,
  rightsTitle,
  rights,
  dutiesTitle,
  duties,
}: {
  intro: string;
  image: string;
  rightsTitle: string;
  rights: string[];
  dutiesTitle: string;
  duties: string[];
}) {
  return (
    <div className="guide__worker-rights">
      <p className="guide__worker-rights-intro urdu" dir="rtl">
        {intro}
      </p>
      <figure className="guide__figure guide__worker-rights-infographic">
        <ContentImage src={image} alt="" preset="figure" />
      </figure>
      <div className="guide__worker-rights-panels" dir="ltr">
        <section className="guide__worker-rights-panel guide__worker-rights-panel--duties" dir="rtl">
          <h2 className="guide__worker-rights-heading urdu">{dutiesTitle}</h2>
          <ul className="guide__worker-rights-list">
            {duties.map((item) => (
              <li key={item} className="guide__worker-rights-item urdu">
                <span className="guide__worker-rights-bullet" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="guide__worker-rights-panel guide__worker-rights-panel--rights" dir="rtl">
          <h2 className="guide__worker-rights-heading urdu">{rightsTitle}</h2>
          <ul className="guide__worker-rights-list">
            {rights.map((item) => (
              <li key={item} className="guide__worker-rights-item urdu">
                <span className="guide__worker-rights-bullet" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
