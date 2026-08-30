import type { ReactElement } from 'react';
import styles from './SectionBanner.module.css';

/**
 * Generated banner artwork.
 *
 * These are line drawings rather than photographs on purpose: the lab has one
 * usable photo, and a hand-drawn technical motif reads as deliberate where a
 * stock image reads as filler. Every piece is deterministic, monochrome in the
 * brand navy, and sits behind a scrim, so it never competes with the headline.
 *
 * Each motif draws into the same 1600x460 frame and is slice-cropped by the
 * banner, so keep the load-bearing geometry away from the outer edges.
 */
export type BannerMotif = 'mesh' | 'papers' | 'notes' | 'roster' | 'routes';

const VIEW_BOX = '0 0 1600 460';

/** Shared substrate: the hairline dot grid and the corner falloff. */
function Substrate({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern id={`${id}-dots`} width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#8fadc8" opacity="0.34" />
        </pattern>
        <radialGradient id={`${id}-glow`} cx="0.68" cy="0.34" r="0.62">
          <stop offset="0%" stopColor="#3f7fb5" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#3f7fb5" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="460" fill={`url(#${id}-dots)`} />
      <rect width="1600" height="460" fill={`url(#${id}-glow)`} />
    </>
  );
}

/* ---------------------------------------------------------------- mesh ---- */

/** Research themes: eight anchor nodes in one connected web of enquiry. */
const MESH_NODES: ReadonlyArray<readonly [number, number, number]> = [
  [150, 322, 7],
  [318, 148, 5],
  [446, 330, 9],
  [610, 196, 6],
  [742, 356, 5],
  [880, 168, 9],
  [1010, 318, 6],
  [1168, 214, 7],
  [1288, 366, 5],
  [1420, 190, 9],
  [1536, 320, 6],
];

const MESH_EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [4, 5],
  [4, 6],
  [5, 6],
  [5, 7],
  [6, 7],
  [6, 8],
  [7, 8],
  [7, 9],
  [8, 9],
  [8, 10],
  [9, 10],
  [1, 5],
  [3, 7],
  [5, 9],
];

/** Edge indices resolved to coordinates once, so the drawing stays declarative. */
const MESH_LINES = MESH_EDGES.flatMap(([from, to]) => {
  const a = MESH_NODES[from];
  const b = MESH_NODES[to];
  return a && b ? [{ key: `${from}-${to}`, x1: a[0], y1: a[1], x2: b[0], y2: b[1] }] : [];
});

function MeshArt() {
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid slice" className={styles.art} aria-hidden="true">
      <Substrate id="mesh" />

      {/* Edges first so nodes cap them cleanly. */}
      <g stroke="#8fadc8" strokeWidth="1.25" opacity="0.5">
        {MESH_LINES.map(({ key, ...line }) => (
          <line key={key} {...line} />
        ))}
      </g>

      {/* Influence rings on the three widest nodes. */}
      <g stroke="#8fadc8" fill="none" opacity="0.24">
        {MESH_NODES.filter((node) => node[2] === 9).map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="34" />
            <circle cx={x} cy={y} r="58" strokeDasharray="3 7" />
          </g>
        ))}
      </g>

      <g>
        {MESH_NODES.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#dce6ef" opacity={r === 9 ? 0.9 : 0.6} />
        ))}
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------- papers ---- */

/** Papers: a stack of sheets alongside the figure they argue from. */
function PapersArt() {
  const sheet = (dx: number, dy: number, opacity: number) => (
    <g key={`${dx}-${dy}`} transform={`translate(${dx} ${dy})`} opacity={opacity}>
      <rect x="1046" y="66" width="286" height="368" rx="4" fill="#0e2438" stroke="#8fadc8" strokeWidth="1.25" />
      {/* Abstracted body copy: a title rule, then paragraph rules. */}
      <rect x="1078" y="104" width="150" height="7" rx="3.5" fill="#dce6ef" opacity="0.7" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
        <rect
          key={row}
          x="1078"
          y={136 + row * 20}
          width={row % 3 === 2 ? 154 : 222}
          height="3"
          rx="1.5"
          fill="#8fadc8"
          opacity="0.5"
        />
      ))}
      <rect x="1078" y="330" width="222" height="72" rx="2" fill="#8fadc8" opacity="0.16" />
    </g>
  );

  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid slice" className={styles.art} aria-hidden="true">
      <Substrate id="papers" />

      {/* Results panel: axes, gridlines, and two series. */}
      <g transform="translate(150 0)">
        <g stroke="#8fadc8" opacity="0.22">
          {[0, 1, 2, 3, 4].map((row) => (
            <line key={row} x1="120" y1={110 + row * 66} x2="700" y2={110 + row * 66} />
          ))}
        </g>
        <g stroke="#8fadc8" strokeWidth="1.5" opacity="0.65">
          <line x1="120" y1="86" x2="120" y2="398" />
          <line x1="120" y1="398" x2="700" y2="398" />
        </g>
        <path
          d="M120 372 C 214 356 250 268 330 246 C 410 224 452 176 540 158 C 610 144 654 132 700 128"
          fill="none"
          stroke="#dce6ef"
          strokeWidth="2.5"
          opacity="0.92"
        />
        <path
          d="M120 384 C 220 378 258 342 344 328 C 430 314 470 286 552 274 C 622 264 660 258 700 254"
          fill="none"
          stroke="#8fadc8"
          strokeWidth="2"
          strokeDasharray="7 6"
          opacity="0.7"
        />
        <g fill="#dce6ef" opacity="0.9">
          {[
            [330, 246],
            [540, 158],
            [700, 128],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="4.5" />
          ))}
        </g>
      </g>

      {sheet(56, 26, 0.34)}
      {sheet(28, 13, 0.6)}
      {sheet(0, 0, 1)}
    </svg>
  );
}

