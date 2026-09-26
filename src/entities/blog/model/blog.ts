import type { ThemeId } from '@/entities/theme/@x/blog';

/**
 * Working notes from the lab. On the entities layer for the same reason as
 * `Paper`: the blogs page lists it, the themes page counts it per theme.
 *
 * A post is split in two. Everything a tile needs is here, so the listing and
 * the theme counts stay synchronous; the prose and the byline live in the
 * markdown file under `public/uploads/blogs/` and are fetched only when a post
 * is opened.
 */
export interface Blog {
  /** URL segment, and the post's stable identity. */
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  /** The post's body, under `public/`. Each post owns a folder under
   *  `public/uploads/blogs/` holding this and its artwork. Its front matter
   *  carries the author. */
  readonly markdown: string;
  /** How the date reads on the tile — a month, or `Ongoing` for live work. */
  readonly publishedOn: string;
  /** ISO `YYYY-MM`, and the sort key. Absent while a post is ongoing, which
   *  sorts it below everything dated. */
  readonly publishedAt?: string;
  /** Year filter bucket. Empty for an ongoing post, which has no year to file
   *  it under and so shows only under "All". */
  readonly year: string;
  /** Omitted while the post has no body, so a tile never advertises a read
   *  that is not there yet. */
  readonly readingTime?: string;
  readonly themeId: ThemeId;
  /** Tile and feed artwork, from the post's own folder. An animated `.webp`
   *  or `.gif` is fine here — it is rendered as an image. */
  readonly image?: string;
  /** Caption shown on the placeholder when there is no `image`. */
  readonly figure: string;
}

const POSTS: readonly Blog[] = [
  {
    slug: 'multi-expert-distillation',
    title: 'Multi-expert distillation for robust quadruped locomotion in challenging terrains',
    excerpt:
      'A standard framework for training wheeled quadrupeds in simulation with PPO. It is built to scale, and the aim is robots that can get through difficult search-and-rescue sites.',
    markdown: '/uploads/blogs/multi_expert_distillation/multi_expert_distillation.md',
    image: '/uploads/blogs/multi_expert_distillation/thumbnail.webp',
    publishedOn: 'Jul 2026',
    publishedAt: '2026-07',
    year: '2026',
    themeId: 3,
    figure: 'the five expert policies of the terrain curriculum',
  },
  {
    slug: 'vla-cobot-magic',
    title: 'Deploying test-time adaptable VLA policies on the AgileX Cobot Magic (split type)',
    excerpt:
      'A ROS1 bridge and policy router that runs openpi VLA policies on the AgileX Cobot Magic without finetuning, for single-arm manipulation on a table top.',
    markdown: '/uploads/blogs/vla_cobot_magic/vla_cobot_magic.md',
    image: '/uploads/blogs/vla_cobot_magic/thumbnail.webp',
    publishedOn: 'Jun 2026',
    publishedAt: '2026-06',
    year: '2026',
    themeId: 3,
    figure: 'ROS1 topics bridged into openpi observations',
  },
  {
    slug: 'waypoint-navigation-m20',
    title: 'Sparse Graphs, Dense Maps: Autonomous Waypoint Navigation on the Deep Robotics M20',
    excerpt:
      "Nav2's global planner re-searches the whole costmap on every replan, and the routes it finds ignore the structure of the building. Precomputing a sparse waypoint graph from the GLIM map with SWAGGER moves routing offline. That leaves the behaviour tree to sequence short local hops and recover when one fails.",
    markdown: '/uploads/blogs/waypoint_navigation_m20/waypoint_navigation_m20.md',
    image: '/uploads/blogs/waypoint_navigation_m20/thumbnail.gif',
    publishedOn: 'Ongoing',
    year: '',
    themeId: 1,
    figure: 'the waypoint graph over the GLIM point cloud',
  },
  {
    slug: 'far-planner',
    title: 'Attempt, Fail, Reroute: lessons learnt from Map-less Navigation with FAR Planner',
    excerpt:
      "A visibility graph instead of a costmap: polygons extracted as the robot drives, edges disconnected when something blocks the line of sight and reconnected when it clears. Reproducing CMU's FAR Planner, and what the paper doesn't tell you about tuning it.",
    markdown: '/uploads/blogs/far_planner/far_planner.md',
    image: '/uploads/blogs/far_planner/thumbnail.webp',
    publishedOn: 'Jul 2026',
    publishedAt: '2026-07',
    year: '2026',
    themeId: 1,
    figure: 'visibility-graph polygons extracted mid-drive',
  },
];

/**
 * Newest first, with ongoing work last: a post without a `publishedAt` has no
 * date to rank on, and sinking it is honest where guessing a date is not.
 */
export const BLOGS: readonly Blog[] = [...POSTS].sort((a, b) => {
  if (!a.publishedAt || !b.publishedAt) return Number(!a.publishedAt) - Number(!b.publishedAt);
  return b.publishedAt.localeCompare(a.publishedAt);
});

/** The tile's date line: the date, and the reading time once there is one. */
export function blogMetaLine(blog: Blog): string {
  return blog.readingTime ? `${blog.publishedOn} · ${blog.readingTime}` : blog.publishedOn;
}

export function blogBySlug(slug: string | undefined): Blog | undefined {
  return BLOGS.find((blog) => blog.slug === slug);
}
