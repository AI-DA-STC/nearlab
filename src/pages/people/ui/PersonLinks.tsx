import type { ReactNode } from 'react';
import type { PersonLinks as Links } from '../model/person';
import { GitHubIcon, GlobeIcon, LinkedInIcon, ScholarIcon } from './profile-icons';
import styles from './PersonLinks.module.css';

const ORDER: ReadonlyArray<{ key: keyof Links; label: string; icon: ReactNode }> = [
  { key: 'website', label: 'Website', icon: <GlobeIcon /> },
  { key: 'scholar', label: 'Google Scholar', icon: <ScholarIcon /> },
  { key: 'linkedin', label: 'LinkedIn', icon: <LinkedInIcon /> },
  { key: 'github', label: 'GitHub', icon: <GitHubIcon /> },
];

/**
 * The profile links under a portrait, in a fixed order.
 *
 * Only the handles a person actually has are drawn — a dead icon reads as a
 * broken link rather than as an absence — so the row is anywhere from four
 * icons down to nothing at all.
 */
export function PersonLinks({ links, name }: { links?: Links; name: string }) {
  const present = ORDER.filter(({ key }) => links?.[key]);
  if (present.length === 0) return null;

  return (
    <div className={styles.row}>
      {present.map(({ key, label, icon }) => (
        <a
          key={key}
          href={links?.[key]}
          title={label}
          aria-label={`${name} — ${label}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
