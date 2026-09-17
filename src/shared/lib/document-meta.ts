import { useEffect } from 'react';

/**
 * Per-route `<title>` and meta description.
 *
 * The defaults repeat the static tags in `index.html`, which is what link
 * previews and non-rendering crawlers read; keep the two in step. Search
 * engines that run the app pick up the per-route values set here.
 */
const SITE_NAME = 'NEAR Lab';
const SITE_TITLE = 'NEAR Lab — Next-gen Edge AI and Robotics Lab';
const SITE_DESCRIPTION =
  'NEAR Lab builds a future where diverse robots and humans form capable teams on demand.';

export interface DocumentMeta {
  /** The page's own name; omitted on the home page, which uses the site title. */
  readonly title?: string;
  readonly description?: string;
}

function setMetaDescription(content: string): void {
  const tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (tag) tag.content = content;
}

export function useDocumentMeta({ title, description }: DocumentMeta = {}): void {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : SITE_TITLE;
    setMetaDescription(description ?? SITE_DESCRIPTION);
  }, [title, description]);
}
