import { useEffect, useState } from 'react';
import { cx } from '@/shared/lib';
import type { Heading } from '@/shared/lib';
import styles from './TableOfContents.module.css';

/** Where a heading counts as "reached": just below the sticky site header. */
const ACTIVE_LINE = 120;

/**
 * The contents rail beside a post: every `##` and `###` in the piece, with the
 * section currently under the reader highlighted.
 *
 * The active section is the last heading to have crossed a line near the top of
 * the viewport, rather than whichever heading is visible — several are, most of
 * the time. Reading positions on scroll (rather than watching intersections)
 * also gets the end of the page right: the closing sections of a post sit too
 * low to ever cross that line, so the bottom of the page is special-cased to
 * the last heading instead of leaving the rail stuck mid-post.
 *
 * The rail is generated from the prose, so it never drifts from the headings it
 * lists.
 */
export function TableOfContents({ headings }: { headings: readonly Heading[] }) {
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    if (headings.length === 0) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      if (atBottom) {
        setActiveId(headings[headings.length - 1]?.id);
        return;
      }

      let current = headings[0]?.id;
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= ACTIVE_LINE) current = heading.id;
      }
      setActiveId(current);
    };

    // Scroll fires far faster than the rail can usefully change.
    const onScroll = () => {
      frame ||= window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className={styles.rail}>
      <p className={styles.label}>On this page</p>
      <ul className={styles.list}>
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={heading.id === activeId ? 'location' : undefined}
              className={cx(
                styles.link,
                heading.depth === 3 && styles.nested,
                heading.id === activeId && styles.active,
              )}
              onClick={(event) => {
                // The site is on a hash router, so a bare fragment href would
                // be read as a route. Scroll to the heading directly instead.
                event.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ block: 'start' });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
