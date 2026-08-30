import { PageSection, Reveal, RuledHeading, SectionBanner } from '@/shared/ui';
import { ALUMNI, LAB_LEAD, PEOPLE_GROUPS } from '../model/person';
import { PersonCard } from './PersonCard';
import styles from './PeoplePage.module.css';

const TEAM_PHOTO = '/uploads/people/team.jpg';

export function PeoplePage() {
  return (
    <>
      <SectionBanner
        eyebrow="People"
        title="Meet the team"
        lede="Research staff, engineers and interns, plus the university collaborators and alumni who have passed through the lab."
        motif="roster"
        photo={{
          src: TEAM_PHOTO,
          alt: 'The NEAR Lab team around a long table at a team lunch',
        }}
      />

      <PageSection tight>
        <Reveal>
          <RuledHeading>NEAR Lab lead</RuledHeading>
          <ul className={styles.roster}>
            <PersonCard person={LAB_LEAD} />
          </ul>
        </Reveal>

        {PEOPLE_GROUPS.map((group, index) => (
          <Reveal key={group.title} delay={90 + index * 70}>
            <RuledHeading className={styles.groupHeading}>{group.title}</RuledHeading>
            <ul className={styles.roster}>
              {group.people.map((person) => (
                <PersonCard key={person.name} person={person} />
              ))}
            </ul>
          </Reveal>
        ))}

        <Reveal delay={90 + PEOPLE_GROUPS.length * 70}>
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
        </Reveal>
      </PageSection>
    </>
  );
}
