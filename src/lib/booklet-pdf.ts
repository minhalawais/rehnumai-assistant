import { getDocument, type PDFDocumentLoadingTask } from "pdfjs-dist";
import { BOOKLET_PDF_PATH } from "@/lib/booklet";

/** Shared PDF.js loader (cmaps + standard fonts for Urdu/Arabic script). */
export function loadBookletPdfDocument(): PDFDocumentLoadingTask {
  return getDocument({
    url: BOOKLET_PDF_PATH,
    cMapUrl: "/cmaps/",
    cMapPacked: true,
    standardFontDataUrl: "/standard_fonts/",
    useSystemFonts: true,
  });
}
