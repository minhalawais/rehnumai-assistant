import { ContentImage } from "@/components/content-image";

const BRANDS = [
  { name: "WorldRemit", logo: "/guide/remittance-brands/worldremit.png" },
  { name: "TransFast", logo: "/guide/remittance-brands/transfast.png" },
  { name: "MoneyGram", logo: "/guide/remittance-brands/moneygram.png" },
  { name: "Western Union", logo: "/guide/remittance-brands/western-union.png" },
] as const;

function wuHref(url: string) {
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function GuidePrivateCompanies({
  intro,
  officePhoto,
  westernUnionUrl,
  followUp,
  transferPhoto,
  brandsImage,
}: {
  intro: string;
  officePhoto: string;
  westernUnionUrl: string;
  followUp: string;
  transferPhoto: string;
  brandsImage?: string;
}) {
  return (
    <div className="guide__pc">
      <section className="guide__pc-block">
        <div className="guide__pc-row guide__pc-row--intro">
          <p className="guide__pc-text urdu">{intro}</p>
          <figure className="guide__pc-photo guide__pc-photo--soft">
            <ContentImage src={officePhoto} alt="" preset="figure" />
          </figure>
        </div>
      </section>

      <a className="guide__pc-url focus-ring" href={wuHref(westernUnionUrl)} target="_blank" rel="noopener noreferrer" dir="ltr">
        {westernUnionUrl.replace(/^https?:\/\//i, "")}
      </a>

      <section className="guide__pc-block guide__pc-block--follow">
        <div className="guide__pc-row guide__pc-row--follow">
          <figure className="guide__pc-photo">
            <ContentImage src={transferPhoto} alt="" preset="figure" />
          </figure>
          <p className="guide__pc-text urdu">{followUp}</p>
        </div>
      </section>

      {brandsImage ? (
        <figure className="guide__pc-brands-figure">
          <ContentImage src={brandsImage} alt="" preset="figure" />
        </figure>
      ) : (
        <ul className="guide__pc-brands" aria-label="Money transfer brands">
          {BRANDS.map((brand, index) => (
            <li key={brand.name} className={index === 0 ? "guide__pc-brand" : "guide__pc-brand guide__pc-brand--sep"}>
              <ContentImage className="guide__pc-brand-logo" src={brand.logo} alt={brand.name} preset="logo" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
