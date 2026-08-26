import { Badge, ChipRow, MediaPlaceholder } from '@/shared/ui';
import { themeShortName } from '@/entities/theme';
import type { Paper } from '@/entities/paper';
import styles from './PaperCard.module.css';

export function PaperCard({ paper }: { paper: Paper }) {
  return (
    <li className={styles.card}>
      <MediaPlaceholder
        alt={`Figure placeholder from the paper — ${paper.figure} (16:9)`}
        caption={paper.figure}
        compact
        zoom
        overlay={<Badge variant="overlay">{themeShortName(paper.themeId)}</Badge>}
      />
      <div className={styles.body}>
        <Badge>{paper.venue}</Badge>
        <h3>
          <a href="#" className={styles.title}>
            {paper.title}
          </a>
        </h3>
        <p className={styles.authors}>{paper.authors}</p>
        <p className={styles.published}>Published: {paper.publishedOn}</p>
        <ChipRow items={paper.resources} className={styles.resources} />
      </div>
    </li>
  );
}
