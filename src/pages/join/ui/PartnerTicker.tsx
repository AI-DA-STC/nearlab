import { useState } from 'react';
import { cx } from '@/shared/lib';
import { PARTNERS } from '../model/collaboration';
import styles from './PartnerTicker.module.css';

/** Minimum logos in a single pass. Below this the track can end up narrower
 *  than the viewport, which reads as a stutter rather than a scroll, so the
 *  base list is repeated until the pass is wide enough. */
const MIN_PER_PASS = 6;

/** Continuously scrolling partner logo wall. The pass is rendered twice so the
 *  -50% keyframe loops seamlessly. Pauses on hover, and the global
 *  reduced-motion rule stops it outright. */
export function PartnerTicker() {
  // Logos are dropped into public/uploads separately; any that are missing
  // drop out of the rotation instead of leaving a hole in the track.
  const [missing, setMissing] = useState<readonly string[]>([]);
  const available = PARTNERS.filter((partner) => !missing.includes(partner.name));

  if (available.length === 0) return null;

  const repeats = Math.ceil(MIN_PER_PASS / available.length);
  const pass = Array.from({ length: repeats }, () => available).flat();

  return (
    <div className={styles.viewport}>
      {/* `nl-ticker` carries the animation. It has to be a global class: CSS
          Modules rewrites animation-name values, so a keyframe named from this
          module would bind to a name that does not exist. */}
      <ul className={cx(styles.track, 'nl-ticker')}>
        {[0, 1].map((copy) =>
          pass.map((partner, index) => (
            <li
              key={`${copy}-${index}-${partner.name}`}
              className={styles.item}
              aria-hidden={copy === 1 || index >= available.length}
            >
              <img
                src={partner.logo}
                alt={copy === 0 && index < available.length ? partner.name : ''}
                className={styles.logo}
                loading="eager"
                onError={() => setMissing((current) => [...current, partner.name])}
              />
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
