/**
 * The lab's research taxonomy.
 *
 * This is the one domain model that genuinely spans slices: the themes page
 * lists it, and the papers and blogs pages both filter by it and print the
 * short name on every card. Duplicating the list three ways would guarantee
 * it drifts, so it lives here rather than in any single page.
 *
 * The taxonomy is the seven regions of a three-set Venn diagram. The lab works
 * in three areas — AI, physical embodiment, multi-robot systems — and its most
 * distinctive work sits where they overlap, so an overlap has to be nameable
 * rather than being a gap between categories. Keeping a region as the unit
 * means a paper still carries exactly one id.
 */

/** The three areas the lab works in. A region is a subset of these. */
export const PILLARS = [
  'Artificial Intelligence',
  'Physical Embodiment',
  'Multi-Robot Systems',
] as const;

/** A pillar's position in `PILLARS` is its stable id. */
export type PillarId = 0 | 1 | 2;

/** Short labels for the Venn diagram, where the full name will not fit. */
export const PILLAR_SHORT_NAMES: Readonly<Record<PillarId, string>> = {
  0: 'AI',
  1: 'Physical',
  2: 'Multi-Robot',
};

/** A theme's position in `RESEARCH_THEMES` is its stable id. */
export type ThemeId = number;

/**
 * Ordered as the three single-pillar regions, then the three pairs, then the
 * centre. Reordering this array silently re-files every paper and blog, since
 * `Paper.themeId` is a position in it.
 */
export const RESEARCH_THEMES = [
  'Learning & foundation models',
  'Manipulation & mobility',
  'Coordination & swarms',
  'Embodied AI',
  'Ad hoc teaming',
  'Heterogeneous teams',
  'Adaptive teams',
] as const;

/** Which pillars each region occupies. Positions match `RESEARCH_THEMES`. */
const REGION_PILLARS: ReadonlyArray<readonly PillarId[]> = [
  [0],
  [1],
  [2],
  [0, 1],
  [0, 2],
  [1, 2],
  [0, 1, 2],
];

export interface ThemeDetail {
  /** One sentence naming what the region is, for the Venn panel. */
  readonly definition: string;
  /** The work that actually happens there. */
  readonly topics: readonly string[];
}

/** Positions match `RESEARCH_THEMES`. */
const THEME_DETAILS: ReadonlyArray<ThemeDetail> = [
  {
    definition: 'Models and learning algorithms, before they touch a robot.',
    topics: [
      'Vision-language-action models',
      'Reinforcement learning',
      'World models',
      'Simulators that are wrong in the right ways',
      'Failure detection & self-assessment',
    ],
  },
  {
    definition: 'The body that has to survive contact with the world.',
    topics: [
      'End-effector design & rapid iteration',
      'Tactile & force sensing',
      'Legged mobility over rubble and stairs',
      'Deformable-object handling',
      'Onboard compute budgets',
    ],
  },
  {
    definition: 'Many agents, one task, no central authority.',
    topics: [
      'Decentralised task allocation',
      'Mission decomposition',
      'Coordination through intermittent links',
      'Swarm scaling',
      'Adversarial multi-agent',
    ],
  },
  {
    definition: 'Policies that survive contact with real hardware.',
    topics: [
      'VLA policies on real robots',
      'Sim-to-real transfer',
      'Edge AI & onboard inference',
      'Learned manipulation',
      'Whole-body control',
    ],
  },
  {
    definition: 'Teaming with agents you never trained with.',
    topics: [
      'Ad hoc teamwork under pressure',
      'Human–robot teaming',
      'Learned coordination policies',
      'Intent inference',
      'The benchmark we are building',
    ],
  },
  {
    definition: 'Different bodies, different sensors, one mission.',
    topics: [
      'Air-ground teams',
      'Aerial-surface marine teams',
      'Physical handover between robots',
      'Capability-aware allocation',
      'Shared-load manipulation',
    ],
  },
  {
    definition: 'Everything at once — the only place the mission actually happens.',
    topics: [
      'Teams that adapt when the world pushes back',
      'Robust autonomy in degraded environments',
      'Assurable autonomy',
      'Field trials on real hardware',
    ],
  },
];

/** Compact labels for places where the full theme name will not fit —
 *  card badges and filter pills. Names absent here are already short. */
const SHORT_NAMES: Partial<Record<string, string>> = {
  'Learning & foundation models': 'Foundation models',
};

export function themeName(id: ThemeId): string {
  return RESEARCH_THEMES[id] ?? 'Unknown theme';
}

/** Short label for a theme, for badges and pills. */
export function themeShortName(id: ThemeId): string {
  const name = themeName(id);
  return SHORT_NAMES[name] ?? name;
}

/** Every theme id, in listing order. */
export function themeIds(): ThemeId[] {
  return RESEARCH_THEMES.map((_, index) => index);
}

/** The pillars a region occupies. Empty for an id outside the taxonomy. */
export function themePillars(id: ThemeId): readonly PillarId[] {
  return REGION_PILLARS[id] ?? [];
}

export function themeDetail(id: ThemeId): ThemeDetail {
  return THEME_DETAILS[id] ?? { definition: '', topics: [] };
}

/** The region occupying exactly `pillars`, or undefined if there is none. */
export function themeForPillars(pillars: readonly PillarId[]): ThemeId | undefined {
  const index = REGION_PILLARS.findIndex(
    (set) => set.length === pillars.length && set.every((pillar) => pillars.includes(pillar)),
  );
  return index === -1 ? undefined : index;
}
