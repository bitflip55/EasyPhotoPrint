import type { LayoutDocument, LayoutPage } from "@/domain/layout";
import type { RenderCellNode, RenderDocument, RenderPageNode, RenderRect } from "@/render/model";

function toRenderRect(
  x: number,
  y: number,
  width: number,
  height: number,
): RenderRect {
  return { x, y, width, height };
}

function buildRenderPageNode(layoutPage: LayoutPage): RenderPageNode {
  const cells: RenderCellNode[] = layoutPage.cells.map((cell) => {
    const targetRect = toRenderRect(cell.xMm, cell.yMm, cell.widthMm, cell.heightMm);
    const imageFrameRect = cell.placement
      ? toRenderRect(
          cell.placement.targetRectMm.xMm,
          cell.placement.targetRectMm.yMm,
          cell.placement.targetRectMm.widthMm,
          cell.placement.targetRectMm.heightMm,
        )
      : targetRect;

    return {
      type: "cell",
      id: `cell-${layoutPage.pageIndex}-${cell.index}`,
      targetRect,
      imageFrameRect,
      child: cell.image && cell.placement
        ? {
            type: "image",
            id: cell.image.id,
            source: cell.image.thumbnailUrl,
            sourcePath: cell.image.path,
            targetRect,
            crop: cell.placement.sourceCrop,
            placementMode: cell.placement.mode,
            alignX:
              cell.placement.sourceCrop.width < 1 && cell.placement.sourceCrop.x === 0
                ? "start"
                : "center",
            alignY:
              cell.placement.sourceCrop.height < 1 && cell.placement.sourceCrop.y === 0
                ? "start"
                : "center",
            background: "#ffffff",
          }
        : undefined,
    };
  });

  return {
    type: "page",
    pageIndex: layoutPage.pageIndex,
    pageCount: layoutPage.pageCount,
    width: layoutPage.widthMm,
    height: layoutPage.heightMm,
    background: layoutPage.settings.page.background,
    cells,
  };
}

export function buildRenderPage(layoutPage: LayoutPage): RenderPageNode {
  return buildRenderPageNode(layoutPage);
}

export function buildRenderDocument(layoutDocument: LayoutDocument): RenderDocument {
  return {
    pages: layoutDocument.pages.map(buildRenderPageNode),
  };
}
