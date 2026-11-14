import { ContentImage } from "@/components/content-image";
import { GuideEmployerGrid, type EmployerGridCell } from "@/components/guide-employer-grid";

export function GuideEmployerSponsor({
  sponsorIntro,
  sponsorPhoto,
  sponsorNote,
  grid,
}: {
  sponsorIntro: string[];
  sponsorPhoto: string;
  sponsorNote: string;
  grid: EmployerGridCell[][];
}) {
  return (
    <div className="guide__employer-sponsor">
      <div className="guide__sponsor-intro" dir="ltr">
        <figure className="guide__sponsor-photo">
          <ContentImage src={sponsorPhoto} alt="" preset="figure" />
        </figure>
        <div className="guide__sponsor-copy" dir="rtl">
          {sponsorIntro.map((paragraph) => (
            <p key={paragraph} className="guide__sponsor-p urdu">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <p className="guide__sponsor-note urdu" dir="rtl">
        {sponsorNote}
      </p>
      <GuideEmployerGrid rows={grid} />
    </div>
  );
}
