import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
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
  const { pathname } = useLocation();

  // A route change should land at the top of the new page, and close the menu.
  useEffect(() => {
    setMenuOpen(false);
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
