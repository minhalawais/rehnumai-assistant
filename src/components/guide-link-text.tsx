import type { ReactNode } from "react";

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
      <bdi key={`${keyPrefix}-phone-${match.index}`} dir="ltr">
        {match[0]}
      </bdi>,
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
