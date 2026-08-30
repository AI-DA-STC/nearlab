import { useEffect, useRef, type ReactNode } from 'react';
import { cx, useReducedMotion } from '@/shared/lib';
import styles from './MediaPlaceholder.module.css';

interface MediaPlaceholderProps {
  /** Artwork under `public/`. Without it, the captioned box stands in. */
  src?: string;
  /** Accessible description of the artwork. */
  alt: string;
  /** First frame for a video `src`, shown while it buffers. */
  poster?: string;
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

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];

/** Teasers are supplied as clips as well as stills — an animated GIF upscales
 *  badly, so the same footage is carried as H.264 and rendered as a video. */
function isVideoSource(src: string): boolean {
  const path = src.split('?')[0]?.toLowerCase() ?? '';
  return VIDEO_EXTENSIONS.some((extension) => path.endsWith(extension));
}

/**
 * Stand-in for imagery the design has not been supplied yet, and the frame for
 * imagery that has. A `src` renders as an image, or as a muted looping video
 * when it points at a clip; with no `src` the captioned box stands in.
 */
export function MediaPlaceholder({
  src,
  alt,
  poster,
  caption,
  compact = false,
  zoom = false,
  overlay,
  className,
}: MediaPlaceholderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  // CSS cannot stop video playback, so hold the poster frame instead.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduced) video.pause();
    else void video.play().catch(() => undefined);
  }, [reduced, src]);

  const frameClass = cx(
    styles.media,
    compact && styles.compact,
    zoom && styles.zoom,
    'nl-zoom-target',
  );

  return (
    <div className={cx(styles.frame, className)}>
      {src ? (
        isVideoSource(src) ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className={cx(frameClass, styles.image)}
            aria-label={alt}
            autoPlay={!reduced}
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
          />
        ) : (
          <img src={src} alt={alt} className={cx(frameClass, styles.image)} />
        )
      ) : (
        <div role="img" aria-label={alt} className={frameClass}>
          {caption && <span className={styles.caption}>{caption}</span>}
        </div>
      )}
      {overlay && <div className={styles.overlaySlot}>{overlay}</div>}
    </div>
  );
}
