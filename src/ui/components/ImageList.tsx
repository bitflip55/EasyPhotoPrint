import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import type { ImageItem } from "@/domain/model/types";

interface ImageListProps {
  images: ImageItem[];
  visibleStartIndex: number;
  visibleCount: number;
  onRemove: (id: string) => void;
  onMove: (sourceId: string, targetId: string) => void;
}

export function ImageList({
  images,
  visibleStartIndex,
  visibleCount,
  onRemove,
  onMove,
}: ImageListProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [pointerPosition, setPointerPosition] = useState<{ x: number; y: number } | null>(null);
  const dragSourceIdRef = useRef<string | null>(null);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const sourceId = dragSourceIdRef.current;

      if (!sourceId) {
        return;
      }

      setPointerPosition({ x: event.clientX, y: event.clientY });

      const element = document.elementFromPoint(event.clientX, event.clientY);
      const itemElement = element?.closest<HTMLElement>("[data-image-id]");
      const targetId = itemElement?.dataset.imageId ?? null;

      if (targetId && targetId !== sourceId) {
        setDropTargetId(targetId);
      } else {
        setDropTargetId(null);
      }
    }

    function handlePointerUp() {
      const sourceId = dragSourceIdRef.current;
      const targetId = dropTargetId;

      if (sourceId && targetId && sourceId !== targetId) {
        onMove(sourceId, targetId);
      }

      dragSourceIdRef.current = null;
      setDraggedId(null);
      setDropTargetId(null);
      setPointerPosition(null);
      document.body.classList.remove("is-reordering-images");
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.classList.remove("is-reordering-images");
    };
  }, [dropTargetId, onMove]);

  if (images.length === 0) {
    return <p className="empty-state">No images loaded yet.</p>;
  }

  const displayedImages =
    draggedId && dropTargetId && draggedId !== dropTargetId
      ? (() => {
          const previewImages = [...images];
          const sourceIndex = previewImages.findIndex((image) => image.id === draggedId);
          const targetIndex = previewImages.findIndex((image) => image.id === dropTargetId);

          if (sourceIndex === -1 || targetIndex === -1) {
            return images;
          }

          const [movedImage] = previewImages.splice(sourceIndex, 1);

          if (!movedImage) {
            return images;
          }

          const insertionIndex =
            sourceIndex < targetIndex ? Math.max(0, targetIndex - 1) : targetIndex;

          previewImages.splice(insertionIndex, 0, movedImage);
          return previewImages;
        })()
      : images;

  function handlePointerDown(
    event: ReactPointerEvent<HTMLButtonElement>,
    imageId: string,
  ) {
    event.preventDefault();
    event.stopPropagation();
    dragSourceIdRef.current = imageId;
    setDraggedId(imageId);
    setDropTargetId(null);
    setPointerPosition({ x: event.clientX, y: event.clientY });
    document.body.classList.add("is-reordering-images");
  }

  const draggedImage = draggedId
    ? images.find((image) => image.id === draggedId) ?? null
    : null;

  return (
    <div className="image-list">
      {displayedImages.map((image, index) => {
        const isVisibleOnCurrentPage =
          index >= visibleStartIndex && index < visibleStartIndex + visibleCount;
        const cellNumber = index - visibleStartIndex + 1;
        const isDragging = draggedId === image.id;
        const isDropTarget = dropTargetId === image.id;

        return (
          <article
            className={`image-list__item ${isDragging ? "is-dragging" : ""} ${isDropTarget ? "is-drop-target" : ""}`}
            key={image.id}
            data-image-id={image.id}
          >
            <button
              aria-label={`Reorder ${image.name}`}
              className="image-list__drag-handle"
              type="button"
              onPointerDown={(event) => handlePointerDown(event, image.id)}
            >
              ::
            </button>
            <img alt={image.name} className="image-list__thumb" src={image.thumbnailUrl} />
            <div className="image-list__meta">
              <span className="image-list__order">#{index + 1}</span>
              <strong title={image.name}>{image.name}</strong>
              <span>
                {image.dimensions.widthPx} x {image.dimensions.heightPx} px
              </span>
              <span
                className={
                  isVisibleOnCurrentPage
                    ? "image-list__status"
                    : "image-list__status is-overflow"
                }
              >
                {isVisibleOnCurrentPage ? `Cell ${cellNumber}` : "Not on this page"}
              </span>
            </div>
            <button
              className="button button--ghost"
              type="button"
              onClick={() => onRemove(image.id)}
            >
              Remove
            </button>
          </article>
        );
      })}
      {draggedImage && pointerPosition ? (
        <div
          className="image-list__drag-preview"
          style={{
            left: pointerPosition.x + 18,
            top: pointerPosition.y + 18,
          }}
        >
          <img
            alt={draggedImage.name}
            className="image-list__drag-preview-thumb"
            src={draggedImage.thumbnailUrl}
          />
          <div className="image-list__drag-preview-meta">
            <strong title={draggedImage.name}>{draggedImage.name}</strong>
            <span>
              {draggedImage.dimensions.widthPx} x {draggedImage.dimensions.heightPx} px
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
