/** The "Latest" rail beside the activity feed. */
export interface NewsItem {
  /** ISO `YYYY-MM-DD`. The rail derives both its date column and the NEW
   *  marker from this, so neither can be left stale by hand. */
  readonly on: string;
  readonly text: string;
  /** The announcement's primary source. Without one the item reads as text. */
  readonly href?: string;
}

/** How long an announcement keeps its NEW marker. */
const NEW_WINDOW_DAYS = 45;
const DAY_MS = 24 * 60 * 60 * 1000;

export function isRecentNews(item: NewsItem, now: Date = new Date()): boolean {
  return now.getTime() - new Date(item.on).getTime() <= NEW_WINDOW_DAYS * DAY_MS;
}

const ITEMS: readonly NewsItem[] = [
  {
    on: '2026-02-11',
    text: 'NEAR Lab at the ST Engineering Innovation Showcase, Singapore Airshow 2026',
  },
  {
    on: '2026-01-13',
    text: 'Robust Physical AI talk at DSSG, Google Developers Space',
    href: 'https://luma.com/thdjuruz',
  },
  {
    on: '2025-09-04',
    text: 'Physical AI booth at ST Engineering InnoTech Conference 2025',
    href: 'https://www.youtube.com/watch?v=u_x1grGOOJw',
  },
];

/** Newest first; ISO dates compare correctly as text. */
export const NEWS: readonly NewsItem[] = [...ITEMS].sort((a, b) => b.on.localeCompare(a.on));
