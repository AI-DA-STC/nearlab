import { cx } from '@/shared/lib';
import { MediaPlaceholder } from '@/shared/ui';
import { IndustryArt } from './industry-art';
import type { Industry } from '../model/industries';
import styles from './IndustryCard.module.css';

/**
 * One industry, as a full-width plate with its name laid over the artwork.
 *
 * Two label treatments, because the artwork underneath changes: a photograph
 * takes light type over a scrim, while the line motif that stands in for it is
 * drawn on a pale tint and needs dark type instead. Setting `image` switches
 * both the media and the label — see `industries.ts`.
 */
export function IndustryCard({ industry, index }: { industry: Industry; index: number }) {
  const hasPhoto = Boolean(industry.image);

  return (
    <li
      className={cx(styles.tile, hasPhoto ? styles.tilePhoto : styles.tileMotif, 'nl-fade-up')}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {hasPhoto ? (
        <MediaPlaceholder
          src={industry.image}
          poster={industry.poster}
          alt={industry.title}
          className={styles.media}
          zoom
        />
      ) : (
        <div className={styles.motif}>
          <IndustryArt motif={industry.motif} />
        </div>
      )}

      <div aria-hidden="true" className={styles.scrim} />

      <div className={styles.label}>
        <span aria-hidden="true" className={styles.marker} />
        <h3 className={styles.title}>{industry.title}</h3>
      </div>

      <span className={styles.index}>{industry.index}</span>
    </li>
  );
}
