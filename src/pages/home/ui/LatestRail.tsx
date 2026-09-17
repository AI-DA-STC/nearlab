import { useId, type MouseEvent } from 'react';
import { Reveal } from '@/shared/ui';
import { scrollToAnchor } from '@/shared/lib';
import { formatActivityDate } from '../model/activity';
import { NEWS, isRecentNews, type NewsItem } from '../model/news';
import styles from './LatestRail.module.css';

/** Where "All updates" lands: the full activity feed on this page. */
export const ACTIVITY_ANCHOR_ID = 'lab-activity';
const ACTIVITY_ANCHOR = `#${ACTIVITY_ANCHOR_ID}`;

function NewsText({ item }: { item: NewsItem }) {
  if (!item.href) return <span className={styles.text}>{item.text}</span>;

  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={styles.text}>
      {item.text}
    </a>
  );
}

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
            <li key={item.text} className={styles.item}>
              <div className={styles.meta}>
                <span className={styles.date}>{formatActivityDate(item.on)}</span>
                {isRecentNews(item) && (
                  <span className={styles.new}>
                    <span aria-hidden="true" className={styles.newDot} />
                    NEW
                  </span>
                )}
              </div>
              <NewsText item={item} />
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
