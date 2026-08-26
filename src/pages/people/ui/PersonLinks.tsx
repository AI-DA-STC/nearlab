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

/** The four profile links under a portrait. */
export function PersonLinks({ links = {}, name }: { links?: Links; name: string }) {
  return (
    <div className={styles.row}>
      {ORDER.map(({ key, label, icon }) => (
        <a
          key={key}
          href={links[key] ?? '#'}
          title={label}
          aria-label={`${name} — ${label}`}
          className={styles.link}
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
