import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NAV_ITEMS } from '@/shared/config';
import styles from './MobileNavOverlay.module.css';

/** Full-screen navigation for narrow viewports. */
export function MobileNavOverlay({ onClose }: { onClose: () => void }) {
  // Escape closes the menu, and the page beneath must not scroll behind it.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div className={styles.overlay}>
      <div className={styles.top}>
        <span className={styles.wordmark}>NEAR LAB</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className={styles.close}
        >
          CLOSE
        </button>
      </div>
      <nav className={styles.nav} aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <Link key={item.to} to={item.to} onClick={onClose} className={styles.link}>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
