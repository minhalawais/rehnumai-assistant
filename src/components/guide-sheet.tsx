import type { GuideBlock, GuideOrgCard, GuidePortal } from "@/lib/guide-articles";
import { GuideChecklist } from "@/components/guide-checklist";
import { GuideDepartureTable } from "@/components/guide-departure-table";
import { GuidePackingChecklist } from "@/components/guide-packing-checklist";
import { GuideAirportGuide } from "@/components/guide-airport-guide";
import { GuideArrivalAirport } from "@/components/guide-arrival-airport";
import { GuideEmployerSponsor } from "@/components/guide-employer-sponsor";
import { GuideRespectLaws } from "@/components/guide-respect-laws";
import { GuideWorkerRights } from "@/components/guide-worker-rights";
import { GuideWorkplaceRights } from "@/components/guide-workplace-rights";
import { GuideSaudiApps } from "@/components/guide-saudi-apps";
import { GuideRemittanceChannels } from "@/components/guide-remittance-channels";
import { GuideFormalInformal, isFormalInformalCompare } from "@/components/guide-formal-informal";
import { GuidePrivateCompanies } from "@/components/guide-private-companies";
import { GuideReintegration } from "@/components/guide-reintegration";
import type { EmployerGridCell } from "@/components/guide-employer-grid";
import { ContentImage } from "@/components/content-image";
import { LinkText } from "@/components/guide-link-text";

export { LinkText } from "@/components/guide-link-text";

const CAPTIONS: Record<string, string> = {
  "/guide/image9.jpeg": "غیر قانونی راستے",
};

function proseChunks(text: string): string[] {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length < 220) return [trimmed];
  const parts = trimmed.split(/(?<=۔)\s*/).map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return [trimmed];
  const chunks: string[] = [];
  let buffer = "";
  for (const part of parts) {
    const next = buffer ? `${buffer} ${part}` : part;
    if (buffer && next.length > 190) {
      chunks.push(buffer);
      buffer = part;
    } else {
      buffer = next;
    }
  }
  if (buffer) chunks.push(buffer);
  return chunks;
}

function linesOf(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !/^[.\-۔\s]+$/.test(line));
}

function isUrl(text: string): boolean {
  return /www\.|https?:|\.com|\.pk|\.eu|\.html/i.test(text);
}

function isDisclaimer(text: string): boolean {
  return /^یاد رکھیں[:：]?/.test(text.trim());
}

function DisclaimerText({ text }: { text: string }) {
  const trimmed = text.trim();
  const leadMatch = trimmed.match(/^(یاد رکھیں[:：])\s*(.+)$/);
  if (!leadMatch) return <LinkText text={text} />;
  return (
    <>
      <strong className="guide__disclaimer-lead">{leadMatch[1]}</strong>{" "}
      <span className="guide__disclaimer-body">{leadMatch[2]}</span>
    </>
  );
}

function isHeadingLine(text: string): boolean {
  const line = text.trim();
  if (line.length < 4 || line.length > 80) return false;
  if (isUrl(line) || /section/i.test(line) || /^\d/.test(line)) return false;
  if (/[۔.]$/.test(line)) return false;
  if (/(ہے|ہیں|ہوتا|ہوتی|ہوتے|تھا|تھی|مانگیں|کریں)$/.test(line)) return false;
  return true;
}

function shortLabel(header: string): string {
  const flat = header.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  const first = header.split(/\n/)[0].trim();
  if (flat.includes("غیر قانونی")) return "غیر قانونی راستہ";
  if (flat.includes("قانونی")) return "قانونی راستہ";
  return first || flat;
}

function stackHeadingParts(header: string): { title: string; subtitle: string | null } {
  const lines = header.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const title = lines[0] ?? header.trim();
  const subtitle = lines[1] && /^\([^)]+\)$/.test(lines[1]) ? lines[1] : null;
  return { title, subtitle };
}

