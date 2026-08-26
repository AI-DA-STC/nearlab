/** Route paths. Kept in shared/config so the header, footer and router all
 *  agree on one spelling without any of them importing from each other. */
export const ROUTES = {
  home: '/',
  themes: '/themes',
  papers: '/papers',
  blogs: '/blogs',
  people: '/people',
  join: '/join',
} as const;

export interface NavItem {
  readonly label: string;
  readonly to: string;
}

/** Primary navigation, rendered by both the site header and the footer. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Research themes', to: ROUTES.themes },
  { label: 'Papers', to: ROUTES.papers },
  { label: 'Blogs', to: ROUTES.blogs },
  { label: 'People', to: ROUTES.people },
  { label: 'Join', to: ROUTES.join },
];

export const CONTACT_EMAIL = 'near.lab@stengg.com';
