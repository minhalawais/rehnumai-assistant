import { Lightbulb } from "lucide-react";

export function GuideYellowNote({ title, body }: { title: string; body: string }) {
  return (
    <aside className="guide__yellow-note" dir="rtl">
      <span className="guide__yellow-note-icon" aria-hidden>
        <Lightbulb size={30} strokeWidth={1.8} />
      </span>
      <p className="guide__yellow-note-title urdu">{title}</p>
      <p className="guide__yellow-note-body urdu">{body}</p>
    </aside>
  );
}
