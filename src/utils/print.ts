import { invoke } from "@tauri-apps/api/core";

import { renderPdfDocumentFromPages } from "@/render/pdf/renderPdfDocument";
import type { RenderDocument } from "@/render/model";
import { isDesktopApp } from "@/utils/platform";

function triggerBrowserPrint(bytes: Uint8Array): void {
  const normalizedBytes = new Uint8Array(bytes.byteLength);

  normalizedBytes.set(bytes);

  const blob = new Blob([normalizedBytes.buffer], { type: "application/pdf" });
  const objectUrl = URL.createObjectURL(blob);
  const printWindow = window.open(objectUrl, "_blank", "noopener,noreferrer");

  if (!printWindow) {
    URL.revokeObjectURL(objectUrl);
    throw new Error("Browser popup was blocked before printing could start.");
  }

  setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 60_000);
}

export async function printRenderDocument(
  renderDocument: RenderDocument,
  copies: number,
): Promise<void> {
  const pdfBytes = await renderPdfDocumentFromPages(renderDocument);

  if (!isDesktopApp()) {
    triggerBrowserPrint(pdfBytes);
    return;
  }

  await invoke("print_pdf_bytes", { bytes: Array.from(pdfBytes), copies });
}

export async function openRenderDocumentPrintDialog(
  renderDocument: RenderDocument,
): Promise<string | void> {
  const pdfBytes = await renderPdfDocumentFromPages(renderDocument);

  if (!isDesktopApp()) {
    triggerBrowserPrint(pdfBytes);
    return;
  }

  return invoke<string>("open_pdf_bytes", { bytes: Array.from(pdfBytes) });
}
