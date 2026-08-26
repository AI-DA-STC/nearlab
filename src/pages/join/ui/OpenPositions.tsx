import { SectionHeading } from '@/shared/ui';
import { OPEN_JOBS } from '../model/collaboration';
import styles from './OpenPositions.module.css';

export function OpenPositions() {
  return (
    <>
      <SectionHeading id="open-positions">Open positions</SectionHeading>
      {OPEN_JOBS.length === 0 ? (
        <p className={styles.empty}>No open positions right now.</p>
      ) : (
        <ul className={styles.list}>
          {OPEN_JOBS.map((job) => (
            <li key={job.title} className={styles.job}>
              <div className={styles.posted}>{job.postedOn}</div>
              <div>
                <h3 className={styles.title}>{job.title}</h3>
                <div className={styles.meta}>{job.meta}</div>
                <p className={styles.description}>{job.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
