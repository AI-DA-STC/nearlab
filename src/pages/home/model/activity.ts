/**
 * The lab activity feed. This is a denormalised stream — a paper appears here
 * with the wording and thumbnail the feed wants, not as a reference into the
 * papers dataset — so it stays local to the home page.
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
  readonly readLink?: string;
  readonly resources?: readonly string[];
  readonly thumbnailAlt?: string;
}

/**
 * Totals shown on the filter pills. These come from the wider archive, of
 * which `ACTIVITY` is the most recent slice — which is why `all` (42) exceeds
 * the number of entries below.
 */
export const ACTIVITY_TOTALS: Record<ActivityKind, number> = {
  all: 42,
  papers: 14,
  blogs: 9,
  videos: 6,
  posts: 10,
  media: 3,
};

export const ACTIVITY: readonly ActivityItem[] = [
  {
    kind: 'posts',
    date: '18 MAY 2026',
    badge: 'POST',
    source: 'LinkedIn',
    title: 'Arjun is off to ICRA 2026 in Vienna',
    quote:
      'Six years after his first rejected submission, Arjun presents the handover work in the main track. Come find us at the poster session.',
    readLink: 'read on linkedin →',
  },
  {
    kind: 'videos',
    date: '12 MAY 2026',
    badge: 'VIDEO',
    source: 'Lab demo',
    title: 'Swarm handover trial — twelve agents, mixed manipulators',
    authors: 'W. L. Ho, M. Tan',
    resources: ['video', 'code'],
    thumbnailAlt: 'Thumbnail placeholder: overhead view of twelve robots in a handover trial',
  },
  {
    kind: 'media',
    date: '06 MAY 2026',
    badge: 'MEDIA',
    source: 'The Straits Times',
    title: 'A corporate lab betting on the decade after next',
    quote:
      'Reporters visited the lab to ask why an engineering group funds research nobody will buy for ten years.',
    readLink: 'read the article →',
  },
  {
    kind: 'blogs',
    date: '30 APR 2026',
    badge: 'BLOG POST',
    source: 'Edge AI & onboard compute',
    title: 'Five watts is a design constraint, not a bug',
    authors: 'Daniel Ng · 6 min read',
  },
  {
    kind: 'papers',
    date: '22 APR 2026',
    badge: 'PAPER',
    source: 'IROS 2026',
    title: 'Degraded-visual-environment navigation with event–LiDAR fusion',
    authors: 'M. Tan, W. L. Ho, K. Nakamura (NTU)³',
    resources: ['pdf', 'arXiv', 'code', 'bibtex'],
    thumbnailAlt: 'Thumbnail placeholder: event-camera overlay in a smoke chamber',
  },
  {
    kind: 'papers',
    date: '22 APR 2026',
    badge: 'PAPER',
    source: 'IROS 2026',
    title: 'Thermal-inertial odometry for smoke-filled indoor spaces',
    authors: 'M. Tan, D. Ng',
    resources: ['pdf', 'code', 'bibtex'],
  },
  {
    kind: 'posts',
    date: '09 APR 2026',
    badge: 'POST',
    source: 'LinkedIn',
    title: 'Applications open for the Sep 2026 intern cohort',
    quote:
      'Four places, six months, co-supervised with your university group. Two are already earmarked for degraded-environment autonomy.',
    readLink: 'read on linkedin →',
  },
  {
    kind: 'blogs',
    date: '02 APR 2026',
    badge: 'BLOG POST',
    source: 'Multi-agent & swarm coordination',
    title: 'Ten robots, one radio: designing for intermittent links',
    authors: 'Wei Ling Ho · 9 min read',
  },
  {
    kind: 'posts',
    date: '27 MAR 2026',
    badge: 'TALK',
    source: 'Singapore Robotics Symposium',
    title: 'Sim-to-real transfer when the real thing is a shipyard',
    quote:
      'Wei Ling Ho presented the lab’s transfer results and the failure cases we have not solved yet.',
    readLink: 'slides →',
  },
  {
    kind: 'videos',
    date: '20 MAR 2026',
    badge: 'VIDEO',
    source: 'Lab demo',
    title: 'Weld-seam tracing with a tactile fingertip',
    authors: 'P. Venkatesan, F. Idris²',
    resources: ['video'],
    thumbnailAlt: 'Thumbnail placeholder: close-up of a tactile fingertip tracing a weld seam',
  },
  {
    kind: 'papers',
    date: '12 MAR 2026',
    badge: 'PAPER',
    source: 'ICRA 2026',
    title: 'Learning contact-rich handover between heterogeneous manipulators',
    authors: 'A. Rao, W. L. Ho, M. Chen (NUS)¹',
    resources: ['pdf', 'arXiv', 'code', 'video', 'bibtex'],
    thumbnailAlt: 'Thumbnail placeholder: dual-arm handover in the lab cell',
  },
  {
    kind: 'papers',
    date: '12 MAR 2026',
    badge: 'PAPER',
    source: 'ICRA 2026',
    title: 'Quantised policy inference on 5 W embedded accelerators',
    authors: 'D. Ng, C. Yuxuan²',
    resources: ['pdf', 'code', 'bibtex'],
  },
  {
    kind: 'papers',
    date: '09 MAR 2026',
    badge: 'PAPER',
    source: 'HRI 2026',
    title: 'Shared autonomy for remote inspection with intermittent supervision',
    authors: 'P. Venkatesan, N. A. Rahman, S. Lim',
    resources: ['pdf', 'arXiv', 'video', 'bibtex'],
  },
  {
    kind: 'blogs',
    date: '04 MAR 2026',
    badge: 'BLOG POST',
    source: 'Dexterous manipulation',
    title: 'Teaching a gripper to feel a weld seam',
    authors: 'Priya Venkatesan · 7 min read',
  },
  {
    kind: 'media',
    date: '26 FEB 2026',
    badge: 'MEDIA',
    source: 'IEEE Spectrum',
    title: 'Inside an industrial lab working four TRLs behind its own products',
    quote:
      'A short profile of how NEAR Lab hands work over to the business units that eventually ship it.',
    readLink: 'read the article →',
  },
  {
    kind: 'videos',
    date: '18 FEB 2026',
    badge: 'VIDEO',
    source: 'Lab demo',
    title: 'Ten robots holding formation through 40% packet loss',
    authors: 'W. L. Ho, L. Marchetti²',
    resources: ['video', 'code'],
    thumbnailAlt: 'Thumbnail placeholder: ten robots in formation in a car park',
  },
  {
    kind: 'posts',
    date: '10 FEB 2026',
    badge: 'POST',
    source: 'LinkedIn',
    title: 'Two new collaborations signed for 2026',
    quote:
      'One on tactile sensing with NTU, one on assurable perception with a Singapore startup. Both run to 2028.',
    readLink: 'read on linkedin →',
  },
  {
    kind: 'papers',
    date: '02 FEB 2026',
    badge: 'PAPER',
    source: 'RSS 2026',
    title: 'Tactile pre-training for dexterous inspection of curved surfaces',
    authors: 'P. Venkatesan, F. Idris², S. Lim',
    resources: ['pdf', 'arXiv', 'bibtex'],
  },
];
