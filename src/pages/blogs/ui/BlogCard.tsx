import { Badge, MediaPlaceholder } from '@/shared/ui';
import { cx } from '@/shared/lib';
import { themeShortName } from '@/entities/theme';
import type { Blog } from '@/entities/blog';
import styles from './BlogCard.module.css';

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <li className={cx(styles.item, 'nl-fade-up')}>
      <a href="#" className={styles.card}>
        <MediaPlaceholder
          alt={`Header image placeholder — ${blog.figure} (16:9)`}
          caption={blog.figure}
          compact
          zoom
          overlay={<Badge variant="overlay">{themeShortName(blog.themeId)}</Badge>}
        />
        <div className={styles.body}>
          <h3 className={styles.title}>{blog.title}</h3>
          <p className={styles.excerpt}>{blog.excerpt}</p>
          <div className={styles.byline}>
            <span aria-hidden="true" className={styles.avatar} />
            <span className={styles.author}>{blog.author}</span>
          </div>
          <p className={styles.meta}>
            {blog.publishedOn} · {blog.readingTime}
          </p>
        </div>
      </a>
    </li>
  );
}
