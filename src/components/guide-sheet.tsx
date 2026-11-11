import type { ReactNode } from "react";
import type { GuideBlock } from "@/lib/guide-articles";

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

function columnTone(label: string): "good" | "risk" | "" {
  if (/غیر قانونی|نقصان|خطر|غلط/.test(label)) return "risk";
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

const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s<>()،۔]+|(?:[a-z0-9-]+\.)+(?:com|pk|eu|org|net|gov|edu)\b(?:\/[^\s<>()،۔]*)?/gi;

function cleanUrl(raw: string) {
  return raw.replace(/[.,،;:!?)]+$/g, "");
}

function toHref(raw: string) {
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

const PHONE_PATTERN = /(?:\+|00)?\d{1,4}(?:[\s.-]\d{2,}){2,}/g;

function withPhones(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = new RegExp(PHONE_PATTERN.source, "g");
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    nodes.push(
      <bdi key={`${keyPrefix}-phone-${match.index}`} dir="ltr">{match[0]}</bdi>,
    );
    last = match.index + match[0].length;
  }
  if (!nodes.length) return [text];
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function linkNodes(text: string) {
  const prepared = text.replace(/(?<=\S)(?=https?:\/\/)/gi, " ").replace(/(?<=\w)(?=www\.)/gi, " ");
  const nodes: ReactNode[] = [];
  const pattern = new RegExp(URL_PATTERN.source, "gi");
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(prepared))) {
    const raw = cleanUrl(match[0]);
    if (raw.length < 4 || !raw.includes(".")) continue;
    if (match.index > last) nodes.push(...withPhones(prepared.slice(last, match.index), `t${match.index}`));
    nodes.push(
      <a key={`${match.index}-${raw}`} className="guide__link" href={toHref(raw)} dir="ltr" target="_blank" rel="noopener noreferrer">
        {raw}
      </a>,
    );
    const trimmed = match[0].slice(raw.length);
    if (trimmed) nodes.push(trimmed);
    last = match.index + match[0].length;
  }
  if (!nodes.length) return withPhones(prepared, "t");
  if (last < prepared.length) nodes.push(...withPhones(prepared.slice(last), "end"));
  return nodes;
}

export function LinkText({ text }: { text: string }) {
  return <>{linkNodes(text)}</>;
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
  const { head, body } = splitHead(rows);
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
                {label ? <h3 className="guide__stack-label urdu">{label}</h3> : null}
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
                    <th key={cellIndex} scope="col" className={tone ? `urdu tone-${tone}` : "urdu"}>
                      {label}
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
            <figure key={index} className="guide__figure">
              <img src={block.src} alt={caption || block.alt} />
              {caption ? <figcaption className="guide__caption urdu">{caption}</figcaption> : null}
            </figure>
          );
        }
        if (block.type === "table") return <GuideTable key={index} rows={block.rows} />;
        if (block.type === "list") {
          if (block.items.length === 1) return <p key={index} className="guide__p urdu"><LinkText text={block.items[0]} /></p>;
          return (
            <ul key={index} className="guide__list">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="guide__item urdu">
                  <span className="guide__point-mark" aria-hidden />
                  <span><LinkText text={item} /></span>
                </li>
              ))}
            </ul>
          );
        }
        return proseChunks(block.text).map((chunk, chunkIndex) => (
          <p key={`${index}-${chunkIndex}`} className="guide__p urdu">
            <LinkText text={chunk} />
          </p>
        ));
      })}
    </div>
  );
}
