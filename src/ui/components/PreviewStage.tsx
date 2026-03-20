import { defaultProjectSettings } from "@/state/defaults";

function formatMarginLabel(value: number) {
  return `${value} mm`;
}

export function PreviewStage() {
  const { page, grid } = defaultProjectSettings;

  return (
    <section className="preview-stage">
      <header className="preview-stage__header">
        <div>
          <p className="eyebrow">Preview</p>
          <h2>A4 Live Preview</h2>
        </div>
        <p className="preview-stage__caption">
          The preview surface is wired for the later shared render model. M1 keeps
          it intentionally static and deterministic.
        </p>
      </header>

      <div className="preview-stage__surface">
        <div className="page-preview">
          <div className="page-preview__margins page-preview__margins--top">
            {formatMarginLabel(page.margins.topMm)}
          </div>
          <div className="page-preview__margins page-preview__margins--right">
            {formatMarginLabel(page.margins.rightMm)}
          </div>
          <div className="page-preview__margins page-preview__margins--bottom">
            {formatMarginLabel(page.margins.bottomMm)}
          </div>
          <div className="page-preview__margins page-preview__margins--left">
            {formatMarginLabel(page.margins.leftMm)}
          </div>

          <div
            className="page-preview__grid"
            style={{
              gridTemplateColumns: `repeat(${grid.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${grid.rows}, minmax(0, 1fr))`,
              columnGap: `${page.spacing.horizontalMm * 2}px`,
              rowGap: `${page.spacing.verticalMm * 2}px`,
            }}
          >
            {Array.from({ length: grid.rows * grid.columns }, (_, index) => (
              <div className="page-preview__cell" key={index}>
                <span>Cell {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
