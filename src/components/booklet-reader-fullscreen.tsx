"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { List, X } from "lucide-react";
import { copy, useLocale } from "@/components/locale";
import { BookletPdfPage, BOOKLET_FULLSCREEN_DIALOG_ID } from "@/components/booklet-pdf-page";
import { BookletIndexPanel } from "@/components/booklet-index-panel";
import { useBookletHorizontalPager } from "@/hooks/use-booklet-horizontal-pager";
import { bookletNativePdfSrc } from "@/lib/booklet-page-layout";
import type { PDFDocumentProxy } from "pdfjs-dist";

type BookletReaderFullscreenProps = {
  open: boolean;
  onClose: () => void;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  useNativePdf: boolean;
  pdf: PDFDocumentProxy | null;
  bookletLabel: string;
  returnFocusRef?: React.RefObject<HTMLButtonElement | null>;
};

function FullscreenNativeSlide({ page, title }: { page: number; title: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
  }, [page]);
  return (
    <div className="booklet-reader-fullscreen__slide-inner">
      {!ready && <p className="booklet-reader-fullscreen__slide-status" role="status" aria-hidden="true" />}
      <iframe
        title={title}
        className="booklet-reader-fullscreen__iframe"
        src={bookletNativePdfSrc(page)}
        onLoad={() => setReady(true)}
      />
    </div>
  );
}

export function BookletReaderFullscreen({
  open,
  onClose,
  page,
  pageCount,
  onPageChange,
  useNativePdf,
  pdf,
  bookletLabel,
  returnFocusRef,
}: BookletReaderFullscreenProps) {
  const { language } = useLocale();
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [indexOpen, setIndexOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { trackRef, prevPage, nextPage } = useBookletHorizontalPager({
    page,
    pageCount,
    onPageChange,
    enabled: open,
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const node = stageRef.current;
    if (!node) return;
    const measure = () => {
      const w = Math.floor(node.clientWidth);
      if (w > 0) setSlideWidth(w);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [open]);

  const handleClose = useCallback(() => {
    onClose();
    window.requestAnimationFrame(() => returnFocusRef?.current?.focus());
  }, [onClose, returnFocusRef]);

  const selectFromIndex = useCallback(
    (target: number) => {
      onPageChange(target);
      setIndexOpen(false);
    },
    [onPageChange],
  );

  if (!mounted || !open) return null;

  const pageLabel = copy(language, `Page ${page} of ${pageCount}`, `صفحہ ${page} از ${pageCount}`);

  const slides = [prevPage, page, nextPage] as const;

  return createPortal(
    <div
      id={BOOKLET_FULLSCREEN_DIALOG_ID}
      className="booklet-reader-fullscreen"
      role="dialog"
      aria-modal="true"
      aria-label={copy(language, "Booklet full screen", "کتابچہ پوری اسکرین")}
    >
      <header className="booklet-reader-fullscreen__head">
        <button
          type="button"
          className="booklet-reader-fullscreen__contents btn-quiet"
          onClick={() => setIndexOpen(true)}
          aria-expanded={indexOpen}
        >
          <List size={17} aria-hidden="true" />
          {copy(language, "Contents", "فہرست")}
        </button>
        <p className="booklet-reader-fullscreen__pages" aria-live="polite">
          {pageLabel}
        </p>
        <button
          ref={closeRef}
          type="button"
          className="booklet-reader-fullscreen__close btn-quiet"
          onClick={handleClose}
          aria-label={copy(language, "Exit full screen", "پوری اسکرین سے باہر")}
        >
          <X size={20} aria-hidden="true" />
        </button>
      </header>

      <div ref={stageRef} className="booklet-reader-fullscreen__stage">
        <div
          ref={trackRef}
          dir="ltr"
          className="booklet-reader-fullscreen__track"
          data-testid="booklet-fullscreen-track"
        >
          {slides.map((slidePage, index) => (
            <div key={index === 0 ? "prev" : index === 1 ? "current" : "next"} className="booklet-reader-fullscreen__slide">
              {useNativePdf ? (
                <FullscreenNativeSlide page={slidePage} title={bookletLabel} />
              ) : pdf && slideWidth > 0 ? (
                <BookletPdfPage
                  pdf={pdf}
                  pageNumber={slidePage}
                  width={Math.min(slideWidth - 24, 720)}
                  language={language}
                  className="booklet-reader-fullscreen__page"
                />
              ) : (
                <p className="booklet-reader-fullscreen__slide-status" role="status">
                  {copy(language, "Loading…", "لوڈ ہو رہا ہے…")}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {indexOpen && (
        <BookletIndexPanel
          open
          onOpen={() => setIndexOpen(true)}
          onClose={() => setIndexOpen(false)}
          onSelectPage={selectFromIndex}
        />
      )}
    </div>,
    document.body,
  );
}
