import { ContentImage } from "@/components/content-image";
import { GuideYellowChecklist } from "@/components/guide-yellow-checklist";

export function GuideAirportGuide({
  banner,
  precautions,
  photo,
  warnings,
  warningIcon,
}: {
  banner: string;
  precautions: string[];
  photo: string;
  warnings: string[];
  warningIcon: string;
}) {
  return (
    <div className="guide__airport">
      <GuideYellowChecklist banner={banner} items={precautions} photo={photo} />
      <aside className="guide__airport-warn" aria-label="احتیاط" dir="rtl">
        <div className="guide__airport-warn-icon-wrap" aria-hidden>
          <ContentImage src={warningIcon} alt="" preset="icon" className="guide__airport-warn-icon" />
        </div>
        <ul className="guide__airport-warn-list">
          {warnings.map((line) => (
            <li key={line} className="guide__airport-warn-item urdu" dir="rtl">
              <span className="guide__airport-warn-bullet" aria-hidden />
              <span className="guide__airport-warn-copy">{line}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
