import { prefersReducedMotion } from './motion';

/**
 * In-page `#id` navigation.
 *
 * The site is on a hash router, so a bare `href="#open-positions"` does not
 * scroll — the browser hands the whole hash to the router, which reads it as a
 * route and navigates off the page. Links that target a heading on the current
 * page therefore have to scroll themselves and swallow the default.
 */
export function isInPageAnchor(href: string): boolean {
  return href.startsWith('#') && href.length > 1;
}

/** Scrolls to `#id`, returning false if no such element is on the page. */
export function scrollToAnchor(href: string): boolean {
  if (!isInPageAnchor(href)) return false;

  const target = document.getElementById(href.slice(1));
  if (!target) return false;

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });

  // Move focus with the viewport so the jump is not silent for keyboard and
  // screen-reader users. Headings are not focusable by default.
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });

  return true;
}
