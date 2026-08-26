import { Eyebrow, LoadMoreButton, PageHeading, PageSection } from '@/shared/ui';
import { BLOGS } from '@/entities/blog';
import { EmptyResults, PublicationFilterBar, usePublicationFilter } from '@/features/publication-filter';
import { BlogCard } from './BlogCard';
import styles from './BlogsPage.module.css';

export function BlogsPage() {
  const filter = usePublicationFilter(BLOGS, 'blogs');

  return (
    <PageSection>
      <Eyebrow>Blogs</Eyebrow>
      <PageHeading className={styles.heading}>Blogs</PageHeading>
      <p className={styles.intro}>
        Working notes from the lab — what we tried, what broke, what we would do differently.
      </p>

      <PublicationFilterBar filter={filter} />

      <div className={styles.results}>
        {filter.isEmpty && (
          <EmptyResults message="No blogs match these filters." onClear={filter.clearAll} />
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
      </div>
    </PageSection>
  );
}
