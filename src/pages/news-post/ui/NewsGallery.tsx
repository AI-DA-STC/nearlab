import { useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import type { NewsImage } from '@/entities/news-item';
import styles from './NewsGallery.module.css';

/** The most photos set side by side before the gallery starts a new row. */
const MAX_PER_ROW = 3;

interface Placed {
  readonly image: NewsImage;
  /** Position in the whole gallery, which the viewer steps through. */
  readonly index: number;
}

/** Rows of at most `MAX_PER_ROW`, as even as the count allows: seven photos
 *  become 3 + 2 + 2 rather than 3 + 3 + 1. */
function toRows(images: readonly NewsImage[]): Placed[][] {
  const placed = images.map((image, index) => ({ image, index }));
  const rowCount = Math.ceil(placed.length / MAX_PER_ROW);
  const rows: Placed[][] = [];
  let start = 0;
  for (let row = 0; row < rowCount; row += 1) {
    const size = Math.ceil((placed.length - start) / (rowCount - row));
    rows.push(placed.slice(start, start + size));
    start += size;
  }
  return rows;
}

function aspectRatio(image: NewsImage): number {
  return image.width / image.height;
}

/**
 * A news item's photos. Within a row each photo's width follows its aspect
 * ratio, so a portrait and a landscape shot share one height with neither
 * cropped. Selecting a photo opens it full size in a modal viewer, which steps
 * through the rest with the arrow keys and closes on Escape.
 */
export function NewsGallery({ images }: { images: readonly NewsImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const [current, setCurrent] = useState(0);
  const shown = images[current];
  const several = images.length > 1;

  const open = (index: number, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    // Swap the photo in before the dialog shows, so the last one viewed never
    // flashes up first.
    flushSync(() => setCurrent(index));
    dialogRef.current?.showModal();
    closeRef.current?.focus();
  };

  const close = () => dialogRef.current?.close();

  const step = (delta: number) =>
    setCurrent((index) => (index + delta + images.length) % images.length);

  // Clicks on the dimmed space around the photo close the viewer; clicks on
  // the photo itself or on the controls do not.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget || event.target === stageRef.current) close();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (!several) return;
    if (event.key === 'ArrowRight') step(1);
    else if (event.key === 'ArrowLeft') step(-1);
  };

  return (
    <>
      <div className={styles.gallery}>
        {toRows(images).map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={styles.row}
            style={
              {
                '--row-ratio': row.reduce((sum, { image }) => sum + aspectRatio(image), 0),
                '--row-count': row.length,
              } as CSSProperties
            }
          >
            {row.map(({ image, index }) => (
              <button
                key={image.src}
                type="button"
                aria-haspopup="dialog"
                className={styles.tile}
                style={{ '--ratio': aspectRatio(image) } as CSSProperties}
                onClick={(event) => open(index, event.currentTarget)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                  className={styles.photo}
                />
              </button>
            ))}
          </div>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        className={styles.viewer}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onClose={() => openerRef.current?.focus()}
      >
        <div ref={stageRef} className={styles.stage}>
          {shown && <img src={shown.src} alt={shown.alt} className={styles.full} />}
        </div>
        <div className={styles.controls}>
          {several && (
            <>
              <span className={styles.count}>
                {current + 1} / {images.length}
              </span>
              <button type="button" className={styles.control} onClick={() => step(-1)}>
                ← Previous
              </button>
              <button type="button" className={styles.control} onClick={() => step(1)}>
                Next →
              </button>
            </>
          )}
          <button ref={closeRef} type="button" className={styles.control} onClick={close}>
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}
