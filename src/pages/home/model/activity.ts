import { RL2_VLA } from '@/entities/paper';
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

export interface ActivityItem {
  readonly kind: Exclude<ActivityKind, 'all'>;
  readonly date: string;
  readonly badge: string;
  readonly source: string;
  readonly title: string;
  readonly authors?: string;
  readonly quote?: string;
  readonly readLink?: ResourceLink;
  readonly resources?: readonly ResourceLink[];
  readonly image?: string;
  readonly thumbnailAlt?: string;
}

export const ACTIVITY: readonly ActivityItem[] = [
  {
    kind: 'papers',
    date: RL2_VLA.publishedOn.toUpperCase(),
    badge: 'PAPER',
    source: RL2_VLA.venue,
    title: RL2_VLA.title,
    authors: RL2_VLA.authors,
    resources: RL2_VLA.resources,
    image: RL2_VLA.poster,
    thumbnailAlt: 'RL²-VLA teaser — a still from the compositional steering figure',
  },
];

/** Pill counts, derived from the feed so they cannot drift out of step. */
export const ACTIVITY_TOTALS: Record<ActivityKind, number> = {
  all: ACTIVITY.length,
  papers: ACTIVITY.filter((item) => item.kind === 'papers').length,
  blogs: ACTIVITY.filter((item) => item.kind === 'blogs').length,
  videos: ACTIVITY.filter((item) => item.kind === 'videos').length,
  posts: ACTIVITY.filter((item) => item.kind === 'posts').length,
  media: ACTIVITY.filter((item) => item.kind === 'media').length,
};
