import type { ReactElement } from 'react';

/**
 * Motifs for the industry tiles.
 *
 * Line drawings rather than photographs, for the reason the banner art already
 * gives: the lab has very little usable footage, and a hand-drawn technical
 * motif reads as deliberate where a stock image reads as filler. Every piece
 * draws into the same 160x90 frame and paints in `currentColor`, so the card
 * can shift the whole motif on hover from CSS.
 *
 * A mission that later gains real footage sets `image` instead and the motif
 * drops out — see `MissionCard`.
 */
export type IndustryMotif = 'rubble' | 'orbit' | 'harbour' | 'tunnel' | 'shield';

const FRAME = {
  viewBox: '0 0 160 90',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** Collapsed slabs, with a drone holding station over them. */
function RubbleArt() {
  return (
    <svg {...FRAME} aria-hidden="true">
      <path d="M8 78h144" opacity="0.5" />
      <path d="M18 78 34 58l30 6-8 14z" opacity="0.85" />
      <path d="M56 78l14-22 26 10-4 12z" opacity="0.7" />
      <path d="M92 78l18-14 24 8-2 6z" opacity="0.85" />
      <path d="M40 64l22 4M74 60l18 8" opacity="0.4" />
      <circle cx="106" cy="26" r="4" opacity="0.9" />
      <path d="M99 22h-6M113 22h6" opacity="0.9" />
      <path d="M96 34a14 14 0 0 0 20 0" opacity="0.35" />
      <path d="M90 40a24 24 0 0 0 32 0" opacity="0.22" />
    </svg>
  );
}

/** A rover on a planetary limb, and the long link home. */
function OrbitArt() {
  return (
    <svg {...FRAME} aria-hidden="true">
      <path d="M4 84a76 40 0 0 1 152 0" opacity="0.55" />
      <ellipse cx="80" cy="46" rx="66" ry="26" opacity="0.28" strokeDasharray="4 7" />
      <rect x="62" y="62" width="22" height="11" rx="1.5" opacity="0.9" />
      <circle cx="67" cy="76" r="3.5" opacity="0.9" />
      <circle cx="79" cy="76" r="3.5" opacity="0.9" />
      <path d="M73 62V54" opacity="0.9" />
      <path d="M66 52h14" opacity="0.9" />
      <circle cx="139" cy="26" r="3" opacity="0.9" />
      <path d="M78 50 136 28" opacity="0.3" strokeDasharray="3 6" />
    </svg>
  );
}

/** Container stacks and a crane, with a surface and an aerial platform. */
function HarbourArt() {
  return (
    <svg {...FRAME} aria-hidden="true">
      <path d="M4 70h152" opacity="0.5" />
      <path d="M8 78c8-4 14 4 22 0s14 4 22 0 14 4 22 0 14 4 22 0 14 4 22 0 14 4 22 0" opacity="0.3" />
      <rect x="18" y="56" width="26" height="7" opacity="0.85" />
      <rect x="18" y="48" width="26" height="7" opacity="0.65" />
      <rect x="48" y="56" width="26" height="7" opacity="0.85" />
      <path d="M92 70V22h34" opacity="0.9" />
      <path d="M126 22v12" opacity="0.9" />
      <path d="M92 32h14" opacity="0.5" />
      <rect x="120" y="34" width="12" height="8" opacity="0.7" />
      <circle cx="60" cy="26" r="3.5" opacity="0.9" />
      <path d="M54 23h-5M66 23h5" opacity="0.9" />
    </svg>
  );
}

/** A bore receding to a vanishing point, with a robot at the mouth. */
function TunnelArt() {
  return (
    <svg {...FRAME} aria-hidden="true">
      <ellipse cx="80" cy="45" rx="54" ry="34" opacity="0.85" />
      <ellipse cx="80" cy="45" rx="38" ry="24" opacity="0.5" />
      <ellipse cx="80" cy="45" rx="23" ry="15" opacity="0.32" />
      <ellipse cx="80" cy="45" rx="10" ry="7" opacity="0.2" />
      <path d="M26 45h-18M134 45h18" opacity="0.3" />
      <rect x="46" y="62" width="18" height="10" rx="1.5" opacity="0.9" />
      <circle cx="51" cy="75" r="3" opacity="0.9" />
      <circle cx="60" cy="75" r="3" opacity="0.9" />
      <path d="M64 66h10" opacity="0.9" />
    </svg>
  );
}

/** A shield under a sweep, for the missions someone is already paying for. */
function ShieldArt() {
  return (
    <svg {...FRAME} aria-hidden="true">
      <path d="M80 14 118 26v22c0 18-16 30-38 38-22-8-38-20-38-38V26z" opacity="0.9" />
      <path d="M80 24 108 33v15c0 13-11 22-28 28-17-6-28-15-28-28V33z" opacity="0.28" />
      <path d="M56 48h48" opacity="0.4" strokeDasharray="3 5" />
      <path d="M60 60h40" opacity="0.3" strokeDasharray="3 5" />
      <path d="M8 34h26M126 34h26" opacity="0.25" />
      <path d="M8 56h20M132 56h20" opacity="0.25" />
    </svg>
  );
}

const MOTIFS: Record<IndustryMotif, () => ReactElement> = {
  rubble: RubbleArt,
  orbit: OrbitArt,
  harbour: HarbourArt,
  tunnel: TunnelArt,
  shield: ShieldArt,
};

export function IndustryArt({ motif }: { motif: IndustryMotif }) {
  const Art = MOTIFS[motif];
  return <Art />;
}
