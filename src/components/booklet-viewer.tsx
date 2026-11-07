"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { copy, useLocale } from "@/components/locale";
import { BookletIndexBar, BookletIndexContents, BookletIndexPanel } from "@/components/booklet-index-panel";
import { BOOKLET_PDF_PATH } from "@/lib/booklet";
import { BOOKLET_INDEX_SESSION_KEY } from "@/lib/booklet-index";
import { bookletScrollTopForPage, measureBookletPageHeights } from "@/lib/booklet-page-layout";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const DESKTOP_NAV_MQ = "(min-width: 1024px)";

type BookletViewerProps = {
  variant?: "embedded" | "home";
};

function useDesktopSideNav(enabled: boolean) {
  const [active, setActive] = useState(false);

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

      const base = page.getViewport({ scale: 1 });
      const scale = width / base.width;
      const viewport = page.getViewport({ scale });
      const ctx = canvas.getContext("2d");
      if (!ctx || cancelled) return;

      const pixelWidth = Math.floor(viewport.width);
      const pixelHeight = Math.floor(viewport.height);
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      } else {
        ctx.clearRect(0, 0, pixelWidth, pixelHeight);
      }

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
      className="booklet-viewer__page"
      role="img"
      aria-label={copy(language, `Booklet page ${pageNumber}`, `کتابچے کا صفحہ ${pageNumber}`)}
    />
  );
}

/** Renders the official migration booklet in-page (PDF.js — works on mobile browsers). */
export function BookletViewer({ variant = "embedded" }: BookletViewerProps) {
  const { language } = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [width, setWidth] = useState(0);
  const [pageHeights, setPageHeights] = useState<Map<number, number> | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [indexOpen, setIndexOpen] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const pendingScrollPage = useRef<number | null>(null);
  const sideNav = useDesktopSideNav(variant === "home");
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
    let cancelled = false;
    setState("loading");
    const loadingTask = getDocument({ url: BOOKLET_PDF_PATH });
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
  }, []);

  useEffect(() => {
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
  }, [state, sideNav]);

  useEffect(() => {
    if (!pdf || width < 1) return;
    let cancelled = false;
    setPageHeights(null);
    void measureBookletPageHeights(pdf, width).then(heights => {
      if (!cancelled) setPageHeights(heights);
    });
    return () => {
      cancelled = true;
    };
  }, [pdf, width]);

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
    if (indexOverlay) return;
    if (pendingScrollPage.current == null) return;
    runPendingScroll();
    const retry = window.setTimeout(runPendingScroll, 120);
    return () => window.clearTimeout(retry);
  }, [indexOverlay, pageHeights, width, runPendingScroll]);

  useEffect(() => {
    if (indexOverlay || state !== "ready") return;
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
  }, [indexOverlay, state, pageCount, width, pageHeights]);

  function rememberIndexSeen() {
    try {
      sessionStorage.setItem(BOOKLET_INDEX_SESSION_KEY, "1");
    } catch {
      /* private mode */
    }
  }

  function scrollToPage(page: number) {
    rememberIndexSeen();
    pendingScrollPage.current = page;
    setActivePage(page);
    if (!sideNav) setIndexOpen(false);
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
  ].filter(Boolean).join(" ");

  const pdfPane = (
    <>
      {!sideNav && !indexOpen && <BookletIndexBar onOpen={openIndex} />}
      {state === "ready" && (sideNav || !indexOpen) && (
        <p className="booklet-viewer__page-indicator" aria-live="polite">
          {copy(language, `Page ${activePage} of ${pageCount}`, `صفحہ ${activePage} از ${pageCount}`)}
        </p>
      )}
      <div className="booklet-viewer__stage">
        <div
          ref={scrollRef}
          className={`booklet-viewer__scroll${indexOverlay ? " booklet-viewer__scroll--behind-index" : ""}`}
        >
          {state === "loading" && (
            <p className="booklet-viewer__status" role="status">
              {copy(language, "Loading booklet…", "کتابچہ لوڈ ہو رہا ہے…")}
            </p>
          )}
          {state === "error" && (
            <p className="booklet-viewer__status booklet-viewer__status--error" role="alert">
              {copy(language, "The booklet could not be loaded. Refresh the page.", "کتابچہ لوڈ نہیں ہو سکا۔ صفحہ دوبارہ کھولیں۔")}
            </p>
          )}
          {state === "ready" && pdf && width > 0 && (
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
