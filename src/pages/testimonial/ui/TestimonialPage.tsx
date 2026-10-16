import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Container, Eyebrow, PageSection } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { renderMarkdown, useDocumentMeta, type MarkdownDoc } from '@/shared/lib';
import styles from './TestimonialPage.module.css';

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; doc: MarkdownDoc }
  | { status: 'failed' };

/**
 * A previous intern's own account of their time in the lab. The text lives in
 * `public/uploads/testimonials/<slug>.md`, fetched on open like a blog post, so
 * adding one is a markdown file and a link from the People page. Its front
 * matter carries `name`, `role` and `period`.
 */
export function TestimonialPage() {
  const { slug } = useParams();
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });

    // The slug comes from the address bar, so it may not be a safe file name.
    if (!slug || !/^[\w-]+$/.test(slug)) {
      setState({ status: 'failed' });
      return;
    }

    fetch(`/uploads/testimonials/${slug}.md`)
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
  }, [slug]);

  const doc = state.status === 'ready' ? state.doc : undefined;
  const name = doc?.meta['name'];
  useDocumentMeta({
    title: name ? `${name}, testimonial` : 'Testimonial',
    description: name ? `${name} on their internship at NEAR Lab.` : undefined,
  });

  return (
    <>
      <Container as="header" className={styles.masthead}>
        <Link to={ROUTES.people} className={styles.back}>
          ← People
        </Link>
        <Eyebrow className={styles.eyebrow}>
          <Badge>Testimonial</Badge>
          {doc?.meta['period'] && <span>{doc.meta['period']}</span>}
        </Eyebrow>
        <h1 className={styles.title}>{name ?? (state.status === 'failed' ? 'Testimonial not found' : '')}</h1>
        {doc?.meta['role'] && <p className={styles.role}>{doc.meta['role']}</p>}
      </Container>

      <PageSection>
        {state.status === 'loading' && <p className={styles.note}>Loading…</p>}
        {state.status === 'failed' && (
          <p className={styles.note}>
            No testimonial at that address. <Link to={ROUTES.people}>Back to People</Link>.
          </p>
        )}
        {doc && <article className={styles.prose} dangerouslySetInnerHTML={{ __html: doc.html }} />}
      </PageSection>
    </>
  );
}
