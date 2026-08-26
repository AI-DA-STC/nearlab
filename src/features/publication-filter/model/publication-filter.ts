import { useCallback, useMemo, useState } from 'react';
import { themeIds, type ThemeId } from '@/entities/theme';

/**
 * The filtering interaction shared by the papers and blogs pages: a
 * multi-select theme filter, a single-select year filter, and a page size
 * that grows on "load more".
 *
 * Extracted here rather than duplicated per page because both pages use the
 * identical control set and reset semantics, and they change together.
 */

const PAGE_SIZE = 9;

/** Anything this feature can filter: it needs a theme and a year. */
export interface Publication {
  readonly themeId: ThemeId;
  readonly year: string;
}

export type YearFilter = string | 'all';

export interface PublicationFilter<T> {
  /** Items passing the current filters, truncated to the visible count. */
  visible: readonly T[];
  /** How many pass the filters, before truncation. */
  matchCount: number;
  totalCount: number;
  selectedThemes: readonly ThemeId[];
  selectedYear: YearFilter;
  /** Years present in the data, newest first. */
  years: readonly string[];
  isFiltered: boolean;
  isEmpty: boolean;
  hasMore: boolean;
  resultLine: string;
  toggleTheme: (id: ThemeId) => void;
  clearThemes: () => void;
  selectYear: (year: YearFilter) => void;
  loadMore: () => void;
  clearAll: () => void;
  countForTheme: (id: ThemeId) => number;
  countForYear: (year: YearFilter) => number;
}

/**
 * @param items    every publication of this kind
 * @param noun     plural noun for the result line, e.g. "papers"
 */
export function usePublicationFilter<T extends Publication>(
  items: readonly T[],
  noun: string,
): PublicationFilter<T> {
  const [selectedThemes, setSelectedThemes] = useState<readonly ThemeId[]>([]);
  const [selectedYear, setSelectedYear] = useState<YearFilter>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const years = useMemo(
    () => [...new Set(items.map((item) => item.year))].sort().reverse(),
    [items],
  );

  const matches = useMemo(
    () =>
      items.filter(
        (item) =>
          (selectedThemes.length === 0 || selectedThemes.includes(item.themeId)) &&
          (selectedYear === 'all' || item.year === selectedYear),
      ),
    [items, selectedThemes, selectedYear],
  );

  // Changing a filter always returns to the first page.
  const toggleTheme = useCallback((id: ThemeId) => {
    setSelectedThemes((current) =>
      current.includes(id) ? current.filter((themeId) => themeId !== id) : [...current, id],
    );
    setVisibleCount(PAGE_SIZE);
  }, []);

  const clearThemes = useCallback(() => {
    setSelectedThemes([]);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const selectYear = useCallback((year: YearFilter) => {
    setSelectedYear(year);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const clearAll = useCallback(() => {
    setSelectedThemes([]);
    setSelectedYear('all');
    setVisibleCount(PAGE_SIZE);
  }, []);

  const loadMore = useCallback(() => setVisibleCount((count) => count + PAGE_SIZE), []);

  const countForTheme = useCallback(
    (id: ThemeId) => items.filter((item) => item.themeId === id).length,
    [items],
  );

  const countForYear = useCallback(
    (year: YearFilter) =>
      year === 'all' ? items.length : items.filter((item) => item.year === year).length,
    [items],
  );

  return {
    visible: matches.slice(0, visibleCount),
    matchCount: matches.length,
    totalCount: items.length,
    selectedThemes,
    selectedYear,
    years,
    isFiltered: selectedThemes.length > 0 || selectedYear !== 'all',
    isEmpty: matches.length === 0,
    hasMore: matches.length > visibleCount,
    resultLine: `Showing ${Math.min(matches.length, visibleCount)} of ${items.length} ${noun}`,
    toggleTheme,
    clearThemes,
    selectYear,
    loadMore,
    clearAll,
    countForTheme,
    countForYear,
  };
}

/** Convenience: every theme id, for rendering the pill row. */
export const ALL_THEME_IDS = themeIds();
