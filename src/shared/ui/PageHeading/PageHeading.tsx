import type { ReactNode } from 'react';
import { cx } from '@/shared/lib';
import styles from './PageHeading.module.css';

/** The h1 at the top of each route-level page. */
export function PageHeading({ children, className }: { children: ReactNode; className?: string }) {
  return <h1 className={cx(styles.heading, className)}>{children}</h1>;
}
