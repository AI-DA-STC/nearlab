import { NavLink, Link } from 'react-router-dom';
import { Container, LogoMark } from '@/shared/ui';
import { NAV_ITEMS, ROUTES } from '@/shared/config';
import { cx } from '@/shared/lib';
import styles from './SiteHeader.module.css';

/** Sticky masthead: brand, primary nav, and the mobile menu trigger. */
export function SiteHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link to={ROUTES.home} className={styles.brand} aria-label="NEAR Lab — home">
          <LogoMark />
          <span className={styles.wordmark}>NEAR LAB</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cx(styles.link, isActive && styles.active)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className={styles.burger}
        >
          <span aria-hidden="true" className={styles.burgerBars} />
        </button>
      </Container>
    </header>
  );
}
