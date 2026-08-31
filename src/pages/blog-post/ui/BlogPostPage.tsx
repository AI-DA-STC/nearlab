import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Container, Eyebrow, PageSection } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { cx, renderMarkdown, type MarkdownDoc } from '@/shared/lib';
import { blogBySlug } from '@/entities/blog';
import { themeShortName } from '@/entities/theme';
import { TableOfContents } from './TableOfContents';
import styles from './BlogPostPage.module.css';

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; doc: MarkdownDoc }
  | { status: 'failed' };

/**
 * The template every post is rendered through: masthead from the entity,
 * prose and byline from the post's markdown, contents rail generated from its
 * headings. Adding a post means adding a `Blog` record and a markdown file —
 * nothing here changes.
 *
 * The body is fetched at runtime because it lives under `public/`, so a post
 * can be edited and reuploaded without a rebuild.
 */
export function BlogPostPage() {
  const { slug } = useParams();
  const blog = blogBySlug(slug);
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    if (!blog) return;
    let cancelled = false;
    setState({ status: 'loading' });

    fetch(blog.markdown)
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status}`);
        return response.text();
      })
      .then((raw) => {
        if (!cancelled) setState({ status: 'ready', doc: renderMarkdown(raw) });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'failed' });
      });

    return () => {
      cancelled = true;
    };
  }, [blog]);

  if (!blog) {
    return (
      <PageSection>
        <h1 className={styles.title}>Post not found</h1>
        <p className={styles.note}>
          No post with that address. <Link to={ROUTES.blogs}>Back to all blogs</Link>.
        </p>
      </PageSection>
    );
  }

  const doc = state.status === 'ready' ? state.doc : undefined;
  const author = doc?.meta['author'];
  // A post that is only front matter so far has neither prose nor an outline;
  // the rail is dropped and the prose takes the full measure.
  const body = doc?.html.trim();
  const hasContents = (doc?.headings.length ?? 0) > 0;

  return (
    <>
      <Container as="header" className={styles.masthead}>
        <Link to={ROUTES.blogs} className={styles.back}>
          ← All blogs
        </Link>
        <Eyebrow className={styles.eyebrow}>
          <Badge>{themeShortName(blog.themeId)}</Badge>
          <span>
            {blog.publishedOn} · {blog.readingTime}
          </span>
        </Eyebrow>
        <h1 className={styles.title}>{blog.title}</h1>
        <p className={styles.standfirst}>{blog.excerpt}</p>
        {author && <p className={styles.byline}>By {author}</p>}
      </Container>

      <PageSection>
        <div className={cx(styles.layout, !hasContents && styles.layoutWide)}>
          {hasContents && doc && <TableOfContents headings={doc.headings} />}

          {state.status === 'loading' && <p className={styles.note}>Loading post…</p>}
          {state.status === 'failed' && (
            <p className={styles.note}>
              This post could not be loaded. <Link to={ROUTES.blogs}>Back to all blogs</Link>.
            </p>
          )}
          {doc &&
            (body ? (
              // Authored in-repo under public/uploads/blogs, so the same trust
              // as the components around it — see `renderMarkdown`.
              <article className={styles.prose} dangerouslySetInnerHTML={{ __html: body }} />
            ) : (
              <p className={styles.note}>This post is still being written.</p>
            ))}
        </div>
      </PageSection>
    </>
  );
}
