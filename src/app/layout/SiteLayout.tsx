import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import { keepsScroll } from '@/shared/config';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { MobileNavOverlay } from './MobileNavOverlay';

/**
 * The app-wide chrome every route renders inside. It lives in `app/` rather
 * than a widget because its scope is the whole application, and because it is
 * the layer allowed to compose freely from the ones below it.
 */
export function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, state } = useLocation();
  const navigationType = useNavigationType();

  // A route change should land at the top of the new page, and close the menu.
  // The exception is a page rewriting its own address in place, where the
  // reader stays put. Only the replacing navigation itself is exempt: the flag
  // lingers in that history entry, and coming Back to it later should still
  // start at the top.
  useEffect(() => {
    setMenuOpen(false);
    if (navigationType === 'REPLACE' && keepsScroll(state)) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <SiteHeader onOpenMenu={() => setMenuOpen(true)} />
      {menuOpen && <MobileNavOverlay onClose={() => setMenuOpen(false)} />}
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
