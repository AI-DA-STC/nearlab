import type { ThemeId } from '@/entities/theme/@x/blog';

/**
 * Working notes from the lab. On the entities layer for the same reason as
 * `Paper`: the blogs page lists it, the themes page counts it per theme.
 */
export interface Blog {
  readonly title: string;
  readonly excerpt: string;
  readonly publishedOn: string;
  readonly year: string;
  readonly readingTime: string;
  readonly themeId: ThemeId;
  readonly author: string;
  /** Caption for the header image that will illustrate the card. */
  readonly figure: string;
}

export const BLOGS: readonly Blog[] = [
  {
    title: 'Five watts is a design constraint, not a bug',
    excerpt:
      'We stopped treating the power envelope as a deployment detail and started treating it as part of the model architecture…',
    publishedOn: '30 Apr 2026',
    year: '2026',
    readingTime: '6 min read',
    themeId: 5,
    author: 'Daniel Ng',
    figure: 'photo — bench setup, 5 W accelerator',
  },
  {
    title: 'Ten robots, one radio: designing for intermittent links',
    excerpt:
      'Every swarm paper we liked assumed a link budget we do not have on a shipyard. Here is what we changed…',
    publishedOn: '02 Apr 2026',
    year: '2026',
    readingTime: '9 min read',
    themeId: 2,
    author: 'Wei Ling Ho',
    figure: 'diagram — link-loss timeline, 10 agents',
  },
  {
    title: 'Teaching a gripper to feel a weld seam',
    excerpt:
      'Tactile pre-training worked, but only after we threw away the first three datasets. Notes on what made the fourth usable…',
    publishedOn: '04 Mar 2026',
    year: '2026',
    readingTime: '7 min read',
    themeId: 3,
    author: 'Priya Venkatesan',
    figure: 'gif — tactile trace over seam',
  },
  {
    title: 'Reading the room: what foundation models still miss on a factory floor',
    excerpt:
      'A model that can name every object in a photo still cannot tell you which one is about to move. On grounding gaps…',
    publishedOn: '21 Feb 2026',
    year: '2026',
    readingTime: '8 min read',
    themeId: 0,
    author: 'Arjun Rao',
    figure: 'photo — inspection bay, annotated',
  },
  {
    title: 'Why smoke breaks every visual odometry pipeline we tried',
    excerpt:
      'Six pipelines, one smoke chamber, and a failure mode that does not show up in any benchmark we could find…',
    publishedOn: '15 Jan 2026',
    year: '2026',
    readingTime: '10 min read',
    themeId: 1,
    author: 'Marcus Tan',
    figure: 'photo — smoke chamber trial',
  },
  {
    title: 'Handing over control without handing over blame',
    excerpt:
      'Shared autonomy is an interface problem before it is a control problem. What our operators actually asked for…',
    publishedOn: '12 Nov 2025',
    year: '2025',
    readingTime: '6 min read',
    themeId: 4,
    author: 'Nurul Aisyah Rahman',
    figure: 'diagram — handover state machine',
  },
  {
    title: 'A simulator is not a swarm',
    excerpt:
      'Our sim said the formation held. Ten real robots in a car park disagreed, and the disagreement was instructive…',
    publishedOn: '08 Oct 2025',
    year: '2025',
    readingTime: '7 min read',
    themeId: 2,
    author: 'Wei Ling Ho',
    figure: 'photo — car park trial, 10 robots',
  },
  {
    title: 'The reality gap we stopped trying to close',
    excerpt:
      'Domain randomisation has a ceiling. Rather than raise it, we changed what the policy is allowed to assume…',
    publishedOn: '26 Aug 2025',
    year: '2025',
    readingTime: '8 min read',
    themeId: 6,
    author: 'Arjun Rao',
    figure: 'plot — sim vs. real contact force',
  },
  {
    title: 'Notes on evaluating embodied reasoning without a leaderboard',
    excerpt:
      'Industrial tasks do not come with a test split. How we built an evaluation protocol our partners trust…',
    publishedOn: '19 Mar 2025',
    year: '2025',
    readingTime: '9 min read',
    themeId: 0,
    author: 'Dr. Sarah Lim',
    figure: 'diagram — evaluation protocol',
  },
];
