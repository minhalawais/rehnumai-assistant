"use client";

import { ClipboardList, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { copy, useLocale } from "@/components/locale";
import { PublicIntakeForm } from "@/components/public-intake-form";

type Phase = "prompt" | "form";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
};

export function IntakeEntryModal({ open, onClose, onSubmitted }: Props) {
  const { language } = useLocale();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("prompt");

  useEffect(() => {
    if (!open) {
      queueMicrotask(() => setPhase("prompt"));
      return;
    }
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(timer);
    };
  }, [open]);

  if (!open) return null;

  function handleBackdrop(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && phase === "prompt") onClose();
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape" && phase === "prompt") onClose();
  }

  const dialogClass = [
    "intake-modal__dialog",
    phase === "form" ? "intake-modal__dialog--form" : "intake-modal__dialog--prompt",
  ].join(" ");

  return (
    <div className="intake-modal" role="presentation" onMouseDown={handleBackdrop} onKeyDown={handleKeyDown}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={dialogClass}
      >
        {phase === "prompt" ? (
          <>
            <div className="intake-modal__sheet-bar">
              <span className="intake-modal__grab" aria-hidden="true" />
              <button type="button" className="intake-modal__close btn-quiet" onClick={onClose} aria-label={copy(language, "Close", "بند کریں")}>
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="intake-modal__prompt">
              <div className="intake-modal__prompt-lead">
                <div className="intake-modal__prompt-icon" aria-hidden="true"><ClipboardList size={20} /></div>
                <div className="min-w-0">
                  <p className="intake-modal__eyebrow">{copy(language, "Rehnumai intake", "رہنمائی کا اندراج")}</p>
                  <h2 id={titleId} className="intake-modal__title">
                    {copy(language, "Share your preparation needs", "اپنی تیاری کی ضروریات بتائیں")}
                  </h2>
                </div>
              </div>
              <p className="intake-modal__copy">
                {copy(
                  language,
                  "A short form for the team to review your documents and support needs. You receive a reference number after submit. No job, visa, or approval is guaranteed.",
                  "ٹیم آپ کی دستاویزات اور مدد کے لیے مختصر فارم۔ جمع کرانے پر حوالہ نمبر ملے گا۔ ملازمت، ویزا یا منظوری کی ضمانت نہیں۔",
                )}
              </p>
            </div>
            <div className="intake-modal__sheet-actions">
              <button type="button" className="btn-primary intake-modal__cta" onClick={() => setPhase("form")}>
                {copy(language, "Start the form", "فارم شروع کریں")}
              </button>
              <button type="button" className="intake-modal__dismiss" onClick={onClose}>
                {copy(language, "Continue reading the booklet", "کتابچہ پڑھنا جاری رکھیں")}
              </button>
            </div>
          </>
        ) : (
          <>
            <header className="intake-modal__form-head">
              <div className="min-w-0 flex-1">
                <p className="intake-modal__eyebrow">{copy(language, "Step by step", "مرحلہ وار فارم")}</p>
                <h2 id={titleId} className="intake-modal__title intake-modal__title--sm">
                  {copy(language, "Rehnumai form", "رہنمائی کا فارم")}
                </h2>
              </div>
              <button type="button" className="intake-modal__close btn-quiet" onClick={onClose} aria-label={copy(language, "Close", "بند کریں")}>
                <X size={18} aria-hidden="true" />
              </button>
            </header>
            <div className="intake-modal__form-body">
              <PublicIntakeForm
                surface="modal"
                onSubmitted={() => onSubmitted()}
                onDeclined={onClose}
                onDismiss={onClose}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
