import type { ReactNode } from 'react';
import { cx } from '@/shared/lib';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

/** The h2 that opens a major section within a page. */
export function SectionHeading({ children, id, className }: SectionHeadingProps) {
  return (
    <h2 id={id} className={cx(styles.heading, className)}>
      {children}
    </h2>
  );
}
