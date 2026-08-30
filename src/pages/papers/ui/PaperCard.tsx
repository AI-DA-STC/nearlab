import { Badge, ChipRow, MediaPlaceholder } from '@/shared/ui';
import { cx } from '@/shared/lib';
import { themeShortName } from '@/entities/theme';
import type { Paper } from '@/entities/paper';
import styles from './PaperCard.module.css';

export function PaperCard({ paper }: { paper: Paper }) {
  // The card title points at the paper's first resource — its project page.
  const primary = paper.resources[0];

  return (
    <li className={cx(styles.card, 'nl-fade-up')}>
      <MediaPlaceholder
        src={paper.image}
        poster={paper.poster}
        alt={paper.image ? `${paper.title} — teaser` : `Figure placeholder — ${paper.figure} (16:9)`}
        caption={paper.figure}
        compact
        zoom
        overlay={<Badge variant="overlay">{themeShortName(paper.themeId)}</Badge>}
      />
      <div className={styles.body}>
        <Badge>{paper.venue}</Badge>
        <h3>
          {primary ? (
            <a
              href={primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.title}
            >
              {paper.title}
            </a>
          ) : (
            <span className={styles.title}>{paper.title}</span>
          )}
        </h3>
        {paper.authors && <p className={styles.authors}>{paper.authors}</p>}
        <p className={styles.published}>Published: {paper.publishedOn}</p>
        <ChipRow items={paper.resources} className={styles.resources} />
      </div>
    </li>
  );
}
