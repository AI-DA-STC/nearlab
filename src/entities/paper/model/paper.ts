import type { ThemeId } from '@/entities/theme/@x/paper';

/**
 * Peer-reviewed output. Lives on the entities layer because two pages consume
 * it: the papers page lists it, and the themes page counts it per theme.
 */
export interface Paper {
  readonly title: string;
  readonly venue: string;
  readonly year: string;
  readonly authors: string;
  readonly publishedOn: string;
  readonly themeId: ThemeId;
  /** Resource links shown beneath the card. */
  readonly resources: readonly string[];
  /** Caption for the figure that will illustrate the card. */
  readonly figure: string;
}

export const PAPERS: readonly Paper[] = [
  {
    title: 'Learning contact-rich handover between heterogeneous manipulators',
    venue: 'ICRA 2026',
    year: '2026',
    authors: 'A. Rao, W. L. Ho, M. Chen (NUS)¹',
    publishedOn: '12 Mar 2026',
    themeId: 3,
    resources: ['pdf', 'arXiv', 'code', 'video', 'bibtex'],
    figure: 'figure 4 — handover trial, 12 runs',
  },
  {
    title: 'Tactile pre-training for dexterous inspection of curved surfaces',
    venue: 'RSS 2026',
    year: '2026',
    authors: 'P. Venkatesan, F. Idris², S. Lim',
    publishedOn: '02 Feb 2026',
    themeId: 3,
    resources: ['pdf', 'arXiv', 'bibtex'],
    figure: 'gif — weld-seam tracing, 3× speed',
  },
  {
    title: 'Degraded-visual-environment navigation with event–LiDAR fusion',
    venue: 'IROS 2026',
    year: '2026',
    authors: 'M. Tan, W. L. Ho, K. Nakamura (NTU)³',
    publishedOn: '22 Apr 2026',
    themeId: 1,
    resources: ['pdf', 'arXiv', 'code', 'bibtex'],
    figure: 'figure 2 — smoke chamber, event overlay',
  },
  {
    title: 'Thermal-inertial odometry for smoke-filled indoor spaces',
    venue: 'IROS 2026',
    year: '2026',
    authors: 'M. Tan, D. Ng',
    publishedOn: '22 Apr 2026',
    themeId: 1,
    resources: ['pdf', 'code', 'bibtex'],
    figure: 'figure 6 — drift over 120 m corridor',
  },
  {
    title: 'Radar-only local planning for dust-degraded quarry sites',
    venue: 'RA-L 2026',
    year: '2026',
    authors: 'W. L. Ho, L. Marchetti² (ETH Zürich)⁴',
    publishedOn: '18 Jan 2026',
    themeId: 1,
    resources: ['pdf', 'arXiv', 'bibtex'],
    figure: 'figure 3 — quarry trial route',
  },
  {
    title: 'Quantised policy inference on 5 W embedded accelerators',
    venue: 'ICRA 2026',
    year: '2026',
    authors: 'D. Ng, C. Yuxuan²',
    publishedOn: '12 Mar 2026',
    themeId: 5,
    resources: ['pdf', 'code', 'bibtex'],
    figure: 'figure 1 — latency vs. power envelope',
  },
  {
    title: 'Shared autonomy for remote inspection with intermittent supervision',
    venue: 'HRI 2026',
    year: '2026',
    authors: 'P. Venkatesan, N. A. Rahman, S. Lim',
    publishedOn: '09 Mar 2026',
    themeId: 4,
    resources: ['pdf', 'arXiv', 'video', 'bibtex'],
    figure: 'figure 5 — operator handover timeline',
  },
  {
    title: 'Vision–language grounding for maintenance inspection under partial observability',
    venue: 'CoRL 2025',
    year: '2025',
    authors: 'P. Venkatesan, A. Rao, J. Loh (SUTD)⁵',
    publishedOn: '04 Nov 2025',
    themeId: 0,
    resources: ['pdf', 'arXiv', 'code', 'bibtex'],
    figure: 'figure 3 — grounded inspection prompts',
  },
  {
    title: 'Foundation-model priors for long-horizon manipulation planning',
    venue: 'NeurIPS 2025',
    year: '2025',
    authors: 'A. Rao, S. Lim',
    publishedOn: '11 Dec 2025',
    themeId: 0,
    resources: ['pdf', 'arXiv', 'bibtex'],
    figure: 'figure 7 — plan-length ablation',
  },
  {
    title: 'Instruction-following manipulation with sparse human correction',
    venue: 'CoRL 2025',
    year: '2025',
    authors: 'P. Venkatesan, T. Jing Wen²',
    publishedOn: '06 Nov 2025',
    themeId: 0,
    resources: ['pdf', 'code', 'bibtex'],
    figure: 'gif — correction rollout, 8 episodes',
  },
  {
    title: 'Decentralised task allocation for heterogeneous inspection swarms',
    venue: 'ICRA 2025',
    year: '2025',
    authors: 'W. L. Ho, S. Lim, R. Iyer (NUS)¹',
    publishedOn: '18 Feb 2025',
    themeId: 2,
    resources: ['pdf', 'arXiv', 'code', 'bibtex'],
    figure: 'figure 2 — allocation under link loss',
  },
  {
    title: 'Communication-aware formation keeping under intermittent links',
    venue: 'RA-L 2025',
    year: '2025',
    authors: 'W. L. Ho, M. Tan',
    publishedOn: '30 Sep 2025',
    themeId: 2,
    resources: ['pdf', 'arXiv', 'bibtex'],
    figure: 'figure 4 — formation error, 10 agents',
  },
  {
    title: 'Domain randomisation limits in sim-to-real contact estimation',
    venue: 'IROS 2025',
    year: '2025',
    authors: 'A. Rao, D. Ng',
    publishedOn: '15 Oct 2025',
    themeId: 6,
    resources: ['pdf', 'code', 'bibtex'],
    figure: 'figure 1 — sim vs. real force traces',
  },
  {
    title: 'Runtime monitors for learned perception in industrial safety cases',
    venue: 'SafeComp 2024',
    year: '2024',
    authors: 'S. Lim, N. A. Rahman',
    publishedOn: '08 Sep 2024',
    themeId: 7,
    resources: ['pdf', 'bibtex'],
    figure: 'figure 2 — monitor trip conditions',
  },
];
