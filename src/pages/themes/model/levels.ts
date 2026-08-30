/**
 * The three ways the world refuses to cooperate.
 *
 * Page-local, same reasoning as `industries.ts`. These sit beside the industry
 * tiles rather than in a section of their own: every industry on that list is
 * a place where all three show up at once, so the problems read as the reason
 * the list looks the way it does.
 */
export interface Level {
  readonly index: string;
  readonly title: string;
  /** The line the point is built around. */
  readonly quote: string;
  readonly description: string;
}

export const LEVELS: readonly Level[] = [
  {
    index: '01',
    title: 'The indifferent world',
    quote: 'A door does not care about your policy.',
    description:
      'Physics does not negotiate. Stuck doors, soft loads, corridors that were never in the map — and failures that stay silent until the plan built on top of them collapses.',
  },
  {
    index: '02',
    title: 'The degraded world',
    quote: 'No GPS, no comms, no light, no map.',
    description:
      'Where most robotics research stops, we keep going. Smoke, rubble and dead links are our operating condition, not our edge case — and we hold the hardware and the access to prove it.',
  },
  {
    index: '03',
    title: 'The world that pushes back',
    quote: 'An opponent finds the weakness you did not know you had.',
    description:
      'The agents around you cooperate, compete, or quietly pursue goals of their own. We build teams that hold under active probing, and trust the autonomy precisely because we spent years trying to break it.',
  },
];
