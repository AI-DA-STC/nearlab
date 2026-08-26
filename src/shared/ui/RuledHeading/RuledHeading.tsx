import type { ReactNode } from 'react';
import { cx } from '@/shared/lib';
import styles from './RuledHeading.module.css';

/** An uppercase group label followed by a hairline rule that fills the row. */
export function RuledHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx(styles.row, className)}>
      <h2 className={styles.label}>{children}</h2>
      <span aria-hidden="true" className={styles.rule} />
    </div>
  );
}
