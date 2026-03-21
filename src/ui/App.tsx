import { useEffect, useRef, useState } from "react";

import { open } from "@tauri-apps/plugin-dialog";
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
  getCurrentAppVersion,
  getReleaseDownloadsPageUrl,
} from "@/utils/updates";
import { ImageSidebar, Sidebar } from "@/ui/components/Sidebar";
import { PreviewStage } from "@/ui/components/PreviewStage";

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

export function App() {
  const { project, layoutDocument, renderDocument, dispatch } = useProjectState();
  const [importStatusMessage, setImportStatusMessage] = useState<string | null>(null);
  const [actionStatusMessage, setActionStatusMessage] = useState<string | null>(null);
  const [previewPageIndex, setPreviewPageIndex] = useState(0);
  const [updateStatusMessage, setUpdateStatusMessage] = useState(
    `Version ${getCurrentAppVersion()} installiert. Update-Check läuft...`,
  );
  const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousImagesRef = useRef(project.images);

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
    setIsCheckingForUpdates(true);

    try {
      const result = await checkForLatestRelease();

      if (result.isUpdateAvailable) {
        setUpdateStatusMessage(
          `Neue Version ${result.latestVersion} verfügbar. Installiert ist ${result.currentVersion}.`,
        );
      } else {
        setUpdateStatusMessage(`Version ${result.currentVersion} ist aktuell.`);
      }
    } catch (error) {
      console.error("Update check failed", error);
      setUpdateStatusMessage(formatErrorMessage(error, "Update-Check fehlgeschlagen."));
    } finally {
      setIsCheckingForUpdates(false);
    }
  }

  useEffect(() => {
    void handleCheckForUpdates();
  }, []);

  async function handleAddFiles(files: FileList) {
    try {
      const images = await filesToImageItems(files);
      dispatch({ type: "images/add", payload: images });
      setImportStatusMessage(`${images.length} Bild(er) geladen.`);
    } catch (error) {
      console.error("Image import failed", error);
      setImportStatusMessage(formatErrorMessage(error, "Bilder konnten nicht geladen werden."));
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
        setImportStatusMessage(`${images.length} Bild(er) geladen.`);
      } catch (error) {
        console.error("Desktop image import failed", error);
        setImportStatusMessage(formatErrorMessage(error, "Bilder konnten nicht geladen werden."));
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
          `PDF mit ${renderDocument.pages.length} Seite(n) wurde exportiert.`,
        );
      }
    } catch (error) {
      console.error("PDF export failed", error);
      setActionStatusMessage(formatErrorMessage(error, "PDF konnte nicht exportiert werden."));
    }
  }

  async function handlePrint() {
    try {
      await printRenderDocument(renderDocument, project.settings.printCopies);
      setActionStatusMessage(
        `Druck mit ${project.settings.printCopies} Exemplar(en) wurde uebergeben.`,
      );
    } catch (error) {
      console.error("Print failed", error);
      setActionStatusMessage(formatErrorMessage(error, "Druck konnte nicht gestartet werden."));
    }
  }

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div>
          <h1>Easy Photo Print</h1>
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
            setActionStatusMessage("Projekt wurde zurückgesetzt.");
          }}
          onExportPdf={() => void handleExportPdf()}
          onPrint={() => void handlePrint()}
          importStatusMessage={importStatusMessage}
          actionStatusMessage={actionStatusMessage}
          updatePanel={{
            message: updateStatusMessage,
            buttonLabel: isCheckingForUpdates ? "Prüft..." : "Jetzt prüfen",
            isBusy: isCheckingForUpdates,
            onCheck: () => void handleCheckForUpdates(),
            onOpenReleasePage: () => void openExternalUrl(getReleaseDownloadsPageUrl()),
          }}
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
          visibleStartIndex={previewPageIndex * project.settings.grid.rows * project.settings.grid.columns}
          placedImageCount={layoutDocument.pages[previewPageIndex]?.placedImageCount ?? 0}
          onRemoveImage={(id) => dispatch({ type: "images/remove", payload: { id } })}
        />
      </aside>
    </div>
  );
}
