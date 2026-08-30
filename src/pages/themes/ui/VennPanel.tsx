import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import { ArrowGlyph } from '@/shared/ui';
import { PAPERS } from '@/entities/paper';
import { BLOGS } from '@/entities/blog';
import { PILLARS, RESEARCH_THEMES, themeDetail, themePillars, type ThemeId } from '@/entities/theme';
import { PillarIcon } from './pillar-icons';
import styles from './VennPanel.module.css';

/**
 * The reading half of the Venn: what the selected region is, what happens
 * there, and how much of it is written up yet.
 *
 * Counts come straight from the paper and blog lists rather than being stored,
 * so they cannot drift out of step with what is published.
 */
export function VennPanel({ region }: { region: ThemeId }) {
  const detail = themeDetail(region);
  const pillars = themePillars(region);
  const paperCount = PAPERS.filter((paper) => paper.themeId === region).length;
  const blogCount = BLOGS.filter((blog) => blog.themeId === region).length;

  return (
    <div className={styles.panel}>
      <div className={styles.pillars}>
        {pillars.map((pillar) => (
          <span key={pillar} className={styles.pillarTag}>
            <PillarIcon pillar={pillar} />
            {PILLARS[pillar]}
          </span>
        ))}
      </div>

      <h3 className={styles.name}>{RESEARCH_THEMES[region] ?? ''}</h3>
      <p className={styles.definition}>{detail.definition}</p>

      <ul className={styles.topics}>
        {detail.topics.map((topic) => (
          <li key={topic} className={styles.topic}>
            <ArrowGlyph className={styles.bullet} />
            {topic}
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <span className={styles.count}>
          {paperCount} {paperCount === 1 ? 'paper' : 'papers'} · {blogCount}{' '}
          {blogCount === 1 ? 'blog' : 'blogs'}
        </span>
        <div className={styles.links}>
          <Link to={ROUTES.papers} className={styles.link}>
            Papers →
          </Link>
          <Link to={ROUTES.blogs} className={styles.link}>
            Blogs →
          </Link>
        </div>
      </div>
    </div>
  );
}
