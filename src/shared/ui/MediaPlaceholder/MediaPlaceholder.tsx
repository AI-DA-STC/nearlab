import type { ReactNode } from 'react';
import { cx } from '@/shared/lib';
import styles from './MediaPlaceholder.module.css';

interface MediaPlaceholderProps {
  /** Accessible description of the artwork that will replace this box. */
  alt: string;
  /** Visible mono caption naming the figure, e.g. "figure 4 — handover trial". */
  caption?: string;
  /** Card variant: tighter padding, bottom border only. */
  compact?: boolean;
  /** Zooms on hover of an ancestor carrying the `zoomOnHover` class. */
  zoom?: boolean;
  /** Rendered over the top-left corner, e.g. a theme badge. */
  overlay?: ReactNode;
  className?: string;
}

/**
 * Stand-in for imagery the design has not been supplied yet. Swap the inner
 * `div` for an `<img>`/`<video>` once real assets land — the surrounding
 * layout does not need to change.
 */
export function MediaPlaceholder({
  alt,
  caption,
  compact = false,
  zoom = false,
  overlay,
  className,
}: MediaPlaceholderProps) {
  return (
    <div className={cx(styles.frame, className)}>
      <div
        role="img"
        aria-label={alt}
        className={cx(styles.media, compact && styles.compact, zoom && styles.zoom, 'nl-zoom-target')}
      >
        {caption && <span className={styles.caption}>{caption}</span>}
      </div>
      {overlay && <div className={styles.overlaySlot}>{overlay}</div>}
    </div>
  );
}
