import { Container, PageHeading, PageSection, SectionHeading } from '@/shared/ui';
import { COLLABORATION_ROUTES } from '../model/collaboration';
import { RouteCard } from './RouteCard';
import { PartnerTicker } from './PartnerTicker';
import { OpenPositions } from './OpenPositions';
import styles from './JoinPage.module.css';

export function JoinPage() {
  return (
    <>
      <PageSection flush>
        <PageHeading>Work with us.</PageHeading>
        <ul className={styles.routes}>
          {COLLABORATION_ROUTES.map((route) => (
            <RouteCard key={route.eyebrow} route={route} />
          ))}
        </ul>
        <PartnerTicker />
      </PageSection>

      <PageSection>
        <OpenPositions />
      </PageSection>

      <section className={styles.ethos}>
        <Container>
          <SectionHeading>What we look for</SectionHeading>
          <div className={styles.ethosColumns}>
            <p className={styles.ethosText}>
              People who enjoy the part where it stops working. Every robotics video you have seen
              works; every robot you have fielded eventually doesn&apos;t. We want the person who
              watches the demo freeze in a smoke-filled stairwell and leans in rather than cuts the
              clip — the one who is genuinely curious about the soft object, the stuck door, the
              dropped link, the map that turned out to be wrong.
            </p>
            <p className={styles.ethosText}>
              Titles matter less to us than evidence. Show us something you finished — a thesis
              chapter, an open-source release, a build that survived contact with a real corridor —
              and the temperament for teamwork, because here your teammates are robots and humans
              who may cooperate, compete, or quietly pursue goals of their own. If &ldquo;the world
              pushed back and we adapted&rdquo; sounds like a good week, you will fit.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
