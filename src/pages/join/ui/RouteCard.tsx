import type { MouseEvent } from 'react';
import { ArrowGlyph, Eyebrow } from '@/shared/ui';
import { CONTACT_EMAIL } from '@/shared/config';
import { isInPageAnchor, scrollToAnchor } from '@/shared/lib';
import type { CollaborationRoute } from '../model/collaboration';
import styles from './RouteCard.module.css';

export function RouteCard({ route }: { route: CollaborationRoute }) {
  const inPage = isInPageAnchor(route.href);

  // `#id` links have to be scrolled by hand under the hash router — see
  // scrollToAnchor. If the target is not on the page, let the browser have it.
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (scrollToAnchor(route.href)) event.preventDefault();
  };

  return (
    <li className={styles.card}>
      <Eyebrow>{route.eyebrow}</Eyebrow>
      <h3 className={styles.title}>{route.title}</h3>
      <ul className={styles.points}>
        {route.points.map((point) => (
          <li key={point} className={styles.point}>
            <ArrowGlyph className={styles.bullet} fill="currentColor" />
            <span className={styles.pointText}>{point}</span>
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <a href={route.href} onClick={inPage ? handleClick : undefined} className={styles.action}>
          {route.linkLabel}
        </a>
        {route.showEmail && (
          <a href={`mailto:${CONTACT_EMAIL}`} className={styles.action}>
            Drop us an email →
          </a>
        )}
      </div>
    </li>
  );
}
