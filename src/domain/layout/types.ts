import type {
  GridSettings,
  ImageDimensions,
  ImageItem,
  Margins,
  PageSettings,
  PlacementMode,
  ProjectSettings,
} from "@/domain/model/types";

export interface RectMm {
  xMm: number;
  yMm: number;
  widthMm: number;
  heightMm: number;
}

export interface RectNormalized {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutPlacement {
  mode: PlacementMode;
  targetRectMm: RectMm;
  sourceCrop: RectNormalized;
}

export interface LayoutCell extends RectMm {
  index: number;
  row: number;
  column: number;
  image?: ImageItem;
  placement?: LayoutPlacement;
}

export interface LayoutPage {
  pageIndex: number;
  pageCount: number;
  widthMm: number;
  heightMm: number;
  contentRectMm: RectMm;
  margins: Margins;
  grid: GridSettings;
  cells: LayoutCell[];
  placedImageCount: number;
  emptyCellCount: number;
  overflowImageCount: number;
  settings: ProjectSettings;
}

export interface LayoutDocument {
  pages: LayoutPage[];
  totalImageCount: number;
  placedImageCount: number;
  pageCount: number;
}

export interface PlacementInput {
  cellRectMm: RectMm;
  imageDimensions: ImageDimensions;
  mode: PlacementMode;
  centerImages: boolean;
}

export interface ComputeLayoutInput {
  page: PageSettings;
  grid: GridSettings;
  images: ImageItem[];
  placementMode: PlacementMode;
  centerImages: boolean;
  printCopies: number;
}
