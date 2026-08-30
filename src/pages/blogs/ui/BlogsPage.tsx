import { LoadMoreButton, PageSection, Reveal, SectionBanner } from '@/shared/ui';
import { BLOGS } from '@/entities/blog';
import { EmptyResults, PublicationFilterBar, usePublicationFilter } from '@/features/publication-filter';
import { BlogCard } from './BlogCard';
import styles from './BlogsPage.module.css';

export function BlogsPage() {
  const filter = usePublicationFilter(BLOGS, 'blogs');

  return (
    <>
      <SectionBanner
        eyebrow="Writing"
        title="Blogs"
        lede="Notes from the lab — what we tried, what broke, and what we would do differently."
        motif="notes"
      />

      <PageSection>
        {filter.totalCount > 0 && (
          <Reveal>
            <PublicationFilterBar filter={filter} />
          </Reveal>
        )}

        <Reveal delay={110} className={filter.totalCount > 0 ? styles.results : undefined}>
          {filter.totalCount === 0 ? (
            <p className={styles.empty}>No blog posts yet.</p>
          ) : (
            filter.isEmpty && (
              <EmptyResults message="No blogs match these filters." onClear={filter.clearAll} />
            )
          )}
          <ul className={styles.grid}>
            {filter.visible.map((blog) => (
              <BlogCard key={blog.title} blog={blog} />
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
