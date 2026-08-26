/** The lab's chevron mark, reused as a pill tick and a list bullet. */
export function ArrowGlyph({
  width = 10,
  height = 7,
  fill = 'currentColor',
  className,
}: {
  width?: number;
  height?: number;
  fill?: string;
  className?: string;
}) {
  return (
    <svg viewBox="-16 0 116 70" width={width} height={height} aria-hidden="true" className={className}>
      <path
        d="M99 35 L32 2 Q24 -1 26 7 L48 33 Q49 35 48 37 L26 63 Q24 71 32 68 Z"
        fill={fill}
        stroke={fill}
        strokeWidth="8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
