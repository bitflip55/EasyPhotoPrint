export type Orientation = "portrait" | "landscape";

export type PlacementMode = "fit" | "fill";

export interface Margins {
  topMm: number;
  rightMm: number;
  bottomMm: number;
  leftMm: number;
}

export interface Spacing {
  horizontalMm: number;
  verticalMm: number;
}

export interface GridSettings {
  rows: number;
  columns: number;
}

export interface PageSettings {
  widthMm: number;
  heightMm: number;
  orientation: Orientation;
  margins: Margins;
  spacing: Spacing;
  background: string;
}

export interface ImageDimensions {
  widthPx: number;
  heightPx: number;
}

export interface ImageItem {
  id: string;
  name: string;
  path: string;
  dimensions: ImageDimensions;
}

export interface ProjectSettings {
  page: PageSettings;
  grid: GridSettings;
  placementMode: PlacementMode;
  centerImages: boolean;
}
