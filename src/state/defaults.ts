import type { PageFormat, ProjectDocument, ProjectSettings } from "@/domain/model/types";

export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

export const PAGE_FORMAT_DIMENSIONS: Record<PageFormat, { widthMm: number; heightMm: number }> = {
  A6: { widthMm: 105, heightMm: 148 },
  A5: { widthMm: 148, heightMm: 210 },
  A4: { widthMm: 210, heightMm: 297 },
  A3: { widthMm: 297, heightMm: 420 },
  B5: { widthMm: 176, heightMm: 250 },
  Letter: { widthMm: 215.9, heightMm: 279.4 },
  Legal: { widthMm: 215.9, heightMm: 355.6 },
  Executive: { widthMm: 184.15, heightMm: 266.7 },
  Tabloid: { widthMm: 279.4, heightMm: 431.8 },
};

export const defaultProjectSettings: ProjectSettings = {
  page: {
    format: "A4",
    widthMm: A4_WIDTH_MM,
    heightMm: A4_HEIGHT_MM,
    orientation: "portrait",
    margins: {
      topMm: 10,
      rightMm: 10,
      bottomMm: 10,
      leftMm: 10,
    },
    spacing: {
      horizontalMm: 4,
      verticalMm: 4,
    },
    background: "#ffffff",
  },
  grid: {
    rows: 2,
    columns: 2,
  },
  placementMode: "fit",
  centerImages: true,
  printCopies: 1,
};

export const defaultProjectDocument: ProjectDocument = {
  settings: defaultProjectSettings,
  images: [],
};

export function createDefaultProjectDocument(
  settings: ProjectSettings = defaultProjectSettings,
): ProjectDocument {
  return {
    settings,
    images: [],
  };
}