/* --------------------------------------------------------------- notes ---- */

/** Blogs: ruled working notes, an annotation bracket, and a run's telemetry. */
function NotesArt() {
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid slice" className={styles.art} aria-hidden="true">
      <Substrate id="notes" />

      {/* Ruled lines run the full width as texture — faint enough to sit behind
          the headline. Everything brighter stays right of the copy. */}
      <g stroke="#8fadc8" opacity="0.24">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
          <line key={row} x1="120" y1={92 + row * 34} x2="1500" y2={92 + row * 34} />
        ))}
      </g>

      {/* The written column: a margin rule and blocks of abstracted prose,
          ragged-right the way real copy sets. */}
      <line x1="782" y1="72" x2="782" y2="410" stroke="#8fadc8" strokeWidth="1.5" opacity="0.5" />
      <g fill="#8fadc8" opacity="0.52">
        {[268, 335, 246, 310, 196].map((width, row) => (
          <rect key={row} x="820" y={110 + row * 34} width={width} height="4" rx="2" />
        ))}
        {[320, 252, 300].map((width, row) => (
          <rect key={`b${row}`} x="820" y={314 + row * 34} width={width} height="4" rx="2" />
        ))}
      </g>

      {/* Annotation bracket, marking the passage the figure belongs to. */}
      <path d="M1216 176 h -22 v 96 h 22" fill="none" stroke="#dce6ef" strokeWidth="2" opacity="0.8" />
      <line x1="1194" y1="224" x2="1140" y2="224" stroke="#dce6ef" strokeWidth="2" opacity="0.8" />

      {/* Telemetry from the run being written up: noisy, and it does not settle. */}
      <path
        d="M1252 300 L 1282 252 L 1308 288 L 1336 190 L 1364 244 L 1392 164 L 1420 214
           L 1448 138 L 1476 186 L 1504 150 L 1532 206 L 1560 158"
        fill="none"
        stroke="#dce6ef"
        strokeWidth="2.25"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <line x1="1252" y1="336" x2="1568" y2="336" stroke="#8fadc8" strokeWidth="1.5" opacity="0.55" />
      <g fill="#dce6ef" opacity="0.6">
        {(
          [
            [1336, 190],
            [1392, 164],
            [1448, 138],
            [1504, 150],
          ] as const
        ).map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="4" />
        ))}
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------- roster ---- */

/** People: the roster grid, used when the team photograph is unavailable. */
function RosterArt() {
  const columns = 11;
  const rows = 3;
  // A fixed scatter of "filled" seats — deterministic, so the art never shifts.
  const filled = new Set([1, 4, 5, 9, 13, 16, 20, 23, 25, 28, 30]);

  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid slice" className={styles.art} aria-hidden="true">
      <Substrate id="roster" />
      <g transform="translate(150 74)">
        {Array.from({ length: rows * columns }, (_, index) => {
          const x = (index % columns) * 118;
          const y = Math.floor(index / columns) * 108;
          const isFilled = filled.has(index);
          return (
            <g key={index} transform={`translate(${x} ${y})`} opacity={isFilled ? 0.92 : 0.42}>
              <circle
                cx="34"
                cy="30"
                r="19"
                fill={isFilled ? '#dce6ef' : 'none'}
                stroke="#8fadc8"
                strokeWidth="1.5"
              />
              <path
                d="M6 84 a 28 30 0 0 1 56 0"
                fill={isFilled ? '#dce6ef' : 'none'}
                stroke="#8fadc8"
                strokeWidth="1.5"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------- routes ---- */

/** Join: three ways in, converging on one lab. */
const ROUTE_PATHS = [
  'M96 122 C 420 122 560 196 820 230 C 1050 260 1180 232 1372 230',
  'M96 230 C 420 230 620 230 820 230 C 1050 230 1180 230 1372 230',
  'M96 350 C 420 350 560 268 820 230 C 1050 200 1180 228 1372 230',
] as const;

function RoutesArt() {
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid slice" className={styles.art} aria-hidden="true">
      <Substrate id="routes" />

      <g fill="none" stroke="#8fadc8" strokeWidth="2" opacity="0.62">
        {ROUTE_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* Waypoints on each route. */}
      <g fill="#dce6ef" opacity="0.68">
        {[122, 230, 350].map((y) => (
          <circle key={y} cx="96" cy={y} r="6" />
        ))}
        {[
          [300, 122],
          [300, 230],
          [300, 350],
          [560, 152],
          [560, 230],
          [560, 320],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="4" />
        ))}
      </g>

      {/* The lab: the single node all three arrive at. */}
      <circle cx="820" cy="230" r="13" fill="#dce6ef" />
      <g fill="none" stroke="#8fadc8" opacity="0.34">
        <circle cx="820" cy="230" r="42" />
        <circle cx="820" cy="230" r="76" strokeDasharray="4 8" />
        <circle cx="820" cy="230" r="112" strokeDasharray="2 12" />
      </g>

      {/* And out the other side — the shared output. */}
      <path
        d="M1372 230 h 108"
        stroke="#dce6ef"
        strokeWidth="2.5"
        opacity="0.9"
      />
      <path d="M1480 230 l -16 -9 v 18 z" fill="#dce6ef" opacity="0.9" />
    </svg>
  );
}

const MOTIFS: Record<BannerMotif, () => ReactElement> = {
  mesh: MeshArt,
  papers: PapersArt,
  notes: NotesArt,
  roster: RosterArt,
  routes: RoutesArt,
};

export function BannerArt({ motif }: { motif: BannerMotif }) {
  const Art = MOTIFS[motif];
  return <Art />;
}
