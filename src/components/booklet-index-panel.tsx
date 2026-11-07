"use client";

import { ChevronRight, List, X } from "lucide-react";
import { copy, useLocale } from "@/components/locale";
import { BOOKLET_INDEX, BOOKLET_INDEX_GROUPS, type BookletIndexEntry, type BookletIndexGroup } from "@/lib/booklet-index";

type Props = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelectPage: (page: number) => void;
};

type ContentsProps = {
  onSelectPage: (page: number) => void;
  activePage?: number;
  showClose?: boolean;
  onClose?: () => void;
  layout: "overlay" | "rail";
};

function groupEntries(group: BookletIndexGroup) {
  return BOOKLET_INDEX.filter(entry => entry.group.en === group.en);
}

export function BookletIndexBar({ onOpen }: { onOpen: () => void }) {
  const { language } = useLocale();
  return (
    <div className="booklet-index-bar">
      <button type="button" className="booklet-index-bar__toggle btn-secondary" onClick={onOpen} aria-expanded={false}>
        <List size={17} aria-hidden="true" />
        {copy(language, "Booklet contents", "کتابچے کی فہرست")}
      </button>
    </div>
  );
}

export function BookletIndexContents({ onSelectPage, activePage, showClose, onClose, layout }: ContentsProps) {
  const { language } = useLocale();
  const panelClass = [
    "booklet-index-panel",
    layout === "rail" ? "booklet-index-panel--rail" : "booklet-index-panel--overlay",
  ].join(" ");

  return (
    <nav
      className={panelClass}
      aria-label={copy(language, "Booklet contents", "کتابچے کی فہرست")}
    >
      <header className="booklet-index-panel__head">
        <div>
          <p className="booklet-index-panel__eyebrow">{copy(language, "Navigate", "منتخب کریں")}</p>
          <h2 className="booklet-index-panel__title">{copy(language, "Booklet contents", "کتابچے کی فہرست")}</h2>
        </div>
        {showClose && onClose && (
          <button type="button" className="booklet-index-panel__close btn-quiet" onClick={onClose} aria-label={copy(language, "Close contents", "فہرست بند کریں")}>
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </header>
      <div className="booklet-index-panel__body">
        {BOOKLET_INDEX_GROUPS.map(group => {
          const entries = groupEntries(group);
          if (!entries.length) return null;
          return (
            <section key={group.en} className="booklet-index-group">
              <h3 className="booklet-index-group__title">{copy(language, group.en, group.ur)}</h3>
              <ul className="booklet-index-group__list">
                {entries.map(entry => (
                  <BookletIndexRow
                    key={entry.id}
                    entry={entry}
                    language={language}
                    active={activePage === entry.page}
                    onSelect={() => onSelectPage(entry.page)}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </nav>
  );
}

export function BookletIndexPanel({ open: _open, onOpen, onClose, onSelectPage }: Props) {
  if (!_open) {
    return <BookletIndexBar onOpen={onOpen} />;
  }

  return (
    <BookletIndexContents layout="overlay" showClose onClose={onClose} onSelectPage={onSelectPage} />
  );
}

function BookletIndexRow({
  entry,
  language,
  active,
  onSelect,
}: {
  entry: BookletIndexEntry;
  language: "ur" | "en";
  active?: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        className={`booklet-index-row${active ? " booklet-index-row--active" : ""}`}
        onClick={onSelect}
        aria-current={active ? "location" : undefined}
      >
        <span className="booklet-index-row__text">{copy(language, entry.title.en, entry.title.ur)}</span>
        <span className="booklet-index-row__meta">
          <span className="booklet-index-row__page" dir="ltr">{entry.page}</span>
          <ChevronRight size={16} className="booklet-index-row__icon rtl:rotate-180" aria-hidden="true" />
        </span>
      </button>
    </li>
  );
}
