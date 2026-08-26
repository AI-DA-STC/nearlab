import { useState } from 'react';
import { PARTNERS } from '../model/collaboration';
import styles from './PartnerTicker.module.css';

/** Continuously scrolling partner logo wall. The list is rendered twice so
 *  the -50% keyframe loops seamlessly. Pauses on hover, and the global
 *  reduced-motion rule stops it outright. */
export function PartnerTicker() {
  // Logos are dropped into public/uploads separately; any that are missing
  // drop out of the rotation instead of leaving a hole in the track.
  const [missing, setMissing] = useState<readonly string[]>([]);
  const available = PARTNERS.filter((partner) => !missing.includes(partner.name));

  if (available.length === 0) return null;

  return (
    <div className={styles.viewport}>
      <ul className={styles.track}>
        {[0, 1].map((pass) =>
          available.map((partner) => (
            <li key={`${pass}-${partner.name}`} className={styles.item} aria-hidden={pass === 1}>
              <img
                src={partner.logo}
                alt={pass === 0 ? partner.name : ''}
                className={styles.logo}
                onError={() => setMissing((current) => [...current, partner.name])}
              />
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
