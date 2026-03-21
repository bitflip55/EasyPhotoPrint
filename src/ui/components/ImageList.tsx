import { useMemo, useState } from "react";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type Modifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { ImageItem } from "@/domain/model/types";

const dragOverlayOffset: Modifier = ({ transform }) => ({
  ...transform,
  x: transform.x - 18,
  y: transform.y - 28,
});

interface ImageListProps {
  images: ImageItem[];
  visibleStartIndex: number;
  visibleCount: number;
  onRemove: (id: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

interface ImageListItemProps {
  image: ImageItem;
  index: number;
  visibleStartIndex: number;
  visibleCount: number;
  onRemove: (id: string) => void;
}

function ImageListCard({
  image,
  index,
  visibleStartIndex,
  visibleCount,
  onRemove,
  dragHandleProps,
  isDragging = false,
}: ImageListItemProps & {
  dragHandleProps?: Record<string, unknown>;
  isDragging?: boolean;
}) {
  const isVisibleOnCurrentPage =
    index >= visibleStartIndex && index < visibleStartIndex + visibleCount;
  const cellNumber = index - visibleStartIndex + 1;

  return (
    <article className={`image-list__item ${isDragging ? "is-dragging" : ""}`}>
      <button
        aria-label={`Reorder ${image.name}`}
        className="image-list__drag-handle"
        type="button"
        {...dragHandleProps}
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
}

function SortableImageListItem(props: ImageListItemProps) {
  const { image } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className={`image-list__sortable ${isDragging ? "is-sortable-dragging" : ""}`}
      style={style}
    >
      <ImageListCard
        {...props}
        isDragging={isDragging}
        dragHandleProps={{
          ...attributes,
          ...listeners,
          ref: setActivatorNodeRef,
        }}
      />
    </div>
  );
}

export function ImageList({
  images,
  visibleStartIndex,
  visibleCount,
  onRemove,
  onMove,
}: ImageListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const activeImage = useMemo(
    () => images.find((image) => image.id === activeId) ?? null,
    [activeId, images],
  );

  if (images.length === 0) {
    return <p className="empty-state">No images loaded yet.</p>;
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const fromIndex = images.findIndex((image) => image.id === String(active.id));
    const toIndex = images.findIndex((image) => image.id === String(over.id));

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
      return;
    }

    onMove(fromIndex, toIndex);
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext
        items={images.map((image) => image.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="image-list">
          {images.map((image, index) => (
            <SortableImageListItem
              key={image.id}
              image={image}
              index={index}
              visibleStartIndex={visibleStartIndex}
              visibleCount={visibleCount}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay modifiers={[dragOverlayOffset]}>
        {activeImage ? (
          <div className="image-list__drag-overlay">
            <ImageListCard
              image={activeImage}
              index={images.findIndex((image) => image.id === activeImage.id)}
              visibleStartIndex={visibleStartIndex}
              visibleCount={visibleCount}
              onRemove={onRemove}
              isDragging
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
