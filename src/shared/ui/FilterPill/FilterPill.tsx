import { cx } from '@/shared/lib';
import { ArrowGlyph } from '../ArrowGlyph';
import styles from './FilterPill.module.css';

interface FilterPillProps {
  label: string;
  count?: number;
  active: boolean;
  onToggle: () => void;
}

/** A toggleable filter chip with a result count. Used by the activity feed
 *  and by the papers/blogs filter bar. */
export function FilterPill({ label, count, active, onToggle }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={cx(styles.pill, active ? styles.active : styles.inactive)}
    >
      {active && <ArrowGlyph className={styles.tick} fill="currentColor" />}
      {label}
      {count !== undefined && <span className={styles.count}>({count})</span>}
    </button>
  );
}
