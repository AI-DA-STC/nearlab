import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageSection, Reveal, SectionHeading } from '@/shared/ui';
import { KEEP_SCROLL } from '@/shared/config';
import { cx, useDocumentMeta } from '@/shared/lib';
import { isActivityKind, type ActivityKind } from '../model/activity';
import { NEWS } from '@/entities/news-item';
import { HeroSection } from './HeroSection';
import { FeaturedCarousel } from './FeaturedCarousel';
import { ActivityFeed } from './ActivityFeed';
import { ACTIVITY_ANCHOR_ID, LatestRail } from './LatestRail';
import styles from './HomePage.module.css';

export function HomePage() {
  const { feedFilter } = useParams();
  const navigate = useNavigate();
  useDocumentMeta();

  // The feed filter is addressable as /home/:kind, matching the original
  // prototype's `#home/papers` deep links.
  const kindFromUrl: ActivityKind = isActivityKind(feedFilter) ? feedFilter : 'all';
  const [expanded, setExpanded] = useState(false);

  useEffect(() => setExpanded(false), [kindFromUrl]);

  const handleKindChange = useCallback(
    (kind: ActivityKind) => {
      // Switching tabs rewrites the address in place; the reader is looking at
      // the feed and should not be sent back to the top of the page.
      navigate(kind === 'all' ? '/home/all' : `/home/${kind}`, {
        replace: true,
        state: KEEP_SCROLL,
      });
    },
    [navigate],
  );

  return (
    <>
      <HeroSection />
      <FeaturedCarousel />

      <PageSection tight aria-label="Lab activity">
        <div className={cx(styles.feedLayout, NEWS.length === 0 && styles.feedFullWidth)}>
          <Reveal>
            <SectionHeading id={ACTIVITY_ANCHOR_ID}>Lab activity</SectionHeading>
            <ActivityFeed
              kind={kindFromUrl}
              onKindChange={handleKindChange}
              expanded={expanded}
              onExpand={() => setExpanded(true)}
            />
          </Reveal>
          <LatestRail />
        </div>
      </PageSection>
    </>
  );
}
