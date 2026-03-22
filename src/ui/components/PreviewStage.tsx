import type { LayoutPage } from "@/domain/layout";
import type { RenderPageNode } from "@/render/model";

interface PreviewStageProps {
  layoutPage: LayoutPage;
  renderPage: RenderPageNode;
  canGoToPreviousPage: boolean;
  canGoToNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

function toPercent(value: number, total: number): string {
  return `${(value / total) * 100}%`;
}

function toObjectPosition(
  alignX: "start" | "center",
  alignY: "start" | "center",
): string {
  const x = alignX === "start" ? "left" : "center";
  const y = alignY === "start" ? "top" : "center";

  return `${x} ${y}`;
}

function formatMarginLabel(value: number): string {
  return `${value} mm`;
}

function formatPrintSizeLabel(width: number, height: number): string {
  return `${width.toFixed(1)} x ${height.toFixed(1)} mm`;
}

export function PreviewStage({
  layoutPage,
  renderPage,
  canGoToPreviousPage,
  canGoToNextPage,
  onPreviousPage,
  onNextPage,
}: PreviewStageProps) {
  const pageAspectRatio = `${layoutPage.widthMm} / ${layoutPage.heightMm}`;
  const previewTitle = `${layoutPage.settings.page.format} Live Preview`;
  const hasMultiplePages = renderPage.pageCount > 1;

  return (
    <section className="preview-stage">
      <header className="preview-stage__header">
        <div>
          <p className="eyebrow">Preview</p>
          <h2>{previewTitle}</h2>
        </div>
        <div className="preview-stage__toolbar">
          <p className="preview-stage__caption">
            Page {renderPage.pageIndex + 1} of {renderPage.pageCount}
          </p>
          {hasMultiplePages ? (
            <div className="action-row">
              <button
                className={
                  canGoToPreviousPage
                    ? "button"
                    : "button button--placeholder"
                }
                type="button"
                onClick={onPreviousPage}
                disabled={!canGoToPreviousPage}
                aria-hidden={!canGoToPreviousPage}
                tabIndex={canGoToPreviousPage ? 0 : -1}
              >
                Back
              </button>
              <button
                className={
                  canGoToNextPage
                    ? "button"
                    : "button button--placeholder"
                }
                type="button"
                onClick={onNextPage}
                disabled={!canGoToNextPage}
                aria-hidden={!canGoToNextPage}
                tabIndex={canGoToNextPage ? 0 : -1}
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <div className="preview-stage__surface">
        <div
          className="page-preview"
          style={{
            aspectRatio: pageAspectRatio,
            background: renderPage.background,
          }}
        >
          <div className="page-preview__margins page-preview__margins--top">
            {formatMarginLabel(layoutPage.margins.topMm)}
          </div>
          <div className="page-preview__margins page-preview__margins--right">
            {formatMarginLabel(layoutPage.margins.rightMm)}
          </div>
          <div className="page-preview__margins page-preview__margins--bottom">
            {formatMarginLabel(layoutPage.margins.bottomMm)}
          </div>
          <div className="page-preview__margins page-preview__margins--left">
            {formatMarginLabel(layoutPage.margins.leftMm)}
          </div>

          <div
            className="page-preview__content"
            style={{
              left: toPercent(layoutPage.contentRectMm.xMm, layoutPage.widthMm),
              top: toPercent(layoutPage.contentRectMm.yMm, layoutPage.heightMm),
              width: toPercent(layoutPage.contentRectMm.widthMm, layoutPage.widthMm),
              height: toPercent(layoutPage.contentRectMm.heightMm, layoutPage.heightMm),
            }}
          >
            {renderPage.cells.map((cell, index) => (
              <div
                className="page-preview__cell"
                key={cell.id}
                style={{
                  left: toPercent(
                    cell.targetRect.x - layoutPage.contentRectMm.xMm,
                    layoutPage.contentRectMm.widthMm,
                  ),
                  top: toPercent(
                    cell.targetRect.y - layoutPage.contentRectMm.yMm,
                    layoutPage.contentRectMm.heightMm,
                  ),
                  width: toPercent(cell.targetRect.width, layoutPage.contentRectMm.widthMm),
                  height: toPercent(cell.targetRect.height, layoutPage.contentRectMm.heightMm),
                }}
              >
                {cell.child ? (
                  <>
                    <div
                      className="page-preview__image-frame"
                      style={{
                        left: toPercent(
                          cell.imageFrameRect.x - cell.targetRect.x,
                          cell.targetRect.width,
                        ),
                        top: toPercent(
                          cell.imageFrameRect.y - cell.targetRect.y,
                          cell.targetRect.height,
                        ),
                        width: toPercent(cell.imageFrameRect.width, cell.targetRect.width),
                        height: toPercent(cell.imageFrameRect.height, cell.targetRect.height),
                      }}
                    >
                      <img
                        alt={`Preview ${index + 1}`}
                        className="page-preview__image"
                        src={cell.child.source}
                        style={{
                          objectFit:
                            cell.child.placementMode === "fill" ? "cover" : "fill",
                          objectPosition: toObjectPosition(
                            cell.child.alignX,
                            cell.child.alignY,
                          ),
                        }}
                      />
                    </div>
                    <div className="page-preview__print-size">
                      {formatPrintSizeLabel(
                        cell.imageFrameRect.width,
                        cell.imageFrameRect.height,
                      )}
                    </div>
                  </>
                ) : (
                  <span>Empty</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
