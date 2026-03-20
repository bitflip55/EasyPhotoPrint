import { defaultProjectSettings } from "@/state/defaults";

export function Sidebar() {
  const { page, grid, placementMode, centerImages } = defaultProjectSettings;

  return (
    <div className="panel-stack">
      <section className="panel">
        <div className="panel__header">
          <p className="eyebrow">Project</p>
          <h1>Easy Photo Print</h1>
        </div>
        <p className="panel__text">
          Linux desktop app for placing local photos on a single A4 page with one
          shared layout engine for preview, PDF and printing.
        </p>
      </section>

      <section className="panel">
        <div className="panel__header">
          <p className="eyebrow">Milestone M1</p>
          <h2>Shell Layout</h2>
        </div>

        <dl className="spec-list">
          <div>
            <dt>Page</dt>
            <dd>
              {page.widthMm} x {page.heightMm} mm
            </dd>
          </div>
          <div>
            <dt>Orientation</dt>
            <dd>{page.orientation}</dd>
          </div>
          <div>
            <dt>Grid</dt>
            <dd>
              {grid.rows} rows x {grid.columns} columns
            </dd>
          </div>
          <div>
            <dt>Mode</dt>
            <dd>{placementMode}</dd>
          </div>
          <div>
            <dt>Centering</dt>
            <dd>{centerImages ? "enabled" : "disabled"}</dd>
          </div>
        </dl>
      </section>

      <section className="panel">
        <div className="panel__header">
          <p className="eyebrow">Architecture</p>
          <h2>Planned Layers</h2>
        </div>
        <ul className="roadmap">
          <li>Domain layout engine in millimeters</li>
          <li>Neutral render model for preview, PDF and print</li>
          <li>Dedicated renderers without duplicated geometry rules</li>
          <li>Tauri shell for file dialogs, export and print actions</li>
        </ul>
      </section>
    </div>
  );
}
