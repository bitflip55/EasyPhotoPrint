import type {
  LayoutPlacement,
  PlacementInput,
  RectMm,
  RectNormalized,
} from "@/domain/layout/types";

function clampToUnitInterval(value: number): number {
  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
}

function createFullCrop(): RectNormalized {
  return {
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  };
}

function createCenteredRect(
  cellRectMm: RectMm,
  widthMm: number,
  heightMm: number,
  centerImages: boolean,
): RectMm {
  const offsetX = centerImages ? (cellRectMm.widthMm - widthMm) / 2 : 0;
  const offsetY = centerImages ? (cellRectMm.heightMm - heightMm) / 2 : 0;

  return {
    xMm: cellRectMm.xMm + offsetX,
    yMm: cellRectMm.yMm + offsetY,
    widthMm,
    heightMm,
  };
}

export function computePlacement(input: PlacementInput): LayoutPlacement {
  const { cellRectMm, imageDimensions, mode, centerImages } = input;

  if (imageDimensions.widthPx <= 0 || imageDimensions.heightPx <= 0) {
    return {
      mode,
      targetRectMm: cellRectMm,
      sourceCrop: createFullCrop(),
    };
  }

  const cellAspect = cellRectMm.widthMm / cellRectMm.heightMm;
  const imageAspect = imageDimensions.widthPx / imageDimensions.heightPx;

  if (mode === "fit") {
    const scale = Math.min(
      cellRectMm.widthMm / imageDimensions.widthPx,
      cellRectMm.heightMm / imageDimensions.heightPx,
    );

    const widthMm = imageDimensions.widthPx * scale;
    const heightMm = imageDimensions.heightPx * scale;

    return {
      mode,
      targetRectMm: createCenteredRect(cellRectMm, widthMm, heightMm, centerImages),
      sourceCrop: createFullCrop(),
    };
  }

  if (imageAspect > cellAspect) {
    const cropWidth = clampToUnitInterval(cellAspect / imageAspect);
    const cropX = centerImages ? (1 - cropWidth) / 2 : 0;

    return {
      mode,
      targetRectMm: cellRectMm,
      sourceCrop: {
        x: cropX,
        y: 0,
        width: cropWidth,
        height: 1,
      },
    };
  }

  const cropHeight = clampToUnitInterval(imageAspect / cellAspect);
  const cropY = centerImages ? (1 - cropHeight) / 2 : 0;

  return {
    mode,
    targetRectMm: cellRectMm,
    sourceCrop: {
      x: 0,
      y: cropY,
      width: 1,
      height: cropHeight,
    },
  };
}
