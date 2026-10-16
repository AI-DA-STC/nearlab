/** Route paths. Kept in shared/config so the header, footer and router all
 *  agree on one spelling without any of them importing from each other. */
export const ROUTES = {
  home: '/',
  themes: '/themes',
  papers: '/papers',
  blogs: '/blogs',
  people: '/people',
  contact: '/contact',
} as const;

/** A single post's path. The listing links to it, the router matches it. */
export function blogPostPath(slug: string): string {
  return `${ROUTES.blogs}/${slug}`;
}

/** A previous intern's testimonial. The People page links to it, the router
 *  matches it. */
export function testimonialPath(slug: string): string {
  return `/testimonials/${slug}`;
}

/** A news item's page. The home page's Latest rail links to it, the router
 *  matches it. There is no news index; the rail is the listing. */
export function newsPostPath(slug: string): string {
  return `/news/${slug}`;
}

/**
 * Navigation state for a route change that only rewrites the address of the
 * page already open — a tab or filter kept in the URL. The layout sends every
 * route change back to the top of the page except one carrying this, so the
 * reader stays where they are.
 */
export const KEEP_SCROLL = { keepScroll: true } as const;

export function keepsScroll(state: unknown): boolean {
  return typeof state === 'object' && state !== null && 'keepScroll' in state && state.keepScroll === true;
}

export interface NavItem {
  readonly label: string;
  readonly to: string;
}

/** Primary navigation, rendered by both the site header and the footer. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Research Themes', to: ROUTES.themes },
  { label: 'Papers', to: ROUTES.papers },
  { label: 'Blogs', to: ROUTES.blogs },
  { label: 'People', to: ROUTES.people },
  { label: 'Contact', to: ROUTES.contact },
];
