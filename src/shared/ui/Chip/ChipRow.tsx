import { cx } from '@/shared/lib';
import styles from './ChipRow.module.css';

/** A labelled outbound link — "pdf", "code", "models" and friends. */
export interface ResourceLink {
  readonly label: string;
  readonly href: string;
}

interface ChipRowProps {
  items: readonly ResourceLink[];
  className?: string;
}

/** The dot-separated row of resource links under a paper or feed entry. */
export function ChipRow({ items, className }: ChipRowProps) {
  if (items.length === 0) return null;

  return (
    <div className={cx(styles.row, className)}>
      {items.map((item, index) => (
        <span key={item.label} className={styles.item}>
          {index > 0 && (
            <span aria-hidden="true" className={styles.separator}>
              ·
            </span>
          )}
          <a href={item.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
            {item.label}
          </a>
        </span>
      ))}
    </div>
  );
}
