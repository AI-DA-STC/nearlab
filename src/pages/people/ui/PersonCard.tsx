import { useState } from 'react';
import type { Person } from '../model/person';
import { PersonLinks } from './PersonLinks';
import styles from './PersonCard.module.css';

export function PersonCard({ person }: { person: Person }) {
  const hasTopics = person.topics.length > 0;
  // Portraits are dropped into public/uploads separately; until one lands the
  // tinted frame stands in rather than a broken image.
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <li>
      <div className={styles.card}>
        <div className={styles.portrait}>
          {person.photo && !photoFailed && (
            <img
              src={person.photo}
              alt={person.name}
              className={styles.photo}
              onError={() => setPhotoFailed(true)}
            />
          )}
          {hasTopics && (
            <div className={styles.topics} aria-hidden="true">
              <span className={styles.topicsLabel}>WORKS ON</span>
              {person.topics.map((topic) => (
                <span key={topic} className={styles.topic}>
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className={styles.details}>
          <div className={styles.name}>{person.name}</div>
          <div className={styles.role}>{person.role}</div>
          {hasTopics && <div className={styles.topicLine}>{person.topics.join(', ')}</div>}
          <PersonLinks links={person.links} name={person.name} />
        </div>
      </div>
    </li>
  );
}
