import type { MouseEvent, ReactNode } from 'react';
import { ArrowGlyph, Eyebrow } from '@/shared/ui';
import { isInPageAnchor, scrollToAnchor } from '@/shared/lib';
import type { CollaborationRoute } from '../model/collaboration';
import { CONTACT_ANCHOR_ID } from '../model/contact';
import styles from './RouteCard.module.css';

const CONTACT_HREF = `#${CONTACT_ANCHOR_ID}`;

function ActionLink({ href, children }: { href: string; children: ReactNode }) {
  // `#id` links have to be scrolled by hand under the hash router — see
  // scrollToAnchor. If the target is not on the page, let the browser have it.
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (scrollToAnchor(href)) event.preventDefault();
  };

  return (
    <a
      href={href}
      onClick={isInPageAnchor(href) ? handleClick : undefined}
      className={styles.action}
    >
      {children}
    </a>
  );
}

export function RouteCard({ route }: { route: CollaborationRoute }) {
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
        <ActionLink href={route.href}>{route.linkLabel}</ActionLink>
        {route.offersContact && <ActionLink href={CONTACT_HREF}>Get in touch →</ActionLink>}
      </div>
    </li>
  );
}
