import type { ThemeId } from '@/entities/theme/@x/paper';
import type { ResourceLink } from '@/shared/ui';

/**
 * Peer-reviewed and preprint output. Lives on the entities layer because two
 * pages consume it: the papers page lists it, and the themes page counts it
 * per theme.
 */
export interface Paper {
  readonly title: string;
  readonly venue: string;
  readonly year: string;
  /** Omitted until the author list is confirmed. */
  readonly authors?: string;
  readonly publishedOn: string;
  /** The same date as `publishedOn`, ISO and sortable: `YYYY-MM`, or
   *  `YYYY-MM-DD` where the day is known. Never rendered — `publishedOn` is. */
  readonly publishedAt: string;
  readonly themeId: ThemeId;
  readonly resources: readonly ResourceLink[];
  /** Card artwork under `public/`. Falls back to a caption box when absent.
   *  A `.mp4`/`.webm` source is rendered as a muted looping clip. */
  readonly image?: string;
  /** Still frame for a video `image`, and the artwork used where a clip is
   *  wasted — feed thumbnails and similar. */
  readonly poster?: string;
  /** Caption shown on the placeholder when there is no `image`. */
  readonly figure: string;
}

export const RL2_VLA: Paper = {
  title:
    'RL²-VLA: Adaptive RL Latent Compositional Steering with Test-Time Scaling for Vision-Language-Action Models',
  venue: 'arXiv 2026',
  year: '2026',
  publishedOn: 'Jul 2026',
  publishedAt: '2026-07',
  themeId: 3,
  image: '/uploads/papers/rl2-vla.mp4',
  poster: '/uploads/papers/rl2-vla-poster.jpg',
  figure: 'adaptive steering — screwdriver in toolbox, with failure detection',
  resources: [
    { label: 'website', href: 'https://rl2-vla.github.io/' },
    { label: 'paper', href: 'https://arxiv.org/abs/2607.26991' },
    { label: 'code', href: 'https://github.com/marmotlab/RL2-VLA' },
    { label: 'models', href: 'https://huggingface.co/rl2-vla' },
    { label: 'video', href: 'https://youtu.be/0qdPVgib6vI' },
  ],
};

export const SEMANTIC_PREDICTIVE_MAPPING: Paper = {
  title: 'Semantic-Aware Predictive Mapping for Exploration and Navigation',
  venue: 'TENCON 2026',
  year: '2026',
  publishedOn: 'Oct 2026',
  publishedAt: '2026-10',
  themeId: 3,
  image: '/uploads/papers/kenneth_tenconn.webp',
  figure: 'map prediction with and without semantic door cues',
  resources: [
    {
      label: 'website',
      href: 'https://ai-da-stc.github.io/semantic-aware-predictive-mapping-tencon/',
    },
    { label: 'paper', href: 'https://arxiv.org/abs/2610.10382' },
    {
      label: 'code',
      href: 'https://github.com/AI-DA-STC/semantic-aware-predictive-mapping-tencon',
    },
  ],
};

export const PAIRWISE_REGRET: Paper = {
  title: 'Pairwise Approximation Can Select the Wrong Multi-Robot Plan',
  venue: 'IROS 2026 Workshop on Intelligent Information Gathering',
  year: '2026',
  publishedOn: 'Sep 2026',
  publishedAt: '2026-09',
  themeId: 2,
  image: '/uploads/papers/william_iros26.mp4',
  poster: '/uploads/papers/william_iros26-poster.jpg',
  figure: 'the plans picked by F and F₂, explored side by side',
  resources: [
    { label: 'website', href: 'https://www.william-teo.com/pairwise-regret/' },
    { label: 'paper', href: 'https://arxiv.org/abs/2609.29929' },
    { label: 'code', href: 'https://github.com/williamteo/pairwise-regret' },
  ],
};

/** Newest first, so a paper can be added anywhere in the list. ISO dates
 *  compare correctly as text. */
export const PAPERS: readonly Paper[] = [
  RL2_VLA,
  SEMANTIC_PREDICTIVE_MAPPING,
  PAIRWISE_REGRET,
].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
