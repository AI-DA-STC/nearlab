import { LoadMoreButton, PageSection, Reveal, SectionBanner } from '@/shared/ui';
import { PAPERS } from '@/entities/paper';
import { EmptyResults, PublicationFilterBar, usePublicationFilter } from '@/features/publication-filter';
import { PaperCard } from './PaperCard';
import styles from './PapersPage.module.css';

export function PapersPage() {
  const filter = usePublicationFilter(PAPERS, 'papers');

  return (
    <>
      <SectionBanner
        eyebrow="Publications"
        title="Papers"
        lede="Peer-reviewed work and preprints, 2024–2026 — filterable by research theme, venue and year."
        motif="papers"
      />

      <PageSection>
        {filter.totalCount > 0 && (
          <Reveal>
            <PublicationFilterBar filter={filter} />
          </Reveal>
        )}

        <Reveal delay={110} className={filter.totalCount > 0 ? styles.results : undefined}>
          {filter.totalCount === 0 ? (
            <p className={styles.empty}>No papers published yet.</p>
          ) : (
            filter.isEmpty && (
              <EmptyResults message="No papers match these filters." onClear={filter.clearAll} />
            )
          )}
          <ul className={styles.grid}>
            {filter.visible.map((paper) => (
              <PaperCard key={paper.title} paper={paper} />
            ))}
          </ul>
          {filter.hasMore && (
            <LoadMoreButton onClick={filter.loadMore} ruled>
              Load more ↓
            </LoadMoreButton>
          )}
        </Reveal>
      </PageSection>
    </>
  );
}
