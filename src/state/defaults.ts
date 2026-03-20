import type { ProjectSettings } from "@/domain/model/types";

export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

export const defaultProjectSettings: ProjectSettings = {
  page: {
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
};
