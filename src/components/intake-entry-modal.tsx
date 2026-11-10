"use client";

import { ClipboardList, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { copy, useLocale } from "@/components/locale";
import { PublicIntakeForm } from "@/components/public-intake-form";

type Phase = "prompt" | "form";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function IntakeEntryModal({ open, onClose }: Props) {
  const { language } = useLocale();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("prompt");
  const [formProgress, setFormProgress] = useState({ dirty: false, submitted: false });

  useEffect(() => {
    if (!open) {
      queueMicrotask(() => {
        setPhase("prompt");
        setFormProgress({ dirty: false, submitted: false });
      });
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

  function confirmCloseForm() {
    if (formProgress.submitted) {
      onClose();
      return;
    }
    if (formProgress.dirty) {
      const leave = window.confirm(
        copy(language, "Leave the form? Your answers on this device will be lost.", "فارم بند کریں؟ اس آلے پر لکھے جوابات ختم ہو جائیں گے۔"),
      );
      if (!leave) return;
    }
    onClose();
  }

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
                  <p className="intake-modal__eyebrow">{copy(language, "Migration form", "مائیگریشن فارم")}</p>
                  <h2 id={titleId} className="intake-modal__title">
                    {copy(language, "Enter your details", "اپنی معلومات درج کریں")}
                  </h2>
                </div>
              </div>
              <p className="intake-modal__copy">
                {copy(
                  language,
                  "This short form collects basic details so the team can guide you. After you submit, you get a reference number.",
                  "یہ مختصر فارم آپ کی بنیادی معلومات لیتا ہے تاکہ ٹیم آپ کی رہنمائی کر سکے۔ فارم جمع کرنے کے بعد آپ کو ایک حوالہ نمبر ملے گا۔",
                )}
              </p>
            </div>
            <div className="intake-modal__sheet-actions">
              <button type="button" className="btn-primary intake-modal__cta" onClick={() => setPhase("form")}>
                {copy(language, "Start the form", "فارم بھریں")}
              </button>
              <button type="button" className="intake-modal__dismiss" onClick={onClose}>
                {copy(language, "Read the booklet", "کتابچہ پڑھیں")}
              </button>
            </div>
          </>
        ) : (
          <>
            <header className="intake-modal__form-head">
              <div className="intake-modal__form-head-copy min-w-0 flex-1">
                <p className="intake-modal__eyebrow">{copy(language, "Step by step", "قدم بہ قدم")}</p>
                <h2 id={titleId} className="intake-modal__title intake-modal__title--sm">
                  {copy(language, "Migration form", "مائیگریشن فارم")}
                </h2>
              </div>
              {!formProgress.submitted ? (
                <button type="button" className="intake-modal__close btn-quiet" onClick={confirmCloseForm} aria-label={copy(language, "Close", "بند کریں")}>
                  <X size={18} aria-hidden="true" />
                </button>
              ) : null}
            </header>
            <div className="intake-modal__form-body">
              <PublicIntakeForm
                surface="modal"
                onDeclined={confirmCloseForm}
                onDismiss={onClose}
                onProgressChange={setFormProgress}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
