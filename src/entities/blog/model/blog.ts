import type { ThemeId } from '@/entities/theme/@x/blog';

/**
 * Working notes from the lab. On the entities layer for the same reason as
 * `Paper`: the blogs page lists it, the themes page counts it per theme.
 */
export interface Blog {
  readonly title: string;
  readonly excerpt: string;
  readonly publishedOn: string;
  readonly year: string;
  readonly readingTime: string;
  readonly themeId: ThemeId;
  readonly author: string;
  readonly image?: string;
  readonly figure: string;
}

/** Nothing published yet. The blogs page renders its empty state from this. */
export const BLOGS: readonly Blog[] = [];
