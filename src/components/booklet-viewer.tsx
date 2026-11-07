"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { copy, useLocale } from "@/components/locale";
import { BookletIndexBar, BookletIndexContents, BookletIndexPanel } from "@/components/booklet-index-panel";
import { BOOKLET_PAGE_COUNT } from "@/lib/booklet";
import { loadBookletPdfDocument } from "@/lib/booklet-pdf";
import { BOOKLET_INDEX_SESSION_KEY } from "@/lib/booklet-index";
import { bookletNativePdfSrc, bookletScrollTopForPage, measureBookletPageHeights } from "@/lib/booklet-page-layout";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const DESKTOP_NAV_MQ = "(min-width: 1024px)";

type BookletViewerProps = {
  variant?: "embedded" | "home";
};

function readDesktopMq(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(DESKTOP_NAV_MQ).matches;
}

function useDesktopSideNav(enabled: boolean) {
  const [active, setActive] = useState(() => enabled && readDesktopMq());

  useEffect(() => {
    if (!enabled) {
      queueMicrotask(() => setActive(false));
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
  const [native, setNative] = useState(readDesktopMq);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_NAV_MQ);
    const sync = () => setNative(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return native;
}

function BookletPdfPage({ pdf, pageNumber, width, language }: { pdf: PDFDocumentProxy; pageNumber: number; width: number; language: "ur" | "en" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;

    renderTaskRef.current?.cancel();
    renderTaskRef.current = null;

    if (!canvas || width < 1) return;

    void pdf.getPage(pageNumber).then(page => {
      if (cancelled) return;

      const outputScale = Math.min(window.devicePixelRatio || 1, 2);
      const base = page.getViewport({ scale: 1 });
      const scale = width / base.width;
      const viewport = page.getViewport({ scale: scale * outputScale });
      const ctx = canvas.getContext("2d");
      if (!ctx || cancelled) return;

      const layoutViewport = page.getViewport({ scale });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(layoutViewport.width)}px`;
      canvas.style.height = `${Math.floor(layoutViewport.height)}px`;

      const task = page.render({ canvas, canvasContext: ctx, viewport });
      renderTaskRef.current = task;
      void task.promise
        .catch(() => undefined)
        .finally(() => {
          if (renderTaskRef.current === task) renderTaskRef.current = null;
        });
    });

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
    };
  }, [pdf, pageNumber, width]);

  return (
    <canvas
      ref={canvasRef}
      dir="ltr"
      className="booklet-viewer__page"
      role="img"
      aria-label={copy(language, `Booklet page ${pageNumber}`, `کتابچے کا صفحہ ${pageNumber}`)}
    />
  );
}

/**
 * Desktop (≥1024px): Chromium PDF embed — correct Urdu, toolbar hidden via URL hash.
 * Mobile: PDF.js canvas with LTR isolation (site `dir=rtl` breaks canvas text otherwise).
 */
export function BookletViewer({ variant = "embedded" }: BookletViewerProps) {
  const { language } = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageCount, setPageCount] = useState(BOOKLET_PAGE_COUNT);
  const [width, setWidth] = useState(0);
  const [pageHeights, setPageHeights] = useState<Map<number, number> | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [indexOpen, setIndexOpen] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [nativePdfSrc, setNativePdfSrc] = useState(() => bookletNativePdfSrc(1));
  const pendingScrollPage = useRef<number | null>(null);
  const sideNav = useDesktopSideNav(variant === "home");
  const useNativePdf = useDesktopNativePdf();
  const indexOverlay = indexOpen && !sideNav;

  useEffect(() => {
    if (sideNav) return;
    try {
      if (sessionStorage.getItem(BOOKLET_INDEX_SESSION_KEY) !== "1") {
        setIndexOpen(true);
      }
    } catch {
      setIndexOpen(true);
    }
  }, [sideNav]);

  useEffect(() => {
    if (useNativePdf) {
      setState("loading");
      setNativePdfSrc(bookletNativePdfSrc(1));
      setActivePage(1);
      return;
    }

    let cancelled = false;
    setState("loading");
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
    setPageHeights(null);
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

  const label = copy(language, "Migration booklet", "مائیگریشن کتابچہ");
  const viewerClass = [
    "booklet-viewer",
    `booklet-viewer--${variant}`,
    sideNav ? "booklet-viewer--side-nav" : "",
    useNativePdf ? "booklet-viewer--native" : "",
  ].filter(Boolean).join(" ");

  const pdfPane = (
    <>
      {!sideNav && !indexOpen && <BookletIndexBar onOpen={openIndex} />}
      {state === "ready" && (sideNav || !indexOpen) && (
        <p className="booklet-viewer__page-indicator" aria-live="polite">
          {copy(language, `Page ${activePage} of ${pageCount || BOOKLET_PAGE_COUNT}`, `صفحہ ${activePage} از ${pageCount || BOOKLET_PAGE_COUNT}`)}
        </p>
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
    </section>
  );
}
