/**
 * Cross-import surface for `entities/paper`.
 *
 * A paper belongs to a research theme, so `Paper` needs to name the id type.
 * Merging the two slices would produce a single publication-and-taxonomy god
 * slice, which is worse than this narrow, type-only seam — so per FSD's
 * entity cross-import guidance this is an intentional `@x` compromise.
 *
 * Deliberately exposes the *type only*: paper never reads the theme list or
 * its labels, so no runtime coupling is created.
 */
export type { ThemeId } from '../model/theme';
