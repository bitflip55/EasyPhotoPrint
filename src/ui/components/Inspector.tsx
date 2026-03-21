import type { Dispatch } from "react";

import type { ProjectDocument } from "@/domain/model/types";
import type { ProjectAction } from "@/state/actions";
import { clamp } from "@/utils/clamp";

interface InspectorProps {
  project: ProjectDocument;
  pageCount: number;
  totalImageCount: number;
  onDispatch: Dispatch<ProjectAction>;
  onReset: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  actionStatusMessage: string | null;
}

interface NumberFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
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

export function Inspector({
  project,
  pageCount,
  totalImageCount,
  onDispatch,
  onReset,
  onExportPdf,
  onPrint,
  actionStatusMessage,
}: InspectorProps) {
  const { settings } = project;

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
      </section>

      <section className="panel">
        <div className="panel__header">
          <p className="eyebrow">Spacing</p>
          <h2>Margins and gaps</h2>
        </div>
        <div className="field-grid field-grid--two">
          <NumberField
            label="Top margin"
            value={settings.page.margins.topMm}
            min={0}
            max={80}
            step={0.5}
            onChange={(topMm) =>
              onDispatch({ type: "settings/updateMargins", payload: { topMm } })
            }
          />
          <NumberField
            label="Bottom margin"
            value={settings.page.margins.bottomMm}
            min={0}
            max={80}
            step={0.5}
            onChange={(bottomMm) =>
              onDispatch({ type: "settings/updateMargins", payload: { bottomMm } })
            }
          />
          <NumberField
            label="Left margin"
            value={settings.page.margins.leftMm}
            min={0}
            max={80}
            step={0.5}
            onChange={(leftMm) =>
              onDispatch({ type: "settings/updateMargins", payload: { leftMm } })
            }
          />
          <NumberField
            label="Right margin"
            value={settings.page.margins.rightMm}
            min={0}
            max={80}
            step={0.5}
            onChange={(rightMm) =>
              onDispatch({ type: "settings/updateMargins", payload: { rightMm } })
            }
          />
          <NumberField
            label="Horizontal gap"
            value={settings.page.spacing.horizontalMm}
            min={0}
            max={40}
            step={0.5}
            onChange={(horizontalMm) =>
              onDispatch({ type: "settings/updateSpacing", payload: { horizontalMm } })
            }
          />
          <NumberField
            label="Vertical gap"
            value={settings.page.spacing.verticalMm}
            min={0}
            max={40}
            step={0.5}
            onChange={(verticalMm) =>
              onDispatch({ type: "settings/updateSpacing", payload: { verticalMm } })
            }
          />
        </div>
      </section>

      <section className="panel">
        <div className="panel__header">
          <p className="eyebrow">Image mode</p>
          <h2>Placement</h2>
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
      </section>

      <section className="panel">
        <div className="panel__header">
          <p className="eyebrow">Actions</p>
          <h2>Export and reset</h2>
        </div>
        <div className="action-stack">
          <button className="button" type="button" onClick={onExportPdf}>
            Export PDF
          </button>
          <div className="print-action-row">
            <button className="button" type="button" onClick={onPrint}>
              Print
            </button>
            <PrintCopiesControl
              value={settings.printCopies}
              onChange={(printCopies) =>
                onDispatch({ type: "settings/updatePrintCopies", payload: { printCopies } })
              }
            />
          </div>
          <button className="button button--ghost" type="button" onClick={onReset}>
            Reset project
          </button>
        </div>
        {actionStatusMessage ? <p className="notice notice--action">{actionStatusMessage}</p> : null}
      </section>
    </div>
  );
}
