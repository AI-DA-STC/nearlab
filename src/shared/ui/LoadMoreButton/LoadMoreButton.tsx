import { cx } from '@/shared/lib';
import styles from './LoadMoreButton.module.css';

interface LoadMoreButtonProps {
  children: string;
  onClick: () => void;
  /** Adds the top rule and spacing used beneath a card grid. */
  ruled?: boolean;
}

/** Full-width "show more" control that closes a list or grid. */
export function LoadMoreButton({ children, onClick, ruled = false }: LoadMoreButtonProps) {
  return (
    <button type="button" onClick={onClick} className={cx(styles.button, ruled && styles.ruled)}>
      {children}
    </button>
  );
}
