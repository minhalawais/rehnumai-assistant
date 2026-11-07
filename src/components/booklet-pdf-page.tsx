"use client";

import { useEffect, useRef } from "react";
import { copy } from "@/components/locale";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";

export const BOOKLET_FULLSCREEN_DIALOG_ID = "booklet-reader-fullscreen-dialog";

type BookletPdfPageProps = {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  width: number;
  language: "ur" | "en";
  className?: string;
};

/** Renders one PDF.js page to canvas (LTR for complex scripts). */
export function BookletPdfPage({ pdf, pageNumber, width, language, className = "booklet-viewer__page" }: BookletPdfPageProps) {
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
      className={className}
      role="img"
      aria-label={copy(language, `Booklet page ${pageNumber}`, `کتابچے کا صفحہ ${pageNumber}`)}
    />
  );
}
