/** The "Latest" rail beside the activity feed. */
export interface NewsItem {
  readonly date: string;
  readonly isNew: boolean;
  readonly text: string;
}

export const NEWS: readonly NewsItem[] = [
  {
    date: '18 MAY 2026',
    isNew: true,
    text: 'Arjun Rao heads to ICRA 2026 in Vienna in June to present "Learning contact-rich handover between heterogeneous manipulators."',
  },
  {
    date: '06 MAY 2026',
    isNew: false,
    text: 'NEAR Lab and NTU begin a two-year collaboration on tactile sensing for dexterous inspection.',
  },
  {
    date: '22 APR 2026',
    isNew: false,
    text: 'Two papers accepted at IROS 2026 on degraded-visual-environment navigation.',
  },
  {
    date: '09 APR 2026',
    isNew: false,
    text: 'Applications open for the Sep 2026 research internship cohort.',
  },
  {
    date: '27 MAR 2026',
    isNew: false,
    text: "Wei Ling Ho presents NEAR Lab's sim-to-real transfer work at the Singapore Robotics Symposium.",
  },
];
