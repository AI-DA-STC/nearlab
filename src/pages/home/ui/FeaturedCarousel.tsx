import { useEffect, useState } from 'react';
import { ChipRow, Eyebrow, MediaPlaceholder, PageSection } from '@/shared/ui';
import { cx } from '@/shared/lib';
import { FEATURED } from '../model/featured';
import styles from './FeaturedCarousel.module.css';

const ADVANCE_MS = 3000;

/** Auto-advancing spotlight, paused while the pointer is over it. */
export function FeaturedCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // Nothing to rotate through with a single spotlight.
    if (paused || FEATURED.length <= 1) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % FEATURED.length),
      ADVANCE_MS,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

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
          {FEATURED.map((item) => (
            <div key={item.title} className={styles.slide}>
              <div className={styles.split}>
                <MediaPlaceholder
                  src={item.image}
                  poster={item.poster}
                  alt={item.mediaAlt}
                  caption={item.mediaCaption}
                />
                <div>
                  <Eyebrow accent>{item.eyebrow}</Eyebrow>
                  <h3 className={styles.title}>{item.title}</h3>
                  {item.authors && <p className={styles.authors}>{item.authors}</p>}
                  <p className={styles.summary}>{item.summary}</p>
                  <ChipRow items={item.resources} className={styles.resources} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.tabs} hidden={FEATURED.length <= 1}>
        {FEATURED.map((item, slideIndex) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setIndex(slideIndex)}
            aria-label={`Show featured item ${slideIndex + 1}`}
            aria-current={slideIndex === index}
            className={cx(styles.tab, slideIndex === index && styles.tabActive)}
          />
        ))}
      </div>
    </PageSection>
  );
}
