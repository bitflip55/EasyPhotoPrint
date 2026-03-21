import { computePlacement } from "@/domain/layout/placement";
import type {
  ComputeLayoutInput,
  LayoutCell,
  LayoutDocument,
  LayoutPage,
} from "@/domain/layout/types";

function roundToMicrons(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function normalizePageSize(widthMm: number, heightMm: number, orientation: "portrait" | "landscape") {
  const isPortraitSource = heightMm >= widthMm;

  if (orientation === "portrait") {
    return isPortraitSource
      ? { widthMm, heightMm }
      : { widthMm: heightMm, heightMm: widthMm };
  }

  return isPortraitSource
    ? { widthMm: heightMm, heightMm: widthMm }
    : { widthMm, heightMm };
}

function createBaseLayoutPage(input: ComputeLayoutInput): Omit<LayoutPage, "pageIndex" | "pageCount"> {
  const { page, grid, images, placementMode, centerImages } = input;
  const normalizedPage = normalizePageSize(page.widthMm, page.heightMm, page.orientation);

  const contentWidthMm =
    normalizedPage.widthMm - page.margins.leftMm - page.margins.rightMm;
  const contentHeightMm =
    normalizedPage.heightMm - page.margins.topMm - page.margins.bottomMm;

  if (grid.columns <= 0 || grid.rows <= 0) {
    throw new Error("Grid rows and columns must be greater than zero.");
  }

  if (contentWidthMm <= 0 || contentHeightMm <= 0) {
    throw new Error("Margins exceed the available A4 page size.");
  }

  const totalHorizontalGapMm = (grid.columns - 1) * page.spacing.horizontalMm;
  const totalVerticalGapMm = (grid.rows - 1) * page.spacing.verticalMm;
  const cellWidthMm = (contentWidthMm - totalHorizontalGapMm) / grid.columns;
  const cellHeightMm = (contentHeightMm - totalVerticalGapMm) / grid.rows;

  if (cellWidthMm <= 0 || cellHeightMm <= 0) {
    throw new Error("Spacing leaves no room for printable cells.");
  }

  const cellCount = grid.rows * grid.columns;
  const cells: LayoutCell[] = [];

  for (let row = 0; row < grid.rows; row += 1) {
    for (let column = 0; column < grid.columns; column += 1) {
      const index = row * grid.columns + column;
      const xMm = page.margins.leftMm + column * (cellWidthMm + page.spacing.horizontalMm);
      const yMm = page.margins.topMm + row * (cellHeightMm + page.spacing.verticalMm);
      const image = images[index];
      const baseCell: LayoutCell = {
        index,
        row,
        column,
        xMm: roundToMicrons(xMm),
        yMm: roundToMicrons(yMm),
        widthMm: roundToMicrons(cellWidthMm),
        heightMm: roundToMicrons(cellHeightMm),
      };

      if (image) {
        baseCell.image = image;
        baseCell.placement = computePlacement({
          cellRectMm: baseCell,
          imageDimensions: image.dimensions,
          mode: placementMode,
          centerImages,
        });
      }

      cells.push(baseCell);
    }
  }

  return {
    widthMm: normalizedPage.widthMm,
    heightMm: normalizedPage.heightMm,
    contentRectMm: {
      xMm: page.margins.leftMm,
      yMm: page.margins.topMm,
      widthMm: roundToMicrons(contentWidthMm),
      heightMm: roundToMicrons(contentHeightMm),
    },
    margins: page.margins,
    grid,
    cells,
    placedImageCount: Math.min(images.length, cellCount),
    emptyCellCount: Math.max(0, cellCount - images.length),
    overflowImageCount: Math.max(0, images.length - cellCount),
    settings: {
      page: {
        ...page,
        widthMm: normalizedPage.widthMm,
        heightMm: normalizedPage.heightMm,
      },
      grid,
      placementMode,
      centerImages,
      printCopies: input.printCopies,
    },
  };
}

export function computeLayoutPage(input: ComputeLayoutInput): LayoutPage {
  const page = createBaseLayoutPage(input);

  return {
    ...page,
    pageIndex: 0,
    pageCount: 1,
  };
}

export function computeLayoutDocument(input: ComputeLayoutInput): LayoutDocument {
  const cellCount = input.grid.rows * input.grid.columns;

  if (cellCount <= 0) {
    throw new Error("Grid rows and columns must be greater than zero.");
  }

  const pageCount = Math.max(1, Math.ceil(input.images.length / cellCount));
  const pages: LayoutPage[] = Array.from({ length: pageCount }, (_, pageIndex) => {
    const startIndex = pageIndex * cellCount;
    const page = createBaseLayoutPage({
      ...input,
      images: input.images.slice(startIndex, startIndex + cellCount),
    });

    return {
      ...page,
      pageIndex,
      pageCount,
    };
  });

  return {
    pages,
    totalImageCount: input.images.length,
    placedImageCount: input.images.length,
    pageCount,
  };
}
