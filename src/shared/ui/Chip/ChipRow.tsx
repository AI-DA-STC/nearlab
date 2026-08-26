import { cx } from '@/shared/lib';
import styles from './ChipRow.module.css';

interface ChipRowProps {
  /** Resource labels, e.g. ['pdf', 'arXiv', 'code']. */
  items: readonly string[];
  className?: string;
}

/** The dot-separated row of resource links under a paper or feed entry. */
export function ChipRow({ items, className }: ChipRowProps) {
  if (items.length === 0) return null;

  return (
    <div className={cx(styles.row, className)}>
      {items.map((label, index) => (
        <span key={label} className={styles.item}>
          {index > 0 && (
            <span aria-hidden="true" className={styles.separator}>
              ·
            </span>
          )}
          <a href="#" className={styles.link}>
            {label}
          </a>
        </span>
      ))}
    </div>
  );
}
