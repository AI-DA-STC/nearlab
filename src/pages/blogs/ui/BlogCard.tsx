import { Link } from 'react-router-dom';
import { Badge, MediaPlaceholder } from '@/shared/ui';
import { blogPostPath } from '@/shared/config';
import { cx } from '@/shared/lib';
import { themeShortName } from '@/entities/theme';
import type { Blog } from '@/entities/blog';
import styles from './BlogCard.module.css';

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <li className={cx(styles.item, 'nl-fade-up')}>
      <Link to={blogPostPath(blog.slug)} className={styles.card}>
        <MediaPlaceholder
          src={blog.image}
          alt={blog.image ? blog.figure : `Header image placeholder — ${blog.figure} (16:9)`}
          caption={blog.figure}
          compact
          zoom
          overlay={<Badge variant="overlay">{themeShortName(blog.themeId)}</Badge>}
        />
        <div className={styles.body}>
          <h3 className={styles.title}>{blog.title}</h3>
          <p className={styles.excerpt}>{blog.excerpt}</p>
          <p className={styles.meta}>
            {blog.publishedOn} · {blog.readingTime}
          </p>
        </div>
      </Link>
    </li>
  );
}
