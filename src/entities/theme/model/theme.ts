/**
 * The lab's research taxonomy.
 *
 * This is the one domain model that genuinely spans slices: the themes page
 * lists it, and the papers and blogs pages both filter by it and print the
 * short name on every card. Duplicating the list three ways would guarantee
 * it drifts, so it lives here rather than in any single page.
 */

/** A theme's position in `RESEARCH_THEMES` is its stable id. */
export type ThemeId = number;

export const RESEARCH_THEMES = [
  'Embodied AI & foundation models',
  'Autonomy in degraded environments',
  'Multi-agent & swarm coordination',
  'Dexterous manipulation',
  'Human–robot teaming',
  'Edge AI & onboard compute',
  'Sim-to-real & digital twins',
  'Assurable autonomy',
] as const;

/** Compact labels for places where the full theme name will not fit —
 *  card badges and filter pills. Names absent here are already short. */
const SHORT_NAMES: Partial<Record<string, string>> = {
  'Embodied AI & foundation models': 'Embodied AI',
  'Autonomy in degraded environments': 'Degraded environments',
  'Multi-agent & swarm coordination': 'Swarm coordination',
  'Edge AI & onboard compute': 'Edge AI',
  'Sim-to-real & digital twins': 'Sim-to-real',
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
