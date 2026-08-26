import type { ReactNode } from 'react';
import { cx } from '@/shared/lib';
import { Container } from '../Container';
import styles from './PageSection.module.css';

interface PageSectionProps {
  children: ReactNode;
  /** Reduced vertical rhythm, for stacked sections on the home page. */
  tight?: boolean;
  /** Drops the bottom padding where the next section supplies its own. */
  flush?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/** A page section on the standard measure with the site's vertical rhythm. */
export function PageSection({ children, tight, flush, className, ...aria }: PageSectionProps) {
  return (
    <Container
      as="section"
      className={cx(tight ? styles.tight : styles.section, flush && styles.flush, className)}
      {...aria}
    >
      {children}
    </Container>
  );
}
