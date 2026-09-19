import { Container, PageSection, Reveal, SectionBanner, SectionHeading } from '@/shared/ui';
import { useDocumentMeta } from '@/shared/lib';
import { COLLABORATION_ROUTES } from '../model/collaboration';
import { CONTACT_ANCHOR_ID } from '../model/contact';
import { RouteCard } from './RouteCard';
import { PartnerTicker } from './PartnerTicker';
import { OpenPositions } from './OpenPositions';
import { ContactForm } from './ContactForm';
import styles from './JoinPage.module.css';

const LEDE =
  'Three ways in: university collaborations, startup partnerships, and roles inside the lab.';

export function JoinPage() {
  useDocumentMeta({ title: 'Join', description: LEDE });

  return (
    <>
      <SectionBanner
        eyebrow="Collaborate"
        title="Work with us."
        lede={LEDE}
        motif="routes"
      />

      <PageSection flush>
        <Reveal as="ul" className={styles.routes}>
          {COLLABORATION_ROUTES.map((route) => (
            <RouteCard key={route.eyebrow} route={route} />
          ))}
        </Reveal>
        <Reveal delay={140}>
          <PartnerTicker />
        </Reveal>
      </PageSection>

      <PageSection>
        <Reveal>
          <OpenPositions />
        </Reveal>
      </PageSection>

      <section className={styles.ethos}>
        <Container>
          <SectionHeading id="what-we-look-for">What we look for</SectionHeading>
          <div className={styles.ethosColumns}>
            <p className={styles.ethosText}>
              People who enjoy the part where it stops working. Every robotics video you have seen
              works; every robot you have fielded eventually doesn&apos;t. We want the person who
              watches the demo freeze in a smoke-filled stairwell and leans in instead of cutting the
              clip, curious about the soft object, the stuck door, the dropped link, the map that
              turned out to be wrong.
            </p>
            <p className={styles.ethosText}>
              Titles matter less to us than evidence. Show us something you finished (a thesis
              chapter, an open-source release, a build that made it down a real corridor) and the
              temperament for teamwork. Your teammates here are robots as well as people, and they
              will not always want what you want. If &ldquo;the world pushed back and we
              adapted&rdquo; sounds like a good week, you will fit.
            </p>
          </div>
        </Container>
      </section>

      <PageSection>
        <Reveal>
          <SectionHeading id={CONTACT_ANCHOR_ID}>Get in touch</SectionHeading>
          <p className={styles.contactLede}>
            Tell us who you are and what you have in mind. Messages go to the lab team, and we
            reply by email.
          </p>
          <ContactForm />
        </Reveal>
      </PageSection>
    </>
  );
}
