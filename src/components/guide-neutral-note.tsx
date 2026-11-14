import { LinkText } from "@/components/guide-link-text";

export function GuideNeutralNote({ text, url }: { text: string; url: string }) {
  return (
    <aside className="guide__neutral-note" dir="rtl">
      <p className="guide__neutral-note-text urdu">{text}</p>
      <a className="guide__neutral-note-link" href={url} target="_blank" rel="noopener noreferrer" dir="ltr">
        <LinkText text={url.replace(/^https?:\/\//, "")} />
      </a>
    </aside>
  );
}
