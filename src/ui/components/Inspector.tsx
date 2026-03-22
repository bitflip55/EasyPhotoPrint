import { useState, type Dispatch } from "react";

import type { ProjectDocument } from "@/domain/model/types";
import type { ProjectAction } from "@/state/actions";
import { clamp } from "@/utils/clamp";

interface InspectorProps {
  project: ProjectDocument;
  pageCount: number;
  totalImageCount: number;
  cellSizeMm: { widthMm: number; heightMm: number } | null;
  onDispatch: Dispatch<ProjectAction>;
  onReset: () => void;
  onExportPdf: () => void;
  onPrintDirect: () => void;
  onPrintWithOptions: () => void;
  actionStatusMessage: string | null;
}

interface NumberFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  title?: string;
  onChange: (value: number) => void;
}

function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  disabled = false,
  title,
  onChange,
}: NumberFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        title={title}
        onChange={(event) => onChange(clamp(Number(event.target.value), min, max))}
      />
    </label>
  );
}

function NumberFieldInline({
  label,
  value,
  min,
  max,
  step = 1,
  disabled = false,
  title,
  onChange,
}: NumberFieldProps) {
  return (
    <label className="field field--inline">
      <span>{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        title={title}
        onChange={(event) => onChange(clamp(Number(event.target.value), min, max))}
      />
    </label>
  );
}

function PrintCopiesControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="print-copies-control" aria-label="Print copies">
      <button
        className="button button--ghost print-copies-control__button"
        type="button"
        onClick={() => onChange(clamp(value - 1, 1, 20))}
      >
        -
      </button>
      <div className="print-copies-control__value" title="Print copies">
        <strong>{value}</strong>
        <span>x</span>
      </div>
      <button
        className="button button--ghost print-copies-control__button"
        type="button"
        onClick={() => onChange(clamp(value + 1, 1, 20))}
      >
        +
      </button>
    </div>
  );
}

function formatMmSize(widthMm: number, heightMm: number): string {
  return `${widthMm.toFixed(1)} x ${heightMm.toFixed(1)} mm`;
}

function LinkToggleButton({
  linked,
  label,
  onClick,
}: {
  linked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={linked ? "link-toggle-button is-linked" : "link-toggle-button"}
      type="button"
      aria-pressed={linked}
      title={label}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {linked ? (
          <>
            <path
              d="M9 15l6-6"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
            <path
              d="M7.5 16.5l-1.8 1.8a3 3 0 1 1-4.2-4.2l2.6-2.6a3 3 0 0 1 4.2 0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
            <path
              d="M16.5 7.5l1.8-1.8a3 3 0 1 1 4.2 4.2l-2.6 2.6a3 3 0 0 1-4.2 0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </>
        ) : (
          <>
            <path
              d="M6.5 17.5l-1.8 1.8a3 3 0 1 1-4.2-4.2l2.6-2.6a3 3 0 0 1 4.2 0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
            <path
              d="M17.5 6.5l1.8-1.8a3 3 0 1 1 4.2 4.2l-2.6 2.6a3 3 0 0 1-4.2 0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
            <path
              d="M9 15l6-6"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
            <path
              d="M6.5 6.5l11 11"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
          </>
        )}
      </svg>
    </button>
  );
}

