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
