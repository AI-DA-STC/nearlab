import { Link } from 'react-router-dom';
import { Badge, ChipRow, FilterPill, LoadMoreButton } from '@/shared/ui';
import { cx } from '@/shared/lib';
import {
  ACTIVITY,
  ACTIVITY_KINDS,
  ACTIVITY_KIND_LABELS,
  ACTIVITY_TOTALS,
  formatActivityDate,
  type ActivityKind,
} from '../model/activity';
import styles from './ActivityFeed.module.css';

const COLLAPSED_COUNT = 12;

interface ActivityFeedProps {
  kind: ActivityKind;
  onKindChange: (kind: ActivityKind) => void;
  expanded: boolean;
  onExpand: () => void;
}

/** Filterable stream of everything the lab has published or shipped.
 *  The selected kind lives in the URL, so the page owns it and passes it in. */
export function ActivityFeed({ kind, onKindChange, expanded, onExpand }: ActivityFeedProps) {
  const matches = kind === 'all' ? ACTIVITY : ACTIVITY.filter((item) => item.kind === kind);
  const shown = expanded ? matches : matches.slice(0, COLLAPSED_COUNT);

  return (
    <div>
      <div role="group" aria-label="Filter activity by type" className={styles.pills}>
        {ACTIVITY_KINDS.map((option) => (
          <FilterPill
            key={option}
            label={ACTIVITY_KIND_LABELS[option]}
            count={ACTIVITY_TOTALS[option]}
            active={kind === option}
            onToggle={() => onKindChange(option)}
          />
        ))}
      </div>

      {matches.length === 0 && (
        <p className={styles.empty}>
          {kind === 'all'
            ? 'Nothing posted yet.'
            : `No ${ACTIVITY_KIND_LABELS[kind].toLowerCase()} yet.`}
        </p>
      )}

      <div className={styles.list}>
        {shown.map((item) => (
          <div key={`${item.on}-${item.title}`} className={cx(styles.row, 'nl-fade-up')}>
            <div className={styles.date}>{item.dateLabel ?? formatActivityDate(item.on)}</div>
            <div className={styles.body}>
              <div className={styles.text}>
                <div className={styles.tags}>
                  <Badge>{item.badge}</Badge>
                  <span className={styles.source}>{item.source}</span>
                </div>
                <h3 className={styles.title}>
                  {item.to ? (
                    <Link to={item.to} className={styles.titleLink}>
                      {item.title}
                    </Link>
                  ) : item.resources?.[0] ? (
                    <a
                      href={item.resources[0].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.titleLink}
                    >
                      {item.title}
                    </a>
                  ) : (
                    <span className={styles.titleLink}>{item.title}</span>
                  )}
                </h3>
                {item.authors && <p className={styles.authors}>{item.authors}</p>}
                {item.quote && <p className={styles.quote}>{item.quote}</p>}
                {item.resources && <ChipRow items={item.resources} className={styles.resources} />}
                {item.readLink && (
                  <a
                    href={item.readLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.readLink}
                  >
                    {item.readLink.label}
                  </a>
                )}
              </div>
              {item.image ? (
                <img src={item.image} alt={item.thumbnailAlt ?? ''} className={styles.thumb} />
              ) : (
                item.thumbnailAlt && (
                  <div role="img" aria-label={item.thumbnailAlt} className={styles.thumb} />
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {!expanded && matches.length > COLLAPSED_COUNT && (
        <LoadMoreButton onClick={onExpand}>
          {`Show all ${ACTIVITY_TOTALS[kind]} items ↓`}
        </LoadMoreButton>
      )}
    </div>
  );
}
