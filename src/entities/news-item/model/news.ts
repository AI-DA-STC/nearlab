import folders from 'virtual:news-images';
import type { ResourceLink } from '@/shared/ui';

/**
 * Lab announcements. On the entities layer because two pages read them: the
 * home page lists them in its "Latest" rail, and each one has a page of its own
 * — a short write-up over a gallery of photos.
 */
export interface NewsImage {
  /** Path under `public/`. */
  readonly src: string;
  readonly alt: string;
  /** Pixel size, so the gallery can lay out its rows before the files arrive. */
  readonly width: number;
  readonly height: number;
}

export interface NewsItem {
  /** URL segment, and the item's stable identity. */
  readonly slug: string;
  /** ISO `YYYY-MM-DD`; the first day of an event that ran over several. The
   *  rail derives both its date column and the NEW marker from this, so
   *  neither can be left stale by hand. */
  readonly on: string;
  /** ISO `YYYY-MM-DD`, the last day of a multi-day event. */
  readonly until?: string;
  /** The headline, in the rail and on the item's page. */
  readonly title: string;
  /** The write-up on the item's page. */
  readonly description: string;
  /** The page's gallery, in display order. */
  readonly images: readonly NewsImage[];
  /** Coverage elsewhere — the event page, press, posts. */
  readonly links?: readonly ResourceLink[];
}

/** How long an announcement keeps its NEW marker. */
const NEW_WINDOW_DAYS = 45;
const DAY_MS = 24 * 60 * 60 * 1000;

export function isRecentNews(item: NewsItem, now: Date = new Date()): boolean {
  return now.getTime() - new Date(item.on).getTime() <= NEW_WINDOW_DAYS * DAY_MS;
}

const MONTHS = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');

function dateParts(iso: string) {
  const [year = '', month = '', day = ''] = iso.split('-');
  return { year, month: MONTHS[Number(month) - 1] ?? '', day: Number(day) };
}

/** `2026-10-03` reads as `3 Oct 2026`. A multi-day item names each end, and
 *  says the shared month or year once: `27 Sep – 1 Oct 2026`. */
export function newsDateLabel(item: NewsItem): string {
  const start = dateParts(item.on);
  if (!item.until) return `${start.day} ${start.month} ${start.year}`;

  const end = dateParts(item.until);
  if (start.year !== end.year) {
    return `${start.day} ${start.month} ${start.year} – ${end.day} ${end.month} ${end.year}`;
  }
  if (start.month !== end.month) {
    return `${start.day} ${start.month} – ${end.day} ${end.month} ${end.year}`;
  }
  return `${start.day}–${end.day} ${end.month} ${end.year}`;
}

/** What an entry below says about its photos: either a folder under
 *  `public/uploads/news/`, whose every photo is shown (add a file and it
 *  appears), or a fixed list for photos that live elsewhere. */
type NewsEntry = Omit<NewsItem, 'images'> &
  ({ readonly folder: string; readonly images?: never } | { readonly folder?: never; readonly images: readonly NewsImage[] });

function withImages({ folder, images, ...item }: NewsEntry): NewsItem {
  if (images) return { ...item, images };
  const found = folders[folder ?? ''] ?? [];
  return {
    ...item,
    images: found.map((photo, i) => ({ ...photo, alt: `${item.title}, photo ${i + 1} of ${found.length}` })),
  };
}

const ITEMS: readonly NewsEntry[] = [
  {
    slug: 'smu-zju-visit',
    on: '2026-10-08',
    title: 'SMU-ZJU visited NEAR Lab',
    description:
      'A group from the SMU-ZJU Doctor of Business Administration (Accounting and Finance) programme visited NEAR Lab on 8 October.',
    folder: 'SMU_ZJU_visit',
  },
  {
    slug: 'strike-vs-guard-cmu-nus',
    on: '2026-10-03',
    title: 'Strike vs Guard RCC project meeting with CMU AirLab and NUS MARMoT Lab',
    description:
      'Jiaying, Jeremy and William met Prof. Sebastian Scherer (CMU AirLab) and Prof. Guillaume Sartoretti (NUS MARMoT Lab) for the Strike vs Guard RCC project.',
    folder: 'strike_vs_guard',
  },
  {
    slug: 'iros-2026-pittsburgh',
    on: '2026-09-27',
    until: '2026-10-01',
    title: 'Two workshop papers at IROS 2026, Pittsburgh',
    description: 'Jiaying, Jeremy and William presented two workshop papers at IROS 2026 in Pittsburgh.',
    folder: 'iros26',
  },
  {
    slug: 'singapore-airshow-2026',
    on: '2026-02-11',
    title: 'NEAR Lab at the ST Engineering Innovation Showcase, Singapore Airshow 2026',
    description:
      'NEAR Lab members presented the embodied AI and swarm technologies that let fleets of robots, from aerial drones to robot dogs, operate as one team.',
    images: [
      {
        src: '/uploads/media/airshow.webp',
        alt: 'The NEAR Lab stand at the Singapore Airshow, with UAV and UGV platforms on show',
        width: 1600,
        height: 1200,
      },
    ],
  },
  {
    slug: 'dssg-robust-physical-ai',
    on: '2026-01-13',
    title: 'Robust Physical AI talk at DSSG, Google Developers Space',
    description:
      'William presented the Robust Physical AI talk at DSSG, hosted at Google Developers Space Singapore.',
    images: [
      {
        src: '/uploads/media/dssg.webp',
        alt: 'William presenting to a full room at Developer Space @ Google Singapore',
        width: 800,
        height: 600,
      },
    ],
    links: [
      { label: 'Event', href: 'https://luma.com/thdjuruz' },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/feed/update/urn:li:activity:7420330486691987457/',
      },
    ],
  },
  {
    slug: 'innotech-2025',
    on: '2025-09-04',
    title: 'Physical AI booth at ST Engineering InnoTech Conference 2025',
    description:
      "William (NEAR Lab lead, second from right) presented MUMTOS and the lab's Physical AI work to Josephine Teo, Minister for Digital Development and Information (first from right), at ST Engineering's InnoTech Conference.",
    images: [
      {
        src: '/uploads/media/innotech.webp',
        alt: "William presenting MUMTOS and Physical AI development to Minister Josephine Teo at ST Engineering's InnoTech Conference",
        width: 960,
        height: 655,
      },
    ],
    links: [
      { label: 'CNA', href: 'https://www.youtube.com/watch?v=u_x1grGOOJw' },
      {
        label: 'The Business Times',
        href: 'https://www.businesstimes.com.sg/companies-markets/st-engineering-will-invest-s250-million-drive-robotics-solutions-complex-challenges',
      },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/posts/josephine-teo-ylm_aibilingualism-ai-digitaltransformation-activity-7369557402813198343-OaF9/',
      },
    ],
  },
];

/** Newest first; ISO dates compare correctly as text. */
export const NEWS: readonly NewsItem[] = ITEMS.map(withImages).sort((a, b) => b.on.localeCompare(a.on));

export function newsBySlug(slug: string | undefined): NewsItem | undefined {
  return NEWS.find((item) => item.slug === slug);
}
