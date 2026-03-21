import type { ImageItem } from "@/domain/model/types";

interface ImageListProps {
  images: ImageItem[];
  visibleStartIndex: number;
  visibleCount: number;
  onRemove: (id: string) => void;
}

export function ImageList({
  images,
  visibleStartIndex,
  visibleCount,
  onRemove,
}: ImageListProps) {
  if (images.length === 0) {
    return <p className="empty-state">Noch keine Bilder geladen.</p>;
  }

  return (
    <div className="image-list">
      {images.map((image, index) => {
        const isVisibleOnCurrentPage =
          index >= visibleStartIndex && index < visibleStartIndex + visibleCount;
        const cellNumber = index - visibleStartIndex + 1;

        return (
          <article className="image-list__item" key={image.id}>
            <img alt={image.name} className="image-list__thumb" src={image.thumbnailUrl} />
            <div className="image-list__meta">
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
                {isVisibleOnCurrentPage ? `Zelle ${cellNumber}` : "Nicht auf dieser Seite"}
              </span>
            </div>
            <button
              className="button button--ghost"
              type="button"
              onClick={() => onRemove(image.id)}
            >
              Entfernen
            </button>
          </article>
        );
      })}
    </div>
  );
}
