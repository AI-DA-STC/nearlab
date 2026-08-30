import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cx } from '@/shared/lib';

interface RevealProps {
  children: ReactNode;
  /** Renders as this element instead of a `div`, so no wrapper is introduced. */
  as?: ElementType;
  /** Stagger against the rest of the group, in milliseconds. */
  delay?: number;
  className?: string;
  [key: string]: unknown;
}

/**
 * Fades copy up as it arrives.
 *
 * A route change unmounts the previous page and mounts the next one, so the
 * animation replays on every navigation — clicking through to a section should
 * feel like the section arriving rather than snapping into place. The motion
 * itself lives in `global.css` as `.nl-reveal`; keyframes cannot be named from
 * a CSS module.
 *
 * Reduced motion is handled globally: with the animation off, the element sits
 * at its natural opacity rather than staying stuck at the `from` frame.
 */
export function Reveal({ children, as: Tag = 'div', delay = 0, className, ...rest }: RevealProps) {
  return (
    <Tag
      className={cx('nl-reveal', className)}
      style={delay ? ({ '--nl-reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
