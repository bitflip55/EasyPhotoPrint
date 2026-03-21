import {
  PDFDocument,
  clip,
  endPath,
  popGraphicsState,
  pushGraphicsState,
  rectangle,
  rgb,
} from "pdf-lib";
import { readFile } from "@tauri-apps/plugin-fs";

import type { RenderCellNode, RenderDocument, RenderPageNode } from "@/render/model";
import { isDesktopApp } from "@/utils/platform";
import { mmToPdfPoints } from "@/utils/mm";

interface RgbColor {
  red: number;
  green: number;
  blue: number;
}

function clampColorChannel(value: number): number {
  return Math.min(255, Math.max(0, value));
}

function parseHexColor(value: string): RgbColor {
  const normalized = value.trim().replace("#", "");

  if (normalized.length !== 6) {
    return { red: 255, green: 255, blue: 255 };
  }

  return {
    red: clampColorChannel(Number.parseInt(normalized.slice(0, 2), 16)),
    green: clampColorChannel(Number.parseInt(normalized.slice(2, 4), 16)),
    blue: clampColorChannel(Number.parseInt(normalized.slice(4, 6), 16)),
  };
}

function toPdfY(pageHeightMm: number, yMm: number, heightMm: number): number {
  return mmToPdfPoints(pageHeightMm - yMm - heightMm);
}

async function loadImageBytes(cell: RenderCellNode): Promise<Uint8Array> {
  if (!cell.child) {
    throw new Error("PDF export received an image cell without image content.");
  }

  if (isDesktopApp()) {
    return readFile(cell.child.sourcePath);
  }

  const response = await fetch(cell.child.source);

  if (!response.ok) {
    throw new Error(`Image source could not be fetched for PDF export: ${cell.child.source}`);
  }

  return new Uint8Array(await response.arrayBuffer());
}

function normalizeBytesToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  const normalizedBytes = new Uint8Array(buffer);

  normalizedBytes.set(bytes);

  return buffer;
}

async function blobToPngBytes(blob: Blob): Promise<Uint8Array> {
  const imageBitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");

  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  const context = canvas.getContext("2d");

  if (!context) {
    imageBitmap.close();
    throw new Error("Canvas 2D context is unavailable for PDF image conversion.");
  }

  context.drawImage(imageBitmap, 0, 0);
  imageBitmap.close();

  const pngBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((value) => resolve(value), "image/png");
  });

  if (!pngBlob) {
    throw new Error("Unsupported image could not be converted to PNG for PDF export.");
  }

  return new Uint8Array(await pngBlob.arrayBuffer());
}

async function normalizeEmbeddableImage(
  bytes: Uint8Array,
): Promise<{ kind: "png" | "jpg"; bytes: Uint8Array }> {
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return { kind: "png", bytes };
  }

  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    return { kind: "jpg", bytes };
  }

  const normalizedBuffer = normalizeBytesToArrayBuffer(bytes);
  const pngBytes = await blobToPngBytes(new Blob([normalizedBuffer]));

  return { kind: "png", bytes: pngBytes };
}

function drawClippedImage(
  page: ReturnType<PDFDocument["addPage"]>,
  renderPage: RenderPageNode,
  cell: RenderCellNode,
  embeddedImage: {
    width: number;
    height: number;
  },
) {
  if (!cell.child) {
    return;
  }

  const frame = cell.imageFrameRect;
  const crop = cell.child.crop;
  const drawnWidthMm = frame.width / crop.width;
  const drawnHeightMm = frame.height / crop.height;
  const drawnXmm = frame.x - crop.x * drawnWidthMm;
  const drawnYmm = frame.y - crop.y * drawnHeightMm;

  page.pushOperators(
    pushGraphicsState(),
    rectangle(
      mmToPdfPoints(frame.x),
      toPdfY(renderPage.height, frame.y, frame.height),
      mmToPdfPoints(frame.width),
      mmToPdfPoints(frame.height),
    ),
    clip(),
    endPath(),
  );

  page.drawImage(embeddedImage as never, {
    x: mmToPdfPoints(drawnXmm),
    y: toPdfY(renderPage.height, drawnYmm, drawnHeightMm),
    width: mmToPdfPoints(drawnWidthMm),
    height: mmToPdfPoints(drawnHeightMm),
  });

  page.pushOperators(popGraphicsState());
}

export async function renderPdfDocument(renderPage: RenderPageNode): Promise<Uint8Array> {
  return renderPdfDocumentFromPages({ pages: [renderPage] });
}

export async function renderPdfDocumentFromPages(
  renderDocument: RenderDocument,
): Promise<Uint8Array> {
  const pdfDocument = await PDFDocument.create();

  for (const renderPage of renderDocument.pages) {
    const page = pdfDocument.addPage([
      mmToPdfPoints(renderPage.width),
      mmToPdfPoints(renderPage.height),
    ]);
    const pageColor = parseHexColor(renderPage.background);

    page.drawRectangle({
      x: 0,
      y: 0,
      width: mmToPdfPoints(renderPage.width),
      height: mmToPdfPoints(renderPage.height),
      color: rgb(pageColor.red / 255, pageColor.green / 255, pageColor.blue / 255),
    });

    for (const cell of renderPage.cells) {
      if (!cell.child) {
        continue;
      }

      const rawImageBytes = await loadImageBytes(cell);
      const image = await normalizeEmbeddableImage(rawImageBytes);
      const embeddedImage =
        image.kind === "png"
          ? await pdfDocument.embedPng(image.bytes)
          : await pdfDocument.embedJpg(image.bytes);

      drawClippedImage(page, renderPage, cell, embeddedImage);
    }
  }

  return pdfDocument.save();
}
