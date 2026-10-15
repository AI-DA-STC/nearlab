import { useId, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/shared/ui';
import { newsPostPath } from '@/shared/config';
import { scrollToAnchor } from '@/shared/lib';
import { NEWS, isRecentNews } from '@/entities/news-item';
import { formatActivityDate } from '../model/activity';
import styles from './LatestRail.module.css';

/** Where "All updates" lands: the full activity feed on this page. */
export const ACTIVITY_ANCHOR_ID = 'lab-activity';
const ACTIVITY_ANCHOR = `#${ACTIVITY_ANCHOR_ID}`;

export function LatestRail() {
  const headingId = useId();

  // The rail is pure signal; an empty one is just a stray heading.
  if (NEWS.length === 0) return null;

  // The hash router would read the fragment as a route, so scroll by hand.
  const handleAllUpdates = (event: MouseEvent<HTMLAnchorElement>) => {
    if (scrollToAnchor(ACTIVITY_ANCHOR)) event.preventDefault();
  };

  return (
    <Reveal as="aside" delay={110} aria-labelledby={headingId}>
      <div className={styles.rail}>
        <h2 id={headingId} className={styles.heading}>
          Latest
        </h2>
        <ul className={styles.list}>
          {NEWS.map((item) => (
            <li key={item.slug} className={styles.item}>
              <div className={styles.meta}>
                <span className={styles.date}>{formatActivityDate(item.on)}</span>
                {isRecentNews(item) && (
                  <span className={styles.new}>
                    <span aria-hidden="true" className={styles.newDot} />
                    NEW
                  </span>
                )}
              </div>
              {/* Each item opens its own page: the write-up and its photos. */}
              <Link to={newsPostPath(item.slug)} className={styles.text}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <a href={ACTIVITY_ANCHOR} onClick={handleAllUpdates} className={styles.all}>
          All updates →
        </a>
      </div>
    </Reveal>
  );
}
