import { ContentImage } from "@/components/content-image";

export type SaudiAppRow = {
  name: string;
  logo: string;
  purpose: string;
  benefits: string[];
};

export type SmartphoneWarning = {
  title: string;
  body: string;
};

function BenefitsList({ items }: { items: string[] }) {
  return (
    <ul className="guide__apps-benefits" dir="rtl">
      {items.map((item) => (
        <li key={item} className="guide__apps-benefit urdu">
          <span className="guide__apps-benefit-mark" aria-hidden />
          <span className="guide__apps-benefit-text">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function AppLogo({ name, logo }: { name: string; logo: string }) {
  return (
    <figure className="guide__apps-logo-wrap">
      <ContentImage src={logo} alt={name} preset="logo" className="guide__apps-logo" />
    </figure>
  );
}

export function GuideSaudiApps({
  sectionTitle,
  apps,
  warning,
}: {
  sectionTitle: string;
  apps: SaudiAppRow[];
  warning: SmartphoneWarning;
}) {
  return (
    <div className="guide__saudi-apps">
      <h2 className="guide__apps-section-title urdu" dir="rtl">
        {sectionTitle}
      </h2>

      <div className="guide__apps-mobile" dir="rtl">
        {apps.map((app) => (
          <article key={app.name} className="guide__apps-mobile-row">
            <div className="guide__apps-mobile-split">
              <div className="guide__apps-mobile-logo-cell">
                <AppLogo name={app.name} logo={app.logo} />
              </div>
              <div className="guide__apps-mobile-purpose-cell">
                <p className="guide__apps-cell-label urdu">مقصد</p>
                <p className="guide__apps-mobile-purpose urdu">{app.purpose}</p>
              </div>
            </div>
            <div className="guide__apps-mobile-benefits-cell">
              <p className="guide__apps-cell-label urdu">فوائد</p>
              <BenefitsList items={app.benefits} />
            </div>
          </article>
        ))}
      </div>

      <div className="guide__apps-table-wrap guide__apps-table-wrap--desk">
        <table className="guide__apps-table" dir="rtl">
          <thead>
            <tr>
              <th scope="col" className="guide__apps-th urdu">
                ایپ
              </th>
              <th scope="col" className="guide__apps-th urdu">
                مقصد
              </th>
              <th scope="col" className="guide__apps-th urdu">
                فوائد
              </th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app.name}>
                <td className="guide__apps-td guide__apps-td--logo">
                  <AppLogo name={app.name} logo={app.logo} />
                </td>
                <td className="guide__apps-td guide__apps-td--purpose urdu">{app.purpose}</td>
                <td className="guide__apps-td guide__apps-td--benefits">
                  <BenefitsList items={app.benefits} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <aside className="guide__phone-warning">
        <h3 className="guide__phone-warning-title urdu" dir="rtl">
          {warning.title}
        </h3>
        <div className="guide__phone-warning-row">
          <div className="guide__phone-warning-icon" aria-hidden>
            <span className="guide__phone-warning-triangle">!</span>
          </div>
          <p className="guide__phone-warning-body urdu" dir="rtl">
            {warning.body}
          </p>
        </div>
        <div className="guide__phone-warning-stripes" aria-hidden />
      </aside>
    </div>
  );
}
