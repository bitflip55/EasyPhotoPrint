import type { Dispatch } from "react";

import { FilePicker } from "@/ui/components/FilePicker";
import { ImageList } from "@/ui/components/ImageList";
import { Inspector } from "@/ui/components/Inspector";
import type { ProjectDocument } from "@/domain/model/types";
import type { ProjectAction } from "@/state/actions";

interface SidebarProps {
  project: ProjectDocument;
  pageCount: number;
  onDispatch: Dispatch<ProjectAction>;
  onAddFiles: () => void;
  onReset: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  importStatusMessage: string | null;
  actionStatusMessage: string | null;
  updatePanel: {
    message: string;
    buttonLabel: string;
    isBusy: boolean;
    onCheck: () => void;
    onOpenReleasePage: () => void;
  };
}

export function Sidebar(props: SidebarProps) {
  const {
    project,
    pageCount,
    onDispatch,
    onAddFiles,
    onReset,
    onExportPdf,
    onPrint,
    importStatusMessage,
    actionStatusMessage,
    updatePanel,
  } = props;

  return (
    <div className="panel-stack">
      <section className="panel">
        <div className="panel__header">
          <p className="eyebrow">Bilder</p>
          <h2>Import</h2>
        </div>
        <div className="action-row">
          <FilePicker onRequestSelect={onAddFiles} />
        </div>
        {importStatusMessage ? <p className="notice notice--action">{importStatusMessage}</p> : null}
      </section>

      <Inspector
        project={project}
        pageCount={pageCount}
        totalImageCount={project.images.length}
        onDispatch={onDispatch}
        onReset={onReset}
        onExportPdf={onExportPdf}
        onPrint={onPrint}
        actionStatusMessage={actionStatusMessage}
      />

      <section className="panel panel--footer">
        <div className="panel__header">
          <p className="eyebrow">Updates</p>
          <h2>Versionen</h2>
        </div>
        <p className="notice">{updatePanel.message}</p>
        <div className="action-row">
          <button
            className="button button--ghost"
            type="button"
            onClick={updatePanel.onCheck}
            disabled={updatePanel.isBusy}
          >
            {updatePanel.buttonLabel}
          </button>
          <button className="button" type="button" onClick={updatePanel.onOpenReleasePage}>
            Releases öffnen
          </button>
        </div>
      </section>
    </div>
  );
}

interface ImageSidebarProps {
  project: ProjectDocument;
  visibleStartIndex: number;
  placedImageCount: number;
  onRemoveImage: (id: string) => void;
}

export function ImageSidebar({
  project,
  visibleStartIndex,
  placedImageCount,
  onRemoveImage,
}: ImageSidebarProps) {
  return (
    <section className="panel image-sidebar">
      <div className="panel__header">
        <p className="eyebrow">Bilder</p>
        <h2>Lokale Auswahl</h2>
      </div>
      <ImageList
        images={project.images}
        visibleStartIndex={visibleStartIndex}
        visibleCount={placedImageCount}
        onRemove={onRemoveImage}
      />
    </section>
  );
}
