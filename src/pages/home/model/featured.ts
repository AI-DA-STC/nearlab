import { RL2_VLA } from '@/entities/paper';
import type { ResourceLink } from '@/shared/ui';

/** The rotating spotlight at the top of the home page. */
export interface FeaturedItem {
  readonly eyebrow: string;
  readonly title: string;
  readonly authors?: string;
  readonly summary: string;
  readonly resources: readonly ResourceLink[];
  readonly image?: string;
  /** Still frame, when `image` is a clip. */
  readonly poster?: string;
  readonly mediaCaption: string;
  readonly mediaAlt: string;
}

export const FEATURED: readonly FeaturedItem[] = [
  {
    eyebrow: `${RL2_VLA.publishedOn.toUpperCase()} · ${RL2_VLA.venue.toUpperCase()}`,
    title: RL2_VLA.title,
    authors: RL2_VLA.authors,
    summary:
      'Steering a vision-language-action model in its latent space, with reinforcement learning choosing how to compose the steering directions and test-time scaling deciding how far to push them.',
    resources: RL2_VLA.resources,
    image: RL2_VLA.image,
    poster: RL2_VLA.poster,
    mediaCaption: RL2_VLA.figure,
    mediaAlt: 'RL²-VLA teaser — a robot arm performing a manipulation task in a tabletop cell',
  },
];
