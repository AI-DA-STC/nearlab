/** The three ways to work with the lab, and the partner logo wall. */

export interface CollaborationRoute {
  readonly eyebrow: string;
  readonly title: string;
  readonly points: readonly string[];
  readonly linkLabel: string;
  /** Either a URL, or `#id` for a heading further down this page. */
  readonly href: string;
  /** Whether to offer the lab's inbox as a second action. */
  readonly showEmail: boolean;
}

export const COLLABORATION_ROUTES: readonly CollaborationRoute[] = [
  {
    eyebrow: 'Route 01',
    title: 'University collaborations',
    points: [
      'TRL 1–3 research to push the frontiers of robotics & AI.',
      'We research, develop and publish jointly.',
      'Currently collaborating with NUS, NTU, UPenn, CMU, CTU.',
    ],
    linkLabel: 'How a collaboration starts →',
    href: '#what-we-look-for',
    showEmail: true,
  },
  {
    eyebrow: 'Route 02',
    title: 'Startup partnerships',
    points: [
      'Joint builds where you own the product and we own the research question.',
      'Access to our lab and robots.',
      'Best fit at TRL 3–5 with a working prototype already in hand.',
    ],
    linkLabel: 'What we look for in a partner →',
    href: '#what-we-look-for',
    showEmail: true,
  },
  {
    eyebrow: 'Route 03',
    title: 'Internships & research staff',
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
  { name: 'National University of Singapore', logo: '/uploads/join/nus.png' },
  { name: 'Nanyang Technological University', logo: '/uploads/join/ntu.png' },
  { name: 'University of Pennsylvania', logo: '/uploads/join/upenn.png' },
  { name: 'Carnegie Mellon University', logo: '/uploads/join/cmu.png' },
  { name: 'Czech Technical University in Prague', logo: '/uploads/join/ctu.gif' },
  { name: 'HTX', logo: '/uploads/join/htx.png' },
  { name: 'F4F', logo: '/uploads/join/f4f.png' },
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
