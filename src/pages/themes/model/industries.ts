import type { IndustryMotif } from '../ui/industry-art';

/**
 * The industries the lab's research is pulled by.
 *
 * Page-local: nothing outside the themes page reads them, so promoting this to
 * an entity would be speculative. A tile is a picture and a name — the case for
 * each one is made by the rest of the page, not by copy on the tile.
 */
export interface Industry {
  /** Two-digit index, shown as a mono label. */
  readonly index: string;
  readonly title: string;
  /** Stands in until a photograph lands. */
  readonly motif: IndustryMotif;
  /** Artwork under `public/`, once one exists. The motif stands in until then.
   *  A `.mp4`/`.webm` source is rendered as a muted looping clip. */
  readonly image?: string;
  /** Still frame for a video `image`. */
  readonly poster?: string;
}

export const INDUSTRIES: readonly Industry[] = [
  { index: '01', title: 'Disaster response & search and rescue', motif: 'rubble' },
  { index: '02', title: 'Space & planetary teams', motif: 'orbit' },
  { index: '03', title: 'Maritime & ports', motif: 'harbour' },
  { index: '04', title: 'Critical infrastructure & industry', motif: 'tunnel' },
  { index: '05', title: 'Public safety & security', motif: 'shield' },
];
