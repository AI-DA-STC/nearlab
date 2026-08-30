import { useId, useRef, useState, type ReactElement } from 'react';
import { cx } from '@/shared/lib';
import { FilterPill } from '@/shared/ui';
import {
  PILLARS,
  PILLAR_SHORT_NAMES,
  RESEARCH_THEMES,
  themeForPillars,
  themePillars,
  themeIds,
  type PillarId,
  type ThemeId,
} from '@/entities/theme';
import styles from './PillarVenn.module.css';

/**
 * The three research areas as a Venn diagram, with all seven regions live.
 *
 * The overlaps are the point: naming them is what turns three circles into a
 * claim about the lab. So the pairs and the centre are selectable, not just
 * the circles.
 *
 * Hit testing is done in JS against the circle equations rather than on the
 * region shapes themselves. The shapes are built from masks, and masking is
 * not reliably accounted for in SVG hit testing, so a `<rect>` takes the
 * pointer and the maths decides the region. That keeps the drawing free to be
 * as compound as it likes.
 */
const VIEW_W = 520;
const VIEW_H = 480;
const R = 150;

const PILLAR_IDS: readonly PillarId[] = [0, 1, 2];

/** The region occupying all three pillars. */
const CENTRE_REGION = 6;

/** AI upper-left, Multi-Robot upper-right, Physical below — centres 150 apart,
 *  so the three-way intersection is a true equilateral core. */
const CIRCLES: Readonly<Record<PillarId, { readonly cx: number; readonly cy: number }>> = {
  0: { cx: 185, cy: 175 },
  1: { cx: 260, cy: 305 },
  2: { cx: 335, cy: 175 },
};

/** Where each pillar's name sits, inside its own exclusive lobe. */
const LABELS: Readonly<Record<PillarId, { readonly x: number; readonly y: number }>> = {
  0: { x: 122, y: 122 },
  1: { x: 260, y: 402 },
  2: { x: 398, y: 122 },
};

/** The three-way lens runs y 156..305 and is widest near its top, so the
 *  label sits above the midpoint to get the room it needs. */
const CENTRE = { x: 260, y: 203 };

function regionAt(x: number, y: number): ThemeId | undefined {
  const inside = PILLAR_IDS.filter((pillar) => {
    const circle = CIRCLES[pillar];
    const dx = x - circle.cx;
    const dy = y - circle.cy;
    return dx * dx + dy * dy <= R * R;
  });
  return inside.length === 0 ? undefined : themeForPillars(inside);
}

/** A region shape: clipped to every pillar it is in, masked out of the rest. */
function RegionFill({ ns, region, className }: { ns: string; region: ThemeId; className: string }) {
  const includes = themePillars(region);
  const excludes = PILLAR_IDS.filter((pillar) => !includes.includes(pillar));

  let node: ReactElement = <rect x="0" y="0" width={VIEW_W} height={VIEW_H} className={className} />;
  if (excludes.length > 0) {
    node = <g mask={`url(#${ns}-mask-${region})`}>{node}</g>;
  }
  for (const pillar of includes) {
    node = <g clipPath={`url(#${ns}-clip-${pillar})`}>{node}</g>;
  }
  return node;
}

interface PillarVennProps {
  selected: ThemeId;
  onSelect: (region: ThemeId) => void;
}

export function PillarVenn({ selected, onSelect }: PillarVennProps) {
  const ns = useId().replace(/:/g, '');
  const legendId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<ThemeId | undefined>(undefined);

  // The element box is locked to the viewBox aspect in CSS, so there is no
  // letterboxing to correct for and the mapping is a straight scale.
  const regionFromPointer = (point: { clientX: number; clientY: number }): ThemeId | undefined => {
    const svg = svgRef.current;
    if (!svg) return undefined;
    const box = svg.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) return undefined;
    return regionAt(
      ((point.clientX - box.left) / box.width) * VIEW_W,
      ((point.clientY - box.top) / box.height) * VIEW_H,
    );
  };

  const selectedPillars = themePillars(selected);

  return (
    <div className={styles.wrap}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className={styles.svg}
        aria-hidden="true"
        onPointerMove={(event) => setHovered(regionFromPointer(event))}
        onPointerLeave={() => setHovered(undefined)}
        onClick={(event) => {
          const region = regionFromPointer(event);
          if (region !== undefined) onSelect(region);
        }}
      >
        <defs>
          {PILLAR_IDS.map((pillar) => (
            <clipPath key={pillar} id={`${ns}-clip-${pillar}`}>
              <circle cx={CIRCLES[pillar].cx} cy={CIRCLES[pillar].cy} r={R} />
            </clipPath>
          ))}
          {themeIds().map((region) => {
            const includes = themePillars(region);
            const excludes = PILLAR_IDS.filter((pillar) => !includes.includes(pillar));
            if (excludes.length === 0) return null;
            return (
              <mask key={region} id={`${ns}-mask-${region}`}>
                <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="white" />
                {excludes.map((pillar) => (
                  <circle
                    key={pillar}
                    cx={CIRCLES[pillar].cx}
                    cy={CIRCLES[pillar].cy}
                    r={R}
                    fill="black"
                  />
                ))}
              </mask>
            );
          })}
        </defs>

        {themeIds().map((region) => (
          <RegionFill
            key={region}
            ns={ns}
            region={region}
            className={cx(
              styles.region,
              hovered === region && styles.regionHover,
              selected === region && styles.regionSelected,
            )}
          />
        ))}

        {PILLAR_IDS.map((pillar) => (
          <circle
            key={pillar}
            cx={CIRCLES[pillar].cx}
            cy={CIRCLES[pillar].cy}
            r={R}
            className={cx(styles.ring, selectedPillars.includes(pillar) && styles.ringActive)}
          />
        ))}

        {PILLAR_IDS.map((pillar) => (
          <text
            key={pillar}
            x={LABELS[pillar].x}
            y={LABELS[pillar].y}
            textAnchor="middle"
            className={cx(styles.label, selectedPillars.includes(pillar) && styles.labelActive)}
          >
            <tspan x={LABELS[pillar].x} className={styles.labelIndex}>
              PILLAR 0{pillar + 1}
            </tspan>
            <tspan x={LABELS[pillar].x} dy="20" className={styles.labelName}>
              {PILLAR_SHORT_NAMES[pillar]}
            </tspan>
          </text>
        ))}

        <text
          x={CENTRE.x}
          y={CENTRE.y}
          textAnchor="middle"
          className={cx(styles.centre, selected !== CENTRE_REGION && styles.centreDim)}
        >
          <tspan x={CENTRE.x} className={styles.centreName}>
            {RESEARCH_THEMES[CENTRE_REGION]}
          </tspan>
          <tspan x={CENTRE.x} dy="16" className={styles.centreNote}>
            at the intersection
          </tspan>
        </text>
      </svg>

      {/* The diagram takes pointer input only. This row is the keyboard and
          screen-reader interface, and doubles as the legend naming the four
          regions the circles cannot label in place. */}
      <div id={legendId} className={styles.legendLabel}>
        SELECT A REGION:
      </div>
      <div role="group" aria-labelledby={legendId} className={styles.legend}>
        {themeIds().map((region) => (
          <FilterPill
            key={region}
            label={RESEARCH_THEMES[region] ?? ''}
            active={selected === region}
            onToggle={() => onSelect(region)}
          />
        ))}
      </div>

      <p className={styles.key}>
        {PILLAR_IDS.map((pillar) => `0${pillar + 1} ${PILLARS[pillar]}`).join('  ·  ')}
      </p>
    </div>
  );
}
