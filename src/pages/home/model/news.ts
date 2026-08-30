/** The "Latest" rail beside the activity feed. */
export interface NewsItem {
  readonly date: string;
  readonly isNew: boolean;
  readonly text: string;
}

/** No announcements yet; the rail hides itself while this is empty. */
export const NEWS: readonly NewsItem[] = [];
