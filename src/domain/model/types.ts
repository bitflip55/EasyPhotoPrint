export type Orientation = "portrait" | "landscape";

export type PlacementMode = "fit" | "fill";
export type PrintMode = "direct" | "dialog";

export type PageFormat =
  | "A6"
  | "A5"
  | "A4"
  | "A3"
  | "B5"
  | "Letter"
  | "Legal"
  | "Executive"
  | "Tabloid";

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
  format: PageFormat;
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
  thumbnailUrl: string;
  thumbnailUrlKind: "object-url" | "asset-url";
}

export interface ProjectSettings {
  page: PageSettings;
  grid: GridSettings;
  placementMode: PlacementMode;
  centerImages: boolean;
  printCopies: number;
}

export interface ProjectDocument {
  settings: ProjectSettings;
  images: ImageItem[];
}

export interface PersistedProjectSettings {
  settings: ProjectSettings;
}
