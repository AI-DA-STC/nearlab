import type { ReactNode } from 'react';
import { cx } from '@/shared/lib';
import styles from './Badge.module.css';

interface BadgeProps {
  children: ReactNode;
  /** Pill variant that floats over card artwork. */
  variant?: 'default' | 'overlay';
  className?: string;
}

/** Small mono label: a publication venue, or a feed item's type. */
export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cx(styles.badge, variant === 'overlay' && styles.overlay, className)}>
      {children}
    </span>
  );
}
