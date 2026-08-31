import { RL2_VLA } from '@/entities/paper';
import { BLOGS } from '@/entities/blog';
import { themeShortName } from '@/entities/theme';
import { blogPostPath } from '@/shared/config';
import type { ResourceLink } from '@/shared/ui';

/**
 * The lab activity feed: one stream mixing papers, blog posts, demo videos,
 * social posts and press. Entries carry the wording the feed wants rather than
 * being rendered from the source record, so the shape stays local to this page.
 */
export const ACTIVITY_KINDS = ['all', 'papers', 'blogs', 'videos', 'posts', 'media'] as const;
export type ActivityKind = (typeof ACTIVITY_KINDS)[number];

export const ACTIVITY_KIND_LABELS: Record<ActivityKind, string> = {
  all: 'All',
  papers: 'Papers',
  blogs: 'Blogs',
  videos: 'Videos',
  posts: 'Posts',
  media: 'Media',
};

export function isActivityKind(value: string | undefined): value is ActivityKind {
  return value !== undefined && (ACTIVITY_KINDS as readonly string[]).includes(value);
}

const MONTHS = 'JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC'.split(' ');

/** `2026-07` reads as `JUL 2026`; a year-only `2025` is left as it is, since
 *  inventing a month would claim precision the entry does not have. */
export function formatActivityDate(on: string): string {
  const [year, month] = on.split('-');
  const name = month ? MONTHS[Number(month) - 1] : undefined;
  return name && year ? `${name} ${year}` : on;
}

export interface ActivityItem {
  readonly kind: Exclude<ActivityKind, 'all'>;
  /** ISO and sortable: `YYYY`, `YYYY-MM` or `YYYY-MM-DD`, at whatever
   *  precision is actually known. The feed derives its date column from this
   *  rather than carrying a second, hand-written display string that could
   *  drift out of step with the order. */
  readonly on: string;
  /** Overrides the derived date column, for an entry whose date is not a point
   *  in time — ongoing work, say. */
  readonly dateLabel?: string;
  readonly badge: string;
  readonly source: string;
  readonly title: string;
  readonly authors?: string;
  readonly quote?: string;
  readonly readLink?: ResourceLink;
  /** A destination on this site. The title links here rather than opening a
   *  resource in a new tab. */
  readonly to?: string;
  readonly resources?: readonly ResourceLink[];
  readonly image?: string;
  readonly thumbnailAlt?: string;
}

/** Every post, as a feed row. Generated rather than hand-listed so a new post
 *  appears here by being added to `BLOGS`, and cannot fall out of step. */
const BLOG_ENTRIES: readonly ActivityItem[] = BLOGS.map((blog) => ({
  kind: 'blogs',
  on: blog.publishedAt ?? '',
  // An ongoing post has no date to render, so it brings its own label.
  dateLabel: blog.publishedAt ? undefined : blog.publishedOn.toUpperCase(),
  badge: 'BLOG',
  source: themeShortName(blog.themeId),
  title: blog.title,
  quote: blog.excerpt,
  to: blogPostPath(blog.slug),
  image: blog.image,
  thumbnailAlt: blog.figure,
}));

const ENTRIES: readonly ActivityItem[] = [
  {
    kind: 'papers',
    on: RL2_VLA.publishedAt,
    badge: 'PAPER',
    source: RL2_VLA.venue,
    title: RL2_VLA.title,
    authors: RL2_VLA.authors,
    resources: RL2_VLA.resources,
    image: RL2_VLA.poster,
    thumbnailAlt: 'RL²-VLA teaser — a still from the compositional steering figure',
  },
  {
    kind: 'media',
    on: '2025-09',
    badge: 'MEDIA',
    source: 'ST Engineering InnoTech',
    title: 'ST Engineering investing S$250m in five-year programme on physical AI research',
    quote:
      "William (NEAR Lab team lead, second from right) presenting to the Minister for Digital Development and Information Josephine Teo (first from right), MUMTOS and Physical AI development at ST Engineering's InnoTech Conference on Sep 4.",
    resources: [
      { label: 'CNA', href: 'https://www.youtube.com/watch?v=u_x1grGOOJw' },
      {
        label: 'The Business Times',
        href: 'https://www.businesstimes.com.sg/companies-markets/st-engineering-will-invest-s250-million-drive-robotics-solutions-complex-challenges',
      },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/posts/josephine-teo-ylm_aibilingualism-ai-digitaltransformation-activity-7369557402813198343-OaF9/',
      },
    ],
    image: '/uploads/media/innotech.png',
    thumbnailAlt:
      "William presenting MUMTOS and Physical AI development to Minister Josephine Teo at ST Engineering's InnoTech Conference",
  },
  {
    kind: 'media',
    on: '2026-02',
    badge: 'MEDIA',
    source: 'Singapore Airshow',
    title: 'Robust Physical AI for UAVs and UGVs',
    quote:
      'Members of the NEAR Lab presenting about embodied AI and swarm technologies that enable fleets of robots — from aerial drones to robotic dogs — to operate as one unified team.',
    image: '/uploads/media/airshow.png',
    thumbnailAlt: 'The NEAR Lab stand at the Singapore Airshow, with UAV and UGV platforms on show',
  },
  // Last, so that entries sharing a month keep the order written here — a
  // paper ahead of a post published the same month.
  ...BLOG_ENTRIES,
];

/**
 * The feed as shown: newest first, so entries can be authored in whatever order
 * is convenient. ISO strings compare correctly as text, a year-only `on` sorts
 * below every dated entry in that year — the earliest point it can mean — and
 * an empty `on` (undated, ongoing work) sorts below everything.
 */
export const ACTIVITY: readonly ActivityItem[] = [...ENTRIES].sort((a, b) =>
  b.on.localeCompare(a.on),
);

/** Pill counts, derived from the feed so they cannot drift out of step. */
export const ACTIVITY_TOTALS: Record<ActivityKind, number> = {
  all: ACTIVITY.length,
  papers: ACTIVITY.filter((item) => item.kind === 'papers').length,
  blogs: ACTIVITY.filter((item) => item.kind === 'blogs').length,
  videos: ACTIVITY.filter((item) => item.kind === 'videos').length,
  posts: ACTIVITY.filter((item) => item.kind === 'posts').length,
  media: ACTIVITY.filter((item) => item.kind === 'media').length,
};