function StackHeading({ header }: { header: string }) {
  const { title, subtitle } = stackHeadingParts(header);
  return (
    <h3 className="guide__stack-label">
      <span className="guide__stack-label-line">
        <span className="guide__stack-label-title urdu">{title}</span>
        {subtitle ? <span className="guide__stack-label-sub" dir="ltr">{subtitle}</span> : null}
      </span>
    </h3>
  );
}

function columnTone(label: string): "good" | "risk" | "" {
  if (/غیر قانونی|نقصانات|خطرات|خطر/.test(label)) return "risk";
  if (/قانونی|فائد|مثبت|اخلاقی/.test(label)) return "good";
  return "";
}

function splitHead(rows: string[][]): { head: string[] | null; body: string[][] } {
  if (rows.length < 2) return { head: null, body: rows };
  const width = Math.max(...rows.map((row) => row.length));
  const first = rows[0];
  if (first.length !== width) return { head: null, body: rows };
  const labels = first.map((cell) => cell.replace(/\n/g, " ").trim());
  const short = labels.every((cell) => cell.length > 0 && cell.length <= 70 && !cell.includes("۔"));
  return short ? { head: first, body: rows.slice(1) } : { head: null, body: rows };
}

function isDepartureChecklist(rows: string[][]): boolean {
  if (rows.length < 2) return false;
  const header = rows[0].map((c) => c.replace(/\s+/g, " ").trim());
  const hasDetail = header.some((c) => c === "تفصیل");
  const hasNum = header.some((c) => c === "نمبر");
  const hasCheck = header.some((c) => c.includes("چیک"));
  if (!hasDetail || !hasNum || !hasCheck) return false;
  return rows.slice(1).some((row) => row.some((cell) => cell.includes("آجر یا کمپنی")));
}

function isDocumentChecklist(head: string[] | null, body: string[][]): boolean {
  if (!head || head.length !== 4 || body.length < 2) return false;
  const labels = head.map(shortLabel);
  return (
    labels.some((l) => l === "نمبر") &&
    labels.some((l) => l.includes("درکار")) &&
    labels.some((l) => l === "ہاں") &&
    labels.some((l) => l === "نہیں")
  );
}

function stepColumns(head: string[] | null): { number: number; title: number; detail: number } | null {
  if (!head || head.length !== 3) return null;
  const labels = head.map(shortLabel);
  const number = labels.indexOf("نمبر");
  const title = labels.indexOf("اقدام");
  const detail = labels.indexOf("تفصیل");
  if (number < 0 || title < 0 || detail < 0) return null;
  return { number, title, detail };
}

function phoneLayout(rows: string[][]): "columns" | "rows" {
  const { head, body } = splitHead(rows);
  const data = head ? body : rows;
  const cols = rows.reduce((max, row) => Math.max(max, row.length), 0);
  if (data.length === 1 && cols <= 3) return "columns";
  return "rows";
}

