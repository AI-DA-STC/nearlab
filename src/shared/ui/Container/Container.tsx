import type { ElementType, ReactNode } from 'react';
import { cx } from '@/shared/lib';
import styles from './Container.module.css';

interface ContainerProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  [key: string]: unknown;
}

/** The 1200px centred measure used by every section on the site. */
export function Container({ as: Tag = 'div', className, children, ...rest }: ContainerProps) {
  return (
    <Tag className={cx(styles.shell, className)} {...rest}>
      {children}
    </Tag>
  );
}
