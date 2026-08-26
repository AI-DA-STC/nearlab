/** The three ways to work with the lab, and the partner logo wall. */

export interface CollaborationRoute {
  readonly eyebrow: string;
  readonly title: string;
  /** Alternating card tint from the design. */
  readonly tinted: boolean;
  readonly points: readonly string[];
  readonly linkLabel: string;
  readonly href: string;
  /** Whether to offer the lab's inbox as a second action. */
  readonly showEmail: boolean;
}

export const COLLABORATION_ROUTES: readonly CollaborationRoute[] = [
  {
    eyebrow: 'Route 01',
    title: 'University collaborations',
    tinted: false,
    points: [
      'TRL 1–3 research to push the frontiers of robotics & AI.',
      'We research, develop and publish jointly.',
      'Currently collaborating with NUS, NTU, UPenn, CMU, CTU.',
    ],
    linkLabel: 'How a collaboration starts →',
    href: '#',
    showEmail: true,
  },
  {
    eyebrow: 'Route 02',
    title: 'Startup partnerships',
    tinted: true,
    points: [
      'Joint builds where you own the product and we own the research question.',
      'Access to our lab and robots.',
      'Best fit at TRL 3–5 with a working prototype already in hand.',
    ],
    linkLabel: 'What we look for in a partner →',
    href: '#',
    showEmail: true,
  },
  {
    eyebrow: 'Route 03',
    title: 'Internships & research staff',
    tinted: false,
    points: [
      'Three-month / six-month internships, supervised by our technical staff.',
      'Opportunity to convert to a full-time role based on performance.',
      'Contract / non-contract full-time roles, based in Singapore.',
    ],
    linkLabel: 'Open positions →',
    href: '#open-positions',
    showEmail: false,
  },
];

export interface Partner {
  readonly name: string;
  /** Path under `public/`. */
  readonly logo: string;
}

export const PARTNERS: readonly Partner[] = [
  { name: 'National University of Singapore', logo: '/uploads/NUS.png' },
  { name: 'Nanyang Technological University', logo: '/uploads/NTU.png' },
  { name: 'University of Pennsylvania', logo: '/uploads/Upenn.png' },
  { name: 'Carnegie Mellon University', logo: '/uploads/CMU.png' },
  { name: 'Czech Technical University in Prague', logo: '/uploads/CTU.gif' },
  { name: 'HTX', logo: '/uploads/HTX.png' },
  { name: 'F4F', logo: '/uploads/F4F.png' },
];

export interface Job {
  readonly postedOn: string;
  readonly meta: string;
  readonly title: string;
  readonly description: string;
}

/**
 * Open roles. The design ships with the "no open positions" state shown, so
 * this list is intentionally empty — populating it renders the listings.
 */
export const OPEN_JOBS: readonly Job[] = [];
