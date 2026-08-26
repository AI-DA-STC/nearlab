/** The three rotating spotlights at the top of the home page. */
export interface FeaturedItem {
  readonly eyebrow: string;
  readonly title: string;
  readonly authors: string;
  readonly summary: string;
  readonly resources: readonly string[];
  readonly mediaCaption: string;
  readonly mediaAlt: string;
}

export const FEATURED: readonly FeaturedItem[] = [
  {
    eyebrow: 'MAR 2026 · ICRA 2026',
    title: 'Learning contact-rich handover between heterogeneous manipulators',
    authors: 'A. Rao, W. L. Ho, M. Chen (NUS)¹',
    summary:
      'Two arms with different kinematics and no shared controller pass a rigid part between them using force feedback alone. The policy was trained in simulation and transferred with a single calibration pass on hardware. It holds up across 12 part geometries we did not train on.',
    resources: ['pdf', 'arXiv', 'code', 'video'],
    mediaCaption: 'video loop — swarm handover trial, dual-arm cell',
    mediaAlt: 'Video loop placeholder showing a dual-arm handover trial in the lab cell',
  },
  {
    eyebrow: 'APR 2026 · IROS 2026',
    title: 'Navigating a smoke-filled corridor with event and LiDAR fusion',
    authors: 'M. Tan, W. L. Ho, K. Nakamura (NTU)³',
    summary:
      'Visual odometry fails within seconds of smoke ingress. Fusing an event camera with sparse LiDAR returns keeps the pose estimate usable for the length of a 120 m corridor. Built for inspection robots that have to keep moving when a room degrades.',
    resources: ['pdf', 'arXiv', 'code'],
    mediaCaption: 'video loop — smoke chamber run, event overlay',
    mediaAlt:
      'Video loop placeholder showing a robot traversing a smoke chamber with an event-camera overlay',
  },
  {
    eyebrow: 'FEB 2026 · LAB DEMO',
    title: 'Ten inspection robots holding formation on a dropped radio link',
    authors: 'W. L. Ho, M. Tan, L. Marchetti² (ETH Zürich)⁴',
    summary:
      'A decentralised allocation scheme that keeps a heterogeneous team working through 40% packet loss. Each robot re-plans locally against a stale belief rather than waiting for consensus. Demonstrated on ten platforms in an outdoor car park.',
    resources: ['video', 'code', 'bibtex'],
    mediaCaption: 'video loop — 10-robot car park trial, overhead view',
    mediaAlt:
      'Video loop placeholder showing ten robots holding formation in an outdoor car park, overhead view',
  },
];
