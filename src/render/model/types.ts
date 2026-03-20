export interface RenderRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RenderImageNode {
  type: "image";
  id: string;
  source: string;
  targetRect: RenderRect;
  clipRect?: RenderRect;
  background?: string;
}

export interface RenderCellNode {
  type: "cell";
  id: string;
  targetRect: RenderRect;
  child?: RenderImageNode;
}

export interface RenderPageNode {
  type: "page";
  width: number;
  height: number;
  background: string;
  cells: RenderCellNode[];
}

export type RenderNode = RenderPageNode | RenderCellNode | RenderImageNode;
