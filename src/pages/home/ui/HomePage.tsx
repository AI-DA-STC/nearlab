import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageSection, SectionHeading } from '@/shared/ui';
import { isActivityKind, type ActivityKind } from '../model/activity';
import { HeroSection } from './HeroSection';
import { FeaturedCarousel } from './FeaturedCarousel';
import { ActivityFeed } from './ActivityFeed';
import { LatestRail } from './LatestRail';
import styles from './HomePage.module.css';

export function HomePage() {
  const { feedFilter } = useParams();
  const navigate = useNavigate();

  // The feed filter is addressable as /home/:kind, matching the original
  // prototype's `#home/papers` deep links.
  const kindFromUrl: ActivityKind = isActivityKind(feedFilter) ? feedFilter : 'all';
  const [expanded, setExpanded] = useState(false);

  useEffect(() => setExpanded(false), [kindFromUrl]);

  const handleKindChange = useCallback(
    (kind: ActivityKind) => {
      navigate(kind === 'all' ? '/home/all' : `/home/${kind}`, { replace: true });
    },
    [navigate],
  );

  return (
    <>
      <HeroSection />
      <FeaturedCarousel />

      <PageSection tight aria-label="Lab activity">
        <div className={styles.feedLayout}>
          <div>
            <SectionHeading>Lab activity</SectionHeading>
            <ActivityFeed
              kind={kindFromUrl}
              onKindChange={handleKindChange}
              expanded={expanded}
              onExpand={() => setExpanded(true)}
            />
          </div>
          <LatestRail />
        </div>
      </PageSection>
    </>
  );
}
