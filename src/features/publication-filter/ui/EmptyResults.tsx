import styles from './EmptyResults.module.css';

/** Shown when the active filters match nothing. */
export function EmptyResults({ message, onClear }: { message: string; onClear: () => void }) {
  return (
    <div className={styles.empty}>
      <p className={styles.message}>{message}</p>
      <button type="button" onClick={onClear} className={styles.clear}>
        Clear filters
      </button>
    </div>
  );
}
