import { PAIRWISE_REGRET, RL2_VLA, SEMANTIC_PREDICTIVE_MAPPING, type Paper } from '@/entities/paper';
import type { ResourceLink } from '@/shared/ui';

/** The rotating spotlight at the top of the home page. */
export interface FeaturedItem {
  /** ISO and sortable, like `Paper.publishedAt`. Orders the slides; never rendered. */
  readonly on: string;
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

/** A paper as a slide. The paper supplies everything but the prose and the
 *  description of its media, which are written for the spotlight. */
function paperSlide(paper: Paper, summary: string, mediaAlt: string): FeaturedItem {
  return {
    on: paper.publishedAt,
    eyebrow: `${paper.publishedOn.toUpperCase()} · ${paper.venue.toUpperCase()}`,
    title: paper.title,
    authors: paper.authors,
    summary,
    resources: paper.resources,
    image: paper.image,
    poster: paper.poster,
    mediaCaption: paper.figure,
    mediaAlt,
  };
}

/** Newest first, so a slide can be added anywhere in the list. ISO dates
 *  compare correctly as text. */
export const FEATURED: readonly FeaturedItem[] = [
  paperSlide(
    RL2_VLA,
    'Steering a vision-language-action model in its latent space, with reinforcement learning choosing how to compose the steering directions and test-time scaling deciding how far to push them.',
    'RL²-VLA adaptive steering: the arm places a screwdriver in a toolbox beside a distractor tape roll, next to its failure-detection plot',
  ),
  paperSlide(
    SEMANTIC_PREDICTIVE_MAPPING,
    'In an occupancy map a door shows up as occupied cells, just like a wall, so a predictor working from geometry alone has no reason to expect a room behind it. Adding semantic door cues leaves full-map accuracy about the same, but raises door-region F1 from 0.03 to 1.0.',
    'A robot in a corridor beside a door. Predicting from geometry alone misses the room behind the door; with the door marked semantically the room is predicted, so exploration and navigation succeed',
  ),
  paperSlide(
    PAIRWISE_REGRET,
    'Many multi-robot coordination methods score a joint plan from single-robot and pairwise terms only. Replaying every subset of recorded four-robot exploration plans shows the pairwise score picking a different plan from the exact score on six of seven maps at a 15 m range, with regret of up to 0.337 of map coverage.',
    'Four robots exploring the same office floor under two plans, side by side. The plan picked by F delivers 79.4% of the map to the base station; the plan picked by F₂ delivers 45.6%',
  ),
].sort((a, b) => b.on.localeCompare(a.on));
