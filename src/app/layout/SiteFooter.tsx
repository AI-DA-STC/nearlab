import { Link } from 'react-router-dom';
import { Container, LogoMark } from '@/shared/ui';
import { CONTACT_EMAIL, NAV_ITEMS } from '@/shared/config';
import styles from './SiteFooter.module.css';

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'GitHub', href: '#' },
  { label: 'Email', href: `mailto:${CONTACT_EMAIL}` },
];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.columns}>
          <div>
            <div className={styles.brand}>
              <LogoMark tone="inverse" />
              <span className={styles.wordmark}>NEAR LAB</span>
            </div>
            <p className={styles.blurb}>Next generation AI &amp; Robotics Lab.</p>
            <p className={styles.blurb}>
              AI.R STC, Group Technology Office
              <br />
              ST Engineering
              <br />
              600W Camp Road, Singapore
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className={styles.list}>
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div />

          <ul className={styles.list}>
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.baseline}>
          <span className={styles.copyright}>© 2026 NEAR Lab</span>
        </div>
      </Container>
    </footer>
  );
}
