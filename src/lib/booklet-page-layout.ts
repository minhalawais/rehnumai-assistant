import type { PDFDocumentProxy } from "pdfjs-dist";
import { BOOKLET_PDF_PATH } from "@/lib/booklet";

export const BOOKLET_PAGE_GAP_PX = 10;
export const BOOKLET_PAGES_PADDING_PX = 10;

/** Chromium PDF open parameters — hide built-in toolbar/side panes where supported. */
export const BOOKLET_NATIVE_PDF_HASH = "toolbar=0&navpanes=0&scrollbar=0";

export function bookletNativePdfSrc(page = 1): string {
  const path = BOOKLET_PDF_PATH.split("#")[0];
  const hash = `${BOOKLET_NATIVE_PDF_HASH}${page > 1 ? `&page=${page}` : ""}`;
  return `${path}#${hash}`;
}

/** Pixel heights per PDF page at the given render width (1-based page numbers). */
export async function measureBookletPageHeights(pdf: PDFDocumentProxy, width: number): Promise<Map<number, number>> {
  const heights = new Map<number, number>();
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const base = page.getViewport({ scale: 1 });
    const scale = width / base.width;
    heights.set(pageNumber, Math.floor(page.getViewport({ scale }).height));
  }
  return heights;
}

export function bookletScrollTopForPage(page: number, heights: Map<number, number>): number {
  let top = BOOKLET_PAGES_PADDING_PX;
  for (let i = 1; i < page; i += 1) {
    top += (heights.get(i) ?? 0) + BOOKLET_PAGE_GAP_PX;
  }
  return Math.max(0, top - 8);
}
