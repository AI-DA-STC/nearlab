import { Link } from 'react-router-dom';
import { Container, LogoMark } from '@/shared/ui';
import { NAV_ITEMS } from '@/shared/config';
import styles from './SiteFooter.module.css';

// Only real destinations: a dead `href="#"` reads as a broken link rather
// than as an absence. Social profiles, and the lab inbox once IT provisions
// one, are added here when they exist.
const SOCIAL_LINKS = [{ label: 'GitHub', href: 'https://github.com/AI-DA-STC' }];

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
            <p className={styles.blurb}>Next-gen Edge AI and Robotics Lab.</p>
            <p className={styles.blurb}>
              AI.R STC, Group Technology Office
              <br />
              ST Engineering
              <br />
              Seletar Digital Hub, 600 West Camp Road, Singapore
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
