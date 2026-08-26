import { ArrowGlyph, Eyebrow } from '@/shared/ui';
import { CONTACT_EMAIL } from '@/shared/config';
import { cx } from '@/shared/lib';
import type { CollaborationRoute } from '../model/collaboration';
import styles from './RouteCard.module.css';

export function RouteCard({ route }: { route: CollaborationRoute }) {
  return (
    <li className={cx(styles.card, route.tinted && styles.tinted)}>
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
        <a href={route.href} className={styles.action}>
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
