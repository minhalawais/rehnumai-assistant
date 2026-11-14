import { ContentImage } from "@/components/content-image";

export type RespectLawsColumn = { title: string; text: string };

export function GuideRespectLaws({
  intro,
  images,
  tableTitle,
  columns,
}: {
  intro: string;
  images: string[];
  tableTitle: string;
  columns: RespectLawsColumn[];
}) {
  return (
    <div className="guide__respect-laws">
      <p className="guide__respect-laws-intro urdu" dir="rtl">
        {intro}
      </p>
      {images.map((src) => (
        <figure
          key={src}
          className={
            src.includes("image63")
              ? "guide__figure guide__respect-laws-figure guide__respect-laws-infographic"
              : "guide__figure guide__respect-laws-figure"
          }
        >
          <ContentImage src={src} alt="" preset="figure" />
        </figure>
      ))}
      <div className="guide__instructions-block">
        <h2 className="guide__instructions-title urdu" dir="rtl">
          {tableTitle}
        </h2>
        <div className="guide__instructions-table-wrap">
          <table className="guide__instructions-table guide__instructions-table--vertical">
            <tbody>
              {columns.map((col) => (
                <tr key={col.title}>
                  <th className="guide__instructions-th" scope="row">
                    <span className="urdu" dir="rtl">
                      {col.title}
                    </span>
                  </th>
                  <td className="guide__instructions-td">
                    <span className="urdu" dir="rtl">
                      {col.text}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
