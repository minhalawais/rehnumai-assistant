import type { PDFDocumentProxy } from "pdfjs-dist";

export const BOOKLET_PAGE_GAP_PX = 10;
export const BOOKLET_PAGES_PADDING_PX = 10;

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
