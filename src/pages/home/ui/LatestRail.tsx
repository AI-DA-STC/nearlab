import { useId } from 'react';
import { Reveal } from '@/shared/ui';
import { NEWS } from '../model/news';
import styles from './LatestRail.module.css';

export function LatestRail() {
  const headingId = useId();

  // The rail is pure signal; an empty one is just a stray heading.
  if (NEWS.length === 0) return null;

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
                <span className={styles.date}>{item.date}</span>
                {item.isNew && (
                  <span className={styles.new}>
                    <span aria-hidden="true" className={styles.newDot} />
                    NEW
                  </span>
                )}
              </div>
              <a href="#" className={styles.text}>
                {item.text}
              </a>
            </li>
          ))}
        </ul>
        <a href="#" className={styles.all}>
          All updates →
        </a>
      </div>
    </Reveal>
  );
}
