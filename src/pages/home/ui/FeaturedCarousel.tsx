import { useEffect, useState } from 'react';
import { ArrowGlyph, ChipRow, Eyebrow, MediaPlaceholder, PageSection } from '@/shared/ui';
import { cx } from '@/shared/lib';
import { FEATURED } from '../model/featured';
import styles from './FeaturedCarousel.module.css';

const ADVANCE_MS = 3000;

/** Auto-advancing spotlight, paused while the pointer is over it and while a
 *  slide's video is playing. */
export function FeaturedCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  /** The slide whose full video is playing, if any. */
  const [playing, setPlaying] = useState<number | null>(null);

  useEffect(() => {
    // Nothing to rotate through with a single spotlight.
    if (paused || playing !== null || FEATURED.length <= 1) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % FEATURED.length),
      ADVANCE_MS,
    );
    return () => window.clearInterval(timer);
  }, [paused, playing]);

  // Moving to another slide stops the video, so its sound never plays unseen.
  const show = (next: number) => {
    setPlaying(null);
    setIndex((next + FEATURED.length) % FEATURED.length);
  };

  return (
    <PageSection
      tight
      aria-label="Featured work"
      // Pausing on hover lets people finish reading a slide.
      {...{
        onMouseEnter: () => setPaused(true),
        onMouseLeave: () => setPaused(false),
      }}
    >
      <div className={styles.viewport}>
        <div className={styles.track} style={{ transform: `translateX(-${index * 100}%)` }}>
          {FEATURED.map((item, slideIndex) => (
            <div key={item.title} className={styles.slide} aria-hidden={slideIndex !== index}>
              <div className={styles.split}>
                <div className={styles.mediaCell}>
                  {item.play && playing === slideIndex ? (
                    <video
                      src={item.play.src}
                      poster={item.poster}
                      className={styles.player}
                      aria-label={item.mediaAlt}
                      controls
                      autoPlay
                      playsInline
                      onEnded={() => setPlaying(null)}
                    />
                  ) : (
                    <>
                      <MediaPlaceholder
                        src={item.image}
                        poster={item.poster}
                        alt={item.mediaAlt}
                        caption={item.mediaCaption}
                      />
                      {item.play && (
                        <button
                          type="button"
                          className={styles.playOverlay}
                          onClick={() => setPlaying(slideIndex)}
                          aria-label={item.play.label}
                          tabIndex={slideIndex === index ? 0 : -1}
                        >
                          <span className={styles.playDisc}>
                            <ArrowGlyph width={30} height={22} />
                          </span>
                        </button>
                      )}
                    </>
                  )}
                </div>
                <div>
                  <Eyebrow accent>{item.eyebrow}</Eyebrow>
                  <h3 className={styles.title}>{item.title}</h3>
                  {item.authors && <p className={styles.authors}>{item.authors}</p>}
                  <p className={styles.summary}>{item.summary}</p>
                  {item.play && (
                    <button
                      type="button"
                      className={styles.watch}
                      onClick={() => setPlaying(slideIndex)}
                      tabIndex={slideIndex === index ? 0 : -1}
                    >
                      <ArrowGlyph width={12} height={9} />
                      {item.play.label}
                    </button>
                  )}
                  <ChipRow items={item.resources} className={styles.resources} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.controls} hidden={FEATURED.length <= 1}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => show(index - 1)}
          aria-label="Previous featured item"
        >
          <ArrowGlyph width={14} height={10} className={styles.flip} />
        </button>
        <div className={styles.tabs}>
          {FEATURED.map((item, slideIndex) => (
            <button
              key={item.title}
              type="button"
              onClick={() => show(slideIndex)}
              aria-label={`Show featured item ${slideIndex + 1}`}
              aria-current={slideIndex === index}
              className={cx(styles.tab, slideIndex === index && styles.tabActive)}
            />
          ))}
        </div>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => show(index + 1)}
          aria-label="Next featured item"
        >
          <ArrowGlyph width={14} height={10} />
        </button>
      </div>
    </PageSection>
  );
}
