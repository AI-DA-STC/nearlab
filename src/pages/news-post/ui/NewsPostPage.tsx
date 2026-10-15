import { Link, useParams } from 'react-router-dom';
import { Badge, ChipRow, Container, Eyebrow, PageSection } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { useDocumentMeta } from '@/shared/lib';
import { newsBySlug, newsDateLabel } from '@/entities/news-item';
import { NewsGallery } from './NewsGallery';
import styles from './NewsPostPage.module.css';

/**
 * The template every news item is rendered through: the blog post's masthead
 * carrying a short write-up, then the photos as a gallery. Adding an item means
 * adding a `NewsItem` record — nothing here changes.
 */
export function NewsPostPage() {
  const { slug } = useParams();
  const item = newsBySlug(slug);
  useDocumentMeta({ title: item?.title ?? 'News not found', description: item?.description });

  if (!item) {
    return (
      <PageSection>
        <h1 className={styles.title}>News not found</h1>
        <p className={styles.note}>
          No news item at that address. <Link to={ROUTES.home}>Back to the home page</Link>.
        </p>
      </PageSection>
    );
  }

  return (
    <>
      <Container as="header" className={styles.masthead}>
        <Link to={ROUTES.home} className={styles.back}>
          ← Home
        </Link>
        <Eyebrow className={styles.eyebrow}>
          <Badge>News</Badge>
          <span>{newsDateLabel(item)}</span>
        </Eyebrow>
        <h1 className={styles.title}>{item.title}</h1>
        <p className={styles.description}>{item.description}</p>
        {item.links && <ChipRow items={item.links} className={styles.links} />}
      </Container>

      {item.images.length > 0 && (
        <PageSection aria-label="Photos">
          <NewsGallery images={item.images} />
        </PageSection>
      )}
    </>
  );
}
