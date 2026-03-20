import type { ImageItem, PlacementMode, ProjectSettings } from "@/domain/model/types";

export interface LayoutCell {
  index: number;
  row: number;
  column: number;
  xMm: number;
  yMm: number;
  widthMm: number;
  heightMm: number;
  image?: ImageItem;
  placementMode?: PlacementMode;
}

export interface LayoutPage {
  widthMm: number;
  heightMm: number;
  cells: LayoutCell[];
  overflowImageCount: number;
  settings: ProjectSettings;
}