export function Inspector({
  project,
  pageCount,
  totalImageCount,
  cellSizeMm,
  onDispatch,
  onReset,
  onExportPdf,
  onPrintDirect,
  onPrintWithOptions,
  actionStatusMessage,
}: InspectorProps) {
  const { settings } = project;
  const hasImages = totalImageCount > 0;
  const [isVerticalMarginsLinked, setIsVerticalMarginsLinked] = useState(true);
  const [isHorizontalMarginsLinked, setIsHorizontalMarginsLinked] = useState(true);
  const [isSpacingLinked, setIsSpacingLinked] = useState(true);

  function updateMargins(payload: {
    topMm?: number;
    bottomMm?: number;
    leftMm?: number;
    rightMm?: number;
  }) {
    onDispatch({ type: "settings/updateMargins", payload });
  }

  function updateSpacing(payload: { horizontalMm?: number; verticalMm?: number }) {
    onDispatch({ type: "settings/updateSpacing", payload });
  }

  function toggleVerticalMarginsLink() {
    setIsVerticalMarginsLinked((current) => {
      const next = !current;

      if (next) {
        updateMargins({
          topMm: settings.page.margins.topMm,
          bottomMm: settings.page.margins.topMm,
        });
      }

      return next;
    });
  }

  function toggleHorizontalMarginsLink() {
    setIsHorizontalMarginsLinked((current) => {
      const next = !current;

      if (next) {
        updateMargins({
          leftMm: settings.page.margins.leftMm,
          rightMm: settings.page.margins.leftMm,
        });
      }

      return next;
    });
  }

  function toggleSpacingLink() {
    setIsSpacingLinked((current) => {
      const next = !current;

      if (next) {
        updateSpacing({
          horizontalMm: settings.page.spacing.horizontalMm,
          verticalMm: settings.page.spacing.horizontalMm,
        });
      }

      return next;
    });
  }

  return (
    <div className="panel-stack">
      <section className="panel">
        <div className="panel__header">
          <p className="eyebrow">Layout</p>
          <h2>Page and grid</h2>
        </div>
        <div className="field-grid field-grid--two">
          <NumberField
            label="Rows"
            value={settings.grid.rows}
            min={1}
            max={12}
            onChange={(rows) => onDispatch({ type: "settings/updateGrid", payload: { rows } })}
          />
          <NumberField
            label="Columns"
            value={settings.grid.columns}
            min={1}
            max={12}
            onChange={(columns) =>
              onDispatch({ type: "settings/updateGrid", payload: { columns } })
            }
          />
        </div>
        <div className="field-grid field-grid--two">
          <label className="field">
            <span>Format</span>
            <select
              value={settings.page.format}
              onChange={(event) =>
                onDispatch({
                  type: "settings/updatePageFormat",
                  payload: {
                    format: event.target.value as
                      | "A6"
                      | "A5"
                      | "A4"
                      | "A3"
                      | "B5"
                      | "Letter"
                      | "Legal"
                      | "Executive"
                      | "Tabloid",
                  },
                })
              }
            >
              <option value="A6">A6</option>
              <option value="A5">A5</option>
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="B5">B5</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
              <option value="Executive">Executive</option>
              <option value="Tabloid">Tabloid</option>
            </select>
          </label>
          <label className="field">
            <span>Orientation</span>
            <select
              value={settings.page.orientation}
              onChange={(event) =>
                onDispatch({
                  type: "settings/updateOrientation",
                  payload: { orientation: event.target.value as "portrait" | "landscape" },
                })
              }
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </label>
        </div>
        <div className="field-grid field-grid--two">
          <label className="field">
            <span>Mode</span>
            <select
              value={settings.placementMode}
              onChange={(event) =>
                onDispatch({
                  type: "settings/updatePlacementMode",
                  payload: { placementMode: event.target.value as "fit" | "fill" },
                })
              }
            >
              <option value="fit">Fit</option>
              <option value="fill">Fill</option>
            </select>
          </label>
          <label className="field">
            <span>Centering</span>
            <button
              className={
                settings.centerImages
                  ? "toggle-button toggle-button--active"
                  : "toggle-button"
              }
              type="button"
              aria-pressed={settings.centerImages}
              onClick={() =>
                onDispatch({
                  type: "settings/updateCenterImages",
                  payload: { centerImages: !settings.centerImages },
                })
              }
            >
              <span className="toggle-button__track">
                <span className="toggle-button__thumb" />
              </span>
              <span>{settings.centerImages ? "On" : "Off"}</span>
            </button>
          </label>
        </div>
        <p className="notice">
          {totalImageCount === 0
            ? "No images loaded yet."
            : `${totalImageCount} image(s) across ${pageCount} page(s).`}
        </p>
        {cellSizeMm ? (
          <p className="notice notice--compact">
            Output cell size: {formatMmSize(cellSizeMm.widthMm, cellSizeMm.heightMm)}
          </p>
        ) : null}
      </section>

      <section className="panel">
        <div className="panel__header">
          <p className="eyebrow">Spacing</p>
          <h2>Margins and gaps</h2>
        </div>
        <div className="linked-field-row">
          <NumberFieldInline
            label="Top margin"
            value={settings.page.margins.topMm}
            min={0}
            max={80}
            step={0.5}
            onChange={(topMm) => {
              updateMargins(
                isVerticalMarginsLinked ? { topMm, bottomMm: topMm } : { topMm },
              );
            }}
          />
          <div className="field field--link-toggle">
            <LinkToggleButton
              linked={isVerticalMarginsLinked}
              label={
                isVerticalMarginsLinked
                  ? "Top and bottom margins are linked"
                  : "Top and bottom margins are independent"
              }
              onClick={toggleVerticalMarginsLink}
            />
          </div>
          <NumberFieldInline
            label="Bottom margin"
            value={settings.page.margins.bottomMm}
            min={0}
            max={80}
            step={0.5}
            disabled={isVerticalMarginsLinked}
            title={
              isVerticalMarginsLinked
                ? "Disable the link to edit this value separately."
                : undefined
            }
            onChange={(bottomMm) => {
              setIsVerticalMarginsLinked(false);
              updateMargins({ bottomMm });
            }}
          />
        </div>
        <div className="linked-field-row">
          <NumberFieldInline
            label="Left margin"
            value={settings.page.margins.leftMm}
            min={0}
            max={80}
            step={0.5}
            onChange={(leftMm) => {
              updateMargins(
                isHorizontalMarginsLinked ? { leftMm, rightMm: leftMm } : { leftMm },
              );
            }}
          />
          <div className="field field--link-toggle">
            <LinkToggleButton
              linked={isHorizontalMarginsLinked}
              label={
                isHorizontalMarginsLinked
                  ? "Left and right margins are linked"
                  : "Left and right margins are independent"
              }
              onClick={toggleHorizontalMarginsLink}
            />
          </div>
          <NumberFieldInline
            label="Right margin"
            value={settings.page.margins.rightMm}
            min={0}
            max={80}
            step={0.5}
            disabled={isHorizontalMarginsLinked}
            title={
              isHorizontalMarginsLinked
                ? "Disable the link to edit this value separately."
                : undefined
            }
            onChange={(rightMm) => {
              setIsHorizontalMarginsLinked(false);
              updateMargins({ rightMm });
            }}
          />
        </div>
        <div className="linked-field-row">
          <NumberFieldInline
            label="Horizontal gap"
            value={settings.page.spacing.horizontalMm}
            min={0}
            max={40}
            step={0.5}
            onChange={(horizontalMm) => {
              updateSpacing(
                isSpacingLinked
                  ? { horizontalMm, verticalMm: horizontalMm }
                  : { horizontalMm },
              );
            }}
          />
          <div className="field field--link-toggle">
            <LinkToggleButton
              linked={isSpacingLinked}
              label={
                isSpacingLinked
                  ? "Horizontal and vertical gaps are linked"
                  : "Horizontal and vertical gaps are independent"
              }
              onClick={toggleSpacingLink}
            />
          </div>
          <NumberFieldInline
            label="Vertical gap"
            value={settings.page.spacing.verticalMm}
            min={0}
            max={40}
            step={0.5}
            disabled={isSpacingLinked}
            title={
              isSpacingLinked
                ? "Disable the link to edit this value separately."
                : undefined
            }
            onChange={(verticalMm) => {
              setIsSpacingLinked(false);
              updateSpacing({ verticalMm });
            }}
          />
        </div>
      </section>

      <section className="panel">
        <div className="panel__header">
          <p className="eyebrow">Actions</p>
          <h2>Export, print and reset</h2>
        </div>
        <div className="action-stack">
          <button
            className="button"
            type="button"
            onClick={onExportPdf}
            disabled={!hasImages}
            title={!hasImages ? "Add at least one image to enable this action." : undefined}
          >
            Export PDF
          </button>
          <div className="print-action-row">
            <button
              className="button"
              type="button"
              onClick={onPrintDirect}
              disabled={!hasImages}
              title={!hasImages ? "Add at least one image to enable this action." : undefined}
            >
              Quick print
            </button>
            <PrintCopiesControl
              value={settings.printCopies}
              onChange={(printCopies) =>
                onDispatch({ type: "settings/updatePrintCopies", payload: { printCopies } })
              }
            />
          </div>
          <button
            className="button"
            type="button"
            onClick={onPrintWithOptions}
            disabled={!hasImages}
            title={!hasImages ? "Add at least one image to enable this action." : undefined}
          >
            Open print-ready PDF (Print with Options)
          </button>
          <button className="button" type="button" onClick={onReset}>
            Reset project
          </button>
        </div>
        {actionStatusMessage ? <p className="notice notice--action">{actionStatusMessage}</p> : null}
      </section>
    </div>
  );
}
