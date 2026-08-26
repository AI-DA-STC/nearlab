import { Badge, ChipRow, FilterPill, LoadMoreButton } from '@/shared/ui';
import {
  ACTIVITY,
  ACTIVITY_KINDS,
  ACTIVITY_KIND_LABELS,
  ACTIVITY_TOTALS,
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

      <div className={styles.list}>
        {shown.map((item) => (
          <div key={`${item.date}-${item.title}`} className={styles.row}>
            <div className={styles.date}>{item.date}</div>
            <div className={styles.body}>
              <div className={styles.text}>
                <div className={styles.tags}>
                  <Badge>{item.badge}</Badge>
                  <span className={styles.source}>{item.source}</span>
                </div>
                <h3 className={styles.title}>
                  <a href="#" className={styles.titleLink}>
                    {item.title}
                  </a>
                </h3>
                {item.authors && <p className={styles.authors}>{item.authors}</p>}
                {item.quote && <p className={styles.quote}>{item.quote}</p>}
                {item.resources && <ChipRow items={item.resources} className={styles.resources} />}
                {item.readLink && (
                  <a href="#" className={styles.readLink}>
                    {item.readLink}
                  </a>
                )}
              </div>
              {item.thumbnailAlt && (
                <div role="img" aria-label={item.thumbnailAlt} className={styles.thumb} />
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
