import { Eyebrow, LoadMoreButton, PageHeading, PageSection } from '@/shared/ui';
import { PAPERS } from '@/entities/paper';
import { EmptyResults, PublicationFilterBar, usePublicationFilter } from '@/features/publication-filter';
import { PaperCard } from './PaperCard';
import styles from './PapersPage.module.css';

export function PapersPage() {
  const filter = usePublicationFilter(PAPERS, 'papers');

  return (
    <PageSection>
      <Eyebrow>Papers</Eyebrow>
      <PageHeading className={styles.heading}>Papers</PageHeading>
      <p className={styles.intro}>Peer-reviewed work, 2024–2026.</p>

      <PublicationFilterBar filter={filter} />

      <div className={styles.results}>
        {filter.isEmpty && (
          <EmptyResults message="No papers match these filters." onClear={filter.clearAll} />
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
      </div>
    </PageSection>
  );
}
