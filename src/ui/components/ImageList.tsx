import { useState, type DragEvent } from "react";

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

  if (images.length === 0) {
    return <p className="empty-state">No images loaded yet.</p>;
  }

  function handleDragStart(event: DragEvent<HTMLElement>, imageId: string) {
    setDraggedId(imageId);
    setDropTargetId(imageId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", imageId);
  }

  function handleDragOver(event: DragEvent<HTMLElement>, imageId: string) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    if (draggedId && draggedId !== imageId) {
      setDropTargetId(imageId);
    }
  }

  function resetDragState() {
    setDraggedId(null);
    setDropTargetId(null);
  }

  function handleDrop(event: DragEvent<HTMLElement>, targetId: string) {
    event.preventDefault();

    if (draggedId && draggedId !== targetId) {
      onMove(draggedId, targetId);
    }

    resetDragState();
  }

  return (
    <div className="image-list">
      {images.map((image, index) => {
        const isVisibleOnCurrentPage =
          index >= visibleStartIndex && index < visibleStartIndex + visibleCount;
        const cellNumber = index - visibleStartIndex + 1;
        const isDragging = draggedId === image.id;
        const isDropTarget = dropTargetId === image.id && draggedId !== image.id;

        return (
          <article
            className={`image-list__item ${isDragging ? "is-dragging" : ""} ${isDropTarget ? "is-drop-target" : ""}`}
            key={image.id}
            draggable
            onDragStart={(event) => handleDragStart(event, image.id)}
            onDragOver={(event) => handleDragOver(event, image.id)}
            onDrop={(event) => handleDrop(event, image.id)}
            onDragEnd={resetDragState}
          >
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
    </div>
  );
}
