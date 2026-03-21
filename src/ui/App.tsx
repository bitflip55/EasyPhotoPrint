import { useEffect, useRef, useState, type DragEvent } from "react";

import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { getCurrentWindow } from "@tauri-apps/api/window";
import packageJson from "../../package.json";

import { createDefaultProjectDocument } from "@/state/defaults";
import { renderPdfDocumentFromPages } from "@/render/pdf/renderPdfDocument";
import { useProjectState } from "@/state/useProjectState";
import { openExternalUrl } from "@/utils/external";
import { savePdfBytes } from "@/utils/files";
import { filesToImageItems, pathsToImageItems } from "@/utils/images";
import { isDesktopApp } from "@/utils/platform";
import { printRenderDocument } from "@/utils/print";
import {
  checkForLatestRelease,
  getReleaseDownloadsPageUrl,
} from "@/utils/updates";
import { ImageSidebar, Sidebar } from "@/ui/components/Sidebar";
import { PreviewStage } from "@/ui/components/PreviewStage";

interface UpdatePanelState {
  isUpdateAvailable: boolean;
  latestVersion: string | null;
  releasePageUrl: string;
}

function formatErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return `${fallback} ${error.message}`;
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return `${fallback} ${error}`;
  }

  return fallback;
}

function createTimestampedPdfFilename(): string {
  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    "-",
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");

  return `easy-photo-print-${timestamp}.pdf`;
}

function hasDraggedFiles(event: DragEvent<HTMLDivElement>): boolean {
  return Array.from(event.dataTransfer.types).includes("Files");
}

