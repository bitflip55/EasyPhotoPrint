import type {
  GridSettings,
  ImageItem,
  Margins,
  Orientation,
  PageFormat,
  PlacementMode,
  ProjectDocument,
  Spacing,
} from "@/domain/model/types";

export type ProjectAction =
  | { type: "project/reset"; payload: ProjectDocument }
  | { type: "images/add"; payload: ImageItem[] }
  | { type: "images/remove"; payload: { id: string } }
  | { type: "images/move"; payload: { fromIndex: number; toIndex: number } }
  | { type: "settings/updateGrid"; payload: Partial<GridSettings> }
  | { type: "settings/updateMargins"; payload: Partial<Margins> }
  | { type: "settings/updateSpacing"; payload: Partial<Spacing> }
  | { type: "settings/updatePageFormat"; payload: { format: PageFormat } }
  | { type: "settings/updateOrientation"; payload: { orientation: Orientation } }
  | { type: "settings/updatePlacementMode"; payload: { placementMode: PlacementMode } }
  | { type: "settings/updateCenterImages"; payload: { centerImages: boolean } }
  | { type: "settings/updatePrintCopies"; payload: { printCopies: number } };
