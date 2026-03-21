export interface RenderRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RenderCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RenderImageNode {
  type: "image";
  id: string;
  source: string;
  sourcePath: string;
  targetRect: RenderRect;
  crop: RenderCrop;
  placementMode: "fit" | "fill";
  alignX: "start" | "center";
  alignY: "start" | "center";
  background?: string;
}

export interface RenderCellNode {
  type: "cell";
  id: string;
  targetRect: RenderRect;
  imageFrameRect: RenderRect;
  child?: RenderImageNode;
}

export interface RenderPageNode {
  type: "page";
  pageIndex: number;
  pageCount: number;
  width: number;
  height: number;
  background: string;
  cells: RenderCellNode[];
}

export interface RenderDocument {
  pages: RenderPageNode[];
}

export type RenderNode = RenderPageNode | RenderCellNode | RenderImageNode;
