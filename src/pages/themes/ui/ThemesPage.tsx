import { useState } from 'react';
import { Eyebrow, PageSection, Reveal, SectionBanner, SectionHeading } from '@/shared/ui';
import type { ThemeId } from '@/entities/theme';
import { INDUSTRIES } from '../model/industries';
import { LEVELS } from '../model/levels';
import { IndustryCard } from './IndustryCard';
import { PillarVenn } from './PillarVenn';
import { VennPanel } from './VennPanel';
import styles from './ThemesPage.module.css';

/** The centre region. The page opens on the lab's own thesis. */
const DEFAULT_REGION: ThemeId = 6;

export function ThemesPage() {
  const [region, setRegion] = useState<ThemeId>(DEFAULT_REGION);

  return (
    <>
      <SectionBanner eyebrow="Research" title="Research themes" motif="mesh" />

      <PageSection>
        <Reveal>
          <Eyebrow>Research areas</Eyebrow>
          <SectionHeading className={styles.heading}>Where the three areas meet.</SectionHeading>
          <p className={styles.lede}>
            Artificial intelligence, physical embodiment and multi-robot systems. Our most
            distinctive work is not inside any one of them — it is where they overlap, so every
            region here is a place work actually happens.
          </p>
        </Reveal>

        <Reveal delay={110} className={styles.venn}>
          <VennPanel region={region} />
          <PillarVenn selected={region} onSelect={setRegion} />
        </Reveal>
      </PageSection>

      <PageSection>
        <div className={styles.industries}>
          <Reveal className={styles.rail}>
            <Eyebrow>Where we prove it</Eyebrow>
            <SectionHeading className={styles.heading}>Industries</SectionHeading>
            <p className={styles.lede}>
              Each of these puts all three problems in one place — and the work still has to get
              done.
            </p>

            <ul className={styles.problems}>
              {LEVELS.map((level) => (
                <li key={level.index} className={styles.problem}>
                  <span className={styles.problemIndex}>{level.index}</span>
                  <span className={styles.problemTitle}>{level.title}</span>
                  <p className={styles.problemQuote}>{level.quote}</p>
                  <p className={styles.problemBody}>{level.description}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="ul" delay={110} className={styles.tiles}>
            {INDUSTRIES.map((industry, index) => (
              <IndustryCard key={industry.index} industry={industry} index={index} />
            ))}
          </Reveal>
        </div>
      </PageSection>
    </>
  );
}
