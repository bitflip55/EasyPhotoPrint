import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeLayoutDocument, computeLayoutPage, computePlacement } from "@/domain/layout";
import type { ImageItem } from "@/domain/model/types";
import { defaultProjectSettings } from "@/state/defaults";

function createImage(id: string, widthPx: number, heightPx: number): ImageItem {
  return {
    id,
    name: `${id}.jpg`,
    path: `${id}.jpg`,
    thumbnailUrl: `memory://${id}`,
    thumbnailUrlKind: "asset-url",
    dimensions: { widthPx, heightPx },
  };
}

describe("computeLayoutPage", () => {
  it("computes cells with margins applied", () => {
    const page = computeLayoutPage({
      page: {
        ...defaultProjectSettings.page,
        margins: { topMm: 12, rightMm: 14, bottomMm: 16, leftMm: 18 },
      },
      grid: { rows: 2, columns: 2 },
      images: [],
      placementMode: "fit",
      centerImages: true,
      printCopies: 1,
    });

    assert.equal(page.contentRectMm.xMm, 18);
    assert.equal(page.contentRectMm.yMm, 12);
    assert.equal(page.cells[0]?.xMm, 18);
    assert.equal(page.cells[0]?.yMm, 12);
  });

  it("computes cells with gaps applied", () => {
    const page = computeLayoutPage({
      page: {
        ...defaultProjectSettings.page,
        spacing: { horizontalMm: 5, verticalMm: 7 },
      },
      grid: { rows: 2, columns: 3 },
      images: [],
      placementMode: "fit",
      centerImages: true,
      printCopies: 1,
    });

    assert.ok(
      Math.abs(page.cells[1]!.xMm - (page.cells[0]!.xMm + page.cells[0]!.widthMm + 5)) <
        0.001,
    );
    assert.ok(
      Math.abs(page.cells[3]!.yMm - (page.cells[0]!.yMm + page.cells[0]!.heightMm + 7)) <
        0.001,
    );
  });

  it("supports portrait and landscape", () => {
    const portrait = computeLayoutPage({
      page: { ...defaultProjectSettings.page, orientation: "portrait" },
      grid: { rows: 1, columns: 1 },
      images: [],
      placementMode: "fit",
      centerImages: true,
      printCopies: 1,
    });
    const landscape = computeLayoutPage({
      page: { ...defaultProjectSettings.page, orientation: "landscape" },
      grid: { rows: 1, columns: 1 },
      images: [],
      placementMode: "fit",
      centerImages: true,
      printCopies: 1,
    });

    assert.equal(portrait.widthMm, 210);
    assert.equal(portrait.heightMm, 297);
    assert.equal(landscape.widthMm, 297);
    assert.equal(landscape.heightMm, 210);
  });

  it("tracks too many and too few images", () => {
    const images = [
      createImage("a", 1000, 1000),
      createImage("b", 1000, 1000),
      createImage("c", 1000, 1000),
    ];

    const sparse = computeLayoutPage({
      page: defaultProjectSettings.page,
      grid: { rows: 2, columns: 2 },
      images: images.slice(0, 1),
      placementMode: "fit",
      centerImages: true,
      printCopies: 1,
    });
    const overflow = computeLayoutPage({
      page: defaultProjectSettings.page,
      grid: { rows: 1, columns: 2 },
      images,
      placementMode: "fit",
      centerImages: true,
      printCopies: 1,
    });

    assert.equal(sparse.emptyCellCount, 3);
    assert.equal(overflow.overflowImageCount, 1);
    assert.equal(overflow.placedImageCount, 2);
  });

  it("creates multiple pages when images exceed one sheet", () => {
    const images = [
      createImage("a", 1000, 1000),
      createImage("b", 1000, 1000),
      createImage("c", 1000, 1000),
      createImage("d", 1000, 1000),
      createImage("e", 1000, 1000),
    ];

    const document = computeLayoutDocument({
      page: defaultProjectSettings.page,
      grid: { rows: 2, columns: 2 },
      images,
      placementMode: "fit",
      centerImages: true,
      printCopies: 1,
    });

    assert.equal(document.pageCount, 2);
    assert.equal(document.pages[0]?.placedImageCount, 4);
    assert.equal(document.pages[1]?.placedImageCount, 1);
    assert.equal(document.pages[1]?.emptyCellCount, 3);
  });
});

describe("computePlacement", () => {
  const cellRectMm = { xMm: 0, yMm: 0, widthMm: 100, heightMm: 50 };

  it("computes fit placement without distortion", () => {
    const placement = computePlacement({
      cellRectMm,
      imageDimensions: { widthPx: 1000, heightPx: 1000 },
      mode: "fit",
      centerImages: true,
    });

    assert.equal(placement.targetRectMm.widthMm, 50);
    assert.equal(placement.targetRectMm.heightMm, 50);
    assert.equal(placement.targetRectMm.xMm, 25);
    assert.deepEqual(placement.sourceCrop, { x: 0, y: 0, width: 1, height: 1 });
  });

  it("computes fill placement with horizontal crop", () => {
    const placement = computePlacement({
      cellRectMm,
      imageDimensions: { widthPx: 2000, heightPx: 1000 },
      mode: "fill",
      centerImages: true,
    });

    assert.equal(placement.targetRectMm.widthMm, 100);
    assert.equal(placement.targetRectMm.heightMm, 50);
    assert.ok(Math.abs(placement.sourceCrop.width - 0.5) < 0.001);
    assert.ok(Math.abs(placement.sourceCrop.x - 0.25) < 0.001);
  });

  it("computes fill placement with vertical crop", () => {
    const placement = computePlacement({
      cellRectMm,
      imageDimensions: { widthPx: 1000, heightPx: 2000 },
      mode: "fill",
      centerImages: true,
    });

    assert.ok(Math.abs(placement.sourceCrop.height - 0.25) < 0.001);
    assert.ok(Math.abs(placement.sourceCrop.y - 0.375) < 0.001);
  });
});
