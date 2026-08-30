import type { ReactElement } from 'react';
import type { PillarId } from '@/entities/theme';

/**
 * One glyph per pillar, for the Venn panel and the region legend.
 *
 * Drawn in the Lucide idiom already vendored for the people page: a shared
 * props spread, `currentColor` so CSS drives the tint, and no dependency.
 */
const BASE = {
  viewBox: '0 0 24 24',
  width: 16,
  height: 16,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** Artificial Intelligence: a die with pins. */
function AiIcon() {
  return (
    <svg {...BASE} aria-hidden="true">
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M10 2v3M14 2v3M10 19v3M14 19v3M2 10h3M2 14h3M19 10h3M19 14h3" />
    </svg>
  );
}

/** Physical Embodiment: a gripper closing on a part. */
function PhysicalIcon() {
  return (
    <svg {...BASE} aria-hidden="true">
      <path d="M12 2v6" />
      <path d="M6 8h12" />
      <path d="M7 8v5a5 5 0 0 0 10 0V8" />
      <rect x="9" y="15" width="6" height="6" rx="1" />
    </svg>
  );
}

/** Multi-Robot Systems: three agents on one link graph. */
function MultiRobotIcon() {
  return (
    <svg {...BASE} aria-hidden="true">
      <circle cx="12" cy="4" r="2.4" />
      <circle cx="4.5" cy="18" r="2.4" />
      <circle cx="19.5" cy="18" r="2.4" />
      <path d="M10.4 6 6.1 15.9M13.6 6l4.3 9.9M6.9 18h10.2" />
    </svg>
  );
}

const ICONS: Record<PillarId, () => ReactElement> = {
  0: AiIcon,
  1: PhysicalIcon,
  2: MultiRobotIcon,
};

export function PillarIcon({ pillar }: { pillar: PillarId }) {
  const Icon = ICONS[pillar];
  return <Icon />;
}