export function App() {
  const { project, layoutDocument, renderDocument, dispatch } = useProjectState();
  const [importStatusMessage, setImportStatusMessage] = useState<string | null>(null);
  const [actionStatusMessage, setActionStatusMessage] = useState<string | null>(null);
  const [previewPageIndex, setPreviewPageIndex] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [updatePanelState, setUpdatePanelState] = useState<UpdatePanelState>({
    isUpdateAvailable: false,
    latestVersion: null,
    releasePageUrl: getReleaseDownloadsPageUrl(),
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousImagesRef = useRef(project.images);
  const startupImagesLoadedRef = useRef(false);
  const dragDepthRef = useRef(0);

  useEffect(() => {
    setPreviewPageIndex((currentPageIndex) =>
      Math.min(currentPageIndex, Math.max(0, layoutDocument.pageCount - 1)),
    );
  }, [layoutDocument.pageCount]);

  useEffect(() => {
    const previousImages = previousImagesRef.current;
    const currentImageIds = new Set(project.images.map((image) => image.id));

    for (const image of previousImages) {
      if (!currentImageIds.has(image.id) && image.thumbnailUrlKind === "object-url") {
        URL.revokeObjectURL(image.thumbnailUrl);
      }
    }

    previousImagesRef.current = project.images;
  }, [project.images]);

  useEffect(() => {
    return () => {
      for (const image of previousImagesRef.current) {
        if (image.thumbnailUrlKind === "object-url") {
          URL.revokeObjectURL(image.thumbnailUrl);
        }
      }
    };
  }, []);

  async function handleCheckForUpdates() {
    try {
      const result = await checkForLatestRelease();

      if (result.isUpdateAvailable) {
        setUpdatePanelState({
          isUpdateAvailable: true,
          latestVersion: result.latestVersion,
          releasePageUrl: result.releasePageUrl,
        });
      } else {
        setUpdatePanelState({
          isUpdateAvailable: false,
          latestVersion: null,
          releasePageUrl: getReleaseDownloadsPageUrl(),
        });
      }
    } catch (error) {
      console.error("Update check failed", error);
      setUpdatePanelState({
        isUpdateAvailable: false,
        latestVersion: null,
        releasePageUrl: getReleaseDownloadsPageUrl(),
      });
    }
  }

  useEffect(() => {
    void handleCheckForUpdates();
  }, []);

  useEffect(() => {
    if (!isDesktopApp() || startupImagesLoadedRef.current) {
      return;
    }

    startupImagesLoadedRef.current = true;

    void (async () => {
      try {
        const startupPaths = await invoke<string[]>("get_startup_image_paths");

        if (startupPaths.length === 0) {
          return;
        }

        const images = await pathsToImageItems(startupPaths);
        dispatch({ type: "images/add", payload: images });
        setImportStatusMessage(`${images.length} image(s) loaded from startup files.`);
      } catch (error) {
        console.error("Startup image import failed", error);
        setImportStatusMessage(
          formatErrorMessage(error, "Startup images could not be loaded."),
        );
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    if (!isDesktopApp()) {
      return;
    }

    let unlisten: (() => void) | undefined;

    void (async () => {
      unlisten = await getCurrentWindow().onDragDropEvent(async (event) => {
        if (event.payload.type === "enter" || event.payload.type === "over") {
          setIsDragActive(true);
          return;
        }

        if (event.payload.type === "leave") {
          dragDepthRef.current = 0;
          setIsDragActive(false);
          return;
        }

        if (event.payload.type === "drop") {
          dragDepthRef.current = 0;
          setIsDragActive(false);

          try {
            const images = await pathsToImageItems(event.payload.paths);
            dispatch({ type: "images/add", payload: images });
            setImportStatusMessage(`${images.length} image(s) loaded.`);
          } catch (error) {
            console.error("Desktop drag and drop import failed", error);
            setImportStatusMessage(
              formatErrorMessage(error, "Dropped images could not be loaded."),
            );
          }
        }
      });
    })();

    return () => {
      unlisten?.();
    };
  }, [dispatch]);

  async function handleAddFiles(files: FileList | File[]) {
    try {
      const images = await filesToImageItems(files);
      dispatch({ type: "images/add", payload: images });
      setImportStatusMessage(`${images.length} image(s) loaded.`);
    } catch (error) {
      console.error("Image import failed", error);
      setImportStatusMessage(formatErrorMessage(error, "Images could not be loaded."));
    }
  }

  async function handleDroppedFiles(files: FileList) {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      setImportStatusMessage("No supported image files were dropped.");
      return;
    }

    await handleAddFiles(imageFiles);
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    if (!hasDraggedFiles(event)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current += 1;
    setIsDragActive(true);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    if (!hasDraggedFiles(event)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    if (!hasDraggedFiles(event)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

    if (dragDepthRef.current === 0) {
      setIsDragActive(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    if (!hasDraggedFiles(event)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = 0;
    setIsDragActive(false);

    if (event.dataTransfer.files.length > 0) {
      void handleDroppedFiles(event.dataTransfer.files);
    }
  }

  async function handleAddImages() {
    if (isDesktopApp()) {
      try {
        const selected = await open({
          multiple: true,
          directory: false,
          filters: [
            {
              name: "Images",
              extensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"],
            },
          ],
        });

        if (!selected) {
          return;
        }

        const selectedPaths = Array.isArray(selected) ? selected : [selected];
        const images = await pathsToImageItems(selectedPaths);
        dispatch({ type: "images/add", payload: images });
        setImportStatusMessage(`${images.length} image(s) loaded.`);
      } catch (error) {
        console.error("Desktop image import failed", error);
        setImportStatusMessage(formatErrorMessage(error, "Images could not be loaded."));
      }

      return;
    }

    fileInputRef.current?.click();
  }

  async function handleExportPdf() {
    try {
      const pdfBytes = await renderPdfDocumentFromPages(renderDocument);
      const exportResult = await savePdfBytes(createTimestampedPdfFilename(), pdfBytes);

      if (exportResult === "saved") {
        setActionStatusMessage(
          `PDF with ${renderDocument.pages.length} page(s) was exported.`,
        );
      }
    } catch (error) {
      console.error("PDF export failed", error);
      setActionStatusMessage(formatErrorMessage(error, "PDF could not be exported."));
    }
  }

  async function handlePrint() {
    try {
      await printRenderDocument(renderDocument, project.settings.printCopies);
      setActionStatusMessage(
        `Print job with ${project.settings.printCopies} cop${project.settings.printCopies === 1 ? "y" : "ies"} was submitted.`,
      );
    } catch (error) {
      console.error("Print failed", error);
      setActionStatusMessage(formatErrorMessage(error, "Printing could not be started."));
    }
  }

  return (
    <div
      className={`app-shell ${isDragActive ? "app-shell--drag-active" : ""}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header className="app-shell__header">
        <div>
          <h1>EasyPhotoPrint</h1>
          <p className="app-shell__meta">
            v{packageJson.version} by{" "}
            <button
              className="link-button"
              type="button"
              onClick={() => void openExternalUrl("https://github.com/bitflip55/EasyPhotoPrint")}
            >
              bitflip55
            </button>
          </p>
          {updatePanelState.isUpdateAvailable && updatePanelState.latestVersion ? (
            <button
              className="app-shell__update-link"
              type="button"
              onClick={() => void openExternalUrl(updatePanelState.releasePageUrl)}
            >
              New version available v{updatePanelState.latestVersion}
            </button>
          ) : null}
        </div>
      </header>
      <input
        ref={fileInputRef}
        className="sr-only"
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => {
          if (event.target.files) {
            void handleAddFiles(event.target.files);
            event.target.value = "";
          }
        }}
      />
      <aside className="app-shell__sidebar">
        <Sidebar
          project={project}
          pageCount={layoutDocument.pageCount}
          onDispatch={dispatch}
          onAddFiles={handleAddImages}
          onReset={() => {
            dispatch({
              type: "project/reset",
              payload: createDefaultProjectDocument(),
            });
            setImportStatusMessage(null);
            setActionStatusMessage("Project was reset.");
          }}
          onExportPdf={() => void handleExportPdf()}
          onPrint={() => void handlePrint()}
          importStatusMessage={importStatusMessage}
          actionStatusMessage={actionStatusMessage}
        />
      </aside>
      <main className="app-shell__main">
        <PreviewStage
          layoutPage={layoutDocument.pages[previewPageIndex]!}
          renderPage={renderDocument.pages[previewPageIndex]!}
          canGoToPreviousPage={previewPageIndex > 0}
          canGoToNextPage={previewPageIndex < layoutDocument.pageCount - 1}
          onPreviousPage={() => setPreviewPageIndex((pageIndex) => Math.max(0, pageIndex - 1))}
          onNextPage={() =>
            setPreviewPageIndex((pageIndex) =>
              Math.min(layoutDocument.pageCount - 1, pageIndex + 1),
            )
          }
        />
      </main>
      <aside className="app-shell__images">
        <ImageSidebar
          project={project}
          visibleStartIndex={
            previewPageIndex * project.settings.grid.rows * project.settings.grid.columns
          }
          placedImageCount={layoutDocument.pages[previewPageIndex]?.placedImageCount ?? 0}
          onRemoveImage={(id) => dispatch({ type: "images/remove", payload: { id } })}
          onMoveImage={(sourceId, targetId) =>
            dispatch({ type: "images/move", payload: { sourceId, targetId } })
          }
        />
      </aside>
      {isDragActive ? (
        <div className="drop-overlay" aria-hidden="true">
          <div className="drop-overlay__card">
            <strong>Drop images to import</strong>
            <span>PNG, JPEG, WebP, GIF and BMP are supported</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
