import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** One-shot read, for imperative code that only needs the current answer. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(QUERY).matches;
}

/**
 * Reactive version, for anything CSS cannot switch off on its own — video
 * playback, most notably. The global reduced-motion rule in `global.css`
 * handles everything that is a CSS animation or transition.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return reduced;
}
