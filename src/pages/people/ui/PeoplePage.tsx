import { useState } from 'react';
import { PageHeading, PageSection, RuledHeading } from '@/shared/ui';
import { ALUMNI, LAB_LEAD, PEOPLE_GROUPS } from '../model/person';
import { PersonCard } from './PersonCard';
import styles from './PeoplePage.module.css';

const TEAM_PHOTO = '/uploads/team.jpg';

export function PeoplePage() {
  const [bannerFailed, setBannerFailed] = useState(false);

  return (
    <>
      <div className={styles.banner}>
        {!bannerFailed && (
          <img
            src={TEAM_PHOTO}
            alt="The NEAR Lab team around a long table at a team lunch"
            className={styles.bannerImage}
            onError={() => setBannerFailed(true)}
          />
        )}
        <div aria-hidden="true" className={styles.bannerScrim} />
      </div>

      <PageSection tight>
        <PageHeading>Meet the team</PageHeading>

        <RuledHeading className={styles.leadHeading}>NEAR Lab lead</RuledHeading>
        <ul className={styles.roster}>
          <PersonCard person={LAB_LEAD} />
        </ul>

        {PEOPLE_GROUPS.map((group) => (
          <div key={group.title}>
            <RuledHeading className={styles.groupHeading}>{group.title}</RuledHeading>
            <ul className={styles.roster}>
              {group.people.map((person) => (
                <PersonCard key={person.name} person={person} />
              ))}
            </ul>
          </div>
        ))}

        <RuledHeading className={styles.groupHeading}>Previous interns</RuledHeading>
        <ul className={styles.alumni}>
          {ALUMNI.map((alumnus) => (
            <li key={alumnus.name}>
              <a href={alumnus.href} className={styles.alumnusLink}>
                <span>
                  <span className={styles.alumnusName}>{alumnus.name}</span>
                  <span className={styles.alumnusRole}>{alumnus.role}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </PageSection>
    </>
  );
}
