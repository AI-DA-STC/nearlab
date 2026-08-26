/** Joins truthy class names. Keeps JSX free of nested ternaries. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