function portalHost(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function formatPkPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("92") && digits.length >= 12) {
    return `0${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

function orgWebsiteLabel(item: GuideOrgCard) {
  if (item.website) return item.website.replace(/^https?:\/\//i, "");
  try {
    return new URL(item.href).host + new URL(item.href).pathname.replace(/\/$/, "");
  } catch {
    return item.href;
  }
}

function GuideOrgCards({ title, compact, items }: { title?: string; compact?: boolean; items: GuideOrgCard[] }) {
  const blockClass = compact ? "guide__org-cards-block guide__org-cards-block--compact" : "guide__org-cards-block";
  const gridClass = compact ? "guide__org-cards guide__org-cards--compact" : "guide__org-cards";
  return (
    <section className={blockClass}>
      {title ? <h2 className="guide__org-cards-title urdu">{title}</h2> : null}
      <div className={gridClass}>
        {items.map((item) => {
          const label = orgWebsiteLabel(item);
          const alt = item.name ?? item.text ?? label;
          const cardKey = item.href + item.logo;
          return (
            <article key={cardKey} className={compact ? "guide__org-card guide__org-card--compact" : "guide__org-card"}>
              {compact ? (
                <a
                  className="guide__org-card-hit focus-ring"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.text ? <span className="guide__org-name urdu">{item.text}</span> : null}
                  <ContentImage src={item.logo} alt={alt} preset="logo" className="guide__org-logo" />
                  <span className="guide__org-url" dir="ltr">
                    {label}
                  </span>
                </a>
              ) : (
                <>
                  <ContentImage src={item.logo} alt={alt} preset="logo" className="guide__org-logo" />
                  {item.text ? <p className="guide__org-text urdu">{item.text}</p> : null}
                  <a
                    className="guide__org-url focus-ring"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                  >
                    {label}
                  </a>
                </>
              )}
              {item.phone ? (
                <a className="guide__org-phone focus-ring" href={`tel:${item.phone}`} dir="ltr">
                  {formatPkPhone(item.phone)}
                </a>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function GuideCallout({ title, url }: { title: string; url: string }) {
  return (
    <a className="guide__callout focus-ring" href={url} target="_blank" rel="noopener noreferrer">
      <span className="guide__callout-title" dir="ltr">{title}</span>
      <span className="guide__callout-url" dir="ltr">{url}</span>
    </a>
  );
}

function GuidePortals({ items }: { items: GuidePortal[] }) {
  return (
    <ul className="guide__portals">
      {items.map((item) => (
        <li key={item.url} className="guide__portal-item">
          <span className="guide__point-mark" aria-hidden />
          <a className="guide__portal focus-ring" href={item.url} target="_blank" rel="noopener noreferrer">
            <span className="guide__portal-logo-wrap" aria-hidden>
              <ContentImage
                src={item.logo}
                alt=""
                preset="logo"
                sizes="36px"
                className="guide__portal-logo"
                onError={(event) => {
                  event.currentTarget.classList.add("guide__portal-logo--missing");
                }}
              />
              <span className="guide__portal-fallback" dir="ltr">{item.name.slice(0, 1)}</span>
            </span>
            <span className="guide__portal-copy">
              <span className="guide__portal-name" dir="ltr">{item.name}</span>
              <span className="guide__portal-url" dir="ltr">{portalHost(item.url)}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function Points({ text }: { text: string }) {
  const lines = linesOf(text);
  if (lines.length === 0) return null;
  const lead = /[:：]$/.test(lines[0]) ? lines[0] : "";
  const items = lead ? lines.slice(1) : lines;
  if (!lead && items.length === 1) return <p className="guide__cell-text urdu"><LinkText text={items[0]} /></p>;
  return (
    <div className="guide__points-block">
      {lead ? <p className="guide__point-lead urdu"><LinkText text={lead} /></p> : null}
      {items.length > 0 ? (
        <ul className="guide__points">
          {items.map((item, index) => (
            <li key={index} className="guide__point urdu">
              <span className="guide__point-mark" aria-hidden />
              <span><LinkText text={item} /></span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function figureCaption(src: string, alt: string): string | null {
  if (CAPTIONS[src]) return CAPTIONS[src];
  const sentence = alt.replace(/\s+/g, " ").trim().split("۔")[0]?.trim() ?? "";
  if (sentence.length >= 8 && sentence.length <= 42 && !isUrl(sentence)) return sentence;
  return null;
}

function GuideTable({ rows }: { rows: string[][] }) {
  if (isDepartureChecklist(rows)) return <GuideDepartureTable rows={rows} />;
  const { head, body } = splitHead(rows);
  if (isFormalInformalCompare(head, body)) return <GuideFormalInformal rows={rows} />;
  if (head && isDocumentChecklist(head, body)) return <GuideChecklist head={head} rows={body} />;
  const layout = phoneLayout(rows);
  const steps = stepColumns(head);
  const data = head ? body : rows;

  return (
    <div className="guide__compare">
      {layout === "columns" ? (
        <div className="guide__stacked">
          {(head ?? data[0] ?? []).map((cell, col) => {
            const label = head ? shortLabel(cell) : "";
            const tone = columnTone(label);
            const chunks = data.map((row) => row[col] ?? "").filter((chunk) => chunk.trim());
            return (
              <section key={col} className={tone ? `guide__stack guide__stack--${tone}` : "guide__stack"}>
                {head ? <StackHeading header={cell} /> : null}
                {chunks.map((chunk, chunkIndex) => (
                  <Points key={chunkIndex} text={chunk} />
                ))}
              </section>
            );
          })}
        </div>
      ) : null}
      {layout === "rows" && steps ? (
        <div className="guide__stacked">
          {data.map((row, rowIndex) => (
            <article key={rowIndex} className="guide__step">
              <header className="guide__step-head">
                <span className="guide__step-num" dir="ltr">{row[steps.number]?.trim()}</span>
                <h3 className="guide__step-title urdu">{row[steps.title]?.trim()}</h3>
              </header>
              <Points text={row[steps.detail] ?? ""} />
            </article>
          ))}
        </div>
      ) : null}
      {layout === "rows" && !steps ? (
        <div className="guide__stacked">
          {(head ? body : rows).map((row, rowIndex) => {
            const filled = row.map((cell) => cell.trim()).filter(Boolean);
            if (filled.length === 1 && filled[0].length <= 40 && !filled[0].includes("\n")) {
              return (
                <h3 key={rowIndex} className="guide__h urdu">
                  {filled[0]}
                </h3>
              );
            }
            return (
              <section key={rowIndex} className="guide__record">
                {row.map((cell, cellIndex) => {
                  if (!cell.trim()) return null;
                  const label = head ? shortLabel(head[cellIndex] ?? "") : "";
                  const tone = columnTone(label);
                  return (
                    <div key={cellIndex} className={tone ? `guide__record-cell guide__record-cell--${tone}` : "guide__record-cell"}>
                      {label ? <p className="guide__record-kicker urdu">{label}</p> : null}
                      <Points text={cell} />
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
      ) : null}
      <div className="guide__table-wrap">
        <table className="guide__table">
          {head ? (
            <thead>
              <tr>
                {head.map((cell, cellIndex) => {
                  const label = shortLabel(cell);
                  const tone = columnTone(label);
                  return (
                    <th key={cellIndex} scope="col" className={tone ? `guide__table-head tone-${tone}` : "guide__table-head"}>
                      <StackHeading header={cell} />
                    </th>
                  );
                })}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  const label = head ? shortLabel(head[cellIndex] ?? "") : "";
                  const tone = columnTone(label);
                  return (
                    <td key={cellIndex} className={tone ? `urdu tone-${tone}` : "urdu"}>
                      <Points text={cell} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function GuideSheet({ blocks }: { blocks: GuideBlock[] }) {
  return (
    <div className="guide__sheet" lang="ur" dir="rtl">
      {blocks.map((block, index) => {
        if (block.type === "h" || (block.type === "list" && block.items.length === 1 && isHeadingLine(block.items[0]))) {
          const text = block.type === "h" ? block.text : block.items[0];
          return (
            <h2 key={index} className="guide__h urdu">
              <LinkText text={text} />
            </h2>
          );
        }
        if (block.type === "img") {
          const caption = figureCaption(block.src, block.alt);
          return (
            <figure
              key={index}
              className={`guide__figure${block.display === "compact" ? " guide__figure--compact" : ""}`}
            >
              <ContentImage src={block.src} alt={caption || block.alt} preset="figure" />
              {caption ? <figcaption className="guide__caption urdu">{caption}</figcaption> : null}
            </figure>
          );
        }
        if (block.type === "worker-rights-guide") {
          return (
            <GuideWorkerRights
              key={index}
              intro={block.intro}
              image={block.image}
              rightsTitle={block.rightsTitle}
              rights={block.rights}
              dutiesTitle={block.dutiesTitle}
              duties={block.duties}
            />
          );
        }
        if (block.type === "workplace-rights-guide") {
          return (
            <GuideWorkplaceRights
              key={index}
              workersTitle={block.workersTitle}
              workers={block.workers}
              employersTitle={block.employersTitle}
              employers={block.employers}
            />
          );
        }
        if (block.type === "smartphone-guide") {
          return (
            <GuideSaudiApps
              key={index}
              sectionTitle={block.sectionTitle}
              apps={block.apps}
              warning={block.warning}
            />
          );
        }
        if (block.type === "remittance-channels-guide") {
          return (
            <GuideRemittanceChannels
              key={index}
              image={block.image}
              alt={block.alt}
              footer={<LinkText text={block.footer} />}
            />
          );
        }
        if (block.type === "private-companies-guide") {
          return (
            <GuidePrivateCompanies
              key={index}
              intro={block.intro}
              officePhoto={block.officePhoto}
              westernUnionUrl={block.westernUnionUrl}
              followUp={block.followUp}
              transferPhoto={block.transferPhoto}
              brandsImage={block.brandsImage}
            />
          );
        }
        if (block.type === "reintegration-guide") {
          return (
            <GuideReintegration
              key={index}
              intro={block.intro}
              roadmapImage={block.roadmapImage}
              steps={block.steps}
            />
          );
        }
        if (block.type === "respect-laws-guide") {
          return (
            <GuideRespectLaws
              key={index}
              intro={block.intro}
              images={block.images}
              tableTitle={block.tableTitle}
              columns={block.columns}
            />
          );
        }
        if (block.type === "arrival-airport-guide") {
          return (
            <GuideArrivalAirport key={index} banner={block.banner} steps={block.steps} photo={block.photo} />
          );
        }
        if (block.type === "employer-sponsor") {
          return (
            <GuideEmployerSponsor
              key={index}
              sponsorIntro={block.sponsorIntro}
              sponsorPhoto={block.sponsorPhoto}
              sponsorNote={block.sponsorNote}
              grid={block.grid as EmployerGridCell[][]}
            />
          );
        }
        if (block.type === "airport-guide") {
          return (
            <GuideAirportGuide
              key={index}
              banner={block.banner}
              precautions={block.precautions}
              photo={block.photo}
              warnings={block.warnings}
              warningIcon={block.warningIcon}
            />
          );
        }
        if (block.type === "dual-checklist") {
          return (
            <GuidePackingChecklist
              key={index}
              leftTitle={block.leftTitle}
              rightTitle={block.rightTitle}
              left={block.left}
              right={block.right}
            />
          );
        }
        if (block.type === "table") return <GuideTable key={index} rows={block.rows} />;
        if (block.type === "portals") return <GuidePortals key={index} items={block.items} />;
        if (block.type === "callout") return <GuideCallout key={index} title={block.title} url={block.url} />;
        if (block.type === "org-cards") {
          return (
            <GuideOrgCards key={index} title={block.title} compact={block.compact} items={block.items} />
          );
        }
        if (block.type === "list") {
          if (block.items.length === 1 && !block.variant) {
            return <p key={index} className="guide__p urdu"><LinkText text={block.items[0]} /></p>;
          }
          return (
            <ul
              key={index}
              className={
                block.variant === "warning"
                  ? "guide__list guide__list--warning"
                  : block.variant === "info"
                    ? "guide__list guide__list--info"
                    : "guide__list"
              }
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="guide__item urdu">
                  <span className="guide__point-mark" aria-hidden />
                  <span><LinkText text={item} /></span>
                </li>
              ))}
            </ul>
          );
        }
        return proseChunks(block.text).map((chunk, chunkIndex) => {
          const disclaimer = isDisclaimer(chunk);
          return (
            <div key={`${index}-${chunkIndex}`} className={disclaimer ? "guide__disclaimer urdu" : "guide__p urdu"} role={disclaimer ? "note" : undefined}>
              {disclaimer ? <DisclaimerText text={chunk} /> : <LinkText text={chunk} />}
            </div>
          );
        });
      })}
    </div>
  );
}
