import type { ReactNode } from 'react';
import { cx } from '@/shared/lib';
import styles from './Eyebrow.module.css';

interface EyebrowProps {
  children: ReactNode;
  /** Navy-blue variant, used above featured-work headlines. */
  accent?: boolean;
  className?: string;
}

/** Small uppercase mono label that sits above a heading. */
export function Eyebrow({ children, accent = false, className }: EyebrowProps) {
  return <div className={cx(styles.eyebrow, accent && styles.accent, className)}>{children}</div>;
}
