"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import { copy, useLocale } from "@/components/locale";
import { BookletIndexBar, BookletIndexContents, BookletIndexPanel } from "@/components/booklet-index-panel";
import { BookletPdfPage, BOOKLET_FULLSCREEN_DIALOG_ID } from "@/components/booklet-pdf-page";
import { BookletReaderFullscreen } from "@/components/booklet-reader-fullscreen";
import { BOOKLET_PAGE_COUNT } from "@/lib/booklet";
import { loadBookletPdfDocument } from "@/lib/booklet-pdf";
import { BOOKLET_INDEX_SESSION_KEY } from "@/lib/booklet-index";
import { bookletNativePdfSrc, bookletScrollTopForPage, measureBookletPageHeights } from "@/lib/booklet-page-layout";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const DESKTOP_NAV_MQ = "(min-width: 1024px)";

type BookletViewerProps = {
  variant?: "embedded" | "home";
};

function useDesktopSideNav(enabled: boolean) {
  const [active, setActive] = useState(false);

  useLayoutEffect(() => {
    if (!enabled) {
      setActive(false);
      return;
    }
    const mq = window.matchMedia(DESKTOP_NAV_MQ);
    const sync = () => setActive(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [enabled]);

  return active;
}

function useDesktopNativePdf() {
  const [native, setNative] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia(DESKTOP_NAV_MQ);
    const sync = () => setNative(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return native;
}

/**
 * Desktop (≥1024px): Chromium PDF embed — correct Urdu, toolbar hidden via URL hash.
 * Mobile: PDF.js canvas with LTR isolation (site `dir=rtl` breaks canvas text otherwise).
 */
export function BookletViewer({ variant = "embedded" }: BookletViewerProps) {
  const { language } = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const expandRef = useRef<HTMLButtonElement>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageCount, setPageCount] = useState(BOOKLET_PAGE_COUNT);
  const [width, setWidth] = useState(0);
  const [pageHeights, setPageHeights] = useState<Map<number, number> | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [indexOpen, setIndexOpen] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [nativePdfSrc, setNativePdfSrc] = useState(() => bookletNativePdfSrc(1));
  const pendingScrollPage = useRef<number | null>(null);
  const sideNav = useDesktopSideNav(variant === "home");
  const useNativePdf = useDesktopNativePdf();
  const indexOverlay = indexOpen && !sideNav;

  useEffect(() => {
    if (sideNav) return;
    queueMicrotask(() => {
      try {
        if (sessionStorage.getItem(BOOKLET_INDEX_SESSION_KEY) !== "1") {
          setIndexOpen(true);
        }
      } catch {
        setIndexOpen(true);
      }
    });
  }, [sideNav]);

  useEffect(() => {
    if (useNativePdf) {
      queueMicrotask(() => {
        setState("loading");
        setNativePdfSrc(bookletNativePdfSrc(1));
        setActivePage(1);
      });
      return;
    }

    let cancelled = false;
    queueMicrotask(() => setState("loading"));
    const loadingTask = loadBookletPdfDocument();
    void loadingTask.promise
      .then(doc => {
        if (cancelled) return;
        setPdf(doc);
        setPageCount(doc.numPages);
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
      void loadingTask.destroy();
    };
  }, [useNativePdf]);

  useEffect(() => {
    if (useNativePdf) return;
    const node = scrollRef.current;
    if (!node) return;

    let frame = 0;
    const measure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const next = Math.floor(node.clientWidth);
        setWidth(prev => (Math.abs(prev - next) > 1 ? next : prev));
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [state, sideNav, useNativePdf]);

  useEffect(() => {
    if (useNativePdf || !pdf || width < 1) return;
    let cancelled = false;
    queueMicrotask(() => setPageHeights(null));
    void measureBookletPageHeights(pdf, width).then(heights => {
      if (!cancelled) setPageHeights(heights);
    });
    return () => {
      cancelled = true;
    };
  }, [pdf, width, useNativePdf]);

  const runPendingScroll = useCallback(() => {
    const page = pendingScrollPage.current;
    const root = scrollRef.current;
    if (!page || !root) return;

    if (pageHeights) {
      root.scrollTo({ top: bookletScrollTopForPage(page, pageHeights), behavior: "smooth" });
      pendingScrollPage.current = null;
      return;
    }

    const target = pageRefs.current.get(page);
    if (target) {
      const top = target.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop;
      root.scrollTo({ top: Math.max(0, top - 8), behavior: "smooth" });
      pendingScrollPage.current = null;
    }
  }, [pageHeights]);

  useEffect(() => {
    const requestedPage = Number(new URLSearchParams(window.location.search).get("page"));
    if (!Number.isInteger(requestedPage) || requestedPage < 1 || requestedPage > BOOKLET_PAGE_COUNT) return;

    try {
      sessionStorage.setItem(BOOKLET_INDEX_SESSION_KEY, "1");
    } catch {
      /* private mode */
    }
    setIndexOpen(false);
    setActivePage(requestedPage);
    pendingScrollPage.current = requestedPage;
    if (useNativePdf) {
      setNativePdfSrc(bookletNativePdfSrc(requestedPage));
    } else if (state === "ready") {
      window.requestAnimationFrame(runPendingScroll);
    }
  }, [runPendingScroll, state, useNativePdf]);

  useEffect(() => {
    if (useNativePdf || indexOverlay) return;
    if (pendingScrollPage.current == null) return;
    runPendingScroll();
    const retry = window.setTimeout(runPendingScroll, 120);
    return () => window.clearTimeout(retry);
  }, [indexOverlay, pageHeights, width, runPendingScroll, useNativePdf]);

  useEffect(() => {
    if (useNativePdf || indexOverlay || state !== "ready") return;
    const root = scrollRef.current;
    if (!root) return;

    const markers = Array.from(pageRefs.current.values());
    if (!markers.length) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0]?.target as HTMLDivElement | undefined;
        const page = Number(top?.dataset.page);
        if (page) setActivePage(page);
      },
      { root, threshold: [0.35, 0.55, 0.75] },
    );

    for (const marker of markers) observer.observe(marker);
    return () => observer.disconnect();
  }, [indexOverlay, state, pageCount, width, pageHeights, useNativePdf]);

  function rememberIndexSeen() {
    try {
      sessionStorage.setItem(BOOKLET_INDEX_SESSION_KEY, "1");
    } catch {
      /* private mode */
    }
  }

  function scrollToPage(page: number) {
    rememberIndexSeen();
    setActivePage(page);
    pendingScrollPage.current = page;
    if (useNativePdf) {
      setState("loading");
      setNativePdfSrc(bookletNativePdfSrc(page));
    }
    if (!sideNav) setIndexOpen(false);
    if (!useNativePdf) {
      queueMicrotask(() => runPendingScroll());
      window.setTimeout(() => runPendingScroll(), 120);
      window.setTimeout(() => runPendingScroll(), 360);
    }
  }

  function openIndex() {
    setIndexOpen(true);
  }

  function closeIndex() {
    rememberIndexSeen();
    setIndexOpen(false);
  }

  function handleFullscreenPageChange(page: number) {
    setActivePage(page);
    if (useNativePdf) {
      setNativePdfSrc(bookletNativePdfSrc(page));
    } else {
      pendingScrollPage.current = page;
      queueMicrotask(() => runPendingScroll());
    }
  }

  function closeFullscreen() {
    setFullscreenOpen(false);
    pendingScrollPage.current = activePage;
    queueMicrotask(() => runPendingScroll());
  }

  const label = copy(language, "Migration booklet", "مائیگریشن کتابچہ");
  const viewerClass = [
    "booklet-viewer",
    `booklet-viewer--${variant}`,
    sideNav ? "booklet-viewer--side-nav" : "",
    useNativePdf ? "booklet-viewer--native" : "",
  ].filter(Boolean).join(" ");

  const canExpand = state === "ready" || useNativePdf;

  const pdfPane = (
    <>
      {!sideNav && !indexOpen && <BookletIndexBar onOpen={openIndex} />}
      {canExpand && (sideNav || !indexOpen) && (
        <div className="booklet-viewer__page-indicator">
          <span aria-live="polite">
            {copy(language, `Page ${activePage} of ${pageCount || BOOKLET_PAGE_COUNT}`, `صفحہ ${activePage} از ${pageCount || BOOKLET_PAGE_COUNT}`)}
          </span>
          <button
            ref={expandRef}
            type="button"
            className="booklet-viewer__expand btn-quiet"
            data-testid="booklet-fullscreen-open"
            aria-expanded={fullscreenOpen}
            aria-controls={BOOKLET_FULLSCREEN_DIALOG_ID}
            aria-label={copy(language, "Full screen", "پوری اسکرین")}
            onClick={() => setFullscreenOpen(true)}
          >
            <Maximize2 size={18} aria-hidden="true" />
          </button>
        </div>
      )}
      <div className="booklet-viewer__stage">
        <div
          ref={scrollRef}
          dir="ltr"
          className={`booklet-viewer__scroll${indexOverlay ? " booklet-viewer__scroll--behind-index" : ""}`}
        >
          {state === "loading" && !useNativePdf && (
            <p className="booklet-viewer__status" role="status">
              {copy(language, "Loading booklet…", "کتابچہ لوڈ ہو رہا ہے…")}
            </p>
          )}
          {state === "error" && !useNativePdf && (
            <p className="booklet-viewer__status booklet-viewer__status--error" role="alert">
              {copy(language, "The booklet could not be loaded. Refresh the page.", "کتابچہ لوڈ نہیں ہو سکا۔ صفحہ دوبارہ کھولیں۔")}
            </p>
          )}
          {useNativePdf && (
            <iframe
              key={nativePdfSrc}
              title={label}
              className="booklet-viewer__native"
              src={nativePdfSrc}
              onLoad={() => setState("ready")}
            />
          )}
          {!useNativePdf && state === "ready" && pdf && width > 0 && (
            <div className="booklet-viewer__pages">
              {Array.from({ length: pageCount }, (_, index) => {
                const pageNumber = index + 1;
                const minHeight = pageHeights?.get(pageNumber);
                return (
                  <div
                    key={pageNumber}
                    className="booklet-viewer__page-wrap"
                    data-page={pageNumber}
                    style={minHeight ? { minHeight } : undefined}
                    ref={node => {
                      if (node) pageRefs.current.set(pageNumber, node);
                      else pageRefs.current.delete(pageNumber);
                    }}
                  >
                    <BookletPdfPage pdf={pdf} pageNumber={pageNumber} width={width} language={language} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {indexOverlay && (
          <BookletIndexPanel open onOpen={openIndex} onClose={closeIndex} onSelectPage={scrollToPage} />
        )}
      </div>
    </>
  );

  return (
    <section className={viewerClass} aria-label={label}>
      {sideNav && (
        <BookletIndexContents layout="rail" activePage={activePage} onSelectPage={scrollToPage} />
      )}
      <div className="booklet-viewer__pdf-pane">{pdfPane}</div>
      <BookletReaderFullscreen
        open={fullscreenOpen}
        onClose={closeFullscreen}
        page={activePage}
        pageCount={pageCount}
        onPageChange={handleFullscreenPageChange}
        useNativePdf={useNativePdf}
        pdf={pdf}
        bookletLabel={label}
        returnFocusRef={expandRef}
      />
    </section>
  );
}
