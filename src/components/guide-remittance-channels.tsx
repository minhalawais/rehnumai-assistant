import type { ReactNode } from "react";
import { ContentImage } from "@/components/content-image";

export function GuideRemittanceChannels({
  image,
  alt,
  footer,
}: {
  image: string;
  alt: string;
  footer: ReactNode;
}) {
  return (
    <section className="guide__remit-infographic" dir="rtl">
      <figure className="guide__figure guide__figure--remittance">
        <ContentImage src={image} alt={alt} preset="figure" />
      </figure>
      <div className="guide__remit-footer urdu">{footer}</div>
    </section>
  );
}
