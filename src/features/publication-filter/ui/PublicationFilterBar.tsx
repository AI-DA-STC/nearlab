import { useId } from 'react';
import { FilterPill } from '@/shared/ui';
import { RESEARCH_THEMES } from '@/entities/theme';
import { ALL_THEME_IDS, type Publication, type PublicationFilter } from '../model/publication-filter';
import styles from './PublicationFilterBar.module.css';

interface PublicationFilterBarProps<T extends Publication> {
  filter: PublicationFilter<T>;
}

/** Theme pills, year pills, live result count and a clear control. */
export function PublicationFilterBar<T extends Publication>({
  filter,
}: PublicationFilterBarProps<T>) {
  const themeLabelId = useId();
  const yearLabelId = useId();

  return (
    <div className={styles.bar}>
      <div>
        <div id={themeLabelId} className={styles.groupLabel}>
          FILTER BY THEME:
        </div>
        <div role="group" aria-labelledby={themeLabelId} className={styles.pills}>
          <FilterPill
            label="All"
            count={filter.totalCount}
            active={filter.selectedThemes.length === 0}
            onToggle={filter.clearThemes}
          />
          {ALL_THEME_IDS.map((id) => (
            <FilterPill
              key={id}
              label={RESEARCH_THEMES[id] ?? ''}
              count={filter.countForTheme(id)}
              active={filter.selectedThemes.includes(id)}
              onToggle={() => filter.toggleTheme(id)}
            />
          ))}
        </div>
      </div>

      <div>
        <div id={yearLabelId} className={styles.groupLabel}>
          FILTER BY YEAR:
        </div>
        <div role="group" aria-labelledby={yearLabelId} className={styles.pills}>
          <FilterPill
            label="All"
            count={filter.countForYear('all')}
            active={filter.selectedYear === 'all'}
            onToggle={() => filter.selectYear('all')}
          />
          {filter.years.map((year) => (
            <FilterPill
              key={year}
              label={year}
              count={filter.countForYear(year)}
              active={filter.selectedYear === year}
              onToggle={() => filter.selectYear(year)}
            />
          ))}
        </div>
      </div>

      <div className={styles.summary}>
        <span aria-live="polite" className={styles.resultLine}>
          {filter.resultLine}
        </span>
        {filter.isFiltered && (
          <button type="button" onClick={filter.clearAll} className={styles.clear}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
