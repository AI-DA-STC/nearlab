import { Link } from 'react-router-dom';
import { Eyebrow, PageHeading, PageSection } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { RESEARCH_THEMES, themeIds } from '@/entities/theme';
import { PAPERS } from '@/entities/paper';
import { BLOGS } from '@/entities/blog';
import styles from './ThemesPage.module.css';

export function ThemesPage() {
  return (
    <PageSection>
      <Eyebrow>Research</Eyebrow>
      <PageHeading className={styles.heading}>Research themes</PageHeading>
      <p className={styles.intro}>
        A theme is a multi-year line of enquiry we can staff, publish in, and hand over. All eight
        sit at TRL 2–5 and are run with university and startup partners rather than alone.
      </p>

      <div className={styles.pending}>
        <p className={styles.pendingTitle}>Coming soon</p>
        <p className={styles.pendingBody}>
          Detailed theme pages are being written. In the meantime, browse papers and blogs by theme.
        </p>
        <div className={styles.pendingLinks}>
          <Link to={ROUTES.papers} className={styles.pendingLink}>
            Papers by theme →
          </Link>
          <Link to={ROUTES.blogs} className={styles.pendingLink}>
            Blogs by theme →
          </Link>
        </div>
      </div>

      <ul className={styles.grid}>
        {themeIds().map((id) => {
          const paperCount = PAPERS.filter((paper) => paper.themeId === id).length;
          const blogCount = BLOGS.filter((blog) => blog.themeId === id).length;
          return (
            <li key={id} aria-disabled="true" className={styles.card}>
              <span className={styles.cardName}>{RESEARCH_THEMES[id]}</span>
              <span className={styles.cardCount}>
                {paperCount} papers · {blogCount} blogs
              </span>
              <span className={styles.cardStatus}>Coming soon</span>
            </li>
          );
        })}
      </ul>
    </PageSection>
  );
}
