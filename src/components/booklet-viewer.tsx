"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { copy, useLocale } from "@/components/locale";
import { BookletPdfPage, BOOKLET_FULLSCREEN_DIALOG_ID } from "@/components/booklet-pdf-page";
import { BookletReaderFullscreen } from "@/components/booklet-reader-fullscreen";
import { BookletComingSoon } from "@/components/booklet-coming-soon";
import { loadBookletPdfDocument } from "@/lib/booklet-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export const BOOKLET_ACTIVE_PAGE_COUNT = 2;

type BookletViewerProps = {
  variant?: "embedded" | "home";
};

export function BookletViewer({ variant = "embedded" }: BookletViewerProps) {
  const { language } = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const expandRef = useRef<HTMLButtonElement>(null);

  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [page1Height, setPage1Height] = useState<number | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [activePage, setActivePage] = useState<1 | 2>(1);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  // Load PDF Document (Page 1)
  useEffect(() => {
    let cancelled = false;
    const loadingTask = loadBookletPdfDocument();

    void loadingTask.promise
      .then(doc => {
        if (cancelled) return;
        setPdf(doc);
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
      void loadingTask.destroy();
    };
  }, []);

  // Measure container width
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    let frame = 0;
    const measure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const next = Math.floor(node.clientWidth);
        setContainerWidth(prev => (Math.abs(prev - next) > 1 ? next : prev));
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  // Calculate Page 1 render width (capped to 720px for optimal book aspect ratio)
  const renderWidth = Math.max(120, Math.min(containerWidth - 24, 720));

  // Measure Page 1 height
  useEffect(() => {
    if (!pdf || renderWidth < 1) return;
    let cancelled = false;

    void pdf.getPage(1).then(page => {
      if (cancelled) return;
      const base = page.getViewport({ scale: 1 });
      const scale = renderWidth / base.width;
      const height = Math.floor(page.getViewport({ scale }).height);
      setPage1Height(height);
    });

    return () => {
      cancelled = true;
    };
  }, [pdf, renderWidth]);

  // Handle URL page parameter on initial mount
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("page");
    const requested = Number(param);
    if (requested === 2) {
      window.requestAnimationFrame(() => {
        const node = page2Ref.current;
        if (node && scrollRef.current) {
          scrollRef.current.scrollTo({ top: node.offsetTop - 8, behavior: "smooth" });
          setActivePage(2);
        }
      });
    }
  }, [state]);

  // Scroll to page
  const scrollToPage = useCallback((targetPage: 1 | 2) => {
    setActivePage(targetPage);
    const root = scrollRef.current;
    if (!root) return;

    if (targetPage === 1) {
      root.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const node = page2Ref.current;
      if (node) {
        root.scrollTo({ top: Math.max(0, node.offsetTop - 12), behavior: "smooth" });
      }
    }
  }, []);

  // IntersectionObserver to sync activePage indicator when scrolling
  useEffect(() => {
    const root = scrollRef.current;
    const p1 = page1Ref.current;
    const p2 = page2Ref.current;
    if (!root || !p1 || !p2 || state !== "ready") return;

    const observer = new IntersectionObserver(
      entries => {
        const intersecting = entries.filter(e => e.isIntersecting);
        if (!intersecting.length) return;
        const highestRatio = intersecting.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const pageNum = Number((highestRatio.target as HTMLElement).dataset.page);
        if (pageNum === 1 || pageNum === 2) {
          setActivePage(pageNum);
        }
      },
      { root, threshold: [0.3, 0.6] },
    );

    observer.observe(p1);
    observer.observe(p2);

    return () => observer.disconnect();
  }, [state, renderWidth, page1Height]);

  const label = copy(language, "Migration booklet", "مائیگریشن کتابچہ");
  const viewerClass = [
    "booklet-viewer",
    `booklet-viewer--${variant}`,
    "booklet-viewer--curated",
  ].join(" ");

  const isUrdu = language === "ur";
  const PrevIcon = isUrdu ? ChevronRight : ChevronLeft;
  const NextIcon = isUrdu ? ChevronLeft : ChevronRight;

  return (
    <section className={viewerClass} aria-label={label}>
      <div className="booklet-viewer__pdf-pane">
        {/* Navigation Toolbar */}
        <div className="booklet-viewer__page-indicator">
          {/* Previous Page Button */}
          <button
            type="button"
            className="booklet-viewer__nav-btn focus-ring"
            disabled={activePage === 1}
            onClick={() => scrollToPage(1)}
            aria-label={copy(language, "Previous page (Cover)", "پچھلا صفحہ (سرورق)")}
          >
            <PrevIcon size={18} aria-hidden="true" />
          </button>

          {/* Quick Page Selector Pills */}
          <div className="booklet-viewer__page-pills" role="tablist" aria-label={copy(language, "Booklet pages", "کتابچے کے صفحات")}>
            <button
              type="button"
              role="tab"
              aria-selected={activePage === 1}
              onClick={() => scrollToPage(1)}
              className={`booklet-viewer__pill focus-ring ${activePage === 1 ? "booklet-viewer__pill--active" : ""}`}
            >
              <span className="urdu">{copy(language, "1 • Cover", "1 • سرورق")}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activePage === 2}
              onClick={() => scrollToPage(2)}
              className={`booklet-viewer__pill focus-ring ${activePage === 2 ? "booklet-viewer__pill--active" : ""}`}
            >
              <span className="urdu">{copy(language, "2 • Coming Soon", "2 • جلد آ رہا ہے")}</span>
            </button>
          </div>

          {/* Next Page & Fullscreen Group */}
          <div className="flex items-center gap-1.5 justify-self-end">
            <button
              type="button"
              className="booklet-viewer__nav-btn focus-ring"
              disabled={activePage === 2}
              onClick={() => scrollToPage(2)}
              aria-label={copy(language, "Next page (Coming Soon)", "اگلا صفحہ (جلد آ رہا ہے)")}
            >
              <NextIcon size={18} aria-hidden="true" />
            </button>

            <button
              ref={expandRef}
              type="button"
              className="booklet-viewer__expand btn-quiet focus-ring"
              data-testid="booklet-fullscreen-open"
              aria-expanded={fullscreenOpen}
              aria-controls={BOOKLET_FULLSCREEN_DIALOG_ID}
              aria-label={copy(language, "Full screen", "پوری اسکرین")}
              onClick={() => setFullscreenOpen(true)}
            >
              <Maximize2 size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Viewer Stage (Vertical Scroll with Page 1 + Page 2) */}
        <div className="booklet-viewer__stage">
          <div ref={scrollRef} dir="ltr" className="booklet-viewer__scroll">
            {state === "loading" && (
              <p className="booklet-viewer__status" role="status">
                {copy(language, "Loading booklet cover…", "کتابچے کا سرورق لوڈ ہو رہا ہے…")}
              </p>
            )}

            {state === "error" && (
              <p className="booklet-viewer__status booklet-viewer__status--error" role="alert">
                {copy(language, "The booklet cover could not be loaded. Please refresh the page.", "کتابچے کا سرورق لوڈ نہیں ہو سکا۔ صفحہ دوبارہ کھولیں۔")}
              </p>
            )}

            {state === "ready" && pdf && containerWidth > 0 && (
              <div className="booklet-viewer__pages" style={{ maxWidth: "780px", margin: "0 auto", width: "100%" }}>
                {/* PAGE 1: The Official PDF First Page (Cover) */}
                <div
                  ref={page1Ref}
                  className="booklet-viewer__page-wrap"
                  data-page={1}
                  style={page1Height ? { minHeight: page1Height } : undefined}
                >
                  <BookletPdfPage
                    pdf={pdf}
                    pageNumber={1}
                    width={renderWidth}
                    language={language}
                  />

                  {/* Teaser button guiding to Page 2 */}
                  <button
                    type="button"
                    onClick={() => scrollToPage(2)}
                    className="booklet-viewer__next-teaser focus-ring"
                  >
                    <span className="urdu">
                      {copy(language, "Next: Complete Edition Details (Page 2)", "اگلا صفحہ: مکمل ایڈیشن کی تفصیلات (صفحہ 2)")}
                    </span>
                    <ArrowDown size={15} aria-hidden="true" />
                  </button>
                </div>

                {/* PAGE 2: The Modern "Coming Soon" Experience */}
                <div
                  ref={page2Ref}
                  className="booklet-viewer__page-wrap mt-4"
                  data-page={2}
                >
                  <BookletComingSoon
                    variant="embedded"
                    onBackToCover={() => scrollToPage(1)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Dialog Modal */}
      <BookletReaderFullscreen
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        page={activePage}
        pageCount={BOOKLET_ACTIVE_PAGE_COUNT}
        onPageChange={(target) => {
          if (target === 1 || target === 2) {
            scrollToPage(target);
          }
        }}
        pdf={pdf}
        bookletLabel={label}
        returnFocusRef={expandRef}
      />
    </section>
  );
}
